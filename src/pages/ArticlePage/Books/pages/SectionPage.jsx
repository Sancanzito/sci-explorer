import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import sections from '../bookData';

const sectionGradients = {
  why: { light: 'from-red-900/80 to-orange-900/80', dark: 'dark:from-red-900/60 dark:to-orange-900/60', titleColor: 'from-yellow-200 to-yellow-500' },
  when: { light: 'from-blue-900/80 to-cyan-900/80', dark: 'dark:from-blue-900/60 dark:to-cyan-900/60', titleColor: 'from-blue-300 to-cyan-300' },
  where: { light: 'from-green-900/80 to-emerald-900/80', dark: 'dark:from-green-900/60 dark:to-emerald-900/60', titleColor: 'from-green-300 to-emerald-300' },
  what: { light: 'from-purple-900/80 to-pink-900/80', dark: 'dark:from-purple-900/60 dark:to-pink-900/60', titleColor: 'from-purple-300 to-pink-300' },
};

export function SectionPage({ sectionId }) {
  const { isDarkMode } = useTheme();
  const section = sections.find(s => s.id === sectionId);
  const gradient = sectionGradients[sectionId] || sectionGradients.why;
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  if (!section) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center py-20"
        >
          <h1 className="text-3xl font-bold">Section not found</h1>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <div className={`min-h-screen p-8 bg-gradient-to-br ${gradient.light} text-white ${isDarkMode ? gradient.dark : ''}`}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
              <p className={`text-lg mb-12 ${mutedText}`}>{section.subtitle}</p>

              <div className={`${cardBg} p-8 rounded-xl border border-gray-200 dark:border-gray-700`}>
                <h2 className="text-2xl font-bold mb-4">Chapter Overview</h2>
                <p className={`text-lg ${mutedText} mb-6`}>
                  This section contains {section.questions.length} questions exploring {section.subtitle.toLowerCase()}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  {section.questions.map((q, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border border-gray-200 dark:border-gray-600`}
                    >
                      <span className="font-medium text-amber-600 dark:text-amber-400 mr-2">Q{i + 1}.</span>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}