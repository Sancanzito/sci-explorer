// src/components/graph/GraphDashboard.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScientificForm } from './components/ScientificForm';
import { DataStreamView } from './components/DataStreamView';
import { MatplotlibViewer } from './components/MatplotlibViewer';
import { useGraphComputation } from './hooks/useGraphComputation';
import { GraphParameters, ComputationType } from './types';
import { Layout, Sidebar, MainContent, AnalyticsPanel } from './layouts';
import { useTheme } from '../../ThemeProvider'; // Import your theme hook

const GraphDashboard: React.FC = () => {
  const [computationType, setComputationType] = useState<ComputationType>('waveform');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const { isDarkMode } = useTheme(); // Use your theme
  
  const { 
    result, 
    loading, 
    error, 
    compute, 
    clearResult 
  } = useGraphComputation();

  const handleCompute = useCallback(async (params: GraphParameters) => {
    await compute(computationType, params);
  }, [computationType, compute]);

  // Apply theme class to the graph container
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

  return (
    <div id="graph-dashboard-container" className={isDarkMode ? 'dark' : ''}>
      <Layout>
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ScientificForm 
            computationType={computationType}
            onTypeChange={setComputationType}
            onSubmit={handleCompute}
            isLoading={loading}
          />
        </Sidebar>

        <MainContent>
          <DataStreamView 
            loading={loading}
            error={error}
            onRetry={() => clearResult()}
          >
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={computationType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MatplotlibViewer 
                    imageData={result.chart_image || result.heatmap_image || result.histogram_image || result.filter_image}
                    metadata={result.metadata}
                    computationType={computationType}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DataStreamView>

          {showAnalytics && result && (
            <AnalyticsPanel onClose={() => setShowAnalytics(false)}>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Computation Metrics
                </h3>
                {Object.entries(result.metadata || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono">
                      {typeof value === 'number' ? value.toFixed(4) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsPanel>
          )}
        </MainContent>
      </Layout>
    </div>
  );
};

export default GraphDashboard;