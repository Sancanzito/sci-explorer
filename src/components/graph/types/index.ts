// src/components/graph/types/index.ts

// ============ EXISTING BASE PARAMETERS ============

export interface GraphParameters {
  waveform_type: 'sine' | 'cosine' | 'square' | 'sawtooth' | 'triangle';
  amplitude: number;
  frequency: number;
  phase: number;
  duration: number;
  sample_rate: number;
  smoothing: number;
  compute_fft: boolean;
  noise_level: number;
  filter_type?: 'lowpass' | 'highpass' | 'bandpass' | 'butterworth';
  cutoff_freq?: number;
  filter_order: number;
  matrix_dimensions: [number, number];
  matrix_type: 'random' | 'identity';
  operation_type?: 'eigenvalues' | 'determinant' | 'inverse' | 'svd';
  distribution_type: 'normal' | 'uniform' | 'exponential' | 'poisson';
  sample_size: number;
}

// ============ EXISTING RESPONSE TYPES ============

export interface WaveformResponse {
  x_values: number[];
  y_values: number[];
  chart_image: string;
  fft_data?: { frequencies: number[]; magnitudes: number[] };
  metadata: {
    sample_count: number;
    signal_type: string;
    duration: number;
    [key: string]: any;
  };
}

export interface MatrixResponse {
  matrix: number[][];
  eigenvalues?: number[];
  determinant?: number;
  rank: number;
  condition_number: number;
  heatmap_image: string;
  metadata: {
    dimensions: [number, number];
    operations_performed: string[];
    [key: string]: any;
  };
}

export interface StatisticalResponse {
  data: number[];
  mean: number;
  median: number;
  std_dev: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  quartiles: number[];
  histogram_image: string;
  metadata: {
    sample_size: number;
    distribution: string;
    [key: string]: any;
  };
}

export interface FilterResponse {
  original_signal: number[];
  filtered_signal: number[];
  filter_image: string;
  metadata: {
    filter_type: string;
    cutoff_frequency: number;
    order: number;
    [key: string]: any;
  };
}

// ============ EXISTING TYPES ============

export type ComputationType = 'waveform' | 'matrix' | 'statistical' | 'filter';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ============ DATA ANALYSIS TYPES ============

export interface DatasetInfo {
  dataset_id: string;
  original_filename: string;
  rows: number;
  columns: number;
}

export interface DescriptiveStatsResult {
  column: string;
  sample_size?: number;
  basic_stats: {
    mean: number;
    median: number;
    std_dev: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    range: number;
    iqr: number;
    cv: number;
    mode?: number[];
  };
  percentiles: Record<number, number>;
  distribution: {
    normality_test?: { p_value: number; is_normal: boolean };
    skewness: number;
    kurtosis: number;
    suggested_distribution: string;
  };
  outliers: {
    outlier_count: number;
    outlier_percentage: number;
    outlier_values: number[];
  };
}

export interface HypothesisTestResult {
  test_name: string;
  test_statistic: number;
  p_value: number;
  degrees_of_freedom: number | null;
  effect_size: number | null;
  effect_size_interpretation?: string;
  significant: boolean;
  confidence_interval: [number, number] | null;
  interpretation: string;
  additional_results?: Record<string, any>;
}

export interface RegressionResult {
  coefficients: number[];
  r_squared: number;
  adjusted_r_squared: number;
  mse: number;
  rmse: number;
  mae: number;
  predictions: number[];
  residuals: number[];
  forecast?: {
    future_indices: number[];
    forecast_values: number[];
    lower_bound: number[];
    upper_bound: number[];
  };
}

export interface SpectralResult {
  frequencies: number[];
  power_spectrum: number[];
  peak_frequency: number;
  total_power: number;
  noise_floor_db?: number;
  snr_db?: number;
}

export interface FileUploadResponse {
  status: string;
  dataset_id: string;
  original_filename: string;
  rows: number;
  columns: number;
  data: {
    x_arrays: Record<string, number[]>;
    y_arrays: Record<string, number[]>;
    dataframe_preview: Record<string, any>[];
  };
  metadata: {
    column_names: string[];
    column_types: Record<string, string>;
    missing_values: Record<string, number>;
  };
  statistical_summary: {
    mean: Record<string, number>;
    std: Record<string, number>;
    correlation_matrix?: Record<string, Record<string, number>>;
  };
}

// ============ MANUAL DATA ENTRY TYPES ============

export interface ManualDataEntry {
  id: string;
  name: string;
  data: number[];
  variables: Record<string, number[]>;
  created_at: Date;
}

export interface ManualDataInput {
  variable_name: string;
  values: number[];
}

export interface StatisticalTestRequest {
  test_type: 't_test' | 'anova' | 'mann_whitney' | 'wilcoxon' | 'chi_square' | 'correlation' | 'normality' | 'descriptive' | 'regression';
  data: {
    groups?: number[][];
    variables?: Record<string, number[]>;
    categorical?: Record<string, string[]>;
    x?: number[];
    y?: number[];
  };
  options?: {
    paired?: boolean;
    equal_var?: boolean;
    alternative?: 'two-sided' | 'greater' | 'less';
    confidence_level?: number;
    method?: 'pearson' | 'spearman' | 'kendall';
    regression_type?: 'linear' | 'polynomial' | 'exponential';
    forecast_steps?: number;
  };
}

export interface StatisticalTestResult {
  test_name: string;
  test_statistic: number;
  p_value: number;
  degrees_of_freedom?: number;
  effect_size?: number;
  effect_size_interpretation?: string;
  confidence_interval?: [number, number] | null;
  significant: boolean;
  interpretation: string;
  additional_results?: Record<string, any>;
}

export interface DescriptiveStatsManual {
  variable_name: string;
  sample_size: number;
  mean: number;
  median: number;
  mode: number[];
  std_dev: number;
  variance: number;
  range: number;
  min: number;
  max: number;
  sum: number;
  skewness: number;
  kurtosis: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
  };
  percentiles: Record<number, number>;
  missing_values: number;
  outliers: {
    count: number;
    values: number[];
    method: 'iqr' | 'zscore';
  };
  normality_test?: {
    shapiro_wilk: { statistic: number; p_value: number; normal: boolean };
    kolmogorov_smirnov: { statistic: number; p_value: number; normal: boolean };
    anderson_darling: { statistic: number; critical_values: Record<string, number>; normal: boolean };
  };
}

// ============ EXTENDED COMPUTATION TYPE ============

export type ExtendedComputationType = ComputationType | 'data_analysis';

export type ExtendedComputationResult = 
  | WaveformResponse 
  | MatrixResponse 
  | StatisticalResponse 
  | FilterResponse 
  | FileUploadResponse
  | DescriptiveStatsResult
  | HypothesisTestResult
  | RegressionResult
  | SpectralResult
  | StatisticalTestResult
  | DescriptiveStatsManual
  | null;

export type ComputationResult = WaveformResponse | MatrixResponse | StatisticalResponse | FilterResponse | null;