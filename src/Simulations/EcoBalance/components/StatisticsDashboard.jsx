// games/EcoBalance/components/StatisticsDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { calculateBiomass } from '../utils/ecologicalModels';

// Simple Line Chart Component using SVG
const SimpleLineChart = ({ data, title, colors }) => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value for scaling
    let maxValue = 0;
    data.forEach(entry => {
      Object.keys(colors).forEach(key => {
        if (entry[key] && entry[key] > maxValue) {
          maxValue = entry[key];
        }
      });
    });
    maxValue = maxValue || 10000;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = height - 40 - (i * (height - 80) / 4);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.fillText(Math.round(maxValue * i / 4), 5, y + 3);
    }
    
    // Draw lines for each dataset
    Object.keys(colors).forEach((key, index) => {
      const color = colors[key];
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      let firstPoint = true;
      data.forEach((entry, i) => {
        const x = 40 + (i * (width - 60) / Math.max(1, data.length - 1));
        const y = height - 40 - (entry[key] / maxValue) * (height - 80);
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Arial';
    data.forEach((entry, i) => {
      if (i % Math.ceil(data.length / 10) === 0 || i === data.length - 1) {
        const x = 40 + (i * (width - 60) / Math.max(1, data.length - 1));
        ctx.fillText(entry.time, x - 10, height - 25);
      }
    });
    
  }, [data, colors]);
  
  return (
    <div className="w-full">
      <h3 className="font-semibold mb-2 text-green-400 text-sm">{title}</h3>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={200} 
        className="w-full h-auto bg-gray-800/50 rounded-lg"
        style={{ maxHeight: '200px' }}
      />
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="w-full">
      <h3 className="font-semibold mb-2 text-green-400 text-sm">{title}</h3>
      <div className="bg-gray-800/50 rounded-lg p-3">
        {data.map((item, idx) => (
          <div key={idx} className="mb-2">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>{item.name}</span>
              <span>{Math.round(item.value).toLocaleString()}</span>
            </div>
            <div className="h-6 bg-gray-700 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${item.color} flex items-center justify-end px-2 text-xs text-white font-bold`}
              >
                {item.value > maxValue * 0.1 && `${Math.round((item.value / maxValue) * 100)}%`}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, unit, color, icon }) => {
  const colorClasses = {
    green: 'from-green-600 to-green-700',
    yellow: 'from-yellow-600 to-orange-600',
    red: 'from-red-600 to-red-700',
    blue: 'from-blue-600 to-cyan-600',
    purple: 'from-purple-600 to-indigo-600'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-3`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs opacity-80">{title}</span>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm ml-1">{unit}</span>
      </div>
    </motion.div>
  );
};

// Pyramid Bar Component
const PyramidBar = ({ label, value, color, maxValue }) => {
  const width = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{Math.round(value).toLocaleString()}</span>
      </div>
      <div className="h-6 bg-gray-700 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full`}
          style={{ backgroundColor: color, width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// Calculate biodiversity score
function calculateBiodiversity(species) {
  let totalSpecies = 0;
  let healthySpecies = 0;
  
  for (const [level, speciesGroup] of Object.entries(species)) {
    for (const [id, data] of Object.entries(speciesGroup)) {
      totalSpecies++;
      const healthRatio = data.population / data.carryingCapacity;
      if (healthRatio > 0.3) healthySpecies++;
    }
  }
  
  return Math.round((healthySpecies / totalSpecies) * 100);
}

const StatisticsDashboard = () => {
  const { populationHistory, ecosystemHealth, energyEfficiency, species, timeStep } = useGameStore();
  
  // Prepare chart data
  const chartData = populationHistory.slice(-50).map(entry => ({
    time: entry.time,
    Producers: entry.populations.totalProducers,
    PrimaryConsumers: entry.populations.totalPrimary,
    SecondaryConsumers: entry.populations.totalSecondary,
    ApexPredators: entry.populations.totalApex
  }));
  
  // Current population distribution
  const currentPopulations = {
    Producers: Object.values(species.producers).reduce((sum, s) => sum + s.population, 0),
    'Primary Consumers': Object.values(species.primaryConsumers).reduce((sum, s) => sum + s.population, 0),
    'Secondary Consumers': Object.values(species.secondaryConsumers).reduce((sum, s) => sum + s.population, 0),
    'Apex Predators': Object.values(species.apexPredators).reduce((sum, s) => sum + s.population, 0)
  };
  
  const totalBiomass = calculateBiomass(species);
  const biodiversityScore = calculateBiodiversity(species);
  
  // Get current populations for bar chart
  const barData = [
    { name: 'Producers', value: currentPopulations.Producers, color: '#4ade80' },
    { name: 'Primary Consumers', value: currentPopulations['Primary Consumers'], color: '#eab308' },
    { name: 'Secondary Consumers', value: currentPopulations['Secondary Consumers'], color: '#f97316' },
    { name: 'Apex Predators', value: currentPopulations['Apex Predators'], color: '#ef4444' }
  ];
  
  // Trophic pyramid data
  const pyramidMax = Math.max(
    currentPopulations.Producers,
    currentPopulations['Primary Consumers'] * 2,
    currentPopulations['Secondary Consumers'] * 4,
    currentPopulations['Apex Predators'] * 8
  );
  
  return (
    <div className="space-y-6 text-white">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Ecosystem Health"
          value={Math.round(ecosystemHealth)}
          unit="%"
          color={ecosystemHealth > 70 ? 'green' : ecosystemHealth > 30 ? 'yellow' : 'red'}
          icon="💚"
        />
        <MetricCard
          title="Energy Efficiency"
          value={Math.round(energyEfficiency)}
          unit="%"
          color="blue"
          icon="⚡"
        />
        <MetricCard
          title="Total Biomass"
          value={Math.round(totalBiomass / 1000)}
          unit="k units"
          color="purple"
          icon="🌿"
        />
        <MetricCard
          title="Biodiversity"
          value={biodiversityScore}
          unit="/100"
          color={biodiversityScore > 70 ? 'green' : biodiversityScore > 30 ? 'yellow' : 'red'}
          icon="🦋"
        />
      </div>
      
      {/* Population Trends Chart */}
      <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
        <SimpleLineChart 
          data={chartData} 
          title="📈 Population Trends Over Time"
          colors={{
            Producers: '#4ade80',
            PrimaryConsumers: '#eab308',
            SecondaryConsumers: '#f97316',
            ApexPredators: '#ef4444'
          }}
        />
        <p className="text-xs text-gray-400 mt-2 text-center">
          Populations adjust based on predator-prey relationships and environmental factors
        </p>
      </div>
      
      {/* Population Distribution Bar Chart */}
      <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
        <SimpleBarChart data={barData} title="🥧 Current Population Distribution" />
        <p className="text-xs text-gray-400 mt-2 text-center">
          Notice how biomass decreases at higher trophic levels (Ecological Pyramid)
        </p>
      </div>
      
      {/* Trophic Pyramid Visualization */}
      <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 text-green-400">🔺 Trophic Pyramid</h3>
        <div className="space-y-2">
          <PyramidBar 
            label="Apex Predators" 
            value={currentPopulations['Apex Predators']} 
            color="#ef4444" 
            maxValue={pyramidMax}
          />
          <PyramidBar 
            label="Secondary Consumers" 
            value={currentPopulations['Secondary Consumers']} 
            color="#f97316" 
            maxValue={pyramidMax}
          />
          <PyramidBar 
            label="Primary Consumers" 
            value={currentPopulations['Primary Consumers']} 
            color="#eab308" 
            maxValue={pyramidMax}
          />
          <PyramidBar 
            label="Producers" 
            value={currentPopulations['Producers']} 
            color="#4ade80" 
            maxValue={pyramidMax}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Each level supports approximately 10% of the biomass below it
        </p>
      </div>
      
      {/* Educational Fact */}
      <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
        <p className="text-xs text-blue-300">
          💡 <strong>Ecological Fact:</strong> Only 10% of energy transfers between trophic levels. 
          This is why there are far more producers than apex predators!
        </p>
      </div>
      
      {/* Time Step Info */}
      <div className="text-center text-xs text-gray-500">
        Simulation Time Step: {timeStep} | Real-time updates
      </div>
    </div>
  );
};

export default StatisticsDashboard;