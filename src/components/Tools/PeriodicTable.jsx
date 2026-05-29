import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, X, Grid, List } from 'lucide-react';

// ==========================================
// 1. DATA & LOGIC HOOKS
// ==========================================

const FALLBACK_ELEMENTS = [
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", category: "diatomic nonmetal", period: 1, group: 1, atomicMass: "1.008", electronConfig: "1s¹", meltingPoint: "-259.14", boilingPoint: "-252.87", density: "0.0000899", electronegativity: "2.20", phase: "Gas", summary: "Hydrogen is the lightest element and the most abundant chemical substance in the universe.", shells: [1], source: "https://en.wikipedia.org/wiki/Hydrogen", isotopes: [] },
  { atomicNumber: 2, symbol: "He", name: "Helium", category: "noble gas", period: 1, group: 18, atomicMass: "4.0026", electronConfig: "1s²", meltingPoint: "-272.20", boilingPoint: "-268.93", density: "0.0001785", electronegativity: "N/A", phase: "Gas", summary: "Helium is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.", shells: [2], source: "https://en.wikipedia.org/wiki/Helium", isotopes: [] },
  { atomicNumber: 6, symbol: "C", name: "Carbon", category: "polyatomic nonmetal", period: 2, group: 14, atomicMass: "12.011", electronConfig: "[He] 2s² 2p²", meltingPoint: "3500", boilingPoint: "4827", density: "2.267", electronegativity: "2.55", phase: "Solid", summary: "Carbon is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds.", shells: [2, 4], source: "https://en.wikipedia.org/wiki/Carbon", isotopes: [] },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", category: "diatomic nonmetal", period: 2, group: 16, atomicMass: "15.999", electronConfig: "[He] 2s² 2p⁴", meltingPoint: "-218.79", boilingPoint: "-182.95", density: "0.00143", electronegativity: "3.44", phase: "Gas", summary: "Oxygen is a highly reactive nonmetal, and an oxidizing agent that readily forms oxides.", shells: [2, 6], source: "https://en.wikipedia.org/wiki/Oxygen", isotopes: [] },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", category: "transition metal", period: 4, group: 8, atomicMass: "55.845", electronConfig: "[Ar] 3d⁶ 4s²", meltingPoint: "1538", boilingPoint: "2862", density: "7.874", electronegativity: "1.83", phase: "Solid", summary: "Iron is a metal that belongs to the first transition series and group 8 of the periodic table.", shells: [2, 8, 14, 2], source: "https://en.wikipedia.org/wiki/Iron", isotopes: [] },
  { atomicNumber: 79, symbol: "Au", name: "Gold", category: "transition metal", period: 6, group: 11, atomicMass: "196.97", electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", meltingPoint: "1064.18", boilingPoint: "2970", density: "19.3", electronegativity: "2.54", phase: "Solid", summary: "Gold is a bright, slightly reddish yellow, dense, soft, malleable, and ductile metal.", shells: [2, 8, 18, 32, 18, 1], source: "https://en.wikipedia.org/wiki/Gold", isotopes: [] }
];

const getCategoryColor = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('nonmetal') && !cat.includes('halogen') && !cat.includes('noble')) return 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100';
  if (cat.includes('noble gas')) return 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100';
  if (cat.includes('alkali metal')) return 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100';
  if (cat.includes('alkaline earth metal')) return 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-100';
  if (cat.includes('transition metal') && !cat.includes('post')) return 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100';
  if (cat.includes('post-transition metal')) return 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-100';
  if (cat.includes('metalloid')) return 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100';
  if (cat.includes('halogen')) return 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700 text-pink-900 dark:text-pink-100';
  if (cat.includes('lanthanide')) return 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100';
  if (cat.includes('actinide')) return 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-900 dark:text-violet-100';
  
  return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100';
};

const usePeriodicTableData = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Map API data fields to our expected schema to fix 'undefined' bugs
        const mappedElements = data.elements.map(el => ({
          atomicNumber: el.number,
          symbol: el.symbol,
          name: el.name,
          category: el.category,
          period: el.ypos,
          group: el.xpos,
          atomicMass: el.atomic_mass,
          electronConfig: el.electron_configuration,
          // Convert temperatures from Kelvin to Celsius
          meltingPoint: el.melt ? (el.melt - 273.15).toFixed(2) : null,
          boilingPoint: el.boil ? (el.boil - 273.15).toFixed(2) : null,
          density: el.density,
          electronegativity: el.electronegativity_pauling,
          phase: el.phase,
          summary: el.summary,
          shells: el.shells || [],
          source: el.source,
          isotopes: [] 
        }));
        
        setElements(mappedElements);
      } catch (error) {
        console.error('Error loading periodic table:', error);
        setError(error.message);
        setElements(FALLBACK_ELEMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchElements();
  }, []);

  return { elements, loading, error };
};

