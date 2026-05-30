import React, { useState, useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Charting
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, LineChart, Line, ComposedChart, ResponsiveContainer
} from 'recharts';

// Univer Core & Direct Injection Services
import { 
  Univer, LocaleType, Tools, UniverInstanceType,
  ICommandService, IUniverInstanceService
} from '@univerjs/core';
import { defaultTheme } from '@univerjs/themes';

// Render & Formula Engines
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';

// UI Plugins
import { UniverUIPlugin } from '@univerjs/ui';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';

// Styles
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula-ui/lib/index.css';

// Locale imports
import enUS from '@univerjs/ui/locale/en-US';
import sheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
import docsUIEnUS from '@univerjs/docs-ui/locale/en-US';
import designEnUS from '@univerjs/design/locale/en-US';
import sheetsFormulaUIEnUS from '@univerjs/sheets-formula-ui/locale/en-US';

const locales = {
  [LocaleType.EN_US]: Tools.deepMerge(
    {}, designEnUS, enUS, docsUIEnUS, sheetsUIEnUS, sheetsFormulaUIEnUS
  ),
};

// ============================================
// MATH UTILS FOR CHARTS
// ============================================

// Error function inverse approximation for Q-Q Plot
function erfinv(x: number) {
  const a = 0.147;
  const ln = Math.log(1 - x * x);
  const p1 = 2 / (Math.PI * a) + ln / 2;
  const p2 = ln / a;
  const sign = x < 0 ? -1 : 1;
  return sign * Math.sqrt(Math.sqrt(p1 * p1 - p2) - p1);
}

// ============================================
// CHART COMPONENTS
// ============================================

