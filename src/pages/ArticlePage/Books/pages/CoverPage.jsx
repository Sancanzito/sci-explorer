import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';

export function CoverPage() {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 10 }}
        className="min-h-[80vh] flex flex-col items-center justify-center text-center"
      >
        <div className="flex justify-center mb-6">
          <Sparkles size={48} className="text-amber-500" />
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${textColor}`}>
          The 4W's of Science
        </h1>

        <h2 className={`text-2xl md:text-3xl font-light mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Exploring the 4 W's of Science
        </h2>

        <p className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          100 Fascinating Questions About What, Why, When, and Where
        </p>
      </motion.div>
    </AnimatePresence>
  );
}