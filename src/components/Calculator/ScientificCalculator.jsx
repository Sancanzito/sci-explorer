// components/Calculator/ScientificCalculator.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';
import convert from 'convert-units';
import { 
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