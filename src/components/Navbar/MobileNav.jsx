// components/Navbar/MobileNav.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const MobileNav = ({ isOpen, setIsOpen, isDarkMode, toggleTheme }) => {
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const location = useLocation();

  const toggleMobileDropdown = (type) => {
    setMobileDropdown(mobileDropdown === type ? null : type);
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block p-3 text-base font-semibold rounded-xl transition-all border border-transparent backdrop-blur-sm";
    return location.pathname.startsWith(path)
      ? `${baseClass} text-indigo-600 dark:text-cyan-300 bg-white/60 dark:bg-[#0a0f1c]/60 border-white/50 dark:border-cyan-500/20 shadow-sm`
      : `${baseClass} text-slate-600 dark:text-cyan-100/70 hover:bg-white/40 dark:hover:bg-cyan-900/20`;
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-600 dark:text-cyan-100 hover:text-indigo-600 dark:hover:text-cyan-400 p-2 focus:outline-none"
        aria-label="Toggle Menu"
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
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-white/80 dark:bg-[#050b14]/90 backdrop-blur-2xl border-b border-white/40 dark:border-cyan-500/20 shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              <Link to="/articles" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/articles')}>
                📚 Articles Catalog
              </Link>
              <Link to="/simulations" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/simulations')}>
                🎮 Virtual Simulations
              </Link>
              <Link to="/quizzes" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/quizzes')}>
                📝 Interactive Quizzes
              </Link>

              <div className="border-t border-white/40 dark:border-cyan-500/20 pt-2">
                <button
                  onClick={() => toggleMobileDropdown('tools')}
                  className="w-full flex justify-between items-center p-3 text-base font-semibold text-slate-700 dark:text-cyan-100/90 hover:bg-white/40 dark:hover:bg-cyan-900/20 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2">🛠️ Laboratory Tools</span>
                  <span className={`text-xs transition-transform duration-200 ${mobileDropdown === 'tools' ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'tools' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white/40 dark:bg-black/20 rounded-xl mx-2 border border-white/30 dark:border-cyan-500/10"
                    >
                      <div className="pl-4 pr-2 py-2 space-y-1">
                        <Link to="/tools/calculator" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm font-medium text-slate-600 dark:text-cyan-200/70 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors">🧮 Scientific Calculator</Link>
                        <Link to="/tools/periodic-table" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm font-medium text-slate-600 dark:text-cyan-200/70 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors">⚗️ Periodic Table</Link>
                        <Link to="/graph" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm font-medium text-slate-600 dark:text-cyan-200/70 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors">📊 Scientific Visualization</Link>
                        <Link to="/tools/equation-solver" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm font-medium text-slate-600 dark:text-cyan-200/70 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors">📐 Equation Solver</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-white/40 dark:border-cyan-500/20 flex justify-center">
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