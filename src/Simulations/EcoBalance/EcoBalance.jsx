// games/EcoBalance/EcoBalanceGame.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useAudioManager } from './hooks/useAudioManager';
import AnimatedEcosystem from './components/AnimatedEcosystem';
import ControlBar from './components/ControlBar';
import EventFeed from './components/EventFeed';
import InterventionPanel from './components/InterventionPanel';
import StatisticsDashboard from './components/StatisticsDashboard';
import SpeciesModal from './components/SpeciesModal';
import EcosystemReport from './components/EcosystemReport';

const EcoBalanceGame = () => {
  const [showReport, setShowReport] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [showInterventions, setShowInterventions] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false); // NEW: Event log state
  
  const { isRunning, simulationSpeed, ecosystemHealth, updateEcosystem, events } = useGameStore();
  const { playSound } = useAudioManager();
  
  // Simulation loop
  useEffect(() => {
    let intervalId;
    const updateInterval = 3000 / simulationSpeed;
    
    const runUpdate = () => {
      if (isRunning) {
        updateEcosystem();
        if (ecosystemHealth < 10 && ecosystemHealth > 0) {
          playSound('warning');
        }
      }
    };
    
    intervalId = setInterval(runUpdate, updateInterval);
    return () => clearInterval(intervalId);
  }, [isRunning, simulationSpeed, updateEcosystem, ecosystemHealth, playSound]);
  
  // Check for collapse
  useEffect(() => {
    if (ecosystemHealth <= 0 && !showReport) {
      setShowReport(true);
      playSound('collapse');
    }
  }, [ecosystemHealth, showReport, playSound]);
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Main Game Area */}
      <div className="flex-1 relative min-h-0">
        <AnimatedEcosystem onSpeciesClick={setSelectedSpecies} />
        
        {/* Floating UI Panels */}
        <AnimatePresence>
          {/* Statistics Dashboard Panel */}
          {showDashboard && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              className="absolute left-4 top-4 bottom-4 w-80 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-20"
            >
              <div className="p-3 border-b border-white/20 flex justify-between items-center bg-black/50">
                <h2 className="font-bold text-green-400">📊 Statistics Dashboard</h2>
                <button onClick={() => setShowDashboard(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="p-3 overflow-y-auto h-full bg-black/30">
                <StatisticsDashboard />
              </div>
            </motion.div>
          )}
          
          {/* Interventions Panel */}
          {showInterventions && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-4 top-4 bottom-4 w-96 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-20"
            >
              <div className="p-3 border-b border-white/20 flex justify-between items-center bg-black/50">
                <h2 className="font-bold text-purple-400">🎮 Ecological Interventions</h2>
                <button onClick={() => setShowInterventions(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="p-3 overflow-y-auto h-full bg-black/30">
                <InterventionPanel />
              </div>
            </motion.div>
          )}
          
          {/* Event Log Panel - NEW: Now disposable like others */}
          {showEventLog && (
            <motion.div
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[500px] max-w-[90vw] bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-20"
            >
              <div className="p-3 border-b border-white/20 flex justify-between items-center bg-black/50">
                <h2 className="font-bold text-blue-400">📋 Ecosystem Event Log</h2>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400">{events.length} events</span>
                  <button onClick={() => setShowEventLog(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
              </div>
              <div className="h-96 overflow-y-auto">
                <EventFeed />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Quick Action Buttons - Updated with Event Log button */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-green-600 transition-all shadow-lg text-white"
            title="Statistics Dashboard"
          >
            📊
          </button>
          <button
            onClick={() => setShowInterventions(!showInterventions)}
            className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg text-white"
            title="Ecological Interventions"
          >
            🎮
          </button>
          <button
            onClick={() => setShowEventLog(!showEventLog)}
            className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg text-white"
            title="Event Log"
          >
            📋
          </button>
        </div>
      </div>
      
      {/* Control Bar - Bottom */}
      <ControlBar onOpenInterventions={() => setShowInterventions(true)} />
      
      {/* Modals */}
      <AnimatePresence>
        {selectedSpecies && (
          <SpeciesModal species={selectedSpecies} onClose={() => setSelectedSpecies(null)} />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showReport && (
          <EcosystemReport onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcoBalanceGame;