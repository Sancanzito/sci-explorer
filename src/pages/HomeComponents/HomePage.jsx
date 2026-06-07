import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import confetti from 'canvas-confetti';
import { 
  Atom, Dna, FlaskConical, Telescope, Globe, Zap, 
  ChevronRight, Play, BookOpen, Brain, Star, Sparkles,
  Gamepad2, Library, Microscope, TestTube, Rocket,
  ShieldAlert, GraduationCap, Lightbulb, Users, AlertTriangle
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

// --- 3D BACKGROUND COMPONENT ---
const ScientificScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating Atom */}
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <group position={[-5, 2, -10]}>
          <mesh><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, 0.05, 16, 100]} /><meshStandardMaterial color="#3b82f6" /></mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[1.5, 0.05, 16, 100]} /><meshStandardMaterial color="#3b82f6" /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[1.5, 0.05, 16, 100]} /><meshStandardMaterial color="#3b82f6" /></mesh>
        </group>
      </Float>

      {/* Floating Planet with Ring */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <group position={[6, -3, -8]} rotation={[0.2, 0.4, 0]}>
          <mesh><sphereGeometry args={[1.8, 32, 32]} /><meshStandardMaterial color="#8b5cf6" wireframe /></mesh>
          <mesh rotation={[Math.PI / 2.2, 0, 0]}><torusGeometry args={[2.8, 0.1, 16, 100]} /><meshStandardMaterial color="#c084fc" /></mesh>
        </group>
      </Float>

      {/* Abstract DNA/Helix shape */}
      <Float speed={2.5} rotationIntensity={3} floatIntensity={2}>
        <mesh position={[4, 5, -12]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.5, 0.5, 4, 8, 1, true]} />
          <meshStandardMaterial color="#10b981" wireframe />
        </mesh>
      </Float>
    </>
  );
};

