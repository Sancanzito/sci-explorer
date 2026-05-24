// src/components/graph/hooks/useGraphComputation.ts
import { useState, useCallback } from 'react';
import { 
  GraphParameters, 
  ComputationType, 
  WaveformResponse, 
  MatrixResponse, 
  StatisticalResponse, 
  FilterResponse 
} from './types';
import { graphService } from '../services/graphService';

type ComputationResult = WaveformResponse | MatrixResponse | StatisticalResponse | FilterResponse | null;

export const useGraphComputation = () => {
  const [result, setResult] = useState<ComputationResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async (type: ComputationType, params: GraphParameters) => {
    setLoading(true);
    setError(null);
    
    try {
      let response: ComputationResult = null;
      
      switch (type) {
        case 'waveform':
          response = await graphService.computeWaveform(params);
          break;
        case 'matrix':
          response = await graphService.computeMatrix(params);
          break;
        case 'statistical':
          response = await graphService.computeStatistical(params);
          break;
        case 'filter':
          response = await graphService.computeFilter(params);
          break;
        default:
          throw new Error(`Unknown computation type: ${type}`);
      }
      
      setResult(response);
    } catch (err: any) {
      const errorMessage = err.message || 'Computation failed';
      setError(errorMessage);
      console.error('Computation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { 
    result, 
    loading, 
    error, 
    compute, 
    clearResult 
  };
};