// src/components/graph/services/graphService.ts
import { 
  GraphParameters, 
  WaveformResponse, 
  MatrixResponse, 
  StatisticalResponse, 
  FilterResponse 
} from '../types';

// Get API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production (GitHub Pages)
  // Use window.location.hostname to detect environment
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    // Use your Render backend URL
    return 'https://sci-hub-backend.onrender.com/api/v1/graph';
  }
  // In development, use the Vite proxy (relative path)
  return '/api/v1/graph';
};

const API_BASE_URL = getApiBaseUrl();

class GraphService {
  async computeWaveform(params: GraphParameters): Promise<WaveformResponse> {
    const response = await fetch(`${API_BASE_URL}/waveform`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Waveform computation failed' }));
      throw new Error(error.detail || 'Waveform computation failed');
    }
    
    return response.json();
  }

  async computeMatrix(params: GraphParameters): Promise<MatrixResponse> {
    const response = await fetch(`${API_BASE_URL}/matrix`, {
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
    const response = await fetch(`${API_BASE_URL}/statistical`, {
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
    const response = await fetch(`${API_BASE_URL}/filter`, {
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
}

export const graphService = new GraphService();