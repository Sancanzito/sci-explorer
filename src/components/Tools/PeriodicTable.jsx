import React, { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Grid, List, Keyboard, Beaker, Lightbulb, GraduationCap, Target, ShieldAlert, Award, PlayCircle, ExternalLink, BookOpen, Quote } from 'lucide-react';

// ==========================================
// 1. MINI-ZUSTAND IMPLEMENTATION (Scalable Store)
// ==========================================
// Solves the Context re-render issue using native React 18 APIs.
const createStore = (createState) => {
  let state;
  const listeners = new Set();
  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener());
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  state = createState(setState, getState);
  return (selector = (s) => s) => useSyncExternalStore(subscribe, () => selector(getState()));
};

// ==========================================
// 2. ELITE EDUCATIONAL UTILS & ENRICHMENT
// ==========================================

const getValenceElectrons = (group) => {
  if (!group) return "N/A";
  if (group <= 2) return group;
  if (group >= 13 && group <= 18) return group - 10;
  return "Variable"; // Transition metals
};

const getReactivityLevel = (el) => {
  const cat = el.category?.toLowerCase() || '';
  if (cat.includes('noble gas')) return { level: 5, label: "Inert", color: "bg-gray-300 dark:bg-gray-600", bar: "w-[5%]" };
  if (el.group === 1 || el.group === 17) return { level: 95, label: "Very High", color: "bg-red-500", bar: "w-[95%]" };
  if (el.group === 2 || el.group === 16) return { level: 75, label: "High", color: "bg-orange-500", bar: "w-[75%]" };
  if (cat.includes('transition metal')) return { level: 40, label: "Medium/Low", color: "bg-blue-400", bar: "w-[40%]" };
  return { level: 50, label: "Moderate", color: "bg-yellow-400", bar: "w-[50%]" };
};

const getConceptChain = (el) => [
  `Configuration: ${el.electronConfig}`,
  `Valence (${getValenceElectrons(el.group)}) shapes bonding`,
  `Group ${el.group} heavily dictates its reactivity`,
  `Current phase (${el.phase}) is due to intermolecular forces`
];

const getBehaviorExplanation = (el) => {
  const valence = getValenceElectrons(el.group);
  if (el.group === 18) return `With a full valence shell (octet), ${el.name} is incredibly stable and rarely forms bonds.`;
  if (el.group === 1) return `Having exactly 1 valence electron, ${el.name} is desperate to lose it to achieve stability, making it highly reactive.`;
  if (el.group === 17) return `With ${valence} valence electrons, ${el.name} aggressively seeks 1 more electron to complete its octet.`;
  if (el.category?.includes("transition")) return `${el.name} has partially filled d-orbitals, allowing it to easily share electrons and form complex metallic bonds or colorful compounds.`;
  return `${el.name} balances gaining, losing, or sharing its ${valence} outer electrons depending on what it interacts with.`;
};

const QUIZ_BANK = [
  { q: "Which element is a noble gas often used in balloons?", a: "He" },
  { q: "Which element is the foundation of all known organic life?", a: "C" },
  { q: "Find the highly reactive alkali metal commonly found in table salt.", a: "Na" },
  { q: "Which transition metal forms the core of the Earth and our blood?", a: "Fe" },
  { q: "Find the halogen that is liquid at room temperature.", a: "Br" },
  { q: "Which element has an atomic number of 1?", a: "H" },
  { q: "Find the element known for its use in semiconductor microchips.", a: "Si" }
];

const enrichElement = (el) => ({
  ...el,
  isMetal: el.category?.toLowerCase().includes("metal"),
  valenceElectrons: getValenceElectrons(el.group),
  reactivity: getReactivityLevel(el),
  conceptChain: getConceptChain(el),
  behaviorExplanation: getBehaviorExplanation(el),
  // Memoize positioning to prevent massive reflows during mapping
  gridStyle: { gridColumn: el.group, gridRow: el.period }
});

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

// Semantic Search Expansion
const semanticSearchMatch = (el, query) => {
  const q = query.toLowerCase();
  if (q.includes('metal') && !q.includes('nonmetal') && el.isMetal) return true;
  if (q.includes('gas') && el.phase?.toLowerCase() === 'gas') return true;
  if (q.includes('solid') && el.phase?.toLowerCase() === 'solid') return true;
  if (q.includes('liquid') && el.phase?.toLowerCase() === 'liquid') return true;
  if (q.includes('reactive') && el.reactivity.level >= 75) return true;
  if (q.includes('inert') && el.reactivity.level <= 10) return true;
  return (
    el.name?.toLowerCase().includes(q) ||
    el.symbol?.toLowerCase().includes(q) ||
    el.atomicNumber?.toString() === q
  );
};

