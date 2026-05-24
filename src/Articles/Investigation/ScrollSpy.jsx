// ScrollSpy.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiberManualRecord } from '@mui/icons-material';

const ScrollSpy = ({ sections, activeSection, onSectionClick }) => {
  return (
    <nav className="w-full">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
          📑 Document Sections
        </p>
        <div className="relative flex flex-col gap-1 border-l-2 border-gray-100 dark:border-gray-700/60 pl-2 ml-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`group relative flex items-center gap-3 py-2 px-2 rounded-xl text-left transition-all duration-200 w-full outline-none cursor-pointer ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-700/40'
                }`}
              >
                <div className="relative flex items-center justify-center w-3 h-3 z-10">
                  {isActive && (
                    <motion.span 
                      layoutId="libraryGlowNode"
                      className="absolute w-5 h-5 bg-blue-500/20 dark:bg-blue-400/30 rounded-full blur-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <FiberManualRecord 
                    className={`w-2 h-2 transition-all duration-200 ${
                      isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-300 dark:text-gray-600'
                    }`} 
                  />
                </div>
                <span className={`text-xs font-medium truncate pr-2 transition-all duration-200 ${
                  isActive ? 'font-bold' : ''
                }`}>
                  {section.title}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="libIndicatorBar"
                    className="absolute right-2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ScrollSpy;