import React, { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  { q: "What is the proper way to smell a chemical?", options: ["Inhale deeply directly over the flask", "Waft the vapors toward your nose", "Use a straw"], a: 1 },
  { q: "When diluting an acid, you should always:", options: ["Add water to the acid", "Add acid to the water", "Mix them simultaneously"], a: 1 },
  { q: "Broken glass should be disposed of in:", options: ["The regular trash can", "The sink", "A designated sharps/broken glass container"], a: 2 }
];

const SafetyQuizComponent = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx) => {
    if (idx === questions[current].a) setScore(score + 1);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-md mx-auto shadow-lg border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Quiz Complete!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You scored {score} out of {questions.length}.</p>
        
        {score === questions.length ? (
           <div className="p-4 bg-green-100 text-green-700 rounded-xl font-bold mb-6">Excellent! You are ready for the lab.</div>
        ) : (
           <div className="p-4 bg-yellow-100 text-yellow-700 rounded-xl font-bold mb-6">Good try! Review the guidelines and try again.</div>
        )}
        
        <button onClick={reset} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors">
          Retake Assessment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl w-full max-w-2xl mx-auto shadow-lg border border-gray-100 dark:border-gray-800 text-left">
      <div className="mb-6 flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Knowledge Check</h3>
        <span className="text-sm font-medium text-gray-500">Question {current + 1} of {questions.length}</span>
      </div>
      
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {questions[current].q}
      </p>
      
      <div className="space-y-3">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 text-gray-700 dark:text-gray-300 transition-all font-medium"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SafetyQuizComponent;