// src/components/graph/components/StatisticalAnalysisPanel.tsx
import React, { useState } from 'react';
import { BarChart3, TrendingUp, TestTube, Activity, Calculator } from 'lucide-react';

interface StatisticalAnalysisPanelProps {
  dataset: any;
  onRunDescriptive: (column: string) => Promise<void>;
  onRunRegression: (xCol: string, yCol: string) => Promise<any>;
  analysisResult: any;
  loading: boolean;
}

export const StatisticalAnalysisPanel: React.FC<StatisticalAnalysisPanelProps> = ({
  dataset,
  onRunDescriptive,
  onRunRegression,
  analysisResult,
  loading
}) => {
  const [selectedTab, setSelectedTab] = useState<'descriptive' | 'regression' | 'hypothesis'>('descriptive');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [regressionResult, setRegressionResult] = useState<any>(null);
  const [regressionLoading, setRegressionLoading] = useState(false);

  const columns = dataset?.metadata?.column_names || [];

  const handleRunRegression = async () => {
    if (!xColumn || !yColumn) {
      console.log('Please select both X and Y columns');
      return;
    }
    
    console.log('Running regression with:', { xColumn, yColumn });
    setRegressionLoading(true);
    
    try {
      const result = await onRunRegression(xColumn, yColumn);
      console.log('Regression result:', result);
      setRegressionResult(result);
    } catch (error) {
      console.error('Regression error:', error);
    } finally {
      setRegressionLoading(false);
    }
  };

  const renderDescriptiveTab = () => (
    <div className="space-y-4">
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
      >
        <option value="">Select column</option>
        {columns.map((col: string) => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>
      
      <button
        onClick={() => selectedColumn && onRunDescriptive(selectedColumn)}
        disabled={!selectedColumn || loading}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg"
      >
        {loading ? 'Computing...' : 'Compute Statistics'}
      </button>

      {analysisResult && 'basic_stats' in analysisResult && (
        <div className="mt-4 space-y-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Statistics for {analysisResult.column}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Mean:</div>
            <div className="font-mono">{analysisResult.basic_stats.mean?.toFixed(4)}</div>
            <div className="text-gray-500">Median:</div>
            <div className="font-mono">{analysisResult.basic_stats.median?.toFixed(4)}</div>
            <div className="text-gray-500">Std Dev:</div>
            <div className="font-mono">{analysisResult.basic_stats.std_dev?.toFixed(4)}</div>
            <div className="text-gray-500">Skewness:</div>
            <div className="font-mono">{analysisResult.basic_stats.skewness?.toFixed(4)}</div>
            <div className="text-gray-500">Kurtosis:</div>
            <div className="font-mono">{analysisResult.basic_stats.kurtosis?.toFixed(4)}</div>
          </div>
          
          {analysisResult.outliers?.outlier_count > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-xs">
              ⚠️ {analysisResult.outliers.outlier_count} outliers detected ({analysisResult.outliers.outlier_percentage?.toFixed(1)}%)
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderRegressionTab = () => {
    const resultToShow = regressionResult || analysisResult;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">X Column (Independent)</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            <option value="">Select X column</option>
            {columns.map((col: string) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Y Column (Dependent)</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            <option value="">Select Y column</option>
            {columns.map((col: string) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleRunRegression}
          disabled={!xColumn || !yColumn || regressionLoading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg flex items-center justify-center gap-2"
        >
          {regressionLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running Regression...
            </>
          ) : (
            <>
              <Calculator size={16} />
              Run Regression
            </>
          )}
        </button>

        {resultToShow && 'r_squared' in resultToShow && (
          <div className="mt-4 space-y-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Regression Results</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">R²:</span>
                <span className="font-mono font-bold text-green-600">
                  {resultToShow.r_squared?.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Adj. R²:</span>
                <span className="font-mono">{resultToShow.adjusted_r_squared?.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RMSE:</span>
                <span className="font-mono">{resultToShow.rmse?.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">MAE:</span>
                <span className="font-mono">{resultToShow.mae?.toFixed(4)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm">
                <span className="text-gray-500">Equation: </span>
                <span className="font-mono">
                  y = {resultToShow.coefficients?.[0]?.toFixed(4)} + {resultToShow.coefficients?.[1]?.toFixed(4)} * x
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHypothesisTab = () => {
    const variableData: Record<string, number[]> = {};
    columns.forEach((col: string) => {
      const colData = dataset?.data?.y_arrays?.[col] || 
                     dataset?.data?.dataframe_preview?.map((row: any) => row[col]).filter((v: any) => typeof v === 'number');
      if (colData && colData.length > 0) {
        variableData[col] = colData;
      }
    });

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📊 Hypothesis Testing Available Variables:
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.keys(variableData).map(v => (
              <span key={v} className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 rounded">
                {v}
              </span>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <Activity size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Coming soon: t-tests, ANOVA, Mann-Whitney U</p>
          <p className="text-xs mt-1">Use Manual Data Entry for full hypothesis testing</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSelectedTab('descriptive')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedTab === 'descriptive'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 size={14} className="inline mr-1" />
          Descriptive
        </button>
        <button
          onClick={() => setSelectedTab('regression')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedTab === 'regression'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <TrendingUp size={14} className="inline mr-1" />
          Regression
        </button>
        <button
          onClick={() => setSelectedTab('hypothesis')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedTab === 'hypothesis'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <TestTube size={14} className="inline mr-1" />
          Hypothesis
        </button>
      </div>

      {selectedTab === 'descriptive' && renderDescriptiveTab()}
      {selectedTab === 'regression' && renderRegressionTab()}
      {selectedTab === 'hypothesis' && renderHypothesisTab()}
    </div>
  );
};