// components/Navbar/NavigationLinks/ToolsDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UnitConverter from '../UnitConverter';

const toolsData = [
  { name: 'Scientific Calculator', path: '/tools/calculator', icon: '🧮', description: 'Advanced scientific calculations', color: 'from-blue-500 to-cyan-500' },
  { name: 'Periodic Table', path: '/tools/periodic-table', icon: '⚗️', description: 'Interactive element explorer', color: 'from-purple-500 to-pink-500' },
  { name: 'Graph Plotter', path: '/tools/graph-plotter', icon: '📈', description: 'Plot mathematical functions', color: 'from-green-500 to-teal-500' },
  { name: 'Equation Solver', path: '/tools/equation-solver', icon: '📐', description: 'Solve complex equations', color: 'from-orange-500 to-red-500' }
];

const ToolsDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false);

  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={() => {
        onMouseLeave();
        setIsUnitConverterOpen(false);
      }}
    >
      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
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
            className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Unit Converter Section */}
            <div>
              <button
                onClick={() => setIsUnitConverterOpen(!isUnitConverterOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📐</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Unit Converter</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Convert between different units</div>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: isUnitConverterOpen ? 180 : 0 }}
                  className="text-gray-400"
                >
                  ▼
                </motion.span>
              </button>
              
              <AnimatePresence>
                {isUnitConverterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    <UnitConverter />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

            {/* Other Tools */}
            <div className="p-2">
              {toolsData.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                >
                  <div className={`text-2xl bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</div>
                  </div>
                  <motion.span 
                    className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
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

export default ToolsDropdown;