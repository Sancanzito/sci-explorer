// components/Calculator/ScientificCalculator.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';
import convert from 'convert-units';
import { 
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemText
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import StraightenIcon from '@mui/icons-material/Straighten';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScientificCalculator = () => {
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [isDegree, setIsDegree] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [ansValue, setAnsValue] = useState(0);
  const [isScientificNotation, setIsScientificNotation] = useState(false);
  const [activeTab, setActiveTab] = useState('calc');
  
  // Command palette state
  const [showCommands, setShowCommands] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const commandInputRef = useRef(null);
  const expressionInputRef = useRef(null);
  
  // Unit Converter State
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [availableUnits, setAvailableUnits] = useState([]);
  const [converterHistory, setConverterHistory] = useState([]);
  const [showConverterHistory, setShowConverterHistory] = useState(false);
  const [converterValues, setConverterValues] = useState({
    fromUnit: '',
    toUnit: '',
    fromValue: 1,
    toValue: 0
  });
  const [categories, setCategories] = useState([]);
  const [fromUnitAnchorEl, setFromUnitAnchorEl] = useState(null);
  const [toUnitAnchorEl, setToUnitAnchorEl] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteUnits');
    return saved ? JSON.parse(saved) : [];
  });

  // Category display config
  const categoryConfig = {
    length: { name: 'Length', icon: '📏', color: 'from-blue-500 to-cyan-500' },
    mass: { name: 'Mass', icon: '⚖️', color: 'from-gray-500 to-slate-500' },
    volume: { name: 'Volume', icon: '🧪', color: 'from-green-500 to-teal-500' },
    area: { name: 'Area', icon: '📐', color: 'from-purple-500 to-pink-500' },
    temperature: { name: 'Temperature', icon: '🌡️', color: 'from-red-500 to-orange-500' },
    time: { name: 'Time', icon: '⏰', color: 'from-indigo-500 to-blue-500' },
    speed: { name: 'Speed', icon: '🚀', color: 'from-yellow-500 to-orange-500' },
    pressure: { name: 'Pressure', icon: '💨', color: 'from-cyan-500 to-blue-500' },
    energy: { name: 'Energy', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
    power: { name: 'Power', icon: '💡', color: 'from-orange-500 to-red-500' },
    digital: { name: 'Digital Storage', icon: '💾', color: 'from-sky-500 to-blue-500' },
    partsPer: { name: 'Parts-Per', icon: '🔢', color: 'from-violet-500 to-purple-500' },
    volumeFlowRate: { name: 'Volume Flow Rate', icon: '🌊', color: 'from-teal-500 to-green-500' },
    force: { name: 'Force', icon: '💪', color: 'from-rose-500 to-red-500' },
    torque: { name: 'Torque', icon: '🔄', color: 'from-amber-500 to-yellow-500' }
  };

  // Initialize categories on mount
  useEffect(() => {
    try {
      const measures = convert().measures();
      setCategories(measures);
    } catch (error) {
      console.error('Error loading measures:', error);
      setCategories(['length', 'mass', 'volume', 'temperature', 'time', 'speed', 'pressure', 'energy']);
    }
  }, []);

  // Update available units when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    try {
      const units = convert().list(selectedCategory);
      setAvailableUnits(units);
      if (units && units.length > 0) {
        const newFromUnit = favorites.find(f => f.category === selectedCategory)?.unit || units[0].abbr;
        const newToUnit = units[1]?.abbr || units[0].abbr;
        setConverterValues(prev => {
          const newValues = { ...prev, fromUnit: newFromUnit, toUnit: newToUnit };
          try {
            const result = convert(prev.fromValue || 1).from(newFromUnit).to(newToUnit);
            return { ...newValues, toValue: result };
          } catch (err) {
            return { ...newValues, toValue: 0 };
          }
        });
      }
    } catch (error) {
      console.error('Error loading units:', error);
      setAvailableUnits([]);
    }
  }, [selectedCategory]);

  // Perform conversion
  const performConversion = useCallback((value, fromUnit, toUnit) => {
    try {
      if (fromUnit && toUnit && value !== undefined && !isNaN(value) && value !== '') {
        const numValue = parseFloat(value) || 0;
        const result = convert(numValue).from(fromUnit).to(toUnit);
        return result;
      }
      return 0;
    } catch (error) {
      console.error('Conversion error:', error);
      return 0;
    }
  }, []);

  // Handle unit conversion changes
  const updateConversion = (field, value) => {
    let newValues;
    if (field === 'fromValue') {
      const result = performConversion(value, converterValues.fromUnit, converterValues.toUnit);
      newValues = { ...converterValues, fromValue: value, toValue: result };
    } else if (field === 'toValue') {
      const result = performConversion(value, converterValues.toUnit, converterValues.fromUnit);
      newValues = { ...converterValues, toValue: value, fromValue: result };
    } else if (field === 'fromUnit') {
      const result = performConversion(converterValues.fromValue, value, converterValues.toUnit);
      newValues = { ...converterValues, fromUnit: value, toValue: result };
    } else if (field === 'toUnit') {
      const result = performConversion(converterValues.fromValue, converterValues.fromUnit, value);
      newValues = { ...converterValues, toUnit: value, toValue: result };
    } else {
      return;
    }
    setConverterValues(newValues);
    
    // Save to converter history
    if (field === 'fromValue' || field === 'toValue') {
      const newHistoryItem = {
        fromValue: newValues.fromValue,
        fromUnit: newValues.fromUnit,
        toValue: newValues.toValue,
        toUnit: newValues.toUnit,
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString()
      };
      setConverterHistory(prev => [newHistoryItem, ...prev].slice(0, 15));
    }
  };

  const swapUnits = () => {
    setConverterValues({
      ...converterValues,
      fromUnit: converterValues.toUnit,
      toUnit: converterValues.fromUnit,
      fromValue: converterValues.toValue,
      toValue: converterValues.fromValue
    });
    toast.info('Units swapped', { position: 'bottom-center', autoClose: 1000 });
  };

  const copyResultToClipboard = () => {
    const result = `${converterValues.toValue} ${converterValues.toUnit}`;
    navigator.clipboard.writeText(result);
    toast.success('✓ Result copied to clipboard!', { position: 'bottom-center', autoClose: 1500, icon: '📋' });
  };

  const toggleFavoriteUnit = (unit) => {
    const existingIndex = favorites.findIndex(f => f.unit === unit && f.category === selectedCategory);
    if (existingIndex >= 0) {
      setFavorites(prev => prev.filter((_, i) => i !== existingIndex));
      toast.info(`Removed ${unit} from favorites`, { position: 'bottom-center', autoClose: 1200 });
    } else {
      setFavorites(prev => [...prev, { unit, category: selectedCategory }]);
      toast.success(`⭐ Added ${unit} to favorites`, { position: 'bottom-center', autoClose: 1200 });
    }
  };

  const isFavorite = (unit) => {
    return favorites.some(f => f.unit === unit && f.category === selectedCategory);
  };

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteUnits', JSON.stringify(favorites));
  }, [favorites]);

  const formatNumber = (num) => {
    if (isNaN(num)) return '0';
    if (num === 0) return '0';
    if (Math.abs(num) < 0.000001) return num.toExponential(8);
    if (Math.abs(num) > 999999999) return num.toExponential(8);
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 10 });
  };

  const getUnitFullName = (unitAbbr) => {
    const unit = availableUnits.find(u => u.abbr === unitAbbr);
    return unit ? unit.unit : unitAbbr;
  };

  const clearConverter = () => {
    setConverterValues(prev => ({ ...prev, fromValue: 1, toValue: 0 }));
    toast.info('Reset conversion values', { position: 'bottom-center', autoClose: 1000 });
  };

  const recallFromConverterHistory = (item) => {
    setConverterValues({
      fromValue: item.fromValue,
      fromUnit: item.fromUnit,
      toValue: item.toValue,
      toUnit: item.toUnit
    });
    setSelectedCategory(item.category);
    setShowConverterHistory(false);
    toast.success('Restored previous conversion', { position: 'bottom-center', autoClose: 1500 });
  };

  // Math.js Functions List
  const mathFunctionsList = [
    { name: 'sin', display: 'sin(x)', type: 'function', description: 'Sine function', insert: 'sin(', category: 'Trigonometric' },
    { name: 'cos', display: 'cos(x)', type: 'function', description: 'Cosine function', insert: 'cos(', category: 'Trigonometric' },
    { name: 'tan', display: 'tan(x)', type: 'function', description: 'Tangent function', insert: 'tan(', category: 'Trigonometric' },
    { name: 'asin', display: 'asin(x)', type: 'function', description: 'Inverse sine', insert: 'asin(', category: 'Trigonometric' },
    { name: 'acos', display: 'acos(x)', type: 'function', description: 'Inverse cosine', insert: 'acos(', category: 'Trigonometric' },
    { name: 'atan', display: 'atan(x)', type: 'function', description: 'Inverse tangent', insert: 'atan(', category: 'Trigonometric' },
    { name: 'sinh', display: 'sinh(x)', type: 'function', description: 'Hyperbolic sine', insert: 'sinh(', category: 'Hyperbolic' },
    { name: 'cosh', display: 'cosh(x)', type: 'function', description: 'Hyperbolic cosine', insert: 'cosh(', category: 'Hyperbolic' },
    { name: 'tanh', display: 'tanh(x)', type: 'function', description: 'Hyperbolic tangent', insert: 'tanh(', category: 'Hyperbolic' },
    { name: 'exp', display: 'exp(x)', type: 'function', description: 'Exponential e^x', insert: 'exp(', category: 'Exp/Log' },
    { name: 'log', display: 'log(x)', type: 'function', description: 'Natural logarithm (ln)', insert: 'log(', category: 'Exp/Log' },
    { name: 'log10', display: 'log10(x)', type: 'function', description: 'Base-10 logarithm', insert: 'log10(', category: 'Exp/Log' },
    { name: 'pow', display: 'pow(x, y)', type: 'function', description: 'Power x^y', insert: 'pow(', category: 'Exp/Log' },
    { name: 'sqrt', display: 'sqrt(x)', type: 'function', description: 'Square root', insert: 'sqrt(', category: 'Exp/Log' },
    { name: 'det', display: 'det(matrix)', type: 'function', description: 'Matrix determinant', insert: 'det(', category: 'Linear Algebra' },
    { name: 'inv', display: 'inv(matrix)', type: 'function', description: 'Matrix inverse', insert: 'inv(', category: 'Linear Algebra' },
    { name: 'transpose', display: 'transpose(matrix)', type: 'function', description: 'Matrix transpose', insert: 'transpose(', category: 'Linear Algebra' },
    { name: 'mean', display: 'mean(values)', type: 'function', description: 'Arithmetic mean', insert: 'mean(', category: 'Statistics' },
    { name: 'median', display: 'median(values)', type: 'function', description: 'Median value', insert: 'median(', category: 'Statistics' },
    { name: 'std', display: 'std(values)', type: 'function', description: 'Standard deviation', insert: 'std(', category: 'Statistics' },
    { name: 'sum', display: 'sum(values)', type: 'function', description: 'Sum of values', insert: 'sum(', category: 'Statistics' },
    { name: 'factorial', display: 'factorial(n)', type: 'function', description: 'n! factorial', insert: 'factorial(', category: 'Number Theory' },
    { name: 'pi', display: 'π', type: 'constant', description: 'Pi = 3.14159...', insert: 'pi', category: 'Constants' },
    { name: 'e', display: 'e', type: 'constant', description: "Euler's number", insert: 'e', category: 'Constants' }
  ];

  const [filteredCommands, setFilteredCommands] = useState(mathFunctionsList);

  useEffect(() => {
    if (!commandSearch.trim()) {
      setFilteredCommands(mathFunctionsList);
    } else {
      const searchLower = commandSearch.toLowerCase();
      const filtered = mathFunctionsList.filter(func => 
        func.name.toLowerCase().includes(searchLower) ||
        func.display.toLowerCase().includes(searchLower) ||
        func.description.toLowerCase().includes(searchLower)
      );
      setFilteredCommands(filtered);
    }
    setCommandIndex(0);
  }, [commandSearch]);

  const evaluateExpression = useCallback((expr) => {
    if (!expr || !expr.trim()) return null;
    try {
      let processedExpr = expr;
      processedExpr = processedExpr.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
      processedExpr = processedExpr.replace(/(\))(\d)/g, '$1*$2');
      processedExpr = processedExpr.replace(/(\d)(\()/g, '$1*$2');
      
      if (isDegree) {
        const trigFunctions = ['sin', 'cos', 'tan'];
        trigFunctions.forEach(func => {
          const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
          processedExpr = processedExpr.replace(regex, (match, angle) => `${func}(${angle} * pi / 180)`);
        });
      }
      const result = math.evaluate(processedExpr);
      if (math.typeOf(result) === 'Matrix' || math.typeOf(result) === 'Array') {
        return JSON.stringify(result.valueOf());
      }
      return typeof result === 'number' ? result : parseFloat(result);
    } catch (error) {
      return null;
    }
  }, [isDegree]);

  const addToExpression = (text) => {
    const newExpression = expression + text;
    setExpression(newExpression);
    const result = evaluateExpression(newExpression);
    if (result !== null && !isNaN(result) && typeof result !== 'string') {
      setDisplay(result.toString());
    }
  };

  const evaluateAndDisplay = () => {
    if (!expression.trim()) return;
    const result = evaluateExpression(expression);
    if (result !== null && !isNaN(result)) {
      const formattedResult = result.toString();
      setDisplay(formattedResult);
      setAnsValue(typeof result === 'number' ? result : 0);
      setHistory(prev => [{ expression, result: formattedResult, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
      setExpression('');
      toast.success('✓ Calculated!', { position: 'bottom-center', autoClose: 800 });
    } else {
      setDisplay('Error');
      toast.error('Invalid expression', { position: 'bottom-center', autoClose: 1500 });
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clearAll = () => { setDisplay('0'); setExpression(''); };
  const clearEntry = () => { setDisplay('0'); };
  const deleteLast = () => {
    if (expression.length > 0) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      if (newExpression.length === 0) setDisplay('0');
      else {
        const result = evaluateExpression(newExpression);
        if (result !== null && !isNaN(result)) setDisplay(result.toString());
        else setDisplay('0');
      }
    } else setDisplay('0');
  };

  const memoryRecall = () => addToExpression(String(memory));
  const memoryClear = () => setMemory(0);
  const memoryAdd = () => { const val = parseFloat(display); if (!isNaN(val)) setMemory(memory + val); toast.info(`Memory: ${memory + val}`, { autoClose: 800 }); };
  const memorySubtract = () => { const val = parseFloat(display); if (!isNaN(val)) setMemory(memory - val); toast.info(`Memory: ${memory - val}`, { autoClose: 800 }); };

  const insertCommand = (command) => { addToExpression(command.insert); setShowCommands(false); setCommandSearch(''); };

  // Keyboard handling
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showCommands) return;
      const key = event.key;
      if (key === '/' || key === 'F2') { event.preventDefault(); setShowCommands(true); return; }
      if (key === 'Escape') { clearAll(); event.preventDefault(); return; }
      if (/[0-9]/.test(key)) addToExpression(key);
      else if (key === '.') addToExpression('.');
      else if (key === '+') addToExpression('+');
      else if (key === '-') addToExpression('-');
      else if (key === '*') addToExpression('*');
      else if (key === '/') addToExpression('/');
      else if (key === '(') addToExpression('(');
      else if (key === ')') addToExpression(')');
      else if (key === 'Enter') evaluateAndDisplay();
      else if (key === 'Backspace') deleteLast();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expression, showCommands]);

  useEffect(() => {
    if (showCommands && commandInputRef.current) commandInputRef.current.focus();
  }, [showCommands]);

  const Button = ({ label, onClick, variant = 'default', span = 1, title = '' }) => (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick} title={title}
      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200
        ${variant === 'primary' ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md' : ''}
        ${variant === 'secondary' ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
        ${variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
        ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
        ${variant === 'function' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200' : ''}
        ${variant === 'constant' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200' : ''}
        ${variant === 'default' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600' : ''}
      `}
      style={{ gridColumn: `span ${span}` }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-6 px-4">
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />
      
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Tab Switcher */}
        <div className="text-center mb-6">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Math.js Studio
          </motion.h1>
          <div className="flex justify-center mt-3 gap-3">
            <button
              onClick={() => setActiveTab('calc')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === 'calc' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <CalculateIcon fontSize="small" /> Calculator
            </button>
            <button
              onClick={() => setActiveTab('convert')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === 'convert' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <StraightenIcon fontSize="small" /> Unit Converter
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <button onClick={() => setIsDegree(true)} className={`px-3 py-1 text-xs rounded-full ${isDegree ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>DEG</button>
            <button onClick={() => setIsDegree(false)} className={`px-3 py-1 text-xs rounded-full ${!isDegree ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>RAD</button>
            <button onClick={() => setShowCommands(true)} className="px-3 py-1 text-xs rounded-full bg-purple-500 text-white">⌨️ / Search Functions</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Functions */}
          {activeTab === 'calc' && (
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl sticky top-20 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⚡ Quick Functions</h3>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].map(fn => (
                    <Button key={fn} label={fn} onClick={() => addToExpression(`${fn}(`)} variant="function" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 mb-4">
                  <Button label="det()" onClick={() => addToExpression('det(')} variant="function" />
                  <Button label="inv()" onClick={() => addToExpression('inv(')} variant="function" />
                  <Button label="mean()" onClick={() => addToExpression('mean(')} variant="function" />
                  <Button label="std()" onClick={() => addToExpression('std(')} variant="function" />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <Button label="π" onClick={() => addToExpression('pi')} variant="constant" />
                  <Button label="e" onClick={() => addToExpression('e')} variant="constant" />
                  <Button label="√2" onClick={() => addToExpression('sqrt2')} variant="constant" />
                  <Button label="φ" onClick={() => addToExpression('phi')} variant="constant" />
                </div>
              </div>
            </div>
          )}

          {/* Main Center Area */}
          <div className={`${activeTab === 'calc' ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3'} order-1 lg:order-2`}>
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {activeTab === 'calc' ? (
                <>
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 p-5">
                    <input ref={expressionInputRef} type="text" value={expression} onChange={(e) => { setExpression(e.target.value); const res = evaluateExpression(e.target.value); if (res !== null && !isNaN(res)) setDisplay(res.toString()); }} onKeyDown={(e) => e.key === 'Enter' && evaluateAndDisplay()} placeholder="Enter expression..." className="w-full bg-gray-800 dark:bg-gray-900 text-gray-300 text-sm font-mono p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-500 mb-2" />
                    <div className="text-right"><div className="text-4xl font-mono font-bold text-white break-all">{display}</div></div>
                  </div>
                  <div className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b">
                    <div className="flex gap-1">
                      <button onClick={memoryClear} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-200">MC</button>
                      <button onClick={memoryAdd} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-200">M+</button>
                      <button onClick={memorySubtract} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-200">M-</button>
                      <button onClick={memoryRecall} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-200">MR</button>
                      <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-gray-600 px-2 py-1 rounded hover:bg-gray-200">📜 History</button>
                    </div>
                    <div className="flex gap-3 text-xs"><span>Ans: {typeof ansValue === 'number' ? ansValue.toFixed(6) : ansValue}</span><span>Mem: {memory}</span></div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <Button label="AC" onClick={clearAll} variant="danger" />
                      <Button label="C" onClick={clearEntry} variant="warning" />
                      <Button label="⌫" onClick={deleteLast} variant="default" />
                      <Button label="±" onClick={() => addToExpression('(-')} variant="default" />
                      <Button label="%" onClick={() => addToExpression('%')} variant="default" />
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <Button label="^" onClick={() => addToExpression('^')} variant="primary" />
                      <Button label="√" onClick={() => addToExpression('sqrt(')} variant="function" />
                      <Button label="!" onClick={() => addToExpression('!')} variant="function" />
                      <Button label="(" onClick={() => addToExpression('(')} variant="default" />
                      <Button label=")" onClick={() => addToExpression(')')} variant="default" />
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <Button label="7" onClick={() => addToExpression('7')} /><Button label="8" onClick={() => addToExpression('8')} /><Button label="9" onClick={() => addToExpression('9')} />
                      <Button label="÷" onClick={() => addToExpression('/')} variant="primary" /><Button label="ANS" onClick={() => addToExpression(String(ansValue))} variant="secondary" />
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <Button label="4" onClick={() => addToExpression('4')} /><Button label="5" onClick={() => addToExpression('5')} /><Button label="6" onClick={() => addToExpression('6')} />
                      <Button label="×" onClick={() => addToExpression('*')} variant="primary" /><Button label="π" onClick={() => addToExpression('pi')} variant="constant" />
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <Button label="1" onClick={() => addToExpression('1')} /><Button label="2" onClick={() => addToExpression('2')} /><Button label="3" onClick={() => addToExpression('3')} />
                      <Button label="-" onClick={() => addToExpression('-')} variant="primary" /><Button label="e" onClick={() => addToExpression('e')} variant="constant" />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      <Button label="0" onClick={() => addToExpression('0')} span={2} /><Button label="." onClick={() => addToExpression('.')} />
                      <Button label="+" onClick={() => addToExpression('+')} variant="primary" /><Button label="=" onClick={evaluateAndDisplay} variant="primary" />
                    </div>
                  </div>
                </>
              ) : (
                /* Full Unit Converter UI */
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Universal Unit Converter</h2>
                    <div className="flex gap-2">
                      <Tooltip title="Clear">
                        <IconButton onClick={clearConverter} size="small"><CloseIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="History">
                        <IconButton onClick={() => setShowConverterHistory(!showConverterHistory)} size="small"><HistoryIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Category Selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto mt-2 p-1 custom-scrollbar">
                      {categories.map(cat => {
                        const cfg = categoryConfig[cat] || { name: cat.charAt(0).toUpperCase() + cat.slice(1), icon: '🔧', color: 'from-gray-500 to-gray-600' };
                        return (
                          <motion.button key={cat} onClick={() => setSelectedCategory(cat)} whileHover={{ scale: 1.02 }}
                            className={`text-xs px-2 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${selectedCategory === cat ? `bg-gradient-to-r ${cfg.color} text-white shadow-md` : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                            <span>{cfg.icon}</span><span className="hidden sm:inline">{cfg.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* From Unit */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      From
                      <Tooltip title="Add to favorites">
                        <IconButton size="small" onClick={() => toggleFavoriteUnit(converterValues.fromUnit)}>
                          {isFavorite(converterValues.fromUnit) ? <StarIcon fontSize="small" className="text-yellow-500" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <button
                          onClick={(e) => setFromUnitAnchorEl(e.currentTarget)}
                          className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-900 border rounded-xl flex justify-between items-center hover:border-cyan-500 transition-colors"
                        >
                          <span><span className="font-mono font-bold">{converterValues.fromUnit}</span><span className="text-xs text-gray-500 ml-2">({getUnitFullName(converterValues.fromUnit)})</span></span>
                          <KeyboardArrowDownIcon fontSize="small" />
                        </button>
                        <Menu anchorEl={fromUnitAnchorEl} open={Boolean(fromUnitAnchorEl)} onClose={() => setFromUnitAnchorEl(null)}>
                          {availableUnits.map(unit => (
                            <MenuItem key={unit.abbr} onClick={() => { updateConversion('fromUnit', unit.abbr); setFromUnitAnchorEl(null); }}>
                              <ListItemText primary={unit.unit} secondary={unit.abbr} />
                              {isFavorite(unit.abbr) && <Chip label="★" size="small" className="ml-2" />}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                      <TextField
                        type="number"
                        value={converterValues.fromValue}
                        onChange={(e) => updateConversion('fromValue', e.target.value)}
                        className="flex-1"
                        InputProps={{ sx: { borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.02)' } }}
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <motion.button
                      onClick={swapUnits}
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-slate-500 dark:text-cyan-400 hover:text-cyan-600 text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border"
                    >
                      <SwapHorizIcon fontSize="small" /> Swap Units
                    </motion.button>
                  </div>

                  {/* To Unit */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400">To</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <button
                          onClick={(e) => setToUnitAnchorEl(e.currentTarget)}
                          className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-900 border rounded-xl flex justify-between items-center hover:border-cyan-500"
                        >
                          <span><span className="font-mono font-bold">{converterValues.toUnit}</span><span className="text-xs text-gray-500 ml-2">({getUnitFullName(converterValues.toUnit)})</span></span>
                          <KeyboardArrowDownIcon fontSize="small" />
                        </button>
                        <Menu anchorEl={toUnitAnchorEl} open={Boolean(toUnitAnchorEl)} onClose={() => setToUnitAnchorEl(null)}>
                          {availableUnits.map(unit => (
                            <MenuItem key={unit.abbr} onClick={() => { updateConversion('toUnit', unit.abbr); setToUnitAnchorEl(null); }}>
                              <ListItemText primary={unit.unit} secondary={unit.abbr} />
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                      <TextField
                        type="number"
                        value={converterValues.toValue}
                        onChange={(e) => updateConversion('toValue', e.target.value)}
                        className="flex-1"
                        InputProps={{ 
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Copy result">
                                <IconButton onClick={copyResultToClipboard} edge="end">
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ), 
                          sx: { borderRadius: '12px' } 
                        }}
                      />
                    </div>
                  </div>

                  {/* Result Display */}
                  <div className="text-center pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Conversion Result</p>
                    <motion.p key={converterValues.toValue} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                      {formatNumber(converterValues.fromValue)} {converterValues.fromUnit} = {formatNumber(converterValues.toValue)} {converterValues.toUnit}
                    </motion.p>
                  </div>

                  {/* Converter History */}
                  <AnimatePresence>
                    {showConverterHistory && converterHistory.length > 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <Divider className="my-3" />
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          <h4 className="text-xs font-bold text-gray-500">Recent Conversions</h4>
                          {converterHistory.map((item, idx) => (
                            <div key={idx} onClick={() => recallFromConverterHistory(item)} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 text-sm transition-colors">
                              {item.fromValue} {item.fromUnit} → {item.toValue.toFixed(6)} {item.toUnit}
                              <span className="text-xs text-gray-400 ml-2">{item.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar History */}
          {activeTab === 'calc' && showHistory && (
            <div className="lg:col-span-3 order-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl sticky top-20 p-4">
                <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">📜 History</h3><button onClick={() => setHistory([])} className="text-xs text-red-500">Clear</button></div>
                {history.length === 0 ? <p className="text-gray-400 text-center py-8 text-sm">No calculations yet</p> : history.map((item, idx) => (
                  <div key={idx} onClick={() => addToExpression(item.result)} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="text-[10px] text-gray-400">{item.timestamp}</div>
                    <div className="text-xs font-mono truncate">{item.expression}</div>
                    <div className="text-sm font-mono font-bold text-cyan-600">= {item.result}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Palette Modal */}
        <AnimatePresence>
          {showCommands && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-20" onClick={() => setShowCommands(false)}>
              <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex items-center gap-3"><SearchIcon /><input ref={commandInputRef} type="text" placeholder="Search functions..." className="flex-1 bg-transparent outline-none text-lg" value={commandSearch} onChange={e => setCommandSearch(e.target.value)} /><button onClick={() => setShowCommands(false)}><CloseIcon /></button></div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {filteredCommands.map((func, idx) => (
                    <button key={func.name} onClick={() => insertCommand(func)} className={`w-full text-left p-3 rounded-xl flex justify-between items-center ${idx === commandIndex ? 'bg-cyan-100 dark:bg-cyan-900/40' : 'hover:bg-gray-100'}`}>
                      <div><span className="font-mono font-medium">{func.display}</span><div className="text-xs text-gray-500">{func.description}</div></div>
                    </button>
                  ))}
                </div>
                <div className="p-2 text-xs text-gray-400 text-center border-t">↑↓ navigate • Enter select • Esc close</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default ScientificCalculator;