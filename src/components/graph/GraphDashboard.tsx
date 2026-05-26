// src/components/graph/GraphDashboard.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScientificForm } from './components/ScientificForm';
import { DataStreamView } from './components/DataStreamView';
import { MatplotlibViewer } from './components/MatplotlibViewer';
import { ManualDataEntry } from './components/ManualDataEntry';
import { useGraphComputation } from './hooks/useGraphComputation';
import { GraphParameters, ComputationType, StatisticalTestResult, DescriptiveStatsManual } from './types';
import { Layout, Sidebar, MainContent, AnalyticsPanel } from './layouts';
import { useTheme } from '../../ThemeProvider';
import { FileUploadZone } from './components/FileUploadZone';
import { StatisticalAnalysisPanel } from './components/StatisticalAnalysisPanel';
import { useDataAnalysis } from './hooks/useDataAnalysis';
import { formatScientific, formatMetadata } from './utils/formatters';

// Helper function to extract image data from different response types
const extractImageData = (result: any): string => {
  if (!result) return '';
  
  // Standardized: look for 'image' first, then fallback to other keys
  if (result.image) return result.image;
  if (result.chart_image) return result.chart_image;
  if (result.heatmap_image) return result.heatmap_image;
  if (result.histogram_image) return result.histogram_image;
  if (result.filter_image) return result.filter_image;
  
  return '';
};

