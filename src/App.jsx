// App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AIAssistant from './components/AI/Ai';
import { useTheme } from './ThemeProvider';
import ScientificCalculator from './components/Calculator/ScientificCalculator';
import PeriodicTable from './components/Tools/PeriodicTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import GraphDashboard
import GraphDashboard from './components/graph/GraphDashboard';

// Import all page components
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlePage/ArticlesPage';
import SimulationsPage from './pages/SimulationsPage';
import QuizzesPage from './pages/QuizzesPage';
import ArticleReader from './pages/ArticlePage/ArticleReader';
import ArticleNotFound from './pages/ArticlePage/ArticleNotFound';

// Import All Custom Article Dashboards
import ChemistryModelsPage from './Articles/UseofChemModels/ChemistryModelsPage';
import ParticleModelDashboard from './Articles/ParticleModelofMatter/ParticleModelDashboard';
import InvestigationPage from './Articles/Investigation/InvestigationPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200 font-sans">
        <Router>
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Custom dashboard routes */}
              <Route path="/articles/chem-models" element={<ChemistryModelsPage />} />
              <Route path="/articles/particle-model-matter" element={<ParticleModelDashboard />} />
              <Route path="/articles/ScienceSkills" element={<InvestigationPage />} />
              
              {/* Scientific Visualization Dashboard */}
              <Route path="/graph" element={<GraphDashboard />} />
              
              {/* Legacy route redirects */}
              <Route path="/articles/particles" element={<Navigate to="/articles/particle-model-matter" replace />} />

              {/* General article routes */}
              <Route path="/articles/:articleId" element={<ArticleReader />} />          
              <Route path="/articles" element={<ArticlesPage />} />                      

              {/* Other routes */}
              <Route path="/simulations" element={<SimulationsPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/tools/periodic-table" element={<PeriodicTable />} />
              <Route path="/tools/calculator" element={<ScientificCalculator />} />
              
              {/* 404 catch-all route */}
              <Route path="*" element={<ArticleNotFound />} />
          </Routes>
        </Router>
        <AIAssistant isDarkMode={isDarkMode} />
      </div>
    </QueryClientProvider>
  );
}

export default App;