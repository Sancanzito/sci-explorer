import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Atom, Dna, FlaskConical, Telescope, Globe, Zap, 
  ChevronRight, Play, BookOpen, Brain, Star, Sparkles,
  Gamepad2, Library, Microscope, TestTube, Rocket
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'biology', name: 'Biology', icon: Dna, color: 'from-green-400 to-emerald-600', shadow: 'shadow-emerald-500/20', path: '/articles', filter: 'biology' },
  { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'from-pink-400 to-rose-600', shadow: 'shadow-rose-500/20', path: '/simulations', filter: null },
  { id: 'physics', name: 'Physics', icon: Atom, color: 'from-blue-400 to-cyan-600', shadow: 'shadow-cyan-500/20', path: '/articles', filter: 'physics' },
  { id: 'astronomy', name: 'Astronomy', icon: Telescope, color: 'from-purple-400 to-indigo-600', shadow: 'shadow-indigo-500/20', path: '/articles', filter: 'astronomy' },
];

const SIMULATIONS = [
  { 
    id: 'eco-balance', 
    title: 'Eco-Balance Simulator', 
    category: 'Ecology', 
    difficulty: 'Beginner',
    image: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
    path: '/games/eco-balance',
    description: 'Manipulate environmental conditions and observe how species populations respond in this interactive ecosystem simulation.'
  },
  { 
    id: 'dna-extraction', 
    title: 'DNA Extraction Lab', 
    category: 'Molecular Biology', 
    difficulty: 'Intermediate',
    image: 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900',
    path: '/simulations/dna-extraction',
    description: 'Extract DNA from a strawberry in this interactive virtual lab. Learn the steps of DNA extraction.'
  },
  { 
    id: 'microscope', 
    title: 'Microscope Game', 
    category: 'Laboratory', 
    difficulty: 'Beginner',
    image: 'bg-gradient-to-br from-purple-900 via-fuchsia-800 to-rose-900',
    path: '/microscope-game',
    description: 'Learn microscope parts through an interactive drag-and-drop game. Perfect for beginners!'
  }
];

const ARTICLES = [
  { id: 'particle-model-matter', title: 'The Particle Model of Matter', time: '5 min read', category: 'Physics', path: '/articles/particle-model-matter' },
  { id: 'lab-safety', title: 'Mastering Laboratory Safety', time: '8 min read', category: 'Skills', path: '/articles/LaboratorySafety' },
  { id: 'chem-models', title: 'Chemistry Models in the Modern World', time: '6 min read', category: 'Chemistry', path: '/articles/chem-models' },
  { id: 'scientific-skills', title: 'Scientific Investigation Skills', time: '7 min read', category: 'Science', path: '/articles/ScientificSkills' },
];

// --- COMPONENTS ---