// ==========================================
// 3. GLOBAL STORE SETUP
// ==========================================

const useAppStore = createStore((set) => ({
  // Data State
  elements: [],
  loading: true,
  error: null,
  
  // UI State
  searchQuery: '',
  filterCategory: 'all',
  viewMode: 'grid',
  appMode: 'explore', // 'explore' | 'study' | 'quiz'
  selectedElement: null,
  focusedIndex: 0,

  // Quiz State
  quizState: {
    questionIndex: 0,
    score: 0,
    feedback: null, // 'correct' | 'incorrect' | null
    isFinished: false
  },
  
  // Modals
  showCreatorModal: false,

  // Actions
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterCategory: (c) => set({ filterCategory: c }),
  setViewMode: (v) => set({ viewMode: v }),
  setAppMode: (m) => set({ appMode: m }),
  setSelectedElement: (el) => set({ selectedElement: el }),
  setFocusedIndex: (i) => set({ focusedIndex: i }),
  setShowCreatorModal: (val) => set({ showCreatorModal: val }),
  
  // Async Data Fetch
  fetchElements: async () => {
    set({ loading: true });
    try {
      const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      
      const mappedElements = data.elements.map(el => ({
        atomicNumber: el.number, symbol: el.symbol, name: el.name, category: el.category,
        period: el.ypos, group: el.xpos, atomicMass: el.atomic_mass, electronConfig: el.electron_configuration,
        meltingPoint: el.melt ? (el.melt - 273.15).toFixed(2) : null,
        boilingPoint: el.boil ? (el.boil - 273.15).toFixed(2) : null,
        density: el.density, electronegativity: el.electronegativity_pauling, phase: el.phase,
        summary: el.summary, shells: el.shells || [], source: el.source
      }));
      set({ elements: mappedElements.map(enrichElement), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Quiz Actions
  startQuiz: () => set({ 
    appMode: 'quiz', 
    quizState: { questionIndex: 0, score: 0, feedback: null, isFinished: false },
    searchQuery: '', filterCategory: 'all' 
  }),
  submitQuizAnswer: (symbol) => set((state) => {
    const currentQ = QUIZ_BANK[state.quizState.questionIndex];
    const isCorrect = currentQ.a === symbol;
    
    if (isCorrect) {
      const nextIdx = state.quizState.questionIndex + 1;
      const finished = nextIdx >= QUIZ_BANK.length;
      return {
        quizState: {
          ...state.quizState,
          score: state.quizState.score + 1,
          feedback: 'correct',
          questionIndex: finished ? state.quizState.questionIndex : nextIdx,
          isFinished: finished
        }
      };
    } else {
      return { quizState: { ...state.quizState, feedback: 'incorrect' } };
    }
  }),
  clearQuizFeedback: () => set((state) => ({ quizState: { ...state.quizState, feedback: null } }))
}));

// Derived Selectors (Mimicking Zustand's behavior for optimization)
const useFilteredElements = () => {
  const elements = useAppStore(s => s.elements);
  const searchQuery = useAppStore(s => s.searchQuery);
  const filterCategory = useAppStore(s => s.filterCategory);

  // Simple local debounce for rendering performance
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return useMemo(() => {
    let filtered = elements;
    if (debouncedSearch) {
      filtered = filtered.filter(el => semanticSearchMatch(el, debouncedSearch));
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(el => el.category === filterCategory);
    }
    return filtered;
  }, [elements, debouncedSearch, filterCategory]);
};

// ==========================================
// 4. UI COMPONENTS
// ==========================================

const AnimatedElementCard = React.memo(({ element, onClick, isFocused, onKeyDown, appMode }) => {
  const isStudy = appMode === 'study';
  const isQuiz = appMode === 'quiz';

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileFocus={{ scale: 1.05, zIndex: 10 }}
      onClick={() => onClick(element)}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      style={element.gridStyle}
      className={`relative cursor-pointer rounded-md p-1 sm:p-2 text-center transition-all shadow-sm border-2 focus:outline-none group ${getCategoryColor(element.category)} ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 z-10' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="text-[10px] opacity-70 leading-none font-semibold">{element.atomicNumber}</div>
        {isStudy && (
          <div className="text-[8px] opacity-70 leading-none font-mono" title="Valence Electrons">
            v:{element.valenceElectrons}
          </div>
        )}
      </div>
      <div className="text-lg font-bold font-mono my-0.5">{element.symbol}</div>
      <div className="text-[9px] truncate hidden sm:block opacity-90">{element.name}</div>
      
      {/* Educational Scaffolding Hover Overlay */}
      {isStudy && (
        <div className="absolute hidden group-hover:flex inset-x-0 -bottom-8 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded p-1 flex-col z-20 text-[8px] text-left">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-gray-500">React:</span>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${element.reactivity.color} ${element.reactivity.bar}`} />
            </div>
          </div>
          <span className="text-gray-700 dark:text-gray-300 truncate">{element.reactivity.label}</span>
        </div>
      )}

      {isQuiz && (
        <div className="absolute inset-0 bg-white/0 hover:bg-blue-500/20 rounded-md transition-colors" />
      )}
    </motion.div>
  );
});
AnimatedElementCard.displayName = 'AnimatedElementCard';

const ElementModal = () => {
  const selectedElement = useAppStore(s => s.selectedElement);
  const setSelectedElement = useAppStore(s => s.setSelectedElement);
  const appMode = useAppStore(s => s.appMode);
  const isOpen = !!selectedElement;
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) modalRef.current.focus();
    const handleEscape = (e) => e.key === 'Escape' && setSelectedElement(null);
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, setSelectedElement]);

  if (!isOpen || !selectedElement) return null;
  const element = selectedElement;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setSelectedElement(null)}
      >
        <motion.div 
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col lg:flex-row"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        >
          <button onClick={() => setSelectedElement(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 z-10">
            <X size={20} />
          </button>

          {/* Left Column: Stats & Data */}
          <div className="p-6 sm:p-8 flex-1 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-6 mb-6">
              <div className={`w-24 h-24 shrink-0 rounded-2xl border-4 flex items-center justify-center flex-col shadow-sm ${getCategoryColor(element.category)}`}>
                <span className="text-sm font-semibold opacity-70">{element.atomicNumber}</span>
                <span className="text-4xl font-bold font-mono">{element.symbol}</span>
              </div>
              <div className="flex-1 pt-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{element.name}</h2>
                <p className="text-md capitalize text-gray-500 dark:text-gray-400 font-medium mt-1">
                  {element.category}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl mb-6">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="text-gray-500">Atomic Mass</span>
                <span className="font-medium text-gray-900 dark:text-white">{element.atomicMass} u</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="text-gray-500">Phase</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{element.phase || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="text-gray-500">Density</span>
                <span className="font-medium text-gray-900 dark:text-white">{element.density ? `${element.density}` : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                <span className="text-gray-500">Valence</span>
                <span className="font-medium text-gray-900 dark:text-white">{element.valenceElectrons}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Scientific Summary</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{element.summary}</p>
              
              {/* Wikipedia Link Button */}
              <a 
                href={element.source || `https://en.wikipedia.org/wiki/${element.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink size={16} />
                Search more on Wikipedia
              </a>
            </div>
          </div>

          {/* Right Column: Active Learning / Study Mode Focus */}
          <div className="p-6 sm:p-8 flex-1 bg-gray-50 dark:bg-gray-800/30 flex flex-col">
            
            {appMode === 'study' ? (
              <div className="space-y-6 flex-1">
                {/* Visual Reactivity Meter */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldAlert size={14}/> Reactivity Profile
                  </h3>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-gray-700 dark:text-gray-300">{element.reactivity.label}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: element.reactivity.bar.replace('w-[', '').replace(']', '') }} 
                        className={`h-full ${element.reactivity.color}`} 
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                      {element.behaviorExplanation}
                    </p>
                  </div>
                </div>

                {/* Concept Scaffolding */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lightbulb size={14}/> Concept Chain
                  </h3>
                  <div className="space-y-2">
                    {element.conceptChain.map((concept, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="flex gap-3 items-start bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm shadow-sm"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{concept}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Beaker size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Switch to Study Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Enable Study Mode to unlock reactivity profiles, concept chains, and behavioral explanations for {element.name}.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const QuizTopBar = () => {
  const quizState = useAppStore(s => s.quizState);
  const clearQuizFeedback = useAppStore(s => s.clearQuizFeedback);
  const setAppMode = useAppStore(s => s.setAppMode);

  const currentQ = QUIZ_BANK[quizState.questionIndex];

  useEffect(() => {
    if (quizState.feedback) {
      const t = setTimeout(clearQuizFeedback, 1500);
      return () => clearTimeout(t);
    }
  }, [quizState.feedback, clearQuizFeedback]);

  if (quizState.isFinished) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 p-6 rounded-2xl mb-6 text-center shadow-lg">
        <Award size={48} className="mx-auto text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Quiz Complete!</h2>
        <p className="text-emerald-700 dark:text-emerald-400 mb-4 font-medium">You scored {quizState.score} out of {QUIZ_BANK.length}</p>
        <button 
          onClick={() => setAppMode('explore')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium transition"
        >
          Return to Explorer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-white/20 px-4 py-1 rounded-bl-xl font-mono text-sm font-bold backdrop-blur-sm">
        Score: {quizState.score} / {QUIZ_BANK.length}
      </div>
      
      <div className="flex items-center gap-3 mb-2 opacity-80 text-sm font-medium">
        <Target size={16} /> Question {quizState.questionIndex + 1}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold leading-tight max-w-3xl">
        {currentQ.q}
      </h2>
      <p className="mt-3 text-blue-100 text-sm">
        Click the correct element on the periodic table below to answer.
      </p>

      <AnimatePresence>
        {quizState.feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg font-bold shadow-lg ${quizState.feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {quizState.feedback === 'correct' ? 'Correct! 🎉' : 'Try Again! ❌'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 5. MAIN LAYOUT & CONTROLS
// ==========================================

const CreatorModal = () => {
  const showCreatorModal = useAppStore(s => s.showCreatorModal);
  const setShowCreatorModal = useAppStore(s => s.setShowCreatorModal);
  const modalRef = useRef(null);

  useEffect(() => {
    if (showCreatorModal && modalRef.current) modalRef.current.focus();
    const handleEscape = (e) => e.key === 'Escape' && setShowCreatorModal(false);
    if (showCreatorModal) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showCreatorModal, setShowCreatorModal]);

  if (!showCreatorModal) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setShowCreatorModal(false)}
      >
        <motion.div 
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        >
          <button onClick={() => setShowCreatorModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800 transition text-white md:text-gray-500 z-10 bg-black/20 md:bg-transparent">
            <X size={20} />
          </button>

          {/* Image Side */}
          <div className="w-full md:w-2/5 bg-gray-200 dark:bg-gray-800 relative h-64 md:h-auto shrink-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Dmitri_Mendeleev.jpg/800px-Dmitri_Mendeleev.jpg" 
              alt="Dmitri Mendeleev" 
              className="w-full h-full object-cover object-top mix-blend-multiply dark:mix-blend-luminosity opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-900/50 flex flex-col justify-end p-6 md:p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight">Dmitri<br/>Mendeleev</h2>
              <p className="text-gray-300 text-sm font-medium mt-2">1834 – 1907</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-white dark:bg-gray-900">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen size={16} /> The Father of the Periodic Table
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                Dmitri Mendeleev was a Russian chemist and inventor who published the first widely recognized periodic table in 1869. He organized the known elements by atomic mass and observed that their chemical properties repeated in a predictable, "periodic" pattern.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-6 border border-blue-100 dark:border-blue-800/50">
              <Quote className="text-blue-400 dark:text-blue-500 mb-2 opacity-50" size={24} />
              <p className="italic text-gray-800 dark:text-gray-200 text-sm">
                "I saw in a dream a table where all the elements fell into place as required. Awakening, I immediately wrote it down on a piece of paper."
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Key Achievements</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p><strong>Predictive Power:</strong> He left intentional gaps in his table for elements that hadn't been discovered yet (like Gallium and Germanium) and accurately predicted their properties years before they were found.</p>
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p><strong>Correcting Atomic Weights:</strong> He dared to change the accepted atomic weights of some elements (like Beryllium) because they didn't fit the periodic trends, which later proved to be correct.</p>
                </li>
              </ul>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Header = () => {
  const appMode = useAppStore(s => s.appMode);
  const setAppMode = useAppStore(s => s.setAppMode);
  const startQuiz = useAppStore(s => s.startQuiz);
  const setShowCreatorModal = useAppStore(s => s.setShowCreatorModal);

  return (
    <header className="mb-8 relative flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-3">
          <Beaker className="text-blue-600 dark:text-blue-400" /> Elements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2 flex-wrap">
          Interactive Chemistry Learning System
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
          <button 
            onClick={() => setShowCreatorModal(true)}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md"
          >
            <BookOpen size={14} /> History of the Table
          </button>
        </p>
      </div>

      <div className="flex bg-gray-200 dark:bg-gray-800 p-1.5 rounded-xl shadow-inner border border-gray-300 dark:border-gray-700">
        <button 
          onClick={() => setAppMode('explore')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${appMode === 'explore' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Explore
        </button>
        <button 
          onClick={() => setAppMode('study')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${appMode === 'study' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <GraduationCap size={16} /> Study
        </button>
        <button 
          onClick={startQuiz}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${appMode === 'quiz' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <PlayCircle size={16} /> Quiz Mode
        </button>
      </div>
    </header>
  );
};

const TopBar = () => {
  const searchQuery = useAppStore(s => s.searchQuery);
  const setSearchQuery = useAppStore(s => s.setSearchQuery);
  const filterCategory = useAppStore(s => s.filterCategory);
  const setFilterCategory = useAppStore(s => s.setFilterCategory);
  const viewMode = useAppStore(s => s.viewMode);
  const setViewMode = useAppStore(s => s.setViewMode);
  const appMode = useAppStore(s => s.appMode);
  
  const elements = useAppStore(s => s.elements);
  const categories = useMemo(() => {
    const cats = new Set(elements.map(el => el.category || 'Other'));
    return ['all', ...Array.from(cats).sort()];
  }, [elements]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && appMode !== 'quiz') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode]);

  // Hide TopBar in Quiz Mode to maintain focus
  if (appMode === 'quiz') return <QuizTopBar />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-auto flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder='Try "reactive", "gas", or "metal"...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm font-medium"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
          <Keyboard size={10} /> /
        </div>
      </div>
      
      <div className="flex gap-3 w-full md:w-auto">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm capitalize appearance-none font-medium text-gray-700 dark:text-gray-300"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shrink-0 border border-gray-200 dark:border-gray-700">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>
            <Grid size={18} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PeriodicTableLayout = () => {
  const filteredElements = useFilteredElements();
  const viewMode = useAppStore(s => s.viewMode);
  const focusedIndex = useAppStore(s => s.focusedIndex);
  const setFocusedIndex = useAppStore(s => s.setFocusedIndex);
  const setSelectedElement = useAppStore(s => s.setSelectedElement);
  const appMode = useAppStore(s => s.appMode);
  const submitQuizAnswer = useAppStore(s => s.submitQuizAnswer);

  const handleElementClick = useCallback((element) => {
    if (appMode === 'quiz') {
      submitQuizAnswer(element.symbol);
    } else {
      setSelectedElement(element);
    }
  }, [appMode, submitQuizAnswer, setSelectedElement]);

  const handleKeyNavigation = useCallback((e) => {
    if (viewMode !== 'grid') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    const columns = 18;
    let newIndex = focusedIndex;
    
    switch (e.key) {
      case 'ArrowRight': newIndex = Math.min(focusedIndex + 1, filteredElements.length - 1); break;
      case 'ArrowLeft': newIndex = Math.max(focusedIndex - 1, 0); break;
      case 'ArrowDown': newIndex = Math.min(focusedIndex + columns, filteredElements.length - 1); break;
      case 'ArrowUp': newIndex = Math.max(focusedIndex - columns, 0); break;
      case 'Enter':
      case ' ':
        if (filteredElements[focusedIndex]) handleElementClick(filteredElements[focusedIndex]);
        e.preventDefault();
        break;
      default: return;
    }
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      e.preventDefault();
    }
  }, [focusedIndex, filteredElements, viewMode, handleElementClick, setFocusedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  if (filteredElements.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <Search size={48} className="mx-auto mb-4 opacity-20" />
        <p className="font-medium">No elements match your criteria.</p>
      </div>
    );
  }

  if (viewMode === 'list' && appMode !== 'quiz') {
    return (
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Z</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredElements.map((el) => (
              <tr key={el.atomicNumber} onClick={() => handleElementClick(el)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{el.atomicNumber}</td>
                <td className="px-4 py-3 text-sm font-bold font-mono text-gray-900 dark:text-gray-100">{el.symbol}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{el.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(el.category)}`}>{el.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto pb-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all ${appMode === 'quiz' ? 'ring-4 ring-indigo-500/20' : ''}`}>
      <div className="grid gap-1.5 p-4 min-w-[1000px] xl:min-w-0" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
        {filteredElements.map((element, idx) => (
          <AnimatedElementCard
            key={element.atomicNumber}
            element={element}
            appMode={appMode}
            onClick={handleElementClick}
            isFocused={idx === focusedIndex}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleElementClick(element);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const loading = useAppStore(s => s.loading);
  const error = useAppStore(s => s.error);
  const fetchElements = useAppStore(s => s.fetchElements);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-blue-600">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
      <span className="font-semibold tracking-wide">Initializing EdTech Environment...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <TopBar />
        {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg mb-4 text-center text-sm font-bold shadow">Failed to load live data. Displaying limited dataset.</div>}
        <PeriodicTableLayout />
        <ElementModal />
        <CreatorModal />
      </div>
    </div>
  );
}