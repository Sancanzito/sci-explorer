// components/Navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navbar = ({ isDarkMode = true, toggleTheme = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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