const HistogramChart = ({ data, columnName }: { data: number[], columnName: string }) => {
  const bins = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins || 1; 
  
  const histogram = Array(bins).fill(0).map((_, i) => ({
    binStart: Number((min + i * binWidth).toFixed(2)),
    binEnd: Number((min + (i + 1) * binWidth).toFixed(2)),
    count: 0
  }));
  
  data.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), bins - 1);
    if (binIndex >= 0) histogram[binIndex].count++;
  });
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={histogram}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="binStart" label={{ value: columnName, position: 'bottom', offset: -5 }} />
        <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const GroupBoxPlot = ({ groups }: { groups: Record<string, number[]> }) => {
  const boxplotData = Object.entries(groups).map(([name, values]) => {
    if (!values || values.length === 0) return { name, min: 0, q1: 0, median: 0, q3: 0, max: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    
    return {
      name,
      min: sorted[0],
      q1,
      median,
      q3,
      max: sorted[sorted.length - 1]
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={boxplotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div className="bg-white p-3 border rounded shadow-sm text-sm">
                <p className="font-bold">{data.name}</p>
                <p>Max: {data.max}</p>
                <p>Q3: {data.q3}</p>
                <p>Median: {data.median}</p>
                <p>Q1: {data.q1}</p>
                <p>Min: {data.min}</p>
              </div>
            );
          }
          return null;
        }} />
        <Bar dataKey="median" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ScatterWithRegression = ({ x, y, xName, yName }: { x: number[], y: number[], xName: string, yName: string }) => {
  if (!x || !y) return null;
  const n = Math.min(x.length, y.length);
  const xData = x.slice(0, n);
  const yData = y.slice(0, n);

  const sumX = xData.reduce((a, b) => a + b, 0);
  const sumY = yData.reduce((a, b) => a + b, 0);
  const sumXY = xData.reduce((sum, xi, i) => sum + xi * yData[i], 0);
  const sumX2 = xData.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / ((n * sumX2 - sumX * sumX) || 1);
  const intercept = (sumY - slope * sumX) / n;
  
  const scatterData = xData.map((xi, i) => ({ x: xi, y: yData[i] }));
  const minX = Math.min(...xData);
  const maxX = Math.max(...xData);
  const lineData = [
    { x: minX, y: intercept + slope * minX },
    { x: maxX, y: intercept + slope * maxX }
  ];
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={scatterData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" label={{ value: xName, position: 'bottom', offset: -5 }} />
        <YAxis dataKey="y" type="number" label={{ value: yName, angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Data points" data={scatterData} fill="#3b82f6" />
        <Line name="Regression line" data={lineData} dataKey="y" stroke="#ef4444" dot={false} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const QQPlot = ({ columnName, data }: { columnName: string, data: number[] }) => {
  const [plotData, setPlotData] = useState<any>(null);
  
  useEffect(() => {
    const n = data.length;
    if (n === 0) return;
    const sorted = [...data].sort((a, b) => a - b);
    const theoretical = Array.from({ length: n }, (_, i) => {
      const p = (i + 0.5) / n;
      return Math.sqrt(2) * erfinv(2 * p - 1);
    });
    
    const sumT = theoretical.reduce((a, b) => a + b, 0);
    const sumS = sorted.reduce((a, b) => a + b, 0);
    const sumTT = theoretical.reduce((sum, t) => sum + t * t, 0);
    const sumTS = theoretical.reduce((sum, t, i) => sum + t * sorted[i], 0);
    const slope = (n * sumTS - sumT * sumS) / ((n * sumTT - sumT * sumT) || 1);
    const intercept = (sumS - slope * sumT) / n;
    
    setPlotData({
      points: theoretical.map((t, i) => ({ theoretical: t, sample: sorted[i] })),
      line: [
        { theoretical: Math.min(...theoretical), sample: intercept + slope * Math.min(...theoretical) },
        { theoretical: Math.max(...theoretical), sample: intercept + slope * Math.max(...theoretical) }
      ]
    });
  }, [data]);
  
  if (!plotData) return <div className="text-sm text-gray-500">Loading...</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="theoretical" type="number" label={{ value: 'Theoretical Quantiles', position: 'bottom', offset: -5 }} />
        <YAxis dataKey="sample" type="number" label={{ value: `Sample Quantiles`, angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Data" data={plotData.points} fill="#8b5cf6" shape="circle" />
        <Line name="Normal" data={plotData.line} dataKey="sample" stroke="#10b981" dot={false} strokeWidth={2} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// ============================================
// TYPES & STORES
// ============================================

type SelectionMode = 'exact_2' | 'min_2' | 'x_y';

interface DialogConfig {
  testId: string;
  testName: string;
  selectionMode: SelectionMode;
  params?: any;
}

interface UIStore {
  activeView: 'data' | 'charts';
  isLoading: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  results: any | null;
  testType: string | null;
  columnsData: Record<string, number[]> | null; 
  dialogConfig: DialogConfig | null;
  setActiveView: (view: 'data' | 'charts') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  setResults: (results: any, testType?: string) => void;
  setColumnsData: (data: Record<string, number[]> | null) => void;
  setDialogConfig: (config: DialogConfig | null) => void;
  clearResults: () => void;
}

const useUIStore = create<UIStore>((set) => ({
  activeView: 'data',
  isLoading: false,
  error: null,
  notification: null,
  results: null,
  testType: null,
  columnsData: null,
  dialogConfig: null,
  setActiveView: (view) => set({ activeView: view }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setNotification: (notification) => set({ notification }),
  setResults: (results, testType) => set({ results, testType: testType || 'Unknown Test' }),
  setColumnsData: (data) => set({ columnsData: data }),
  setDialogConfig: (config) => set({ dialogConfig: config }),
  clearResults: () => set({ results: null, error: null, testType: null, columnsData: null }),
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

  // Parametric
  async ttest(columns: Record<string, number[]>, paired: boolean = false) { return this.request('ttest', { columns, paired }); }
  async anova(columns: Record<string, number[]>) { return this.request('anova', { columns }); }
  async correlation(columns: Record<string, number[]>) { return this.request('correlation', { columns }); }
  async regression(columns: Record<string, number[]>) { return this.request('regression', { columns }); }

  // Non-Parametric
  async mannwhitney(columns: Record<string, number[]>) { return this.request('mannwhitney', { columns }); }
  async wilcoxon(columns: Record<string, number[]>) { return this.request('wilcoxon', { columns }); }
  async kruskalWallis(columns: Record<string, number[]>) { return this.request('kruskal', { columns }); }

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
// CORE DATA HANDLERS
// ============================================

const batchLoadData = (univer: any, workbookId: string, worksheetId: string, data: any[][]): boolean => {
  if (!univer || data.length === 0) return false;
  try {
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);

    const rows = data.length;
    const cols = data[0].length;
    const cellValue: Record<number, Record<number, { v: any }>> = {};
    
    for (let r = 0; r < rows; r++) {
      cellValue[r] = {};
      for (let c = 0; c < cols; c++) {
        const val = data[r][c];
        if (val !== undefined && val !== null && val !== '') {
            const num = Number(val);
            cellValue[r][c] = { v: Number.isFinite(num) && !isNaN(num) ? num : String(val) };
        }
      }
    }

    commandService.executeCommand('sheet.command.set-range-values', {
      unitId: workbookId, subUnitId: worksheetId,
      range: { startRow: 0, endRow: rows - 1, startColumn: 0, endColumn: cols - 1 },
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

    const maxRow = Math.min(worksheet.getRowCount(), 5000); 
    const maxCol = Math.min(worksheet.getColumnCount(), 500);

    const emptyMatrix: Record<number, Record<number, { v: null }>> = {};
    for (let r = 0; r < maxRow; r++) {
      emptyMatrix[r] = {};
      for (let c = 0; c < maxCol; c++) { emptyMatrix[r][c] = { v: null }; }
    }

    commandService.executeCommand('sheet.command.set-range-values', {
      unitId: workbookId, subUnitId: worksheetId,
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
// COLUMN SELECTION MODAL
// ============================================

const ColumnSelectionModal = ({ onExecute }: { onExecute: (selectedColumns: string[]) => void }) => {
  const { dialogConfig, setDialogConfig, columnsData } = useUIStore();
  const [selected, setSelected] = useState<string[]>([]);
  
  // Specific states for Regression (X and Y must be distinct)
  const [xCol, setXCol] = useState<string>('');
  const [yCol, setYCol] = useState<string>('');

  if (!dialogConfig || !columnsData) return null;
  const availableHeaders = Object.keys(columnsData);

  const toggleSelection = (header: string) => {
    if (dialogConfig.selectionMode === 'exact_2') {
      if (selected.includes(header)) setSelected(selected.filter(h => h !== header));
      else if (selected.length < 2) setSelected([...selected, header]);
    } else {
      if (selected.includes(header)) setSelected(selected.filter(h => h !== header));
      else setSelected([...selected, header]);
    }
  };

  const handleRun = () => {
    if (dialogConfig.selectionMode === 'x_y') {
      // Order matters for regression
      onExecute([xCol, yCol]);
    } else {
      onExecute(selected);
    }
    setDialogConfig(null);
  };

  const isRunDisabled = () => {
    if (dialogConfig.selectionMode === 'exact_2') return selected.length !== 2;
    if (dialogConfig.selectionMode === 'min_2') return selected.length < 2;
    if (dialogConfig.selectionMode === 'x_y') return !xCol || !yCol || xCol === yCol;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100 dark:border-gray-800"
      >
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
            Configure {dialogConfig.testName}
          </h2>
          <p className="text-sm text-gray-500">
            {dialogConfig.selectionMode === 'exact_2' && 'Select exactly 2 columns to compare.'}
            {dialogConfig.selectionMode === 'min_2' && 'Select 2 or more columns to analyze.'}
            {dialogConfig.selectionMode === 'x_y' && 'Select your Predictor (X) and Outcome (Y) variables.'}
          </p>
        </div>

        {/* Checkbox Layout for ANOVAs, Correlations, T-tests */}
        {(dialogConfig.selectionMode === 'exact_2' || dialogConfig.selectionMode === 'min_2') && (
          <div className="max-h-60 overflow-y-auto space-y-2 mb-6 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {availableHeaders.map(header => {
              const isChecked = selected.includes(header);
              const isDisabled = !isChecked && dialogConfig.selectionMode === 'exact_2' && selected.length >= 2;
              
              return (
                <label 
                  key={header} 
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white border-transparent hover:border-gray-200 dark:bg-gray-800'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => !isDisabled && toggleSelection(header)}
                    disabled={isDisabled}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{header}</span>
                    <span className="text-xs text-gray-400">n={columnsData[header].length} values</span>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {/* Dropdown Layout specifically for Regression */}
        {dialogConfig.selectionMode === 'x_y' && (
          <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Predictor (X-Axis)</label>
              <select 
                className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={xCol}
                onChange={e => setXCol(e.target.value)}
              >
                <option value="" disabled>Select independent variable...</option>
                {availableHeaders.map(h => <option key={h} value={h} disabled={h === yCol}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Outcome (Y-Axis)</label>
              <select 
                className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={yCol}
                onChange={e => setYCol(e.target.value)}
              >
                <option value="" disabled>Select dependent variable...</option>
                {availableHeaders.map(h => <option key={h} value={h} disabled={h === xCol}>{h}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={() => setDialogConfig(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={handleRun}
            disabled={isRunDisabled()}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Run Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// ============================================
// UNIVER SPREADSHEET COMPONENT
// ============================================

interface UniverSpreadsheetProps {
  onWorkbookReady?: (univer: any, workbookId: string, worksheetId: string) => void;
}

class UniverErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error('Univer error:', error, errorInfo); }
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

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    try {
      const univer = new Univer({ theme: defaultTheme, locale: LocaleType.EN_US, locales });
      univer.registerPlugin(UniverRenderEnginePlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin);
      univer.registerPlugin(UniverUIPlugin, { container: containerRef.current! });
      univer.registerPlugin(UniverDocsPlugin, { hasScroll: false });
      univer.registerPlugin(UniverDocsUIPlugin);
      univer.registerPlugin(UniverSheetsPlugin);
      univer.registerPlugin(UniverSheetsUIPlugin);
      univer.registerPlugin(UniverSheetsFormulaPlugin);
      univer.registerPlugin(UniverSheetsFormulaUIPlugin);

      const workbookId = 'workbook-1';
      const worksheetId = 'sheet1';

      univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
        id: workbookId, name: 'StatsPro', sheetOrder: [worksheetId],
        sheets: {
          [worksheetId]: { id: worksheetId, name: 'Data', rowCount: 10000, columnCount: 1000 },
        },
      });

      const injector = univer.__getInjector();
      const instanceService = injector.get(IUniverInstanceService);
      
      instanceService.focusUnit(workbookId);
      univerRef.current = univer;

      if (onWorkbookReady) {
        setTimeout(() => onWorkbookReady(univer, workbookId, worksheetId), 500);
      }
    } catch (err) {
      console.error('❌ Failed to initialize Univer:', err);
      initializedRef.current = false;
    }

    return () => {
      if (univerRef.current) {
        try { univerRef.current.dispose(); } catch (e) { console.error("Cleanup error", e); }
        univerRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [onWorkbookReady]);

  return <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '550px', overflow: 'hidden', outline: 'none' }} />;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function StatisticalTool() {
  const {
    activeView, isLoading, error, notification, results, testType, columnsData, dialogConfig,
    setActiveView, setLoading, setError, setNotification, setResults, setColumnsData, setDialogConfig, clearResults,
  } = useUIStore();

  const univerRef = useRef<any>(null);
  const workbookIdRef = useRef<string>('workbook-1');
  const worksheetIdRef = useRef<string>('sheet1');

  // STEP 1: PREPARE TEST (Reads sheet, opens modal)
  const prepareTest = useCallback((typeId: string, typeName: string, mode: SelectionMode, params: any = {}) => {
    if (!univerRef.current) {
      setError('Spreadsheet not ready. Please wait for initialization.');
      return;
    }
    const allColumns = getNumericColumns(univerRef.current, workbookIdRef.current, worksheetIdRef.current, true);
    const headers = Object.keys(allColumns);
    
    if (headers.length < 2) {
      setNotification({ message: "Need at least 2 numeric columns in the spreadsheet.", type: "error" });
      return;
    }
    
    // Store all data temporarily so modal can render counts
    setColumnsData(allColumns); 
    setDialogConfig({ testId: typeId, testName: typeName, selectionMode: mode, params });
  }, [setError, setNotification, setColumnsData, setDialogConfig]);

  // STEP 2: EXECUTE TEST (Triggered by modal confirmation)
  const executeTest = useCallback(async (selectedColumnNames: string[]) => {
    if (!dialogConfig || !columnsData) return;
    
    setLoading(true);
    setError(null);
    clearResults();

    try {
      // Create a filtered data dictionary holding ONLY the selected columns
      const targetData: Record<string, number[]> = {};
      selectedColumnNames.forEach(name => {
        if (columnsData[name]) targetData[name] = columnsData[name];
      });

      // Update state with only the columns we actually analyzed for accurate chart rendering
      setColumnsData(targetData);

      let result;
      switch (dialogConfig.testId) {
        case 'ttest': result = await statsEngine.ttest(targetData, dialogConfig.params?.paired); break;
        case 'anova': result = await statsEngine.anova(targetData); break;
        case 'correlation': result = await statsEngine.correlation(targetData); break;
        case 'regression': result = await statsEngine.regression(targetData); break;
        case 'mannwhitney': result = await statsEngine.mannwhitney(targetData); break;
        case 'wilcoxon': result = await statsEngine.wilcoxon(targetData); break;
        case 'kruskalWallis': result = await statsEngine.kruskalWallis(targetData); break;
        default: throw new Error(`Unknown test type`);
      }

      setResults(result, dialogConfig.testName);
      setNotification({ message: 'Analysis completed successfully!', type: 'success' });
      setActiveView('charts');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      setNotification({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [dialogConfig, columnsData, setLoading, setError, clearResults, setColumnsData, setResults, setNotification, setActiveView]);

  const parseFile = useCallback((file: File): Promise<any[][]> => {
    return new Promise((resolve, reject) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv') {
        Papa.parse(file, {
          complete: (results) => resolve(results.data as any[][]),
          error: (error) => reject(error), header: false, skipEmptyLines: true,
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
          } catch (error) { reject(error); }
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
      setError((err as Error).message);
      setNotification({ message: (err as Error).message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [parseFile, setLoading, setError, setNotification]);

  const handleClear = useCallback(() => {
    if (!univerRef.current) return;
    if (clearSheetData(univerRef.current, workbookIdRef.current, worksheetIdRef.current)) {
      clearResults();
      setNotification({ message: 'Sheet cleared', type: 'success' });
    }
  }, [clearResults, setNotification]);

  const handleWorkbookReady = useCallback((univer: any, workbookId: string, worksheetId: string) => {
    univerRef.current = univer;
    workbookIdRef.current = workbookId;
    worksheetIdRef.current = worksheetId;
  }, []);

  useEffect(() => {
    statsEngine.healthCheck().then(isHealthy => {
      if (!isHealthy) console.warn('⚠️ FastAPI backend not running.');
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
      
      {dialogConfig && <ColumnSelectionModal onExecute={executeTest} />}

      <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            StatsPro Engine
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClear} className="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200">🗑️ Clear</button>
          <label className="cursor-pointer">
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Import Dataset
            </div>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            <span className="text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-white dark:bg-gray-900 border-r flex flex-col">
          <div className="p-4 flex gap-2 border-b">
            <button onClick={() => setActiveView('data')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'data' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>📊 Data Grid</button>
            <button onClick={() => setActiveView('charts')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeView === 'charts' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>📈 Visuals</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Parametric Tests</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('ttest', 'Independent T-Test', 'exact_2', { paired: false })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔬 Independent T-Test</button>
                <button onClick={() => prepareTest('ttest', 'Paired T-Test', 'exact_2', { paired: true })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔄 Paired T-Test</button>
                <button onClick={() => prepareTest('anova', 'One-way ANOVA', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📐 One-way ANOVA</button>
                <button onClick={() => prepareTest('correlation', 'Pearson Correlation', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔗 Pearson Correlation</button>
                <button onClick={() => prepareTest('regression', 'Linear Regression', 'x_y')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📈 Linear Regression</button>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Non-Parametric Tests</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('mannwhitney', 'Mann-Whitney U', 'exact_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Mann-Whitney U</button>
                <button onClick={() => prepareTest('wilcoxon', 'Wilcoxon Signed-Rank', 'exact_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔄 Wilcoxon Signed-Rank</button>
                <button onClick={() => prepareTest('kruskalWallis', 'Kruskal-Wallis', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Kruskal-Wallis</button>
              </div>
            </div>
          </div>
          
          {error && <div className="p-3 m-4 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">{error}</div>}
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-black overflow-hidden relative">
          
          {/* THE FIX: We hide the spreadsheet instead of unmounting it! */}
          <div className={`absolute inset-0 transition-opacity ${activeView === 'data' ? 'opacity-100 z-10' : 'opacity-0 z-[-1] pointer-events-none'}`}>
            <UniverErrorBoundary>
              <UniverSpreadsheet onWorkbookReady={handleWorkbookReady} />
            </UniverErrorBoundary>
          </div>

          {/* Charts View */}
          <div className={`absolute inset-0 bg-white dark:bg-gray-950 overflow-auto p-8 transition-opacity ${activeView === 'charts' ? 'opacity-100 z-10' : 'opacity-0 z-[-1] pointer-events-none'}`}>
            {results && columnsData ? (
              <div className="max-w-5xl mx-auto space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{testType} Results</h3>
                  {results.interpretation && (
                    <div className="mb-4 p-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 shadow-sm text-lg">
                      <p>{results.interpretation}</p>
                    </div>
                  )}
                </div>

                {/* Box Plots for Group Comparisons */}
                {['Independent T-Test', 'Paired T-Test', 'Mann-Whitney U', 'Wilcoxon Signed-Rank'].includes(testType || '') && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Group Comparison (Box Plot)</h3>
                    <GroupBoxPlot groups={{
                      [results.group1?.name || 'Group 1']: columnsData[results.group1?.name] || [],
                      [results.group2?.name || 'Group 2']: columnsData[results.group2?.name] || []
                    }} />
                  </div>
                )}

                {/* Scatter Plots for Relationship testing */}
                {['Pearson Correlation', 'Linear Regression'].includes(testType || '') && results.variables && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Scatter Plot</h3>
                    <ScatterWithRegression 
                      x={columnsData[results.variables[0]] || columnsData[Object.keys(columnsData)[0]]}
                      y={columnsData[results.variables[1]] || columnsData[Object.keys(columnsData)[1]]}
                      xName={results.variables?.[0] || Object.keys(columnsData)[0]}
                      yName={results.variables?.[1] || Object.keys(columnsData)[1]}
                    />
                  </div>
                )}

                {/* Distribution Charts for Everything */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Data Distributions</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(columnsData).map(([name, data]) => (
                      <div key={name} className="border rounded-xl p-5 bg-white shadow-sm">
                        <h4 className="font-bold text-gray-700 mb-4">{name} Distribution</h4>
                        <HistogramChart data={data as number[]} columnName={name} />
                        <div className="mt-8 border-t pt-6">
                          <h4 className="font-bold text-gray-700 mb-4 text-sm">Normality Q-Q Plot</h4>
                          <QQPlot columnName={name} data={data as number[]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Raw JSON Output</h3>
                  <pre className="bg-gray-900 text-gray-300 p-5 rounded-xl overflow-x-auto text-xs shadow-inner">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Run a statistical test to see visualizations</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}