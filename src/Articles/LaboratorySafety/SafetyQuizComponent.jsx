import React, { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  { q: "What is the proper way to check the odor of a chemical?", options: ["Inhale deeply directly over the flask", "Waft the vapors gently toward your nose", "Use a glass straw to inhale"], a: 1 },
  { q: "When diluting a concentrated acid, you should always:", options: ["Add water to the acid rapidly", "Add acid to the water slowly", "Mix them simultaneously in a beaker"], a: 1 },
  { q: "Broken glass should be disposed of in:", options: ["The regular paper trash can", "The sink drain", "A designated rigid sharps/broken glass container"], a: 2 },
  { q: "In the PASS fire extinguisher method, what does the 'A' stand for?", options: ["Activate the alarm", "Aim at the base of the fire", "Ascend the stairs"], a: 1 },
  { q: "Which of the following is considered a major violation of laboratory ethics?", options: ["Cleaning a beaker twice", "Falsifying data to match a hypothesis", "Asking a partner to double-check a measurement"], a: 1 }
];

const SafetyQuizComponent = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx) => {
    let newScore = score;
    if (idx === questions[current].a) {
      newScore = score + 1;
      setScore(newScore);
    }
    
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
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full shadow-lg border border-gray-100 dark:border-gray-800 text-center">
        <div className="text-4xl mb-4">{score === questions.length ? '🏆' : '📚'}</div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Assessment Complete</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You scored {score} out of {questions.length}.</p>
        
        {score === questions.length ? (
           <div className="p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-bold mb-6">Excellent! You have mastered the safety protocols.</div>
        ) : (
           <div className="p-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-xl font-bold mb-6">Good effort! Review the module sections you missed and try again.</div>
        )}
        
        <button onClick={reset} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Retake Assessment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl w-full shadow-lg border border-gray-100 dark:border-gray-800 text-left">
      <div className="mb-6 flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span>🧠</span> Final Knowledge Check
        </h3>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
          Question {current + 1} of {questions.length}
        </span>
      </div>
      
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
        {questions[current].q}
      </p>
      
      <div className="space-y-3">
        {questions[current].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-gray-700 dark:text-gray-300 transition-all font-medium"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SafetyQuizComponent;