import React from 'react';
import Scrollspy from 'react-scrollspy-navigation';
import { motion } from 'framer-motion';

const SciSkillsScrollSpy = ({ sections, activeSection, onSectionClick }) => {
  return (
    <nav className="w-full hidden lg:block">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-5 border border-blue-100 dark:border-gray-800 w-full max-h-[70vh] flex flex-col overflow-y-auto overflow-x-hidden relative">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>

        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
          Investigation Steps
        </p>

        <Scrollspy offset={-90}>
          <div className="relative flex flex-col gap-1.5 border-l-2 border-blue-100 dark:border-gray-800 pl-3 ml-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionClick(section.id);
                  }}
                  className={`group relative flex items-center gap-3 py-2 px-3 rounded-xl text-left transition-all duration-300 w-full outline-none ${
                    isActive 
                      ? 'text-blue-700 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-900/20 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="relative flex items-center justify-center w-3 h-3 z-10">
                    {isActive && (
                      <motion.span 
                        layoutId="sciGlowNode"
                        className="absolute w-6 h-6 bg-cyan-400/20 dark:bg-cyan-400/20 rounded-full blur-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-cyan-500 dark:bg-cyan-400 scale-125 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                          : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-blue-300 dark:group-hover:bg-gray-500'
                      }`}
                    />
                  </div>

                  <span className={`text-xs md:text-sm font-medium truncate pr-2 transition-all duration-200 ${
                    isActive ? 'font-extrabold' : ''
                  }`}>
                    {section.title}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="sciIndicatorBar"
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                      transition={{ type: "spring", stiffness: 250, damping: 25 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </Scrollspy>
      </div>
    </nav>
  );
};

export default SciSkillsScrollSpy;