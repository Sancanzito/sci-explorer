import React, { useState, useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Charting
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, LineChart, Line, ComposedChart, ResponsiveContainer,
  ErrorBar, Cell
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

function erfinv(x: number) {
  const a = 0.147;
  const ln = Math.log(1 - x * x);
  const p1 = 2 / (Math.PI * a) + ln / 2;
  const p2 = ln / a;
  const sign = x < 0 ? -1 : 1;
  return sign * Math.sqrt(Math.sqrt(p1 * p1 - p2) - p1);
}

// ============================================
// CHART & DESCRIPTIVE COMPONENTS
// ============================================

const PCAScreePlot = ({ eigenvalues, customTitle }: { eigenvalues: number[], customTitle: string }) => {
  const data = eigenvalues.map((val, i) => ({ 
    component: `PC${i + 1}`, 
    eigenvalue: val, 
    kaiser: 1.0 
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="component" />
        <YAxis label={{ value: 'Eigenvalue', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="eigenvalue" name="Eigenvalue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="kaiser" name="Kaiser Criterion (λ=1)" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const DescriptiveStats = ({ columnsData, customTitle }: { columnsData: Record<string, any[]>, customTitle: string }) => {
  const stats = Object.entries(columnsData).map(([name, rawData]) => {
    const data = rawData.filter(x => typeof x === 'number') as number[];
    if (!data || data.length === 0) return null;
    
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (data.length - 1));
    const se = std / Math.sqrt(data.length);
    const ci95_lower = mean - 1.96 * se;
    const ci95_upper = mean + 1.96 * se;
    
    return {
      name, n: data.length, mean: mean.toFixed(3), median: (sorted[Math.floor(sorted.length / 2)]).toFixed(3),
      std: std.toFixed(3), min: Math.min(...data).toFixed(3), max: Math.max(...data).toFixed(3),
      ci95: `${ci95_lower.toFixed(3)} to ${ci95_upper.toFixed(3)}`
    };
  }).filter(Boolean);
  
  if (stats.length === 0) return <div className="text-sm text-gray-500">No numeric data available.</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <h4 className="p-4 font-bold bg-white border-b text-gray-800">{customTitle || "Summary Statistics"}</h4>
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left font-semibold">Variable</th>
            <th className="p-3 text-left font-semibold">N</th>
            <th className="p-3 text-left font-semibold">Mean</th>
            <th className="p-3 text-left font-semibold">Median</th>
            <th className="p-3 text-left font-semibold">Std Dev</th>
            <th className="p-3 text-left font-semibold">Min</th>
            <th className="p-3 text-left font-semibold">Max</th>
            <th className="p-3 text-left font-semibold">95% CI</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s: any) => (
            <tr key={s.name} className="border-t">
              <td className="font-bold p-3 text-gray-900">{s.name}</td>
              <td className="p-3">{s.n}</td><td className="p-3">{s.mean}</td>
              <td className="p-3">{s.median}</td><td className="p-3">{s.std}</td>
              <td className="p-3">{s.min}</td><td className="p-3">{s.max}</td>
              <td className="p-3 text-gray-500">{s.ci95}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HistogramChart = ({ data, columnName, customX }: { data: any[], columnName: string, customX: string }) => {
  const numData = data.filter(x => typeof x === 'number') as number[];
  if (numData.length === 0) return <div className="text-xs text-gray-400 italic text-center py-10">Categorical Variable - Histogram Disabled</div>;

  const bins = 20;
  const min = Math.min(...numData);
  const max = Math.max(...numData);
  const binWidth = (max - min) / bins || 1; 
  
  const histogram = Array(bins).fill(0).map((_, i) => ({
    binStart: Number((min + i * binWidth).toFixed(2)),
    binEnd: Number((min + (i + 1) * binWidth).toFixed(2)),
    count: 0
  }));
  
  numData.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), bins - 1);
    if (binIndex >= 0) histogram[binIndex].count++;
  });
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={histogram}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="binStart" label={{ value: customX || columnName, position: 'bottom', offset: -5 }} />
        <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const BarWithErrorBars = ({ groups, customY }: { groups: Record<string, { mean: number, std: number, n: number }>, customY: string }) => {
  const data = Object.entries(groups).map(([name, stats]) => ({
    name,
    mean: stats.mean,
    error: stats.std / Math.sqrt(stats.n),
  }));
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: customY || 'Mean Value', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="mean" fill="#3b82f6">
          {data.map((entry, idx) => (
            <Cell key={idx} fill="#3b82f6" />
          ))}
          <ErrorBar dataKey="error" direction="y" stroke="#ef4444" strokeWidth={2} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CorrelationHeatmap = ({ matrix, variables }: { matrix: any, variables: string[] }) => {
  const getColor = (value: number) => {
    if (value > 0.7) return '#ef4444';
    if (value > 0.3) return '#f97316';
    if (value > -0.3) return '#eab308';
    if (value > -0.7) return '#22c55e';
    return '#3b82f6';
  };
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="bg-gray-50 border-b"></th>
            {variables.map(v => <th key={v} className="p-3 bg-gray-50 border-b font-semibold text-gray-700">{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {variables.map(rowVar => (
            <tr key={rowVar}>
              <td className="font-bold p-3 border-r bg-gray-50 text-gray-700">{rowVar}</td>
              {variables.map(colVar => {
                const value = matrix[rowVar]?.[colVar] || 0;
                return (
                  <td 
                    key={colVar}
                    className="p-3 text-center text-white font-medium border"
                    style={{ backgroundColor: getColor(value), minWidth: '80px' }}
                  >
                    {value.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GroupBoxPlot = ({ groups, customY }: { groups: Record<string, any[]>, customY: string }) => {
  const boxplotData = Object.entries(groups).map(([name, rawValues]) => {
    const values = rawValues.filter(x => typeof x === 'number') as number[];
    if (!values || values.length === 0) return { name, min: 0, q1: 0, median: 0, q3: 0, max: 0 };
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    
    return { name, min: sorted[0], q1, median, q3, max: sorted[sorted.length - 1] };
  }).filter(data => data.max !== 0 || data.min !== 0);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={boxplotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" label={{ value: customY || "Value", position: 'bottom', offset: -5 }} />
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

const ScatterWithRegression = ({ x, y, xName, yName, customX, customY }: { x: any[], y: any[], xName: string, yName: string, customX: string, customY: string }) => {
  if (!x || !y || x.length === 0 || y.length === 0) return null;
  
  const numX = x.map(val => Number(val)).filter(val => !isNaN(val));
  const numY = y.map(val => Number(val)).filter(val => !isNaN(val));
  
  const n = Math.min(numX.length, numY.length);
  const xData = numX.slice(0, n);
  const yData = numY.slice(0, n);

  if (n === 0) return <div className="text-sm text-gray-500">Not enough numeric data for scatter plot.</div>;

  const sumX = xData.reduce((a, b) => a + b, 0);
  const sumY = yData.reduce((a, b) => a + b, 0);
  const sumXY = xData.reduce((sum, xi, i) => sum + xi * yData[i], 0);
  const sumX2 = xData.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / ((n * sumX2 - sumX * sumX) || 1);
  const intercept = (sumY - slope * sumX) / n;
  
  const combinedData = xData.map((xi, i) => ({ 
    xValue: xi, 
    yValue: yData[i],
    regressionLine: intercept + slope * xi 
  })).sort((a, b) => a.xValue - b.xValue);
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="xValue" type="number" domain={['auto', 'auto']} label={{ value: customX || xName, position: 'bottom', offset: -5 }} />
        <YAxis dataKey="yValue" type="number" domain={['auto', 'auto']} label={{ value: customY || yName, angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Data points" dataKey="yValue" fill="#3b82f6" />
        <Line name="Regression line" dataKey="regressionLine" stroke="#ef4444" dot={false} strokeWidth={2} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const ResidualPlot = ({ residuals, fitted, customX, customY }: { residuals: number[], fitted: number[], customX: string, customY: string }) => {
  if (!residuals || !fitted || residuals.length === 0) return null;

  const combinedData = residuals.map((r, i) => ({ 
    residual: r, 
    fitted: fitted[i],
    zeroLine: 0
  })).sort((a, b) => a.fitted - b.fitted);
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="fitted" domain={['auto', 'auto']} label={{ value: customX || 'Fitted (Predicted) Values', position: 'bottom', offset: -5 }} />
        <YAxis type="number" dataKey="residual" domain={['auto', 'auto']} label={{ value: customY || 'Residuals (Error)', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Residuals" dataKey="residual" fill="#8b5cf6" />
        <Line name="Zero Line" dataKey="zeroLine" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const QQPlot = ({ columnName, data }: { columnName: string, data: any[] }) => {
  const [plotData, setPlotData] = useState<any[]>([]);
  
  useEffect(() => {
    const numData = data.filter(x => typeof x === 'number') as number[];
    const n = numData.length;
    if (n === 0) return;
    
    const sorted = [...numData].sort((a, b) => a - b);
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
    
    const combined = theoretical.map((t, i) => ({ 
      theoretical: t, 
      sample: sorted[i],
      normalLine: intercept + slope * t
    }));
    setPlotData(combined);
  }, [data]);
  
  if (plotData.length === 0) return <div className="text-xs text-gray-400 italic text-center py-5">Categorical Variable - Q-Q Plot Disabled</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={plotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="theoretical" type="number" label={{ value: 'Theoretical Quantiles', position: 'bottom', offset: -5 }} />
        <YAxis dataKey="sample" type="number" label={{ value: `Sample Quantiles`, angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Data" dataKey="sample" fill="#8b5cf6" />
        <Line name="Normal" dataKey="normalLine" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// ============================================
// TYPES & STORES
// ============================================

type SelectionMode = 'exact_2' | 'min_2' | 'min_1' | 'x_y' | '1_n';

interface DialogConfig {
  testId: string;
  testName: string;
  selectionMode: SelectionMode;
  allowCategorical?: boolean;
  params?: any;
}

interface UIStore {
  activeView: 'data' | 'charts';
  isLoading: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  results: any | null;
  testType: string | null;
  columnsData: Record<string, any[]> | null; 
  dialogConfig: DialogConfig | null;
  activeGraphs: string[];
  
  setActiveView: (view: 'data' | 'charts') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  setResults: (results: any, testType?: string) => void;
  setColumnsData: (data: Record<string, any[]> | null) => void;
  setDialogConfig: (config: DialogConfig | null) => void;
  toggleGraph: (graphId: string) => void;
  setActiveGraphs: (graphs: string[]) => void;
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
  activeGraphs: [],
  
  setActiveView: (view) => set({ activeView: view }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setNotification: (notification) => set({ notification }),
  setResults: (results, testType) => set({ results, testType: testType || 'Unknown Test' }),
  setColumnsData: (data) => set({ columnsData: data }),
  setDialogConfig: (config) => set({ dialogConfig: config }),
  toggleGraph: (graphId) => set((state) => ({
    activeGraphs: state.activeGraphs.includes(graphId) 
      ? state.activeGraphs.filter(g => g !== graphId)
      : [...state.activeGraphs, graphId]
  })),
  setActiveGraphs: (graphs) => set({ activeGraphs: graphs }),
  clearResults: () => set({ results: null, error: null, testType: null, columnsData: null, activeGraphs: [] }),
}));

// ============================================
// STATS ENGINE & DATA HELPERS
// ============================================

const API_BASE = 'http://localhost:8000/api';

class StatsEngine {
  private abortController: AbortController | null = null;
  async cancel() { if (this.abortController) { this.abortController.abort(); this.abortController = null; } }

  private async request<T>(endpoint: string, body: any): Promise<T> {
    this.cancel();
    this.abortController = new AbortController();
    try {
      const response = await fetch(`${API_BASE}/stats/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        signal: this.abortController.signal,
      });
      if (!response.ok) throw new Error((await response.json()).detail || 'Analysis failed');
      return (await response.json()).data;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw new Error('Analysis cancelled');
      throw err;
    } finally { this.abortController = null; }
  }

  // Old Endpoints
  async levene(columns: Record<string, any[]>) { return this.request('levene', { columns }); }
  async ttest(columns: Record<string, any[]>, paired: boolean = false) { return this.request(`ttest?paired=${paired}`, { columns }); }
  async anova(columns: Record<string, any[]>) { return this.request('anova', { columns }); }
  async anovaPosthoc(columns: Record<string, any[]>) { return this.request('anova_posthoc', { columns }); }
  async correlation(columns: Record<string, any[]>) { return this.request('correlation', { columns }); }
  async regression(columns: Record<string, any[]>) { return this.request('regression', { columns }); }
  async multipleRegression(columns: Record<string, any[]>, outcome: string) { return this.request(`multiple_regression?outcome=${encodeURIComponent(outcome)}`, { columns }); }
  async mannwhitney(columns: Record<string, any[]>) { return this.request('mannwhitney', { columns }); }
  async wilcoxon(columns: Record<string, any[]>) { return this.request('wilcoxon', { columns }); }
  async kruskalWallis(columns: Record<string, any[]>) { return this.request('kruskal', { columns }); }
  async chisquare(columns: Record<string, any[]>) { return this.request('chisquare', { columns }); }
  async previewData(columns: Record<string, any[]>) { return this.request('preview', { columns }); }
  
  // New Endpoints
  async assumptions(columns: Record<string, any[]>, outcome: string) { return this.request(`assumptions?outcome=${encodeURIComponent(outcome)}`, { columns }); }
  async frequencies(columns: Record<string, any[]>) { return this.request('frequencies', { columns }); }
  async reliability(columns: Record<string, any[]>) { return this.request('reliability', { columns }); }
  async pca(columns: Record<string, any[]>) { return this.request('pca', { columns }); }

  async healthCheck(): Promise<boolean> { try { return (await fetch(`${API_BASE}/health`)).ok; } catch { return false; } }
}
const statsEngine = new StatsEngine();

const batchLoadData = (univer: any, workbookId: string, worksheetId: string, data: any[][]): boolean => {
  if (!univer || data.length === 0) return false;
  try {
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);
    const rows = data.length; const cols = data[0].length;
    const cellValue: Record<number, Record<number, { v: any }>> = {};
    for (let r = 0; r < rows; r++) {
      cellValue[r] = {};
      for (let c = 0; c < cols; c++) {
        if (data[r][c] !== undefined && data[r][c] !== null && data[r][c] !== '') cellValue[r][c] = { v: String(data[r][c]) }; 
      }
    }
    commandService.executeCommand('sheet.command.set-range-values', { unitId: workbookId, subUnitId: worksheetId, range: { startRow: 0, endRow: rows - 1, startColumn: 0, endColumn: cols - 1 }, value: cellValue });
    return true;
  } catch (err) { return false; }
};

const getColumnData = (univer: any, workbookId: string, worksheetId: string, skipHeaderRow: boolean = true): Record<string, any[]> => {
  const result: Record<string, any[]> = {};
  if (!univer) return result;
  try {
    const injector = univer.__getInjector();
    const instanceService = injector.get(IUniverInstanceService);
    const workbook = instanceService.getUniverSheetInstance(workbookId);
    const worksheet = workbook?.getSheetBySheetId(worksheetId);
    if (!worksheet) return result;

    const cellMatrix = worksheet.getCellMatrix();
    const maxRow = worksheet.getRowCount(); const maxCol = worksheet.getColumnCount();
    if (maxRow === 0 || maxCol === 0) return result;

    const headers: string[] = [];
    for (let col = 0; col < maxCol; col++) {
      const cell = cellMatrix.getValue(0, col);
      headers.push(cell && cell.v !== undefined && cell.v !== null ? String(cell.v) : `Column_${col + 1}`);
    }
    for (let col = 0; col < maxCol; col++) {
      const colData: any[] = [];
      for (let row = skipHeaderRow ? 1 : 0; row < maxRow; row++) {
        const cell = cellMatrix.getValue(row, col);
        if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
          if (typeof cell.v === 'string' && cell.v.includes(',')) {
            cell.v.split(',').forEach(v => {
              const num = Number(v.trim());
              if (!isNaN(num) && v.trim() !== '') colData.push(num);
              else if (v.trim() !== '') colData.push(v.trim());
            });
          } else {
            const num = Number(cell.v);
            if (!isNaN(num) && cell.v !== '') colData.push(num);
            else colData.push(cell.v);
          }
        }
      }
      if (colData.length > 0) result[headers[col]] = colData;
    }
  } catch (err) { }
  return result;
};

const clearSheetData = (univer: any, workbookId: string, worksheetId: string) => {
  if (!univer) return false;
  try {
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);
    const worksheet = injector.get(IUniverInstanceService).getUniverSheetInstance(workbookId)?.getSheetBySheetId(worksheetId);
    if (!worksheet) return false;
    const targetRows = Math.min(worksheet.getRowCount(), 1000);
    const targetCols = Math.min(worksheet.getColumnCount(), 50);
    const emptyMatrix: Record<number, Record<number, { v: null }>> = {};
    for (let r = 0; r < targetRows; r++) {
      emptyMatrix[r] = {};
      for (let c = 0; c < targetCols; c++) { emptyMatrix[r][c] = { v: null }; }
    }
    commandService.executeCommand('sheet.command.set-range-values', { unitId: workbookId, subUnitId: worksheetId, range: { startRow: 0, endRow: targetRows - 1, startColumn: 0, endColumn: targetCols - 1 }, value: emptyMatrix });
    return true;
  } catch (err) { return false; }
};

// ============================================
// COLUMN SELECTION MODAL
// ============================================

const ColumnSelectionModal = ({ onExecute }: { onExecute: (selectedColumns: string[]) => void }) => {
  const { dialogConfig, setDialogConfig, columnsData } = useUIStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [xCol, setXCol] = useState<string>('');
  const [yCol, setYCol] = useState<string>('');

  if (!dialogConfig || !columnsData) return null;
  
  const availableHeaders = Object.keys(columnsData).filter(key => {
     if (dialogConfig.allowCategorical) return true;
     return columnsData[key].some(val => typeof val === 'number');
  });

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
    if (dialogConfig.selectionMode === 'x_y') onExecute([xCol, yCol]);
    else if (dialogConfig.selectionMode === '1_n') onExecute([yCol, ...selected]); 
    else onExecute(selected);
    setDialogConfig(null);
  };

  const isRunDisabled = () => {
    if (dialogConfig.selectionMode === 'exact_2') return selected.length !== 2;
    if (dialogConfig.selectionMode === 'min_2') return selected.length < 2;
    if (dialogConfig.selectionMode === 'min_1') return selected.length < 1;
    if (dialogConfig.selectionMode === 'x_y') return !xCol || !yCol || xCol === yCol;
    if (dialogConfig.selectionMode === '1_n') return !yCol || selected.length === 0 || selected.includes(yCol);
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Configure {dialogConfig.testName}</h2>
          <p className="text-sm text-gray-500">
            {dialogConfig.selectionMode === 'exact_2' && 'Select exactly 2 columns to compare.'}
            {dialogConfig.selectionMode === 'min_2' && 'Select 2 or more columns to analyze.'}
            {dialogConfig.selectionMode === 'min_1' && 'Select at least 1 column.'}
            {dialogConfig.selectionMode === 'x_y' && 'Select your Predictor (X) and Outcome (Y) variables.'}
            {dialogConfig.selectionMode === '1_n' && 'Select one Outcome and multiple Predictors.'}
          </p>
        </div>

        {['exact_2', 'min_2', 'min_1'].includes(dialogConfig.selectionMode) && (
          <div className="max-h-60 overflow-y-auto space-y-2 mb-6 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {availableHeaders.length === 0 && <div className="text-center text-sm text-gray-500 p-4">No valid numeric columns found.</div>}
            {availableHeaders.map(header => {
              const isChecked = selected.includes(header);
              const isDisabled = !isChecked && dialogConfig.selectionMode === 'exact_2' && selected.length >= 2;
              return (
                <label key={header} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white border-transparent hover:border-gray-200 dark:bg-gray-800'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => !isDisabled && toggleSelection(header)} disabled={isDisabled} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"/>
                  <div className="flex flex-col"><span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{header}</span><span className="text-xs text-gray-400">n={columnsData[header].length} values</span></div>
                </label>
              );
            })}
          </div>
        )}

        {dialogConfig.selectionMode === 'x_y' && (
          <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Predictor (X-Axis)</label>
              <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" value={xCol} onChange={e => setXCol(e.target.value)}>
                <option value="" disabled>Select independent variable...</option>
                {availableHeaders.map(h => <option key={h} value={h} disabled={h === yCol}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Outcome (Y-Axis)</label>
              <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" value={yCol} onChange={e => setYCol(e.target.value)}>
                <option value="" disabled>Select dependent variable...</option>
                {availableHeaders.map(h => <option key={h} value={h} disabled={h === xCol}>{h}</option>)}
              </select>
            </div>
          </div>
        )}

        {dialogConfig.selectionMode === '1_n' && (
          <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Outcome (Dependent Variable)</label>
              <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm mb-4" value={yCol} onChange={e => setYCol(e.target.value)}>
                <option value="" disabled>Select outcome variable...</option>
                {availableHeaders.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Predictors (Independent Variables)</label>
              <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-white border border-gray-200 rounded-lg">
                {availableHeaders.map(header => {
                  if (header === yCol) return null;
                  const isChecked = selected.includes(header);
                  return (
                    <label key={header} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded">
                      <input type="checkbox" checked={isChecked} onChange={() => toggleSelection(header)} className="rounded text-blue-600 border-gray-300" />
                      <span className="text-sm font-medium text-gray-700">{header}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setDialogConfig(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={handleRun} disabled={isRunDisabled()} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">Run Analysis</button>
        </div>
      </motion.div>
    </div>
  );
};


// ============================================
// UNIVER SPREADSHEET COMPONENT
// ============================================

interface UniverSpreadsheetProps { onWorkbookReady?: (univer: any, workbookId: string, worksheetId: string) => void; }

class UniverErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error('Univer error:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="flex items-center justify-center h-full bg-red-50 text-red-800 p-8 rounded-lg"><div className="text-center"><h3 className="font-bold mb-2">⚠️ Spreadsheet failed to load</h3><p className="text-sm">Please refresh the page to try again</p></div></div>;
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
      univer.registerPlugin(UniverRenderEnginePlugin); univer.registerPlugin(UniverFormulaEnginePlugin);
      univer.registerPlugin(UniverUIPlugin, { container: containerRef.current! });
      univer.registerPlugin(UniverDocsPlugin, { hasScroll: false }); univer.registerPlugin(UniverDocsUIPlugin);
      univer.registerPlugin(UniverSheetsPlugin); univer.registerPlugin(UniverSheetsUIPlugin);
      univer.registerPlugin(UniverSheetsFormulaPlugin); univer.registerPlugin(UniverSheetsFormulaUIPlugin);

      const workbookId = 'workbook-1'; const worksheetId = 'sheet1';
      univer.createUnit(UniverInstanceType.UNIVER_SHEET, { id: workbookId, name: 'StatsPro', sheetOrder: [worksheetId], sheets: { [worksheetId]: { id: worksheetId, name: 'Data', rowCount: 10000, columnCount: 1000 } } });

      const instanceService = univer.__getInjector().get(IUniverInstanceService);
      instanceService.focusUnit(workbookId);
      univerRef.current = univer;

      if (onWorkbookReady) setTimeout(() => onWorkbookReady(univer, workbookId, worksheetId), 500);
    } catch (err) { console.error('❌ Failed to initialize Univer:', err); initializedRef.current = false; }

    return () => {
      if (univerRef.current) { try { univerRef.current.dispose(); } catch (e) { } univerRef.current = null; }
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
    activeView, isLoading, error, notification, results, testType, columnsData, dialogConfig, activeGraphs,
    setActiveView, setLoading, setError, setNotification, setResults, setColumnsData, setDialogConfig, clearResults, toggleGraph, setActiveGraphs
  } = useUIStore();

  const univerRef = useRef<any>(null);
  const workbookIdRef = useRef<string>('workbook-1');
  const worksheetIdRef = useRef<string>('sheet1');

  const [customLabels, setCustomLabels] = useState({ title: '', xAxis: '', yAxis: '' });

  const prepareTest = useCallback((typeId: string, typeName: string, mode: SelectionMode, params: any = {}) => {
    if (!univerRef.current) { setError('Spreadsheet not ready.'); return; }
    const allColumns = getColumnData(univerRef.current, workbookIdRef.current, worksheetIdRef.current, true);
    if (Object.keys(allColumns).length < 1) { setNotification({ message: "No readable columns found.", type: "error" }); return; }
    
    setColumnsData(allColumns); 
    const categoricalTests = ['chisquare', 'preview_data', 'descriptives', 'frequencies'];
    const allowCat = params.allowCategorical !== undefined ? params.allowCategorical : categoricalTests.includes(typeId);
    setDialogConfig({ testId: typeId, testName: typeName, selectionMode: mode, allowCategorical: allowCat, params });
  }, [setError, setNotification, setColumnsData, setDialogConfig]);

  const executeTest = useCallback(async (selectedColumnNames: string[]) => {
    if (!dialogConfig || !columnsData) return;
    setLoading(true); setError(null); clearResults(); 
    
    const defaultGraphs = ['summary'];
    if (dialogConfig.testId === 'pca') defaultGraphs.push('screeplot');
    setActiveGraphs(defaultGraphs);
    setCustomLabels({ title: '', xAxis: '', yAxis: '' });

    try {
      const targetData: Record<string, any[]> = {};
      selectedColumnNames.forEach(name => { if (columnsData[name]) targetData[name] = columnsData[name]; });
      setColumnsData(targetData);

      let result;
      switch (dialogConfig.testId) {
        case 'preview_data': result = await statsEngine.previewData(targetData); break;
        case 'descriptives': result = { interpretation: "Descriptive statistics computed successfully." }; break;
        case 'levene': result = await statsEngine.levene(targetData); break;
        case 'ttest': result = await statsEngine.ttest(targetData, dialogConfig.params?.paired); break;
        case 'anova': result = await statsEngine.anova(targetData); break;
        case 'anova_posthoc': result = await statsEngine.anovaPosthoc(targetData); break;
        case 'correlation': result = await statsEngine.correlation(targetData); break;
        case 'regression': result = await statsEngine.regression(targetData); break;
        case 'multiple_regression': result = await statsEngine.multipleRegression(targetData, selectedColumnNames[0]); break;
        case 'chisquare': result = await statsEngine.chisquare(targetData); break;
        case 'mannwhitney': result = await statsEngine.mannwhitney(targetData); break;
        case 'wilcoxon': result = await statsEngine.wilcoxon(targetData); break;
        case 'kruskalWallis': result = await statsEngine.kruskalWallis(targetData); break;
        
        // New features executed here
        case 'assumptions': result = await statsEngine.assumptions(targetData, selectedColumnNames[0]); break;
        case 'frequencies': result = await statsEngine.frequencies(targetData); break;
        case 'reliability': result = await statsEngine.reliability(targetData); break;
        case 'pca': result = await statsEngine.pca(targetData); break;
        
        default: throw new Error(`Unknown test type`);
      }

      setResults(result, dialogConfig.testName);
      setNotification({ message: 'Analysis completed successfully!', type: 'success' });
      setActiveView('charts');
    } catch (err) {
      setError((err as Error).message); setNotification({ message: (err as Error).message, type: 'error' });
    } finally { setLoading(false); }
  }, [dialogConfig, columnsData, setLoading, setError, clearResults, setColumnsData, setResults, setNotification, setActiveView, setActiveGraphs]);

  const parseFile = useCallback((file: File): Promise<any[][]> => {
    return new Promise((resolve, reject) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv') Papa.parse(file, { complete: (results) => resolve(results.data as any[][]), error: (error) => reject(error), header: false, skipEmptyLines: true });
      else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try { const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' });
            resolve(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 }) as any[][]);
          } catch (error) { reject(error); }
        };
        reader.onerror = () => reject(new Error('Failed to read file')); reader.readAsArrayBuffer(file);
      } else reject(new Error('Unsupported file format.'));
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!univerRef.current) return;
    setLoading(true); setError(null);
    try {
      const data = await parseFile(file);
      if (batchLoadData(univerRef.current, workbookIdRef.current, worksheetIdRef.current, data)) setNotification({ message: `Loaded ${data.length} rows from ${file.name}`, type: 'success' });
      else throw new Error('Failed to load data into spreadsheet');
    } catch (err) { setError((err as Error).message); setNotification({ message: (err as Error).message, type: 'error' });
    } finally { setLoading(false); }
  }, [parseFile, setLoading, setError, setNotification]);

  const handleClear = useCallback(() => {
    if (univerRef.current && clearSheetData(univerRef.current, workbookIdRef.current, worksheetIdRef.current)) { clearResults(); setNotification({ message: 'Sheet cleared', type: 'success' }); }
  }, [clearResults, setNotification]);

  const handleWorkbookReady = useCallback((univer: any, workbookId: string, worksheetId: string) => {
    univerRef.current = univer; workbookIdRef.current = workbookId; worksheetIdRef.current = worksheetId;
  }, []);

  useEffect(() => { statsEngine.healthCheck().then(isHealthy => { if (!isHealthy) console.warn('⚠️ FastAPI backend not running.'); }); }, []);
  useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(null), 5000); return () => clearTimeout(timer); } }, [notification, setNotification]);

  const getAvailableGraphs = () => {
    return [
      {
        id: 'summary', label: 'Summary Stats',
        isEnabled: true, disabledReason: ''
      },
      {
        id: 'screeplot', label: 'Scree Plot',
        isEnabled: testType === 'Principal Component Analysis (PCA)',
        disabledReason: 'Scree plots are only generated during Principal Component Analysis.'
      },
      {
        id: 'boxplot', label: 'Box Plots',
        isEnabled: ['Independent Samples T-Test', 'Paired Samples T-Test', 'Mann-Whitney U', 'Wilcoxon Signed-Rank', 'Kruskal-Wallis H Test'].includes(testType || ''),
        disabledReason: 'Box plots evaluate median spreads across distinct groups. This test model does not compare distinct groups.'
      },
      {
        id: 'errorbars', label: 'Means (Error Bars)',
        isEnabled: testType === 'One-Way ANOVA',
        disabledReason: 'Error bars visualizing 95% Confidence Intervals are specific to evaluating variance (ANOVA) across multiple group means.'
      },
      {
        id: 'heatmap', label: 'Correlation Heatmap',
        isEnabled: testType === 'Pearson Correlation',
        disabledReason: 'A heatmap requires a calculated matrix of correlation coefficients, which is only generated during Correlation Analysis.'
      },
      {
        id: 'scatter', label: 'Scatter Plot',
        isEnabled: ['Pearson Correlation', 'Ordinary Least Squares (OLS) Regression', 'Simple Linear Regression', 'Multiple Linear Regression'].includes(testType || ''),
        disabledReason: 'Scatter plots map relationships between continuous variables. The current test model evaluates categorical group differences.'
      },
      {
        id: 'residual', label: 'Residual Plot',
        isEnabled: ['Simple Linear Regression', 'Multiple Linear Regression', 'Ordinary Least Squares (OLS) Regression'].includes(testType || ''),
        disabledReason: 'Residual plots chart model error (Actual vs Fitted). You must run a Predictive Regression Model to generate residuals.'
      },
      {
        id: 'distributions', label: 'Data Distributions',
        isEnabled: true, disabledReason: ''
      }
    ];
  };

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
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { handleFileUpload(e.target.files[0]); e.target.value = ''; } }} />
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Import Dataset
            </div>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
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
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Checks & Prep</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('preview_data', 'Data Mount Preview', 'min_1')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 border border-blue-200">🔍 Preview Mounted Data</button>
                <button onClick={() => prepareTest('descriptives', 'Descriptive Statistics', 'min_1')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📋 Descriptives</button>
                <button onClick={() => prepareTest('frequencies', 'Frequency Analysis', 'min_1', { allowCategorical: true })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Frequencies & Crosstabs</button>
                <button onClick={() => prepareTest('levene', "Levene's Test", 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">⚖️ Levene's Test</button>
                <button onClick={() => prepareTest('assumptions', "Assumption Diagnostics", '1_n')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">⚖️ Model Assumptions Check</button>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Scale & Dimension</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('reliability', 'Reliability Analysis', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📏 Reliability (Cronbach's)</button>
                <button onClick={() => prepareTest('pca', 'Principal Component Analysis (PCA)', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📉 PCA / Factor Analysis</button>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Parametric Tests</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('ttest', 'Independent T-Test', 'exact_2', { paired: false })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔬 Independent T-Test</button>
                <button onClick={() => prepareTest('ttest', 'Paired T-Test', 'exact_2', { paired: true })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔄 Paired T-Test</button>
                <button onClick={() => prepareTest('anova', 'One-way ANOVA', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📐 One-way ANOVA</button>
                <button onClick={() => prepareTest('anova_posthoc', 'Tukey HSD Post-Hoc', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔍 Tukey HSD Post-Hoc</button>
                <button onClick={() => prepareTest('correlation', 'Pearson Correlation', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔗 Pearson Correlation</button>
                <button onClick={() => prepareTest('regression', 'Simple Linear Regression', 'x_y')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📈 Simple Linear Reg</button>
                <button onClick={() => prepareTest('multiple_regression', 'Multiple Regression', '1_n')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Multiple Linear Reg</button>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Non-Parametric Tests</div>
              <div className="space-y-2">
                <button onClick={() => prepareTest('mannwhitney', 'Mann-Whitney U', 'exact_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Mann-Whitney U</button>
                <button onClick={() => prepareTest('wilcoxon', 'Wilcoxon Signed-Rank', 'exact_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🔄 Wilcoxon Signed-Rank</button>
                <button onClick={() => prepareTest('kruskalWallis', 'Kruskal-Wallis', 'min_2')} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">📊 Kruskal-Wallis</button>
                <button onClick={() => prepareTest('chisquare', 'Chi-Square Test', 'exact_2', { allowCategorical: true })} disabled={isLoading} className="w-full text-left px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50">🎲 Chi-Square</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-black overflow-hidden relative">
          
          <div className={`absolute inset-0 transition-opacity ${activeView === 'data' ? 'opacity-100 z-10' : 'opacity-0 z-[-1] pointer-events-none'}`}>
            <UniverErrorBoundary>
              <UniverSpreadsheet onWorkbookReady={handleWorkbookReady} />
            </UniverErrorBoundary>
          </div>

          <div className={`absolute inset-0 bg-white dark:bg-gray-950 overflow-auto p-8 transition-opacity ${activeView === 'charts' ? 'opacity-100 z-10' : 'opacity-0 z-[-1] pointer-events-none'}`}>
            {results && columnsData ? (
              <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header and Explanation */}
                <div>
                  <h3 className="text-2xl font-bold mb-4">{testType} Results</h3>
                  
                  <div className="bg-gray-50 p-4 border rounded-xl shadow-sm mb-6 flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Custom Chart Title</label>
                      <input type="text" placeholder="e.g. Experiment 1 Results" value={customLabels.title} onChange={e => setCustomLabels({...customLabels, title: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Custom X-Axis Label</label>
                      <input type="text" placeholder="Default variable name" value={customLabels.xAxis} onChange={e => setCustomLabels({...customLabels, xAxis: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Custom Y-Axis Label</label>
                      <input type="text" placeholder="Default variable name" value={customLabels.yAxis} onChange={e => setCustomLabels({...customLabels, yAxis: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 items-center">
                    <span className="text-sm font-bold text-gray-500 mr-2">Render Charts:</span>
                    {getAvailableGraphs().map(graph => (
                      <div key={graph.id} className="relative group inline-block">
                        <button 
                          onClick={() => graph.isEnabled && toggleGraph(graph.id)}
                          disabled={!graph.isEnabled}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                            !graph.isEnabled 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70' 
                              : activeGraphs.includes(graph.id) 
                              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {activeGraphs.includes(graph.id) && graph.isEnabled ? '✓ ' : (!graph.isEnabled ? '🔒 ' : '+ ')}
                          {graph.label}
                        </button>
                        {!graph.isEnabled && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <span className="font-bold text-red-400 block mb-1">Analysis Disabled</span>
                            {graph.disabledReason}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {results.interpretation && (
                    <div className="mb-4 p-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 shadow-sm text-lg">
                      <p>{results.interpretation}</p>
                    </div>
                  )}
                </div>

                {/* --- RENDERED GRAPHS BELOW --- */}

                {activeGraphs.includes('summary') && testType === 'Descriptive Statistics' && (
                  <div className="bg-white border rounded-xl shadow-sm mb-8 animate-in fade-in">
                    <DescriptiveStats columnsData={columnsData} customTitle={customLabels.title} />
                  </div>
                )}

                {activeGraphs.includes('screeplot') && testType === 'Principal Component Analysis (PCA)' && results.eigenvalues && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Scree Plot (Eigenvalues)'}</h3>
                    <PCAScreePlot eigenvalues={results.eigenvalues} customTitle={customLabels.title} />
                    <p className="text-xs text-gray-500 mt-3 text-center">Components with eigenvalues &gt; 1 (above the red line) are typically retained based on Kaiser's Criterion.</p>
                  </div>
                )}

                {activeGraphs.includes('errorbars') && testType === 'One-Way ANOVA' && results.group_statistics && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Group Means with 95% Confidence Intervals'}</h3>
                    <BarWithErrorBars groups={Object.fromEntries(results.group_statistics.map((g: any) => [g.name, { mean: g.mean, std: g.std, n: g.n }]))} customY={customLabels.yAxis} />
                  </div>
                )}

                {activeGraphs.includes('boxplot') && ['Independent Samples T-Test', 'Paired Samples T-Test', 'Mann-Whitney U', 'Wilcoxon Signed-Rank', 'Kruskal-Wallis H Test'].includes(testType || '') && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Group Comparison (Box Plot)'}</h3>
                    {testType === 'Kruskal-Wallis H Test' ? (
                        <GroupBoxPlot groups={columnsData} customY={customLabels.yAxis} />
                    ) : (
                        <GroupBoxPlot groups={{
                          [results.group1?.name || 'Group 1']: columnsData[results.group1?.name] || [],
                          [results.group2?.name || 'Group 2']: columnsData[results.group2?.name] || []
                        }} customY={customLabels.yAxis} />
                    )}
                  </div>
                )}

                {activeGraphs.includes('heatmap') && testType === 'Pearson Correlation' && results.pearson_matrix && (
                   <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                     <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Correlation Matrix Heatmap'}</h3>
                     <CorrelationHeatmap matrix={results.pearson_matrix} variables={results.variables} />
                   </div>
                )}

                {activeGraphs.includes('scatter') && ['Pearson Correlation', 'Ordinary Least Squares (OLS) Regression', 'Simple Linear Regression', 'Multiple Linear Regression'].includes(testType || '') && (
                  <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Scatter Plot'}</h3>
                    
                    {testType === 'Multiple Linear Regression' && results.diagnostics ? (
                      <ScatterWithRegression 
                        x={results.diagnostics.fitted} 
                        y={results.diagnostics.fitted.map((fit: number, i: number) => fit + results.diagnostics.residuals[i])} 
                        xName="Predicted (Fitted) Values" 
                        yName={results.outcome}
                        customX={customLabels.xAxis}
                        customY={customLabels.yAxis}
                      />
                    ) : (
                      <ScatterWithRegression 
                        x={columnsData[results.variables?.[0] || results.predictor || Object.keys(columnsData)[0]]}
                        y={columnsData[results.variables?.[1] || results.outcome || Object.keys(columnsData)[1]]}
                        xName={results.variables?.[0] || results.predictor || Object.keys(columnsData)[0]}
                        yName={results.variables?.[1] || results.outcome || Object.keys(columnsData)[1]}
                        customX={customLabels.xAxis}
                        customY={customLabels.yAxis}
                      />
                    )}
                  </div>
                )}

                {activeGraphs.includes('residual') && results.diagnostics && results.diagnostics.residuals && (
                   <div className="bg-white p-6 border rounded-xl shadow-sm animate-in fade-in zoom-in-95">
                     <h3 className="text-lg font-bold mb-4">{customLabels.title || 'Diagnostic: Residual Plot'}</h3>
                     <ResidualPlot 
                       residuals={results.diagnostics.residuals} 
                       fitted={results.diagnostics.fitted} 
                       customX={customLabels.xAxis}
                       customY={customLabels.yAxis}
                     />
                     <p className="text-xs text-gray-500 mt-2">Ideally, points should be randomly dispersed around the horizontal axis, indicating homoscedasticity and linearity.</p>
                   </div>
                )}

                {activeGraphs.includes('distributions') && (
                  <div className="animate-in fade-in">
                    <h3 className="text-xl font-bold mb-4">Data Distributions & Assumption Checks</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(columnsData).map(([name, data]) => (
                        <div key={name} className="border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                          <h4 className="font-bold text-gray-700 mb-4">{name} Distribution</h4>
                          <HistogramChart data={data} columnName={name} customX={customLabels.xAxis} />
                          <div className="mt-8 border-t pt-6">
                            <h4 className="font-bold text-gray-700 mb-4 text-sm">Normality Q-Q Plot</h4>
                            <QQPlot columnName={name} data={data} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Statistical Engine Raw Output</h3>
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