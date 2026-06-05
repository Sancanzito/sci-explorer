// components/Calculator/ScientificCalculator.jsx
<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
=======
import React, { useState, useEffect, useRef, useCallback } from 'react';
>>>>>>> 5fff2847536ea652782bd35e4abe6e044d3c1fc8
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';
import convert from 'convert-units';
import { 
<<<<<<< HEAD
  Calculator, Replace, Activity, Sigma, ArrowRightLeft, 
  Copy, CheckCircle2, Variable, BookOpen, FunctionSquare, 
  Layers, Divide, PlusCircle
} from 'lucide-react';

// ==========================================
// 1. SMART MATHPAD (Math.js Implementation)
// ==========================================
const SmartMathpad = ({ input, setInput }) => {
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lines = input.split('\n');
    const scope = {};
    const newResults = lines.map(line => {
      if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('#')) {
        return { text: '', isError: false };
      }
      try {
        const cleanLine = line.split('#')[0].split('//')[0];
        const res = math.evaluate(cleanLine, scope);
        
        if (res === undefined || typeof res === 'function') return { text: '', isError: false };
        if (math.typeOf(res) === 'Unit') return { text: res.format(4), isError: false };
        if (math.typeOf(res) === 'Matrix' || math.typeOf(res) === 'DenseMatrix') return { text: JSON.stringify(res.valueOf()), isError: false };
        if (math.typeOf(res) === 'Complex') return { text: res.toString(), isError: false };
        return { text: math.format(res, { precision: 8 }), isError: false };
      } catch (err) {
        return { text: 'Error', isError: true };
      }
    });
    setResults(newResults);
  }, [input]);

  const copyAll = () => {
    const combined = input.split('\n').map((line, i) => 
      results[i]?.text ? `${line}  =>  ${results[i].text}` : line
    ).join('\n');
    navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 dark:bg-[#0a0f1c]/50 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-cyan-500/20 bg-slate-50 dark:bg-transparent">
        <h3 className="font-bold text-slate-800 dark:text-cyan-100 flex items-center gap-2">
          <Variable size={18} className="text-indigo-500" /> Math.js Computation Engine
        </h3>
        <button onClick={copyAll} className="text-sm font-medium text-slate-500 hover:text-indigo-500 flex items-center gap-1 transition-colors">
          {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Sheet'}
        </button>
      </div>
      
      <div className="flex flex-1 relative min-h-[400px]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-2/3 h-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-200 custom-scrollbar"
          spellCheck={false}
          placeholder="Start typing math expressions here..."
        />
        <div className="w-1/3 h-full bg-slate-100/50 dark:bg-black/20 border-l border-slate-200 dark:border-cyan-500/20 p-4 font-mono text-sm leading-relaxed pointer-events-none overflow-y-auto overflow-x-hidden text-right custom-scrollbar break-words">
          {results.map((res, i) => (
            <div key={i} className={`min-h-[1.5rem] ${res.isError ? 'text-red-400' : 'text-indigo-600 dark:text-cyan-400 font-bold'}`}>
              {res.text ? `= ${res.text}` : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MATH.JS REFERENCE GUIDE (NEW)
// ==========================================
const MathReferenceGuide = ({ onInsert }) => {
  const guides = [
    {
      title: "Algebra & Calculus",
      icon: <FunctionSquare size={16} className="text-purple-500" />,
      items: [
        { cmd: "derivative('x^2 + x', 'x')", desc: "Symbolic differentiation" },
        { cmd: "simplify('3x + 2x - 5')", desc: "Simplify algebraic expressions" },
        { cmd: "evaluate('x * y', {x: 2, y: 3})", desc: "Evaluate with scope variables" },
        { cmd: "lcm(4, 6) / gcd(8, 12)", desc: "Least common multiple / Greatest common divisor" }
      ]
    },
    {
      title: "Matrices & Linear Algebra",
      icon: <Layers size={16} className="text-blue-500" />,
      items: [
        { cmd: "[[1, 2], [3, 4]]", desc: "Create a 2D Matrix" },
        { cmd: "det([[1, 2], [3, 4]])", desc: "Calculate Determinant" },
        { cmd: "inv([[1, 2], [3, 4]])", desc: "Calculate Inverse Matrix" },
        { cmd: "cross([1, 1, 0], [0, 1, 1])", desc: "Vector Cross Product" },
        { cmd: "lsolve([[1, 2], [3, 4]], [5, 6])", desc: "Solve System of Linear Equations" }
      ]
    },
    {
      title: "Statistics & Combinatorics",
      icon: <Divide size={16} className="text-emerald-500" />,
      items: [
        { cmd: "mean(2, 4, 6, 8)", desc: "Arithmetic Mean" },
        { cmd: "std(2, 4, 6, 8)", desc: "Standard Deviation" },
        { cmd: "combinations(10, 3)", desc: "n Choose k (10 choose 3)" },
        { cmd: "permutations(5, 2)", desc: "n Permute k" },
        { cmd: "factorial(5)", desc: "Calculate 5!" }
      ]
    },
    {
      title: "Units & Complex Numbers",
      icon: <ArrowRightLeft size={16} className="text-orange-500" />,
      items: [
        { cmd: "5.08 cm to inch", desc: "Convert Units" },
        { cmd: "120 km/h to m/s", desc: "Complex Unit Conversion" },
        { cmd: "complex(2, 3)", desc: "Create Complex Number (2 + 3i)" },
        { cmd: "sqrt(-4)", desc: "Handles imaginary automatically (2i)" },
        { cmd: "e ^ (pi * i) + 1", desc: "Euler's Identity" }
      ]
    }
  ];

  return (
    <div className="bg-white/5 dark:bg-[#0a0f1c]/50 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-xl p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 dark:text-cyan-100 flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-cyan-500" /> Syntax Dictionary
        </h3>
        <p className="text-sm text-slate-500 dark:text-cyan-200/70">
          Click on any command to automatically insert it into the Smart Mathpad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((section, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-xl p-4">
            <h4 className="font-bold text-slate-700 dark:text-white flex items-center gap-2 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
              {section.icon} {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item, i) => (
                <li 
                  key={i} 
                  onClick={() => onInsert(item.cmd)}
                  className="group flex flex-col p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <code className="text-xs font-bold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-950/30 px-2 py-1 rounded inline-block w-fit mb-1">
                      {item.cmd}
                    </code>
                    <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-500 dark:text-cyan-400 transition-opacity">
                      <PlusCircle size={14} /> Insert
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 pl-1">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. UNIVERSAL UNIT CONVERTER
// ==========================================
const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState(1);
  const categories = convert().measures();
  
  useEffect(() => {
    const units = convert().list(category);
    if (units.length > 0) {
      setFromUnit(units[0].abbr);
      setToUnit(units[1] ? units[1].abbr : units[0].abbr);
    }
  }, [category]);

  const unitsList = useMemo(() => {
    try { return convert().list(category); } catch { return []; }
  }, [category]);

  const result = useMemo(() => {
    try {
      if (isNaN(inputValue)) return 0;
      return convert(inputValue).from(fromUnit).to(toUnit);
    } catch { return 'Error'; }
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <div className="bg-white/5 dark:bg-[#0a0f1c]/50 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-xl p-6">
      <h3 className="font-bold text-slate-800 dark:text-cyan-100 flex items-center gap-2 mb-6">
        <ArrowRightLeft size={18} className="text-cyan-500" /> Dimensional Converter
      </h3>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-cyan-200/70 mb-2">Measurement Type</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-cyan-500 transition-colors capitalize"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="space-y-2">
          <input type="number" value={inputValue} onChange={(e) => setInputValue(parseFloat(e.target.value))} className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-xl p-3 text-2xl font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500" />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full bg-transparent border-none text-slate-600 dark:text-cyan-200/70 outline-none font-medium cursor-pointer">
            {unitsList.map(u => <option key={u.abbr} value={u.abbr}>{u.singular} ({u.abbr})</option>)}
          </select>
        </div>
        <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-cyan-900/30 text-indigo-600 dark:text-cyan-400 flex items-center justify-center hover:scale-105 transition-transform mx-auto">
          <Replace size={20} />
        </button>
        <div className="space-y-2">
          <div className="w-full bg-slate-100 dark:bg-cyan-950/20 border border-transparent dark:border-cyan-500/10 rounded-xl p-3 text-2xl font-bold text-indigo-600 dark:text-cyan-400 truncate">
            {typeof result === 'number' ? parseFloat(result.toPrecision(7)) : result}
          </div>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full bg-transparent border-none text-slate-600 dark:text-cyan-200/70 outline-none font-medium cursor-pointer">
            {unitsList.map(u => <option key={u.abbr} value={u.abbr}>{u.singular} ({u.abbr})</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ADVANCED SOLVER (Matrices, Integrals, Calculus)
// ==========================================
const AdvancedSolver = () => {
  const [mode, setMode] = useState('derivative');
  
  // States
  const [expr, setExpr] = useState('3x^2 + 2x - 5');
  const [variable, setVariable] = useState('x');
  const [lowerBound, setLowerBound] = useState('0');
  const [upperBound, setUpperBound] = useState('5');
  
  // Matrix states (2x2 System: Ax = B)
  const [m00, setM00] = useState(2); const [m01, setM01] = useState(1); const [b0, setB0] = useState(5);
  const [m10, setM10] = useState(1); const [m11, setM11] = useState(-1); const [b1, setB1] = useState(1);

  const calculateDerivative = () => {
    try { return `d/d${variable} = ` + math.derivative(expr, variable).toString(); } 
    catch { return 'Error: Invalid expression'; }
  };

  const calculateSimplify = () => {
    try { return math.simplify(expr).toString(); } 
    catch { return 'Error: Invalid expression'; }
  };

  const calculateIntegral = () => {
    try {
      const f = math.compile(expr);
      const a = parseFloat(lowerBound);
      const b = parseFloat(upperBound);
      if (isNaN(a) || isNaN(b)) throw new Error();
      
      const n = 1000;
      const dx = (b - a) / n;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        let x = a + i * dx + dx / 2;
        sum += f.evaluate({ [variable]: x }) * dx;
      }
      return `≈ ${parseFloat(sum.toFixed(6))}`;
    } catch { return 'Error: Ensure expression is valid and bounds are numbers.'; }
  };

  const calculateMatrix = () => {
    try {
      const A = [[parseFloat(m00)||0, parseFloat(m01)||0], [parseFloat(m10)||0, parseFloat(m11)||0]];
      const B = [parseFloat(b0)||0, parseFloat(b1)||0];
      const result = math.lsolve(A, B);
      return `x = ${parseFloat(result[0][0].toFixed(4))}, y = ${parseFloat(result[1][0].toFixed(4))}`;
    } catch { return 'Error: Matrix is singular (no unique solution).'; }
  };

  return (
    <div className="bg-white/5 dark:bg-[#0a0f1c]/50 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 dark:text-cyan-100 flex items-center gap-2">
          <Sigma size={18} className="text-purple-500" /> Advanced Solver
        </h3>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          className="bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-sm outline-none text-slate-800 dark:text-white"
        >
          <option value="derivative">Derivative (d/dx)</option>
          <option value="integral">Definite Integral (∫)</option>
          <option value="simplify">Algebraic Simplify</option>
          <option value="matrix">Linear System (Matrix)</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(mode === 'derivative' || mode === 'simplify') && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Expression f({variable})</label>
              <input type="text" value={expr} onChange={e => setExpr(e.target.value)} className="w-full font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-purple-500" />
            </div>
            {mode === 'derivative' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">With respect to</label>
                <input type="text" value={variable} onChange={e => setVariable(e.target.value)} className="w-20 font-mono text-center bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none" />
              </div>
            )}
          </div>
        )}

        {mode === 'integral' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Function f({variable})</label>
              <input type="text" value={expr} onChange={e => setExpr(e.target.value)} className="w-full font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-purple-500" />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Lower Bound (a)</label>
                <input type="number" value={lowerBound} onChange={e => setLowerBound(e.target.value)} className="w-full font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Upper Bound (b)</label>
                <input type="number" value={upperBound} onChange={e => setUpperBound(e.target.value)} className="w-full font-mono bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-800 dark:text-white outline-none" />
              </div>
            </div>
          </div>
        )}

        {mode === 'matrix' && (
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Solve 2x2 System: Ax + By = C</p>
            <div className="grid grid-cols-[3fr_auto_1fr] items-center gap-3 mb-2">
              <div className="flex gap-2 bg-slate-50 dark:bg-black/30 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <input type="number" value={m00} onChange={e=>setM00(e.target.value)} className="w-full text-center bg-transparent outline-none font-bold text-slate-800 dark:text-white"/> <span className="text-slate-400">x +</span>
                <input type="number" value={m01} onChange={e=>setM01(e.target.value)} className="w-full text-center bg-transparent outline-none font-bold text-slate-800 dark:text-white"/> <span className="text-slate-400">y</span>
              </div>
              <span className="font-bold text-slate-400">=</span>
              <input type="number" value={b0} onChange={e=>setB0(e.target.value)} className="w-full text-center bg-slate-50 dark:bg-black/30 p-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-emerald-500"/>
            </div>
            <div className="grid grid-cols-[3fr_auto_1fr] items-center gap-3">
              <div className="flex gap-2 bg-slate-50 dark:bg-black/30 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <input type="number" value={m10} onChange={e=>setM10(e.target.value)} className="w-full text-center bg-transparent outline-none font-bold text-slate-800 dark:text-white"/> <span className="text-slate-400">x +</span>
                <input type="number" value={m11} onChange={e=>setM11(e.target.value)} className="w-full text-center bg-transparent outline-none font-bold text-slate-800 dark:text-white"/> <span className="text-slate-400">y</span>
              </div>
              <span className="font-bold text-slate-400">=</span>
              <input type="number" value={b1} onChange={e=>setB1(e.target.value)} className="w-full text-center bg-slate-50 dark:bg-black/30 p-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-emerald-500"/>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 bg-slate-100/50 dark:bg-black/20 p-4 rounded-xl">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Solution</p>
        <div className="text-xl font-mono text-purple-600 dark:text-cyan-300 font-bold overflow-x-auto custom-scrollbar pb-2">
          {mode === 'derivative' && calculateDerivative()}
          {mode === 'simplify' && calculateSimplify()}
          {mode === 'integral' && calculateIntegral()}
          {mode === 'matrix' && calculateMatrix()}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. BIOMETRIC CALCULATOR (BMI)
// ==========================================
const BMICalculator = () => {
  const [isMetric, setIsMetric] = useState(true);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);

  const result = useMemo(() => {
    let bmi = 0;
    if (isMetric) {
      const hMeters = height / 100;
      bmi = weight / (hMeters * hMeters);
    } else {
      bmi = (weight / (height * height)) * 703;
    }
    
    let category = ''; let color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400'; }
    else if (bmi >= 18.5 && bmi < 24.9) { category = 'Normal weight'; color = 'text-emerald-500'; }
    else if (bmi >= 25 && bmi < 29.9) { category = 'Overweight'; color = 'text-orange-500'; }
    else { category = 'Obese'; color = 'text-red-500'; }

    return { val: isNaN(bmi) || !isFinite(bmi) ? 0 : bmi, category, color };
  }, [weight, height, isMetric]);

  return (
    <div className="bg-white/5 dark:bg-[#0a0f1c]/50 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 dark:text-cyan-100 flex items-center gap-2">
          <Activity size={18} className="text-rose-500" /> BMI Calculator
        </h3>
        <button onClick={() => setIsMetric(!isMetric)} className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
          {isMetric ? 'Metric (kg/cm)' : 'Imperial (lbs/in)'}
        </button>
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <label className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Weight</span><span className="text-indigo-500">{weight} {isMetric ? 'kg' : 'lbs'}</span>
          </label>
          <input type="range" min={isMetric ? 30 : 60} max={isMetric ? 200 : 400} value={weight} onChange={e => setWeight(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Height</span><span className="text-indigo-500">{height} {isMetric ? 'cm' : 'inches'}</span>
          </label>
          <input type="range" min={isMetric ? 100 : 40} max={isMetric ? 250 : 96} value={height} onChange={e => setHeight(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="text-center p-4 bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1">Body Mass Index</p>
        <p className="text-5xl font-black text-slate-800 dark:text-white mb-2">{result.val.toFixed(1)}</p>
        <p className={`text-lg font-bold ${result.color}`}>{result.category}</p>
      </div>
    </div>
  );
};

// ==========================================
// MAIN HUB COMPONENT
// ==========================================
export default function MathToolsHub() {
  const [activeTab, setActiveTab] = useState('math');
  
  // Lifted state from SmartMathpad so ReferenceGuide can inject into it
  const [mathpadInput, setMathpadInput] = useState(
    "// Welcome to the Smart Mathpad!\n// Type expressions line-by-line.\n\n250 * 15%\nsimplify('2x + 5x - x^2')\n5 cm + 2 inches\n\n// Variables and Matrices are supported!\nmass = 50 kg\naccel = 9.8 m/s^2\nforce = mass * accel\n\n// Matrix Determinant\ndet([[1, 2], [3, 4]])"
  );

  const handleInsertCommand = (cmd) => {
    // Append the command to a new line and switch back to the mathpad
    setMathpadInput(prev => prev + (prev.endsWith('\n') ? '' : '\n') + cmd);
    setActiveTab('math');
  };

  const tabs = [
    { id: 'math', label: 'Math Engine', icon: Calculator },
    { id: 'guide', label: 'Reference Guide', icon: BookOpen },
    { id: 'solver', label: 'Advanced Solver', icon: Sigma },
    { id: 'converter', label: 'Converter', icon: Replace },
    { id: 'health', label: 'Health Tools', icon: Activity },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#050510] text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent inline-block mb-2">
            Scientific Tools Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Integrated calculation environment powered by Math.js</p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 custom-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600 dark:bg-cyan-900/40 text-white dark:text-cyan-300 border border-transparent dark:border-cyan-500/30 shadow-md' 
                    : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {activeTab === 'math' && (
              <div className="h-[600px] w-full">
                <SmartMathpad input={mathpadInput} setInput={setMathpadInput} />
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="h-[600px] w-full">
                <MathReferenceGuide onInsert={handleInsertCommand} />
              </div>
            )}
            
            {activeTab === 'converter' && (
              <div className="max-w-3xl mx-auto">
                <UnitConverter />
              </div>
            )}

            {activeTab === 'solver' && (
              <div className="max-w-2xl mx-auto h-[450px]">
                <AdvancedSolver />
              </div>
            )}

            {activeTab === 'health' && (
              <div className="max-w-lg mx-auto h-[450px]">
                <BMICalculator />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
}
=======
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
>>>>>>> 5fff2847536ea652782bd35e4abe6e044d3c1fc8