// 1. Animated Particle Background
const ParticleBackground = () => {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0.5]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// 2. Interactive "Today's Discovery" Component
const DailyMystery = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md p-8 cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      onClick={() => setRevealed(true)}
      layout
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <Brain size={100} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-400" />
          <h3 className="text-xl font-bold text-white tracking-wider">DAILY SCIENTIFIC MYSTERY</h3>
        </div>
        
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between mt-6"
            >
              <p className="text-indigo-200 text-lg blur-[4px] select-none">
                The human brain generates enough electricity to...
              </p>
              <motion.button 
                className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Decrypt
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <p className="text-2xl font-light text-white leading-relaxed">
                The human brain generates enough electricity to <span className="text-yellow-400 font-bold">power a small lightbulb</span> (about 12-25 watts) while awake!
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-indigo-300 text-sm font-medium px-4 py-1 rounded-full bg-indigo-900/50">
                <Star size={14} className="text-yellow-400"/> +50 XP Discovered
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// --- MAIN HOMEPAGE EXPORT ---
export default function HomePage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Container variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleNavigation = (path, filter = null) => {
    if (filter) {
      navigate(`${path}?category=${filter}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        <ParticleBackground />
      </div>

      {/* Main Content Scrollable Area */}
      <div className="relative z-10">
        
        {/* GAMIFICATION HEADER */}
        <div className="absolute top-6 right-6 md:top-8 md:right-12 flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
            <Star size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Level 4 Scientist</span>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* 1. HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(67, 56, 202, 0.4)" }}
            >
              <Zap size={16} className="text-cyan-400" />
              <span>Welcome to the Digital Laboratory</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              Explore Science <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                Beyond Textbooks.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-12">
              Interactive simulations, real experiments, and deep-dive articles. Step into the future of learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(56, 189, 248, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/simulations')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <Play fill="currentColor" size={20} />
                Launch Simulator
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/articles')}
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg flex items-center gap-3 backdrop-blur-md w-full sm:w-auto justify-center hover:text-cyan-400 transition-colors"
              >
                <BookOpen size={20} />
                Browse Articles
              </motion.button>
            </div>
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32 space-y-32">
          
          {/* 2. CATEGORIES GRID */}
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Rocket className="text-cyan-400" /> Explore by Subject
              </h2>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Browse All Articles <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {CATEGORIES.map((cat) => (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    rotateX: -10,
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" 
                  }}
                  onClick={() => handleNavigation(cat.path, cat.filter)}
                  className={`relative overflow-hidden group cursor-pointer p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm ${cat.shadow} hover:border-white/20 transition-all duration-300 perspective-1000`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <cat.icon size={48} className="mb-4 text-white/70 group-hover:text-white transition-colors drop-shadow-md" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold tracking-wide">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {cat.filter ? 'View related articles →' : 'Launch simulations →'}
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <ChevronRight className="text-white/50" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 3. FEATURED SIMULATIONS */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Gamepad2 className="text-blue-500" /> Virtual Labs
              </h2>
              <button 
                onClick={() => handleNavigation('/simulations')}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SIMULATIONS.map((sim, i) => (
                <motion.div
                  key={sim.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  onClick={() => handleNavigation(sim.path)}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer shadow-2xl"
                >
                  <div className={`h-48 w-full ${sim.image} relative overflow-hidden`}>
                    <motion.div 
                      className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" 
                    />
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <Play fill="white" className="ml-1" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6 relative z-10 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 group-hover:bg-slate-800/90 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{sim.category}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-slate-300">{sim.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{sim.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{sim.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 4. INTERACTIVE DISCOVERY */}
          <section>
            <DailyMystery />
          </section>

          {/* 5. TRENDING ARTICLES */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Library className="text-purple-500" /> Research & Theory
              </h2>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Browse Library <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {ARTICLES.map((article, i) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                  onClick={() => handleNavigation(article.path)}
                  className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 block">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white mb-4 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-6 pt-4 border-t border-white/5 group-hover:border-purple-500/20">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} /> {article.time}
                    </span>
                    <ChevronRight size={16} className="group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 6. QUICK LINKS TO QUIZZES */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-3xl p-8 border border-indigo-500/20 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <TestTube size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Test Your Knowledge!</h3>
                    <p className="text-slate-400">Challenge yourself with interactive quizzes and games</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/quizzes')}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Gamepad2 size={20} />
                  Explore Quizzes
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.section>
          
        </div>
        
        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center justify-center gap-6 text-slate-400 font-medium">
              <button onClick={() => handleNavigation('/simulations')} className="hover:text-cyan-400 transition-colors">Simulations</button>
              <button onClick={() => handleNavigation('/articles')} className="hover:text-cyan-400 transition-colors">Articles</button>
              <button onClick={() => handleNavigation('/quizzes')} className="hover:text-cyan-400 transition-colors">Quizzes</button>
              <button onClick={() => handleNavigation('/tools/periodic-table')} className="hover:text-cyan-400 transition-colors">Periodic Table</button>
              <button onClick={() => handleNavigation('/tools/calculator')} className="hover:text-cyan-400 transition-colors">Calculator</button>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Atom className="animate-spin-slow text-indigo-500" size={20} style={{ animationDuration: '4s' }}/>
              <span>Science Learning Platform © 2026</span>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}