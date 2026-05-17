// pages/HomePage/components/FactBox.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FactBox = () => {
  const facts = [
    { text: "The speed of light in a vacuum is 299,792,458 m/s, but in water it slows to 225,000,000 m/s!", icon: "⚡" },
    { text: "A single human cell nucleus is only 6 micrometers wide - you could fit 16,000 of them on a pinhead!", icon: "🔬" },
    { text: "There are more stars in the universe than grains of sand on all Earth's beaches.", icon: "⭐" },
    { text: "Your body produces 25 million new cells every second!", icon: "🧬" }
  ];
  
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xl">💡</div>
        <h3 className="font-semibold text-gray-800 dark:text-white">Did You Know?</h3>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFact}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-4xl mb-3">{facts[currentFact].icon}</div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {facts[currentFact].text}
          </p>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-center gap-1 mt-4">
        {facts.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === currentFact ? 'w-4 bg-amber-500' : 'w-1 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FactBox;