// pages/HomePage/components/QuoteOfDay.jsx
import React from 'react';
import { motion } from 'framer-motion';

const QuoteOfDay = () => {
  const quotes = [
    { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
    { text: "Science is the poetry of reality.", author: "Richard Dawkins" },
    { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
    { text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson" }
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="h-full bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-4 border border-yellow-500/20 flex flex-col justify-center"
    >
      <div className="text-center">
        <div className="text-3xl mb-2">💭</div>
        <p className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed">
          "{randomQuote.text}"
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          — {randomQuote.author}
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteOfDay;