// components/PeriodicTable.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as periodicTable from 'periodic-table';

const PeriodicTable = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed
  const [showModal, setShowModal] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

  // Load periodic table data
  useEffect(() => {
    try {
      // Get all elements from the periodic-table package
      const allElements = periodicTable.all;
      setElements(allElements);
    } catch (error) {
      console.error('Error loading periodic table:', error);
      // Fallback data in case package fails to load
      setElements(getFallbackElements());
    }
  }, []);

  // Fallback data with common elements
  const getFallbackElements = () => {
    return [
      { name: "Hydrogen", symbol: "H", atomicNumber: 1, atomicMass: 1.008, group: 1, period: 1, category: "Nonmetal", summary: "Lightest and most abundant element in the universe." },
      { name: "Helium", symbol: "He", atomicNumber: 2, atomicMass: 4.0026, group: 18, period: 1, category: "Noble Gas", summary: "Second lightest element, used in cryogenics." },
      { name: "Lithium", symbol: "Li", atomicNumber: 3, atomicMass: 6.94, group: 1, period: 2, category: "Alkali Metal", summary: "Used in rechargeable batteries." },
      { name: "Beryllium", symbol: "Be", atomicNumber: 4, atomicMass: 9.012, group: 2, period: 2, category: "Alkaline Earth Metal", summary: "Used as alloying agent." },
      { name: "Boron", symbol: "B", atomicNumber: 5, atomicMass: 10.81, group: 13, period: 2, category: "Metalloid", summary: "Used in fiberglass and ceramics." },
      { name: "Carbon", symbol: "C", atomicNumber: 6, atomicMass: 12.011, group: 14, period: 2, category: "Nonmetal", summary: "Basis of organic chemistry." },
      { name: "Nitrogen", symbol: "N", atomicNumber: 7, atomicMass: 14.007, group: 15, period: 2, category: "Nonmetal", summary: "Major component of Earth's atmosphere." },
      { name: "Oxygen", symbol: "O", atomicNumber: 8, atomicMass: 15.999, group: 16, period: 2, category: "Nonmetal", summary: "Essential for respiration." },
      { name: "Fluorine", symbol: "F", atomicNumber: 9, atomicMass: 18.998, group: 17, period: 2, category: "Halogen", summary: "Most electronegative element." },
      { name: "Neon", symbol: "Ne", atomicNumber: 10, atomicMass: 20.18, group: 18, period: 2, category: "Noble Gas", summary: "Used in neon signs." },
      { name: "Sodium", symbol: "Na", atomicNumber: 11, atomicMass: 22.99, group: 1, period: 3, category: "Alkali Metal", summary: "Essential for nerve function." },
      { name: "Magnesium", symbol: "Mg", atomicNumber: 12, atomicMass: 24.305, group: 2, period: 3, category: "Alkaline Earth Metal", summary: "Used in lightweight alloys." },
      { name: "Aluminum", symbol: "Al", atomicNumber: 13, atomicMass: 26.982, group: 13, period: 3, category: "Post-Transition Metal", summary: "Most abundant metal in Earth's crust." },
      { name: "Silicon", symbol: "Si", atomicNumber: 14, atomicMass: 28.086, group: 14, period: 3, category: "Metalloid", summary: "Basis of semiconductors." },
      { name: "Phosphorus", symbol: "P", atomicNumber: 15, atomicMass: 30.974, group: 15, period: 3, category: "Nonmetal", summary: "Essential for DNA and ATP." },
      { name: "Sulfur", symbol: "S", atomicNumber: 16, atomicMass: 32.06, group: 16, period: 3, category: "Nonmetal", summary: "Used in fertilizers." },
      { name: "Chlorine", symbol: "Cl", atomicNumber: 17, atomicMass: 35.45, group: 17, period: 3, category: "Halogen", summary: "Used for water disinfection." },
      { name: "Argon", symbol: "Ar", atomicNumber: 18, atomicMass: 39.95, group: 18, period: 3, category: "Noble Gas", summary: "Used in welding and lighting." },
      { name: "Potassium", symbol: "K", atomicNumber: 19, atomicMass: 39.098, group: 1, period: 4, category: "Alkali Metal", summary: "Vital for cellular function." },
      { name: "Calcium", symbol: "Ca", atomicNumber: 20, atomicMass: 40.078, group: 2, period: 4, category: "Alkaline Earth Metal", summary: "Essential for bones and teeth." },
      { name: "Iron", symbol: "Fe", atomicNumber: 26, atomicMass: 55.845, group: 8, period: 4, category: "Transition Metal", summary: "Most common element on Earth by mass." },
      { name: "Copper", symbol: "Cu", atomicNumber: 29, atomicMass: 63.546, group: 11, period: 4, category: "Transition Metal", summary: "Excellent electrical conductor." },
      { name: "Silver", symbol: "Ag", atomicNumber: 47, atomicMass: 107.87, group: 11, period: 5, category: "Transition Metal", summary: "Best electrical conductor." },
      { name: "Gold", symbol: "Au", atomicNumber: 79, atomicMass: 196.97, group: 11, period: 6, category: "Transition Metal", summary: "Precious metal, corrosion resistant." },
    ];
  };

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(elements.map(el => el.category || 'Other'));
    return ['all', ...Array.from(cats).sort()];
  }, [elements]);

  // Filter elements based on search and category
  const filteredElements = useMemo(() => {
    let filtered = elements;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(el => 
        el.name?.toLowerCase().includes(query) ||
        el.symbol?.toLowerCase().includes(query) ||
        el.atomicNumber?.toString().includes(query) ||
        (el.category && el.category.toLowerCase().includes(query))
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(el => el.category === filterCategory);
    }
    
    return filtered;
  }, [elements, searchQuery, filterCategory]);

  // Group elements by period for grid view
  const elementsByPeriod = useMemo(() => {
    const groups = {};
    filteredElements.forEach(el => {
      const period = el.period || Math.floor(el.atomicNumber / 10) + 1;
      if (!groups[period]) groups[period] = [];
      groups[period].push(el);
    });
    return groups;
  }, [filteredElements]);

  // Color schemes for different element categories
  const getCategoryColor = (category) => {
    const colors = {
      'Nonmetal': 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700',
      'Noble Gas': 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700',
      'Alkali Metal': 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700',
      'Alkaline Earth Metal': 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700',
      'Transition Metal': 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700',
      'Post-Transition Metal': 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-700',
      'Metalloid': 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700',
      'Halogen': 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700',
      'Lanthanide': 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700',
      'Actinide': 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700',
      'Other': 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
    };
    return colors[category] || colors['Other'];
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      'Nonmetal': 'text-emerald-700 dark:text-emerald-300',
      'Noble Gas': 'text-purple-700 dark:text-purple-300',
      'Alkali Metal': 'text-red-700 dark:text-red-300',
      'Alkaline Earth Metal': 'text-orange-700 dark:text-orange-300',
      'Transition Metal': 'text-blue-700 dark:text-blue-300',
      'Post-Transition Metal': 'text-teal-700 dark:text-teal-300',
      'Metalloid': 'text-yellow-700 dark:text-yellow-300',
      'Halogen': 'text-pink-700 dark:text-pink-300',
      'Lanthanide': 'text-indigo-700 dark:text-indigo-300',
      'Actinide': 'text-violet-700 dark:text-violet-300',
      'Other': 'text-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors['Other'];
  };

  // Open element details modal
  const openElementDetails = (element) => {
    setSelectedElement(element);
    setShowModal(true);
  };

  // Format electron configuration
  const formatElectronConfig = (element) => {
    if (element.electronConfiguration) return element.electronConfiguration;
    if (element.electron_configuration) return element.electron_configuration;
    return "Not available";
  };

  // Get element summary
  const getElementSummary = (element) => {
    if (element.summary) return element.summary;
    if (element.description) return element.description;
    return `${element.name} is a ${element.category?.toLowerCase() || 'chemical element'} with atomic number ${element.atomicNumber}.`;
  };

  // Render grid view
  const renderGridView = () => (
    <div className="space-y-6">
      {Object.entries(elementsByPeriod).sort((a,b) => Number(a[0]) - Number(b[0])).map(([period, periodElements]) => (
        <div key={period}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Period {period}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {periodElements.sort((a,b) => a.atomicNumber - b.atomicNumber).map(element => (
              <motion.div
                key={element.atomicNumber}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredElement(element)}
                onHoverEnd={() => setHoveredElement(null)}
                onClick={() => openElementDetails(element)}
                className={`cursor-pointer rounded-xl p-3 text-center transition-all shadow-sm ${getCategoryColor(element.category)} border-2 hover:shadow-md`}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">{element.atomicNumber}</div>
                <div className="text-xl font-bold font-mono">{element.symbol}</div>
                <div className="text-xs truncate">{element.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {element.atomicMass?.toFixed(2) || '?'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Z</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Atomic Mass</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {filteredElements.map(element => (
            <motion.tr
              key={element.atomicNumber}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              onClick={() => openElementDetails(element)}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{element.atomicNumber}</td>
              <td className="px-4 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white">{element.symbol}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{element.name}</td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{element.atomicMass?.toFixed(4) || 'N/A'}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(element.category)}`}>
                  {element.category || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{element.period || 'N/A'}</td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{element.group || 'N/A'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render detailed grid view (compact cards)
  const renderDetailedView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredElements.map(element => (
        <motion.div
          key={element.atomicNumber}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openElementDetails(element)}
          className={`cursor-pointer rounded-xl p-4 transition-all shadow-sm ${getCategoryColor(element.category)} border-2 hover:shadow-lg`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold font-mono">{element.symbol}</div>
              <div className="text-sm font-medium">{element.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Atomic #{element.atomicNumber}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{element.atomicMass?.toFixed(2)} u</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className={getCategoryTextColor(element.category)}>{element.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-600 dark:text-gray-400">Period/Group:</span>
              <span>{element.period || '?'}/{element.group || '?'}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {getElementSummary(element)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Periodic Table of Elements
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Interactive periodic table with detailed element information
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {elements.length} elements loaded | Click any element for details
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center items-center">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, symbol, atomic number, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Grid View"
            >
              📐 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="List View"
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 transition-colors ${
                viewMode === 'detailed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Detailed Cards"
            >
              🃏 Cards
            </button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredElements.length} of {elements.length} elements
          </div>
        </div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 overflow-hidden"
        >
          {filteredElements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔬</div>
              <p className="text-gray-500 dark:text-gray-400">No elements found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'detailed' && renderDetailedView()}
            </>
          )}
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Categories:</div>
          {['Nonmetal', 'Noble Gas', 'Alkali Metal', 'Alkaline Earth Metal', 'Transition Metal', 'Metalloid', 'Halogen'].map(cat => (
            <div key={cat} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${getCategoryColor(cat)} border`}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{cat}</span>
            </div>
          ))}
        </div>

        {/* Element Details Modal */}
        <AnimatePresence>
          {showModal && selectedElement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto ${getCategoryColor(selectedElement.category)}`}
                onClick={e => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedElement.name} ({selectedElement.symbol})
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Atomic Number:</span>
                        <span className="text-gray-900 dark:text-white font-mono">{selectedElement.atomicNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Symbol:</span>
                        <span className="text-gray-900 dark:text-white font-mono font-bold text-xl">{selectedElement.symbol}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Atomic Mass:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.atomicMass?.toFixed(6) || 'N/A'} u</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Category:</span>
                        <span className={getCategoryTextColor(selectedElement.category)}>{selectedElement.category || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Period:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.period || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Group:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.group || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Advanced Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Electronegativity:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.electronegativity || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Melting Point:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.meltingPoint ? `${selectedElement.meltingPoint} K` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Boiling Point:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.boilingPoint ? `${selectedElement.boilingPoint} K` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Density:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.density ? `${selectedElement.density} g/cm³` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Year Discovered:</span>
                        <span className="text-gray-900 dark:text-white">{selectedElement.yearDiscovered || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Electron Configuration */}
                  {(selectedElement.electronConfiguration || selectedElement.electron_configuration) && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="font-semibold text-gray-600 dark:text-gray-400 mb-1">Electron Configuration:</div>
                      <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {formatElectronConfig(selectedElement)}
                      </div>
                    </div>
                  )}

                  {/* Description / Summary */}
                  <div className="mt-4">
                    <div className="font-semibold text-gray-600 dark:text-gray-400 mb-1">About:</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {getElementSummary(selectedElement)}
                    </p>
                  </div>

                  {/* Oxidation States */}
                  {selectedElement.oxidationStates && (
                    <div className="mt-4">
                      <div className="font-semibold text-gray-600 dark:text-gray-400 mb-1">Oxidation States:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedElement.oxidationStates.split(',').map(state => (
                          <span key={state} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>📊 Data from periodic-table npm package</span>
            <span>🔍 Click any element for detailed information</span>
            <span>🎨 Color-coded by element category</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PeriodicTable;