import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';

const HomePage = () => (
  <div className="min-h-screen bg-gray-950 text-white p-8">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
      Welcome to SciHub
    </h1>
    <p className="mt-4 text-gray-400">Your premium scientific research platform</p>
  </div>
);

const ArticlesPage = () => (
  <div className="min-h-screen bg-gray-950 text-white p-8">
    <h1 className="text-4xl font-bold">Articles</h1>
  </div>
);

const SimulationsPage = () => (
  <div className="min-h-screen bg-gray-950 text-white p-8">
    <h1 className="text-4xl font-bold">Simulations</h1>
  </div>
);

const QuizzesPage = () => (
  <div className="min-h-screen bg-gray-950 text-white p-8">
    <h1 className="text-4xl font-bold">Quizzes</h1>
  </div>
);

const ChatPage = () => {
  const { context } = useParams();
  const displayContext = context ? context.charAt(0).toUpperCase() + context.slice(1) : '';

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold">AI Assistant - {displayContext}</h1>
      <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center gap-3 text-cyan-400">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <span>AI is ready to help with {displayContext.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="bg-gray-950 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/*" element={<ArticlesPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/chat/:context" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;