// src/components/graph/components/HypothesisTesting.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TestTube, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Activity,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Copy
} from 'lucide-react';

interface HypothesisTestingProps {
  onRunTest: (testType: string, data: any, options?: any) => Promise<any>;
  loading: boolean;
  analysisResult?: any;
  variables?: Record<string, number[]>;
}

type TestType = 't_test_independent' | 't_test_paired' | 'mann_whitney' | 'wilcoxon' | 'anova_one_way' | 'chi_square' | 'pearson' | 'spearman';

export const HypothesisTesting: React.FC<HypothesisTestingProps> = ({
  onRunTest,
  loading,
  analysisResult,
  variables = {}
}) => {
  const [selectedTest, setSelectedTest] = useState<TestType>('t_test_independent');
  const [selectedVar1, setSelectedVar1] = useState('');
  const [selectedVar2, setSelectedVar2] = useState('');
  const [selectedGroupVar, setSelectedGroupVar] = useState('');
  const [selectedValueVar, setSelectedValueVar] = useState('');
  const [options, setOptions] = useState({
    equal_var: true,
    paired: false,
    alternative: 'two-sided' as 'two-sided' | 'greater' | 'less',
    confidence_level: 0.95
  });
  const [localResult, setLocalResult] = useState<any>(null);

  const variableNames = Object.keys(variables);

  const handleRunTest = async () => {
    let result = null;
    
    switch (selectedTest) {
      case 't_test_independent':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('ttest', {
            group1: variables[selectedVar1],
            group2: variables[selectedVar2]
          }, { ...options, paired: false });
        }
        break;
        
      case 't_test_paired':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('ttest', {
            group1: variables[selectedVar1],
            group2: variables[selectedVar2]
          }, { ...options, paired: true });
        }
        break;
        
      case 'mann_whitney':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('mann_whitney', {
            group1: variables[selectedVar1],
            group2: variables[selectedVar2]
          }, options);
        }
        break;
        
      case 'wilcoxon':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('wilcoxon', {
            before: variables[selectedVar1],
            after: variables[selectedVar2]
          }, options);
        }
        break;
        
      case 'anova_one_way':
        const groups = Object.values(variables);
        if (groups.length >= 3) {
          result = await onRunTest('anova', { groups }, options);
        }
        break;
        
      case 'pearson':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('correlation', {
            x: variables[selectedVar1],
            y: variables[selectedVar2]
          }, { ...options, method: 'pearson' });
        }
        break;
        
      case 'spearman':
        if (selectedVar1 && selectedVar2) {
          result = await onRunTest('correlation', {
            x: variables[selectedVar1],
            y: variables[selectedVar2]
          }, { ...options, method: 'spearman' });
        }
        break;
    }
    
    setLocalResult(result);
  };

  const renderTestDescription = () => {
    const descriptions: Record<TestType, { name: string; description: string; useCase: string }> = {
      't_test_independent': {
        name: 'Independent t-test',
        description: 'Compares means between two independent groups',
        useCase: 'Compare treatment vs control group'
      },
      't_test_paired': {
        name: 'Paired t-test',
        description: 'Compares means from the same group at different times',
        useCase: 'Before vs after treatment'
      },
      'mann_whitney': {
        name: 'Mann-Whitney U Test',
        description: 'Non-parametric alternative to independent t-test',
        useCase: 'Compare groups when data is not normally distributed'
      },
      'wilcoxon': {
        name: 'Wilcoxon Signed-Rank Test',
        description: 'Non-parametric alternative to paired t-test',
        useCase: 'Paired data with non-normal distribution'
      },
      'anova_one_way': {
        name: 'One-way ANOVA',
        description: 'Compares means across three or more groups',
        useCase: 'Compare multiple treatment groups'
      },
      'chi_square': {
        name: 'Chi-square Test',
        description: 'Tests association between categorical variables',
        useCase: 'Analyze contingency tables'
      },
      'pearson': {
        name: 'Pearson Correlation',
        description: 'Measures linear relationship between two variables',
        useCase: 'Test strength of linear association'
      },
      'spearman': {
        name: 'Spearman Correlation',
        description: 'Measures monotonic relationship (rank-based)',
        useCase: 'Non-parametric correlation'
      }
    };
    
    const desc = descriptions[selectedTest];
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Info size={14} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{desc.name}</span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400">{desc.description}</p>
        <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">📊 {desc.useCase}</p>
      </div>
    );
  };

  const renderTestOptions = () => {
    switch (selectedTest) {
      case 't_test_independent':
      case 'mann_whitney':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Group 1</label>
                <select
                  value={selectedVar1}
                  onChange={(e) => setSelectedVar1(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
                >
                  <option value="">Select variable</option>
                  {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Group 2</label>
                <select
                  value={selectedVar2}
                  onChange={(e) => setSelectedVar2(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
                >
                  <option value="">Select variable</option>
                  {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            {selectedTest === 't_test_independent' && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.equal_var}
                  onChange={(e) => setOptions({...options, equal_var: e.target.checked})}
                  className="rounded"
                />
                Assume equal variances
              </label>
            )}
          </div>
        );
        
      case 't_test_paired':
      case 'wilcoxon':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Before / Control</label>
              <select
                value={selectedVar1}
                onChange={(e) => setSelectedVar1(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
              >
                <option value="">Select variable</option>
                {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">After / Treatment</label>
              <select
                value={selectedVar2}
                onChange={(e) => setSelectedVar2(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
              >
                <option value="">Select variable</option>
                {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        );
        
      case 'anova_one_way':
        return (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <p className="text-sm">📊 Using <strong>{variableNames.length}</strong> groups:</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {variableNames.map(v => (
                <span key={v} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                  {v}
                </span>
              ))}
            </div>
          </div>
        );
        
      case 'pearson':
      case 'spearman':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Variable X</label>
              <select
                value={selectedVar1}
                onChange={(e) => setSelectedVar1(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
              >
                <option value="">Select variable</option>
                {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Variable Y</label>
              <select
                value={selectedVar2}
                onChange={(e) => setSelectedVar2(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm"
              >
                <option value="">Select variable</option>
                {variableNames.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-center text-sm text-gray-500">
            Select variables to run the test
          </div>
        );
    }
  };

  const renderResult = () => {
    const result = localResult || analysisResult;
    if (!result) return null;

    const isSignificant = result.p_value < 0.05;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 space-y-3"
      >
        <div className={`p-4 rounded-lg ${isSignificant ? 'bg-green-50 dark:bg-green-950/20' : 'bg-yellow-50 dark:bg-yellow-950/20'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              {isSignificant ? <CheckCircle size={18} className="text-green-600" /> : <XCircle size={18} className="text-yellow-600" />}
              <span>{result.test_name || 'Test Result'}</span>
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Test Statistic:</span>
              <span className="font-mono font-bold">{result.test_statistic?.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">p-value:</span>
              <span className={`font-mono font-bold ${isSignificant ? 'text-green-600' : 'text-yellow-600'}`}>
                {result.p_value?.toFixed(6)}
              </span>
            </div>
            {result.degrees_of_freedom && (
              <div className="flex justify-between">
                <span className="text-gray-500">Degrees of Freedom:</span>
                <span className="font-mono">{result.degrees_of_freedom}</span>
              </div>
            )}
            {result.effect_size && (
              <div className="flex justify-between">
                <span className="text-gray-500">Effect Size:</span>
                <span className="font-mono">{result.effect_size?.toFixed(4)}</span>
              </div>
            )}
            {result.confidence_interval && (
              <div className="flex justify-between col-span-2">
                <span className="text-gray-500">95% CI:</span>
                <span className="font-mono">
                  [{result.confidence_interval[0]?.toFixed(4)}, {result.confidence_interval[1]?.toFixed(4)}]
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              <span className="font-medium">Interpretation: </span>
              {result.interpretation}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSelectedTest('t_test_independent')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 't_test_independent' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          📊 Independent t-test
        </button>
        <button
          onClick={() => setSelectedTest('t_test_paired')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 't_test_paired' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          🔄 Paired t-test
        </button>
        <button
          onClick={() => setSelectedTest('mann_whitney')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 'mann_whitney' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          📈 Mann-Whitney U
        </button>
        <button
          onClick={() => setSelectedTest('anova_one_way')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 'anova_one_way' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          📉 One-way ANOVA
        </button>
        <button
          onClick={() => setSelectedTest('pearson')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 'pearson' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          🔗 Pearson Correlation
        </button>
        <button
          onClick={() => setSelectedTest('spearman')}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${selectedTest === 'spearman' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          📊 Spearman Correlation
        </button>
      </div>

      {renderTestDescription()}
      
      {variableNames.length > 0 ? renderTestOptions() : (
        <div className="p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          <Activity size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No variables available</p>
          <p className="text-xs">Please upload data or add variables first</p>
        </div>
      )}

      <button
        onClick={handleRunTest}
        disabled={loading || variableNames.length === 0}
        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Computing...
          </>
        ) : (
          <>
            <TestTube size={16} />
            Run Hypothesis Test
          </>
        )}
      </button>

      {renderResult()}
    </div>
  );
};