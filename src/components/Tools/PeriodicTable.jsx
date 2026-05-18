// components/Tools/PeriodicTable.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  getCategoryColor, 
  getPhaseColor,
  usePeriodicTableData, 
  useFilteredElements, 
  useCategories 
} from './PeriodicTableData';
import { 
  AnimatedElementCard, 
  AnimatedTableRow, 
  ElementModal, 
  LoadingSpinner,
  ErrorDisplay 
} from './PeriodicTableAnimations';

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  
  const gridRef = useRef(null);
  const searchInputRef = useRef(null);

  const { elements, loading, error } = usePeriodicTableData();
  const filteredElements = useFilteredElements(elements, searchQuery, filterCategory);
  const categories = useCategories(elements);

  const openElementDetails = (element) => {
    setSelectedElement(element);
    setShowModal(true);
  };

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    window.location.reload(); // Simple retry mechanism
  }, []);

  // Keyboard navigation for grid view
  const handleKeyNavigation = useCallback((e) => {
    if (viewMode !== 'grid' || showModal) return;
    
    const columns = 18;
    const rows = Math.ceil(filteredElements.length / columns);
    const currentRow = Math.floor(focusedIndex / columns);
    const currentCol = focusedIndex % columns;
    
    let newIndex = focusedIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(focusedIndex + 1, filteredElements.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(focusedIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(focusedIndex + columns, filteredElements.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(focusedIndex - columns, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = filteredElements.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (filteredElements[focusedIndex]) {
          openElementDetails(filteredElements[focusedIndex]);
        }
        e.preventDefault();
        break;
      default:
        return;
    }
    
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      e.preventDefault();
    }
  }, [focusedIndex, filteredElements, viewMode, showModal]);

  useEffect(() => {
    if (viewMode === 'grid') {
      window.addEventListener('keydown', handleKeyNavigation);
      return () => window.removeEventListener('keydown', handleKeyNavigation);
    }
  }, [handleKeyNavigation, viewMode]);

  // Reset focus when filtered elements change
  useEffect(() => {
    setFocusedIndex(0);
  }, [filteredElements]);

  const renderGridView = () => (
    <div 
      ref={gridRef}
      className="grid gap-1 min-w-[1000px] p-4 overflow-x-auto" 
      style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
      role="grid"
      aria-label="Periodic table grid view"
    >
      {filteredElements.map((element, idx) => (
        <AnimatedElementCard
          key={element.atomicNumber}
          element={element}
          onClick={() => openElementDetails(element)}
          getCategoryColor={getCategoryColor}
          isFocused={idx === focusedIndex}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openElementDetails(element);
            }
          }}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-x-auto" role="table" aria-label="Periodic table list view">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          <AnimatePresence>
            {filteredElements.map((element, idx) => (
              <AnimatedTableRow
                key={element.atomicNumber}
                element={element}
                index={idx}
                onClick={() => openElementDetails(element)}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  // Search tips component
  const SearchTips = () => (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      💡 Search tips: "mass {'<'} 50", "electronegativity {'>'} 2.0", "melting point {'<'} 0"
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Periodic Table of Elements</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Interactive periodic table with element details</p>
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, symbol, atomic number, or use ranges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search elements"
                aria-describedby="search-tips"
              />
              <SearchTips />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            
            <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1" role="group" aria-label="View mode toggle">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-4 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                aria-pressed={viewMode === 'grid'}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-4 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                aria-pressed={viewMode === 'list'}
                aria-label="List view"
              >
                List
              </button>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredElements.length} of {elements.length} elements
          </div>
        </header>

        {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 overflow-hidden">
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>

        <ElementModal 
          isOpen={showModal} 
          element={selectedElement} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
};

export default PeriodicTable;