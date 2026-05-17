// components/Navbar/NavigationLinks/SimulationsDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const simulationsData = [
  {
    category: 'Physics Labs',
    emoji: '⚡',
    simulations: [
      { name: 'Projectile Motion', path: '/simulations/physics/projectile', icon: '🎯', description: 'Launch objects with different angles' },
      { name: 'Wave Interference', path: '/simulations/physics/waves', icon: '🌊', description: 'Explore wave patterns' },
      { name: 'Circuit Builder', path: '/simulations/physics/circuits', icon: '💡', description: 'Build electrical circuits' }
    ]
  },
  {
    category: 'Chemistry Labs',
    emoji: '🧪',
    simulations: [
      { name: 'Molecular Builder', path: '/simulations/chemistry/molecules', icon: '⚛️', description: 'Build 3D molecules' },
      { name: 'Titration Experiment', path: '/simulations/chemistry/titration', icon: '🔬', description: 'Acid-base titration' },
      { name: 'Reaction Rates', path: '/simulations/chemistry/reactions', icon: '🔥', description: 'Study chemical kinetics' }
    ]
  },
  {
    category: 'Biology Labs',
    emoji: '🧬',
    simulations: [
      { name: 'Cell Division', path: '/simulations/biology/cell-division', icon: '🔬', description: 'Mitosis & Meiosis' },
      { name: 'DNA Replication', path: '/simulations/biology/dna', icon: '🧬', description: 'DNA replication process' },
      { name: 'Ecosystem Simulator', path: '/simulations/biology/ecosystem', icon: '🌿', description: 'Food web dynamics' }
    ]
  }
];

const SimulationsDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <Link 
        to="/simulations" 
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
      >
        💻 Simulations
        <motion.span animate={{ rotate: isActive ? 180 : 0 }}>
          ▾
        </motion.span>
      </Link>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl mt-2 p-4 z-50"
          >
            <div className="grid grid-cols-3 gap-4">
              {simulationsData.map((category) => (
                <div key={category.category}>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1">
                    <span>{category.emoji}</span> {category.category}
                  </div>
                  <div className="space-y-3">
                    {category.simulations.map((sim) => (
                      <Link
                        key={sim.name}
                        to={sim.path}
                        className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{sim.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {sim.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {sim.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/simulations" 
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center justify-center gap-1"
              >
                Browse All Simulations →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimulationsDropdown;