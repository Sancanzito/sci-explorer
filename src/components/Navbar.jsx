import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Close dropdowns/menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location]);

  const articleCategories = [
    {
      title: 'Quantum Physics',
      emoji: '⚛️',
      subTopics: [
        { name: 'Wave Functions', path: '/articles/quantum/wave-functions' },
        { name: 'Schrödinger Equation', path: '/articles/quantum/schrodinger' },
        { name: 'Quantum Entanglement', path: '/articles/quantum/entanglement' }
      ]
    },
    {
      title: 'Molecular Biology',
      emoji: '🧬',
      subTopics: [
        { name: 'DNA Replication', path: '/articles/biology/dna-replication' },
        { name: 'CRISPR Technology', path: '/articles/biology/crispr' },
        { name: 'Protein Synthesis', path: '/articles/biology/proteins' }
      ]
    },
    {
      title: 'Chemical Engineering',
      emoji: '🧪',
      subTopics: [
        { name: 'Catalysis', path: '/articles/chemistry/catalysis' },
        { name: 'Polymer Science', path: '/articles/chemistry/polymers' },
        { name: 'Thermodynamics', path: '/articles/chemistry/thermodynamics' }
      ]
    }
  ];

  const chatLinks = [
    { name: 'Articles Assistant', path: '/chat/articles', emoji: '📄', description: 'Discuss research papers' },
    { name: 'Simulations Chat', path: '/chat/simulations', emoji: '🔬', description: 'Explore experiments' },
    { name: 'Quizzes Helper', path: '/chat/quizzes', emoji: '❓', description: 'Practice problems' }
  ];

  const navigationLinks = [
    { name: 'Articles', path: '/articles', emoji: '📚', hasDropdown: true },
    { name: 'Simulations', path: '/simulations', emoji: '🔬' },
    { name: 'Quizzes', path: '/quizzes', emoji: '❓' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Mobile Trigger */}
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-300 hover:text-cyan-400 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>

              <Link to="/" className="flex items-center gap-2 group">
                <motion.span 
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  🔬
                </motion.span>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  SciHub
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationLinks.map((link) => (
                <div key={link.name} className="relative" onMouseEnter={() => link.hasDropdown && setActiveDropdown('articles')} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <span>{link.emoji}</span>
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <motion.svg 
                        animate={{ rotate: activeDropdown === 'articles' ? 180 : 0 }}
                        className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    )}
                  </Link>

                  <AnimatePresence>
                    {link.hasDropdown && activeDropdown === 'articles' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl mt-2 overflow-hidden p-2"
                      >
                        {articleCategories.map((cat) => (
                          <div key={cat.title} className="mb-2 last:mb-0">
                            <div className="px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                              <span>{cat.emoji}</span> {cat.title}
                            </div>
                            {cat.subTopics.map((topic) => (
                              <Link 
                                key={topic.name} 
                                to={topic.path}
                                className="block px-3 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-all"
                              >
                                {topic.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* AI Assistant Button */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('chat')} onMouseLeave={() => setActiveDropdown(null)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium shadow-lg shadow-cyan-900/20"
              >
                <span>💬</span>
                <span className="hidden sm:inline">AI Assistant</span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === 'chat' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-2"
                  >
                    {chatLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg group"
                      >
                        <span className="text-xl group-hover:scale-125 transition-transform">{link.emoji}</span>
                        <div>
                          <div className="text-sm font-medium text-white">{link.name}</div>
                          <div className="text-xs text-gray-500">{link.description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-gray-950 z-50 p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-white">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {navigationLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="flex items-center gap-4 text-lg text-gray-300 hover:text-cyan-400">
                    <span className="text-2xl">{link.emoji}</span>
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
};

export default Navbar;