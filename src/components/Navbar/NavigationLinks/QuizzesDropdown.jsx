// components/Navbar/NavigationLinks/QuizzesDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const quizzesData = [
  {
    difficulty: 'Beginner',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    quizzes: [
      { name: 'Basic Biology Quiz', path: '/quizzes/biology/basics', questions: 10, time: '5 min', icon: '🧬' },
      { name: 'Physics Fundamentals', path: '/quizzes/physics/fundamentals', questions: 15, time: '8 min', icon: '⚡' },
      { name: 'Chemistry 101', path: '/quizzes/chemistry/101', questions: 12, time: '6 min', icon: '🧪' }
    ]
  },
  {
    difficulty: 'Intermediate',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    quizzes: [
      { name: 'Genetics Challenge', path: '/quizzes/biology/genetics', questions: 20, time: '12 min', icon: '🧬' },
      { name: 'Quantum Mechanics', path: '/quizzes/physics/quantum', questions: 18, time: '15 min', icon: '⚛️' },
      { name: 'Organic Chemistry', path: '/quizzes/chemistry/organic', questions: 20, time: '15 min', icon: '🔬' }
    ]
  },
  {
    difficulty: 'Advanced',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    quizzes: [
      { name: 'Molecular Biology', path: '/quizzes/biology/molecular', questions: 25, time: '20 min', icon: '🧬' },
      { name: 'Thermodynamics', path: '/quizzes/physics/thermo', questions: 22, time: '18 min', icon: '🔥' },
      { name: 'Biochemistry', path: '/quizzes/chemistry/biochemistry', questions: 25, time: '20 min', icon: '⚗️' }
    ]
  }
];

const QuizzesDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <Link 
        to="/quizzes" 
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
      >
        ✏️ Quizzes
        <motion.span animate={{ rotate: isActive ? 180 : 0 }}>
          ▾
        </motion.span>
      </Link>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 w-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl mt-2 p-4 z-50"
          >
            <div className="space-y-4">
              {quizzesData.map((level) => (
                <div key={level.difficulty} className={`border-l-4 ${level.borderColor} pl-3`}>
                  <div className={`text-xs font-bold ${level.color} uppercase mb-2 flex items-center gap-1`}>
                    <span>{level.difficulty === 'Beginner' ? '🌱' : level.difficulty === 'Intermediate' ? '⚡' : '🔥'}</span>
                    {level.difficulty}
                  </div>
                  <div className="space-y-2">
                    {level.quizzes.map((quiz) => (
                      <Link
                        key={quiz.name}
                        to={quiz.path}
                        className={`flex items-center justify-between p-2 ${level.bgColor} rounded-lg hover:shadow-md transition-all group`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{quiz.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {quiz.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>📝 {quiz.questions} questions</span>
                              <span>⏱️ {quiz.time}</span>
                            </div>
                          </div>
                        </div>
                        <motion.span 
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/quizzes/random" 
                className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline flex items-center justify-center gap-2"
              >
                <span>🎲</span> Take Random Quiz
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizzesDropdown;