// pages/HomePage/components/TriviaWidget.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TriviaWidget = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const trivia = {
    question: "What is the approximate length of DNA in a single human cell?",
    options: ["1 meter", "2 meters", "0.5 meters", "3 meters"],
    correct: 1,
    fact: "If stretched out, the DNA in one human cell would be about 2 meters long! That's 6.5 feet of genetic material packed into a microscopic nucleus."
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-500/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xl">🧠</div>
        <h3 className="font-semibold text-gray-800 dark:text-white">Daily Science Trivia</h3>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{trivia.question}</p>
      
      <div className="space-y-2">
        {trivia.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(idx)}
            disabled={showResult}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
              selectedAnswer === idx 
                ? idx === trivia.correct 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 p-2 rounded-lg text-xs ${
              selectedAnswer === trivia.correct 
                ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                : 'bg-red-500/20 text-red-700 dark:text-red-300'
            }`}
          >
            {selectedAnswer === trivia.correct ? '✓ Correct! ' : '✗ Incorrect. '}
            {trivia.fact}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TriviaWidget;