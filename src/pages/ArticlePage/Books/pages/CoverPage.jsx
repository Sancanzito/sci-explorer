
import React from 'react';
import { motion } from 'framer-motion';
import { BookLayout } from '../components/BookLayout';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';

export function CoverPage() {
  const { isDarkMode } = useTheme();
  
  return (
    <BookLayout nextPage="/science-quest/synopsis">
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`} />
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-yellow-400/20 blur-xl" />
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-blue-400/20 blur-xl" />
          <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-pink-500/20 blur-xl" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 50,
              damping: 10
            }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <Sparkles size={48} className={isDarkMode ? 'text-yellow-300 dark:text-yellow-400' : 'text-yellow-300'} />
            </div>
            
<h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500">
               The 4W's of science
             </h1>
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-indigo-200">
              Exploring the 4 W's of Science
            </h2>
            
            <p className="text-lg text-indigo-200/80">
              100 Fascinating Questions About What, Why, When, and Where
            </p>
          </motion.div>
        </div>
      </div>
    </BookLayout>
  );
}