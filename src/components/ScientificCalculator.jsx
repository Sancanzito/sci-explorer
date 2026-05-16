// components/ScientificCalculator.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isDegree, setIsDegree] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Scientific constants
  const constants = {
    pi: Math.PI,
    e: Math.E
  };

  // Clear display
  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Clear all (AC)
  const clearAll = () => {
    clearDisplay();
    setMemory(0);
  };

  // Delete last character
  const deleteLast = () => {
    if (display.length === 1 || (display === 'Error' && display === 'Infinity')) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Input digit
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  // Input decimal
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Toggle sign (+/-)
  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  // Percentage
  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  // Basic operations
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Scientific operations
  const performScientificOperation = (func) => {
    let value = parseFloat(display);
    let result;
    let expression = `${func}(${value})`;

    switch (func) {
      case 'sin':
        result = isDegree ? Math.sin(value * Math.PI / 180) : Math.sin(value);
        break;
      case 'cos':
        result = isDegree ? Math.cos(value * Math.PI / 180) : Math.cos(value);
        break;
      case 'tan':
        result = isDegree ? Math.tan(value * Math.PI / 180) : Math.tan(value);
        break;
      case 'asin':
        result = isDegree ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
        break;
      case 'acos':
        result = isDegree ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
        break;
      case 'atan':
        result = isDegree ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
        break;
      case 'sinh':
        result = Math.sinh(value);
        expression = `sinh(${value})`;
        break;
      case 'cosh':
        result = Math.cosh(value);
        break;
      case 'tanh':
        result = Math.tanh(value);
        break;
      case 'log':
        result = Math.log10(value);
        expression = `log₁₀(${value})`;
        break;
      case 'ln':
        result = Math.log(value);
        expression = `ln(${value})`;
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        expression = `√(${value})`;
        break;
      case 'cbrt':
        result = Math.cbrt(value);
        expression = `∛(${value})`;
        break;
      case 'square':
        result = Math.pow(value, 2);
        expression = `${value}²`;
        break;
      case 'cube':
        result = Math.pow(value, 3);
        expression = `${value}³`;
        break;
      case 'power10':
        result = Math.pow(10, value);
        expression = `10^${value}`;
        break;
      case 'powerE':
        result = Math.exp(value);
        expression = `e^${value}`;
        break;
      case 'reciprocal':
        result = 1 / value;
        expression = `1/${value}`;
        break;
      case 'factorial':
        result = factorial(value);
        expression = `${value}!`;
        break;
      case 'abs':
        result = Math.abs(value);
        break;
      case 'floor':
        result = Math.floor(value);
        break;
      case 'ceil':
        result = Math.ceil(value);
        break;
      default:
        return;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      const formattedResult = parseFloat(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      addToHistory(expression, formattedResult);
    }
    setWaitingForOperand(true);
  };

  // Factorial function
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (!Number.isInteger(n)) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Calculate basic operations
  const calculate = (first, second, op) => {
    let result;
    switch (op) {
      case '+': result = first + second; break;
      case '-': result = first - second; break;
      case '×': result = first * second; break;
      case '÷': result = first / second; break;
      case '^': result = Math.pow(first, second); break;
      case 'mod': result = first % second; break;
      default: return second;
    }
    addToHistory(`${first} ${op} ${second}`, result);
    return result;
  };

  // Calculate equals
  const calculateEquals = () => {
    if (previousValue === null || operation === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    
    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      setDisplay(String(result));
    }
    
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  // Add to history
  const addToHistory = (expression, result) => {
    const historyItem = {
      expression,
      result: String(result),
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 20));
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  // Insert constant
  const insertConstant = (constant) => {
    setDisplay(String(constants[constant]));
    setWaitingForOperand(true);
  };

  // Memory functions
  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(false);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (/[0-9]/.test(key)) {
        inputDigit(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        let op = key;
        if (key === '*') op = '×';
        if (key === '/') op = '÷';
        performOperation(op);
      } else if (key === 'Enter' || key === '=') {
        calculateEquals();
      } else if (key === 'Escape') {
        clearAll();
      } else if (key === 'Backspace') {
        deleteLast();
      } else if (key === '%') {
        percentage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  // Button components
  const Button = ({ label, onClick, className = '', span = 1 }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${className} p-3 rounded-lg text-sm font-medium transition-all duration-200
        ${span > 1 ? `col-span-${span}` : ''}`}
      style={{ gridColumn: `span ${span}` }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scientific Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced calculations with trigonometric, logarithmic, and exponential functions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Main Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Display */}
              <div className="bg-gray-100 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="text-right">
                  <div className="text-gray-500 dark:text-gray-400 text-sm h-6">
                    {operation && previousValue !== null && `${previousValue} ${operation}`}
                  </div>
                  <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white break-all">
                    {display}
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDegree(true)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      isDegree 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    DEG
                  </button>
                  <button
                    onClick={() => setIsDegree(false)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      !isDegree 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    RAD
                  </button>
                </div>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 text-sm"
                >
                  {showHistory ? 'Hide History' : 'Show History'} 📜
                </button>
              </div>

              {/* Calculator Buttons */}
              <div className="p-4">
                {/* Row 1: Memory & Clear */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="MC" onClick={memoryClear} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
                  <Button label="M+" onClick={memoryAdd} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
                  <Button label="M-" onClick={memorySubtract} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
                  <Button label="MR" onClick={memoryRecall} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
                  <Button label="AC" onClick={clearAll} className="bg-red-500 hover:bg-red-600 text-white" span={2} />
                </div>

                {/* Row 2: Scientific Functions */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="x²" onClick={() => performScientificOperation('square')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                  <Button label="x³" onClick={() => performScientificOperation('cube')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                  <Button label="10ˣ" onClick={() => performScientificOperation('power10')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                  <Button label="eˣ" onClick={() => performScientificOperation('powerE')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                  <Button label="1/x" onClick={() => performScientificOperation('reciprocal')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                  <Button label="|x|" onClick={() => performScientificOperation('abs')} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" />
                </div>

                {/* Row 3: Trigonometry */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="sin" onClick={() => performScientificOperation('sin')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                  <Button label="cos" onClick={() => performScientificOperation('cos')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                  <Button label="tan" onClick={() => performScientificOperation('tan')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                  <Button label="sin⁻¹" onClick={() => performScientificOperation('asin')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                  <Button label="cos⁻¹" onClick={() => performScientificOperation('acos')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                  <Button label="tan⁻¹" onClick={() => performScientificOperation('atan')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
                </div>

                {/* Row 4: Hyperbolic & Roots */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="sinh" onClick={() => performScientificOperation('sinh')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                  <Button label="cosh" onClick={() => performScientificOperation('cosh')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                  <Button label="tanh" onClick={() => performScientificOperation('tanh')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                  <Button label="√" onClick={() => performScientificOperation('sqrt')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                  <Button label="∛" onClick={() => performScientificOperation('cbrt')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                  <Button label="!" onClick={() => performScientificOperation('factorial')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                </div>

                {/* Row 5: Constants & Functions */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="π" onClick={() => insertConstant('pi')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                  <Button label="e" onClick={() => insertConstant('e')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                  <Button label="log" onClick={() => performScientificOperation('log')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                  <Button label="ln" onClick={() => performScientificOperation('ln')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                  <Button label="floor" onClick={() => performScientificOperation('floor')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                  <Button label="ceil" onClick={() => performScientificOperation('ceil')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
                </div>

                {/* Row 6: Numbers & Operations */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="7" onClick={() => inputDigit(7)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="8" onClick={() => inputDigit(8)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="9" onClick={() => inputDigit(9)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="÷" onClick={() => performOperation('÷')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                  <Button label="mod" onClick={() => performOperation('mod')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                  <Button label="C" onClick={deleteLast} className="bg-yellow-500 hover:bg-yellow-600 text-white" />
                </div>

                <div className="grid grid-cols-6 gap-2 mb-2">
                  <Button label="4" onClick={() => inputDigit(4)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="5" onClick={() => inputDigit(5)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="6" onClick={() => inputDigit(6)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="×" onClick={() => performOperation('×')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                  <Button label="^" onClick={() => performOperation('^')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                  <Button label="±" onClick={toggleSign} className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white" />
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <Button label="1" onClick={() => inputDigit(1)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="2" onClick={() => inputDigit(2)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="3" onClick={() => inputDigit(3)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="-" onClick={() => performOperation('-')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                  <Button label="%" onClick={percentage} className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white" />
                  <Button label="=" onClick={calculateEquals} className="bg-cyan-600 hover:bg-cyan-700 text-white" span={2} />
                </div>

                <div className="grid grid-cols-6 gap-2 mt-2">
                  <Button label="0" onClick={() => inputDigit(0)} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" span={2} />
                  <Button label="." onClick={inputDecimal} className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <Button label="+" onClick={() => performOperation('+')} className="bg-cyan-500 hover:bg-cyan-600 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">History</h3>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                      No calculations yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setDisplay(item.result)}
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.timestamp}
                          </div>
                          <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {item.expression} = 
                          </div>
                          <div className="text-sm font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                            {item.result}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Tip: Use keyboard for faster calculations! (0-9, +, -, *, /, ., Enter, Backspace, Esc)</p>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;