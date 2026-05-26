// games/EcoBalance/store/gameStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  calculatePopulationChange, 
  calculateEnergyTransfer,
  calculateEcosystemHealth,
  PREDATION_MATRIX
} from '../utils/ecologicalModels';

const INITIAL_SPECIES = {
  producers: {
    grass: { name: 'Grass', population: 8000, carryingCapacity: 10000, growthRate: 0.03, mortalityRate: 0.01, trophicLevel: 1, color: '#4ade80', icon: '🌿', outbreak: 0 },
    algae: { name: 'Algae', population: 6000, carryingCapacity: 8500, growthRate: 0.035, mortalityRate: 0.012, trophicLevel: 1, color: '#22c55e', icon: '🟢', outbreak: 0 }
  },
  primaryConsumers: {
    rabbit: { name: 'Rabbit', population: 1200, carryingCapacity: 2000, growthRate: 0.025, mortalityRate: 0.02, trophicLevel: 2, color: '#eab308', icon: '🐇', outbreak: 0 },
    deer: { name: 'Deer', population: 400, carryingCapacity: 800, growthRate: 0.02, mortalityRate: 0.018, trophicLevel: 2, color: '#ca8a04', icon: '🦌', outbreak: 0 }
  },
  secondaryConsumers: {
    fox: { name: 'Fox', population: 200, carryingCapacity: 400, growthRate: 0.015, mortalityRate: 0.025, trophicLevel: 3, color: '#f97316', icon: '🦊', outbreak: 0 },
    snake: { name: 'Snake', population: 250, carryingCapacity: 500, growthRate: 0.018, mortalityRate: 0.022, trophicLevel: 3, color: '#ef4444', icon: '🐍', outbreak: 0 }
  },
  apexPredators: {
    wolf: { name: 'Wolf', population: 50, carryingCapacity: 100, growthRate: 0.01, mortalityRate: 0.03, trophicLevel: 4, color: '#dc2626', icon: '🐺', outbreak: 0 },
    eagle: { name: 'Eagle', population: 35, carryingCapacity: 70, growthRate: 0.012, mortalityRate: 0.028, trophicLevel: 4, color: '#b91c1c', icon: '🦅', outbreak: 0 }
  },
  decomposers: {
    fungi: { name: 'Fungi & Microbes', population: 500, carryingCapacity: 5000, growthRate: 0.02, efficiency: 0.15, trophicLevel: 0, color: '#a16207', icon: '🍄', outbreak: 0 }
  }
};

const INITIAL_ENVIRONMENT = {
  nutrientAvailability: 1.0,
  toxicityLevel: 0,
  diseaseSpread: 0,
  rainfall: 1.0,
  temperature: 1.0,
  seasonalFactor: 1.0,
  timeOfDay: 8,
  weather: 'clear',
};

function calculatePredationPressure(preyId, species, predationMatrix) {
  let totalPressure = 0;
  for (const [predatorLevel, predators] of Object.entries(species)) {
    for (const [predatorId, predatorData] of Object.entries(predators)) {
      const predationRate = predationMatrix[predatorId]?.[preyId] || 0;
      if (predationRate > 0 && predatorData.population > 0) {
        totalPressure += predationRate * predatorData.population;
      }
    }
  }
  return totalPressure;
}

function getDeclineReason(speciesId, species, environment) {
  const speciesData = getSpeciesDataById(speciesId, species);
  if (!speciesData) return "unknown causes";
  
  const healthRatio = speciesData.population / speciesData.carryingCapacity;
  if (speciesData.outbreak > 0) return "active viral contagion";
  if (environment.toxicityLevel > 0.5) return "toxin accumulation";
  if (environment.diseaseSpread > 0.5) return "disease outbreak";
  if (environment.rainfall < 0.5 && speciesData.trophicLevel === 1) return "drought conditions";
  if (healthRatio < 0.3 && speciesData.trophicLevel > 1) return "prey scarcity";
  if (healthRatio > 0.9 && speciesData.trophicLevel > 1) return "overpopulation & resource competition";
  
  const predationPressure = calculatePredationPressure(speciesId, species, PREDATION_MATRIX);
  if (predationPressure > 0.01) return "heavy predation";
  
  return "environmental stress";
}

