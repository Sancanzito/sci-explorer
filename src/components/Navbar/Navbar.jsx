import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. LOGO COMPONENT
// ==========================================
const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.span 
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-2xl drop-shadow-md"
      >
        🔬
      </motion.span>
      <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-mono">
        Sci<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 group-hover:from-cyan-500 group-hover:to-indigo-500 transition-all duration-300">Hub</span>
      </span>
    </Link>
  );
};

// ==========================================
// 2. THEME TOGGLE COMPONENT
// ==========================================
const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-200 border border-white/50 dark:border-cyan-500/30 backdrop-blur-sm shadow-inner"
      style={{
        backgroundColor: isDarkMode ? 'rgba(10, 15, 28, 0.6)' : 'rgba(255, 255, 255, 0.5)',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Background particles for light mode */}
      {!isDarkMode && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      )}

      {/* Stars for dark mode */}
      {isDarkMode && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      )}

      {/* Sliding Handle */}
      <motion.div
        className="absolute top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
        style={{
          backgroundColor: isDarkMode ? '#fbbf24' : '#6366f1',
          left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
        }}
        animate={{
          left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
          rotate: isDarkMode ? 0 : 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          scale: { duration: 0.3, times: [0, 0.5, 1] }
        }}
      >
        <motion.span
          className="text-xs"
          initial={false}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

// ==========================================
// 3. TOOLS DROPDOWN COMPONENT
// ==========================================
const toolsData = [
  { name: 'Scientific Calculator', path: '/tools/calculator', icon: '🧮', description: 'Advanced scientific calculations', color: 'from-blue-500 to-cyan-500' },
  { name: 'Periodic Table', path: '/tools/periodic-table', icon: '⚗️', description: 'Interactive element explorer', color: 'from-purple-500 to-pink-500'},
  { name: 'Scientific Visualization', path: '/graph', icon: '📊', description: 'Advanced scientific plotting & analysis', color: 'from-green-500 to-teal-500' }, 
  { name: 'Equation Solver', path: '/tools/equation-solver', icon: '📐', description: 'Solve complex equations', color: 'from-orange-500 to-red-500' }
];

const ToolsDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <button className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-cyan-100/80 hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors py-1.5 px-3">
        🛠️ Tools
        <motion.span animate={{ rotate: isActive ? 180 : 0 }}>
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-96 bg-white/70 dark:bg-[#0a0f1c]/80 backdrop-blur-2xl border border-white/50 dark:border-cyan-500/20 rounded-2xl shadow-xl dark:shadow-cyan-900/20 overflow-hidden z-50"
          >
            <div className="p-2">
              {toolsData.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-cyan-900/30 transition-all group"
                >
                  <div className={`text-2xl bg-gradient-to-br ${tool.color} bg-clip-text text-transparent drop-shadow-sm`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800 dark:text-cyan-50 group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-cyan-200/60">{tool.description}</div>
                  </div>
                  <motion.span 
                    className="text-indigo-400 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 5. DESKTOP NAV COMPONENT
// ==========================================
const DesktopNav = ({ isDarkMode, toggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Try-catch wrapped for isolated preview environment without a real router
  let location = null;
  try { location = useLocation(); } catch(e) {}

  const getLinkClass = (path) => {
    const baseClass = "text-sm transition-all duration-300 py-1.5 px-4 rounded-xl border border-transparent backdrop-blur-md";
    const isActive = location?.pathname ? location.pathname.startsWith(path) : false;
    return isActive
      ? `${baseClass} text-indigo-600 dark:text-cyan-300 bg-white/60 dark:bg-[#0a0f1c]/60 font-bold shadow-sm border-white/50 dark:border-cyan-500/20`
      : `${baseClass} text-slate-600 dark:text-cyan-100/70 hover:text-indigo-600 dark:hover:text-cyan-300 hover:bg-white/40 dark:hover:bg-cyan-900/20 font-semibold`;
  };

  return (
    <div className="hidden lg:flex items-center space-x-2">
      <Link to="/articles" className={getLinkClass('/articles')}>
        Articles
      </Link>
      
      <Link to="/simulations" className={getLinkClass('/simulations')}>
        Simulations
      </Link>

      <Link to="/quizzes" className={getLinkClass('/quizzes')}>
        Quizzes
      </Link>
      
      <div 
        onMouseEnter={() => setActiveDropdown('tools')}
        onMouseLeave={() => setActiveDropdown(null)}
        className="relative px-2"
      >
        <ToolsDropdown 
          isActive={activeDropdown === 'tools'}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </div>
      
      <div className="pl-3 ml-1 border-l border-white/50 dark:border-cyan-500/20">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
};

// ==========================================
// 6. MOBILE NAV COMPONENT
// ==========================================
const MobileNav = ({ isOpen, setIsOpen, isDarkMode, toggleTheme }) => {
  const [mobileDropdown, setMobileDropdown] = useState(null);
  
  // Try-catch wrapped for isolated preview environment without a real router
  let location = null;
  try { location = useLocation(); } catch(e) {}

  const toggleMobileDropdown = (type) => {
    setMobileDropdown(mobileDropdown === type ? null : type);
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block p-3 text-base font-semibold rounded-xl transition-all border border-transparent backdrop-blur-sm";
    const isActive = location?.pathname ? location.pathname.startsWith(path) : false;
    return isActive
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

// ==========================================
// 7. MAIN NAVBAR WRAPPER
// ==========================================
const Navbar = ({ isDarkMode = true, toggleTheme = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Try-catch wrapped for isolated preview environment without a real router
  let location = null;
  try { location = useLocation(); } catch(e) {}

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-[#050b14]/50 backdrop-blur-xl border-b border-white/40 dark:border-cyan-500/20 shadow-sm dark:shadow-cyan-900/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            <DesktopNav isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            
            <MobileNav 
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
};

export default Navbar;