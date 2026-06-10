import React from 'react';
import { BookLayout } from '../../../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../ThemeProvider';

export function ArticleTemplate() {
  const { isDarkMode } = useTheme();
  
  return (
    <BookLayout>
      <div className={`min-h-screen p-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              Article Title
            </h1>
            
            <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
              <h2 className="text-2xl font-bold mb-4">Quick Answer</h2>
              <p className="text-lg mb-4">
                A concise answer that can be read in less than one minute.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-lg mb-4">
                Introduce the question. Explain why it matters. Provide context.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Scientific Explanation</h2>
              <p className="text-lg mb-4">
                Detailed explanation divided into clear subsections.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Did You Know?</h2>
              <p className="text-lg mb-4">
                Interesting trivia box.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Real World Connections</h2>
              <p className="text-lg mb-4">
                Explain how the topic affects everyday life.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Explore Further</h2>
              <p className="text-lg mb-4">
                Related topics and suggested next readings.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Reflection Question</h2>
              <p className="text-lg">
                A critical-thinking question encouraging learners to think deeper.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </BookLayout>
  );
}