// App.jsx - REMOVED ChatPage
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AIAssistant from './components/AI/Ai';
import { useTheme } from './ThemeProvider';
import ScientificCalculator from './components/Calculator/ScientificCalculator';

// Import all page components
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import SimulationsPage from './pages/SimulationsPage';
import QuizzesPage from './pages/QuizzesPage';
// import ChatPage from './pages/ChatPage';  // ❌ REMOVE THIS

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200 font-sans">
      <Router>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/*" element={<ArticlesPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          {/* <Route path="/chat/:context" element={<ChatPage />} />  ❌ REMOVE THIS */}
          <Route path="/tools/calculator" element={<ScientificCalculator />} />
        </Routes>
      </Router>
      {/* AI Assistant appears on all pages as floating button */}
      <AIAssistant isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;