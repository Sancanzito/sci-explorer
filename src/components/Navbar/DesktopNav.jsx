// components/Navbar/DesktopNav.jsx
import React, { useState } from 'react';
import ArticlesDropdown from './NavigationLinks/ArticlesDropdown';
import SimulationsDropdown from './NavigationLinks/SimulationsDropdown';
import QuizzesDropdown from './NavigationLinks/QuizzesDropdown';
import ToolsDropdown from './NavigationLinks/ToolsDropdown';
import ThemeToggle from './ThemeToggle';

const DesktopNav = ({ isDarkMode, toggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div className="hidden lg:flex items-center space-x-6">
      <ArticlesDropdown 
        isActive={activeDropdown === 'articles'}
        onMouseEnter={() => setActiveDropdown('articles')}
        onMouseLeave={() => setActiveDropdown(null)}
      />
      
      <SimulationsDropdown 
        isActive={activeDropdown === 'simulations'}
        onMouseEnter={() => setActiveDropdown('simulations')}
        onMouseLeave={() => setActiveDropdown(null)}
      />
      
      <QuizzesDropdown 
        isActive={activeDropdown === 'quizzes'}
        onMouseEnter={() => setActiveDropdown('quizzes')}
        onMouseLeave={() => setActiveDropdown(null)}
      />
      
      <ToolsDropdown 
        isActive={activeDropdown === 'tools'}
        onMouseEnter={() => setActiveDropdown('tools')}
        onMouseLeave={() => setActiveDropdown(null)}
      />
      
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
};

export default DesktopNav;