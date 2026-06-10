import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function FunFacts({ facts }) {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  if (!facts || !Array.isArray(facts)) return null;

  return (
    <div className={`${bg} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}>
      <h2 className="text-2xl font-bold mb-4">Fun Facts</h2>
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border border-gray-200 dark:border-gray-600`}
          >
            <p className="text-lg">{fact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
