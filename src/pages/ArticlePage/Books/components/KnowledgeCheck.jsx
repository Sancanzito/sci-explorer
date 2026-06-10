import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function KnowledgeCheck({ question, options, correctAnswer, explanation }) {
  const { isDarkMode } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const bg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const text = isDarkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <div className={`${bg} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}>
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
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 border border-red-400'
                : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-amber-50'} border border-amber-200 dark:border-amber-800`}
        >
          <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
            {selectedAnswer === correctAnswer ? 'Correct!' : 'Not quite — here\'s why:'}
          </p>
          <p className={text}>{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
