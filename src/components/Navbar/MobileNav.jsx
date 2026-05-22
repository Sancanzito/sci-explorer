// components/Navbar/MobileNav.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import ToolsDropdown from './NavigationLinks/ToolsDropdown';

const MobileNav = ({ isOpen, setIsOpen, isDarkMode, toggleTheme }) => {
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const location = useLocation();

  const toggleMobileDropdown = (type) => {
    setMobileDropdown(mobileDropdown === type ? null : type);
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block p-3 text-base font-semibold rounded-xl transition-all";
    return location.pathname.startsWith(path)
      ? `${baseClass} text-cyan-600 dark:text-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/20 font-bold`
      : `${baseClass} text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60`;
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
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 p-2 focus:outline-none"
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
            className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              
              {/* Direct Page Route Links */}
              <Link 
                to="/articles" 
                onClick={() => setIsOpen(false)}
                className={getMobileLinkClass('/articles')}
              >
                📚 Articles Catalog
              </Link>

              <Link 
                to="/simulations" 
                onClick={() => setIsOpen(false)}
                className={getMobileLinkClass('/simulations')}
              >
                🎮 Virtual Simulations
              </Link>

              <Link 
                to="/quizzes" 
                onClick={() => setIsOpen(false)}
                className={getMobileLinkClass('/quizzes')}
              >
                📝 Interactive Quizzes
              </Link>

              {/* Collapsible Dropdown Structure: Tools Only */}
              <div className="border-t border-gray-100 dark:border-gray-800/50 pt-2">
                <button
                  onClick={() => toggleMobileDropdown('tools')}
                  className="w-full flex justify-between items-center p-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl"
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
                      className="overflow-hidden bg-gray-50/50 dark:bg-gray-950/20 rounded-xl mx-2"
                    >
                      <div className="pl-4 pr-2 py-2 space-y-1">
                        <Link to="/tools/calculator" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 rounded-lg">🧮 Scientific Calculator</Link>
                        <Link to="/tools/periodic-table" onClick={() => setIsOpen(false)} className="block p-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 rounded-lg">⚗️ Periodic Table</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle Area */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
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