const parseSearchQuery = (query) => {
  const patterns = {
    mass: /mass\s*([<>]=?|==?)\s*(\d+(?:\.\d+)?)/i,
    atomicNumber: /atomic\s*number\s*([<>]=?|==?)\s*(\d+)/i,
    density: /density\s*([<>]=?|==?)\s*(\d+(?:\.\d+)?)/i,
    electronegativity: /electronegativity\s*([<>]=?|==?)\s*(\d+(?:\.\d+)?)/i,
    meltingPoint: /melting\s*point\s*([<>]=?|==?)\s*(-?\d+(?:\.\d+)?)/i,
    boilingPoint: /boiling\s*point\s*([<>]=?|==?)\s*(-?\d+(?:\.\d+)?)/i,
  };
  const parsed = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = query.match(pattern);
    if (match) parsed[key] = { operator: match[1], value: parseFloat(match[2]) };
  }
  return parsed;
};

const evaluateCondition = (value, operator, target) => {
  if (value === undefined || value === null || value === "N/A") return false;
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return false;
  switch (operator) {
    case '<': return numValue < target;
    case '<=': return numValue <= target;
    case '>': return numValue > target;
    case '>=': return numValue >= target;
    case '=': 
    case '==': return Math.abs(numValue - target) < 0.001;
    default: return false;
  }
};

const useFilteredElements = (elements, searchQuery, filterCategory) => {
  return useMemo(() => {
    let filtered = elements;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const parsedQuery = parseSearchQuery(query);
      if (Object.keys(parsedQuery).length > 0) {
        filtered = filtered.filter(el => {
          let matches = true;
          if (parsedQuery.mass) matches = matches && evaluateCondition(el.atomicMass, parsedQuery.mass.operator, parsedQuery.mass.value);
          if (parsedQuery.atomicNumber) matches = matches && evaluateCondition(el.atomicNumber, parsedQuery.atomicNumber.operator, parsedQuery.atomicNumber.value);
          if (parsedQuery.density) matches = matches && evaluateCondition(el.density, parsedQuery.density.operator, parsedQuery.density.value);
          if (parsedQuery.electronegativity) matches = matches && evaluateCondition(el.electronegativity, parsedQuery.electronegativity.operator, parsedQuery.electronegativity.value);
          if (parsedQuery.meltingPoint) matches = matches && evaluateCondition(el.meltingPoint, parsedQuery.meltingPoint.operator, parsedQuery.meltingPoint.value);
          if (parsedQuery.boilingPoint) matches = matches && evaluateCondition(el.boilingPoint, parsedQuery.boilingPoint.operator, parsedQuery.boilingPoint.value);
          return matches;
        });
      } else {
        filtered = filtered.filter(el => 
          el.name?.toLowerCase().includes(query) ||
          el.symbol?.toLowerCase().includes(query) ||
          el.atomicNumber?.toString().includes(query) ||
          (el.category && el.category.toLowerCase().includes(query))
        );
      }
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(el => el.category === filterCategory);
    }
    return filtered;
  }, [elements, searchQuery, filterCategory]);
};

const useCategories = (elements) => {
  return useMemo(() => {
    const cats = new Set(elements.map(el => el.category || 'Other'));
    return ['all', ...Array.from(cats).sort()];
  }, [elements]);
};

// ==========================================
// 2. UI COMPONENTS & ANIMATIONS
// ==========================================

const BohrModel = ({ shells, symbol }) => {
  if (!shells || shells.length === 0) return null;
  
  const maxRadius = 100;
  const center = maxRadius;
  const shellSpacing = 14;
  const baseRadius = 24;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-2xl w-full max-w-[200px] aspect-square shadow-inner">
      <svg viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`} className="w-full h-full drop-shadow-md">
        {/* Nucleus */}
        <circle cx={center} cy={center} r={14} className="fill-blue-500" />
        <text x={center} y={center + 4} textAnchor="middle" className="fill-white text-[12px] font-bold font-mono">
          {symbol}
        </text>
        
        {/* Shells and Electrons */}
        {shells.map((electronCount, shellIndex) => {
          const radius = baseRadius + (shellIndex * shellSpacing);
          const electrons = [];
          
          for (let i = 0; i < electronCount; i++) {
            const angle = (i * (Math.PI * 2)) / electronCount - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            electrons.push(
              <circle key={`e-${shellIndex}-${i}`} cx={x} cy={y} r={2.5} className="fill-blue-200" />
            );
          }
          
          return (
            <g key={`shell-${shellIndex}`}>
              <circle cx={center} cy={center} r={radius} className="stroke-gray-600 fill-none" strokeWidth="1" strokeDasharray="2 4" />
              {electrons}
            </g>
          );
        })}
      </svg>
      <div className="mt-3 text-[10px] text-blue-200 font-mono tracking-widest text-center opacity-80">
        {shells.join(' · ')}
      </div>
    </div>
  );
};

const AnimatedElementCard = React.memo(({ element, onClick, isFocused, onKeyDown }) => (
  <motion.div
    whileHover={{ scale: 1.05, zIndex: 10 }}
    whileFocus={{ scale: 1.05, zIndex: 10 }}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role="button"
    tabIndex={0}
    aria-label={`${element.name}, element ${element.atomicNumber}, symbol ${element.symbol}`}
    style={{ gridColumn: element.group, gridRow: element.period }}
    className={`cursor-pointer rounded-md p-1 sm:p-2 text-center transition-all shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getCategoryColor(element.category)} ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10' : ''}`}
  >
    <div className="text-[10px] opacity-70 leading-none font-semibold">{element.atomicNumber}</div>
    <div className="text-lg font-bold font-mono my-0.5">{element.symbol}</div>
    <div className="text-[9px] truncate hidden sm:block opacity-90">{element.name}</div>
  </motion.div>
));
AnimatedElementCard.displayName = 'AnimatedElementCard';

const AnimatedTableRow = React.memo(({ element, onClick, index }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2, delay: index * 0.01 }}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    role="button"
    tabIndex={0}
    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
  >
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{element.atomicNumber}</td>
    <td className="px-4 py-3 text-sm font-bold font-mono text-gray-900 dark:text-gray-100">{element.symbol}</td>
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{element.name}</td>
    <td className="px-4 py-3 text-sm">
      <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(element.category)}`}>
        {element.category}
      </span>
    </td>
  </motion.tr>
));
AnimatedTableRow.displayName = 'AnimatedTableRow';

const ElementModal = ({ isOpen, element, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) modalRef.current.focus();
    
    // Accessibility: Trap escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && element && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Left: Element Header & Stats */}
                <div className="flex-1">
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`w-24 h-24 shrink-0 rounded-2xl border-4 flex items-center justify-center flex-col ${getCategoryColor(element.category)}`}>
                      <span className="text-sm font-semibold opacity-70">{element.atomicNumber}</span>
                      <span className="text-4xl font-bold font-mono">{element.symbol}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{element.name}</h2>
                      <p className="text-lg capitalize text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {element.category}
                      </p>
                      {element.source && (
                        <a 
                          href={element.source} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
                        >
                          Read more on Wikipedia →
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Atomic Mass</span>
                      <span className="font-medium text-gray-900 dark:text-white">{element.atomicMass} u</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Melting Point</span>
                      <span className="font-medium text-gray-900 dark:text-white">{element.meltingPoint ? `${element.meltingPoint}°C` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Electron Config</span>
                      <span className="font-mono text-xs text-gray-900 dark:text-white">{element.electronConfig || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Boiling Point</span>
                      <span className="font-medium text-gray-900 dark:text-white">{element.boilingPoint ? `${element.boilingPoint}°C` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Phase (STP)</span>
                      <span className="font-medium capitalize text-gray-900 dark:text-white">{element.phase || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <span className="text-gray-500 dark:text-gray-400">Density</span>
                      <span className="font-medium text-gray-900 dark:text-white">{element.density ? `${element.density} g/cm³` : "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Bohr Model Visualizer */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Atomic Structure</h3>
                  <BohrModel shells={element.shells} symbol={element.symbol} />
                </div>
              </div>

              {element.summary && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {element.summary}
                  </p>
                </div>
              )}

              {element.isotopes && element.isotopes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Common Isotopes</h3>
                  <div className="flex flex-wrap gap-2">
                    {element.isotopes.map((isotope, idx) => (
                      <div key={idx} className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800">
                        Mass {isotope.mass}: <span className="font-mono">{isotope.abundance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CreatorModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 z-10">
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative h-64 md:h-auto bg-gray-100 dark:bg-gray-800">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Dmitri_Mendeleev_1890s.jpg" 
                  alt="Dmitri Mendeleev"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-500 p-6 text-center">
                  <BookOpen size={48} className="mb-4 opacity-50" />
                  <p>Image of Dmitri Mendeleev unavailable.</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 md:w-3/5">
                <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-1">The Creator</h2>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dmitri Mendeleev</h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Dmitri Ivanovich Mendeleev (1834–1907) was a Russian chemist and inventor. He is best known for formulating the <strong>Periodic Law</strong> and creating a farsighted version of the periodic table of elements in 1869.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    "I saw in a dream a table where all the elements fell into place as required. Awakening, I immediately wrote it down on a piece of paper."
                  </p>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Why was his table special?</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>He left gaps:</strong> Instead of forcing known elements into a grid, he left blank spaces for elements he predicted must exist (like Gallium and Germanium).</li>
                  <li><strong>He predicted properties:</strong> He accurately predicted the physical and chemical properties of these undiscovered elements.</li>
                  <li><strong>Organized by mass & property:</strong> He organized the elements by atomic mass but was willing to break his own rules and swap elements to group them by their chemical properties.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center">
    <div className="text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p className="mt-4 text-gray-500 font-medium">Loading periodic table data...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-2xl mx-auto my-6">
    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Notice: Limited Data Mode</h2>
    <p className="text-red-800 dark:text-red-200 mb-4 text-sm">
      We couldn't connect to the live periodic table database. Showing a limited fallback dataset instead.
    </p>
    <button onClick={onRetry} className="px-6 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-100 rounded-lg transition font-medium text-sm">
      Retry Connection
    </button>
  </div>
);


// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showElementModal, setShowElementModal] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const { elements, loading, error } = usePeriodicTableData();
  const filteredElements = useFilteredElements(elements, searchQuery, filterCategory);
  const categories = useCategories(elements);

  const openElementDetails = (element) => {
    setSelectedElement(element);
    setShowElementModal(true);
  };

  const handleKeyNavigation = useCallback((e) => {
    if (viewMode !== 'grid' || showElementModal || showCreatorModal) return;
    
    // ACCESSIBILITY FIX: Don't hijack keystrokes if typing in input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    const columns = 18;
    let newIndex = focusedIndex;
    
    switch (e.key) {
      case 'ArrowRight': newIndex = Math.min(focusedIndex + 1, filteredElements.length - 1); break;
      case 'ArrowLeft': newIndex = Math.max(focusedIndex - 1, 0); break;
      case 'ArrowDown': newIndex = Math.min(focusedIndex + columns, filteredElements.length - 1); break;
      case 'ArrowUp': newIndex = Math.max(focusedIndex - columns, 0); break;
      case 'Home': newIndex = 0; break;
      case 'End': newIndex = filteredElements.length - 1; break;
      case 'Enter':
      case ' ':
        if (filteredElements[focusedIndex]) openElementDetails(filteredElements[focusedIndex]);
        e.preventDefault();
        break;
      default: return;
    }
    
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      e.preventDefault();
    }
  }, [focusedIndex, filteredElements, viewMode, showElementModal, showCreatorModal]);

  useEffect(() => {
    if (viewMode === 'grid') {
      window.addEventListener('keydown', handleKeyNavigation);
      return () => window.removeEventListener('keydown', handleKeyNavigation);
    }
  }, [handleKeyNavigation, viewMode]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [filteredElements]);

  const renderGridView = () => (
    <div className="overflow-x-auto pb-6">
      <div 
        className="grid gap-1.5 p-4 min-w-[1000px] xl:min-w-0" 
        style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
      >
        {filteredElements.map((element, idx) => (
          <AnimatedElementCard
            key={element.atomicNumber}
            element={element}
            onClick={() => openElementDetails(element)}
            isFocused={idx === focusedIndex}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openElementDetails(element);
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Z</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          <AnimatePresence>
            {filteredElements.map((element, idx) => (
              <AnimatedTableRow
                key={element.atomicNumber}
                element={element}
                index={idx}
                onClick={() => openElementDetails(element)}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <header className="mb-10 text-center relative">
          <div className="absolute top-0 right-0 hidden md:block">
            <button 
              onClick={() => setShowCreatorModal(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <BookOpen size={16} className="text-blue-500" />
              About the Creator
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Periodic Table</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Interactive explorer of the chemical elements. Click on any element to reveal its properties.
          </p>
          
          <div className="md:hidden mt-4 flex justify-center">
            <button 
              onClick={() => setShowCreatorModal(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <BookOpen size={16} className="text-blue-500" />
              History & Creator
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder='Try "gold", "mass < 50", or "melting point > 1000"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm capitalize appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shrink-0 border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorDisplay error={error} onRetry={() => window.location.reload()} />}

        <div className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400 px-2">
          Showing <span className="text-gray-900 dark:text-gray-200">{filteredElements.length}</span> of {elements.length} elements
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {filteredElements.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>No elements match your search criteria.</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </div>

        <ElementModal 
          isOpen={showElementModal} 
          element={selectedElement} 
          onClose={() => setShowElementModal(false)} 
        />
        <CreatorModal 
          isOpen={showCreatorModal} 
          onClose={() => setShowCreatorModal(false)} 
        />
      </div>
    </div>
  );
}