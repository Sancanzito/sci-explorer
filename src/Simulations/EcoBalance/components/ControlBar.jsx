// games/EcoBalance/components/ControlBar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const ControlBar = ({ onOpenInterventions }) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const { isRunning, simulationSpeed, toggleSimulation, setSimulationSpeed, resetSimulation, ecosystemHealth } = useGameStore();
  
  const getHealthEmoji = () => {
    if (ecosystemHealth > 70) return '🌿 Thriving';
    if (ecosystemHealth > 30) return '⚠️ Stressed';
    return '💀 Collapsing';
  };
  
  const getHealthColor = () => {
    if (ecosystemHealth > 70) return 'text-green-400';
    if (ecosystemHealth > 30) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="bg-black/80 backdrop-blur-md border-t border-white/20">
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Left - Simulation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSimulation}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
          >
            {isRunning ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-700 rounded-lg font-semibold text-white hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            🔄 Reset
          </button>
          
          {/* Speed Control */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-4 py-2 bg-gray-700 rounded-lg font-semibold text-white hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              ⚡ {simulationSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                {[0.5, 1, 2, 4].map(speed => (
                  <button
                    key={speed}
                    onClick={() => {
                      setSimulationSpeed(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${simulationSpeed === speed ? 'bg-green-600' : ''}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Center - Health Status */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">Ecosystem Health:</div>
          <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${ecosystemHealth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className={`font-bold ${getHealthColor()}`}>
            {getHealthEmoji()} ({Math.round(ecosystemHealth)}%)
          </div>
        </div>
        
        {/* Right - Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInterventions}
            className="px-4 py-2 bg-purple-600 rounded-lg font-semibold text-white hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            🎮 Apply Intervention
          </button>
        </div>
      </div>
      
      {/* Quick Tips Bar */}
      <div className="bg-black/40 px-4 py-1 text-center">
        <p className="text-xs text-gray-400">
          💡 <strong>Quick Tip:</strong> Hover over any organism to see its stats. Watch the event log to understand cause and effect!
        </p>
      </div>
    </div>
  );
};

export default ControlBar;