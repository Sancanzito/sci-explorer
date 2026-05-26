// games/EcoBalance/components/SpeciesModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaChartLine, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useGameStore } from '../store/gameStore';

const SpeciesModal = ({ species, onClose }) => {
  const { ecosystemHealth } = useGameStore();
  const healthPercent = (species.population / species.carryingCapacity) * 100;
  
  const getStatusDetails = () => {
    if (healthPercent < 20) {
      return {
        status: 'Critically Endangered',
        color: 'text-red-400',
        advice: 'Immediate intervention needed! Consider reducing predators or adding nutrients.'
      };
    } else if (healthPercent < 50) {
      return {
        status: 'Vulnerable',
        color: 'text-orange-400',
        advice: 'Population is declining. Monitor closely and consider protective measures.'
      };
    } else if (healthPercent > 90) {
      return {
        status: 'Overpopulated',
        color: 'text-yellow-400',
        advice: 'Population may exceed carrying capacity. Introduce predators or increase disease.'
      };
    } else {
      return {
        status: 'Stable',
        color: 'text-green-400',
        advice: 'Population is healthy and within sustainable limits.'
      };
    }
  };
  
  const statusDetails = getStatusDetails();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-5xl mb-2">{species.icon}</div>
              <h2 className="text-2xl font-bold">{species.name}</h2>
              <p className="text-green-200 text-sm mt-1">
                Trophic Level {species.trophicLevel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Population Stats */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Population</span>
              <span className="text-white font-bold">
                {Math.round(species.population).toLocaleString()} / {species.carryingCapacity.toLocaleString()}
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthPercent}%` }}
                className={`h-full ${
                  healthPercent > 70 ? 'bg-green-500' :
                  healthPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <div className={`mt-2 text-sm font-semibold ${statusDetails.color}`}>
              {statusDetails.status}
            </div>
          </div>
          
          {/* Ecological Data */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-green-400 text-2xl mb-1">
                {Math.round(species.growthRate * 100)}%
              </div>
              <div className="text-gray-400 text-xs">Growth Rate</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-red-400 text-2xl mb-1">
                {Math.round(species.mortalityRate * 100)}%
              </div>
              <div className="text-gray-400 text-xs">Mortality Rate</div>
            </div>
          </div>
          
          {/* Educational Content */}
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <FaInfoCircle /> Ecological Role
            </h3>
            <p className="text-sm text-gray-300">
              {species.trophicLevel === 1 && "Producers convert sunlight into energy through photosynthesis. They form the foundation of every ecosystem."}
              {species.trophicLevel === 2 && "Primary consumers are herbivores that feed directly on producers. They transfer energy from plants to higher trophic levels."}
              {species.trophicLevel === 3 && "Secondary consumers are carnivores that eat herbivores. They help control herbivore populations."}
              {species.trophicLevel === 4 && "Apex predators have no natural enemies. They play a crucial role in maintaining ecosystem balance."}
            </p>
          </div>
          
          {/* Advice */}
          <div className={`rounded-lg p-4 ${
            healthPercent < 30 ? 'bg-red-900/30 border border-red-500/30' :
            healthPercent > 90 ? 'bg-yellow-900/30 border border-yellow-500/30' :
            'bg-green-900/30 border border-green-500/30'
          }`}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaExclamationTriangle /> Recommendations
            </h3>
            <p className="text-sm text-gray-300">{statusDetails.advice}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpeciesModal;