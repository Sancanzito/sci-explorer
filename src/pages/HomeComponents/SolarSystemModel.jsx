// SolarSystemModel.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { planetCardData } from './SolarSystem/SolarSystemCardData';
import { SunGlow, SunCore, OrbitalRing, OrbitingPlanet, StarField } from './SolarSystem/SolarSystemAnimations';

const SolarSystemModel = () => {
  const [activePlanet, setActivePlanet] = useState(null); 
  const [selectedPlanet, setSelectedPlanet] = useState(null); 
  const [showFullSystem, setShowFullSystem] = useState(false); 
  const [imageError, setImageError] = useState(false); // New state for image handling

  // Reset image error state when a new planet is selected
  useEffect(() => {
    setImageError(false);
  }, [selectedPlanet]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col gap-4 items-center justify-center relative">
      
      {/* Simulation Container - LEFT UNTOUCHED AS REQUESTED */}
      <div 
        className="relative w-full aspect-square flex items-center justify-center bg-slate-950 dark:bg-black/60 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group transition-all duration-500 hover:border-indigo-500/30"
        onClick={() => setShowFullSystem(true)}
      >
        <StarField />
        
        <div className="relative z-10 pointer-events-none scale-75 md:scale-100">
          <SunGlow />
          <SunCore />
        </div>
        
        {planetCardData.map((p) => (
          <OrbitalRing key={p.name} distance={p.distance}>
            <div className="w-full h-full relative pointer-events-none">
              <div 
                className="w-full h-full absolute top-0 left-0 pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlanet(p);
                  setShowFullSystem(true);
                }}
              >
                <OrbitingPlanet
                  planet={p}
                  timeScale={1}
                  onHoverStart={setActivePlanet}
                  onHoverEnd={() => setActivePlanet(null)}
                />
              </div>
            </div>
          </OrbitalRing>
        ))}

        <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">
              {activePlanet ? `Tracking: ${activePlanet.name}` : "System Live"}
            </p>
          </div>
        </div>
      </div>

      {/* FULL SYSTEM EXPLORER MODAL - IMPLEMENTED WITH IMAGES */}
      <AnimatePresence>
        {showFullSystem && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-gray-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowFullSystem(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl h-[85vh] bg-gray-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT: Planet Selection Sidebar */}
              <div className="w-full md:w-80 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter">ORBIT_INDEX</h2>
                  <div className="h-1 w-12 bg-indigo-500 mt-1" />
                </div>
                
                <div className="space-y-3">
                  {planetCardData.map(p => (
                    <button 
                      key={p.name}
                      onClick={() => setSelectedPlanet(p)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${
                        selectedPlanet?.name === p.name 
                        ? 'bg-indigo-500/20 border border-indigo-500/40' 
                        : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {/* Sidebar Preview with Image Fallback */}
                      <div 
                        className="w-10 h-10 rounded-full shrink-0 shadow-lg overflow-hidden border border-white/10" 
                        style={{ backgroundColor: p.color }}
                      >
                         <img 
                            src={p.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'} 
                         />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold text-sm leading-none">{p.name}</p>
                        <p className="text-[9px] text-gray-500 uppercase mt-1">{p.distance}m KM</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: Detail View Area */}
              <div className="flex-1 relative overflow-y-auto bg-gradient-to-br from-transparent to-indigo-950/10">
                <button 
                  onClick={() => setShowFullSystem(false)}
                  className="absolute top-6 right-6 z-50 text-white/30 hover:text-white transition-transform hover:rotate-90 p-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>

                <AnimatePresence mode="wait">
                  {selectedPlanet ? (
                    <motion.div 
                      key={selectedPlanet.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-8 md:p-12 h-full flex flex-col"
                    >
                      <div className="grid lg:grid-cols-2 gap-12 items-center my-auto">
                        {/* Visual Side with Image Implementation */}
                        <div className="relative group">
                          <div 
                            className="absolute inset-0 blur-[100px] opacity-20 rounded-full" 
                            style={{ backgroundColor: selectedPlanet.color }} 
                          />
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="w-48 h-48 md:w-72 md:h-72 rounded-full mx-auto relative z-10 overflow-hidden border-b-4 border-white/10 shadow-2xl"
                          >
                            {!imageError ? (
                              <img 
                                src={selectedPlanet.imageUrl} 
                                alt={selectedPlanet.imageAlt}
                                className="w-full h-full object-cover scale-110"
                                onError={() => setImageError(true)}
                              />
                            ) : (
                              /* Fallback to CSS gradient if image fails */
                              <div 
                                className="w-full h-full"
                                style={{ 
                                  backgroundColor: selectedPlanet.color,
                                  boxShadow: `inset -20px -20px 50px rgba(0,0,0,0.8)` 
                                }}
                              />
                            )}
                          </motion.div>
                          {selectedPlanet.hasRings && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[30%] border-[4px] border-white/10 rounded-[100%] rotate-[20deg] z-20 pointer-events-none" />
                          )}
                        </div>

                        {/* Text Side */}
                        <div className="space-y-6">
                          <div>
                            <span className="text-indigo-400 font-mono text-xs tracking-widest uppercase mb-2 block">Planet Classification</span>
                            <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">{selectedPlanet.name}</h3>
                          </div>
                          
                          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            {selectedPlanet.desc}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-tighter">Distance from Sun</p>
                              <p className="text-xl text-white font-mono">{selectedPlanet.distance}M km</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-tighter">Orbital Speed</p>
                              <p className="text-xl text-white font-mono">{selectedPlanet.speed} units</p>
                            </div>
                          </div>

                          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase">Scientific Trivia</span>
                            <p className="text-gray-300 italic mt-1">"{selectedPlanet.fact}"</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 animate-spin-slow flex items-center justify-center mb-6">
                         <div className="w-4 h-4 bg-indigo-500 rounded-full" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Select a Celestial Body</h3>
                      <p className="text-gray-500 max-w-xs mt-2">Pick a planet from the index to begin deep space scanning and data retrieval.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center bg-white/5 backdrop-blur-sm py-2 px-6 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          Click Space for <span className="text-indigo-600 dark:text-indigo-400 font-bold">System Explorer</span>
        </p>
      </div>
    </div>
  );
};

export default SolarSystemModel;