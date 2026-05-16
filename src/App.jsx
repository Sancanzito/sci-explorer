// App.jsx - CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIAssistant from './components/Ai';
import { useTheme } from './ThemeProvider';


const HomePage = () => (
  <div className="max-w-5xl mx-auto px-6 py-16">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
      Science Education <span className="text-cyan-600 dark:text-cyan-500">Resource Hub</span>
    </h1>
    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
      A digital workspace for BSED Science modules. Explore our interactive microbiology protocols, thermodynamics experiments, and virtual lab simulations.
    </p>
    <div className="mt-8 flex gap-4">
      <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium transition-colors">
        Launch DNA Sim
      </button>
      <button className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
        Read Lab Manuals
      </button>
    </div>
  </div>
);

const ArticlesPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">Reading Materials & Protocols</h1>
    <p className="mt-4 text-gray-600 dark:text-gray-400">Select a module from the navigation menu to view specific lab procedures.</p>
  </div>
);

const SimulationsPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">Virtual Laboratories</h1>
    <div className="mt-6 p-8 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl text-center text-gray-500">
      Godot simulation frames will be mounted here.
    </div>
  </div>
);

const QuizzesPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">Self-Assessment</h1>
  </div>
);

const ChatPage = () => {
  const { context } = useParams();
  const contextMap = {
    'research': 'Research Lab',
    'physics': 'Physics & Thermal', 
    'quizzes': 'Study Guide'
  };
  const displayContext = contextMap[context] || context;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">AI Assistant: {displayContext}</h1>
      <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
          <span className="font-medium">System ready to assist with {displayContext.toLowerCase()} logic.</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    // Change dark:bg-gray-950 to dark:bg-dark-bg to use your custom color
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200 font-sans">
      <Router>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/*" element={<ArticlesPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/chat/:context" element={<ChatPage />} />
        </Routes>
      </Router>
       {/* Add AI Assistant component - it will appear on all pages */}
      <AIAssistant isDarkMode={isDarkMode} />
    </div>
   
  );
}

export default App;