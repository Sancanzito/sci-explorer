import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  itemVariants, 
  staggerContainer, 
  shakeVariants, 
  pulseVariants 
} from './TriviaWidgetAnimations'; 
import confetti from 'canvas-confetti';

const TriviaOptions = ({ 
  options, 
  correctIndex, 
  selectedAnswer, 
  showResult, 
  isAnswered,
  onAnswer 
}) => {
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6']
    });
  };

  const handleClick = (index) => {
    if (showResult || isAnswered) return;
    onAnswer(index);
    if (index === correctIndex) {
      triggerConfetti();
    }
  };

  const getButtonStyles = (index) => {
    if (!showResult && selectedAnswer === null) {
      return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
    
    if (showResult) {
      if (index === correctIndex) {
        return "bg-green-500 text-white ring-2 ring-green-300 dark:ring-green-700";
      }
      if (selectedAnswer === index && selectedAnswer !== correctIndex) {
        return "bg-red-500 text-white opacity-60";
      }
      return "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-50";
    }
    
    if (selectedAnswer === index) {
      return index === correctIndex 
        ? "bg-green-500 text-white" 
        : "bg-red-500 text-white";
    }
    
    return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {options.map((opt, idx) => {
        // Determine which animation variant to trigger based on result
        const isSelected = selectedAnswer === idx;
        const isCorrect = idx === correctIndex;
        let animationActive = "";
        
        if (showResult && isSelected) {
          animationActive = isCorrect ? "pulse" : "shake";
        }

        return (
          <motion.button
            key={idx}
            variants={{
              ...itemVariants,
              ...shakeVariants,
              ...pulseVariants
            }}
            whileHover={{ scale: showResult ? 1 : 1.02 }}
            whileTap={{ scale: showResult ? 1 : 0.98 }}
            animate={animationActive || "visible"}
            onClick={() => handleClick(idx)}
            disabled={showResult || isAnswered}
            className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 font-medium ${getButtonStyles(idx)}`}
          >
            <div className="flex items-center justify-between">
              <span>{opt}</span>
              {showResult && isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white"
                >
                  ✓
                </motion.span>
              )}
              {showResult && isSelected && !isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white"
                >
                  ✗
                </motion.span>
              )}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default TriviaOptions;