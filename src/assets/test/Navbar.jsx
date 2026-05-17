// Navbar.jsx - Updated with Tools navbar and Unit Converter
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState(false);
  const [converterValues, setConverterValues] = useState({
    fromUnit: 'meters',
    toUnit: 'feet',
    fromValue: 1,
    toValue: 3.28084
  });
  const location = useLocation();

  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location]);

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
        { name: 'Newton\'s Law of Cooling', path: '/articles/physics/newton' }
      ]
    }
  ];

  // Unit conversion definitions
  const unitCategories = {
    length: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.344,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254
    },
    mass: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      pounds: 0.453592,
      ounces: 0.0283495,
      tons: 1000
    },
    temperature: {
      celsius: 'celsius',
      fahrenheit: 'fahrenheit',
      kelvin: 'kelvin'
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('length');
  const [conversionResult, setConversionResult] = useState(null);

  const handleUnitConversion = (value, fromUnit, toUnit, category) => {
    if (category === 'temperature') {
      let celsius = 0;
      if (fromUnit === 'celsius') celsius = value;
      else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
      else if (fromUnit === 'kelvin') celsius = value - 273.15;
      
      let result = 0;
      if (toUnit === 'celsius') result = celsius;
      else if (toUnit === 'fahrenheit') result = celsius * 9/5 + 32;
      else if (toUnit === 'kelvin') result = celsius + 273.15;
      
      return result;
    } else {
      const baseValue = value * unitCategories[category][fromUnit];
      return baseValue / unitCategories[category][toUnit];
    }
  };

  const updateConversion = (field, value) => {
    if (field === 'fromValue') {
      const result = handleUnitConversion(
        parseFloat(value) || 0,
        converterValues.fromUnit,
        converterValues.toUnit,
        selectedCategory
      );
      setConverterValues({
        ...converterValues,
        fromValue: value,
        toValue: result
      });
      setConversionResult(result);
    } else if (field === 'toValue') {
      const result = handleUnitConversion(
        parseFloat(value) || 0,
        converterValues.toUnit,
        converterValues.fromUnit,
        selectedCategory
      );
      setConverterValues({
        ...converterValues,
        toValue: value,
        fromValue: result
      });
      setConversionResult(result);
    } else if (field === 'fromUnit') {
      const result = handleUnitConversion(
        parseFloat(converterValues.fromValue) || 0,
        value,
        converterValues.toUnit,
        selectedCategory
      );
      setConverterValues({
        ...converterValues,
        fromUnit: value,
        toValue: result
      });
      setConversionResult(result);
    } else if (field === 'toUnit') {
      const result = handleUnitConversion(
        parseFloat(converterValues.fromValue) || 0,
        converterValues.fromUnit,
        value,
        selectedCategory
      );
      setConverterValues({
        ...converterValues,
        toUnit: value,
        toValue: result
      });
      setConversionResult(result);
    }
  };

  // Tools menu items
  const toolsLinks = [
    { name: 'Unit Converter', icon: '📐', action: 'converter', hasDropdown: true },
    { name: 'Scientific Calculator', path: '/tools/calculator', icon: '🧮', description: 'Advanced scientific calculations' },
    { name: 'Periodic Table', path: '/tools/periodic-table', icon: '⚗️', description: 'Interactive element explorer' },
    { name: 'Graph Plotter', path: '/tools/graph-plotter', icon: '📈', description: 'Plot mathematical functions' }
  ];

  const navigationLinks = [
    { name: 'Articles', path: '/articles', emoji: '📚', hasDropdown: true },
    { name: 'Simulations', path: '/simulations', emoji: '💻' },
    { name: 'Quizzes', path: '/quizzes', emoji: '✏️' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.span 
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-2xl"
              >
                🔬
              </motion.span>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                Sci<span className="text-cyan-600 dark:text-cyan-400">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative" 
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown('articles')} 
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <motion.span animate={{ rotate: activeDropdown === 'articles' ? 180 : 0 }}>
                        ▾
                      </motion.span>
                    )}
                  </Link>

                  <AnimatePresence>
                    {link.hasDropdown && activeDropdown === 'articles' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl mt-2 p-3"
                      >
                        {articleCategories.map((cat) => (
                          <div key={cat.title} className="mb-3 last:mb-0">
                            <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{cat.emoji} {cat.title}</div>
                            {cat.subTopics.map((topic) => (
                              <Link key={topic.name} to={topic.path} className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
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
              
              {/* Tools Menu */}
              <div 
                className="relative" 
                onMouseEnter={() => setActiveDropdown('tools')} 
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setIsUnitConverterOpen(false);
                }}
              >
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  🛠️ Tools
                  <motion.span animate={{ rotate: activeDropdown === 'tools' ? 180 : 0 }}>
                    ▾
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'tools' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden"
                    >
                      {toolsLinks.map((tool) => (
                        <div key={tool.name}>
                          {tool.action === 'converter' ? (
                            <>
                              <button
                                onClick={() => setIsUnitConverterOpen(!isUnitConverterOpen)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                              >
                                <span className="text-xl">{tool.icon}</span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                                </div>
                                <motion.span
                                  animate={{ rotate: isUnitConverterOpen ? 180 : 0 }}
                                  className="text-gray-400"
                                >
                                  ▼
                                </motion.span>
                              </button>
                              
                              {/* Unit Converter Collapsible Panel */}
                              <AnimatePresence>
                                {isUnitConverterOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                                  >
                                    <div className="p-4 space-y-3">
                                      {/* Category Selector */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Category</label>
                                        <div className="flex gap-2">
                                          {['length', 'mass', 'temperature'].map((cat) => (
                                            <button
                                              key={cat}
                                              onClick={() => {
                                                setSelectedCategory(cat);
                                                const units = Object.keys(unitCategories[cat]);
                                                const newFromUnit = units[0];
                                                const newToUnit = units[1] || units[0];
                                                updateConversion('fromUnit', newFromUnit);
                                                setConverterValues({
                                                  ...converterValues,
                                                  fromUnit: newFromUnit,
                                                  toUnit: newToUnit
                                                });
                                              }}
                                              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                                                selectedCategory === cat
                                                  ? 'bg-cyan-500 text-white'
                                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                              }`}
                                            >
                                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      {/* From Unit */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">From</label>
                                        <div className="flex gap-2">
                                          <select
                                            value={converterValues.fromUnit}
                                            onChange={(e) => updateConversion('fromUnit', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
                                          >
                                            {Object.keys(unitCategories[selectedCategory]).map((unit) => (
                                              <option key={unit} value={unit}>
                                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                              </option>
                                            ))}
                                          </select>
                                          <input
                                            type="number"
                                            value={converterValues.fromValue}
                                            onChange={(e) => updateConversion('fromValue', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Swap Button */}
                                      <div className="flex justify-center">
                                        <button
                                          onClick={() => {
                                            const tempUnit = converterValues.fromUnit;
                                            const tempValue = converterValues.fromValue;
                                            updateConversion('fromUnit', converterValues.toUnit);
                                            setConverterValues({
                                              ...converterValues,
                                              fromUnit: converterValues.toUnit,
                                              toUnit: tempUnit,
                                              fromValue: converterValues.toValue,
                                              toValue: tempValue
                                            });
                                          }}
                                          className="text-gray-500 hover:text-cyan-500 transition-colors"
                                        >
                                          🔄 Swap
                                        </button>
                                      </div>
                                      
                                      {/* To Unit */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">To</label>
                                        <div className="flex gap-2">
                                          <select
                                            value={converterValues.toUnit}
                                            onChange={(e) => updateConversion('toUnit', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
                                          >
                                            {Object.keys(unitCategories[selectedCategory]).map((unit) => (
                                              <option key={unit} value={unit}>
                                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                              </option>
                                            ))}
                                          </select>
                                          <input
                                            type="number"
                                            value={converterValues.toValue}
                                            onChange={(e) => updateConversion('toValue', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Result Display */}
                                      {conversionResult !== null && (
                                        <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                          <p className="text-xs text-gray-500 dark:text-gray-400">Result</p>
                                          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                                            {converterValues.fromValue} {converterValues.fromUnit} = {converterValues.toValue.toFixed(6)} {converterValues.toUnit}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <Link
                              to={tool.path}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <span className="text-xl">{tool.icon}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{tool.description}</div>
                              </div>
                            </Link>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Animated Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full p-1 transition-colors duration-200"
                style={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb',
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle Dark Mode"
              >
                {/* Background particles animation for light mode */}
                {!isDarkMode && (
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Stars animation for dark mode */}
                {isDarkMode && (
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Sliding Handle */}
                <motion.div
                  className="absolute top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
                  style={{
                    backgroundColor: isDarkMode ? '#fbbf24' : '#6366f1',
                    left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
                  }}
                  animate={{
                    left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
                    rotate: isDarkMode ? 0 : 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    scale: {
                      duration: 0.3,
                      times: [0, 0.5, 1],
                    }
                  }}
                >
                  <motion.span
                    className="text-xs"
                    initial={false}
                    animate={{
                      scale: isDarkMode ? [0, 1.2, 1] : [0, 1.2, 1],
                      rotate: isDarkMode ? 0 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDarkMode ? '🌙' : '☀️'}
                  </motion.span>
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
};

export default Navbar;