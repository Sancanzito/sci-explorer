// components/Tools/PeriodicTableData.jsx
import { useState, useEffect, useMemo } from 'react';

// Comprehensive element data with physical properties
const FALLBACK_ELEMENTS = [
  { 
    atomicNumber: 1, symbol: "H", name: "Hydrogen", category: "nonmetal", 
    period: 1, group: 1, atomicMass: "1.008", 
    electronConfig: "1s¹", meltingPoint: "-259.14", boilingPoint: "-252.87", 
    density: "0.0000899", electronegativity: "2.20", phase: "gas",
    isotopes: [{ mass: 1, abundance: "99.98%" }, { mass: 2, abundance: "0.02%" }]
  },
  { 
    atomicNumber: 2, symbol: "He", name: "Helium", category: "noble gas", 
    period: 1, group: 18, atomicMass: "4.0026", 
    electronConfig: "1s²", meltingPoint: "-272.20", boilingPoint: "-268.93", 
    density: "0.0001785", electronegativity: "N/A", phase: "gas",
    isotopes: [{ mass: 3, abundance: "0.0002%" }, { mass: 4, abundance: "99.9998%" }]
  },
  { 
    atomicNumber: 3, symbol: "Li", name: "Lithium", category: "alkali metal", 
    period: 2, group: 1, atomicMass: "6.94", 
    electronConfig: "1s² 2s¹", meltingPoint: "180.50", boilingPoint: "1342.00", 
    density: "0.534", electronegativity: "0.98", phase: "solid",
    isotopes: [{ mass: 6, abundance: "7.5%" }, { mass: 7, abundance: "92.5%" }]
  },
  // ... Additional elements would be in full dataset
];

// Color schemes for different element categories
export const getCategoryColor = (category) => {
  const colors = {
    'nonmetal': 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700',
    'noble gas': 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700',
    'alkali metal': 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700',
    'alkaline earth metal': 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700',
    'transition metal': 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700',
    'post-transition metal': 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-700',
    'metalloid': 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700',
    'halogen': 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700',
    'lanthanide': 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700',
    'actinide': 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700',
  };
  return colors[category?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
};

export const getPhaseColor = (phase) => {
  const colors = {
    solid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    liquid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    gas: 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300',
  };
  return colors[phase?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700';
};

export const usePeriodicTableData = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setElements(data.elements);
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

// Advanced search parser for range queries
export const parseSearchQuery = (query) => {
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
    if (match) {
      parsed[key] = {
        operator: match[1],
        value: parseFloat(match[2])
      };
    }
  }
  
  return parsed;
};

export const evaluateCondition = (value, operator, target) => {
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

export const useFilteredElements = (elements, searchQuery, filterCategory) => {
  return useMemo(() => {
    let filtered = elements;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const parsedQuery = parseSearchQuery(query);
      const hasRangeQuery = Object.keys(parsedQuery).length > 0;
      
      if (hasRangeQuery) {
        filtered = filtered.filter(el => {
          let matches = true;
          
          if (parsedQuery.mass) {
            matches = matches && evaluateCondition(el.atomicMass, parsedQuery.mass.operator, parsedQuery.mass.value);
          }
          if (parsedQuery.atomicNumber) {
            matches = matches && evaluateCondition(el.atomicNumber, parsedQuery.atomicNumber.operator, parsedQuery.atomicNumber.value);
          }
          if (parsedQuery.density) {
            matches = matches && evaluateCondition(el.density, parsedQuery.density.operator, parsedQuery.density.value);
          }
          if (parsedQuery.electronegativity) {
            matches = matches && evaluateCondition(el.electronegativity, parsedQuery.electronegativity.operator, parsedQuery.electronegativity.value);
          }
          if (parsedQuery.meltingPoint) {
            matches = matches && evaluateCondition(el.meltingPoint, parsedQuery.meltingPoint.operator, parsedQuery.meltingPoint.value);
          }
          if (parsedQuery.boilingPoint) {
            matches = matches && evaluateCondition(el.boilingPoint, parsedQuery.boilingPoint.operator, parsedQuery.boilingPoint.value);
          }
          
          return matches;
        });
      } else {
        // Basic text search
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

export const useCategories = (elements) => {
  return useMemo(() => {
    const cats = new Set(elements.map(el => el.category || 'Other'));
    return ['all', ...Array.from(cats).sort()];
  }, [elements]);
};