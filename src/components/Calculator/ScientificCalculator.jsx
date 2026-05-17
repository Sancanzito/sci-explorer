// components/ScientificCalculator.jsx - Fixed with curated math.js functions list
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [isDegree, setIsDegree] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [ansValue, setAnsValue] = useState(0);
  const [isScientificNotation, setIsScientificNotation] = useState(false);
  
  // Command palette state
  const [showCommands, setShowCommands] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const commandInputRef = useRef(null);
  
  // Reference to expression input
  const expressionInputRef = useRef(null);

  // Curated list of math.js functions (most useful ones, not all 1000+)
  const mathFunctionsList = [
    // Basic arithmetic
    { name: 'add', display: 'add(a, b)', type: 'function', description: 'Add two numbers', insert: 'add(', category: 'Arithmetic' },
    { name: 'subtract', display: 'subtract(a, b)', type: 'function', description: 'Subtract two numbers', insert: 'subtract(', category: 'Arithmetic' },
    { name: 'multiply', display: 'multiply(a, b)', type: 'function', description: 'Multiply two numbers', insert: 'multiply(', category: 'Arithmetic' },
    { name: 'divide', display: 'divide(a, b)', type: 'function', description: 'Divide two numbers', insert: 'divide(', category: 'Arithmetic' },
    { name: 'mod', display: 'mod(a, b)', type: 'function', description: 'Modulo operation', insert: 'mod(', category: 'Arithmetic' },
    
    // Trigonometric
    { name: 'sin', display: 'sin(x)', type: 'function', description: 'Sine function', insert: 'sin(', category: 'Trigonometric' },
    { name: 'cos', display: 'cos(x)', type: 'function', description: 'Cosine function', insert: 'cos(', category: 'Trigonometric' },
    { name: 'tan', display: 'tan(x)', type: 'function', description: 'Tangent function', insert: 'tan(', category: 'Trigonometric' },
    { name: 'asin', display: 'asin(x)', type: 'function', description: 'Inverse sine', insert: 'asin(', category: 'Trigonometric' },
    { name: 'acos', display: 'acos(x)', type: 'function', description: 'Inverse cosine', insert: 'acos(', category: 'Trigonometric' },
    { name: 'atan', display: 'atan(x)', type: 'function', description: 'Inverse tangent', insert: 'atan(', category: 'Trigonometric' },
    { name: 'atan2', display: 'atan2(y, x)', type: 'function', description: 'Angle from coordinates', insert: 'atan2(', category: 'Trigonometric' },
    { name: 'sec', display: 'sec(x)', type: 'function', description: 'Secant function', insert: 'sec(', category: 'Trigonometric' },
    { name: 'csc', display: 'csc(x)', type: 'function', description: 'Cosecant function', insert: 'csc(', category: 'Trigonometric' },
    { name: 'cot', display: 'cot(x)', type: 'function', description: 'Cotangent function', insert: 'cot(', category: 'Trigonometric' },
    
    // Hyperbolic
    { name: 'sinh', display: 'sinh(x)', type: 'function', description: 'Hyperbolic sine', insert: 'sinh(', category: 'Hyperbolic' },
    { name: 'cosh', display: 'cosh(x)', type: 'function', description: 'Hyperbolic cosine', insert: 'cosh(', category: 'Hyperbolic' },
    { name: 'tanh', display: 'tanh(x)', type: 'function', description: 'Hyperbolic tangent', insert: 'tanh(', category: 'Hyperbolic' },
    { name: 'asinh', display: 'asinh(x)', type: 'function', description: 'Inverse hyperbolic sine', insert: 'asinh(', category: 'Hyperbolic' },
    { name: 'acosh', display: 'acosh(x)', type: 'function', description: 'Inverse hyperbolic cosine', insert: 'acosh(', category: 'Hyperbolic' },
    { name: 'atanh', display: 'atanh(x)', type: 'function', description: 'Inverse hyperbolic tangent', insert: 'atanh(', category: 'Hyperbolic' },
    
    // Exponential & Logarithmic
    { name: 'exp', display: 'exp(x)', type: 'function', description: 'Exponential e^x', insert: 'exp(', category: 'Exp/Log' },
    { name: 'log', display: 'log(x)', type: 'function', description: 'Natural logarithm (ln)', insert: 'log(', category: 'Exp/Log' },
    { name: 'log10', display: 'log10(x)', type: 'function', description: 'Base-10 logarithm', insert: 'log10(', category: 'Exp/Log' },
    { name: 'log2', display: 'log2(x)', type: 'function', description: 'Base-2 logarithm', insert: 'log2(', category: 'Exp/Log' },
    { name: 'pow', display: 'pow(x, y)', type: 'function', description: 'Power x^y', insert: 'pow(', category: 'Exp/Log' },
    { name: 'sqrt', display: 'sqrt(x)', type: 'function', description: 'Square root', insert: 'sqrt(', category: 'Exp/Log' },
    { name: 'cbrt', display: 'cbrt(x)', type: 'function', description: 'Cube root', insert: 'cbrt(', category: 'Exp/Log' },
    
    // Linear Algebra
    { name: 'det', display: 'det(matrix)', type: 'function', description: 'Matrix determinant', insert: 'det(', category: 'Linear Algebra' },
    { name: 'inv', display: 'inv(matrix)', type: 'function', description: 'Matrix inverse', insert: 'inv(', category: 'Linear Algebra' },
    { name: 'transpose', display: 'transpose(matrix)', type: 'function', description: 'Matrix transpose', insert: 'transpose(', category: 'Linear Algebra' },
    { name: 'trace', display: 'trace(matrix)', type: 'function', description: 'Matrix trace', insert: 'trace(', category: 'Linear Algebra' },
    { name: 'eig', display: 'eig(matrix)', type: 'function', description: 'Eigenvalues/vectors', insert: 'eig(', category: 'Linear Algebra' },
    { name: 'dot', display: 'dot(a, b)', type: 'function', description: 'Dot product', insert: 'dot(', category: 'Linear Algebra' },
    { name: 'cross', display: 'cross(a, b)', type: 'function', description: 'Cross product', insert: 'cross(', category: 'Linear Algebra' },
    { name: 'norm', display: 'norm(x)', type: 'function', description: 'Vector/matrix norm', insert: 'norm(', category: 'Linear Algebra' },
    
    // Statistics
    { name: 'mean', display: 'mean(values)', type: 'function', description: 'Arithmetic mean', insert: 'mean(', category: 'Statistics' },
    { name: 'median', display: 'median(values)', type: 'function', description: 'Median value', insert: 'median(', category: 'Statistics' },
    { name: 'mode', display: 'mode(values)', type: 'function', description: 'Mode value(s)', insert: 'mode(', category: 'Statistics' },
    { name: 'std', display: 'std(values)', type: 'function', description: 'Standard deviation', insert: 'std(', category: 'Statistics' },
    { name: 'var', display: 'var(values)', type: 'function', description: 'Variance', insert: 'var(', category: 'Statistics' },
    { name: 'min', display: 'min(values)', type: 'function', description: 'Minimum value', insert: 'min(', category: 'Statistics' },
    { name: 'max', display: 'max(values)', type: 'function', description: 'Maximum value', insert: 'max(', category: 'Statistics' },
    { name: 'sum', display: 'sum(values)', type: 'function', description: 'Sum of values', insert: 'sum(', category: 'Statistics' },
    { name: 'prod', display: 'prod(values)', type: 'function', description: 'Product of values', insert: 'prod(', category: 'Statistics' },
    { name: 'quantileSeq', display: 'quantileSeq(values, p)', type: 'function', description: 'Quantile sequence', insert: 'quantileSeq(', category: 'Statistics' },
    
    // Calculus
    { name: 'derivative', display: 'derivative(expr, var)', type: 'function', description: 'Symbolic derivative', insert: 'derivative("', category: 'Calculus' },
    { name: 'integral', display: 'integral(expr, var, a, b)', type: 'function', description: 'Numeric integral', insert: 'integral("', category: 'Calculus' },
    
    // Number Theory / Utilities
    { name: 'gcd', display: 'gcd(a, b)', type: 'function', description: 'Greatest common divisor', insert: 'gcd(', category: 'Number Theory' },
    { name: 'lcm', display: 'lcm(a, b)', type: 'function', description: 'Least common multiple', insert: 'lcm(', category: 'Number Theory' },
    { name: 'factorial', display: 'factorial(n)', type: 'function', description: 'n! factorial', insert: 'factorial(', category: 'Number Theory' },
    { name: 'combinations', display: 'combinations(n, k)', type: 'function', description: 'Binomial coefficient', insert: 'combinations(', category: 'Number Theory' },
    { name: 'permutations', display: 'permutations(n, k)', type: 'function', description: 'Permutations', insert: 'permutations(', category: 'Number Theory' },
    { name: 'random', display: 'random()', type: 'function', description: 'Random number [0,1]', insert: 'random()', category: 'Utilities' },
    { name: 'randomInt', display: 'randomInt(min, max)', type: 'function', description: 'Random integer', insert: 'randomInt(', category: 'Utilities' },
    { name: 'round', display: 'round(x)', type: 'function', description: 'Round to integer', insert: 'round(', category: 'Utilities' },
    { name: 'floor', display: 'floor(x)', type: 'function', description: 'Floor function', insert: 'floor(', category: 'Utilities' },
    { name: 'ceil', display: 'ceil(x)', type: 'function', description: 'Ceiling function', insert: 'ceil(', category: 'Utilities' },
    { name: 'abs', display: 'abs(x)', type: 'function', description: 'Absolute value', insert: 'abs(', category: 'Utilities' },
    { name: 'sign', display: 'sign(x)', type: 'function', description: 'Sign of x', insert: 'sign(', category: 'Utilities' },
    
    // Complex Numbers
    { name: 're', display: 're(z)', type: 'function', description: 'Real part of complex', insert: 're(', category: 'Complex' },
    { name: 'im', display: 'im(z)', type: 'function', description: 'Imaginary part', insert: 'im(', category: 'Complex' },
    { name: 'conj', display: 'conj(z)', type: 'function', description: 'Complex conjugate', insert: 'conj(', category: 'Complex' },
    { name: 'arg', display: 'arg(z)', type: 'function', description: 'Complex argument', insert: 'arg(', category: 'Complex' },
    
    // Unit conversion
    { name: 'to', display: 'to(value, unit)', type: 'function', description: 'Convert units', insert: 'to(', category: 'Units' },
    
    // Constants
    { name: 'pi', display: 'π', type: 'constant', description: 'Pi = 3.14159...', insert: 'pi', category: 'Constants' },
    { name: 'e', display: 'e', type: 'constant', description: 'Euler\'s number = 2.71828...', insert: 'e', category: 'Constants' },
    { name: 'tau', display: 'τ', type: 'constant', description: 'Tau = 2π = 6.28318...', insert: 'tau', category: 'Constants' },
    { name: 'phi', display: 'φ', type: 'constant', description: 'Golden ratio = 1.61803...', insert: 'phi', category: 'Constants' },
    { name: 'sqrt2', display: '√2', type: 'constant', description: 'Square root of 2', insert: 'sqrt2', category: 'Constants' },
    { name: 'sqrt3', display: '√3', type: 'constant', description: 'Square root of 3', insert: 'sqrt3', category: 'Constants' },
    { name: 'LN2', display: 'ln(2)', type: 'constant', description: 'Natural log of 2', insert: 'LN2', category: 'Constants' },
    { name: 'LN10', display: 'ln(10)', type: 'constant', description: 'Natural log of 10', insert: 'LN10', category: 'Constants' },
  ];

  const [filteredCommands, setFilteredCommands] = useState(mathFunctionsList);

  // Filter commands based on search
  useEffect(() => {
    if (!commandSearch.trim()) {
      setFilteredCommands(mathFunctionsList);
    } else {
      const searchLower = commandSearch.toLowerCase();
      const filtered = mathFunctionsList.filter(func => 
        func.name.toLowerCase().includes(searchLower) ||
        func.display.toLowerCase().includes(searchLower) ||
        func.description.toLowerCase().includes(searchLower) ||
        (func.category && func.category.toLowerCase().includes(searchLower))
      );
      setFilteredCommands(filtered);
    }
    setCommandIndex(0);
  }, [commandSearch]);

  // Get categories for grouping
  const getCategories = () => {
    const categories = {};
    mathFunctionsList.forEach(func => {
      const cat = func.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(func);
    });
    return categories;
  };

  // Evaluate expression using math.js (with full support)
  const evaluateExpression = useCallback((expr) => {
    if (!expr || !expr.trim()) return null;
    
    try {
      let processedExpr = expr;
      
      // Handle implicit multiplication
      processedExpr = processedExpr.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
      processedExpr = processedExpr.replace(/(\))(\d)/g, '$1*$2');
      processedExpr = processedExpr.replace(/(\d)(\()/g, '$1*$2');
      
      // Handle degree mode for trig functions - wrap angles in deg to rad conversion
      if (isDegree) {
        const trigFunctions = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
        trigFunctions.forEach(func => {
          const regex = new RegExp(`${func}\\(([^)]+(?:\\([^)]*\\)[^)]*)*)\\)`, 'g');
          processedExpr = processedExpr.replace(regex, (match, angle) => {
            return `${func}(${angle} * pi / 180)`;
          });
        });
        
        const invTrigFunctions = ['asin', 'acos', 'atan', 'asec', 'acsc', 'acot'];
        invTrigFunctions.forEach(func => {
          const regex = new RegExp(`${func}\\(([^)]+(?:\\([^)]*\\)[^)]*)*)\\)`, 'g');
          processedExpr = processedExpr.replace(regex, (match, value) => {
            return `${func}(${value}) * 180 / pi`;
          });
        });
      }
      
      const result = math.evaluate(processedExpr);
      
      let numericResult;
      if (math.typeOf(result) === 'Unit') {
        numericResult = result.toNumber();
      } else if (math.typeOf(result) === 'Matrix' || math.typeOf(result) === 'Array') {
        const arr = result.valueOf();
        if (Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0])) {
          numericResult = `[${arr.map(row => `[${row.join(', ')}]`).join(', ')}]`;
        } else {
          numericResult = JSON.stringify(arr);
        }
      } else {
        numericResult = typeof result === 'number' ? result : parseFloat(result);
      }
      
      return numericResult;
    } catch (error) {
      console.error('Evaluation error:', error.message);
      return null;
    }
  }, [isDegree]);

  // Add to expression and evaluate live
  const addToExpression = (text) => {
    let newText = text;
    // Handle special case for derivative/integral that need quotes
    if (text === 'derivative("' || text === 'integral("') {
      newText = text;
    }
    const newExpression = expression + newText;
    setExpression(newExpression);
    
    const result = evaluateExpression(newExpression);
    if (result !== null && !isNaN(result) && typeof result !== 'string') {
      let displayValue;
      if (isScientificNotation && Math.abs(result) > 0 && (Math.abs(result) < 0.000001 || Math.abs(result) > 999999)) {
        displayValue = result.toExponential(8);
      } else {
        displayValue = result.toString();
      }
      setDisplay(displayValue);
    } else if (result && typeof result === 'string') {
      setDisplay(result);
    }
  };

  // Insert command from palette
  const insertCommand = (command) => {
    addToExpression(command.insert);
    setShowCommands(false);
    setCommandSearch('');
    if (expressionInputRef.current) {
      expressionInputRef.current.focus();
    }
  };

  // Evaluate final expression
  const evaluateAndDisplay = () => {
    if (!expression.trim()) return;
    
    const result = evaluateExpression(expression);
    if (result !== null && !isNaN(result)) {
      let formattedResult;
      if (typeof result === 'string') {
        formattedResult = result;
      } else if (isScientificNotation && Math.abs(result) > 0 && (Math.abs(result) < 0.000001 || Math.abs(result) > 999999)) {
        formattedResult = result.toExponential(8);
      } else {
        formattedResult = result.toString();
      }
      setDisplay(formattedResult);
      setAnsValue(typeof result === 'number' ? result : 0);
      addToHistory(expression, formattedResult);
      setExpression('');
    } else {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  // Clear all
  const clearAll = () => {
    setDisplay('0');
    setExpression('');
  };

  // Clear entry
  const clearEntry = () => {
    setDisplay('0');
  };

  // Delete last character
  const deleteLast = () => {
    if (expression.length > 0) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      
      if (newExpression.length === 0) {
        setDisplay('0');
      } else {
        const result = evaluateExpression(newExpression);
        if (result !== null && !isNaN(result)) {
          let displayValue;
          if (typeof result === 'string') {
            displayValue = result;
          } else if (isScientificNotation && Math.abs(result) > 0 && (Math.abs(result) < 0.000001 || Math.abs(result) > 999999)) {
            displayValue = result.toExponential(8);
          } else {
            displayValue = result.toString();
          }
          setDisplay(displayValue);
        } else {
          setDisplay('0');
        }
      }
    } else {
      setDisplay('0');
    }
  };

  // Add to history
  const addToHistory = (expr, result) => {
    const historyItem = {
      expression: expr,
      result: String(result),
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 20));
  };

  // Memory functions
  const memoryRecall = () => {
    addToExpression(String(memory));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    const currentValue = parseFloat(display);
    if (!isNaN(currentValue)) {
      setMemory(memory + currentValue);
    }
  };

  const memorySubtract = () => {
    const currentValue = parseFloat(display);
    if (!isNaN(currentValue)) {
      setMemory(memory - currentValue);
    }
  };

  // Toggle scientific notation
  const toggleScientificNotation = () => {
    setIsScientificNotation(!isScientificNotation);
    const currentValue = parseFloat(display);
    if (!isNaN(currentValue) && currentValue !== 0) {
      if (!isScientificNotation && (Math.abs(currentValue) < 0.000001 || Math.abs(currentValue) > 999999)) {
        setDisplay(currentValue.toExponential(8));
      } else if (isScientificNotation) {
        setDisplay(currentValue.toString());
      }
    }
  };

  // Recall from history
  const recallFromHistory = (result) => {
    addToExpression(result);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const target = event.target;
      
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (key === 'Escape' && showCommands) {
          setShowCommands(false);
          event.preventDefault();
        }
        return;
      }
      
      if ((key === '/' || key === 'F2') && !showCommands) {
        event.preventDefault();
        setShowCommands(true);
        return;
      }
      
      if (key === 'Escape') {
        if (showCommands) {
          setShowCommands(false);
        } else {
          clearAll();
        }
        event.preventDefault();
        return;
      }
      
      if (/[0-9]/.test(key)) addToExpression(key);
      else if (key === '.') addToExpression('.');
      else if (key === '+') addToExpression('+');
      else if (key === '-') addToExpression('-');
      else if (key === '*') addToExpression('*');
      else if (key === '/') addToExpression('/');
      else if (key === '(') addToExpression('(');
      else if (key === ')') addToExpression(')');
      else if (key === '^') addToExpression('^');
      else if (key === '%') addToExpression('%');
      else if (key === 'Enter' || key === '=') evaluateAndDisplay();
      else if (key === 'Backspace') deleteLast();
      else if (key === ' ' && !showCommands) {
        event.preventDefault();
        setShowCommands(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expression, isDegree, showCommands]);

  // Focus command input when palette opens
  useEffect(() => {
    if (showCommands && commandInputRef.current) {
      setTimeout(() => commandInputRef.current.focus(), 50);
    }
  }, [showCommands]);

  // Command palette keyboard navigation
  useEffect(() => {
    if (!showCommands) return;
    
    const handleCommandNav = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCommandIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCommandIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[commandIndex]) {
        e.preventDefault();
        insertCommand(filteredCommands[commandIndex]);
      }
    };
    
    window.addEventListener('keydown', handleCommandNav);
    return () => window.removeEventListener('keydown', handleCommandNav);
  }, [showCommands, filteredCommands, commandIndex]);

  // Sample complex expressions
  const sampleExpressions = [
    { label: 'Quadratic', expr: '(-3 + sqrt(3^2 - 4*1*2)) / (2*1)' },
    { label: 'Derivative', expr: 'derivative("x^2 + 3*x", "x")' },
    { label: 'Integral', expr: 'integral("x^2", "x", 0, 2)' },
    { label: 'Matrix', expr: '[[1,2],[3,4]] * [[5,6],[7,8]]' },
    { label: 'Complex', expr: '(2 + 3i) * (4 - i)' },
    { label: 'Stats', expr: 'mean([1,2,3,4,5])' },
  ];

  const insertSample = (sample) => {
    addToExpression(sample.expr);
  };

  const Button = ({ label, onClick, variant = 'default', span = 1, title = '' }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={title}
      className={`
        ${variant === 'primary' ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md' : ''}
        ${variant === 'secondary' ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
        ${variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
        ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
        ${variant === 'function' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60' : ''}
        ${variant === 'constant' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/60' : ''}
        ${variant === 'sci' ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800/60' : ''}
        ${variant === 'default' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600' : ''}
        p-3 rounded-xl text-sm font-medium transition-all duration-200
      `}
      style={{ gridColumn: `span ${span}` }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
          >
            Math.js Scientific Calculator
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Full math.js integration • 80+ functions • Type <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">/</kbd> to search functions
          </p>
        </div>

        {/* Mode Indicators */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setIsDegree(true)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${isDegree ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            DEG
          </button>
          <button
            onClick={() => setIsDegree(false)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${!isDegree ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            RAD
          </button>
          <button
            onClick={toggleScientificNotation}
            className={`px-3 py-1 text-xs rounded-full transition-all ${isScientificNotation ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            SCI
          </button>
          <button
            onClick={() => setShowCommands(true)}
            className="px-3 py-1 text-xs rounded-full transition-all bg-purple-500 text-white shadow-md hover:bg-purple-600"
          >
            ⌨️ / Search (80+ functions)
          </button>
        </div>

        {/* Command Palette Modal */}
        <AnimatePresence>
          {showCommands && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-20"
              onClick={() => setShowCommands(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xl">🔍</span>
                    <input
                      ref={commandInputRef}
                      type="text"
                      placeholder="Search functions: sin, det, derivative, mean, etc..."
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg placeholder-gray-400"
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                    />
                    <button onClick={() => setShowCommands(false)} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded">
                      ESC
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {filteredCommands.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No functions found matching "{commandSearch}"
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredCommands.map((func, idx) => (
                        <motion.button
                          key={func.name}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                          onClick={() => insertCommand(func)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center ${
                            idx === commandIndex 
                              ? 'bg-cyan-100 dark:bg-cyan-900/40 ring-2 ring-cyan-500' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-medium text-gray-900 dark:text-white">
                                {func.display}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                                {func.type === 'constant' ? 'constant' : 'function'}
                              </span>
                              {func.category && (
                                <span className="text-xs text-gray-400">
                                  {func.category}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {func.description}
                            </div>
                          </div>
                          <kbd className="text-xs text-gray-400 hidden sm:block ml-2">
                            {idx === commandIndex ? '↵' : ''}
                          </kbd>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex justify-between">
                  <span>↑↓ to navigate</span>
                  <span>↵ to insert</span>
                  <span>ESC to close</span>
                  <span>80+ math.js functions available</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Quick Function Categories */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden sticky top-20"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>⚡</span> Quick Functions
                </h3>
                <p className="text-xs text-gray-500 mt-1">Click to insert | Type <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">/</kbd> for more</p>
              </div>
              <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {/* Trigonometry */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">📐 Trigonometry</h4>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].map(fn => (
                      <Button key={fn} label={fn} onClick={() => addToExpression(`${fn}(`)} variant="function" />
                    ))}
                  </div>
                </div>
                
                {/* Linear Algebra */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">📊 Linear Algebra</h4>
                  <div className="grid grid-cols-2 gap-1 mb-3">
                    <Button label="det()" onClick={() => addToExpression('det(')} variant="function" />
                    <Button label="inv()" onClick={() => addToExpression('inv(')} variant="function" />
                    <Button label="transpose()" onClick={() => addToExpression('transpose(')} variant="function" />
                    <Button label="dot()" onClick={() => addToExpression('dot(')} variant="function" />
                  </div>
                </div>

                {/* Statistics */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">📈 Statistics</h4>
                  <div className="grid grid-cols-2 gap-1 mb-3">
                    <Button label="mean()" onClick={() => addToExpression('mean(')} variant="function" />
                    <Button label="median()" onClick={() => addToExpression('median(')} variant="function" />
                    <Button label="std()" onClick={() => addToExpression('std(')} variant="function" />
                    <Button label="sum()" onClick={() => addToExpression('sum(')} variant="function" />
                  </div>
                </div>

                {/* Calculus */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">∫ Calculus</h4>
                  <div className="grid grid-cols-1 gap-1 mb-3">
                    <Button label="derivative(expr, var)" onClick={() => addToExpression('derivative("')} variant="function" />
                    <Button label="integral(expr, var, a, b)" onClick={() => addToExpression('integral("')} variant="function" />
                  </div>
                </div>

                {/* Constants */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">🔢 Constants</h4>
                  <div className="grid grid-cols-4 gap-1">
                    <Button label="π" onClick={() => addToExpression('pi')} variant="constant" />
                    <Button label="e" onClick={() => addToExpression('e')} variant="constant" />
                    <Button label="φ" onClick={() => addToExpression('phi')} variant="constant" />
                    <Button label="√2" onClick={() => addToExpression('sqrt2')} variant="constant" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Calculator Area */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Display Area */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 p-5">
                <div className="mb-2">
                  <input
                    ref={expressionInputRef}
                    type="text"
                    value={expression}
                    onChange={(e) => {
                      setExpression(e.target.value);
                      const result = evaluateExpression(e.target.value);
                      if (result !== null && !isNaN(result) && typeof result !== 'string') {
                        let displayVal;
                        if (isScientificNotation && Math.abs(result) > 0 && (Math.abs(result) < 0.000001 || Math.abs(result) > 999999)) {
                          displayVal = result.toExponential(8);
                        } else {
                          displayVal = result.toString();
                        }
                        setDisplay(displayVal);
                      } else if (result && typeof result === 'string') {
                        setDisplay(result);
                      } else {
                        setDisplay('?');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') evaluateAndDisplay();
                    }}
                    placeholder="Enter expression... (e.g., sin(pi/2) + 2^3, det([[1,2],[3,4]]), mean([1,2,3]))"
                    className="w-full bg-gray-800 dark:bg-gray-900 text-gray-300 text-sm font-mono p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-mono font-bold text-white break-all">
                    {display}
                  </div>
                </div>
              </div>

              {/* Memory & Utility Controls */}
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex-wrap gap-2">
                <div className="flex gap-1">
                  <button onClick={memoryClear} className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 px-2 py-1 rounded">MC</button>
                  <button onClick={memoryAdd} className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 px-2 py-1 rounded">M+</button>
                  <button onClick={memorySubtract} className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 px-2 py-1 rounded">M-</button>
                  <button onClick={memoryRecall} className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 px-2 py-1 rounded">MR</button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                  <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 px-2 py-1 rounded">
                    {showHistory ? '📜 Hide' : '📜 History'}
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="text-xs text-gray-400">Ans: {typeof ansValue === 'number' ? ansValue.toFixed(6) : ansValue}</div>
                  <div className="text-xs text-gray-400">Mem: {memory}</div>
                </div>
              </div>

              {/* Sample Expressions */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500">Examples:</span>
                  {sampleExpressions.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertSample(sample)}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Buttons Grid */}
              <div className="p-4">
                {/* Row 1: Clear & Special */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <Button label="AC" onClick={clearAll} variant="danger" />
                  <Button label="C" onClick={clearEntry} variant="warning" />
                  <Button label="⌫" onClick={deleteLast} variant="default" />
                  <Button label="±" onClick={() => addToExpression('(-')} variant="default" title="Negate" />
                  <Button label="%" onClick={() => addToExpression('%')} variant="default" />
                </div>

                {/* Row 2: Basic Operations */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <Button label="^" onClick={() => addToExpression('^')} variant="primary" />
                  <Button label="√" onClick={() => addToExpression('sqrt(')} variant="function" />
                  <Button label="!" onClick={() => addToExpression('!')} variant="function" />
                  <Button label="(" onClick={() => addToExpression('(')} variant="default" />
                  <Button label=")" onClick={() => addToExpression(')')} variant="default" />
                </div>

                {/* Row 3: Numbers 7-9 & Division */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <Button label="7" onClick={() => addToExpression('7')} variant="default" />
                  <Button label="8" onClick={() => addToExpression('8')} variant="default" />
                  <Button label="9" onClick={() => addToExpression('9')} variant="default" />
                  <Button label="÷" onClick={() => addToExpression('/')} variant="primary" />
                  <Button label="ANS" onClick={() => addToExpression(String(ansValue))} variant="secondary" />
                </div>

                {/* Row 4: Numbers 4-6 & Multiplication */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <Button label="4" onClick={() => addToExpression('4')} variant="default" />
                  <Button label="5" onClick={() => addToExpression('5')} variant="default" />
                  <Button label="6" onClick={() => addToExpression('6')} variant="default" />
                  <Button label="×" onClick={() => addToExpression('*')} variant="primary" />
                  <Button label="π" onClick={() => addToExpression('pi')} variant="constant" />
                </div>

                {/* Row 5: Numbers 1-3 & Subtraction */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <Button label="1" onClick={() => addToExpression('1')} variant="default" />
                  <Button label="2" onClick={() => addToExpression('2')} variant="default" />
                  <Button label="3" onClick={() => addToExpression('3')} variant="default" />
                  <Button label="-" onClick={() => addToExpression('-')} variant="primary" />
                  <Button label="e" onClick={() => addToExpression('e')} variant="constant" />
                </div>

                {/* Row 6: Zero, Decimal, Addition, Equals */}
                <div className="grid grid-cols-5 gap-2">
                  <Button label="0" onClick={() => addToExpression('0')} variant="default" span={2} />
                  <Button label="." onClick={() => addToExpression('.')} variant="default" />
                  <Button label="+" onClick={() => addToExpression('+')} variant="primary" />
                  <Button label="=" onClick={evaluateAndDisplay} variant="primary" />
                </div>
              </div>

              {/* Tips section */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                  <span>💡 Type expressions directly into the input bar</span>
                  <span>🔍 Press <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">/</kbd> to search all math.js functions</span>
                  <span>⚡ Supports matrices, units, complex numbers, calculus, and more!</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - History Panel */}
          <div className="lg:col-span-3 order-3">
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden sticky top-20"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📜</span> History
                      </h3>
                      <button
                        onClick={() => setHistory([])}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🧮</div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No calculations yet
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Press = to save to history
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.05, 0.5) }}
                            className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                            onClick={() => recallFromHistory(item.result)}
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {item.timestamp}
                            </div>
                            <div className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                              {item.expression.length > 40 ? item.expression.slice(0, 40) + '…' : item.expression}
                            </div>
                            <div className="text-sm font-mono font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                              = {item.result.length > 30 ? item.result.slice(0, 30) + '…' : item.result}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>⌨️ Keyboard:</span>
            <span>0-9, + - * / ^ %</span>
            <span>. ( )</span>
            <span><kbd>/</kbd> Search 80+ functions</span>
            <span>Enter = Evaluate</span>
            <span>Esc Clear</span>
            <span>⌫ Delete</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ScientificCalculator;