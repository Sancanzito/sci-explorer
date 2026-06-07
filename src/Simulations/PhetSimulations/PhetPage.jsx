// src/Simulations/Phet/PhetSimulations.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, X, Leaf, Zap, Globe, BookOpen, Target } from 'lucide-react';

// --- REUSABLE PHET WRAPPER COMPONENT ---
const PhetLayout = ({ title, icon: Icon, iframeSrc, themeColor, educationalContent }) => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden text-slate-200">
      {/* Top Navigation */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10"
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/simulations')} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} className={themeColor} />
          </button>
          <div className="flex items-center gap-2">
            <Icon className={themeColor} size={24} />
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Info size={20} />
        </button>
      </motion.div>

      <div className="flex-1 relative flex">
        {/* Educational Sidebar */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ x: -350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -350, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-4 top-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 flex flex-col overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen size={18} className={themeColor} /> Lab Briefing
                </h2>
                <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-6 text-sm text-slate-300">
                {educationalContent}
                
                <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500 italic">
                  Simulation provided by PhET Interactive Simulations, University of Colorado Boulder.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PhET iframe */}
        <div className="w-full h-full bg-black">
          <iframe
            src={iframeSrc}
            title={title}
            className="w-full h-full border-none"
            allow="fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// --- 1. BIOLOGY: NATURAL SELECTION ---
export const NaturalSelectionSim = () => (
  <PhetLayout 
    title="Evolution: Natural Selection Lab"
    icon={Leaf}
    themeColor="text-emerald-400"
    iframeSrc="https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html"
    educationalContent={
      <>
        <p>Explore how genetic mutations and environmental factors drive evolution in a population of bunnies.</p>
        <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/50">
          <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2"><Target size={16}/> Student Challenges</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li>Introduce a mutation for <strong>brown fur</strong>. Are they more likely to survive in the arctic or equator environment?</li>
            <li>Add wolves to the environment. How does predation affect the frequency of the "long teeth" trait?</li>
          </ul>
        </div>
      </>
    }
  />
);

// --- 2. PHYSICS: ENERGY SKATE PARK ---
export const EnergySkateParkSim = () => (
  <PhetLayout 
    title="Physics: Energy Conservation"
    icon={Zap}
    themeColor="text-amber-400"
    iframeSrc="https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_all.html"
    educationalContent={
      <>
        <p>Build tracks and ramps to observe the relationship between Kinetic Energy, Potential Energy, and friction.</p>
        <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-900/50">
          <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2"><Target size={16}/> Student Challenges</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li>Turn on the Pie Chart view. Notice when Potential Energy is at its absolute maximum.</li>
            <li>Switch to the "Friction" tab. How does thermal energy affect the skater's maximum height over time?</li>
            <li>What happens to the total energy when you drop the skater from space?</li>
          </ul>
        </div>
      </>
    }
  />
);

// --- 3. EARTH & SPACE: GRAVITY & ORBITS ---
export const GravityOrbitsSim = () => (
  <PhetLayout 
    title="Astrophysics: Gravity & Orbits"
    icon={Globe}
    themeColor="text-cyan-400"
    iframeSrc="https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html"
    educationalContent={
      <>
        <p>Visualize the gravitational force that keeps our solar system together. Manipulate mass and distance to see how it affects orbital paths.</p>
        <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-900/50">
          <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2"><Target size={16}/> Student Challenges</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li>Turn on the Gravity Force arrows. Why does the arrow point from the Earth to the Sun?</li>
            <li>Double the mass of the Sun. What happens to the Earth's orbit? Can you prevent the Earth from crashing?</li>
            <li>Turn off gravity entirely. Watch what happens to the Earth's trajectory (inertia).</li>
          </ul>
        </div>
      </>
    }
  />
);