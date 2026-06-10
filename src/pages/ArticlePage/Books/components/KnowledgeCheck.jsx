import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function KnowledgeCheck({ question, options, correctAnswer, explanation }) {
  const { isDarkMode } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === correctAnswer) {
      setShowExplanation(true);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
      <p className="text-lg mb-4">{question}</p>
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedAnswer === index 
                ? index === correctAnswer 
                  ? 'bg-green-500/20' 
                  : 'bg-red-500/20'
                : 'bg-white/5 hover:bg-white/10'
            } ${isDarkMode ? 'dark:bg-gray-700/10 dark:hover:bg-gray-600/10' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-white/10 rounded-lg"
        >
          <p className="text-lg">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}