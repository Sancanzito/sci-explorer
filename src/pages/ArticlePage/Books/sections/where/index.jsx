import React from 'react';
import { BookLayout } from '../../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../../ThemeProvider';

export function WhereSection() {
  const { isDarkMode } = useTheme();
   
  return (
    <BookLayout prevPage="/science-quest/when" nextPage="/science-quest/what">
      <div className={`min-h-screen p-8 bg-gradient-to-br from-green-900 to-emerald-900 text-white ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
              The Places of Discovery
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
                <h2 className="text-2xl font-bold mb-4">Chapter Content</h2>
                <p className="text-lg">
                  This section explores locations, habitats, environments, and origins of scientific wonders.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </BookLayout>
  );
}