// components/Tools/PeriodicTableAnimations.jsx
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useEffect } from 'react';

export const AnimatedElementCard = ({ 
  element, 
  onClick, 
  getCategoryColor, 
  isFocused,
  onKeyDown 
}) => (
  <motion.div
    whileHover={{ scale: 1.05, zIndex: 10 }}
    whileFocus={{ scale: 1.05, zIndex: 10 }}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role="button"
    tabIndex={0}
    aria-label={`${element.name}, element ${element.atomicNumber}, symbol ${element.symbol}`}
    style={{ 
      gridColumn: element.group, 
      gridRow: element.period 
    }}
    className={`cursor-pointer rounded-md p-1 sm:p-2 text-center transition-all shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getCategoryColor(element.category)} ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
  >
    <div className="text-[10px] opacity-60 leading-none">{element.atomicNumber}</div>
    <div className="text-lg font-bold font-mono">{element.symbol}</div>
    <div className="text-[8px] truncate hidden sm:block">{element.name}</div>
  </motion.div>
);

export const AnimatedTableRow = ({ element, onClick, getCategoryColor, index }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2, delay: index * 0.01 }}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    role="button"
    tabIndex={0}
    aria-label={`${element.name}, element ${element.atomicNumber}`}
    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800"
  >
    <td className="px-4 py-2 text-sm">{element.atomicNumber}</td>
    <td className="px-4 py-2 text-sm font-bold font-mono">{element.symbol}</td>
    <td className="px-4 py-2 text-sm">{element.name}</td>
    <td className="px-4 py-2 text-sm">
      <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(element.category)}`}>
        {element.category}
      </span>
    </td>
  </motion.tr>
);

export const ElementModal = ({ isOpen, element, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !element) return null;

  const formatTemperature = (temp) => {
    if (!temp || temp === "N/A") return "N/A";
    return `${temp}°C`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div 
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 id="modal-title" className="text-5xl font-bold font-mono text-blue-600 dark:text-blue-400">
                  {element.symbol}
                </h2>
                <p className="text-xl mt-1 text-gray-700 dark:text-gray-300">{element.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Atomic Number</p>
                <p className="text-3xl font-bold">{element.atomicNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Atomic Mass:</span>
                  <span className="font-medium">{element.atomicMass} u</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Electron Config:</span>
                  <span className="font-mono text-xs">{element.electronConfig || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium capitalize">{element.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phase (STP):</span>
                  <span className="font-medium capitalize">{element.phase || "N/A"}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Melting Point:</span>
                  <span className="font-medium">{formatTemperature(element.meltingPoint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Boiling Point:</span>
                  <span className="font-medium">{formatTemperature(element.boilingPoint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Density:</span>
                  <span className="font-medium">{element.density ? `${element.density} g/cm³` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Electronegativity:</span>
                  <span className="font-medium">{element.electronegativity || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Isotopes Section */}
            {element.isotopes && element.isotopes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Common Isotopes</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {element.isotopes.map((isotope, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Mass {isotope.mass}</span>
                      <span className="font-mono">{isotope.abundance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {element.summary && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {element.summary}
                </p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 flex items-center justify-center"
    role="status"
    aria-label="Loading periodic table data"
  >
    <div className="text-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
      />
      <p className="mt-4 text-gray-500">Loading periodic table...</p>
    </div>
  </motion.div>
);

export const ErrorDisplay = ({ error, onRetry }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 flex items-center justify-center"
    role="alert"
    aria-live="polite"
  >
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Network Error</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Failed to load periodic table data. Showing fallback data instead.
      </p>
      <p className="text-sm text-gray-500 mb-6">Error: {error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Retry loading data"
      >
        Retry
      </button>
    </div>
  </motion.div>
);