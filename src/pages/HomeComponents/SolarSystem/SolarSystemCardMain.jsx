// SolarSystemCardMain.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { backdropVariants, cardVariants, contentFade } from './SolarSystemCardAnimations';

const SolarSystemCardMain = ({ planet, onClose }) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state when the planet changes
  useEffect(() => {
    setImageError(false);
  }, [planet]);

  if (!planet) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        variants={cardVariants}
        className="relative w-full max-w-lg bg-gray-900 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all hover:rotate-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Planet Visual Header */}
        <div className="relative h-64 flex items-center justify-center overflow-hidden bg-slate-950">
          {/* Background Aura */}
          <div 
            className="w-48 h-48 rounded-full blur-[80px] opacity-40 absolute"
            style={{ backgroundColor: planet.color }}
          />
          
          <motion.div 
            className="w-40 h-40 rounded-full relative z-10 overflow-hidden shadow-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            {!imageError ? (
              <img 
                src={planet.imageUrl} 
                alt={planet.imageAlt}
                className="w-full h-full object-cover scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Fallback to original CSS look */
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundColor: planet.color,
                  boxShadow: `inset -15px -15px 30px rgba(0,0,0,0.8), inset 5px 5px 20px rgba(255,255,255,0.2)`
                }}
              />
            )}
          </motion.div>

          {/* Ring Support for Saturn */}
          {planet.hasRings && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[60px] border-[4px] border-amber-100/10 rounded-[100%] rotate-[20deg] z-20 pointer-events-none" />
          )}
        </div>

        {/* Info Content */}
        <div className="p-8 space-y-4">
          <motion.div variants={contentFade}>
            <div className="flex items-end justify-between mb-2">
              <h2 className="text-4xl font-black text-white italic tracking-tighter">{planet.name}</h2>
              <span className="text-xs font-mono text-indigo-400 mb-1 tracking-widest uppercase">Index: 0{planet.distance/10}</span>
            </div>
            
            <div className="h-1 w-16 rounded-full mb-6" style={{ backgroundColor: planet.color }} />
            
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              {planet.desc}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Orbit Distance</span>
                <p className="text-white font-mono text-lg">{planet.distance}M km</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Orbital Speed</span>
                <p className="text-white font-mono text-lg">{planet.speed}u</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SolarSystemCardMain;