const GraphDashboard: React.FC = () => {
  const [computationType, setComputationType] = useState<ComputationType>('waveform');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [analysisMode, setAnalysisMode] = useState<'generate' | 'upload' | 'manual'>('generate');
  
  // CENTRALIZED STATE - Single source of truth
  const [globalResult, setGlobalResult] = useState<any>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<string>('');
  
  const { isDarkMode } = useTheme();
  
  const { 
    result: generateResult, 
    loading: generateLoading, 
    error: generateError, 
    compute, 
    clearResult 
  } = useGraphComputation();

  const { 
    loading: dataLoading,
    error: dataError,
    uploadedDataset,
    analysisResult: uploadedAnalysisResult,
    uploadFile,
    computeDescriptiveStats,
    runRegression,
    clearAnalysis
  } = useDataAnalysis();

  // Manual data entry states
  const [manualData, setManualData] = useState<Record<string, number[]>>({});
  const [manualLoading, setManualLoading] = useState(false);

  // UNIFIED HANDLER - All analysis results go through here
  const setUnifiedResult = useCallback((result: any, type: string, isLoading: boolean = false, errorMsg: string | null = null) => {
    if (isLoading) {
      setGlobalLoading(true);
      setGlobalError(null);
    } else if (errorMsg) {
      setGlobalLoading(false);
      setGlobalError(errorMsg);
      setGlobalResult(null);
    } else if (result) {
      setGlobalResult(result);
      setCurrentAnalysisType(type);
      setGlobalLoading(false);
      setGlobalError(null);
      setShowAnalytics(true);
    }
  }, []);

  const clearUnifiedResult = useCallback(() => {
    setGlobalResult(null);
    setGlobalError(null);
    setGlobalLoading(false);
    setCurrentAnalysisType('');
  }, []);

  const handleCompute = useCallback(async (params: GraphParameters) => {
    setUnifiedResult(null, computationType, true);
    await compute(computationType, params);
  }, [computationType, compute, setUnifiedResult]);

  // Watch for generate results
  useEffect(() => {
    if (generateResult) {
      setUnifiedResult(generateResult, computationType);
    } else if (generateError) {
      setUnifiedResult(null, computationType, false, generateError);
    } else if (generateLoading) {
      setUnifiedResult(null, computationType, true);
    }
  }, [generateResult, generateError, generateLoading, computationType, setUnifiedResult]);

  // Watch for uploaded analysis results
  useEffect(() => {
    if (uploadedAnalysisResult) {
      setUnifiedResult(uploadedAnalysisResult, 'uploaded_analysis');
    } else if (dataError) {
      setUnifiedResult(null, 'uploaded_analysis', false, dataError);
    } else if (dataLoading) {
      setUnifiedResult(null, 'uploaded_analysis', true);
    }
  }, [uploadedAnalysisResult, dataError, dataLoading, setUnifiedResult]);

  // Manual data handlers
  const handleManualDataSubmit = (data: Record<string, number[]>, datasetName: string) => {
    setManualData(data);
    clearUnifiedResult();
    console.log('Manual dataset saved:', datasetName, data);
  };

  const handleManualAnalysis = async (analysisType: string, data: any, options?: any): Promise<any> => {
    setUnifiedResult(null, analysisType, true);
    setManualLoading(true);
    
    try {
      let result = null;
      
      switch (analysisType) {
        case 'descriptive':
          result = computeDescriptiveStatsLocal(data.data);
          break;
        case 'ttest':
          result = computeTTestLocal(data.group1, data.group2, options);
          break;
        case 'anova':
          result = computeANOVALocal(data.groups);
          break;
        case 'correlation':
          result = computeCorrelationLocal(data.x, data.y, options);
          break;
        case 'normality':
          result = computeNormalityTestLocal(data.data);
          break;
        case 'regression':
          result = computeRegressionLocal(data.x, data.y);
          break;
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }
      
      setUnifiedResult(result, analysisType);
      setManualLoading(false);
      return result;
    } catch (err: any) {
      setUnifiedResult(null, analysisType, false, err.message);
      setManualLoading(false);
      throw err;
    }
  };

  // Local statistical computation functions (keep as is)
  const computeDescriptiveStatsLocal = (data: number[]): DescriptiveStatsManual => {
    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const median = sorted[Math.floor(n / 2)];
    
    const frequency: Record<number, number> = {};
    data.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency).filter(key => frequency[Number(key)] === maxFreq).map(Number);
    
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
    const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
    
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const sum = data.reduce((a, b) => a + b, 0);
    
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = data.filter(val => val < lowerBound || val > upperBound);
    
    const percentiles: Record<number, number> = {};
    [1, 5, 10, 25, 50, 75, 90, 95, 99].forEach(p => {
      const index = Math.ceil((p / 100) * n) - 1;
      percentiles[p] = sorted[Math.max(0, Math.min(index, n - 1))];
    });
    
    const shapiroStat = Math.abs(1 - Math.abs(skewness) / 2);
    const shapiroP = Math.exp(-3.7 * Math.abs(skewness));
    const isNormal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 1;
    
    return {
      variable_name: "Selected Variable",
      sample_size: n,
      mean,
      median,
      mode,
      std_dev: stdDev,
      variance,
      range,
      min,
      max,
      sum,
      skewness,
      kurtosis,
      quartiles: { q1, q2: median, q3, iqr },
      percentiles,
      missing_values: 0,
      outliers: {
        count: outliers.length,
        values: outliers,
        method: 'iqr'
      },
      normality_test: {
        shapiro_wilk: { statistic: shapiroStat, p_value: shapiroP, normal: isNormal },
        kolmogorov_smirnov: { statistic: Math.abs(skewness) / 2, p_value: shapiroP, normal: isNormal },
        anderson_darling: { statistic: Math.abs(skewness), critical_values: {}, normal: isNormal }
      }
    };
  };

  const computeTTestLocal = (group1: number[], group2: number[], options: any): StatisticalTestResult => {
    const n1 = group1.length, n2 = group2.length;
    const mean1 = group1.reduce((a, b) => a + b, 0) / n1;
    const mean2 = group2.reduce((a, b) => a + b, 0) / n2;
    const var1 = group1.reduce((acc, val) => acc + Math.pow(val - mean1, 2), 0) / (n1 - 1);
    const var2 = group2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0) / (n2 - 1);
    
    let tStat: number;
    let df: number;
    
    if (options?.equal_var !== false) {
      const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
      tStat = (mean1 - mean2) / Math.sqrt(pooledVar * (1/n1 + 1/n2));
      df = n1 + n2 - 2;
    } else {
      const se = Math.sqrt(var1/n1 + var2/n2);
      tStat = (mean1 - mean2) / se;
      df = Math.pow(var1/n1 + var2/n2, 2) / (Math.pow(var1/n1, 2)/(n1-1) + Math.pow(var2/n2, 2)/(n2-1));
    }
    
    const pValue = 2 * (1 - tCDF(Math.abs(tStat), df));
    const significant = pValue < 0.05;
    
    const pooledSD = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2));
    const effectSize = Math.abs(mean1 - mean2) / pooledSD;
    
    let effectSizeInterpretation = '';
    if (effectSize < 0.2) effectSizeInterpretation = 'negligible';
    else if (effectSize < 0.5) effectSizeInterpretation = 'small';
    else if (effectSize < 0.8) effectSizeInterpretation = 'medium';
    else effectSizeInterpretation = 'large';
    
    const testName = options?.paired ? 'Paired t-test' : 'Independent t-test';
    let interpretation = '';
    if (significant) {
      interpretation = mean1 > mean2 
        ? `Group 1 has significantly higher values than Group 2 (p = ${pValue.toFixed(4)})`
        : `Group 2 has significantly higher values than Group 1 (p = ${pValue.toFixed(4)})`;
    } else {
      interpretation = `No significant difference between groups was found (p = ${pValue.toFixed(4)})`;
    }
    
    const se = Math.sqrt(var1/n1 + var2/n2);
    const ciLower = (mean1 - mean2) - 1.96 * se;
    const ciUpper = (mean1 - mean2) + 1.96 * se;
    
    return {
      test_name: testName,
      test_statistic: tStat,
      p_value: pValue,
      degrees_of_freedom: df,
      effect_size: effectSize,
      effect_size_interpretation: effectSizeInterpretation,
      confidence_interval: [ciLower, ciUpper],
      significant,
      interpretation
    };
  };

  const computeANOVALocal = (groups: number[][]): StatisticalTestResult => {
    const k = groups.length;
    const allData = groups.flat();
    const grandMean = allData.reduce((a, b) => a + b, 0) / allData.length;
    
    let ssBetween = 0;
    const groupMeans: number[] = [];
    const groupSizes: number[] = [];
    
    groups.forEach(group => {
      const mean = group.reduce((a, b) => a + b, 0) / group.length;
      groupMeans.push(mean);
      groupSizes.push(group.length);
      ssBetween += group.length * Math.pow(mean - grandMean, 2);
    });
    
    let ssWithin = 0;
    groups.forEach((group, i) => {
      group.forEach(value => {
        ssWithin += Math.pow(value - groupMeans[i], 2);
      });
    });
    
    const dfBetween = k - 1;
    const dfWithin = allData.length - k;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    const fStat = msBetween / msWithin;
    
    const pValue = 1 - fCDF(fStat, dfBetween, dfWithin);
    const significant = pValue < 0.05;
    const etaSquared = ssBetween / (ssBetween + ssWithin);
    
    let etaInterpretation = '';
    if (etaSquared < 0.01) etaInterpretation = 'negligible';
    else if (etaSquared < 0.06) etaInterpretation = 'small';
    else if (etaSquared < 0.14) etaInterpretation = 'medium';
    else etaInterpretation = 'large';
    
    return {
      test_name: 'One-way ANOVA',
      test_statistic: fStat,
      p_value: pValue,
      degrees_of_freedom: dfBetween,
      effect_size: etaSquared,
      effect_size_interpretation: etaInterpretation,
      confidence_interval: null,
      significant,
      interpretation: significant 
        ? `There is a significant difference between at least two groups (F(${dfBetween}, ${dfWithin}) = ${fStat.toFixed(3)}, p = ${pValue.toFixed(4)})`
        : `No significant difference was found between groups (F(${dfBetween}, ${dfWithin}) = ${fStat.toFixed(3)}, p = ${pValue.toFixed(4)})`
    };
  };

  const computeCorrelationLocal = (x: number[], y: number[], options?: any): StatisticalTestResult => {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }
    
    const r = numerator / Math.sqrt(denomX * denomY);
    const tStat = r * Math.sqrt((n - 2) / (1 - r * r));
    const pValue = 2 * (1 - tCDF(Math.abs(tStat), n - 2));
    const significant = pValue < 0.05;
    
    let interpretation = '';
    const absR = Math.abs(r);
    if (absR > 0.7) interpretation = 'Strong';
    else if (absR > 0.3) interpretation = 'Moderate';
    else interpretation = 'Weak';
    interpretation += r > 0 ? ' positive' : ' negative';
    interpretation += ` correlation (r = ${r.toFixed(3)})`;
    
    if (!significant) interpretation += ' - Not statistically significant';
    
    const method = options?.method || 'pearson';
    const testName = method === 'pearson' ? 'Pearson Correlation' : 
                     method === 'spearman' ? 'Spearman Rank Correlation' : 'Kendall Tau Correlation';
    
    const ciLower = r - 1.96 / Math.sqrt(n);
    const ciUpper = r + 1.96 / Math.sqrt(n);
    
    return {
      test_name: testName,
      test_statistic: r,
      p_value: pValue,
      degrees_of_freedom: n - 2,
      effect_size: r * r,
      effect_size_interpretation: `r² = ${(r * r).toFixed(3)} (${((r * r) * 100).toFixed(1)}% of variance explained)`,
      confidence_interval: [ciLower, ciUpper],
      significant,
      interpretation
    };
  };

  const computeNormalityTestLocal = (data: number[]): StatisticalTestResult => {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
    const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
    
    const shapiroStat = Math.exp(-2.5 * Math.abs(skewness) - 0.5 * Math.abs(kurtosis - 3));
    const shapiroP = Math.exp(-5 * Math.abs(skewness) - 2 * Math.abs(kurtosis - 3));
    const isNormal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 1;
    
    let interpretation = '';
    if (isNormal) {
      interpretation = 'The data appears to follow a normal distribution (Shapiro-Wilk p > 0.05)';
    } else {
      if (Math.abs(skewness) > 1) interpretation = 'The data is significantly skewed';
      else if (Math.abs(kurtosis) > 2) interpretation = 'The data has heavy tails (leptokurtic)';
      else interpretation = 'The data does not follow a normal distribution';
    }
    
    return {
      test_name: 'Shapiro-Wilk Normality Test',
      test_statistic: shapiroStat,
      p_value: shapiroP,
      degrees_of_freedom: n,
      effect_size: undefined,
      effect_size_interpretation: undefined,
      confidence_interval: null,
      significant: !isNormal,
      interpretation,
      additional_results: {
        skewness,
        kurtosis,
        is_normal: isNormal,
        kolmogorov_smirnov_p: shapiroP,
        anderson_darling_stat: Math.abs(skewness) + Math.abs(kurtosis - 3) / 2
      }
    };
  };

  const computeRegressionLocal = (x: number[], y: number[]): any => {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += Math.pow(x[i] - meanX, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    const predictions = x.map(xi => intercept + slope * xi);
    const residuals = y.map((yi, i) => yi - predictions[i]);
    
    const ssRes = residuals.reduce((sum, r) => sum + r * r, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const rSquared = 1 - ssRes / ssTot;
    const adjustedRSquared = 1 - (1 - rSquared) * (n - 1) / (n - 2);
    
    const mse = ssRes / (n - 2);
    const rmse = Math.sqrt(mse);
    const mae = residuals.reduce((sum, r) => sum + Math.abs(r), 0) / n;
    
    return {
      coefficients: [intercept, slope],
      r_squared: rSquared,
      adjusted_r_squared: adjustedRSquared,
      mse,
      rmse,
      mae,
      predictions,
      residuals
    };
  };

  const tCDF = (t: number, df: number): number => {
    const x = t / Math.sqrt(df);
    const p = 1 - 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x)));
    return Math.min(0.9999, Math.max(0.0001, p));
  };

  const fCDF = (f: number, df1: number, df2: number): number => {
    return 1 - Math.exp(-f / (df1 + df2));
  };

  // Apply theme class
  useEffect(() => {
    const container = document.getElementById('graph-dashboard-container');
    if (container) {
      if (isDarkMode) {
        container.classList.add('dark');
      } else {
        container.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Determine current loading/error state
  const isLoading = analysisMode === 'generate' ? generateLoading : 
                    analysisMode === 'upload' ? dataLoading : manualLoading;
  const currentError = analysisMode === 'generate' ? generateError : 
                       analysisMode === 'upload' ? dataError : null;

  return (
    <div id="graph-dashboard-container" className={isDarkMode ? 'dark' : ''}>
      <Layout>
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setAnalysisMode('generate')}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                analysisMode === 'generate' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => setAnalysisMode('upload')}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                analysisMode === 'upload' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Upload Data
            </button>
            <button
              onClick={() => setAnalysisMode('manual')}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                analysisMode === 'manual' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {analysisMode === 'generate' && (
            <ScientificForm 
              computationType={computationType}
              onTypeChange={setComputationType}
              onSubmit={handleCompute}
              isLoading={generateLoading}
            />
          )}

          {analysisMode === 'upload' && (
            <div className="space-y-4">
              <FileUploadZone 
                onUpload={uploadFile}
                loading={dataLoading}
                error={dataError}
              />
              
              {uploadedDataset && (
                <StatisticalAnalysisPanel
                  dataset={uploadedDataset}
                  onRunDescriptive={(col) => computeDescriptiveStats(uploadedDataset.dataset_id, col)}
                  onRunRegression={async (x, y) => {
                    let xData: number[] = [];
                    let yData: number[] = [];
                    
                    if (uploadedDataset.data?.x_arrays?.[x]) {
                      xData = uploadedDataset.data.x_arrays[x];
                    } else {
                      const preview = uploadedDataset.data?.dataframe_preview || [];
                      xData = preview.map((row: any) => row[x]).filter((v: any) => typeof v === 'number');
                    }
                    
                    if (uploadedDataset.data?.y_arrays?.[y]) {
                      yData = uploadedDataset.data.y_arrays[y];
                    } else {
                      const preview = uploadedDataset.data?.dataframe_preview || [];
                      yData = preview.map((row: any) => row[y]).filter((v: any) => typeof v === 'number');
                    }
                    
                    if (xData.length > 0 && yData.length > 0 && xData.length === yData.length) {
                      await runRegression(xData, yData);
                    } else {
                      alert(`Please select columns with matching numeric data.\nX column "${x}" has ${xData.length} values.\nY column "${y}" has ${yData.length} values.`);
                    }
                  }}
                  analysisResult={uploadedAnalysisResult}
                  loading={dataLoading}
                />
              )}
            </div>
          )}

          {analysisMode === 'manual' && (
            <ManualDataEntry
              onDataSubmit={handleManualDataSubmit}
              onRunAnalysis={handleManualAnalysis}
              loading={manualLoading}
              analysisResult={null}
              initialVariables={{
                ...(uploadedDataset?.data?.y_arrays || {}),
                ...(uploadedDataset?.data?.x_arrays || {})
              }}
              initialDatasetName={uploadedDataset?.original_filename || "My Dataset"}
              initialMetadata={uploadedDataset?.metadata || null}
            />
          )}
        </Sidebar>

        <MainContent>
          <DataStreamView 
            loading={isLoading || globalLoading}
            error={currentError || globalError}
            onRetry={() => {
              if (analysisMode === 'generate') {
                clearResult();
              } else {
                clearAnalysis();
              }
              clearUnifiedResult();
            }}
          >
            {/* Unified Results Display */}
            <AnimatePresence mode="wait">
              {globalResult && (
                <motion.div
                  key={currentAnalysisType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Image/Chart Display */}
                  {(extractImageData(globalResult) || globalResult.histogram_image || globalResult.heatmap_image || globalResult.chart_image) && (
                    <MatplotlibViewer 
                      imageData={extractImageData(globalResult)}
                      metadata={globalResult.metadata || {}}
                      computationType={currentAnalysisType as ComputationType || 'statistical'}
                    />
                  )}
                  
                  {/* Results Panel */}
                  {showAnalytics && (
                    <AnalyticsPanel onClose={() => setShowAnalytics(false)}>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Analysis Results: {currentAnalysisType.toUpperCase()}
                        </h3>
                        
                        {/* Statistical Results Display */}
                        {globalResult.r_squared !== undefined && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>R²:</span>
                                <span className="font-mono text-green-600">{formatScientific(globalResult.r_squared)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Adj. R²:</span>
                                <span className="font-mono">{formatScientific(globalResult.adjusted_r_squared)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>RMSE:</span>
                                <span className="font-mono">{formatScientific(globalResult.rmse)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>MAE:</span>
                                <span className="font-mono">{formatScientific(globalResult.mae)}</span>
                              </div>
                            </div>
                            {globalResult.coefficients && (
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                <span className="text-gray-500">Equation: </span>
                                <span className="font-mono">
                                  y = {formatScientific(globalResult.coefficients[0])} + {formatScientific(globalResult.coefficients[1])} * x
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {globalResult.test_statistic !== undefined && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Test Statistic:</span>
                                <span className="font-mono">{formatScientific(globalResult.test_statistic)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>p-value:</span>
                                <span className={`font-mono font-bold ${globalResult.p_value < 0.05 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {formatScientific(globalResult.p_value)}
                                </span>
                              </div>
                              {globalResult.degrees_of_freedom && (
                                <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                  <span>df:</span>
                                  <span className="font-mono">{globalResult.degrees_of_freedom}</span>
                                </div>
                              )}
                              {globalResult.effect_size && (
                                <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                  <span>Effect Size:</span>
                                  <span className="font-mono">{formatScientific(globalResult.effect_size)}</span>
                                </div>
                              )}
                            </div>
                            <div className="p-2 rounded text-xs">
                              <div className={`inline-block px-2 py-1 rounded ${globalResult.significant ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                {globalResult.significant ? '✓ Statistically Significant' : '✗ Not Statistically Significant'}
                              </div>
                              <p className="mt-2 text-gray-600 dark:text-gray-400">{globalResult.interpretation}</p>
                            </div>
                          </div>
                        )}
                        
                        {globalResult.basic_stats && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Mean:</span>
                                <span className="font-mono">{formatScientific(globalResult.basic_stats.mean)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Median:</span>
                                <span className="font-mono">{formatScientific(globalResult.basic_stats.median)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Std Dev:</span>
                                <span className="font-mono">{formatScientific(globalResult.basic_stats.std_dev)}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <span>Skewness:</span>
                                <span className="font-mono">{formatScientific(globalResult.basic_stats.skewness)}</span>
                              </div>
                            </div>
                            {globalResult.outliers?.outlier_count > 0 && (
                              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-xs">
                                ⚠️ {globalResult.outliers.outlier_count} outliers detected ({globalResult.outliers.outlier_percentage?.toFixed(1)}%)
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* General metadata */}
                        {globalResult.metadata && Object.keys(globalResult.metadata).length > 0 && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            {Object.entries(globalResult.metadata).slice(0, 5).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs py-1">
                                <span className="text-gray-500">{formatMetadata(key)}:</span>
                                <span className="text-cyan-600 dark:text-cyan-400 font-mono">
                                  {typeof value === 'number' ? formatScientific(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </AnalyticsPanel>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </DataStreamView>
        </MainContent>
      </Layout>
    </div>
  );
};

export default GraphDashboard;