// pages/HomePage/components/WelcomeSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
      
      <span className="text-[10px] font-bold tracking-widest text-cyan-600 uppercase bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 rounded-full">
        Weekly Theme
      </span>
      
      <h2 className="text-3xl font-black mt-4 text-gray-900 dark:text-white">
        Exploring Modern <span className="text-cyan-500">Genetics</span>
      </h2>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
        Dive into the world of DNA and CRISPR. Understand how modern science rewrites the code of life.
      </p>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs hover:opacity-90 transition"
      >
        Start Exploring →
      </motion.button>
    </motion.div>
  );
};

export default WelcomeSection;