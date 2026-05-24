// src/components/graph/types/index.ts

// Base Parameters
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

// Response Types
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

// Types
export type ComputationType = 'waveform' | 'matrix' | 'statistical' | 'filter';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';