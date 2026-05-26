import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Observation Activity ---
export const ObservationActivity = () => {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const observations = [
    { text: "The leaf is bright green.", type: "Qualitative" },
    { text: "The beaker contains 50 mL of water.", type: "Quantitative" },
    { text: "The rock feels rough and bumpy.", type: "Qualitative" },
    { text: "The plant grew 3 centimeters this week.", type: "Quantitative" }
  ];

  const handleGuess = (guess) => {
    if (guess === observations[current].type) {
      setFeedback("Correct! 🎉");
      setTimeout(() => {
        setFeedback(null);
        setCurrent((prev) => (prev + 1) % observations.length);
      }, 1500);
    } else {
      setFeedback("Try again! (Hint: Quantitative has numbers/quantities).");
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 text-center">
      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide text-sm">Practice: Identify the Observation</h4>
      
      <div className="bg-white dark:bg-gray-900 h-32 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p 
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-bold text-gray-800 dark:text-white px-4"
          >
            "{observations[current].text}"
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => handleGuess('Qualitative')} className="px-6 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 rounded-xl font-bold transition-colors">
          Qualitative (Quality)
        </button>
        <button onClick={() => handleGuess('Quantitative')} className="px-6 py-3 bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300 rounded-xl font-bold transition-colors">
          Quantitative (Number)
        </button>
      </div>
      
      <div className="h-6 mt-4 font-bold text-sm text-blue-600 dark:text-blue-400">
        {feedback}
      </div>
    </div>
  );
};

// --- 2. Question Sorter ---
export const QuestionSorter = () => {
  const [questions, setQuestions] = useState([
    { id: 1, text: "Are dogs cuter than cats?", status: 'pending', answer: 'Non-Testable' },
    { id: 2, text: "Does fertilizer make grass grow faster?", status: 'pending', answer: 'Testable' },
    { id: 3, text: "Which color is the best?", status: 'pending', answer: 'Non-Testable' },
    { id: 4, text: "At what temperature does salt water freeze?", status: 'pending', answer: 'Testable' }
  ]);

  const categorize = (id, choice) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, status: q.answer === choice ? 'correct' : 'wrong' };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <div key={q.id} className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          q.status === 'pending' ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
          q.status === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : 'bg-red-50 dark:bg-red-900/20 border-red-400'
        }`}>
          <span className="font-medium text-gray-800 dark:text-gray-200">{q.text}</span>
          {q.status === 'pending' ? (
            <div className="flex gap-2 shrink-0">
              <button onClick={() => categorize(q.id, 'Testable')} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-bold">Testable</button>
              <button onClick={() => categorize(q.id, 'Non-Testable')} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold">Non-Testable</button>
            </div>
          ) : (
            <span className={`font-bold text-sm ${q.status === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {q.status === 'correct' ? 'Correct!' : 'Incorrect'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// --- 3. Variable Simulator ---
export const VariableSimulator = () => {
  const [sunlight, setSunlight] = useState(1);

  return (
    <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl border border-blue-900">
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {/* Independent */}
        <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
          <h4 className="text-cyan-400 font-bold mb-2">Independent Variable</h4>
          <p className="text-xs text-gray-400 mb-4">(What YOU change)</p>
          <div className="text-4xl mb-4">{sunlight === 1 ? '⛅' : sunlight === 2 ? '🌤️' : '☀️'}</div>
          <input 
            type="range" min="1" max="3" value={sunlight} 
            onChange={(e) => setSunlight(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <p className="mt-2 text-sm font-medium">Sunlight Level: {sunlight}</p>
        </div>

        {/* Dependent */}
        <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700 flex flex-col items-center justify-end">
          <h4 className="text-purple-400 font-bold mb-2">Dependent Variable</h4>
          <p className="text-xs text-gray-400 mb-4">(What you MEASURE)</p>
          <motion.div 
            animate={{ height: sunlight * 30 + 20 }} 
            className="w-4 bg-green-500 rounded-t-full relative"
          >
            <div className="absolute -top-3 -left-3 text-2xl">🌱</div>
          </motion.div>
          <div className="w-16 h-4 bg-yellow-900 rounded-b-xl mt-1"></div>
          <p className="mt-4 text-sm font-medium">Plant Growth</p>
        </div>

        {/* Controlled */}
        <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
          <h4 className="text-orange-400 font-bold mb-2">Controlled Variables</h4>
          <p className="text-xs text-gray-400 mb-4">(Kept the SAME)</p>
          <div className="flex justify-center gap-4 text-2xl mb-4">
            <span>💧</span>
            <span>🟤</span>
          </div>
          <p className="text-sm font-medium">Water & Soil Amount</p>
        </div>
      </div>
    </div>
  );
};

// --- 4. Measurement Simulator ---
export const MeasurementSimulator = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 bg-blue-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
      <div className="relative w-24 h-48 border-x-4 border-b-4 border-white/40 dark:border-white/20 rounded-b-xl bg-cyan-100/30 dark:bg-cyan-900/20 backdrop-blur-sm">
        {/* Liquid */}
        <div className="absolute bottom-0 w-full h-32 bg-cyan-400/50 dark:bg-cyan-500/50 rounded-b-lg">
          {/* Meniscus Curve */}
          <div className="absolute -top-3 w-full h-6 bg-cyan-300/60 dark:bg-cyan-400/60 rounded-[50%] border-b-2 border-cyan-500/50"></div>
        </div>
        {/* Scale lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute right-0 w-4 border-b-2 border-gray-400" style={{ bottom: `${(i+1)*20}px` }}></div>
        ))}
      </div>
      <div className="flex-1 space-y-4">
        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Reading the Meniscus</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Water curves slightly at the edges of a glass container. Always measure volume from the <strong>bottom</strong> of this curve at eye level for accurate data.
        </p>
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Line: Bottom center of the curve</span>
        </div>
      </div>
    </div>
  );
};

// --- 5. Graph Builder ---
export const GraphBuilder = () => {
  const [data, setData] = useState([20, 45, 30]);

  const addRandomData = () => {
    if (data.length < 6) {
      setData([...data, Math.floor(Math.random() * 80) + 10]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-gray-800 dark:text-gray-200">Interactive Data Chart</h4>
        <button onClick={addRandomData} disabled={data.length >= 6} className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg text-sm font-bold disabled:opacity-50">
          + Add Trial Data
        </button>
      </div>
      
      <div className="h-48 flex items-end gap-2 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 pl-2 pb-2">
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
            <span className="text-xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{val}</span>
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: `${val}%` }} 
              className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm"
            ></motion.div>
            <span className="text-xs font-bold text-gray-500 mt-2">T{idx+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};