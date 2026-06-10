import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function FunFacts({ facts }) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">Fun Facts</h2>
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`p-3 bg-white/10 rounded-lg ${isDarkMode ? 'dark:bg-gray-800/10' : ''}`}
          >
            <p className="text-lg">{fact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}