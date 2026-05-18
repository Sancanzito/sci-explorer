// TriviaWidget/TriviaResult.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { progressBarVariants } from './TriviaWidgetAnimations';

const TriviaResult = ({ showResult, isCorrect, fact, selectedAnswer, correctAnswer }) => {
  return (
    <AnimatePresence>
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="relative mt-4 overflow-hidden"
        >
          <div className={`p-3 rounded-xl ${
            isCorrect 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-500'
              : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-l-4 border-red-500'
          }`}>
            <div className="flex items-start gap-2">
              <div className="text-lg">
                {isCorrect ? '🎉' : '💡'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold mb-1 ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {isCorrect ? 'Correct! ' : `Incorrect! The answer was ${correctAnswer}. `}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {fact}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <motion.div
            variants={progressBarVariants}
            initial="initial"
            animate="animate"
            className={`absolute bottom-0 left-0 h-1 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TriviaResult;