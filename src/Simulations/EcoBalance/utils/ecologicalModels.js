// games/EcoBalance/utils/ecologicalModels.js

export const PREDATION_MATRIX = {
  // Primary Consumers eat Producers - REDUCED predation rates
  rabbit: { grass: 0.00005, algae: 0.00003 },  // Was 0.0003
  deer: { grass: 0.00003, algae: 0.00002 },    // Was 0.0002
  
  // Secondary Consumers eat Primary Consumers - REDUCED
  fox: { rabbit: 0.00015, deer: 0.00005 },     // Was 0.001
  snake: { rabbit: 0.00012, deer: 0.00003 },   // Was 0.0008
  
  // Apex Predators - REDUCED
  wolf: { deer: 0.00008, rabbit: 0.00006, fox: 0.0003, snake: 0.0002 },  // Was 0.0005, 0.0004, 0.002, 0.0015
  eagle: { rabbit: 0.00009, snake: 0.00025, fox: 0.00015 }                // Was 0.0006, 0.0018, 0.001
};

export const SPECIES_DATA = {
  grass: { trophicLevel: 1, energyValue: 100, baseGrowthRate: 0.03 },    // Was 0.08
  algae: { trophicLevel: 1, energyValue: 80, baseGrowthRate: 0.035 },    // Was 0.09
  rabbit: { trophicLevel: 2, energyValue: 500, baseGrowthRate: 0.025 },  // Was 0.06
  deer: { trophicLevel: 2, energyValue: 2000, baseGrowthRate: 0.02 },    // Was 0.05
  fox: { trophicLevel: 3, energyValue: 3000, baseGrowthRate: 0.015 },    // Was 0.04
  snake: { trophicLevel: 3, energyValue: 1500, baseGrowthRate: 0.018 },  // Was 0.045
  wolf: { trophicLevel: 4, energyValue: 5000, baseGrowthRate: 0.01 },    // Was 0.03
  eagle: { trophicLevel: 4, energyValue: 3500, baseGrowthRate: 0.012 }    // Was 0.035
};

// Slower population dynamics
export function calculatePopulationChange(species, environment, predationPressure) {
  const { population, carryingCapacity, growthRate, mortalityRate } = species;
  
  if (population <= 0) {
    return { newPopulation: 0, extinction: true, predationRate: 0 };
  }
  
  // Environmental factors (more subtle now)
  const nutrientFactor = 0.8 + (environment.nutrientAvailability || 1) * 0.2;
  const toxicityFactor = 1 - (environment.toxicityLevel || 0) * 0.5;
  const diseaseFactor = 1 - (environment.diseaseSpread || 0) * 0.3;
  const rainfallFactor = 0.7 + (environment.rainfall || 1) * 0.3;
  const temperatureFactor = 0.8 + (environment.temperature || 1) * 0.2;
  
  // Combined environmental multiplier (less extreme)
  const envMultiplier = nutrientFactor * toxicityFactor * diseaseFactor * 
                        rainfallFactor * temperatureFactor;
  
  // Logistic growth with carrying capacity - SLOWER growth
  const carryingCapacityFactor = Math.max(0, 1 - (population / carryingCapacity));
  const birthRate = growthRate * envMultiplier * carryingCapacityFactor * 0.5; // Reduced by half
  const births = population * birthRate;
  
  // Deaths from predation and natural mortality - SLOWER deaths
  const predationDeaths = population * predationPressure * 0.3; // Reduced from 0.5
  const naturalDeaths = population * mortalityRate * (0.5 + (1 - envMultiplier) * 0.3);
  
  let newPopulation = population + births - naturalDeaths - predationDeaths;
  let extinction = false;
  
  // Extinction threshold - higher threshold for endangered status
  if (newPopulation < 5 && population > 0) {
    extinction = true;
    newPopulation = 0;
  }
  
  // Ensure non-negative and apply smoothing
  newPopulation = Math.max(0, newPopulation);
  
  // Add small random variation (±5%) for realism but not too chaotic
  const randomFactor = 0.95 + Math.random() * 0.1;
  newPopulation = newPopulation * randomFactor;
  
  return {
    newPopulation,
    extinction,
    predationRate: predationDeaths / (population + 0.001),
    birthRate: births / (population + 0.001)
  };
}

export function calculateEnergyTransfer(species, predationRate) {
  // 10% rule for energy transfer between trophic levels
  const trophicMultiplier = Math.pow(0.1, species.trophicLevel - 1);
  const energyTransferred = species.population * species.trophicLevel * 100 * predationRate * trophicMultiplier;
  return Math.min(energyTransferred, species.population * 1000);
}

export function calculateEcosystemHealth(species, previousHealth) {
  let healthScore = 100;
  let totalSpecies = 0;
  let endangeredSpecies = 0;
  
  for (const [level, speciesGroup] of Object.entries(species)) {
    for (const [id, data] of Object.entries(speciesGroup)) {
      totalSpecies++;
      const populationRatio = data.population / data.carryingCapacity;
      
      // Smoother health penalties
      if (populationRatio < 0.15) {
        healthScore -= 8;  // Was 15
        endangeredSpecies++;
      } else if (populationRatio < 0.3) {
        healthScore -= 4;  // Was 8
      } else if (populationRatio > 0.95) {
        healthScore -= 3;  // Was 5
      }
      
      // Bonus for balanced populations
      if (populationRatio > 0.35 && populationRatio < 0.75) {
        healthScore += 2;
      }
    }
  }
  
  // Check trophic pyramid balance with more lenient thresholds
  const producerTotal = Object.values(species.producers).reduce((sum, s) => sum + s.population, 0);
  const consumerTotal = Object.values(species.primaryConsumers).reduce((sum, s) => sum + s.population, 0);
  const secondaryTotal = Object.values(species.secondaryConsumers).reduce((sum, s) => sum + s.population, 0);
  const apexTotal = Object.values(species.apexPredators).reduce((sum, s) => sum + s.population, 0);
  
  // More forgiving ratios
  if (producerTotal > 0 && consumerTotal > 0 && producerTotal < consumerTotal * 1.5) {
    healthScore -= 5;  // Was 10
  }
  if (consumerTotal > 0 && secondaryTotal > 0 && consumerTotal < secondaryTotal) {
    healthScore -= 4;  // Was 8
  }
  if (secondaryTotal > 0 && apexTotal > 0 && secondaryTotal < apexTotal * 1.5) {
    healthScore -= 3;  // Was 5
  }
  
  // Endangered species penalty
  if (endangeredSpecies > totalSpecies / 2) {
    healthScore -= 15;
  }
  
  // Ecosystem collapse only if very severe
  if (endangeredSpecies >= totalSpecies * 0.8) {
    healthScore = 0;
  }
  
  // Smooth health transition
  return Math.max(0, Math.min(100, healthScore * 0.6 + previousHealth * 0.4));
}

export function checkExtinction(species) {
  const extinct = [];
  for (const [level, speciesGroup] of Object.entries(species)) {
    for (const [id, data] of Object.entries(speciesGroup)) {
      if (data.population <= 0) {
        extinct.push(id);
      }
    }
  }
  return extinct;
}

export function calculateBiomass(species) {
  let totalBiomass = 0;
  for (const [level, speciesGroup] of Object.entries(species)) {
    for (const [id, data] of Object.entries(speciesGroup)) {
      const biomassValue = data.trophicLevel === 1 ? 1 : data.trophicLevel * 50;
      totalBiomass += data.population * biomassValue;
    }
  }
  return totalBiomass;
}