// App.jsx - REMOVED ChatPage
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AIAssistant from './components/AI/Ai';
import { useTheme } from './ThemeProvider';
import ScientificCalculator from './components/Calculator/ScientificCalculator';
import PeriodicTable from './components/Tools/PeriodicTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import all page components
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlePage/ArticlesPage';
import SimulationsPage from './pages/SimulationsPage';
import QuizzesPage from './pages/QuizzesPage';
import ArticleReader from './pages/ArticlePage/ArticleReader';

//import all Articles
import ChemistryModelsPage from './Articles/UseofChemModels/ChemistryModelsPage';

// Create a client instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevents aggressive background re-fetches while you debug
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    // 1. Wrap EVERYTHING inside the QueryClientProvider at the top layer
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200 font-sans">
        <Router>
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/articles/chem-models" element={<ChemistryModelsPage />} />  // Specific first
            <Route path="/articles/:articleId" element={<ArticleReader />} />          // Dynamic second
            <Route path="/articles" element={<ArticlesPage />} />                      // General last

            <Route path="/simulations" element={<SimulationsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/tools/periodic-table" element={<PeriodicTable />} />
            <Route path="/tools/calculator" element={<ScientificCalculator />} />
          </Routes>
        </Router>
        {/* AI Assistant appears on all pages as floating button */}
        <AIAssistant isDarkMode={isDarkMode} />
      </div>
    </QueryClientProvider>
  );
}

export default App;