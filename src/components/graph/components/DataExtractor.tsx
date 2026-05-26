// src/components/graph/components/DataExtractor.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Download, 
  Copy, 
  ChevronDown, 
  ChevronRight,
  Table,
  BarChart3,
  Activity,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

interface DataExtractorProps {
  dataset: any;
  analysisResult?: any;
  variables?: Record<string, number[]>;
  datasetName?: string;
}

export const DataExtractor: React.FC<DataExtractorProps> = ({
  dataset,
  analysisResult,
  variables = {},
  datasetName = "Dataset"
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dataset_info: true,
    columns: true,
    preview: true,
    statistics: true,
    analysis: false
  });
  const [showRawJson, setShowRawJson] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const downloadJSON = () => {
    const dataToExport = {
      dataset_name: datasetName,
      dataset_info: dataset ? {
        rows: dataset.rows,
        columns: dataset.columns,
        filename: dataset.original_filename,
        dataset_id: dataset.dataset_id
      } : null,
      variables: variables,
      analysis_results: analysisResult,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName.replace(/\s+/g, '_')}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!variables || Object.keys(variables).length === 0) return;
    
    // Find max length
    const maxLength = Math.max(...Object.values(variables).map(arr => arr.length));
    
    // Create CSV rows
    const headers = Object.keys(variables);
    const rows = [];
    
    for (let i = 0; i < maxLength; i++) {
      const row = headers.map(header => variables[header][i] ?? '');
      rows.push(row.join(','));
    }
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName.replace(/\s+/g, '_')}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSection = (title: string, sectionKey: string, icon: React.ReactNode, content: React.ReactNode) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
        </div>
        {expandedSections[sectionKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderDatasetInfo = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-gray-500">Dataset Name:</span>
          <span className="font-mono font-medium">{datasetName}</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-gray-500">Rows:</span>
          <span className="font-mono font-medium">{dataset?.rows || Object.values(variables)[0]?.length || 0}</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-gray-500">Columns/Variables:</span>
          <span className="font-mono font-medium">{dataset?.columns || Object.keys(variables).length}</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-gray-500">File:</span>
          <span className="font-mono font-medium text-xs truncate max-w-[150px]">{dataset?.original_filename || 'Manual Entry'}</span>
        </div>
      </div>
    </div>
  );

  const renderColumns = () => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {Object.keys(variables).map(varName => (
          <div key={varName} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-sm">
            <span className="font-medium text-purple-700 dark:text-purple-300">{varName}</span>
            <span className="text-xs text-purple-500 ml-2">n={variables[varName]?.length || 0}</span>
          </div>
        ))}
      </div>
      {dataset?.metadata?.column_types && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-500">Column Types:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dataset.metadata.column_types).map(([col, type]) => (
              <span key={col} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                {col}: {type as string}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-3 py-2 text-left text-gray-500">Index</th>
            {Object.keys(variables).map(varName => (
              <th key={varName} className="px-3 py-2 text-left text-gray-500">{varName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.min(10, Object.values(variables)[0]?.length || 0) }).map((_, idx) => (
            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-1 text-gray-400">{idx + 1}</td>
              {Object.values(variables).map((arr, colIdx) => (
                <td key={colIdx} className="px-3 py-1 font-mono text-xs">
                  {arr?.[idx]?.toFixed?.(4) ?? arr?.[idx] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(Object.values(variables)[0]?.length || 0) > 10 && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Showing first 10 of {Object.values(variables)[0]?.length} rows
        </p>
      )}
    </div>
  );

  const renderStatistics = () => {
    const computeStats = (arr: number[]) => {
      if (!arr || arr.length === 0) return null;
      const sorted = [...arr].sort((a, b) => a - b);
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const median = sorted[Math.floor(arr.length / 2)];
      const stdDev = Math.sqrt(arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (arr.length - 1));
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return { mean, median, stdDev, min, max };
    };

    return (
      <div className="space-y-3">
        {Object.entries(variables).map(([name, data]) => {
          const stats = computeStats(data);
          if (!stats) return null;
          return (
            <div key={name} className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">{name}</h4>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Mean</div>
                  <div className="font-mono font-medium">{stats.mean.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Median</div>
                  <div className="font-mono font-medium">{stats.median.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Std Dev</div>
                  <div className="font-mono font-medium">{stats.stdDev.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Min</div>
                  <div className="font-mono font-medium">{stats.min.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Max</div>
                  <div className="font-mono font-medium">{stats.max.toFixed(4)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) return <p className="text-gray-500 text-sm">No analysis results yet. Run a test to see results here.</p>;
    
    return (
      <div className="space-y-3">
        <pre className="text-xs overflow-auto p-3 bg-gray-900 text-green-400 rounded-lg max-h-[300px]">
          {JSON.stringify(analysisResult, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header with export buttons */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold flex items-center gap-2">
          <Database size={18} />
          Data Extractor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {showRawJson ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={downloadCSV}
            disabled={Object.keys(variables).length === 0}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded flex items-center gap-1 transition-colors"
          >
            <Table size={12} />
            CSV
          </button>
          <button
            onClick={downloadJSON}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 transition-colors"
          >
            <Download size={12} />
            JSON
          </button>
        </div>
      </div>

      {showRawJson ? (
        <div className="relative">
          <button
            onClick={() => copyToClipboard({ dataset, analysisResult, variables })}
            className="absolute top-2 right-2 p-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            <Copy size={14} />
          </button>
          <pre className="text-xs overflow-auto p-4 bg-gray-900 text-green-400 rounded-lg max-h-[500px]">
            {JSON.stringify({
              dataset_info: dataset ? {
                rows: dataset.rows,
                columns: dataset.columns,
                filename: dataset.original_filename
              } : null,
              variables: variables,
              analysis_results: analysisResult
            }, null, 2)}
          </pre>
        </div>
      ) : (
        <>
          {renderSection('📁 Dataset Information', 'dataset_info', <FileText size={16} />, renderDatasetInfo())}
          {renderSection('📊 Variables / Columns', 'columns', <BarChart3 size={16} />, renderColumns())}
          {renderSection('👁️ Data Preview (First 10 rows)', 'preview', <Table size={16} />, renderPreview())}
          {renderSection('📈 Summary Statistics', 'statistics', <Activity size={16} />, renderStatistics())}
          {renderSection('🔬 Analysis Results', 'analysis', <Database size={16} />, renderAnalysisResults())}
        </>
      )}
    </div>
  );
};