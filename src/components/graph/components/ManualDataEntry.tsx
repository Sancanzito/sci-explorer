// src/components/graph/components/ManualDataEntry.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Brain, Edit3, Save, Download,
  Calculator, Sigma, Target, TrendingUp, CheckCircle,
  XCircle, Copy, FileSpreadsheet
} from 'lucide-react';

interface ManualDataEntryProps {
  onDataSubmit: (data: Record<string, number[]>, datasetName: string) => void;
  onRunAnalysis: (analysisType: string, data: any, options?: any) => Promise<any>;
  loading: boolean;
  analysisResult?: any;
  initialVariables?: Record<string, number[]>;
  initialDatasetName?: string;
  initialMetadata?: any;
}

type AnalysisType = 'descriptive' | 'ttest' | 'anova' | 'correlation' | 'normality' | 'regression';

export const ManualDataEntry: React.FC<ManualDataEntryProps> = ({
  onDataSubmit,
  onRunAnalysis,
  loading,
  analysisResult,
  initialVariables,
  initialDatasetName,
  initialMetadata
}) => {
  const [variables, setVariables] = useState<Record<string, number[]>>(
    initialVariables && Object.keys(initialVariables).length > 0 
      ? initialVariables 
      : { 'Variable_1': [1, 2, 3, 4, 5], 'Variable_2': [2, 4, 6, 8, 10] }
  );
  const [datasetName, setDatasetName] = useState(initialDatasetName || 'My Dataset');
  const [metadata, setMetadata] = useState(initialMetadata);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('descriptive');
  const [showDataEditor, setShowDataEditor] = useState(true);
  const [selectedVar1, setSelectedVar1] = useState('');
  const [selectedVar2, setSelectedVar2] = useState('');
  const [analysisOptions, setAnalysisOptions] = useState({
    paired: false,
    equal_var: true,
    alternative: 'two-sided' as 'two-sided' | 'greater' | 'less',
    method: 'pearson' as 'pearson' | 'spearman' | 'kendall',
    confidence_level: 0.95
  });
  const [localResult, setLocalResult] = useState<any>(null);
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  const variableNames = Object.keys(variables);
  const rowCount = Math.max(...Object.values(variables).map(arr => arr.length), 0);

  // Update when uploaded data is received
  useEffect(() => {
    if (initialVariables && Object.keys(initialVariables).length > 0) {
      setVariables(initialVariables);
      setDatasetName(initialDatasetName || 'Uploaded Dataset');
      setMetadata(initialMetadata);
      setShowImportSuccess(true);
      setTimeout(() => setShowImportSuccess(false), 3000);
    }
  }, [initialVariables, initialDatasetName, initialMetadata]);

  const addVariable = () => {
    const newVarName = `Variable_${variableNames.length + 1}`;
    setVariables({ ...variables, [newVarName]: new Array(rowCount || 5).fill(0) });
  };

  const removeVariable = (varName: string) => {
    const newVars = { ...variables };
    delete newVars[varName];
    setVariables(newVars);
  };

  const addRow = () => {
    const newVars = { ...variables };
    variableNames.forEach(varName => {
      newVars[varName] = [...newVars[varName], 0];
    });
    setVariables(newVars);
  };

  const deleteRow = (rowIndex: number) => {
    const newVars = { ...variables };
    variableNames.forEach(varName => {
      newVars[varName] = newVars[varName].filter((_, idx) => idx !== rowIndex);
    });
    setVariables(newVars);
  };

  const updateCell = (rowIndex: number, varName: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newVars = { ...variables };
      const newArray = [...newVars[varName]];
      newArray[rowIndex] = numValue;
      newVars[varName] = newArray;
      setVariables(newVars);
    }
  };

  const updateVariableName = (oldName: string, newName: string) => {
    if (newName && newName !== oldName && !variables[newName]) {
      const newVars = { ...variables };
      newVars[newName] = newVars[oldName];
      delete newVars[oldName];
      setVariables(newVars);
    }
  };

  const loadSampleDataset = () => {
    const sampleData = {
      'Temperature': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      'Reaction_Rate': [0.23, 0.45, 0.89, 1.56, 2.34, 3.12, 4.23, 5.67, 7.45, 9.23],
      'Pressure': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.4, 1.6, 1.8]
    };
    setVariables(sampleData);
    setDatasetName('Sample Dataset');
    setMetadata(null);
    setLocalResult(null);
  };

  const handleSubmitData = () => {
    onDataSubmit(variables, datasetName);
    setLocalResult(null);
  };

  const exportToCSV = () => {
    const headers = variableNames.join(',');
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const row = variableNames.map(varName => variables[varName][i] ?? '').join(',');
      rows.push(row);
    }
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunAnalysis = async () => {
    let result = null;
    switch (selectedAnalysis) {
      case 'descriptive':
        if (selectedVar1) result = await onRunAnalysis('descriptive', { data: variables[selectedVar1] });
        break;
      case 'ttest':
        if (selectedVar1 && selectedVar2) result = await onRunAnalysis('ttest', { group1: variables[selectedVar1], group2: variables[selectedVar2] }, analysisOptions);
        break;
      case 'correlation':
        if (selectedVar1 && selectedVar2) result = await onRunAnalysis('correlation', { x: variables[selectedVar1], y: variables[selectedVar2] }, analysisOptions);
        break;
      case 'regression':
        if (selectedVar1 && selectedVar2) result = await onRunAnalysis('regression', { x: variables[selectedVar1], y: variables[selectedVar2] });
        break;
      case 'anova':
        if (variableNames.length >= 3) result = await onRunAnalysis('anova', { groups: Object.values(variables) });
        break;
      case 'normality':
        if (selectedVar1) result = await onRunAnalysis('normality', { data: variables[selectedVar1] });
        break;
    }
    setLocalResult(result);
  };

  const renderResults = () => {
    const resultToShow = localResult || analysisResult;
    if (!resultToShow) return null;

    if (resultToShow.basic_stats || (resultToShow.mean !== undefined)) {
      const stats = resultToShow.basic_stats || resultToShow;
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><Sigma size={16} /> Descriptive Statistics - {resultToShow.column || selectedVar1}</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Sample Size:</span><span className="font-mono">{resultToShow.sample_size || stats.n || rowCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Mean:</span><span className="font-mono text-blue-600">{stats.mean?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Median:</span><span className="font-mono">{stats.median?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Std Dev:</span><span className="font-mono">{stats.std_dev?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Min:</span><span className="font-mono">{stats.min?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Max:</span><span className="font-mono">{stats.max?.toFixed(4)}</span></div>
            {stats.skewness !== undefined && <div className="flex justify-between"><span className="text-gray-500">Skewness:</span><span className="font-mono">{stats.skewness?.toFixed(4)}</span></div>}
            {stats.kurtosis !== undefined && <div className="flex justify-between"><span className="text-gray-500">Kurtosis:</span><span className="font-mono">{stats.kurtosis?.toFixed(4)}</span></div>}
          </div>
        </motion.div>
      );
    } else if (resultToShow.test_statistic !== undefined) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
          <h4 className="font-semibold mb-3">{resultToShow.test_name}</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Test Statistic:</span><span className="font-mono">{resultToShow.test_statistic?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">p-value:</span><span className={`font-mono font-bold ${resultToShow.p_value < 0.05 ? 'text-green-600' : 'text-orange-600'}`}>{resultToShow.p_value?.toFixed(6)}</span></div>
            {resultToShow.effect_size && <div className="flex justify-between"><span className="text-gray-500">Effect Size:</span><span className="font-mono">{resultToShow.effect_size?.toFixed(4)}</span></div>}
          </div>
          <div className="mt-3 pt-2 border-t"><p className="text-sm">{resultToShow.interpretation}</p></div>
        </motion.div>
      );
    } else if (resultToShow.r_squared !== undefined) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
          <h4 className="font-semibold mb-3">Regression Analysis</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">R²:</span><span className="font-mono font-bold text-purple-600">{resultToShow.r_squared?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Adj. R²:</span><span className="font-mono">{resultToShow.adjusted_r_squared?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">RMSE:</span><span className="font-mono">{resultToShow.rmse?.toFixed(4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">MAE:</span><span className="font-mono">{resultToShow.mae?.toFixed(4)}</span></div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderAnalysisOptions = () => {
    if (selectedAnalysis === 'ttest' || selectedAnalysis === 'correlation' || selectedAnalysis === 'regression') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Variable X / Group 1</label>
            <select value={selectedVar1} onChange={(e) => setSelectedVar1(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm">
              <option value="">Select variable</option>
              {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Variable Y / Group 2</label>
            <select value={selectedVar2} onChange={(e) => setSelectedVar2(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm">
              <option value="">Select variable</option>
              {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      );
    }
    if (selectedAnalysis === 'descriptive' || selectedAnalysis === 'normality') {
      return (
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Select Variable</label>
          <select value={selectedVar1} onChange={(e) => setSelectedVar1(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm">
            <option value="">Select variable</option>
            {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      );
    }
    if (selectedAnalysis === 'anova') {
      return (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-sm">
          📊 One-way ANOVA will compare <strong>{variableNames.length}</strong> groups
        </div>
      );
    }
    return null;
  };

  const canRunAnalysis = () => {
    if (selectedAnalysis === 'descriptive' || selectedAnalysis === 'normality') return selectedVar1;
    if (selectedAnalysis === 'ttest' || selectedAnalysis === 'correlation' || selectedAnalysis === 'regression') return selectedVar1 && selectedVar2;
    if (selectedAnalysis === 'anova') return variableNames.length >= 3;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Import Success Notification */}
      <AnimatePresence>
        {showImportSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> ✅ Imported: {variableNames.length} variables, {rowCount} rows
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dataset Header */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg">
        <div>
          <h4 className="font-medium text-cyan-800 dark:text-cyan-300">{datasetName}</h4>
          <p className="text-xs text-cyan-600 dark:text-cyan-400">{rowCount} rows × {variableNames.length} columns</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSampleDataset} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">📊 Sample</button>
          <button onClick={exportToCSV} className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"><Download size={12} /> CSV</button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setShowDataEditor(true)} className={`px-4 py-2 text-sm font-medium ${showDataEditor ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
          <Edit3 size={14} className="inline mr-1" /> Data Table
        </button>
        <button onClick={() => setShowDataEditor(false)} className={`px-4 py-2 text-sm font-medium ${!showDataEditor ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
          <Brain size={14} className="inline mr-1" /> Analysis
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showDataEditor ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Data Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-12">#</th>
                    {variableNames.map(varName => (
                      <th key={varName} className="px-2 py-2 text-left text-xs font-medium text-gray-500 min-w-[100px]">
                        <input type="text" value={varName} onChange={(e) => updateVariableName(varName, e.target.value)} className="w-full px-1 py-0.5 bg-transparent border-b border-gray-300 focus:border-cyan-500 focus:outline-none text-xs font-medium" />
                      </th>
                    ))}
                    <th className="px-2 py-2 text-center w-10">🗑️</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rowCount }).map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-3 py-1 text-xs text-gray-400">{rowIdx + 1}</td>
                      {variableNames.map(varName => (
                        <td key={varName} className="px-2 py-1">
                          <input type="number" value={variables[varName][rowIdx] ?? ''} onChange={(e) => updateCell(rowIdx, varName, e.target.value)} className="w-full px-2 py-1 text-xs font-mono bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600 focus:border-cyan-500 focus:outline-none" step="any" />
                        </td>
                      ))}
                      <td className="px-2 py-1 text-center">
                        <button onClick={() => deleteRow(rowIdx)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button onClick={addRow} className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 text-sm"><Plus size={16} /> Add Row</button>
              <button onClick={addVariable} className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 text-sm"><Plus size={16} /> Add Column</button>
              <button onClick={handleSubmitData} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Analysis Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['descriptive', 'ttest', 'anova', 'correlation', 'normality', 'regression'] as AnalysisType[]).map((type) => (
                <button key={type} onClick={() => { setSelectedAnalysis(type); setLocalResult(null); }} className={`px-2 py-2 text-xs rounded-lg ${selectedAnalysis === type ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
                  {type === 'descriptive' && '📊 Descriptive'} {type === 'ttest' && '📈 t-Test'} {type === 'anova' && '📉 ANOVA'} {type === 'correlation' && '🔗 Correlation'} {type === 'normality' && '📐 Normality'} {type === 'regression' && '📏 Regression'}
                </button>
              ))}
            </div>

            {/* Analysis Options */}
            {renderAnalysisOptions()}

            {/* Run Button */}
            <button onClick={handleRunAnalysis} disabled={!canRunAnalysis() || loading} className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 text-white rounded-lg flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Computing...</> : <><Calculator size={16} /> Run Analysis</>}
            </button>

            {/* Results */}
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};