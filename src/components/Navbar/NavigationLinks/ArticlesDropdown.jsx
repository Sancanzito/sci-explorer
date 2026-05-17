// components/Navbar/NavigationLinks/ArticlesDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const articleCategories = [
  {
    title: 'Microbiology & Genetics',
    emoji: '🧬',
    subTopics: [
      { name: 'DNA Isolation Protocols', path: '/articles/biology/dna-isolation' },
      { name: 'Protein Folding', path: '/articles/biology/proteins' },
      { name: 'CRISPR Case Studies', path: '/articles/biology/crispr' }
    ]
  },
  {
    title: 'Experimental Physics',
    emoji: '⚛️',
    subTopics: [
      { name: 'Thermodynamics Lab', path: '/articles/physics/thermal' },
      { name: 'Electromagnetism', path: '/articles/physics/em' },
      { name: "Newton's Law of Cooling", path: '/articles/physics/newton' }
    ]
  },
  {
    title: 'Chemistry',
    emoji: '🧪',
    subTopics: [
      { name: 'Organic Chemistry Basics', path: '/articles/chemistry/organic' },
      { name: 'Periodic Trends', path: '/articles/chemistry/periodic-trends' },
      { name: 'Chemical Bonding', path: '/articles/chemistry/bonding' }
    ]
  }
];

const ArticlesDropdown = ({ isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      <Link 
        to="/articles" 
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
      >
        📚 Articles
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
            className="absolute top-full left-0 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl mt-2 p-4 z-50"
          >
            {articleCategories.map((cat) => (
              <div key={cat.title} className="mb-4 last:mb-0">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1">
                  <span>{cat.emoji}</span> {cat.title}
                </div>
                <div className="space-y-1">
                  {cat.subTopics.map((topic) => (
                    <Link 
                      key={topic.name} 
                      to={topic.path} 
                      className="block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-md transition-colors"
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticlesDropdown;