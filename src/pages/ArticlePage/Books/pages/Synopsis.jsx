import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function Synopsis() {
  const { isDarkMode } = useTheme();
  
  return (
     <BookLayout prevPage="/science-quest" nextPage="/science-quest/how-to-use">
      <div className={`min-h-screen p-8 md:p-12 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              About This Book
            </h1>
            
            <div className="prose prose-invert max-w-2xl mx-auto">
              <motion.p className="text-xl mb-8 leading-relaxed">
                Science begins with curiosity. This book is designed to inspire that curiosity through 100 fascinating questions about the world around us.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                    What
                  </h2>
                  <p className="text-lg">
                    Understanding objects, organisms, forces, and phenomena that make up our universe.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-green-300">
                    Why
                  </h2>
                  <p className="text-lg">
                    Exploring the causes and explanations behind natural events and phenomena.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">
                    When
                  </h2>
                  <p className="text-lg">
                    Investigating historical timelines and scientific milestones that shaped our understanding.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-purple-300">
                    Where
                  </h2>
                  <p className="text-lg">
                    Discovering locations, habitats, environments, and origins of scientific wonders.
                  </p>
                </motion.div>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl mt-8 text-center"
              >
                Each chapter contains fascinating scientific mysteries and discoveries designed to inspire inquiry and critical thinking.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-2xl mt-8 text-center"
              >
                Become a scientific explorer and uncover the wonders of our world!
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </BookLayout>
  );
}