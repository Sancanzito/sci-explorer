import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import { useParams, useLocation } from 'react-router-dom';

export function QuestionPlaceholder() {
  const { isDarkMode } = useTheme();
  const { pathname } = useLocation();
  
  // Extract the question slug from the path
  // e.g., /science-quest/why/why-is-the-sky-blue -> why-is-the-sky-blue
  const pathSegments = pathname.split('/').filter(Boolean);
  const slug = pathSegments.pop(); // Get the last segment
  const section = pathSegments.pop(); // Get the section (why, when, where, what)
  
  // Convert slug back to a readable question format (approximation)
  const questionText = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <BookLayout 
      prevPage={`/science-quest/${section}`} 
      nextPage={`/science-quest/${section}`} // In a real implementation, this would navigate to next question
    >
      <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} text-${isDarkMode ? 'gray-100' : 'gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8 text-${isDarkMode ? 'gray-100' : 'gray-900'}">
              Question Placeholder
            </h1>
          </motion.div>
          
          <div className="prose prose-invert max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-${isDarkMode ? 'gray-100' : 'gray-900'} mb-4">
                {section.toUpperCase()} Question
              </h2>
              <p className="text-xl text-${isDarkMode ? 'gray-300' : 'gray-600'} mb-6">
                "{questionText}?"
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-lg mb-4">
                This is a placeholder for the individual question page.
              </p>
              <p className="text-sm text-${isDarkMode ? 'gray-400' : 'gray-500'}">
                Replace this component with the actual content for this question.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </BookLayout>
  );
}