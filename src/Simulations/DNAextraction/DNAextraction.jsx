// DNAextraction.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  FlaskConical, 
  Droplet, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause,
  RefreshCcw, 
  Search,
  Dna,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Volume2,
  HelpCircle,
  FileText,
  Award,
  XCircle,
  CheckCircle
} from 'lucide-react';
import strawberry from "../../assets/DNAextraction/strawberry.mp4";

// --- CENTRAL STATE MANAGEMENT (Simulating Zustand) ---
const INITIAL_STATE = {
  phase: 0,
  score: 100,
  mistakes: 0,
  inventory: [],
  isModalOpen: false,
  modalContent: null,
};

const PHASES = [
  { id: 'intro', title: 'Briefing' },
  { id: 'crush', title: 'Cell Disruption' },
  { id: 'lysis', title: 'Lysis Solution' },
  { id: 'filter', title: 'Filtration' },
  { id: 'precipitate', title: 'Precipitation' },
  { id: 'results', title: 'Analysis' }
];

// --- VIDEO TAB COMPONENT ---
function VideoTab({ videoSrc, videoTitle = "DNA Extraction Tutorial" }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setProgress(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = (seekTime / 100) * duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) setShowControls(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div 
        className="bg-black rounded-xl overflow-hidden shadow-2xl relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          className="w-full aspect-video cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Center Button (Shows on hover when paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        )}

        {/* Controls Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white text-xs font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
            />
            <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-cyan-400 transition-colors p-1"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={skipBackward}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5v14l-6-7 6-7zM18 5v14l-6-7 6-7z"/>
                </svg>
              </button>

              <button
                onClick={skipForward}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 5v14l6-7-6-7zM6 5v14l6-7-6-7z"/>
                </svg>
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors p-1">
                  {isMuted || volume === 0 ? 
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
                    </svg> : 
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 opacity-0 group-hover/volume:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Information */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h4 className="font-bold text-white flex items-center gap-2 mb-3">
          <Play size={18} className="text-cyan-400" />
          About This Video
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          This tutorial walks you through each step of the strawberry DNA extraction experiment.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {['🧪 Cell Disruption', '🧴 Chemical Lysis', '🔬 Filtration', '❄️ Precipitation'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video Chapters */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700">
        <h4 className="font-bold text-white flex items-center gap-2 mb-3">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Key Moments
        </h4>
        <div className="space-y-2">
          {[
            { time: "00:00", title: "Introduction & Safety", desc: "Overview of materials and lab safety" },
            { time: "01:23", title: "Step 1: Mashing the Strawberry", desc: "Mechanical cell disruption" },
            { time: "02:45", title: "Step 2: Adding Extraction Buffer", desc: "Soap and salt solution" },
            { time: "04:10", title: "Step 3: Filtration", desc: "Separating debris from DNA solution" },
            { time: "05:35", title: "Step 4: Alcohol Precipitation", desc: "Making DNA visible" },
            { time: "07:00", title: "Spooling DNA & Results", desc: "Collecting and analyzing DNA" }
          ].map((chapter, i) => (
            <button
              key={i}
              onClick={() => {
                if (videoRef.current) {
                  const [minutes, seconds] = chapter.time.split(':').map(Number);
                  const timeInSeconds = minutes * 60 + seconds;
                  videoRef.current.currentTime = timeInSeconds;
                  videoRef.current.play();
                  setIsPlaying(true);
                }
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors group/chapter"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 text-xs font-mono bg-cyan-400/10 px-2 py-1 rounded">
                  {chapter.time}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-white text-sm group-hover/chapter:text-cyan-400 transition-colors">
                    {chapter.title}
                  </div>
                  <div className="text-xs text-slate-500">{chapter.desc}</div>
                </div>
                <Play size={14} className="text-slate-500 opacity-0 group-hover/chapter:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN APPLICATION COMPONENT ---
export default function DNAextraction() {
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const nextPhase = () => updateState({ phase: Math.min(state.phase + 1, PHASES.length - 1) });
  const showModal = (content) => updateState({ isModalOpen: true, modalContent: content });
  const closeModal = () => updateState({ isModalOpen: false, modalContent: null });
  const addMistake = (penalty) => updateState({ mistakes: state.mistakes + 1, score: Math.max(0, state.score - penalty) });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden flex flex-col">
      {/* Header / Progress UI */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 shadow-lg z-10 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
            <Dna size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Virtual Lab: DNA Extraction
            </h1>
            <p className="text-xs text-slate-400">Scientist: Azel | Grade 10 Biology</p>
          </div>
        </div>
        
        {/* Progress Stepper */}
        <div className="hidden md:flex gap-2">
          {PHASES.map((p, idx) => (
            <div key={p.id} className="flex flex-col items-center w-20">
              <div className={`h-2 w-full rounded-full transition-colors duration-500 ${idx <= state.phase ? 'bg-blue-500' : 'bg-slate-700'}`} />
              <span className={`text-[10px] mt-1 ${idx === state.phase ? 'text-blue-300 font-bold' : 'text-slate-500'}`}>
                {p.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="flex flex-col items-end">
            <span className="text-emerald-400">Purity Score: {state.score}%</span>
            <span className="text-red-400 text-xs">Mistakes: {state.mistakes}</span>
          </div>
        </div>
      </header>

      {/* Main Simulation Area */}
      <main className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-y-auto">
        <AnimatePresence mode="wait">
          {state.phase === 0 && <PhaseIntro key="intro" onNext={nextPhase} showModal={showModal} />}
          {state.phase === 1 && <PhaseCrush key="crush" onNext={nextPhase} showModal={showModal} />}
          {state.phase === 2 && <PhaseLysis key="lysis" onNext={nextPhase} showModal={showModal} addMistake={addMistake} />}
          {state.phase === 3 && <PhaseFilter key="filter" onNext={nextPhase} showModal={showModal} />}
          {state.phase === 4 && <PhasePrecipitate key="precipitate" onNext={nextPhase} showModal={showModal} />}
          {state.phase === 5 && <PhaseResults key="results" score={state.score} mistakes={state.mistakes} />}
        </AnimatePresence>
      </main>

      {/* Educational Modal */}
      <AnimatePresence>
        {state.isModalOpen && (
          <EducationalModal content={state.modalContent} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- PHASE 0: INTRO & SAFETY ---
function PhaseIntro({ onNext }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-8 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
      >
        <ShieldAlert size={64} className="text-blue-400" />
      </motion.div>
      <h2 className="text-4xl font-bold mb-4">Welcome to the Lab, Azel!</h2>
      <p className="text-slate-300 max-w-2xl text-lg mb-8 leading-relaxed">
        Today, we will extract visible DNA from a strawberry. 
        You will perform mechanical disruption, chemical lysis, filtration, and precipitation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
        {[
          { title: "1. Mechanical", desc: "Break cell walls by mashing the fruit." },
          { title: "2. Chemical", desc: "Use soap/salt to dissolve membranes." },
          { title: "3. Precipitation", desc: "Use cold alcohol to make DNA visible." }
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h3 className="font-bold text-blue-400 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={onNext}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      >
        <Play size={20} /> Equip Safety Gear & Start
      </button>
    </motion.div>
  );
}

// --- PHASE 1: FRUIT CRUSHING ---
function PhaseCrush({ onNext, showModal }) {
  const [mashCount, setMashCount] = useState(0);
  const maxMash = 15;
  const isDone = mashCount >= maxMash;

  const handleMash = () => {
    if (!isDone) setMashCount(prev => prev + 1);
  };

  return (
    <motion.div className="flex flex-col items-center justify-center h-full p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="absolute top-8 left-8 max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Step 1: Mechanical Disruption</h2>
        <p className="text-slate-400 mb-4">Click rapidly to mash the strawberry. This breaks open the rigid plant cell walls.</p>
        
        <div className="w-full bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
          <motion.div 
            className="bg-red-500 h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(mashCount / maxMash) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 font-mono text-right">{Math.round((mashCount / maxMash) * 100)}% Cell walls broken</p>
      </div>

      <motion.div 
        className="relative w-64 h-80 bg-white/5 border-4 border-white/20 rounded-lg cursor-pointer flex items-center justify-center backdrop-blur-sm overflow-hidden mt-16"
        onClick={handleMash}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95, rotate: (Math.random() - 0.5) * 10 }}
      >
        <div className="absolute top-0 w-full h-6 border-b-4 border-green-500/50 bg-white/10" />
        
        <motion.div 
          className="relative"
          animate={{ 
            scale: 1 + (mashCount * 0.05),
            rotate: mashCount * 5
          }}
        >
          {isDone ? (
            <div className="w-48 h-48 bg-red-600/80 rounded-[40%_60%_70%_30%] blur-sm animate-pulse flex items-center justify-center">
              <span className="text-red-900 font-bold opacity-50">Cellular Mush</span>
            </div>
          ) : (
            <div className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <svg width="120" height="140" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8 2 4 6 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 6 16 2 12 2Z" />
                <path d="M12 2C10 4 8 4 8 4C8 4 10 2 12 2Z" fill="#22c55e" />
                <path d="M12 2C14 4 16 4 16 4C16 4 14 2 12 2Z" fill="#22c55e" />
              </svg>
            </div>
          )}
        </motion.div>
        
        {mashCount > 0 && Array.from({ length: Math.min(mashCount * 2, 30) }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-2 h-2 bg-red-400 rounded-full"
            initial={{ x: 100, y: 150, opacity: 1 }}
            animate={{ 
              x: Math.random() * 200, 
              y: Math.random() * 250 + 50,
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {isDone && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              showModal({
                title: "Science Fact: Mechanical Disruption",
                text: "By mashing the strawberry, you broke open the tough plant cell walls. However, the DNA is still trapped inside the cell's nucleus, protected by lipid (fat) membranes. We need chemicals for the next step!",
                icon: <Info className="text-blue-400" size={32} />
              });
              onNext();
            }}
            className="mt-8 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full font-bold flex items-center gap-2"
          >
            Add Lysis Solution <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- PHASE 2: CHEMICAL LYSIS ---
function PhaseLysis({ onNext, showModal, addMistake }) {
  const [ingredients, setIngredients] = useState({ soap: false, salt: false, water: false });
  const [isStirring, setIsStirring] = useState(false);
  
  const allAdded = ingredients.soap && ingredients.salt && ingredients.water;

  const handleAdd = (item) => {
    if (ingredients[item]) {
      addMistake(5);
      return;
    }
    setIngredients(prev => ({ ...prev, [item]: true }));
  };

  return (
    <motion.div className="flex flex-col items-center justify-center h-full p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="absolute top-8 left-8 max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Step 2: Chemical Lysis</h2>
        <p className="text-slate-400 mb-4">Create the extraction buffer. Add all ingredients to the beaker to break down lipid membranes.</p>
      </div>

      <div className="flex gap-16 items-end mt-12">
        <div className="flex flex-col gap-4">
          <IngredientBtn name="Dish Soap" active={ingredients.soap} onClick={() => handleAdd('soap')} color="border-emerald-500 bg-emerald-500/20 text-emerald-300" icon={<Droplet size={20}/>} desc="Breaks down fats" />
          <IngredientBtn name="Salt (NaCl)" active={ingredients.salt} onClick={() => handleAdd('salt')} color="border-white/50 bg-white/10 text-white" icon={<Sparkles size={20}/>} desc="Clumps DNA" />
          <IngredientBtn name="Water" active={ingredients.water} onClick={() => handleAdd('water')} color="border-blue-500 bg-blue-500/20 text-blue-300" icon={<Droplet size={20}/>} desc="Solvent" />
        </div>

        <div className="relative w-48 h-64 border-4 border-white/30 rounded-b-3xl bg-white/5 backdrop-blur-sm overflow-hidden flex items-end shadow-inner">
          <div className="absolute left-0 top-0 h-full w-4 border-r border-white/20 flex flex-col justify-between py-4 opacity-50">
            <div className="w-2 h-[1px] bg-white"/>
            <div className="w-2 h-[1px] bg-white"/>
            <div className="w-2 h-[1px] bg-white"/>
            <div className="w-2 h-[1px] bg-white"/>
          </div>

          <motion.div 
            className="w-full relative origin-bottom mix-blend-screen"
            initial={{ height: '0%' }}
            animate={{ 
              height: `${(ingredients.soap ? 20 : 0) + (ingredients.salt ? 10 : 0) + (ingredients.water ? 50 : 0)}%`,
              backgroundColor: ingredients.soap ? '#059669' : '#3b82f6'
            }}
            transition={{ duration: 1, type: "spring" }}
          >
            {ingredients.soap && Array.from({length: 10}).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute w-3 h-3 border border-white/40 rounded-full bg-white/10"
                initial={{ bottom: 0, left: `${Math.random() * 100}%` }}
                animate={{ bottom: '100%', x: (Math.random() - 0.5) * 20 }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
              />
            ))}
          </motion.div>

          <div className="absolute bottom-0 w-full h-1/4 bg-red-900/80 rounded-b-2xl blur-md" />
        </div>
      </div>

      <AnimatePresence>
        {allAdded && !isStirring && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsStirring(true)}
            className="mt-12 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            Stir Gently
          </motion.button>
        )}
        
        {isStirring && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-8 flex flex-col items-center"
          >
            <motion.div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3 }}
                onAnimationComplete={() => {
                  showModal({
                    title: "Science Fact: Cell Lysis",
                    text: "The dish soap dissolves the lipid bilayer of the cell membranes and nucleus (just like it cuts grease on dishes!). The salt neutralizes the negative charge of the DNA, allowing the strands to stick together. The DNA is now floating freely in the liquid!",
                    icon: <CheckCircle2 className="text-emerald-400" size={32} />
                  });
                  onNext();
                }}
              />
            </motion.div>
            <p className="text-purple-300 animate-pulse font-mono">Membranes dissolving...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function IngredientBtn({ name, active, onClick, color, icon, desc }) {
  return (
    <button 
      onClick={onClick}
      disabled={active}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all w-64 text-left ${
        active ? 'opacity-30 cursor-not-allowed scale-95 grayscale' : `hover:scale-105 ${color}`
      }`}
    >
      <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-xs opacity-80">{desc}</div>
      </div>
      {active && <CheckCircle2 className="ml-auto text-emerald-400" size={20} />}
    </button>
  );
}

// --- PHASE 3: FILTRATION ---
function PhaseFilter({ onNext, showModal }) {
  const [pourProgress, setPourProgress] = useState(0);
  const isComplete = pourProgress >= 100;

  useEffect(() => {
    let interval;
    if (pourProgress > 0 && pourProgress < 100) {
      interval = setInterval(() => {
        setPourProgress(prev => Math.min(prev + 5, 100));
      }, 200);
    } else if (pourProgress >= 100) {
      setTimeout(() => {
        showModal({
          title: "Science Fact: Filtration",
          text: "Filtration separates the cellular debris (cell walls, proteins, chunks of fruit) from the liquid lysate. The clear liquid that passes through contains the dissolved DNA!",
          icon: <Search className="text-blue-400" size={32} />
        });
        onNext();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pourProgress]);

  return (
    <motion.div className="flex flex-col items-center justify-center h-full p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="absolute top-8 left-8 max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Step 3: Filtration</h2>
        <p className="text-slate-400 mb-4">Hold the button to pour the mixture through the filter. Separate the solid debris from the liquid DNA solution.</p>
      </div>

      <div className="flex flex-col items-center mt-12 relative">
        <motion.div 
          className="absolute -top-32 -left-24 w-24 h-32 border-4 border-white/30 rounded-b-xl bg-white/5"
          animate={{ 
            rotate: pourProgress > 0 && !isComplete ? -45 : 0,
            x: pourProgress > 0 && !isComplete ? 30 : 0
          }}
          transition={{ type: "spring" }}
        >
          <div className="absolute bottom-0 w-full bg-red-900/60 rounded-b-lg" style={{ height: `${100 - pourProgress}%` }} />
        </motion.div>

        {pourProgress > 0 && !isComplete && (
          <motion.div 
            className="absolute -top-16 left-0 w-2 bg-red-500/50 h-24 rounded-full blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 96 }}
          />
        )}

        <div className="w-32 h-24 border-t-[32px] border-l-[16px] border-r-[16px] border-t-white/30 border-l-transparent border-r-transparent relative mb-2">
           <div className="absolute -top-8 -left-4 w-24 h-12 bg-white/10 rounded-full border border-white/20" />
           <div className="absolute -top-4 -left-2 w-16 h-8 bg-red-900/80 rounded-full blur-sm" style={{ opacity: pourProgress / 100 }} />
        </div>
        <div className="w-4 h-12 border-x-2 border-white/30 bg-white/5 relative z-10">
          {pourProgress > 0 && !isComplete && (
            <motion.div className="w-full bg-red-400/50 h-full animate-pulse" />
          )}
        </div>

        <div className="w-16 h-48 border-4 border-white/30 rounded-b-full bg-white/5 relative overflow-hidden -mt-2">
           <motion.div 
             className="absolute bottom-0 w-full bg-red-400/30"
             animate={{ height: `${pourProgress}%` }}
           />
        </div>

        <button 
          onMouseDown={() => pourProgress < 100 && setPourProgress(Math.max(1, pourProgress))}
          onMouseUp={() => setPourProgress(prev => prev >= 100 ? 100 : 0)}
          onMouseLeave={() => setPourProgress(prev => prev >= 100 ? 100 : 0)}
          onTouchStart={() => pourProgress < 100 && setPourProgress(Math.max(1, pourProgress))}
          onTouchEnd={() => setPourProgress(prev => prev >= 100 ? 100 : 0)}
          disabled={isComplete}
          className={`mt-12 px-8 py-4 rounded-full font-bold text-lg select-none transition-colors ${
            isComplete ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400 text-white active:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
          }`}
        >
          {isComplete ? 'Filtration Complete' : 'Hold to Pour Mixture'}
        </button>
      </div>
    </motion.div>
  );
}

// --- PHASE 4: PRECIPITATION ---
function PhasePrecipitate({ onNext, showModal }) {
  const [alcoholAdded, setAlcoholAdded] = useState(false);
  const [dnaVisible, setDnaVisible] = useState(false);

  useEffect(() => {
    if (alcoholAdded) {
      setTimeout(() => setDnaVisible(true), 1500);
      setTimeout(() => {
        showModal({
          title: "The 'Wow' Moment: Precipitation",
          text: "DNA is soluble in water, but insoluble in cold alcohol! When the alcohol is added, it forms a layer on top. The DNA molecules precipitate (fall out of solution) at the interface of the two liquids, clumping together to form visible white strands.",
          icon: <Dna className="text-white" size={32} />
        });
      }, 5000);
    }
  }, [alcoholAdded]);

  return (
    <motion.div className="flex flex-col items-center justify-center h-full p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="absolute top-8 left-8 max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Step 4: Precipitation</h2>
        <p className="text-slate-400 mb-4">Add ice-cold isopropyl alcohol. Pour it slowly down the side of the tube to form a layer on top.</p>
      </div>

      <div className="flex items-center gap-24 mt-16">
        
        {!alcoholAdded && (
          <motion.div 
            className="flex flex-col items-center cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => setAlcoholAdded(true)}
          >
            <div className="w-20 h-32 bg-blue-100/10 border-4 border-blue-200/40 rounded-t-3xl rounded-b-xl relative backdrop-blur-md shadow-[0_0_30px_rgba(191,219,254,0.2)]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-300 text-blue-900 text-[10px] font-bold px-2 py-1 rounded">ALCOHOL<br/>(ICE COLD)</div>
              <div className="absolute bottom-0 w-full h-2/3 bg-blue-200/20 rounded-b-lg" />
              <div className="absolute inset-0 bg-white/5 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
            </div>
            <button className="mt-6 bg-blue-500/20 border border-blue-400 text-blue-300 px-6 py-2 rounded-full font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
              Click to Pour
            </button>
          </motion.div>
        )}

        <div className="relative w-24 h-80 border-4 border-white/40 rounded-b-[40px] bg-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
          
          <AnimatePresence>
            {dnaVisible && (
               <motion.div 
                 initial={{ y: -100, opacity: 0 }}
                 animate={{ y: 20, opacity: 1 }}
                 transition={{ delay: 1, duration: 1 }}
                 className="absolute left-1/2 -translate-x-1/2 w-2 h-48 bg-amber-700/80 rounded-full z-20"
               />
            )}
          </AnimatePresence>

          {dnaVisible && (
            <div className="absolute top-[40%] left-0 w-full h-[20%] z-10 overflow-visible">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-3 bg-white/80 rounded-full blur-[1px]"
                  initial={{ 
                    y: 40, 
                    x: Math.random() * 80 + 10,
                    rotate: Math.random() * 180,
                    opacity: 0
                  }}
                  animate={{ 
                    y: Math.random() * -30 - 10,
                    x: `calc(${Math.random() * 80 + 10}px + ${(Math.random() - 0.5) * 20}px)`,
                    rotate: Math.random() * 360,
                    opacity: [0, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 4, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-16 opacity-70"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 4 }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white/80 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                  <path d="M50 10 Q 60 30 40 50 T 60 80 Q 40 90 50 10" stroke="white" strokeWidth="2" fill="transparent" />
                  <path d="M45 15 Q 30 40 55 60 T 45 85 Q 55 90 45 15" stroke="white" strokeWidth="1.5" fill="transparent" />
                  <path d="M55 5 Q 70 20 45 40 T 55 70 Q 30 80 55 5" stroke="white" strokeWidth="1" fill="transparent" />
                </svg>
              </motion.div>
            </div>
          )}

          <motion.div 
            className="absolute bottom-0 w-full bg-blue-100/30 backdrop-blur-[2px]"
            initial={{ height: '30%' }}
            animate={{ height: alcoholAdded ? '80%' : '30%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {alcoholAdded && (
            <motion.div 
              className="absolute bottom-[30%] w-full h-2 bg-white/20 blur-sm z-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            />
          )}

          <div className="absolute bottom-0 w-full h-[30%] bg-red-500/40" />
        </div>
      </div>

      <AnimatePresence>
        {dnaVisible && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6 }}
            onClick={onNext}
            className="absolute bottom-12 bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            Spool DNA & Analyze Results <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- PHASE 5: ENHANCED RESULTS & ANALYSIS ---
function PhaseResults({ score, mistakes }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflections, setReflections] = useState({ q1: '', q2: '', q3: '' });
  const [reflectionsSaved, setReflectionsSaved] = useState(false);

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      text: "Why is dish soap used in DNA extraction?",
      options: [
        "To add flavor to the DNA",
        "To dissolve the lipid membranes of cells and nuclei",
        "To neutralize acids in the strawberry",
        "To make the DNA change color"
      ],
      correct: 1
    },
    {
      id: 2,
      text: "What is the role of salt (NaCl) in the extraction process?",
      options: [
        "To prevent bacterial growth",
        "To make the solution taste better",
        "To neutralize the negative charge on DNA, allowing it to clump together",
        "To dissolve the cell wall completely"
      ],
      correct: 2
    },
    {
      id: 3,
      text: "Why is cold alcohol used to precipitate DNA?",
      options: [
        "Because DNA is soluble in cold alcohol but not in water",
        "Because DNA is insoluble in cold alcohol, causing it to come out of solution",
        "Because alcohol breaks down DNA into smaller pieces",
        "Because alcohol changes the color of DNA to make it visible"
      ],
      correct: 1
    },
    {
      id: 4,
      text: "What does the filtration step remove from the mixture?",
      options: [
        "The DNA molecules",
        "The alcohol solution",
        "Cellular debris like cell walls and proteins",
        "The dish soap and salt"
      ],
      correct: 2
    },
    {
      id: 5,
      text: "If you forgot to add the salt during the lysis step, what would likely happen?",
      options: [
        "The DNA would not precipitate properly because the charges wouldn't be neutralized",
        "The soap would not work",
        "The strawberry would not break down",
        "The alcohol would freeze"
      ],
      correct: 0
    }
  ];

  const handleQuizAnswer = (questionId, answerIndex) => {
    if (!quizSubmitted) {
      setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    }
  };

  const calculateQuizScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleReflectionChange = (question, value) => {
    setReflections(prev => ({ ...prev, [question]: value }));
  };

  const saveReflections = () => {
    setReflectionsSaved(true);
  };

  const overallScore = Math.round((calculateQuizScore() / QUIZ_QUESTIONS.length) * 100);
  const finalLabScore = Math.min(100, Math.round((score * 0.6) + (overallScore * 0.4)));

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-full p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl max-w-5xl w-full shadow-2xl relative overflow-hidden backdrop-blur-sm">
        
        {/* Background Decorative DNA */}
        <div className="absolute -top-20 -right-20 opacity-5 text-blue-500">
          <Dna size={400} />
        </div>
        <div className="absolute -bottom-20 -left-20 opacity-5 text-emerald-500">
          <Dna size={400} />
        </div>

        {/* Header with Score */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">Extraction Complete!</h2>
                <p className="text-slate-400 text-sm">You successfully extracted strawberry DNA</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-900/50 px-4 py-2 rounded-xl text-center border border-slate-700">
                <div className="text-xs text-slate-500">Purity Score</div>
                <div className={`text-2xl font-bold ${score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {score}%
                </div>
              </div>
              <div className="bg-slate-900/50 px-4 py-2 rounded-xl text-center border border-slate-700">
                <div className="text-xs text-slate-500">Mistakes</div>
                <div className={`text-2xl font-bold ${mistakes === 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {mistakes}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'summary' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            <FileText size={18} />
            Lab Summary
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'video' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            <Play size={18} />
            Video Tutorial
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'questions' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            <HelpCircle size={18} />
            Open Questions
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-6 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            <Award size={18} />
            Quiz
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          
          {/* SUMMARY TAB */}
          {activeTab === 'summary' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-800/50">
                <h3 className="font-bold text-blue-300 flex items-center gap-2 mb-3">
                  <Info size={18} /> Lab Summary
                </h3>
                <ul className="text-sm text-blue-100/70 space-y-2 list-disc pl-5 marker:text-blue-500">
                  <li><strong>Disruption:</strong> Physical force broke cell walls.</li>
                  <li><strong>Lysis:</strong> Soap destroyed lipid membranes; salt neutralized DNA charges.</li>
                  <li><strong>Filtration:</strong> Removed proteins and cellular debris.</li>
                  <li><strong>Precipitation:</strong> Cold alcohol forced DNA out of solution, making it visible.</li>
                </ul>
              </div>
              
              <div className="bg-emerald-900/20 p-5 rounded-xl border border-emerald-800/50">
                <h3 className="font-bold text-emerald-300 flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} /> What You Observed
                </h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">
                  The white, stringy substance you saw after adding alcohol is actually millions of DNA strands 
                  clumped together! Each strand is too thin to see individually, but when they precipitate together, 
                  they form visible fibers. This is the genetic material that contains all the instructions for 
                  building and maintaining the strawberry plant.
                </p>
              </div>

              <div className="bg-slate-700/30 p-5 rounded-xl border border-slate-600">
                <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-3">
                  <Dna size={18} /> Real-World Applications
                </h3>
                <p className="text-sm text-slate-300/70 leading-relaxed">
                  DNA extraction is used in forensic science (crime scene investigation), medical diagnostics 
                  (detecting genetic disorders), paternity testing, genetic engineering, and agriculture 
                  (developing GMO crops).
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors"
                >
                  <RefreshCcw size={18} /> Restart Experiment
                </button>
              </div>
            </motion.div>
          )}

          {/* VIDEO TAB - Now with the working VideoTab component */}
          {activeTab === 'video' && (
            <VideoTab 
              videoSrc={strawberry}
              videoTitle="Strawberry DNA Extraction Tutorial"
            />
          )}

          {/* OPEN QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">
                  <HelpCircle size={16} className="inline mr-1" /> 
                  Answer the following questions to reflect on your learning experience.
                </p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                <label className="block font-bold text-blue-300 mb-3">
                  1. Why do you think we used a strawberry for this experiment instead of another fruit or vegetable?
                </label>
                <textarea
                  value={reflections.q1}
                  onChange={(e) => handleReflectionChange('q1', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  rows="3"
                  placeholder="Type your answer here..."
                />
              </div>

              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                <label className="block font-bold text-blue-300 mb-3">
                  2. What do you think would happen if you used warm alcohol instead of cold alcohol during precipitation?
                </label>
                <textarea
                  value={reflections.q2}
                  onChange={(e) => handleReflectionChange('q2', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  rows="3"
                  placeholder="Type your answer here..."
                />
              </div>

              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                <label className="block font-bold text-blue-300 mb-3">
                  3. How could this DNA extraction process be useful in real life? Give at least two examples.
                </label>
                <textarea
                  value={reflections.q3}
                  onChange={(e) => handleReflectionChange('q3', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  rows="3"
                  placeholder="Type your answer here..."
                />
              </div>

              <button
                onClick={saveReflections}
                disabled={reflectionsSaved}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  reflectionsSaved 
                    ? 'bg-emerald-500/20 text-emerald-400 cursor-default' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {reflectionsSaved ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                {reflectionsSaved ? 'Reflections Saved!' : 'Save Reflections'}
              </button>
            </motion.div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700 flex justify-between items-center flex-wrap gap-2">
                <p className="text-sm text-slate-400">
                  <Award size={16} className="inline mr-1" /> 
                  Test your understanding of DNA extraction!
                </p>
                {quizSubmitted && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">Score: {calculateQuizScore()}/{QUIZ_QUESTIONS.length}</span>
                    <span className="text-xs text-slate-500">({overallScore}%)</span>
                  </div>
                )}
              </div>

              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                  <p className="font-bold text-white mb-3">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          quizAnswers[q.id] === optIdx
                            ? quizSubmitted
                              ? optIdx === q.correct
                                ? 'bg-emerald-500/20 border border-emerald-400'
                                : 'bg-red-500/20 border border-red-400'
                              : 'bg-blue-500/20 border border-blue-400'
                            : quizSubmitted && optIdx === q.correct
                            ? 'bg-emerald-500/20 border border-emerald-400'
                            : 'hover:bg-slate-700/50 border border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          value={optIdx}
                          checked={quizAnswers[q.id] === optIdx}
                          onChange={() => handleQuizAnswer(q.id, optIdx)}
                          disabled={quizSubmitted}
                          className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className={`text-sm ${quizSubmitted && optIdx === q.correct ? 'text-emerald-300' : quizSubmitted && quizAnswers[q.id] === optIdx && optIdx !== q.correct ? 'text-red-300 line-through' : 'text-slate-300'}`}>
                          {option}
                        </span>
                        {quizSubmitted && optIdx === q.correct && (
                          <CheckCircle size={16} className="text-emerald-400 ml-auto" />
                        )}
                        {quizSubmitted && quizAnswers[q.id] === optIdx && optIdx !== q.correct && (
                          <XCircle size={16} className="text-red-400 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  Submit Quiz
                </button>
              ) : (
                <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/30 p-5 rounded-xl border border-blue-800/50 text-center">
                  <p className="text-lg font-bold text-white mb-2">
                    Final Lab Score: {finalLabScore}%
                  </p>
                  <p className="text-sm text-slate-400">
                    {finalLabScore >= 90 ? "🌟 Excellent work! You're a DNA extraction expert!" :
                     finalLabScore >= 70 ? "👍 Good job! Review the concepts to become an expert." :
                     "📚 Keep learning! Review the lab steps and try again."}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto transition-colors"
                  >
                    <RefreshCcw size={16} /> Restart Experiment
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

// --- SHARED UI COMPONENTS ---
function EducationalModal({ content, onClose }) {
  if (!content) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-slate-700 rounded-xl">{content.icon}</div>
          <h3 className="text-xl font-bold text-white">{content.title}</h3>
        </div>
        <p className="text-slate-300 leading-relaxed mb-8">{content.text}</p>
        
        <button 
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}