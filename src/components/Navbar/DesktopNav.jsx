// components/Navbar/DesktopNav.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ToolsDropdown from './NavigationLinks/ToolsDropdown';
import ThemeToggle from './ThemeToggle';

const DesktopNav = ({ isDarkMode, toggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Helper class to highlight the active route link cleanly
  const getLinkClass = (path) => {
    const baseClass = "text-sm font-medium transition-colors duration-200 py-1.5 px-3 rounded-lg";
    return location.pathname.startsWith(path)
      ? `${baseClass} text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 font-semibold`
      : `${baseClass} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50`;
  };

  return (
    <div className="hidden lg:flex items-center space-x-3">
      {/* Direct Link to Articles Page */}
      <Link to="/articles" className={getLinkClass('/articles')}>
        Articles
      </Link>
      
      {/* Direct Link to Simulations Page */}
      <Link to="/simulations" className={getLinkClass('/simulations')}>
        Simulations
      </Link>

      {/* Direct Link to Quizzes Page */}
      <Link to="/quizzes" className={getLinkClass('/quizzes')}>
        Quizzes
      </Link>
      
      {/* Kept Dropdown ONLY for Interactive Tools */}
      <div 
        onMouseEnter={() => setActiveDropdown('tools')}
        onMouseLeave={() => setActiveDropdown(null)}
        className="relative"
      >
        <ToolsDropdown 
          isActive={activeDropdown === 'tools'}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </div>
      
      <div className="pl-2 border-l border-gray-200 dark:border-gray-800">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
};

export default DesktopNav;