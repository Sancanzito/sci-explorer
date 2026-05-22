// components/ChemistryModels/ScrollSpy.jsx
import React from 'react';
import Scrollspy from 'react-scrollspy-navigation';
import { motion } from 'framer-motion';

const ScrollSpy = ({ sections, activeSection, onSectionClick }) => {
  return (
    // Removed position fixed styles to prevent viewport collision overlaps
    <nav className="w-full hidden lg:block">
      {/* Clear dark text contrasts and distinct background colors */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-200 dark:border-gray-700 w-full max-h-[60vh] flex flex-col overflow-y-auto overflow-x-hidden">
        
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 selection:bg-transparent">
          Document Sections
        </p>

        <Scrollspy offset={-90}>
          <div className="relative flex flex-col gap-1 border-l-2 border-gray-100 dark:border-gray-700/60 pl-2 ml-1">
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
                  className={`group relative flex items-center gap-3 py-2 px-2 rounded-xl text-left transition-all duration-200 w-full outline-none ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-700/40'
                  }`}
                >
                  {/* Visual Glowing Navigation Node Anchor */}
                  <div className="relative flex items-center justify-center w-3 h-3 z-10">
                    {/* Outer Pulse Glow Ring */}
                    {isActive && (
                      <motion.span 
                        layoutId="libraryGlowNode"
                        className="absolute w-5 h-5 bg-blue-500/20 dark:bg-blue-400/30 rounded-full blur-xs shadow-[0_0_12px_2px_rgba(59,130,246,0.4)]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}

                    {/* Core Indicator Dot */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 dark:bg-blue-400 scale-110 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
                          : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                      }`}
                    />
                  </div>

                  {/* Content Item Section Header Label */}
                  <span className={`text-xs font-medium truncate pr-2 transition-all duration-200 ${
                    isActive ? 'font-bold' : ''
                  }`}>
                    {section.title}
                  </span>

                  {/* Dynamic trailing underline hook */}
                  {isActive && (
                    <motion.div
                      layoutId="libIndicatorBar"
                      className="absolute right-2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
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

export default ScrollSpy;