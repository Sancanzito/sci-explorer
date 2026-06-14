import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../ThemeProvider';
import { 
  Calculator, FlaskConical, LineChart, ChevronDown, 
  Menu, X, Sun, Moon 
} from 'lucide-react';

// ==========================================
// 1. LOGO COMPONENT
// ==========================================
const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold font-mono text-xs transition-transform group-hover:scale-105">
        SE
      </div>
      <span className="font-mono text-sm tracking-widest uppercase font-bold text-black dark:text-white">
        Sci-<span className="text-blue-600">Explorer</span>
      </span>
    </Link>
  );
};

// ==========================================
// 2. THEME TOGGLE COMPONENT
// ==========================================
const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
      aria-label="Toggle Dark Mode"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

// ==========================================
// 3. TOOLS DROPDOWN COMPONENT
// ==========================================
const toolsData = [
  { name: 'Scientific Calculator', path: '/tools/calculator', icon: Calculator, description: 'Advanced computational matrix' },
  { name: 'Periodic Table', path: '/tools/periodic-table', icon: FlaskConical, description: 'Interactive element database' },
  { name: 'Data Visualization', path: '/graph', icon: LineChart, description: 'Plotting & structural analysis' }
];

const ToolsDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <button className={`flex items-center gap-2 font-mono text-xs tracking-widest uppercase font-bold py-2 px-3 transition-colors ${isActive ? 'text-blue-600' : 'text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-500'}`}>
        Instruments
        <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-[#09090B] border border-black/10 dark:border-white/10 z-50"
          >
            <div className="flex flex-col">
              {toolsData.map((tool, index) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className={`flex items-start gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${
                    index !== toolsData.length - 1 ? 'border-b border-black/10 dark:border-white/10' : ''
                  }`}
                >
                  <div className="mt-0.5 text-black/40 dark:text-white/40 group-hover:text-blue-600 transition-colors">
                    <tool.icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                      {tool.name}
                    </div>
                    <div className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                      {tool.description}
                    </div>
                  </div>
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
// 4. DESKTOP NAV COMPONENT
// ==========================================
const DesktopNav = ({ isDarkMode, toggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "font-mono text-xs tracking-widest uppercase font-bold transition-colors py-2 px-3 relative group flex items-center h-full";
    const isActive = location.pathname.startsWith(path);
    
    return isActive
      ? `${baseClass} text-blue-600`
      : `${baseClass} text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-500`;
  };

  return (
    <div className="hidden lg:flex items-center space-x-6 h-full">
      <Link to="/articles" className={getLinkClass('/articles')}>
        Archives
      </Link>
      
      <Link to="/simulations" className={getLinkClass('/simulations')}>
        Simulations
      </Link>

      <Link to="/quizzes" className={getLinkClass('/quizzes')}>
        Assessments
      </Link>
      
      <div 
        onMouseEnter={() => setActiveDropdown('tools')}
        onMouseLeave={() => setActiveDropdown(null)}
        className="relative h-full flex items-center"
      >
        <ToolsDropdown 
          isActive={activeDropdown === 'tools'}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </div>
      
      <div className="pl-6 border-l border-black/10 dark:border-white/10 h-10 flex items-center">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
};

// ==========================================
// 5. MOBILE NAV COMPONENT
// ==========================================
const MobileNav = ({ isOpen, setIsOpen, isDarkMode, toggleTheme }) => {
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const location = useLocation();

  const toggleMobileDropdown = (type) => {
    setMobileDropdown(mobileDropdown === type ? null : type);
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block p-4 font-mono text-xs tracking-widest uppercase font-bold transition-colors border-b border-black/10 dark:border-white/10";
    const isActive = location.pathname.startsWith(path);
    return isActive
      ? `${baseClass} text-blue-600 bg-black/5 dark:bg-white/5`
      : `${baseClass} text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5`;
  };

  return (
    <div className="lg:hidden flex items-center gap-4">
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[73px] left-0 right-0 bg-white dark:bg-[#09090B] border-b border-black/10 dark:border-white/10 shadow-2xl z-40 max-h-[calc(100vh-73px)] overflow-y-auto"
          >
            <div className="flex flex-col">
              <Link to="/articles" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/articles')}>
                Archives
              </Link>
              <Link to="/simulations" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/simulations')}>
                Simulations
              </Link>
              <Link to="/quizzes" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/quizzes')}>
                Assessments
              </Link>

              <div>
                <button
                  onClick={() => toggleMobileDropdown('tools')}
                  className="w-full flex justify-between items-center p-4 font-mono text-xs tracking-widest uppercase font-bold text-black dark:text-white border-b border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span>Instruments</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${mobileDropdown === 'tools' ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileDropdown === 'tools' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10"
                    >
                      <div className="flex flex-col pl-4">
                        {toolsData.map((tool, idx) => (
                          <Link 
                            key={tool.name}
                            to={tool.path} 
                            onClick={() => setIsOpen(false)} 
                            className={`flex items-center gap-3 p-4 font-mono text-xs tracking-widest uppercase text-black/70 dark:text-white/70 hover:text-blue-600 transition-colors ${idx !== toolsData.length - 1 ? 'border-b border-black/10 dark:border-white/10' : ''}`}
                          >
                            <tool.icon size={14} />
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 6. MAIN NAVBAR WRAPPER
// ==========================================
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Safely consume Theme Context
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode ?? true; 
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#09090B] border-b border-black/10 dark:border-white/10 transition-colors duration-300 h-[73px]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-full">
          <div className="flex items-center justify-between h-full">
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
      {/* Spacer to prevent content from hiding under the fixed navbar */}
      <div className="h-[73px]" />
    </>
  );
};

export default Navbar;