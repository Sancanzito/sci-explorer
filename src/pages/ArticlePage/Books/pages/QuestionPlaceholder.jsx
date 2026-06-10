import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import { useLocation } from 'react-router-dom';

export function QuestionPlaceholder() {
  const { isDarkMode } = useTheme();
  const { pathname } = useLocation();

  const pathSegments = pathname.split('/').filter(Boolean);
  const slug = pathSegments.pop();
  const section = pathSegments.pop();

  const questionText = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-8 ${textColor}`}>Question Placeholder</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>
            {section ? section.toUpperCase() : ''} Question
          </h2>
          <p className={`text-xl ${mutedText} mb-6`}>
            "{questionText}?"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-lg mb-4">
            This article is coming soon.
          </p>
          <p className={`text-sm ${mutedText}`}>
            Check back later for the full scientific explanation.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}