// SolarSystemAnimations.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const SunGlow = () => (
  <motion.div
    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="absolute w-32 h-32 bg-amber-500 rounded-full blur-3xl"
  />
);

export const SunCore = () => (
  <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 via-yellow-400 to-white rounded-full shadow-[0_0_50px_rgba(245,158,11,0.8)] z-10" />
);

export const OrbitalRing = ({ distance, children }) => (
  <div
    className="absolute rounded-full border border-white/5 pointer-events-none"
    style={{ 
        width: `calc(var(--scale-factor, 1) * ${distance * 2}px)`, 
        height: `calc(var(--scale-factor, 1) * ${distance * 2}px)` 
    }}
  >
    {children}
  </div>
);

export const OrbitingPlanet = ({ planet, timeScale, onHoverStart, onHoverEnd }) => (
  <motion.div
    className="absolute w-full h-full pointer-events-none"
    animate={{ rotate: 360 }}
    transition={{
      duration: planet.speed / (timeScale || 1),
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <motion.button
      onMouseEnter={() => onHoverStart(planet)}
      onMouseLeave={onHoverEnd}
      whileHover={{ scale: 1.2 }}
      className="absolute cursor-pointer rounded-full outline-none pointer-events-auto"
      style={{
        width: `calc(var(--scale-factor, 1) * ${planet.size}px)`,
        height: `calc(var(--scale-factor, 1) * ${planet.size}px)`,
        backgroundColor: planet.color,
        top: '50%',
        left: '100%',
        transform: 'translate(-50%, -50%)',
        boxShadow: `inset -2px -2px 6px rgba(0,0,0,0.7), 0 0 12px ${planet.color}44`,
        zIndex: 50,
      }}
    >
      {planet.hasRings && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[40%] border-[2px] border-amber-100/20 rounded-[100%] rotate-[25deg] pointer-events-none" />
      )}
    </motion.button>
  </motion.div>
);

export const StarField = () => (
  <div className="absolute inset-0 opacity-30 pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div 
        key={i}
        className="absolute bg-white rounded-full"
        style={{
          width: Math.random() * 2 + 'px',
          height: Math.random() * 2 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          opacity: Math.random()
        }}
      />
    ))}
  </div>
);