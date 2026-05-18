import React from 'react';
import { motion } from 'framer-motion';

const TriviaStreak = ({ streak, hasAnsweredToday }) => {
  if (streak === 0 && !hasAnsweredToday) return null;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex-shrink-0" // Keeps it from shrinking on small screens
    >
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">
        <span>🔥</span>
        <span>{streak}</span>
      </div>
    </motion.div>
  );
};

export default TriviaStreak;