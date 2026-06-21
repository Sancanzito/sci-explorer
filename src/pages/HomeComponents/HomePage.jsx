import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { 
  Atom, Dna, FlaskConical, Telescope, Globe, Zap, 
  ChevronRight, Play, BookOpen, Brain, Star,
  Gamepad2, Library, ShieldAlert, GraduationCap, Lightbulb, Users,
  FileText
} from 'lucide-react';

import dnaVideo from '../../assets/hero.mp4'; 

gsap.registerPlugin(ScrollTrigger);

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

// --- ADVANCED DNA 3D TILT CARD ---
const TiltCard = ({ children, className, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0, 0.2]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      // Added opacity transition for hover fade-in/fade-out
      className={`relative cursor-pointer [perspective:1500px] group opacity-85 hover:opacity-100 transition-opacity duration-500 ${className}`}
    >
      {/* Dynamic Glare Layer */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none rounded-sm bg-gradient-to-tr from-[#3B82F6]/0 via-[#3B82F6]/30 to-[#8B5CF6]/0 mix-blend-overlay"
        style={{ x: glareX, y: glareY, opacity: glareOpacity }}
      />
      
      {/* Deep Layer (20px): DNA Helix Background Parallax */}
      <div 
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-sm flex items-center justify-center opacity-[0.04] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-110"
      >
        <Dna size={300} strokeWidth={0.5} className="text-[#3B82F6] rotate-12 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
      </div>

      {/* Top Layer (70px): Card Content */}
      <div 
        style={{ transform: "translateZ(70px)", transformStyle: "preserve-3d" }} 
        className="w-full h-full flex flex-col relative z-20"
      >
        {children}
      </div>
    </motion.div>
  );
};

// --- DNA SCIENCE ATMOSPHERE ---
const MolecularParticles = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const particles = [];
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'molecular-particle';
      particle.style.position = 'absolute';
      const size = Math.random() > 0.8 ? '3px' : '1.5px';
      particle.style.width = size;
      particle.style.height = size;
      particle.style.background = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
      
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const duration = 25 + Math.random() * 40; 
      const delay = Math.random() * 15;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      containerRef.current.appendChild(particle);
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150,
        opacity: 0,
        duration: duration,
        delay: delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true, 
      });
    }
    
    return () => {
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-40 overflow-hidden pointer-events-none" />;
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
      colors: ['#3B82F6', '#8B5CF6', '#FFFFFF'] 
    });
  };

  return (
    <motion.div 
      className="scroll-reveal opacity-85 hover:opacity-100 border border-white/12 bg-[#050816]/60 p-8 md:p-16 cursor-pointer group backdrop-blur-xl transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-sm relative overflow-hidden"
      onClick={!revealed ? handleReveal : undefined}
      layout
    >
      {/* DNA Themed subtle background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-[#8B5CF6] group-hover:animate-pulse" size={28} />
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white">Daily Scientific Mystery</h3>
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
                <p className="text-3xl md:text-5xl font-bold tracking-tight text-white opacity-40 blur-[4px] select-none transition-all duration-500 group-hover:blur-[2px]">
                  The human brain generates enough electricity to...
                </p>
                <button className="px-8 py-4 bg-[#3B82F6]/10 border border-[#3B82F6]/50 hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white font-mono text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] rounded-sm backdrop-blur-md">
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
                <p className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  The human brain generates enough electricity to <span className="text-[#8B5CF6] drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">power a small lightbulb</span> (about 12-25 watts) while awake.
                </p>
                <div className="inline-flex items-center gap-3 text-[#8B5CF6] text-sm font-mono border border-[#8B5CF6]/30 px-6 py-3 bg-[#8B5CF6]/10 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] rounded-sm">
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

// --- CSS STYLES FOR BACKGROUND EFFECTS ---
const addBackgroundStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .bg-radial-vignette {
      background: radial-gradient(circle at center, transparent 30%, rgba(5, 8, 22, 0.85) 80%, #050816 100%);
    }
    
    .bg-atmospheric-glow {
      background: radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
                  radial-gradient(ellipse at bottom left, rgba(139, 92, 246, 0.12) 0%, transparent 50%);
    }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
};

// --- MAIN HOMEPAGE EXPORT ---
export default function HomePage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleNavigation = (path, filter = null) => {
    if (filter) {
      navigate(`${path}?category=${filter}`);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const cleanupStyles = addBackgroundStyles();

    // 1. Setup REPEATING Scroll Animations for Cards (Fade in/out constantly)
    const cards = document.querySelectorAll('.scroll-reveal');
    cards.forEach((card) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out", 
          scrollTrigger: { 
            trigger: card, 
            start: "top 90%", // Trigger when the top of the card is 90% down the screen
            end: "bottom 10%", // Trigger reverse when the bottom is 10% from the top
            toggleActions: "play reverse play reverse" // Fade In -> Fade Out -> Fade In -> Fade Out
          }
        }
      );
    });
    
    // 2. Setup REPEATING Scroll Animations for entire Sections
    const sections = document.querySelectorAll('.section-reveal');
    sections.forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power2.out",
          scrollTrigger: { 
            trigger: section, 
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse" 
          }
        }
      );
    });

    // 3. Set Video to 50% Speed
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
    
    return () => {
      cleanupStyles();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-[#3B82F6] selection:text-white overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* FIXED VIDEO BACKGROUND - 50% Speed */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[#050816]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.png"
        >
          <source src={dnaVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/60 via-transparent to-[#050816]/95 z-10" />
        <div className="absolute inset-0 bg-radial-vignette z-20" />
        <div className="absolute inset-0 bg-atmospheric-glow z-30" />
        
        <MolecularParticles />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1400px] mx-auto overflow-visible">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center px-8 py-24 text-center">
          <div className="max-w-4xl flex flex-col items-center relative">
            
            {/* Background glowing orb behind text for readability */}
            <div className="absolute inset-0 bg-[#3B82F6]/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-10 px-6 py-3 rounded-md bg-blue-900/40 border border-[#3B82F6]/50 shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-xl">
              <Zap size={20} className="text-[#3B82F6]" />
              <span className="font-mono text-sm tracking-widest text-white uppercase font-bold drop-shadow-md">
                Digital Laboratory System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              Explore Science.<br/>
              Observe Truth.
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl font-light max-w-2xl mb-12 leading-relaxed text-white/80 drop-shadow-md">
              Interactive simulations, real experiments, and deep-dive articles. We support technology literacy through rigorous, hands-on learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <button
                onClick={() => handleNavigation('/simulations')}
                className="w-full sm:w-auto px-10 py-5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-4 group shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 rounded-sm"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform duration-300" />
                Initialize Labs
              </button>
              
              <button
                onClick={() => handleNavigation('/articles')}
                className="w-full sm:w-auto px-10 py-5 bg-[#050816]/50 backdrop-blur-md border border-[#3B82F6]/30 hover:border-[#8B5CF6]/60 hover:bg-[#050816]/80 text-white font-mono text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-4 hover:-translate-y-1 rounded-sm shadow-lg"
              >
                <BookOpen size={18} className="text-[#8B5CF6]" />
                Access Archives
              </button>
            </div>
          </div>
        </section>

        <div className="px-8 pb-32 space-y-40 relative z-20">
          
          {/* 2. CATEGORIES GRID */}
          <section className="section-reveal">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/12 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
                  Taxonomy
                </h2>
                <p className="text-white/72 font-mono text-sm tracking-widest uppercase">Select a discipline.</p>
              </div>
              <button 
                onClick={() => handleNavigation('/articles')}
                className="font-mono text-sm uppercase tracking-widest text-[#3B82F6] hover:text-[#8B5CF6] flex items-center gap-2 transition-colors duration-300"
              >
                View Directory <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3B82F6]/20 rounded-sm overflow-hidden border border-white/12">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleNavigation(cat.path, cat.filter)}
                  className="scroll-reveal bg-[#050816]/80 opacity-85 hover:opacity-100 backdrop-blur-xl p-12 cursor-pointer group hover:bg-[#0a0f25]/90 transition-all duration-500 flex flex-col justify-between aspect-square relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/0 to-[#8B5CF6]/0 group-hover:to-[#8B5CF6]/10 transition-colors duration-500 pointer-events-none" />
                  <cat.icon size={48} className="text-[#3B82F6]/40 group-hover:text-[#3B82F6] transition-colors duration-500 drop-shadow-lg relative z-10" strokeWidth={1} />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold tracking-tight mb-2 text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">{cat.name}</h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50 group-hover:text-white/90 transition-colors">
                      {cat.filter ? 'Read Articles' : 'Run Simulations'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. FEATURED SIMULATIONS - DNA THEMED 3D TILT */}
          <section className="section-reveal">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/12 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
                  Active Environments
                </h2>
                <p className="text-white/72 font-mono text-sm tracking-widest uppercase">Safe digital practice.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {SIMULATIONS.map((sim) => (
                <TiltCard 
                  key={sim.id} 
                  onClick={() => handleNavigation(sim.path)}
                  className="scroll-reveal border-l border-r border-[#3B82F6]/20 bg-[#050816]/70 backdrop-blur-2xl transition-all duration-500 hover:border-[#3B82F6]/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden"
                >
                  {/* DNA Accent Lines on Top & Bottom */}
                  <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-[#3B82F6] group-hover:w-full transition-all duration-700 ease-out z-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <div className="absolute bottom-0 right-0 w-1/4 h-[2px] bg-[#8B5CF6] group-hover:w-full transition-all duration-700 ease-out z-0 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  
                  <div className="p-10 flex-1 flex flex-col h-full">
                    <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
                      <div className="flex items-center gap-3 text-white/70">
                        <FileText size={20} className="group-hover:text-[#3B82F6] transition-colors drop-shadow-lg" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">{sim.category}</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest border border-white/10 px-3 py-1 text-[#8B5CF6] group-hover:text-white rounded-sm bg-[#8B5CF6]/10 transition-colors">{sim.difficulty}</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 tracking-tight text-white group-hover:text-[#3B82F6] transition-colors duration-300 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">{sim.title}</h3>
                    
                    <p className="text-white/60 text-base leading-relaxed mb-10 group-hover:text-white/90 transition-colors drop-shadow-md">
                      {sim.description}
                    </p>
                    
                    <div className="mt-auto inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#3B82F6] opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                      Initialize Simulator <ChevronRight size={16} />
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* 4. INTERACTIVE DISCOVERY */}
          <section className="section-reveal">
            <DailyMystery />
          </section>

          {/* 5. RESEARCH & THEORY (Articles) - DNA THEMED 3D TILT */}
          <section className="section-reveal">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/12 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
                  Theoretical Archives
                </h2>
                <p className="text-white/72 font-mono text-sm tracking-widest uppercase">Deep dive concepts.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ARTICLES.map((article) => (
                <TiltCard
                  key={article.id}
                  onClick={() => handleNavigation(article.path)}
                  className="scroll-reveal border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-500 bg-[#050816]/70 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] rounded-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 w-full h-full p-8">
                    <div className="flex-1">
                      <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-3 block drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                        {article.category}
                      </span>
                      <h3 className="text-xl font-bold text-white transition-colors leading-snug drop-shadow-[0_5px_10px_rgba(0,0,0,0.6)] group-hover:text-[#3B82F6] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                        {article.title}
                      </h3>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      <span className="font-mono text-xs text-white/40 group-hover:text-white/70 tracking-widest uppercase transition-colors drop-shadow-md">
                        {article.time}
                      </span>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-[#8B5CF6] transition-colors duration-300 drop-shadow-lg" />
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* 6. WHY WE BUILT THIS */}
          <section className="section-reveal border-t border-white/12 pt-24">
            <div className="mb-16 max-w-2xl text-center md:text-left mx-auto md:mx-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white drop-shadow-md">System Objectives</h2>
              <p className="text-white/72 text-lg leading-relaxed">
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
                <div key={i} className="scroll-reveal opacity-85 hover:opacity-100 transition-opacity duration-500 group flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="p-4 bg-[#3B82F6]/10 rounded-full mb-6 border border-[#3B82F6]/20 group-hover:bg-[#3B82F6]/20 group-hover:border-[#3B82F6]/50 transition-all duration-300">
                    <item.icon size={28} className="text-[#3B82F6] drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#3B82F6] transition-colors">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. QUICK LINKS TO QUIZZES */}
          <section className="section-reveal">
            <div className="relative overflow-hidden bg-[#050816]/80 backdrop-blur-xl border border-[#8B5CF6]/40 p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_0_50px_rgba(139,92,246,0.15)] rounded-sm text-center md:text-left group opacity-85 hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-50" />
              <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                <Brain size={300} className="text-[#8B5CF6]" />
              </div>

              <div className="max-w-2xl relative z-10">
                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter drop-shadow-lg">Evaluate Competency.</h3>
                <p className="text-white/80 text-xl font-light">Subject matter assessments and rigorous knowledge checks.</p>
              </div>
              <button
                onClick={() => handleNavigation('/quizzes')}
                className="relative z-10 px-10 py-5 bg-[#8B5CF6] text-white font-mono text-sm tracking-widest uppercase font-bold hover:bg-[#7C3AED] transition-all duration-300 flex items-center gap-4 whitespace-nowrap shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:-translate-y-1 rounded-sm"
              >
                <Gamepad2 size={20} />
                Commence Testing
              </button>
            </div>
          </section>

          {/* 8. IMPORTANT NOTICES */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="scroll-reveal opacity-85 hover:opacity-100 border border-white/10 bg-[#050816]/60 p-10 md:p-12 relative overflow-hidden backdrop-blur-md hover:bg-white/5 transition-all duration-500 rounded-sm">
              <ShieldAlert className="absolute -right-8 -bottom-8 text-white/5" size={200} />
              <div className="relative z-10">
                <h3 className="text-sm font-mono font-bold tracking-widest text-white/90 uppercase mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" /> Operational Notice
                </h3>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  These environments represent simplified models. Simulation results abstract real-world variables and do not guarantee parity with physical outcomes.
                </p>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-loose">
                  Mandatory: Supplement with physical laboratory instruction and peer-reviewed literature.
                </p>
              </div>
            </div>

            <div className="scroll-reveal opacity-85 hover:opacity-100 border border-white/10 bg-[#050816]/60 p-10 md:p-12 backdrop-blur-md hover:bg-white/5 transition-all duration-500 rounded-sm">
              <div className="relative z-10">
                <h3 className="text-sm font-mono font-bold tracking-widest text-white/72 uppercase mb-6">
                  Open Source Acknowledgments
                </h3>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  Infrastructure relies on global research and open-source contributions. Elements originate from established institutions, including PhET Interactive Simulations.
                </p>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-loose">
                  Gratitude to the global network of educators and developers.
                </p>
              </div>
            </div>
          </section>
          
        </div>
        
        {/* 9. FOOTER */}
        <footer className="border-t border-white/12 py-16 px-8 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl bg-[#050816]/90 relative z-10">
          <div className="flex items-center gap-3">
            <Atom className="animate-spin-slow text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" size={24} style={{ animationDuration: '12s' }}/>
            <span className="font-mono text-xs tracking-widest uppercase text-white/60">Sci-Hub Core • June 2026 Archive</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs font-bold tracking-widest uppercase text-white/60">
            <button onClick={() => handleNavigation('/simulations')} className="hover:text-[#3B82F6] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">Labs</button>
            <button onClick={() => handleNavigation('/articles')} className="hover:text-[#3B82F6] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">Archives</button>
            <button onClick={() => handleNavigation('/quizzes')} className="hover:text-[#3B82F6] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">Assessments</button>
            <button onClick={() => handleNavigation('/tools/periodic-table')} className="hover:text-[#3B82F6] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">Data Tables</button>
            <button onClick={() => handleNavigation('/tools/calculator')} className="hover:text-[#3B82F6] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">Compute</button>
          </div>
        </footer>
      </div>
    </div>
  );
}