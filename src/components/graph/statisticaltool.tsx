import React, { useState, useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Univer Core & Direct Injection Services
import { 
  Univer, 
  LocaleType, 
  Tools, 
  UniverInstanceType,
  ICommandService,
  IUniverInstanceService
} from '@univerjs/core';
import { defaultTheme } from '@univerjs/themes';

// Render Engine
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';

// UI Plugins
import { UniverUIPlugin } from '@univerjs/ui';

// Document plugins
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';

// Sheet plugins
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';

// Styles
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';

// Locale imports
import enUS from '@univerjs/ui/locale/en-US';
import sheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
import docsUIEnUS from '@univerjs/docs-ui/locale/en-US';
import designEnUS from '@univerjs/design/locale/en-US';

const locales = {
  [LocaleType.EN_US]: Tools.deepMerge({}, designEnUS, enUS, docsUIEnUS, sheetsUIEnUS),
};

// ============================================
// TYPES & STORES
// ============================================

interface UIStore {
  activeView: 'data' | 'charts';
  isLoading: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  results: any | null;
  testType: string | null;
  setActiveView: (view: 'data' | 'charts') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  setResults: (results: any, testType?: string) => void;
  clearResults: () => void;
}

const useUIStore = create<UIStore>((set) => ({
  activeView: 'data',
  isLoading: false,
  error: null,
  notification: null,
  results: null,
  testType: null,
  setActiveView: (view) => set({ activeView: view }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setNotification: (notification) => set({ notification }),
  setResults: (results, testType) => set({ results, testType: testType || 'Unknown Test' }),
  clearResults: () => set({ results: null, error: null, testType: null }),
}));

// ============================================
// STATS ENGINE
// ============================================

const API_BASE = 'http://localhost:8000/api';

class StatsEngine {
  private abortController: AbortController | null = null;

  async cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private async request<T>(endpoint: string, body: any): Promise<T> {
    this.cancel();
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${API_BASE}/stats/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Analysis failed');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error('Analysis cancelled');
      }
      throw err;
    } finally {
      this.abortController = null;
    }
  }

  async ttest(columns: Record<string, number[]>, paired: boolean = false) {
    return this.request('ttest', { columns, paired });
  }

  async anova(columns: Record<string, number[]>) {
    return this.request('anova', { columns });
  }

  async correlation(columns: Record<string, number[]>) {
    return this.request('correlation', { columns });
  }

  async regression(columns: Record<string, number[]>) {
    const keys = Object.keys(columns);
    if (keys.length !== 2) {
      throw new Error('Regression requires exactly 2 columns');
    }
    return this.request('regression', { columns });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

const statsEngine = new StatsEngine();

// ============================================
// CORE DATA HANDLERS (CQRS / NO FACADE)
// ============================================

const batchLoadData = (univer: any, workbookId: string, worksheetId: string, data: any[][]): boolean => {
  if (!univer || data.length === 0) return false;

  try {
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);

    const rows = data.length;
    const cols = data[0].length;
    
    // Construct the strict Univer CellMatrix format
    const cellValue: Record<number, Record<number, { v: any }>> = {};
    
    for (let r = 0; r < rows; r++) {
      cellValue[r] = {};
      for (let c = 0; c < cols; c++) {
        const val = data[r][c];
        if (val !== undefined && val !== null && val !== '') {
            const num = Number(val);
            cellValue[r][c] = { 
              v: Number.isFinite(num) && !isNaN(num) ? num : String(val) 
            };
        }
      }
    }

    // Dispatch the mutation command directly to the engine to trigger UI sync
    commandService.executeCommand('sheet.command.set-range-values', {
      unitId: workbookId,
      subUnitId: worksheetId,
      range: {
        startRow: 0,
        endRow: rows - 1,
        startColumn: 0,
        endColumn: cols - 1,
      },
      value: cellValue,
    });

    return true;
  } catch (err) {
    console.error('Failed to load via CommandService:', err);
    return false;
  }
};

const getNumericColumns = (univer: any, workbookId: string, worksheetId: string, skipHeaderRow: boolean = true): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  if (!univer) return result;

  try {
    const injector = univer.__getInjector();
    const instanceService = injector.get(IUniverInstanceService);
    const workbook = instanceService.getUniverSheetInstance(workbookId);
    if (!workbook) return result;
    
    const worksheet = workbook.getSheetBySheetId(worksheetId);
    if (!worksheet) return result;

    // Access the raw data matrix directly from the core model
    const cellMatrix = worksheet.getCellMatrix();
    const maxRow = worksheet.getRowCount();
    const maxCol = worksheet.getColumnCount();

    if (maxRow === 0 || maxCol === 0) return result;

    const headers: string[] = [];
    for (let col = 0; col < maxCol; col++) {
      const cell = cellMatrix.getValue(0, col);
      headers.push(cell && cell.v !== undefined && cell.v !== null ? String(cell.v) : `Column_${col + 1}`);
    }

    for (let col = 0; col < maxCol; col++) {
      const colData: number[] = [];
      const startRow = skipHeaderRow ? 1 : 0;

      for (let row = startRow; row < maxRow; row++) {
        const cell = cellMatrix.getValue(row, col);
        if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
          const num = Number(cell.v);
          if (Number.isFinite(num) && !isNaN(num)) {
            colData.push(num);
          }
        }
      }

      if (colData.length > 0) result[headers[col]] = colData;
    }
  } catch (err) {
    console.warn('Error reading raw model:', err);
  }

  return result;
};

