// src/components/graph/services/graphService.ts
import { 
  GraphParameters, 
  WaveformResponse, 
  MatrixResponse, 
  StatisticalResponse, 
  FilterResponse 
} from '../types';

// Configuration
const LOCAL_BACKEND = 'http://localhost:8000';
const ONLINE_BACKEND = 'https://sci-hub-backend.onrender.com';

// State to track which backend is active
let activeBackend: string | null = null;
let backendCheckPromise: Promise<boolean> | null = null;

/**
 * Check if a backend is reachable
 */
export async function checkBackendReachable(backendUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`Backend ${backendUrl} is not reachable:`, error);
    return false;
  }
}

/**
 * Get the available backend URL (cached result)
 */
export async function getAvailableBackend(): Promise<string> {
  if (activeBackend) {
    return activeBackend;
  }
  
  if (backendCheckPromise) {
    await backendCheckPromise;
    return activeBackend || LOCAL_BACKEND;
  }
  
  backendCheckPromise = (async () => {
    const isLocalReachable = await checkBackendReachable(LOCAL_BACKEND);
    if (isLocalReachable) {
      console.log('✅ Using LOCAL backend:', LOCAL_BACKEND);
      activeBackend = LOCAL_BACKEND;
      return true;
    }
    
    const isOnlineReachable = await checkBackendReachable(ONLINE_BACKEND);
    if (isOnlineReachable) {
      console.log('✅ Using ONLINE backend:', ONLINE_BACKEND);
      activeBackend = ONLINE_BACKEND;
      return true;
    }
    
    console.warn('⚠️ No backend available. Both local and online are unreachable.');
    activeBackend = LOCAL_BACKEND;
    return false;
  })();
  
  await backendCheckPromise;
  return activeBackend || LOCAL_BACKEND;
}

/**
 * Check backend status (local and online)
 */
export async function checkBackendStatus(): Promise<{ local: boolean; online: boolean; active: string | null }> {
  const localReachable = await checkBackendReachable(LOCAL_BACKEND);
  const onlineReachable = await checkBackendReachable(ONLINE_BACKEND);
  
  return {
    local: localReachable,
    online: onlineReachable,
    active: activeBackend
  };
}

class GraphService {
  private async fetchWithFallback(endpoint: string, options: RequestInit): Promise<Response> {
    const backend = await getAvailableBackend();
    const url = `${backend}${endpoint}`;
    
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      activeBackend = null;
      backendCheckPromise = null;
      
      const newBackend = await getAvailableBackend();
      const newUrl = `${newBackend}${endpoint}`;
      
      console.log(`Retrying request to ${newUrl}`);
      const response = await fetch(newUrl, options);
      return response;
    }
  }

  async computeWaveform(params: GraphParameters): Promise<WaveformResponse> {
    const response = await this.fetchWithFallback('/api/v1/graph/waveform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Waveform computation failed' }));
      throw new Error(error.detail || 'Waveform computation failed');
    }
    
    return response.json();
  }

  async computeMatrix(params: GraphParameters): Promise<MatrixResponse> {
    const response = await this.fetchWithFallback('/api/v1/graph/matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Matrix computation failed' }));
      throw new Error(error.detail || 'Matrix computation failed');
    }
    
    return response.json();
  }

  async computeStatistical(params: GraphParameters): Promise<StatisticalResponse> {
    const response = await this.fetchWithFallback('/api/v1/graph/statistical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Statistical analysis failed' }));
      throw new Error(error.detail || 'Statistical analysis failed');
    }
    
    return response.json();
  }

  async computeFilter(params: GraphParameters): Promise<FilterResponse> {
    const response = await this.fetchWithFallback('/api/v1/graph/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Filter computation failed' }));
      throw new Error(error.detail || 'Filter computation failed');
    }
    
    return response.json();
  }

  async uploadFile(file: File, options?: {
    handle_missing?: 'drop' | 'fill_mean' | 'fill_median';
    remove_duplicates?: boolean;
    x_column?: string;
    y_columns?: string[];
  }): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('handle_missing', options?.handle_missing || 'drop');
    formData.append('remove_duplicates', String(options?.remove_duplicates !== false));
    if (options?.x_column) formData.append('x_column', options.x_column);
    if (options?.y_columns) formData.append('y_columns', JSON.stringify(options.y_columns));

    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback('/api/v1/data/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'File upload failed' }));
      throw new Error(error.detail || 'File upload failed');
    }

    return response.json();
  }

  async getDatasets(): Promise<{ datasets: Array<{ dataset_id: string; filename: string; rows: number; columns: number }> }> {
    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback('/api/v1/data/datasets', {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch datasets');
    return response.json();
  }

  async getDescriptiveStats(datasetId: string, columnName: string): Promise<any> {
    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback(`/api/v1/data/descriptive/${datasetId}?column_name=${columnName}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to compute statistics');
    return response.json();
  }

  async runHypothesisTest(testType: string, group1: number[], group2?: number[], options?: any): Promise<any> {
    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback('/api/v1/data/hypothesis-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        test_type: testType,
        group1,
        group2,
        paired: options?.paired || false,
        equal_var: options?.equal_var !== false,
        confidence_level: options?.confidence_level || 0.95
      }),
    });
    if (!response.ok) throw new Error('Hypothesis test failed');
    return response.json();
  }

  async runRegression(xData: number[], yData: number[], regressionType: string = 'linear', forecastSteps?: number): Promise<any> {
    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback('/api/v1/data/regression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        x_data: xData,
        y_data: yData,
        regression_type: regressionType,
        forecast_steps: forecastSteps || 0
      }),
    });
    if (!response.ok) throw new Error('Regression failed');
    return response.json();
  }

  async analyzeSpectrum(data: number[], sampleRate: number = 1000): Promise<any> {
    // FIXED: Use correct endpoint path
    const response = await this.fetchWithFallback('/api/v1/data/spectral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data,
        sample_rate: sampleRate,
        method: 'welch'
      }),
    });
    if (!response.ok) throw new Error('Spectral analysis failed');
    return response.json();
  }
}

export const graphService = new GraphService();