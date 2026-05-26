// components/LaboratorySafety/LabSafetyScrollSpy.jsx
import React from 'react';
import Scrollspy from 'react-scrollspy-navigation';
import { motion } from 'framer-motion';

const LabSafetyScrollSpy = ({ sections, activeSection, onSectionClick }) => {
  return (
    <nav className="w-full hidden lg:block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 w-full max-h-[60vh] flex flex-col overflow-y-auto overflow-x-hidden">
        
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 selection:bg-transparent">
          Safety Protocol Sections
        </p>

        <Scrollspy offset={-90}>
          <div className="relative flex flex-col gap-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2 ml-1">
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
                      ? 'text-yellow-700 dark:text-yellow-500 bg-yellow-50/60 dark:bg-yellow-900/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {/* Visual Glowing Navigation Node Anchor */}
                  <div className="relative flex items-center justify-center w-3 h-3 z-10">
                    {/* Outer Pulse Glow Ring - Updated to Yellow */}
                    {isActive && (
                      <motion.span 
                        layoutId="safetyGlowNode"
                        className="absolute w-5 h-5 bg-yellow-500/20 dark:bg-yellow-400/30 rounded-full blur-xs shadow-[0_0_12px_2px_rgba(234,179,8,0.4)]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}

                    {/* Core Indicator Dot - Updated to Yellow */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-yellow-500 dark:bg-yellow-500 scale-110 shadow-[0_0_6px_rgba(234,179,8,0.6)]'
                          : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                      }`}
                    />
                  </div>

                  {/* Content Item Section Header Label */}
                  <span className={`text-xs font-medium truncate pr-2 transition-all duration-200 ${
                    isActive ? 'font-bold' : ''
                  }`}>
                    {section.title}
                  </span>

                  {/* Dynamic trailing underline hook - Updated to Yellow */}
                  {isActive && (
                    <motion.div
                      layoutId="safetyIndicatorBar"
                      className="absolute right-2 w-1 h-1 rounded-full bg-yellow-500 dark:bg-yellow-500"
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

export default LabSafetyScrollSpy;