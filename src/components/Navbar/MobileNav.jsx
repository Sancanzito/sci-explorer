// components/Navbar/MobileNav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import ArticlesDropdown from './NavigationLinks/ArticlesDropdown';
import SimulationsDropdown from './NavigationLinks/SimulationsDropdown';
import QuizzesDropdown from './NavigationLinks/QuizzesDropdown';
import ToolsDropdown from './NavigationLinks/ToolsDropdown';

const MobileNav = ({ isOpen, setIsOpen, isDarkMode, toggleTheme }) => {
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {/* Articles Section */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'articles' ? null : 'articles')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span className="font-medium text-gray-900 dark:text-white">Articles</span>
                  </div>
                  <motion.span animate={{ rotate: mobileDropdown === 'articles' ? 180 : 0 }}>
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'articles' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-2 mt-2">
                        <Link to="/articles/biology/dna-isolation" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🧬 DNA Isolation Protocols
                        </Link>
                        <Link to="/articles/biology/proteins" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🧬 Protein Folding
                        </Link>
                        <Link to="/articles/physics/thermal" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          ⚛️ Thermodynamics Lab
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Simulations Section */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'simulations' ? null : 'simulations')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span className="font-medium text-gray-900 dark:text-white">Simulations</span>
                  </div>
                  <motion.span animate={{ rotate: mobileDropdown === 'simulations' ? 180 : 0 }}>
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'simulations' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-2 mt-2">
                        <Link to="/simulations/physics/projectile" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🎯 Projectile Motion
                        </Link>
                        <Link to="/simulations/chemistry/molecules" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          ⚛️ Molecular Builder
                        </Link>
                        <Link to="/simulations/biology/cell-division" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🔬 Cell Division
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quizzes Section */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'quizzes' ? null : 'quizzes')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>✏️</span>
                    <span className="font-medium text-gray-900 dark:text-white">Quizzes</span>
                  </div>
                  <motion.span animate={{ rotate: mobileDropdown === 'quizzes' ? 180 : 0 }}>
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'quizzes' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-2 mt-2">
                        <Link to="/quizzes/biology/basics" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🌱 Basic Biology
                        </Link>
                        <Link to="/quizzes/physics/fundamentals" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          ⚡ Physics Fundamentals
                        </Link>
                        <Link to="/quizzes/chemistry/101" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🧪 Chemistry 101
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tools Section */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'tools' ? null : 'tools')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>🛠️</span>
                    <span className="font-medium text-gray-900 dark:text-white">Tools</span>
                  </div>
                  <motion.span animate={{ rotate: mobileDropdown === 'tools' ? 180 : 0 }}>
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'tools' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-2 mt-2">
                        <Link to="/tools/calculator" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          🧮 Scientific Calculator
                        </Link>
                        <Link to="/tools/periodic-table" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          ⚗️ Periodic Table
                        </Link>
                        <Link to="/tools/graph-plotter" className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          📈 Graph Plotter
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle in Mobile */}
              <div className="pt-4 flex justify-center">
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;