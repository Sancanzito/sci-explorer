// pages/HomePage/components/SolarSystemModel.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SolarSystemModel = () => {
  const planets = [
    { name: "Mercury", size: 4, distance: 30, color: "#b87333", speed: 4.8 },
    { name: "Venus", size: 6, distance: 45, color: "#e6b800", speed: 3.5 },
    { name: "Earth", size: 7, distance: 60, color: "#4d9eff", speed: 3.0 },
    { name: "Mars", size: 5, distance: 75, color: "#cc5533", speed: 2.4 },
    { name: "Jupiter", size: 14, distance: 100, color: "#d8a27a", speed: 1.3 },
    { name: "Saturn", size: 12, distance: 125, color: "#f0e68c", speed: 1.0 }
  ];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 border border-indigo-500/20 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xl">🪐</div>
        <h3 className="font-semibold text-gray-800 dark:text-white">Solar System Orbit Model</h3>
      </div>
      
      <div className="relative flex items-center justify-center min-h-[300px]">
        {/* Sun */}
        <div className="absolute w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl animate-pulse">
          <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-50" />
        </div>
        
        {/* Orbits & Planets */}
        {planets.map((planet, idx) => (
          <motion.div
            key={planet.name}
            className="absolute rounded-full"
            style={{
              width: planet.distance * 2,
              height: planet.distance * 2,
              border: "1px dashed rgba(255,255,255,0.2)",
              position: "absolute"
            }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                boxShadow: `0 0 10px ${planet.color}`,
                top: -planet.size / 2,
                left: planet.distance - planet.size / 2,
              }}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: planet.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {planet.name === "Saturn" && (
                <div className="absolute -top-1 -left-3 w-10 h-3 border-2 border-yellow-200/50 rounded-full transform -rotate-12" />
              )}
            </motion.div>
          </motion.div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-0 left-0 text-[8px] text-gray-500 dark:text-gray-400">
          <p>🪐 Planets orbiting at relative speeds</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SolarSystemModel;