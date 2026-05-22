// pages/HomePage/components/QuoteofDay/QuoteofDay.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { quotes } from './QuoteofDayData';

const QuoteofDay = () => {
  // Calculates index based on the day of the month (1-30)
  const day = new Date().getDate();
  const index = (day - 1) % quotes.length;
  const dailyQuote = quotes[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="w-full h-full bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-6 border border-yellow-500/20 flex flex-col justify-center items-center text-center shadow-lg"
    >
      <div className="text-3xl mb-3">💭</div>
      <p className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
        "{dailyQuote.text}"
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest mt-3 text-amber-600 dark:text-amber-400">
        — {dailyQuote.author}
      </p>
    </motion.div>
  );
};

export default QuoteofDay;