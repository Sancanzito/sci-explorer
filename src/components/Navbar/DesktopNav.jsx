// components/Navbar/DesktopNav.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ToolsDropdown from './NavigationLinks/ToolsDropdown';
import ThemeToggle from './ThemeToggle';

const DesktopNav = ({ isDarkMode, toggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Highlight the active route link cleanly with gamified glass styling
  const getLinkClass = (path) => {
    const baseClass = "text-sm transition-all duration-300 py-1.5 px-4 rounded-xl border border-transparent backdrop-blur-md";
    return location.pathname.startsWith(path)
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

export default DesktopNav;