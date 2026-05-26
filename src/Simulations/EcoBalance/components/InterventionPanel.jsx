// games/EcoBalance/components/InterventionPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { 
  GiPlantSeed, 
  GiChemicalDrop, 
  GiWolfHead, 
  GiWaterDrop,
  GiCancel 
} from 'react-icons/gi';
import { FaTemperatureHigh, FaTint, FaVirus, FaLeaf } from 'react-icons/fa';

const InterventionPanel = () => {
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  
  const { 
    addNutrients, 
    addToxins, 
    introducePredator, 
    increaseDisease, 
    adjustRainfall,
    removePredators,
    introduceInvasive,
    boostDecomposers
  } = useGameStore();
  
  const interventions = [
    {
      id: 'nutrients',
      name: 'Add Nutrients',
      description: 'Increases carrying capacity and growth rate of producers',
      icon: <FaLeaf className="text-2xl" />,
      effect: '+30% Producer Capacity',
      risk: 'Medium',
      color: 'green',
      action: addNutrients,
      scientificNote: 'Nutrient enrichment boosts primary productivity. Warning: Too much can trigger Eutrophication and Algal Blooms!'
    },
    {
      id: 'toxins',
      name: 'Introduce Toxins',
      description: 'Demonstrates biomagnification - affects higher trophic levels more',
      icon: <GiChemicalDrop className="text-2xl" />,
      effect: 'Biomagnification Cascade',
      risk: 'High',
      color: 'red',
      action: addToxins,
      scientificNote: 'Toxins become concentrated in predators, showing how pollution affects entire food webs.'
    },
    {
      id: 'predator',
      name: 'Introduce Predator',
      description: 'Adds a new apex predator to the ecosystem',
      icon: <GiWolfHead className="text-2xl" />,
      effect: 'Increased Predation Pressure',
      risk: 'Medium',
      color: 'orange',
      action: introducePredator,
      scientificNote: 'New predators can control prey populations but may destabilize existing balances.'
    },
    {
      id: 'disease',
      name: 'Increase Disease',
      description: 'Raises mortality rates, especially in dense populations',
      icon: <FaVirus className="text-2xl" />,
      effect: 'Increased Mortality',
      risk: 'High',
      color: 'red',
      action: increaseDisease,
      scientificNote: 'Disease spreads faster in overpopulated areas, naturally regulating population sizes.'
    },
    {
      id: 'rainfall-up',
      name: 'Increase Rainfall',
      description: 'Boosts producer growth and carrying capacity',
      icon: <FaTint className="text-2xl" />,
      effect: '+30% Producer Capacity',
      risk: 'Low',
      color: 'blue',
      action: () => adjustRainfall(0.3),
      scientificNote: 'Water availability is a key limiting factor for plant growth in many ecosystems.'
    },
    {
      id: 'rainfall-down',
      name: 'Decrease Rainfall',
      description: 'Reduces producer growth and triggers drought stress',
      icon: <GiWaterDrop className="text-2xl" />,
      effect: '-30% Producer Capacity',
      risk: 'Medium',
      color: 'yellow',
      action: () => adjustRainfall(-0.3),
      scientificNote: 'Drought conditions test ecosystem resilience and adaptation.'
    },
    {
      id: 'remove-predators',
      name: 'Remove Predators',
      description: 'Dramatically reduces apex predator populations',
      icon: <GiCancel className="text-2xl" />,
      effect: 'Trophic Cascade',
      risk: 'Very High',
      color: 'red',
      action: removePredators,
      scientificNote: 'Removing top predators triggers herbivore explosions and ecosystem collapse.'
    },
    {
      id: 'force-rain',
      name: 'Summon Monsoon',
      description: 'Triggers heavy rainfall, boosting producer growth.',
      icon: <FaTint className="text-2xl" />,
      effect: 'Weather: Rain',
      risk: 'Low',
      color: 'blue',
      action: () => {
        useGameStore.setState({ weather: 'rain' });
        adjustRainfall(0.5);
      },
      scientificNote: 'Seasonal monsoons cause rapid bursts in primary productivity.'
    },
    {
      id: 'force-snow',
      name: 'Trigger Winter',
      description: 'Causes a sudden freeze, slowing all growth and increasing mortality.',
      icon: <FaTemperatureHigh className="text-2xl text-blue-200" />,
      effect: 'Weather: Snow',
      risk: 'High',
      color: 'blue',
      action: () => {
        useGameStore.setState({ weather: 'snow' });
        adjustRainfall(-0.2); 
      },
      scientificNote: 'Harsh winters test carrying capacity and cull weak populations.'
    },
    {
      id: 'invasive',
      name: 'Release Invasive Species',
      description: 'Introduces a competitive species with no natural predators.',
      icon: <GiPlantSeed className="text-2xl text-orange-400" />,
      effect: 'Native Herbivores Outcompeted',
      risk: 'Very High',
      color: 'orange',
      action: introduceInvasive,
      scientificNote: 'Invasive species disrupt local niches because native predators do not recognize them as prey.'
    },
    {
      id: 'inoculate_fungi',
      name: 'Introduce Fungal Spores',
      description: 'Deploys decomposer mycelium to speed up detritus processing.',
      icon: <span className="text-2xl">🍄</span>,
      effect: '+50% Fungi & Efficiency',
      risk: 'Low',
      color: 'green',
      action: boostDecomposers,
      scientificNote: 'Decomposers break down dead structures, returning vital nutrients back into the carbon cycle.'
    }
  ];
  
  const handleIntervention = (intervention) => {
    if (window.confirm(`Apply "${intervention.name}"?\n\n${intervention.scientificNote}\n\nRisk Level: ${intervention.risk}`)) {
      intervention.action();
      setSelectedIntervention(intervention.id);
      setTimeout(() => setSelectedIntervention(null), 2000);
    }
  };
  
  const getColorClasses = (color) => {
    switch(color) {
      case 'green': return 'bg-green-900/30 hover:bg-green-800/50 border-green-500/30';
      case 'red': return 'bg-red-900/30 hover:bg-red-800/50 border-red-500/30';
      case 'orange': return 'bg-orange-900/30 hover:bg-orange-800/50 border-orange-500/30';
      case 'blue': return 'bg-blue-900/30 hover:bg-blue-800/50 border-blue-500/30';
      case 'yellow': return 'bg-yellow-900/30 hover:bg-yellow-800/50 border-yellow-500/30';
      default: return 'bg-gray-900/30 hover:bg-gray-800/50 border-gray-500/30';
    }
  };
  
  const getRiskClasses = (risk) => {
    switch(risk) {
      case 'Low': return 'bg-green-500/30 text-green-300';
      case 'Medium': return 'bg-yellow-500/30 text-yellow-300';
      default: return 'bg-red-500/30 text-red-300';
    }
  };
  
  return (
    <div className="space-y-4 text-white">
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-4 border border-green-500/30">
        <h3 className="font-bold text-green-400 mb-2">🌿 Ecological Interventions</h3>
        <p className="text-sm text-gray-300">
          Apply environmental changes and observe how the ecosystem responds. 
          Each intervention triggers realistic ecological ripple effects throughout the food web.
        </p>
      </div>
      
      <div className="space-y-3">
        {interventions.map((intervention) => (
          <motion.button
            key={intervention.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleIntervention(intervention)}
            className={`w-full text-left p-4 rounded-lg transition-all border ${getColorClasses(intervention.color)}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{intervention.icon}</div>
              <div className="flex-1">
                <div className="font-semibold flex items-center justify-between flex-wrap gap-2">
                  <span>{intervention.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskClasses(intervention.risk)}`}>
                    Risk: {intervention.risk}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{intervention.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-400">Effect: {intervention.effect}</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Scientific Fact of the Moment */}
      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30 mt-4">
        <h4 className="font-semibold text-blue-400 text-sm mb-2">📚 Did You Know?</h4>
        <p className="text-xs text-gray-300">
          Decomposers like fungi complete the nutrient cycle. Without them, dead organic matter (detritus) would pile up and plants would run out of vital elements to grow!
        </p>
      </div>
      
      {/* Action Feedback */}
      <AnimatePresence>
        {selectedIntervention && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 whitespace-nowrap"
          >
            🌟 Intervention Applied! Watch the ecosystem respond...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterventionPanel;