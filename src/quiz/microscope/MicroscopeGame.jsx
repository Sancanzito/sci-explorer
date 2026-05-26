import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroscopeStore } from './store/useMicroscopeStore';

// --- Global Graphics Dictionary ---
const partGraphics = {
  eyepiece: {
    viewBox: '120 0 150 250',
    content: (isBlueprint, isActive) => (
      <g>
        <polygon points="180,120 220,120 230,220 170,220" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#e2e8f0"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="4" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        <rect x="160" y="220" width="80" height="15" rx="5" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#94a3b8"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "none"} strokeWidth="3" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        <g transform="rotate(-30 180 120)">
          <rect x="165" y="40" width="30" height="100" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#cbd5e1"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="4" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
          <rect x="160" y="20" width="40" height="20" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#1e293b"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "none"} strokeWidth="3" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        </g>
      </g>
    )
  },
  arm: {
    viewBox: '190 110 190 360',
    content: (isBlueprint, isActive) => (
      <path d="M330,460 L360,250 C370,180 320,120 250,120 L200,120 L200,160 L250,160 C290,160 320,200 310,260 L280,460 Z" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#cbd5e1"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="4" strokeDasharray={isBlueprint ? "8,4" : "0"}/>
    )
  },
  objectives: {
    viewBox: '150 220 90 90',
    content: (isBlueprint, isActive) => (
      <>
        <polygon points="170,235 190,290 160,290" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#e2e8f0"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="2" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        <polygon points="190,235 210,300 180,300" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#f8fafc"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="2" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        <polygon points="210,235 230,280 200,280" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#e2e8f0"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="2" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
      </>
    )
  },
  stage: {
    viewBox: '130 310 160 35',
    content: (isBlueprint, isActive) => (
      <rect x="140" y="320" width="140" height="15" rx="5" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#1e293b"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "none"} strokeWidth="2" strokeDasharray={isBlueprint ? "6,4" : "0"} />
    )
  },
  stageClips: { // NEW
    viewBox: '150 305 120 20',
    content: (isBlueprint, isActive) => (
      <g>
        <rect x="160" y="315" width="25" height="5" rx="2" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#94a3b8"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#64748b") : "#475569"} strokeWidth="2" strokeDasharray={isBlueprint ? "4,2" : "0"}/>
        <rect x="235" y="315" width="25" height="5" rx="2" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#94a3b8"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#64748b") : "#475569"} strokeWidth="2" strokeDasharray={isBlueprint ? "4,2" : "0"}/>
      </g>
    )
  },
  condenser: { // NEW
    viewBox: '180 330 60 60',
    content: (isBlueprint, isActive) => (
      <path d="M190,335 L230,335 L220,380 L200,380 Z" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#475569"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#1e293b"} strokeWidth="3" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
    )
  },
  slide: {
    viewBox: '170 300 80 30',
    content: (isBlueprint, isActive) => (
      <rect x="180" y="310" width="60" height="6" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#38bdf8"} opacity={isBlueprint ? 1 : 0.8} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#0284c7"} strokeWidth="2" strokeDasharray={isBlueprint ? "4,2" : "0"}/>
    )
  },
  focus: {
    viewBox: '270 360 80 80',
    content: (isBlueprint, isActive) => (
      <>
        <circle cx="310" cy="400" r="35" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#334155"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#1e293b"} strokeWidth="3" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
        <circle cx="310" cy="400" r="20" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#64748b"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#334155"} strokeWidth="2" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
      </>
    )
  },
  lamp: {
    viewBox: '190 390 90 80',
    content: (isBlueprint, isActive) => (
      <path d="M200,460 Q235,400 270,460 Z" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#fde047"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#eab308"} strokeWidth="3" strokeDasharray={isBlueprint ? "6,4" : "0"}/>
    )
  },
  base: {
    viewBox: '100 450 290 90',
    content: (isBlueprint, isActive) => (
      <path d="M120,530 L350,530 C370,530 380,510 370,490 L340,460 L140,460 L110,490 C100,510 110,530 120,530 Z" fill={isBlueprint ? (isActive ? "rgba(59,130,246,0.2)" : "transparent") : "#e2e8f0"} stroke={isBlueprint ? (isActive ? "#3b82f6" : "#94a3b8") : "#64748b"} strokeWidth="4" strokeDasharray={isBlueprint ? "8,4" : "0"}/>
    )
  }
};

// --- Cursor Ghost Component (Shows what you are holding) ---
const CursorGhost = () => {
  const selectedPart = useMicroscopeStore(state => state.selectedPart);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (selectedPart) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [selectedPart]);

  if (!selectedPart) return null;

  const graphics = partGraphics[selectedPart];

  return (
    <div
      className="fixed pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 drop-shadow-2xl opacity-80"
      style={{ left: mousePos.x, top: mousePos.y }}
    >
      <svg viewBox={graphics.viewBox} className="w-full h-full">
        {graphics.content(false, false)}
      </svg>
    </div>
  );
};

// --- Shape Click Component (Toolbox) ---
const ClickableShape = ({ part, isSelected, onSelect }) => {
  const graphics = partGraphics[part.id];

  return (
    <div
      onClick={() => onSelect(part.id)}
      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 w-24 h-24 p-2 rounded-xl
        ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40 scale-110 shadow-lg ring-2 ring-blue-400 opacity-50' : 'hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800'}
      `}
    >
      <svg viewBox={graphics.viewBox} className="w-full h-full drop-shadow-md overflow-visible pointer-events-none">
        {graphics.content(false, false)}
      </svg>
      <span className="absolute -bottom-4 text-[10px] md:text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded shadow-sm">
        {part.label}
      </span>
    </div>
  );
};

// --- SVG Blueprint Zone Component (Canvas) ---
const BlueprintZone = ({ id, currentPartId, isPartSelected, onPlace, onRemove }) => {
  const isPlaced = currentPartId === id;
  const graphics = partGraphics[id];
  const [x, y, w, h] = graphics.viewBox.split(' ');

  return (
    <g 
      onClick={(e) => {
        e.stopPropagation(); // Prevent canvas background clicks from interfering
        if (isPartSelected && !isPlaced) {
           onPlace(id);
        } else if (isPlaced) {
          onRemove(id);
        }
      }} 
      className={`transition-all duration-300 ${isPartSelected && !isPlaced ? 'cursor-crosshair' : isPlaced ? 'cursor-pointer' : ''}`}
    >
      {isPlaced ? (
        <g className="filter drop-shadow-md hover:brightness-110 transition-all">
           {graphics.content(false, false)}
        </g>
      ) : (
        <g className={isPartSelected ? 'animate-pulse' : 'opacity-60'}>
           {graphics.content(true, isPartSelected)}
           <rect x={x} y={y} width={w} height={h} fill="transparent" />
        </g>
      )}
    </g>
  );
};

// --- Main Game Component ---
const MicroscopeGame = () => {
  const { parts, placedParts, selectedPart, selectPart, placePart, removePart, resetGame, score, mistakes } = useMicroscopeStore();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const correctlyPlaced = parts.every(part => placedParts[part.id] === part.id);
    setIsComplete(correctlyPlaced && Object.keys(placedParts).length === parts.length);
  }, [placedParts, parts]);

  const availableParts = parts.filter(part => !Object.values(placedParts).includes(part.id));

  // Handle clicking empty space to deselect
  const handleBackgroundClick = () => {
    if (selectedPart) selectPart(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[700px]">
      <CursorGhost /> {/* Renders the selected part at the mouse position */}
      
      {/* Left Side: Toolbox */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold dark:text-white">Build the Microscope</h2>
          
          {/* Score Board */}
          <div className="bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-lg text-center">
            <span className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Score</span>
            <span className="block text-2xl font-black text-blue-800 dark:text-blue-300">{score}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          1. <strong>Click</strong> a part to pick it up.<br/>
          2. <strong>Click</strong> the matching blueprint to drop it.<br/>
          <em>(+10 for correct, -5 for mistakes)</em>
        </p>
        
        <div className="flex-1 rounded-xl p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-x-4 gap-y-12 place-items-center overflow-y-auto min-h-[400px]">
          <AnimatePresence>
            {availableParts.map(part => (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <ClickableShape 
                  part={part} 
                  isSelected={selectedPart === part.id}
                  onSelect={selectPart} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {availableParts.length === 0 && !isComplete && (
            <div className="col-span-2 text-center text-gray-500 mt-10">Check your placements! Click a placed part to return it.</div>
          )}
        </div>
        
        <button 
          onClick={resetGame}
          className="mt-8 w-full py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
        >
          Clear Workbench
        </button>
      </div>

      {/* Right Side: Unified SVG Blueprint Canvas */}
      <div 
        onClick={handleBackgroundClick}
        className={`w-full lg:w-2/3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-xl p-6 relative overflow-hidden flex items-center justify-center min-h-[600px] border border-slate-200 dark:border-slate-700 ${selectedPart ? 'cursor-crosshair' : ''}`}
      >
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 bg-green-500/90 flex flex-col items-center justify-center text-white backdrop-blur-sm"
            >
              <motion.h2 initial={{ y: -20 }} animate={{ y: 0 }} className="text-5xl font-bold mb-4">
                Excellent! 🔬
              </motion.h2>
              <p className="text-xl mb-4 font-medium">Microscope fully assembled.</p>
              <p className="text-3xl font-black mb-8 bg-white/20 px-6 py-2 rounded-xl">Final Score: {score}</p>
              <button 
                onClick={resetGame} 
                className="px-8 py-4 bg-white text-green-600 rounded-full font-bold shadow-xl hover:scale-105 transition-transform text-lg"
              >
                Assemble Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-lg aspect-[5/6]">
          <svg viewBox="0 0 500 600" className="absolute inset-0 w-full h-full drop-shadow-xl overflow-visible">
            {/* Render all structural Blueprint Zones */}
            {parts.map(part => (
              <BlueprintZone 
                key={part.id} 
                id={part.id} 
                currentPartId={placedParts[part.id]}
                isPartSelected={!!selectedPart}
                onPlace={placePart}
                onRemove={removePart}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MicroscopeGame;