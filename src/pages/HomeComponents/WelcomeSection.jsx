// pages/HomePage/components/WelcomeSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = () => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="h-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-5 border border-cyan-500/20 backdrop-blur-sm shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-8 bg-cyan-500 rounded-full" />
        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">WEEKLY THEME</span>
      </div>
      
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
        Exploring Modern Genetics
      </h2>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Dive into the fascinating world of DNA, CRISPR, and genetic engineering. 
        Understand how genes shape life and how modern science is rewriting the code of existence.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>🎯 Understand DNA structure & function</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>🧬 Explore CRISPR gene editing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>🔬 Analyze genetic inheritance patterns</span>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg font-medium w-full hover:bg-cyan-700 transition"
      >
        Start Exploring →
      </motion.button>
    </motion.div>
  );
};

export default WelcomeSection;