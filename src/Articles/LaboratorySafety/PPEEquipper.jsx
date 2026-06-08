import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PPEEquipper = () => {
  const [equipment, setEquipment] = useState({
    goggles: false,
    labCoat: false,
    gloves: false,
    shoes: false
  });

  const toggleEquipment = (item) => {
    setEquipment(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const isFullyEquipped = Object.values(equipment).every(Boolean);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 my-6">
      
      {/* Avatar Display */}
      <div className="relative w-48 h-64 bg-white dark:bg-gray-900 rounded-xl shadow-inner border-2 border-gray-200 dark:border-gray-700 flex justify-center items-end pb-4 overflow-hidden shrink-0">
        {/* Base Person */}
        <svg viewBox="0 0 100 150" className="w-32 h-48 text-gray-300 dark:text-gray-600">
          <circle cx="50" cy="30" r="15" fill="currentColor" />
          <path d="M30 60 Q50 50 70 60 L80 110 L20 110 Z" fill="currentColor" />
          <rect x="35" y="110" width="10" height="30" fill="currentColor" />
          <rect x="55" y="110" width="10" height="30" fill="currentColor" />
        </svg>

        {/* Dynamic PPE Overlays */}
        {equipment.labCoat && (
          <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewBox="0 0 100 150" className="absolute w-32 h-48 text-white stroke-gray-300 dark:stroke-gray-500 drop-shadow-md">
            <path d="M28 58 Q50 48 72 58 L82 115 L18 115 Z" fill="currentColor" strokeWidth="2" />
            <line x1="50" y1="55" x2="50" y2="115" stroke="currentColor" strokeWidth="2" />
          </motion.svg>
        )}
        
        {equipment.goggles && (
          <motion.svg initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} viewBox="0 0 100 150" className="absolute w-32 h-48 text-blue-400/60">
            <rect x="38" y="25" width="10" height="6" rx="2" fill="currentColor" stroke="#3b82f6" strokeWidth="1"/>
            <rect x="52" y="25" width="10" height="6" rx="2" fill="currentColor" stroke="#3b82f6" strokeWidth="1"/>
            <line x1="48" y1="28" x2="52" y2="28" stroke="#3b82f6" strokeWidth="1"/>
          </motion.svg>
        )}

        {equipment.gloves && (
          <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewBox="0 0 100 150" className="absolute w-32 h-48 text-cyan-500">
            <circle cx="25" cy="105" r="6" fill="currentColor" />
            <circle cx="75" cy="105" r="6" fill="currentColor" />
          </motion.svg>
        )}

        {equipment.shoes && (
          <motion.svg initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} viewBox="0 0 100 150" className="absolute w-32 h-48 text-gray-800 dark:text-black">
            <path d="M33 135 L47 135 L47 142 L33 142 Z" fill="currentColor" />
            <path d="M53 135 L67 135 L67 142 L53 142 Z" fill="currentColor" />
          </motion.svg>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interactive PPE Checklist</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Select the necessary equipment for handling hazardous chemical reagents before entering the lab.</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(equipment).map((item) => (
            <button
              key={item}
              onClick={() => toggleEquipment(item)}
              className={`p-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                equipment[item] 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border-transparent' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-500'
              }`}
            >
              {item.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
            </button>
          ))}
        </div>
        
        {isFullyEquipped && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 mt-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-bold text-center">
            ✓ Fully Equipped and Cleared for Laboratory Entry!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PPEEquipper;