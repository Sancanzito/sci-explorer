// components/Navbar/NavigationLinks/ToolsDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const toolsData = [
  { name: 'Scientific Calculator', path: '/tools/calculator', icon: '🧮', description: 'Advanced scientific calculations', color: 'from-blue-500 to-cyan-500' },
  { name: 'Periodic Table', path: '/tools/periodic-table', icon: '⚗️', description: 'Interactive element explorer', color: 'from-purple-500 to-pink-500'},
  { name: 'Scientific Visualization', path: '/graph', icon: '📊', description: 'Advanced scientific plotting & analysis', color: 'from-green-500 to-teal-500' },
  { name: 'Equation Solver', path: '/tools/equation-solver', icon: '📐', description: 'Solve complex equations', color: 'from-orange-500 to-red-500' }
];

const ToolsDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <button className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-cyan-100/80 hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors py-1.5 px-3">
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
            className="absolute top-full right-0 mt-2 w-80 bg-white/70 dark:bg-[#0a0f1c]/80 backdrop-blur-2xl border border-white/50 dark:border-cyan-500/20 rounded-2xl shadow-xl dark:shadow-cyan-900/20 overflow-hidden z-50"
          >
            <div className="p-2">
              {toolsData.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-cyan-900/30 transition-all group"
                >
                  <div className={`text-2xl bg-gradient-to-br ${tool.color} bg-clip-text text-transparent drop-shadow-sm`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800 dark:text-cyan-50 group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-cyan-200/60">{tool.description}</div>
                  </div>
                  <motion.span 
                    className="text-indigo-400 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
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