function getSpeciesDataById(id, species) {
  for (const level of ['producers', 'primaryConsumers', 'secondaryConsumers', 'apexPredators', 'decomposers']) {
    if (species[level] && species[level][id]) return species[level][id];
  }
  return null;
}

function calculateBiodiversityScore(speciesGroups) {
  let totalPopulation = 0;
  const populations = [];
  
  Object.values(speciesGroups).forEach(group => {
    Object.values(group).forEach(spec => {
      populations.push(spec.population);
      totalPopulation += spec.population;
    });
  });
  
  if (totalPopulation === 0) return 0;
  let sumSquaredRatios = 0;
  populations.forEach(pop => {
    const ratio = pop / totalPopulation;
    sumSquaredRatios += ratio * ratio;
  });
  
  return Math.round((1 - sumSquaredRatios) * 130);
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      species: INITIAL_SPECIES,
      environment: INITIAL_ENVIRONMENT,
      isRunning: true,
      simulationSpeed: 1,
      timeStep: 0,
      detritus: 1000, 
      biodiversityScore: 100,
      populationHistory: [],
      interventionHistory: [],
      notifications: [],
      events: [],
      ecosystemHealth: 100,
      energyEfficiency: 10,
      selectedIntervention: null,
      timeOfDay: 8,
      weather: 'clear',
      
      updateEcosystem: () => {
        const { species, environment, timeStep, populationHistory, ecosystemHealth, detritus, addEvent, addNotification, timeOfDay, weather } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        let totalBiomass = 0;
        let totalEnergyTransferred = 0;
        let significantChanges = [];
        let addedDetritus = 0;
        
        let newTimeOfDay = (timeOfDay + 0.5) % 24;
        let newWeather = weather;
        if (Math.random() < 0.02) { 
          const rand = Math.random();
          if (rand < 0.7) newWeather = 'clear';
          else if (rand < 0.9) newWeather = 'rain';
          else newWeather = 'snow';
        }
        
        const oldPopulations = {};
        for (const [level, speciesGroup] of Object.entries(species)) {
          for (const [speciesId, speciesData] of Object.entries(speciesGroup)) {
            oldPopulations[speciesId] = speciesData.population;
          }
        }

        // --- 1. DYNAMIC CARRYING CAPACITIES ---
        const totalProducers = Object.values(newSpecies.producers).reduce((sum, s) => sum + s.population, 0);
        const totalPrimary = Object.values(newSpecies.primaryConsumers).reduce((sum, s) => sum + s.population, 0);
        
        for (const [id, herbivore] of Object.entries(newSpecies.primaryConsumers)) {
          const baseCapacity = id === 'rabbit' ? 2000 : 800;
          herbivore.carryingCapacity = Math.max(100, Math.round(baseCapacity * (totalProducers / 14000)));
        }
        
        for (const [id, carnivore] of Object.entries(newSpecies.secondaryConsumers)) {
          const baseCapacity = id === 'fox' ? 400 : 500;
          carnivore.carryingCapacity = Math.max(20, Math.round(baseCapacity * (totalPrimary / 1600)));
        }

        // --- 2. POPULATION & DISEASE CALCULATIONS ---
        for (const [level, speciesGroup] of Object.entries(newSpecies)) {
          if (level === 'decomposers') continue; 
          
          for (const [speciesId, speciesData] of Object.entries(speciesGroup)) {
            const predationPressure = calculatePredationPressure(speciesId, newSpecies, PREDATION_MATRIX);
            const isSick = speciesData.outbreak && speciesData.outbreak > 0;
            
            // ACTIVE DISEASE DAMAGE
            if (isSick) {
              const plagueDeaths = Math.round(speciesData.population * (0.05 * speciesData.outbreak));
              speciesData.population = Math.max(0, speciesData.population - plagueDeaths);
              addedDetritus += plagueDeaths; 
              
              // Disease decays over time (immunity builds up)
              speciesData.outbreak -= 0.05; 
              if (speciesData.outbreak < 0.01) speciesData.outbreak = 0;
            }

            // ACTIVE CONTAGION (Predators catch it from prey)
            if (isSick && predationPressure > 0.05) {
               for (const [predLevel, predators] of Object.entries(newSpecies)) {
                 for (const [predId, predData] of Object.entries(predators)) {
                   if (PREDATION_MATRIX[predId]?.[speciesId] > 0) {
                     if (!predData.outbreak || predData.outbreak < 0.5) {
                       predData.outbreak = 0.8; 
                       if (Math.random() > 0.8) { // Only log occasionally to avoid spam
                         addEvent(`🦠 CONTAGION: ${predData.name} caught the disease by eating infected ${speciesData.name}!`, 'warning');
                       }
                     }
                   }
                 }
               }
            }

            const result = calculatePopulationChange(speciesData, environment, predationPressure);
            
            const oldPop = oldPopulations[speciesId];
            const newPop = result.newPopulation;
            speciesData.population = Math.max(0, newPop);
            totalBiomass += speciesData.population * (speciesData.trophicLevel === 1 ? 1 : speciesData.trophicLevel * 0.5);
            
            const naturalDeaths = Math.round(oldPop * speciesData.mortalityRate);
            addedDetritus += naturalDeaths;
            
            if (oldPop > 0) {
              const percentChange = ((newPop - oldPop) / oldPop) * 100;
              if (Math.abs(percentChange) > 15 && oldPop > 50) {
                significantChanges.push({ speciesId, name: speciesData.name, percentChange, newPop, oldPop, trophicLevel: speciesData.trophicLevel });
              }
            }
            
            if (oldPop >= 10 && newPop < 10 && newPop > 0) {
              addEvent(`⚠️ CRITICAL: ${speciesData.name} population has crashed to ${Math.round(newPop)}!`, 'warning');
              addNotification(`⚠️ ${speciesData.name} is critically endangered!`, 'warning');
            }
            if (oldPop > 0 && newPop === 0) {
              addEvent(`💀 EXTINCTION: ${speciesData.name} has gone extinct!`, 'critical');
              addNotification(`💀 ${speciesData.name} has gone extinct!`, 'critical');
            }
            
            totalEnergyTransferred += calculateEnergyTransfer(speciesData, result.predationRate);
          }
        }

        // --- 3. DECOMPOSITION & FUNGI PHYSICS ---
        let currentDetritus = detritus + addedDetritus;
        const fungi = newSpecies.decomposers.fungi;
        
        const idealFungiPop = Math.min(fungi.carryingCapacity, Math.round(currentDetritus * 0.4));
        const fungiDiff = idealFungiPop - fungi.population;
        fungi.population = Math.max(10, Math.round(fungi.population + (fungiDiff * fungi.growthRate)));
        
        const detritusConsumed = Math.min(currentDetritus, Math.round(fungi.population * fungi.efficiency * 10));
        currentDetritus = Math.max(0, currentDetritus - detritusConsumed);
        
        const nutrientYield = Math.round(detritusConsumed * 0.2);
        if (nutrientYield > 0) {
          newSpecies.producers.grass.carryingCapacity = Math.min(25000, newSpecies.producers.grass.carryingCapacity + Math.round(nutrientYield * 0.6));
          newSpecies.producers.algae.carryingCapacity = Math.min(20000, newSpecies.producers.algae.carryingCapacity + Math.round(nutrientYield * 0.4));
        }
        
        newSpecies.producers.grass.carryingCapacity = Math.max(5000, Math.round(newSpecies.producers.grass.carryingCapacity * 0.995));
        newSpecies.producers.algae.carryingCapacity = Math.max(4000, Math.round(newSpecies.producers.algae.carryingCapacity * 0.995));
        
        if (detritusConsumed > 800 && Math.random() * 100 > 85) {
          addEvent(`🍄 DECOMPOSITION: Fungi are breaking down detritus, replenishing soil nutrients!`, 'info');
        }

        // --- 4. EVENTS & SYSTEM HEALTH ---
        significantChanges.forEach(change => {
          if (change.percentChange > 0) {
            addEvent(`📈 ${change.name} population grew by ${Math.round(change.percentChange)}% (${Math.round(change.oldPop)} → ${Math.round(change.newPop)})`, 'growth');
          } else {
            const reason = getDeclineReason(change.speciesId, newSpecies, environment);
            addEvent(`📉 ${change.name} population declined by ${Math.abs(Math.round(change.percentChange))}% due to ${reason}`, 'decline');
          }
        });
        
        const apexTotal = Object.values(newSpecies.apexPredators).reduce((sum, s) => sum + s.population, 0);
        const primaryTotal = Object.values(newSpecies.primaryConsumers).reduce((sum, s) => sum + s.population, 0);
        const producerTotalFinal = Object.values(newSpecies.producers).reduce((sum, s) => sum + s.population, 0);
        
        const oldApexTotal = Object.values(species.apexPredators).reduce((sum, s) => sum + s.population, 0);
        if (oldApexTotal > 30 && apexTotal < 15 && primaryTotal > (oldPopulations.rabbit || 0) * 1.2) {
          addEvent(`🔄 TROPHIC CASCADE DETECTED! Apex predator decline causing herbivore explosion!`, 'warning');
          addNotification('⚠️ Trophic Cascade! Herbivore population exploding!', 'warning');
        }
        
        const newHealth = calculateEcosystemHealth(newSpecies, ecosystemHealth);
        const efficiency = totalBiomass > 0 ? (totalEnergyTransferred / totalBiomass) * 100 : 10;
        const newBiodiversityScore = calculateBiodiversityScore(newSpecies);
        
        if (newHealth > ecosystemHealth + 5) addEvent(`💚 Ecosystem health improving! (+${Math.round(newHealth - ecosystemHealth)}%)`, 'success');
        else if (newHealth < ecosystemHealth - 5 && newHealth > 0) addEvent(`💔 Ecosystem health declining! (-${Math.round(ecosystemHealth - newHealth)}%)`, 'warning');
        
        if (newHealth < 15 && ecosystemHealth > 15) {
          addEvent(`💀 ECOSYSTEM COLLAPSE IMMINENT! Take immediate action!`, 'critical');
          addNotification('💀 Ecosystem Approaching Collapse!', 'critical');
        }
        if (producerTotalFinal < 200 && producerTotalFinal > 0) {
          addEvent(`🌱 CRITICAL: Producer population crash! Food web foundation failing!`, 'critical');
          addNotification('🌱 Critical: Producer population crash!', 'critical');
        }
        
        const newHistory = [...populationHistory, {
          time: timeStep,
          populations: {
            totalProducers: producerTotalFinal,
            totalPrimary: primaryTotal,
            totalSecondary: Object.values(newSpecies.secondaryConsumers).reduce((sum, s) => sum + s.population, 0),
            totalApex: apexTotal,
            health: newHealth
          }
        }].slice(-100);
        
        set({
          species: newSpecies,
          timeStep: timeStep + 1,
          timeOfDay: newTimeOfDay,
          weather: newWeather,
          detritus: currentDetritus,
          populationHistory: newHistory,
          ecosystemHealth: Math.max(0, Math.min(100, newHealth)),
          biodiversityScore: newBiodiversityScore,
          energyEfficiency: efficiency
        });
      },
      
      // --- INTERVENTIONS ---
      addNutrients: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        
        const currentAlgae = newSpecies.producers.algae.population;
        const algaeCapacity = newSpecies.producers.algae.carryingCapacity;
        
        if (currentAlgae > algaeCapacity * 0.85) {
          newSpecies.producers.algae.population = Math.round(algaeCapacity * 1.5);
          if (newSpecies.primaryConsumers.rabbit) newSpecies.primaryConsumers.rabbit.population = Math.round(newSpecies.primaryConsumers.rabbit.population * 0.5);
          if (newSpecies.primaryConsumers.deer) newSpecies.primaryConsumers.deer.population = Math.round(newSpecies.primaryConsumers.deer.population * 0.5);
          
          set({ species: newSpecies });
          addEvent(`⚠️ ECOSYSTEM CRISIS: Eutrophication! Excess nutrients triggered an Algal Bloom, suffocating wildlife!`, 'critical');
          addNotification('🚨 Algal Bloom Triggered! High nutrient toxicity!', 'critical');
          interventionHistory.push({ time: timeStep, type: 'eutrophication_collapse' });
          return false;
        }
        
        for (const [id, speciesData] of Object.entries(newSpecies.producers)) {
          speciesData.carryingCapacity = Math.min(25000, Math.round(speciesData.carryingCapacity * 1.3));
          speciesData.growthRate = Math.min(0.12, speciesData.growthRate * 1.15);
          speciesData.population = Math.min(speciesData.carryingCapacity, Math.round(speciesData.population * 1.15));
        }
        
        set({ species: newSpecies });
        addEvent(`🌱 INTERVENTION: Nutrients added! Producer capacity expanded and populations bloomed!`, 'intervention');
        addNotification('🌱 Nutrients Added! Producers are blooming rapidly!', 'success');
        interventionHistory.push({ time: timeStep, type: 'add_nutrients', effect: 'increased_producer_capacity' });
        return true;
      },
      
      addToxins: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep, environment } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        const newEnvironment = { ...environment, toxicityLevel: Math.min(1, environment.toxicityLevel + 0.2) };
        
        for (const [level, speciesGroup] of Object.entries(newSpecies)) {
          if (level === 'decomposers') continue;
          const multiplier = level === 'producers' ? 0.95 : level === 'primaryConsumers' ? 0.85 : level === 'secondaryConsumers' ? 0.7 : 0.5;
          for (const [id, speciesData] of Object.entries(speciesGroup)) {
            speciesData.population *= multiplier;
            speciesData.growthRate *= 0.9;
            speciesData.mortalityRate *= 1.2;
          }
        }
        
        set({ species: newSpecies, environment: newEnvironment });
        addEvent(`☠️ INTERVENTION: Toxins introduced! Biomagnification in progress...`, 'intervention');
        addNotification('☠️ Toxins Introduced! Affecting higher trophic levels severely!', 'warning');
        interventionHistory.push({ time: timeStep, type: 'add_toxins' });
        return true;
      },
      
      introducePredator: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        for (const [id, speciesData] of Object.entries(newSpecies.apexPredators)) {
          speciesData.population *= 1.5;
        }
        set({ species: newSpecies });
        addEvent(`🦁 INTERVENTION: Additional predators introduced to control herbivore populations`, 'intervention');
        addNotification('🐺 New Predator Introduced! Expect trophic cascade effects!', 'info');
        interventionHistory.push({ time: timeStep, type: 'introduce_predator' });
        return true;
      },
      
      increaseDisease: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        
        const affected = [];
        for (const [level, speciesGroup] of Object.entries(newSpecies)) {
          if (level === 'decomposers') continue;
          for (const [id, speciesData] of Object.entries(speciesGroup)) {
            const densityFactor = speciesData.population / speciesData.carryingCapacity;
            if (densityFactor > 0.6) {
              speciesData.outbreak = 1.0; 
              affected.push(speciesData.name);
            }
          }
        }
        
        if (affected.length === 0 && newSpecies.primaryConsumers.rabbit) {
          newSpecies.primaryConsumers.rabbit.outbreak = 1.0;
          affected.push('Rabbit');
        }
        
        set({ species: newSpecies });
        addEvent(`🦠 INTERVENTION: Active viral outbreak initiated! Patient Zero species: ${affected.join(', ')}`, 'intervention');
        addNotification(`🦠 Viral Outbreak in: ${affected.join(', ')}!`, 'warning');
        interventionHistory.push({ time: timeStep, type: 'increase_disease' });
        return true;
      },
      
      adjustRainfall: (amount) => {
        const { species, addEvent, addNotification, interventionHistory, timeStep, environment } = get();
        
        let newRainfall = (environment.rainfall || 1.0) + amount;
        newRainfall = Math.max(0.3, Math.min(1.5, newRainfall));
        const newEnvironment = { ...environment, rainfall: newRainfall };
        const newSpecies = JSON.parse(JSON.stringify(species));
        
        const capacityModifier = 1 + amount;
        const growthModifier = 1 + (amount * 0.5); 
        
        for (const [id, speciesData] of Object.entries(newSpecies.producers)) {
          speciesData.carryingCapacity = Math.max(500, Math.min(25000, Math.round(speciesData.carryingCapacity * capacityModifier)));
          speciesData.growthRate = Math.max(0.005, Math.min(0.1, speciesData.growthRate * growthModifier));
        }
        
        set({ species: newSpecies, environment: newEnvironment });
        const isIncrease = amount > 0;
        addEvent(`💧 INTERVENTION: Rainfall ${isIncrease ? 'increased' : 'decreased'} to ${newRainfall.toFixed(1)}x`, 'intervention');
        addNotification(`💧 Rainfall ${isIncrease ? 'increased' : 'decreased'}! Producer capacity adjusted.`, 'info');
        interventionHistory.push({ time: timeStep, type: 'adjust_rainfall' });
        return true;
      },
      
      removePredators: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        for (const [id, speciesData] of Object.entries(newSpecies.apexPredators)) {
          speciesData.population *= 0.2;
        }
        set({ species: newSpecies });
        addEvent(`🔄 INTERVENTION: Apex predators removed! Warning: Herbivore population may explode!`, 'intervention');
        addNotification('🔄 Predators Removed! Herbivore population may explode!', 'warning');
        interventionHistory.push({ time: timeStep, type: 'remove_predators' });
        return true;
      },

      introduceInvasive: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        for (const [id, consumer] of Object.entries(newSpecies.primaryConsumers)) {
          consumer.growthRate = Math.max(0.005, consumer.growthRate * 0.7); 
        }
        set({ species: newSpecies });
        addEvent(`⚠️ ECOSYSTEM WARNING: Invasive species introduced! Native primary consumers are struggling.`, 'warning');
        addNotification('⚠️ Invasive Species Spotted! Natives outcompeted.', 'warning');
        interventionHistory.push({ time: timeStep, type: 'invasive_species' });
        return true;
      },

      boostDecomposers: () => {
        const { species, addEvent, addNotification, interventionHistory, timeStep } = get();
        const newSpecies = JSON.parse(JSON.stringify(species));
        if (newSpecies.decomposers && newSpecies.decomposers.fungi) {
          const fungi = newSpecies.decomposers.fungi;
          fungi.population = Math.min(fungi.carryingCapacity, Math.round(fungi.population * 1.5));
          fungi.efficiency = Math.min(0.5, fungi.efficiency * 1.20);
          set({ species: newSpecies });
          addEvent(`🍄 INTERVENTION: Spores deployed! Fungal colony expanded to break down waste.`, 'intervention');
          addNotification('🍄 Fungal Inoculation Successful!', 'success');
          interventionHistory.push({ time: timeStep, type: 'inoculate_fungi' });
          return true;
        }
        return false;
      },
      
      // --- UTILITIES ---
      addEvent: (message, type) => {
        const { events } = get();
        set({ events: [{ id: Date.now() + Math.random(), message, type, timestamp: new Date() }, ...events].slice(0, 100) });
      },
      toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
      setSimulationSpeed: (speed) => { set({ simulationSpeed: speed }); get().addEvent(`⚡ Simulation speed changed to ${speed}x`, 'info'); },
      resetSimulation: () => {
        set({
          species: JSON.parse(JSON.stringify(INITIAL_SPECIES)), environment: JSON.parse(JSON.stringify(INITIAL_ENVIRONMENT)),
          timeStep: 0, timeOfDay: 8, weather: 'clear', detritus: 1000, biodiversityScore: 100,
          populationHistory: [], interventionHistory: [], notifications: [], events: [], ecosystemHealth: 100, energyEfficiency: 10
        });
        get().addEvent('🔄 Simulation Reset! Starting with balanced ecosystem.', 'success');
      },
      addNotification: (message, type) => {
        const { notifications } = get();
        const id = Date.now();
        set({ notifications: [{ id, message, type, timestamp: new Date() }, ...notifications].slice(0, 10) });
        setTimeout(() => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })), 5000);
      },
      dismissNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
      clearEvents: () => set({ events: [] }),
      getInterventionHistory: () => get().interventionHistory,
      getEcosystemReport: () => {
        const { populationHistory, interventionHistory, ecosystemHealth, species, events } = get();
        const finalPopulations = {};
        for (const [level, speciesGroup] of Object.entries(species)) {
          for (const [id, data] of Object.entries(speciesGroup)) {
            finalPopulations[id] = data.population;
          }
        }
        return {
          finalHealth: ecosystemHealth, finalPopulations, interventions: interventionHistory,
          events: events.slice(0, 20), stability: ecosystemHealth > 70 ? 'Stable' : ecosystemHealth > 30 ? 'Unstable' : 'Collapsed', timeline: populationHistory
        };
      }
    }),
    { name: 'eco-balance-game', partialize: (state) => ({ interventionHistory: state.interventionHistory, events: state.events.slice(0, 50) }) }
  )
);