const clearSheetData = (univer: any, workbookId: string, worksheetId: string) => {
  if (!univer) return false;
  try {
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);
    const instanceService = injector.get(IUniverInstanceService);
    
    const workbook = instanceService.getUniverSheetInstance(workbookId);
    const worksheet = workbook?.getSheetBySheetId(worksheetId);
    if (!worksheet) return false;

    // Clear a generous block safely
    const maxRow = Math.min(worksheet.getRowCount(), 5000); 
    const maxCol = Math.min(worksheet.getColumnCount(), 500);

    const emptyMatrix: Record<number, Record<number, { v: null }>> = {};
    for (let r = 0; r < maxRow; r++) {
      emptyMatrix[r] = {};
      for (let c = 0; c < maxCol; c++) {
        emptyMatrix[r][c] = { v: null };
      }
    }

    commandService.executeCommand('sheet.command.set-range-values', {
      unitId: workbookId,
      subUnitId: worksheetId,
      range: { startRow: 0, endRow: maxRow - 1, startColumn: 0, endColumn: maxCol - 1 },
      value: emptyMatrix
    });
    return true;
  } catch (err) {
    console.error('Failed to clear sheet:', err);
    return false;
  }
};

// ============================================
// UNIVER SPREADSHEET COMPONENT
// ============================================

interface UniverSpreadsheetProps {
  onWorkbookReady?: (univer: any, workbookId: string, worksheetId: string) => void;
}

class UniverErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Univer error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 text-red-800 p-8 rounded-lg">
          <div className="text-center">
            <h3 className="font-bold mb-2">⚠️ Spreadsheet failed to load</h3>
            <p className="text-sm">Please refresh the page to try again</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const UniverSpreadsheet: React.FC<UniverSpreadsheetProps> = ({ onWorkbookReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;

    initializedRef.current = true;
    isMountedRef.current = true;

    const initUniver = () => {
      try {
        const univer = new Univer({
          theme: defaultTheme,
          locale: LocaleType.EN_US,
          locales,
        });

        // Register plugins
        univer.registerPlugin(UniverRenderEnginePlugin);
        univer.registerPlugin(UniverFormulaEnginePlugin);
        univer.registerPlugin(UniverUIPlugin, { container: containerRef.current! });
        univer.registerPlugin(UniverDocsPlugin);
        univer.registerPlugin(UniverDocsUIPlugin);
        univer.registerPlugin(UniverSheetsPlugin);
        univer.registerPlugin(UniverSheetsUIPlugin);
        univer.registerPlugin(UniverSheetsFormulaPlugin);

        // Create initial config
        const workbookId = 'workbook-1';
        const worksheetId = 'sheet1';

        univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
          id: workbookId,
          name: 'StatsPro',
          sheetOrder: [worksheetId],
          sheets: {
            [worksheetId]: {
              id: worksheetId,
              name: 'Data',
              rowCount: 10000,
              columnCount: 1000,
            },
          },
        });

        univerRef.current = univer;
        
        if (onWorkbookReady && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              onWorkbookReady(univer, workbookId, worksheetId);
            }
          }, 500);
        }
      } catch (err) {
        console.error('Failed to initialize Univer:', err);
        initializedRef.current = false;
      }
    };

    initUniver();

    return () => {
      isMountedRef.current = false;
      const univer = univerRef.current;
      univerRef.current = null;
      
      setTimeout(() => {
        try {
          if (univer && typeof univer.dispose === 'function') {
            univer.dispose();
          }
        } catch (err) {
          console.warn('Error disposing Univer:', err);
        }
      }, 0);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '550px' }} />;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function StatisticalTool() {
  const {
    activeView,
    isLoading,
    error,
    notification,
    results,
    testType,
    setActiveView,
    setLoading,
    setError,
    setNotification,
    setResults,
    clearResults,
  } = useUIStore();

  const univerRef = useRef<any>(null);
  const workbookIdRef = useRef<string>('workbook-1');
  const worksheetIdRef = useRef<string>('sheet1');

  const validateData = (columns: Record<string, number[]>, testType: string) => {
    const numCols = Object.keys(columns).length;

    if (numCols === 0) {
      throw new Error('No numeric columns found. Please ensure your data has numeric values.');
    }

    for (const [name, data] of Object.entries(columns)) {
      if (data.length < 3) {
        throw new Error(`Column "${name}" only has ${data.length} valid numeric value(s). Need at least 3.`);
      }
    }

    if (testType === 'ttest' && numCols !== 2) {
      throw new Error(`T-Test requires exactly 2 columns. Found ${numCols}.`);
    }
    if (testType === 'regression' && numCols !== 2) {
      throw new Error(`Regression requires exactly 2 columns. Found ${numCols}.`);
    }
    if ((testType === 'correlation' || testType === 'anova') && numCols < 2) {
      throw new Error(`${testType} requires at least 2 columns. Found ${numCols}.`);
    }
  };

  const runTest = useCallback(async (type: string, params: any = {}) => {
    if (!univerRef.current) {
      setError('Spreadsheet not ready. Please wait for initialization.');
      return;
    }
    
    setLoading(true);
    setError(null);
    clearResults();

    try {
      const columns = getNumericColumns(univerRef.current, workbookIdRef.current, worksheetIdRef.current, true);
      validateData(columns, type);

      let result;
      switch (type) {
        case 'ttest':
          result = await statsEngine.ttest(columns, params.paired);
          break;
        case 'anova':
          result = await statsEngine.anova(columns);
          break;
        case 'correlation':
          result = await statsEngine.correlation(columns);
          break;
        case 'regression':
          result = await statsEngine.regression(columns);
          break;
        default:
          throw new Error(`Unknown test type: ${type}`);
      }

      setResults(result, type);
      setNotification({ message: 'Analysis completed successfully!', type: 'success' });
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      setNotification({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearResults, setResults, setNotification]);

  const parseFile = useCallback((file: File): Promise<any[][]> => {
    return new Promise((resolve, reject) => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv') {
        Papa.parse(file, {
          complete: (results) => resolve(results.data as any[][]),
          error: (error) => reject(error),
          header: false,
          skipEmptyLines: true,
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file format. Please upload CSV or Excel files.'));
      }
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!univerRef.current) {
      setNotification({ message: 'Spreadsheet not ready yet. Please wait.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const data = await parseFile(file);
      const success = batchLoadData(univerRef.current, workbookIdRef.current, worksheetIdRef.current, data);
      if (success) {
        setNotification({ message: `Loaded ${data.length} rows from ${file.name}`, type: 'success' });
      } else {
        throw new Error('Failed to load data into spreadsheet');
      }
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      setNotification({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [parseFile, setLoading, setError, setNotification]);

  const handleClear = useCallback(() => {
    if (!univerRef.current) return;
    
    const success = clearSheetData(univerRef.current, workbookIdRef.current, worksheetIdRef.current);
    if (success) {
      clearResults();
      setNotification({ message: 'Sheet cleared', type: 'success' });
    } else {
      setNotification({ message: 'Failed to clear sheet', type: 'error' });
    }
  }, [clearResults, setNotification]);

  const cancelAnalysis = useCallback(() => {
    statsEngine.cancel();
    setLoading(false);
    setNotification({ message: 'Analysis cancelled', type: 'info' });
  }, [setLoading, setNotification]);

  const handleWorkbookReady = useCallback((univer: any, workbookId: string, worksheetId: string) => {
    univerRef.current = univer;
    workbookIdRef.current = workbookId;
    worksheetIdRef.current = worksheetId;
  }, []);

  useEffect(() => {
    statsEngine.healthCheck().then(isHealthy => {
      if (!isHealthy) {
        console.warn('⚠️ FastAPI backend not running. Start with: python -m uvicorn full_fastapi_backend:app --reload --port 8000');
      }
    });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            StatsPro Engine
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleClear} className="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200">
            🗑️ Clear
          </button>

          <label className="cursor-pointer">
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import Dataset
            </div>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
              'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            <span className="text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-white dark:bg-gray-900 border-r flex flex-col">
          <div className="p-4 flex gap-2 border-b">
            <button onClick={() => setActiveView('data')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'data' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>
              📊 Data Grid
            </button>
            <button onClick={() => setActiveView('charts')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'charts' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>
              📈 Visuals
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Statistical Tests</div>
              <div className="space-y-2">
                <button onClick={() => runTest('ttest', { paired: false })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">
                  🔬 Independent T-Test
                </button>
                <button onClick={() => runTest('ttest', { paired: true })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">
                  🔄 Paired T-Test
                </button>
                <button onClick={() => runTest('anova')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">
                  📐 One-way ANOVA
                </button>
                <button onClick={() => runTest('correlation')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">
                  🔗 Pearson Correlation
                </button>
                <button onClick={() => runTest('regression')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">
                  📈 Linear Regression
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 rounded-lg text-xs text-amber-800">
              <span>Import a CSV/Excel file to get started! The spreadsheet is fully editable.</span>
            </div>
          </div>

          {error && (
            <div className="p-3 m-4 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="p-4 m-4 flex flex-col items-center space-y-3 bg-white/50 rounded-xl">
              <svg className="w-6 h-6 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium">Processing Data...</span>
              <button onClick={cancelAnalysis} className="text-xs text-red-500 hover:underline">Cancel</button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-black overflow-hidden">
          {activeView === 'data' ? (
            <UniverErrorBoundary>
              <UniverSpreadsheet onWorkbookReady={handleWorkbookReady} />
            </UniverErrorBoundary>
          ) : (
            <div className="flex-1 overflow-auto p-8">
              {results ? (
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl font-bold mb-4">{testType} Results</h3>
                  {results.interpretation && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                      <p>{results.interpretation}</p>
                    </div>
                  )}
                  {results.group1 && results.group2 && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">{results.group1.name}</h4>
                        <p>Mean: {results.group1.mean?.toFixed(3)}</p>
                        <p>SD: {results.group1.std?.toFixed(3)}</p>
                        <p>N: {results.group1.n}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">{results.group2.name}</h4>
                        <p>Mean: {results.group2.mean?.toFixed(3)}</p>
                        <p>SD: {results.group2.std?.toFixed(3)}</p>
                        <p>N: {results.group2.n}</p>
                      </div>
                    </div>
                  )}
                  <pre className="bg-gray-50 p-4 rounded-xl overflow-x-auto text-xs">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Run a statistical test to see results here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}