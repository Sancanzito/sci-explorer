// pages/QuizzesPage.jsx
import React, { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import MicroscopeGame from '../../quiz/microscope/MicroscopeGame';
import { useTheme } from '../../ThemeProvider';
import { useQuizStore } from './quizstore'; // ✅ Fixed import
import { quizzes, CATEGORIES } from './quizzesdata';

// Lazy Load Three.js Scene
const QuizBackground = React.lazy(() => import('./quizbackground'));

// Lightweight SVG Confetti Alternative
const SvgConfetti = () => (
  <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, y: -50 }} transition={{ duration: 1.5 }} className="absolute pointer-events-none z-50 text-2xl">
    ✨🎉✨
  </motion.div>
);

const QuizzesPage = () => {
  const { isDarkMode } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Zustand Global State
  const { 
    activeQuiz, score, currentQuestion, selectedAnswer, 
    showResult, quizAnswers, startQuiz, submitAnswer, resetQuiz 
  } = useQuizStore();

  const activeQuizData = quizzes.find(q => q.id === activeQuiz);
  const isGameQuiz = activeQuizData?.type === 'game';

  // Filter Logic
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || quiz.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // --- RENDERS: GAME ---
  if (activeQuiz && isGameQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500"
      >
        <button onClick={resetQuiz} className="fixed top-20 left-4 z-50 bg-white/80 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 border border-white/20">
          <span>←</span><span>Back to Quizzes</span>
        </button>
        <MicroscopeGame />
      </motion.div>
    );
  }

  // --- RENDERS: RESULTS ---
  if (showResult && activeQuizData) {
    const totalQuestions = activeQuizData.questionsList.length;
    const maxScore = totalQuestions * 10;
    const correctAnswers = quizAnswers.filter(a => a.isCorrect).length;
    
    return (
      <div className="min-h-screen pt-24 px-6 relative dark:bg-[#020617]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto z-10 relative">
          <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
            <div className={`bg-gradient-to-r ${activeQuizData.color} p-8 text-white relative overflow-hidden`}>
               <h1 className="text-4xl font-black mb-2 relative z-10">Analysis Complete 🎉</h1>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 relative">
                  {/* Score Aura Animation */}
                  <motion.div key={score} initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 rounded-2xl bg-blue-500/20" />
                  <div className="text-4xl font-black text-blue-500">{score}</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2">Total Score</div>
                </div>
                <div className="text-center p-6 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10">
                  <div className="text-4xl font-black text-emerald-500">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2">Correct</div>
                </div>
                <div className="text-center p-6 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10">
                  <div className="text-4xl font-black text-purple-500">{Math.round((score / maxScore) * 100)}%</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2">Accuracy</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {quizAnswers.map((answer, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className={`p-5 rounded-2xl border ${answer.isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}
                  >
                    <p className="font-bold mb-3 text-slate-800 dark:text-white">{answer.question}</p>
                    <p className="text-sm text-slate-500">Your answer: {activeQuizData.questionsList[idx].options[answer.selected]}</p>
                    {!answer.isCorrect && <p className="text-sm text-emerald-500 font-bold mt-1">Correct: {activeQuizData.questionsList[idx].options[answer.correct]}</p>}
                    <p className="text-xs text-slate-400 mt-3 italic">{answer.explanation}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button onClick={resetQuiz} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-xl hover:bg-white/10 transition-colors font-bold text-slate-300">Exit Lab</button>
                <button onClick={() => startQuiz(activeQuiz)} className={`flex-1 bg-gradient-to-r ${activeQuizData.color} text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold`}>Retake Protocol</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDERS: ACTIVE QUIZ QUESTIONS ---
  if (activeQuiz && activeQuizData && !isGameQuiz) {
    const currentQ = activeQuizData.questionsList[currentQuestion];
    
    return (
      <div className="min-h-screen pt-24 px-6 relative dark:bg-[#020617] flex justify-center">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full max-w-3xl z-10">
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden">
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div>
                  <span className={`text-xs font-black uppercase tracking-widest bg-gradient-to-r ${activeQuizData.color} bg-clip-text text-transparent`}>{activeQuizData.title}</span>
                  <p className="text-slate-400 mt-2 font-mono text-sm">Question {currentQuestion + 1} / {activeQuizData.questionsList.length}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{score}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">Score</div>
                </div>
              </div>

              <motion.div key={currentQuestion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">{currentQ.text}</h3>
                
                <div className="space-y-4">
                  {currentQ.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={!selectedAnswer && !shouldReduceMotion ? { scale: 1.01, x: 5 } : {}}
                      whileTap={!selectedAnswer && !shouldReduceMotion ? { scale: 0.98 } : {}}
                      onClick={() => {
                        if (selectedAnswer === null) submitAnswer(idx, idx === currentQ.correct, currentQ, activeQuizData.questionsList.length);
                      }}
                      className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                        selectedAnswer === null
                          ? 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                          : selectedAnswer === idx
                            ? idx === currentQ.correct ? 'border-emerald-500 bg-emerald-500/20' : 'border-rose-500 bg-rose-500/20'
                            : idx === currentQ.correct ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 opacity-50'
                      }`}
                    >
                      {/* CSS Glow Animation upon selection */}
                      {selectedAnswer === idx && idx === currentQ.correct && <SvgConfetti />}

                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-slate-300">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-lg text-slate-800 dark:text-slate-200 font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDERS: QUIZ SELECTION DASHBOARD ---
  return (
    <div className="min-h-screen relative dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      
      {/* 3D Background */}
      <Suspense fallback={null}>
        <QuizBackground />
      </Suspense>

      {/* Radial Gradient overlay for Dark Field Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#020617]/50 to-[#020617] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-lg">
            Knowledge <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Protocols</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-light">Select a discipline to initialize your testing parameters.</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-center bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl max-w-4xl mx-auto">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
            <input
              type="text" placeholder="Query a topic..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-light text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  activeCategory === category 
                  ? 'bg-cyan-500 text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Animated Staggered Grid */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden" animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={!shouldReduceMotion ? { y: -5 } : {}}
              onClick={() => startQuiz(quiz.id)}
              className="group cursor-pointer relative"
            >
              {/* Glassmorphic Card */}
              <div className="h-full bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 relative">
                
                {/* CSS Scan Line Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out pointer-events-none" />

                <div className={`bg-gradient-to-br ${quiz.color} p-6 relative overflow-hidden`}>
                  <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="text-5xl mb-4 drop-shadow-xl">
                    {quiz.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1 relative z-10">{quiz.title}</h3>
                </div>
                
                <div className="p-6 relative">
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{quiz.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {quiz.questions} {quiz.type === 'game' ? 'PARTS' : 'QTS'}
                    </span>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border ${
                      quiz.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                      quiz.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                      quiz.difficulty === 'Hard' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' :
                      'border-purple-500/30 text-purple-400 bg-purple-500/10'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  {/* Tooltip Hover Fact */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-900/95 backdrop-blur-md text-cyan-300 text-xs font-medium translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-b-[2rem]">
                    <span className="font-bold text-white mr-1">Fact:</span> {quiz.fact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizzesPage;