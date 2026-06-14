import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import confetti from 'canvas-confetti';
import { 
  Atom, Dna, FlaskConical, Telescope, Globe, Zap, 
  ChevronRight, Play, BookOpen, Brain, Star,
  Gamepad2, Library, ShieldAlert, GraduationCap, Lightbulb, Users
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'biology', name: 'Biology', icon: Dna, path: '/articles', filter: 'biology' },
  { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, path: '/simulations', filter: null },
  { id: 'physics', name: 'Physics', icon: Atom, path: '/articles', filter: 'physics' },
  { id: 'astronomy', name: 'Astronomy', icon: Telescope, path: '/articles', filter: 'astronomy' },
];

const SIMULATIONS = [
  { 
    id: 'eco-balance', 
    title: 'Badian Coastal Ecosystem', 
    category: 'Ecology', 
    difficulty: 'Beginner',
    path: '/games/eco-balance',
    description: 'Manipulate environmental conditions and observe how species populations respond in this interactive simulation.'
  },
  { 
    id: 'dna-extraction', 
    title: 'DNA Extraction Lab', 
    category: 'Molecular Biology', 
    difficulty: 'Intermediate',
    path: '/simulations/dna-extraction',
    description: 'Extract DNA from a strawberry in this interactive virtual lab. Learn the fundamental steps of extraction.'
  },
  { 
    id: 'microscope', 
    title: 'Microscope Diagnostic', 
    category: 'Laboratory', 
    difficulty: 'Beginner',
    path: '/microscope-game',
    description: 'Learn microscope components through a precision drag-and-drop diagnostic interface.'
  }
];

const ARTICLES = [
  { id: 'particle-model-matter', title: 'The Particle Model of Matter', time: '5 min read', category: 'Physics', path: '/articles/particle-model-matter' },
  { id: 'lab-safety', title: 'Mastering Laboratory Safety', time: '8 min read', category: 'Skills', path: '/articles/LaboratorySafety' },
  { id: 'chem-models', title: 'Chemistry Models in the Modern World', time: '6 min read', category: 'Chemistry', path: '/articles/chem-models' },
  { id: 'scientific-skills', title: 'Scientific Investigation Skills', time: '7 min read', category: 'Science', path: '/articles/ScientificSkills' },
];

// --- 3D BACKGROUND COMPONENT ---
// A purely mathematical wireframe structure. No lighting, no gradients.
const WireframeTorus = () => {
  const meshRef = React.useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[4, 0, -5]} scale={1.5}>
      <torusKnotGeometry args={[3, 0.8, 128, 32]} />
      <meshBasicMaterial color="#2563EB" wireframe={true} transparent opacity={0.15} />
    </mesh>
  );
};

// --- INTERACTIVE COMPONENTS ---
const DailyMystery = () => {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#EF4444', '#111111'] // Primary, Accent, Dark
    });
  };

  return (
    <motion.div 
      className="border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 md:p-16 cursor-pointer group"
      onClick={!revealed ? handleReveal : undefined}
      layout
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-red-500" size={28} />
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-black dark:text-white">Daily Scientific Mystery</h3>
          </div>
          
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <p className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white opacity-40 blur-[4px] select-none">
                  The human brain generates enough electricity to...
                </p>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm uppercase tracking-widest transition-colors">
                  Decrypt Data
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <p className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-tight">
                  The human brain generates enough electricity to <span className="text-red-500">power a small lightbulb</span> (about 12-25 watts) while awake.
                </p>
                <div className="inline-flex items-center gap-3 text-red-500 text-sm font-mono border border-red-500/30 px-6 py-3 bg-red-500/10">
                  <Star size={18} /> +50 XP DISCOVERED
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN HOMEPAGE EXPORT ---
export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path, filter = null) => {
    if (filter) {
      navigate(`${path}?category=${filter}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-black dark:text-white selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <WireframeTorus />
        </Canvas>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1400px] mx-auto">
        

        {/* 1. HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center px-8 py-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 mb-12">
              <Zap size={20} className="text-blue-600" />
              <span className="font-mono text-sm tracking-widest text-blue-600 dark:text-blue-500 uppercase font-bold">
                Digital Laboratory System
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-10 leading-[0.9] text-black dark:text-white">
              Explore Science. <br />
              Observe Truth.
            </h1>
            
            <p className="text-xl md:text-3xl font-light max-w-3xl mb-16 leading-relaxed text-black/60 dark:text-white/60">
              Interactive simulations, real experiments, and deep-dive articles. We support technology literacy through rigorous, hands-on learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => handleNavigation('/simulations')}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-4 group"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform" />
                Initialize Labs
              </button>
              
              <button
                onClick={() => handleNavigation('/articles')}
                className="w-full sm:w-auto px-10 py-5 bg-transparent border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-black dark:text-white font-mono text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-4"
              >
                <BookOpen size={18} />
                Access Archives
              </button>
            </div>
          </div>
        </section>

        <div className="px-8 pb-32 space-y-40">
          
          {/* 2. CATEGORIES GRID */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-black/10 dark:border-white/10 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
                  Taxonomy
                </h2>
                <p className="text-black/60 dark:text-white/60 font-mono text-sm tracking-widest uppercase">Select a discipline.</p>
              </div>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="font-mono text-sm uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
              >
                View Directory <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 dark:bg-white/10">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleNavigation(cat.path, cat.filter)}
                  className="bg-white dark:bg-[#09090B] p-12 cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex flex-col justify-between aspect-square"
                >
                  <cat.icon size={48} className="text-black/30 dark:text-white/30 group-hover:text-blue-600 transition-colors" strokeWidth={1} />
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2 text-black dark:text-white">{cat.name}</h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
                      {cat.filter ? 'Read Articles' : 'Run Simulations'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. FEATURED SIMULATIONS */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-black/10 dark:border-white/10 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
                  Active Environments
                </h2>
                <p className="text-black/60 dark:text-white/60 font-mono text-sm tracking-widest uppercase">Safe digital practice.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {SIMULATIONS.map((sim, i) => (
                <div
                  key={sim.id}
                  onClick={() => handleNavigation(sim.path)}
                  className="group cursor-pointer border border-black/10 dark:border-white/10 flex flex-col"
                >
                  <div className="bg-black/5 dark:bg-white/5 h-64 flex items-center justify-center p-8 border-b border-black/10 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute font-mono text-[120px] font-bold text-black/[0.03] dark:text-white/[0.03] -right-4 -bottom-8 pointer-events-none select-none">
                      0{i + 1}
                    </div>
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play fill="currentColor" className="ml-1" size={24} />
                    </div>
                  </div>

                  <div className="p-8 bg-white dark:bg-[#09090B] flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">{sim.category}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest border border-black/20 dark:border-white/20 px-2 py-1 text-black/60 dark:text-white/60">{sim.difficulty}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight text-black dark:text-white group-hover:text-blue-600 transition-colors">{sim.title}</h3>
                    <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed mt-auto">{sim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. INTERACTIVE DISCOVERY */}
          <section>
            <DailyMystery />
          </section>

          {/* 5. RESEARCH & THEORY (Articles) */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-black/10 dark:border-white/10 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
                  Theoretical Archives
                </h2>
                <p className="text-black/60 dark:text-white/60 font-mono text-sm tracking-widest uppercase">Deep dive concepts.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ARTICLES.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleNavigation(article.path)}
                  className="p-8 border border-black/10 dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white dark:bg-[#09090B]"
                >
                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest mb-3 block">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <span className="font-mono text-xs text-black/50 dark:text-white/50 tracking-widest uppercase">
                      {article.time}
                    </span>
                    <ChevronRight size={20} className="text-black/30 dark:text-white/30 group-hover:text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. WHY WE BUILT THIS */}
          <section className="border-t border-black/10 dark:border-white/10 pt-24">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-black dark:text-white">System Objectives</h2>
              <p className="text-black/60 dark:text-white/60 text-lg leading-relaxed">
                Resources engineered to make learning accessible, engaging, and practically applicable across science and research.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
              {[
                { icon: Globe, title: "Unrestricted Access", desc: "Free educational resources deployed for global infrastructure." },
                { icon: Users, title: "Educator Support", desc: "High-yield, classroom-ready materials for instructional scaffolding." },
                { icon: Telescope, title: "Active Observation", desc: "Learning facilitated through direct exploration and variable manipulation." },
                { icon: Atom, title: "Digital Literacy", desc: "Technological fluency promoted through interface interaction." },
                { icon: Lightbulb, title: "Analytical Thinking", desc: "Mechanisms to encourage rigorous scientific inquiry and problem-solving." },
                { icon: GraduationCap, title: "Measurable Growth", desc: "Continuous feedback loops for knowledge acquisition." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <item.icon size={32} className="text-blue-600 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-black dark:text-white mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. QUICK LINKS TO QUIZZES */}
          <section>
            <div className="bg-blue-600 p-12 md:p-20 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <div className="max-w-2xl">
                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Evaluate Competency.</h3>
                <p className="text-white/80 text-xl font-light">Subject matter assessments and rigorous knowledge checks.</p>
              </div>
              <button
                onClick={() => handleNavigation('/quizzes')}
                className="px-10 py-5 bg-white text-blue-600 font-mono text-sm tracking-widest uppercase font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-4 whitespace-nowrap"
              >
                <Gamepad2 size={20} />
                Commence Testing
              </button>
            </div>
          </section>

          {/* 8. IMPORTANT NOTICES */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-red-500/30 bg-red-500/5 p-10 md:p-12 relative overflow-hidden">
              <ShieldAlert className="absolute -right-8 -bottom-8 text-red-500/10" size={200} />
              <div className="relative z-10">
                <h3 className="text-sm font-mono font-bold tracking-widest text-red-500 uppercase mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Operational Notice
                </h3>
                <p className="text-black dark:text-white text-lg mb-6 leading-relaxed">
                  These environments represent simplified models. Simulation results abstract real-world variables and do not guarantee parity with physical outcomes.
                </p>
                <p className="text-black/60 dark:text-white/60 font-mono text-xs uppercase tracking-widest leading-loose">
                  Mandatory: Supplement with physical laboratory instruction and peer-reviewed literature.
                </p>
              </div>
            </div>

            <div className="border border-black/10 dark:border-white/10 p-10 md:p-12">
              <div className="relative z-10">
                <h3 className="text-sm font-mono font-bold tracking-widest text-black/50 dark:text-white/50 uppercase mb-6">
                  Open Source Acknowledgments
                </h3>
                <p className="text-black dark:text-white text-lg mb-6 leading-relaxed">
                  Infrastructure relies on global research and open-source contributions. Elements originate from established institutions, including PhET Interactive Simulations.
                </p>
                <p className="text-black/60 dark:text-white/60 font-mono text-xs uppercase tracking-widest leading-loose">
                  Gratitude to the global network of educators and developers.
                </p>
              </div>
            </div>
          </section>
          
        </div>
        
        {/* 9. FOOTER */}
        <footer className="border-t border-black/10 dark:border-white/10 py-16 px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Atom className="animate-spin-slow text-blue-600" size={24} style={{ animationDuration: '12s' }}/>
            <span className="font-mono text-xs tracking-widest uppercase text-black/50 dark:text-white/50">Sci-Hub Core • June 2026 Archive</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            <button onClick={() => handleNavigation('/simulations')} className="hover:text-blue-600 transition-colors">Labs</button>
            <button onClick={() => handleNavigation('/articles')} className="hover:text-blue-600 transition-colors">Archives</button>
            <button onClick={() => handleNavigation('/quizzes')} className="hover:text-blue-600 transition-colors">Assessments</button>
            <button onClick={() => handleNavigation('/tools/periodic-table')} className="hover:text-blue-600 transition-colors">Data Tables</button>
            <button onClick={() => handleNavigation('/tools/calculator')} className="hover:text-blue-600 transition-colors">Compute</button>
          </div>
        </footer>
      </div>
    </div>
  );
}