// --- INTERACTIVE COMPONENTS ---
const DailyMystery = () => {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    // Fire confetti from package.json dependencies!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#3b82f6', '#8b5cf6']
    });
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-xl p-8 md:p-12 cursor-pointer group shadow-2xl"
      whileHover={{ scale: 1.01 }}
      onClick={!revealed ? handleReveal : undefined}
      layout
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Brain size={160} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-400" size={24} />
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider">DAILY SCIENTIFIC MYSTERY</h3>
        </div>
        
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-6"
            >
              <p className="text-indigo-200 text-xl blur-[5px] select-none">
                The human brain generates enough electricity to...
              </p>
              <motion.button 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 whitespace-nowrap"
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
              className="mt-6"
            >
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed">
                The human brain generates enough electricity to <span className="text-yellow-400 font-bold">power a small lightbulb</span> (about 12-25 watts) while awake!
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-indigo-200 text-sm font-bold px-6 py-2 rounded-full bg-indigo-900/50 border border-indigo-500/30">
                <Star size={16} className="text-yellow-400"/> +50 XP Discovered
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

  // Container variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden font-sans relative">
      
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ScientificScene />
        </Canvas>
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#020617]/80 to-[#020617] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Main Content Scrollable Area */}
      <div className="relative z-10">
        
        {/* GAMIFICATION HEADER */}
        <div className="absolute top-6 right-6 md:top-8 md:right-12 flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-full shadow-2xl z-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Star size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Level 4 Scientist</span>
            <div className="w-28 h-2 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* 1. HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl backdrop-blur-md bg-black/20 p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-sm font-bold mb-8 uppercase tracking-wide"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.15)" }}
            >
              <Zap size={16} className="text-cyan-400" />
              <span>Welcome to Our Digital Laboratory</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
              Explore Science <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                Beyond Textbooks.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Interactive simulations, real experiments, and deep-dive articles. We support technology literacy through hands-on learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/simulations')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg"
              >
                <Rocket size={22} />
                Launch Labs
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/articles')}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg flex items-center gap-3 backdrop-blur-xl w-full sm:w-auto justify-center hover:text-cyan-400 transition-colors"
              >
                <BookOpen size={22} />
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <Atom className="text-cyan-400" size={36} /> Explore by Subject
                </h2>
                <p className="text-slate-400">Dive into our specialized learning modules.</p>
              </div>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                Browse All Subjects <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" 
                  }}
                  onClick={() => handleNavigation(cat.path, cat.filter)}
                  className={`relative overflow-hidden group cursor-pointer p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md ${cat.shadow} hover:border-white/20 transition-all duration-300`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <cat.icon size={56} className="mb-6 text-white/70 group-hover:text-white transition-colors drop-shadow-md" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold tracking-wide mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-400">
                    {cat.filter ? 'View related articles' : 'Launch simulations'}
                  </p>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <ChevronRight className="text-white" size={24} />
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <Gamepad2 className="text-blue-500" size={36} /> Virtual Labs
                </h2>
                <p className="text-slate-400">Hands-on practice in a safe digital environment.</p>
              </div>
              <button 
                onClick={() => handleNavigation('/simulations')}
                className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View All Labs <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SIMULATIONS.map((sim) => (
                <motion.div
                  key={sim.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  onClick={() => handleNavigation(sim.path)}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 cursor-pointer shadow-2xl backdrop-blur-sm"
                >
                  <div className={`h-52 w-full ${sim.image} relative overflow-hidden`}>
                    <motion.div 
                      className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" 
                    />
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                        <Play fill="white" className="ml-1" size={24} />
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-8 relative z-10 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 group-hover:bg-slate-800/90 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-cyan-400">{sim.category}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300">{sim.difficulty}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">{sim.title}</h3>
                    <p className="text-slate-400 line-clamp-2 leading-relaxed">{sim.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 4. INTERACTIVE DISCOVERY */}
          <section>
            <DailyMystery />
          </section>

          {/* 5. RESEARCH & THEORY (Articles) */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <Library className="text-purple-500" size={36} /> Research & Theory
                </h2>
                <p className="text-slate-400">Deep dive into the concepts that power our world.</p>
              </div>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                Browse Library <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ARTICLES.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)", y: -5 }}
                  onClick={() => handleNavigation(article.path)}
                  className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-lg backdrop-blur-sm"
                >
                  <div>
                    <span className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4 block">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-white mb-4 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-8 pt-6 border-t border-white/10 group-hover:border-purple-500/30">
                    <span className="flex items-center gap-2 font-medium">
                      <BookOpen size={16} /> {article.time}
                    </span>
                    <ChevronRight size={20} className="group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 6. WHY WE BUILT THIS */}
          <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Why We Built This Platform</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Every resource aims to make learning more accessible, engaging, and practical across science, mathematics, and research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "Free Access", desc: "Provide free educational resources for all learners regardless of location." },
                { icon: Users, title: "Teacher Support", desc: "Support teachers with high-quality, classroom-ready materials." },
                { icon: Telescope, title: "Exploration", desc: "Help students learn through active exploration and practice." },
                { icon: Atom, title: "Digital Literacy", desc: "Promote digital and technological literacy through interactive tools." },
                { icon: Lightbulb, title: "Critical Thinking", desc: "Encourage curiosity, problem-solving, and deep scientific inquiry." },
                { icon: GraduationCap, title: "Growth", desc: "Learn. Explore. Practice. Grow." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                    <item.icon size={28} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 7. QUICK LINKS TO QUIZZES */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-[3rem] p-8 md:p-12 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <TestTube size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2 text-white">Test Your Knowledge!</h3>
                    <p className="text-indigo-200 text-lg">Challenge yourself with interactive quizzes and games.</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/quizzes')}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-lg flex items-center gap-3 shadow-xl hover:shadow-orange-500/40 transition-all w-full md:w-auto justify-center whitespace-nowrap"
                >
                  <Gamepad2 size={24} />
                  Explore Quizzes
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* 8. IMPORTANT NOTICES */}
          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/20 backdrop-blur-xl p-8 md:p-10"
            >
              <div className="absolute top-1/2 -translate-y-1/2 right-0 p-8 opacity-5"><AlertTriangle size={160} /></div>
              <div className="relative z-10 max-w-4xl">
                <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3 mb-4"><ShieldAlert /> Important Notice</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  The simulations on this platform support learning and concept exploration. They represent simplified models of real systems and conditions. Results from simulations do not always match real-world outcomes.
                </p>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Use these tools as learning aids. Combine simulation results with classroom instruction, laboratory work, research, and professional guidance.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-500/20 backdrop-blur-xl p-8 md:p-10"
            >
              <div className="absolute top-1/2 -translate-y-1/2 right-0 p-8 opacity-5"><Telescope size={160} /></div>
              <div className="relative z-10 max-w-4xl">
                <h3 className="text-2xl font-bold text-indigo-400 flex items-center gap-3 mb-4"><Users /> Acknowledgment</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  This platform benefits from the work of educators, researchers, developers, and open-source contributors from around the world. Some simulations originate from open-source libraries, including respected organizations such as PhET Interactive Simulations.
                </p>
                <p className="text-cyan-300 font-semibold italic">
                  We thank every educator, developer, and contributor who helps make quality education available to more people.
                </p>
              </div>
            </motion.div>
          </section>
          
        </div>
        
        {/* 9. FOOTER */}
        <footer className="border-t border-white/10 bg-black/60 backdrop-blur-2xl py-16 text-center relative z-10 mt-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-slate-300 font-bold tracking-wide">
              <button onClick={() => handleNavigation('/simulations')} className="hover:text-cyan-400 transition-colors">Simulations</button>
              <button onClick={() => handleNavigation('/articles')} className="hover:text-cyan-400 transition-colors">Articles</button>
              <button onClick={() => handleNavigation('/quizzes')} className="hover:text-cyan-400 transition-colors">Quizzes</button>
              <button onClick={() => handleNavigation('/tools/periodic-table')} className="hover:text-cyan-400 transition-colors">Periodic Table</button>
              <button onClick={() => handleNavigation('/tools/calculator')} className="hover:text-cyan-400 transition-colors">Calculator</button>
            </div>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-2" />
            
            <div className="flex items-center justify-center gap-3 text-slate-500 text-sm font-medium">
              <Atom className="animate-spin-slow text-cyan-500" size={24} style={{ animationDuration: '6s' }}/>
              <span>Science Learning Platform © 2026</span>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}