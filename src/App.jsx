// App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { useTheme } from './ThemeProvider';
import ScientificCalculator from './components/Calculator/ScientificCalculator';
import PeriodicTable from './components/Tools/PeriodicTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AIAssistant from './components/AI/Ai';
import { Analytics } from "@vercel/analytics/react";
// Import GraphDashboard
import StatisticalTool from './components/graph/statisticaltool';
// main.jsx or App.jsx
import "@glideapps/glide-data-grid/dist/index.css";
// Import all page components
import HomePage from './pages/HomeComponents/HomePage';
import ArticlesPage from './pages/ArticlePage/ArticlesPage';
import SimulationsPage from './pages/SimulationsPage/SimulationsPage';
import QuizzesPage from './pages/QuizzesPage/QuizzesPage';
import ArticleReader from './pages/ArticlePage/ArticleReader';
import ArticleNotFound from './pages/ArticlePage/ArticleNotFound';

// Import All Custom Article Dashboards
import ChemistryModelsPage from './Articles/UseofChemModels/ChemistryModelsPage';
import ParticleModelDashboard from './Articles/ParticleModelOfMatter/ParticleModelDashboard';
import LaboratorySafetyPage from './Articles/LaboratorySafety/LaboratorySafetyPage';
import InvestigationPage from "./Articles/Science/SciPage";

// Import Simulations
import EcoBalanceGame from './Simulations/EcoBalance/EcoBalance';
import DNAExtractionApp from './Simulations/DNAextraction/DNAextraction';
import SolarSystemObservatory from './Simulations/SolarSystem/SolarSystem';
import CellExplorer from "./Simulations/Cell/Cell";
import GelElectrophoresis from './Simulations/gelElectrophoresis/gelElectrophoresis';
import MolView from './Simulations/MolView/Molview';

// Import quiz games
import MicroscopeGame from './quiz/microscope/MicroscopeGame';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
});

// Wrapper component to get current route and pass context to AI
function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Check if we are on the homepage
  const isHomePage = location.pathname === '/';
  
  // Determine if AI assistant should be disabled (e.g., during quizzes)
  const isAssessmentActive = location.pathname.includes('/quizzes') || 
                             location.pathname.includes('/microscope-game');
  
  // Get context based on current route (only used if on homepage)
  const getAIContext = () => {
    if (isHomePage) return "Home Dashboard";
    if (location.pathname.includes('/articles')) return "Science Articles";
    if (location.pathname.includes('/simulations')) return "Science Simulations";
    if (location.pathname.includes('/quizzes')) return "Quiz Section - DO NOT provide direct answers";
    if (location.pathname.includes('/tools')) return "Science Tools";
    if (location.pathname.includes('/molview')) return "Molecular Visualization Tool";
    return "Science Learning Platform";
  };

  return (
    <>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Custom dashboard routes */}
        <Route path="/articles/chem-models" element={<ChemistryModelsPage />} />
        <Route path="/articles/LaboratorySafety" element={<LaboratorySafetyPage />} />
        <Route path="/articles/particle-model-matter" element={<ParticleModelDashboard />} />
        <Route path="/articles/ScientificSkills" element={<InvestigationPage />} />
        
        {/* Scientific Visualization Dashboard */}
        <Route path="/graph" element={<StatisticalTool />} />
        
        {/* Molecular Visualization Tool */}
        <Route path="/molview" element={<MolView />} />
        
        {/* Simulations and quizzes */}
        <Route path="/games/eco-balance" element={<EcoBalanceGame />} />
        <Route path="/microscope-game" element={<MicroscopeGame />} />
        <Route path="/simulations/dna-extraction" element={<DNAExtractionApp />} />
        <Route path="/simulations/solar-system" element={<SolarSystemObservatory />} />
        <Route path="/simulations/cell-explorer" element={<CellExplorer />} />
        <Route path="/simulations/gel-electrophoresis" element={<GelElectrophoresis />} />
        
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
      
      {/* AI Assistant - ONLY shows on homepage */}
      {isHomePage && (
        <AIAssistant 
          context={getAIContext()} 
          disabled={isAssessmentActive}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;