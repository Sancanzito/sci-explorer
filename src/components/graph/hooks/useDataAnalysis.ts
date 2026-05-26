// src/components/graph/hooks/useDataAnalysis.ts
import { useState, useCallback, useEffect } from 'react';
import { graphService, checkBackendStatus } from '../services/graphService';

export const useDataAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDataset, setUploadedDataset] = useState<any>(null);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [backendStatus, setBackendStatus] = useState<{ local: boolean; online: boolean; active: string | null } | null>(null);

  // Check backend status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkBackendStatus();
      setBackendStatus(status);
      if (!status.local && !status.online) {
        setError('No backend available. Please start the local server or check your connection.');
      } else if (status.active) {
        console.log(`Connected to backend: ${status.active}`);
      }
    };
    checkStatus();
  }, []);

  const uploadFile = useCallback(async (file: File, options?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await graphService.uploadFile(file, options);
      setUploadedDataset(result);
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'File upload failed';
      setError(errorMsg);
      console.error('Upload error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await graphService.getDatasets();
      setDatasets(result.datasets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const computeDescriptiveStats = useCallback(async (datasetId: string, columnName: string) => {
    setLoading(true);
    try {
      const result = await graphService.getDescriptiveStats(datasetId, columnName);
      setAnalysisResult(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const runHypothesisTest = useCallback(async (testType: string, group1: number[], group2?: number[]) => {
    setLoading(true);
    try {
      const result = await graphService.runHypothesisTest(testType, group1, group2);
      setAnalysisResult(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const runRegression = useCallback(async (xData: number[], yData: number[], type?: string) => {
    setLoading(true);
    try {
      const result = await graphService.runRegression(xData, yData, type);
      setAnalysisResult(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    uploadedDataset,
    datasets,
    analysisResult,
    backendStatus,
    uploadFile,
    fetchDatasets,
    computeDescriptiveStats,
    runHypothesisTest,
    runRegression,
    clearAnalysis
  };
};