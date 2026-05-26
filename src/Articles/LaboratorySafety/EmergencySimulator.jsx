import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    situation: "Your lab partner spills a mild acid on their hand.",
    options: [
      { text: "Wipe it off with a paper towel.", correct: false },
      { text: "Rinse immediately under running water for 15 minutes.", correct: true },
      { text: "Neutralize it with a strong base.", correct: false }
    ],
    explanation: "Always flush chemical spills on skin with copious amounts of water. Never try to neutralize on the skin, as the reaction can generate heat and cause burns."
  },
  {
    situation: "A small beaker catches fire on your workbench.",
    options: [
      { text: "Throw a cup of water on it.", correct: false },
      { text: "Run out of the room screaming.", correct: false },
      { text: "Cover it with a watch glass or larger beaker to smother it.", correct: true }
    ],
    explanation: "Small beaker fires can easily be smothered by cutting off the oxygen supply. Never throw water on a chemical fire."
  }
];

const EmergencySimulator = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    setSelected(null);
    setCurrent((prev) => (prev + 1) % scenarios.length);
  };

  const activeScenario = scenarios[current];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-yellow-500/50 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider text-sm">Emergency Protocol Training</h4>
        <span className="text-xs text-gray-500 font-bold">{current + 1} / {scenarios.length}</span>
      </div>
      
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {activeScenario.situation}
      </p>

      <div className="space-y-3">
        {activeScenario.options.map((opt, idx) => {
          const isSelected = selected === idx;
          let btnClass = "border-gray-200 dark:border-gray-700 hover:border-yellow-500 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50";
          
          if (selected !== null) {
            if (opt.correct) btnClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
            else if (isSelected) btnClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
            else btnClass = "opacity-50 border-gray-200 dark:border-gray-800 text-gray-400";
          }

          return (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => setSelected(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${btnClass}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{activeScenario.explanation}</p>
            <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
              Next Scenario →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencySimulator;