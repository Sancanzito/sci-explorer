import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Text, Sparkles } from '@react-three/drei';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplet, Sun, CloudRain, Skull, Leaf, RefreshCw, Zap, Flame, Bug, Thermometer, Waves, Sprout, Trees } from 'lucide-react';
import * as THREE from 'three';

// ==========================================
// 1. ZUSTAND ECOSYSTEM ENGINE (ORIGINAL LOGIC)
// ==========================================
const MAP_SIZE = 50; 
const RIVER_Z_BOUNDS = [-3, 3];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const BIOMES = {
  FOREST: 'forest',
  GRASSLAND: 'grassland',
  WETLAND: 'wetland',
  ROCKY: 'rocky',
};
const SPECIES_DATA = {
  Wolf: {
    type: 'predator', preferredBiomes: [BIOMES.FOREST, BIOMES.ROCKY],
    diet: ['Rabbit', 'Deer', 'Fish'], predators: [], status: 'Least Concern',
    trophicLevel: 'Apex Predator', model: 'wolf',
  },
  Fox: {
    type: 'predator', preferredBiomes: [BIOMES.FOREST, BIOMES.GRASSLAND],
    diet: ['Rabbit', 'Rat'], predators: ['Wolf'], status: 'Least Concern',
    trophicLevel: 'Secondary Consumer', model: 'fox',
  },
  Eagle: {
    type: 'predator', preferredBiomes: [BIOMES.ROCKY, BIOMES.FOREST],
    diet: ['Fish', 'Rat'], predators: [], status: 'Least Concern',
    trophicLevel: 'Apex Predator', model: 'eagle',
  },
  Rabbit: {
    type: 'prey', preferredBiomes: [BIOMES.GRASSLAND, BIOMES.FOREST],
    diet: ['Grass', 'Berries'], predators: ['Wolf', 'Fox'], status: 'Least Concern',
    trophicLevel: 'Primary Consumer', model: 'rabbit',
  },
  Deer: {
    type: 'prey', preferredBiomes: [BIOMES.FOREST, BIOMES.GRASSLAND],
    diet: ['Grass', 'Leaves'], predators: ['Wolf'], status: 'Least Concern',
    trophicLevel: 'Primary Consumer', model: 'deer',
  },
  Fish: {
    type: 'prey', preferredBiomes: [BIOMES.WETLAND],
    diet: ['Algae'], predators: ['Wolf', 'Eagle'], status: 'Common',
    trophicLevel: 'Primary Consumer', model: 'fish',
  },
  Rat: {
    type: 'prey', preferredBiomes: [BIOMES.GRASSLAND, BIOMES.WETLAND],
    diet: ['Seeds', 'Insects'], predators: ['Fox', 'Eagle'], status: 'Invasive',
    trophicLevel: 'Primary Consumer', model: 'rat',
  },
};

const getBiome = (x, z) => {
  const distFromRiver = Math.abs(z);
  if (distFromRiver < 5) return BIOMES.WETLAND;
  if (x < -8 && distFromRiver > 5) return BIOMES.FOREST;
  if (x > 8 && distFromRiver > 5) return BIOMES.ROCKY;
  return BIOMES.GRASSLAND;
};

const useStore = create((set) => ({
  weather: 'Clear',
  timeOfDay: 8,
  dayCycle: 0,
  season: 'Spring',
  seasonProgress: 0,
  corpses: [],
  food: [],
  entities: [
    { id: 'wolf-1', type: 'predator', species: 'Wolf', gender: 'male', age: 2.5, pos: [5, 0, 5], target: [5, 0, 5], hunger: 100, thirst: 80, state: 'wandering', fertility: 0, traits: { size: 1.0, speed: 1.0 } },
    { id: 'rabbit-1', type: 'prey', species: 'Rabbit', gender: 'female', age: 1.5, pos: [-5, 0, -5], target: [-5, 0, -5], hunger: 100, thirst: 100, state: 'grazing', fertility: 0, traits: { size: 0.8, speed: 0.8 } },
    { id: 'rabbit-2', type: 'prey', species: 'Rabbit', gender: 'male', age: 1.2, pos: [-6, 0, -4], target: [-6, 0, -4], hunger: 90, thirst: 95, state: 'grazing', fertility: 0, traits: { size: 0.9, speed: 0.9 } },
    { id: 'fish-1', type: 'prey', species: 'Fish', gender: 'female', age: 0.8, pos: [8, -0.5, 0], target: [8, -0.5, 0], hunger: 100, thirst: 100, state: 'swimming', fertility: 0, traits: { size: 1.0, speed: 1.0 } },
    { id: 'fish-2', type: 'prey', species: 'Fish', gender: 'male', age: 0.5, pos: [-8, -0.5, 1], target: [-8, -0.5, 1], hunger: 100, thirst: 100, state: 'swimming', fertility: 0, traits: { size: 1.0, speed: 1.0 } },
    { id: 'deer-1', type: 'prey', species: 'Deer', gender: 'female', age: 3, pos: [-12, 0, 8], target: [-12, 0, 8], hunger: 100, thirst: 100, state: 'grazing', fertility: 0, traits: { size: 1.2, speed: 0.7 } },
    { id: 'fox-1', type: 'predator', species: 'Fox', gender: 'male', age: 2, pos: [12, 0, -8], target: [12, 0, -8], hunger: 100, thirst: 90, state: 'wandering', fertility: 0, traits: { size: 0.8, speed: 1.2 } },
  ],
  disasterEvent: null,
  riverLevel: 0.5,
  waterQuality: 0.8,
  carbonStorage: 0,

  simulate: (delta) => {
    set((state) => {
      let newSeasonProgress = state.seasonProgress + delta * 0.005;
      let newSeason = state.season;
      if (newSeasonProgress >= 1) {
        newSeasonProgress = 0;
        const idx = SEASONS.indexOf(state.season);
        newSeason = SEASONS[(idx + 1) % 4];
      }

      const seasonMod = { plantGrowth: 1.0, thirstDecay: 1.0, fishSpawnRate: 0.002 };
      if (newSeason === 'Spring') { seasonMod.plantGrowth = 1.5; seasonMod.fishSpawnRate = 0.003; }
      else if (newSeason === 'Summer') { seasonMod.plantGrowth = 1.0; seasonMod.thirstDecay = 1.3; seasonMod.fishSpawnRate = 0.004; }
      else if (newSeason === 'Autumn') { seasonMod.plantGrowth = 0.7; seasonMod.fishSpawnRate = 0.002; }
      else { seasonMod.plantGrowth = 0.2; seasonMod.thirstDecay = 0.7; seasonMod.fishSpawnRate = 0.001; }

      const weatherMultiplier = state.weather === 'Rain' ? 0.5 : 1;
      const weatherThirstMultiplier = weatherMultiplier * seasonMod.thirstDecay;
      let newRiverLevel = state.riverLevel + (state.weather === 'Rain' ? delta * 0.1 : -delta * 0.01) * (state.disasterEvent === 'drought' ? -1 : 1);
      newRiverLevel = Math.max(0, Math.min(1, newRiverLevel));
      let newWaterQuality = state.waterQuality + delta * 0.005 * (state.disasterEvent === 'pollution' ? -0.1 : 0.02);
      newWaterQuality = Math.max(0, Math.min(1, newWaterQuality));

      let aliveEntities = [...state.entities];
      let newCorpses = [...state.corpses];
      let newFood = [...state.food];
      let carbonBonus = 0;

      if (state.disasterEvent === 'wildfire') {
        aliveEntities = aliveEntities.filter(() => Math.random() > 0.4);
        const killed = state.entities.filter(e => !aliveEntities.find(a => a.id === e.id));
        killed.forEach(e => newCorpses.push({ id: `corpse-${e.id}-${Date.now()}`, type: 'corpse', species: e.species, pos: [...e.pos], decomposition: 0, decompositionRate: 0.03 }));
        newFood = newFood.filter(() => Math.random() > 0.5);
        if (Math.random() > 0.95) set({ disasterEvent: null });
      } else if (state.disasterEvent === 'drought') {
        seasonMod.thirstDecay *= 2.5;
        if (Math.random() > 0.97) set({ disasterEvent: null });
      } else if (state.disasterEvent === 'invasion') {
        if (Math.random() > 0.95) {
          for (let i = 0; i < 5; i++) aliveEntities.push({
            id: `rat-${Date.now()}-${i}`, type: 'prey', species: 'Rat',
            gender: Math.random() > 0.5 ? 'male' : 'female', age: 0,
            pos: [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE],
            target: [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE],
            hunger: 80, thirst: 80, state: 'wandering', fertility: 0, traits: { size: 0.6, speed: 1.0 },
          });
        }
        if (Math.random() > 0.98) set({ disasterEvent: null });
      } else if (state.disasterEvent === 'overhunting') {
        const targetSpecies = ['Wolf', 'Rabbit', 'Deer'][Math.floor(Math.random() * 3)];
        aliveEntities = aliveEntities.filter(e => e.species !== targetSpecies || Math.random() > 0.7);
        if (Math.random() > 0.96) set({ disasterEvent: null });
      } else if (state.disasterEvent === 'pollution') {
        newWaterQuality = Math.max(0, state.waterQuality - delta * 0.02);
        if (Math.random() > 0.97) set({ disasterEvent: null });
      } else if (state.disasterEvent === 'climatechange') {
        if (Math.random() > 0.99) {
          const newIdx = (SEASONS.indexOf(state.season) + (Math.random() > 0.5 ? 1 : -1) + 4) % 4;
          newSeason = SEASONS[newIdx];
          set({ disasterEvent: null });
        }
      }

      newFood = newFood.map(f => {
        if (f.size < f.maxSize) f.size = Math.min(f.maxSize, f.size + delta * f.growthRate * seasonMod.plantGrowth * (state.weather === 'Rain' ? 1.3 : 1));
        if (f.size >= f.maxSize && Math.random() < delta * 0.02) {
          newFood.push({
            id: `grass-${Date.now()}-${Math.random()}`, type: 'food', species: 'Grass',
            pos: [f.pos[0] + (Math.random() - 0.5) * 3, 0, f.pos[2] + (Math.random() - 0.5) * 3],
            size: 0.05, maxSize: 0.3 + Math.random() * 0.3, growthRate: 0.01 + Math.random() * 0.02,
          });
        }
        return f;
      });

      carbonBonus = newFood.reduce((sum, f) => sum + f.size, 0) * 0.1;

      newCorpses = newCorpses.map(corpse => {
        corpse.decomposition += delta * corpse.decompositionRate;
        if (corpse.decomposition >= 1) {
          const nearbyFood = newFood.filter(f => Math.hypot(corpse.pos[0] - f.pos[0], corpse.pos[2] - f.pos[2]) < 4);
          nearbyFood.forEach(f => f.size = Math.min(f.maxSize, f.size + 0.2));
          return null;
        }
        return corpse;
      }).filter(Boolean);

      const hungerDecayRate = 0.8;
      const thirstDecayRate = 1.2;
      const processedEntities = [];

      aliveEntities.forEach(entity => {
        let hunger = entity.hunger - (delta * hungerDecayRate);
        let thirst = entity.thirst - (delta * thirstDecayRate * weatherThirstMultiplier);
        let currentState = entity.state;
        let target = [...entity.target];
        let fertility = entity.fertility;
        let age = entity.age + delta / (60 * 60 * 24 * 365);
        let traits = { ...entity.traits };

        if (hunger <= 0 || thirst <= 0) {
          newCorpses.push({ id: `corpse-${entity.id}-${Date.now()}`, type: 'corpse', species: entity.species, pos: [...entity.pos], decomposition: 0, decompositionRate: 0.01 });
          return;
        }

        const baseSpeed = (entity.type === 'predator' && (currentState === 'hunting' || currentState === 'attacking') ? 4 : 2) * traits.speed;
        const moveSpeed = baseSpeed * delta;
        const distanceToTarget = Math.hypot(entity.pos[0] - target[0], entity.pos[2] - target[2]);
        const isAtTarget = distanceToTarget < 1.0;

        if (thirst < 40) {
          currentState = 'seeking_water';
          if (isAtTarget || entity.pos[2] < RIVER_Z_BOUNDS[0] || entity.pos[2] > RIVER_Z_BOUNDS[1]) {
            target = [entity.pos[0] + (Math.random() * 4 - 2), 0, 0];
          }
          if (Math.abs(entity.pos[2]) <= 3 && newRiverLevel > 0.1) thirst += delta * 40 * newRiverLevel;
        } else if (hunger < 50) {
          if (entity.type === 'predator') {
            currentState = 'hunting';
            let closestPrey = null, closestDist = Infinity;
            state.entities.forEach(other => {
              if (other.type === 'prey' && other.hunger > 0) {
                const d = Math.hypot(entity.pos[0] - other.pos[0], entity.pos[2] - other.pos[2]);
                if (d < closestDist) { closestDist = d; closestPrey = other; }
              }
            });
            if (closestPrey && closestDist < 8) {
              target = [closestPrey.pos[0], 0, closestPrey.pos[2]];
              if (closestDist < 1.5 && isAtTarget && Math.random() > 0.96) {
                hunger = Math.min(100, hunger + 70);
                newCorpses.push({ id: `corpse-${closestPrey.id}-${Date.now()}`, type: 'corpse', species: closestPrey.species, pos: [...closestPrey.pos], decomposition: 0, decompositionRate: 0.01 });
                return;
              }
            } else if (isAtTarget) { target = randomNearbyPosition(entity.pos, 10, entity.species); }
          } else {
            currentState = 'foraging';
            let closestFood = null, closestDist = Infinity;
            state.food.forEach(food => {
              const d = Math.hypot(entity.pos[0] - food.pos[0], entity.pos[2] - food.pos[2]);
              if (d < closestDist) { closestDist = d; closestFood = food; }
            });
            if (closestFood && closestDist < 5) {
              target = [closestFood.pos[0], 0, closestFood.pos[2]];
              if (closestDist < 1.0 && isAtTarget && Math.random() > 0.98) {
                hunger = Math.min(100, hunger + 25);
                const idx = state.food.findIndex(f => f.id === closestFood.id);
                if (idx !== -1) {
                  const updatedFood = [...state.food];
                  updatedFood[idx] = { ...updatedFood[idx], size: Math.max(0, updatedFood[idx].size - 0.15) };
                  if (updatedFood[idx].size <= 0) updatedFood.splice(idx, 1);
                  newFood = updatedFood;
                }
              }
            } else if (isAtTarget) { target = randomNearbyPosition(entity.pos, 8, entity.species); }
          }
        } else {
          currentState = 'wandering';
          fertility = Math.min(100, Math.max(0, (entity.hunger * 0.4) + (entity.thirst * 0.4) + (entity.age * 20)));
          if (fertility > 80 && entity.hunger > 70 && entity.thirst > 70 && age > 1.5) {
            const mate = state.entities.find(other =>
              other.id !== entity.id && other.species === entity.species && other.type === entity.type &&
              other.gender !== entity.gender && other.fertility > 80 && other.hunger > 70 && other.thirst > 70 &&
              Math.hypot(entity.pos[0] - other.pos[0], entity.pos[2] - other.pos[2]) < 3
            );
            if (mate && Math.random() > 0.997) {
              const offspringId = `${entity.species}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const childSize = (traits.size + mate.traits.size) / 2 + (Math.random() - 0.5) * 0.2;
              const childSpeed = (traits.speed + mate.traits.speed) / 2 + (Math.random() - 0.5) * 0.2;
              processedEntities.push({
                id: offspringId, type: entity.type, species: entity.species, gender: Math.random() > 0.5 ? 'male' : 'female', age: 0,
                pos: [entity.pos[0] + (Math.random()-0.5)*2, 0, entity.pos[2] + (Math.random()-0.5)*2],
                target: [entity.pos[0] + (Math.random()-0.5)*2, 0, entity.pos[2] + (Math.random()-0.5)*2],
                hunger: 100, thirst: 100, state: 'wandering', fertility: 0, traits: { size: Math.max(0.5, Math.min(1.5, childSize)), speed: Math.max(0.5, Math.min(1.5, childSpeed)) },
              });
              fertility = Math.max(0, fertility - 20);
              const mateIdx = processedEntities.findIndex(e => e.id === mate.id);
              if (mateIdx !== -1) processedEntities[mateIdx].fertility = Math.max(0, processedEntities[mateIdx].fertility - 20);
            }
          }
          if (isAtTarget) target = randomNearbyPosition(entity.pos, 8, entity.species);
        }

        hunger = Math.min(100, hunger);
        thirst = Math.min(100, thirst);
        fertility = Math.min(100, fertility);

        const dx = target[0] - entity.pos[0], dz = target[2] - entity.pos[2];
        const dist = Math.hypot(dx, dz);
        let newPos = [...entity.pos];
        if (dist > 0.1) {
          newPos[0] += (dx / dist) * moveSpeed;
          newPos[2] += (dz / dist) * moveSpeed;
        }

        if (entity.species === 'Fish') {
          if (newRiverLevel < 0.2) {
            newCorpses.push({ id: `corpse-${entity.id}-${Date.now()}`, type: 'corpse', species: entity.species, pos: [...entity.pos], decomposition: 0, decompositionRate: 0.01 });
            return;
          }
          newPos[2] = Math.max(-2, Math.min(2, newPos[2]));
          newPos[0] = Math.max(-MAP_SIZE/2 + 2, Math.min(MAP_SIZE/2 - 2, newPos[0]));
          target[2] = Math.max(-2, Math.min(2, target[2]));
        }

        processedEntities.push({ ...entity, hunger, thirst, state: currentState, target, pos: newPos, age, fertility, traits });
      });

      if (Math.random() > 0.998 * seasonMod.plantGrowth) {
        const spawnPos = randomMapPosition();
        const biome = getBiome(spawnPos[0], spawnPos[2]);
        const growthRate = biome === BIOMES.FOREST ? 0.015 : biome === BIOMES.WETLAND ? 0.025 : 0.01;
        newFood.push({ id: `grass-${Date.now()}`, type: 'food', species: 'Grass', pos: spawnPos, size: 0.05, maxSize: 0.3 + Math.random() * 0.3, growthRate });
      }

      if (processedEntities.filter(e => e.species === 'Fish').length < 8 && newRiverLevel > 0.3 && Math.random() > 0.995 * seasonMod.fishSpawnRate) {
        processedEntities.push({
          id: `fish-${Date.now()}-${Math.floor(Math.random()*1000)}`, type: 'prey', species: 'Fish', gender: Math.random() > 0.5 ? 'male' : 'female', age: 0,
          pos: [(Math.random()-0.5)*10, -0.5, 0], target: [(Math.random()-0.5)*10, -0.5, 0], hunger: 100, thirst: 100, state: 'swimming', fertility: 0, traits: { size: 1.0, speed: 1.0 },
        });
      }

      const newDayCycle = state.dayCycle + (delta * 0.1);
      const timeOfDay = (8 + newDayCycle) % 24;

      return {
        entities: processedEntities, corpses: newCorpses, food: newFood,
        dayCycle: newDayCycle, timeOfDay, season: newSeason, seasonProgress: newSeasonProgress,
        riverLevel: newRiverLevel, waterQuality: newWaterQuality, carbonStorage: carbonBonus,
      };
    });
  },

  spawnEntity: (species, gender = Math.random() > 0.5 ? 'male' : 'female') =>
    set((state) => {
      const data = SPECIES_DATA[species];
      return {
        entities: [...state.entities, {
          id: `${species}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: data.type, species, gender, age: 0,
          pos: randomMapPosition(), target: randomMapPosition(),
          hunger: 100, thirst: 100, state: 'wandering', fertility: 0, traits: { size: 1.0, speed: 1.0 },
        }]
      };
    }),
  setWeather: (weather) => set({ weather }),
  setDisaster: (event) => set({ disasterEvent: event }),
}));

function randomMapPosition() { return [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE]; }
function randomNearbyPosition(pos, range, species) {
  let newX = pos[0] + (Math.random() - 0.5) * range;
  let newZ = pos[2] + (Math.random() - 0.5) * range;
  const pref = SPECIES_DATA[species]?.preferredBiomes;
  if (pref) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const biome = getBiome(newX, newZ);
      if (pref.includes(biome)) break;
      newX = pos[0] + (Math.random() - 0.5) * range;
      newZ = pos[2] + (Math.random() - 0.5) * range;
    }
  }
  return [Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, newX)), 0, Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, newZ))];
}

// ==========================================
// 2. TRANSIENT 3D ENTITIES (ORIGINAL LOGIC)
// ==========================================
const Animal = ({ id, type, species, gender, initialPos }) => {
  const groupRef = useRef();
  const textRef = useRef();
  const hungerBarRef = useRef();
  const bodyMaterialRef = useRef();

  const baseColor = useMemo(() => {
    switch (species) {
      case 'Wolf': return new THREE.Color('#3f3f46');
      case 'Rabbit': return new THREE.Color('#d4d4d8');
      case 'Fish': return new THREE.Color('#a5b4fc');
      case 'Rat': return new THREE.Color('#a8a29e');
      case 'Deer': return new THREE.Color('#c19a6b');
      case 'Fox': return new THREE.Color('#d97a3e');
      case 'Eagle': return new THREE.Color('#5c4033');
      default: return new THREE.Color('#808080');
    }
  }, [species]);
  const warningColor = useMemo(() => new THREE.Color('#ef4444'), []);

  useFrame(() => {
    const entity = useStore.getState().entities.find(e => e.id === id);
    if (!entity || !groupRef.current) return;
    groupRef.current.position.set(entity.pos[0], entity.pos[1] || 0, entity.pos[2]);
    const lookTarget = new THREE.Vector3(entity.target[0], 0, entity.target[2]);
    groupRef.current.lookAt(lookTarget);
    if (textRef.current) textRef.current.text = entity.state;
    if (hungerBarRef.current) {
      hungerBarRef.current.scale.x = Math.max(0.01, entity.hunger / 100);
      hungerBarRef.current.position.x = (entity.hunger / 100 - 1) / 2;
    }
    if (bodyMaterialRef.current) {
      const needsWarning = entity.hunger < 20 || entity.thirst < 20;
      bodyMaterialRef.current.color.lerp(needsWarning ? warningColor : baseColor, 0.1);
    }
  });

  const renderModel = () => {
    switch (species) {
      case 'Wolf':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
              <boxGeometry args={[0.7, 0.7, 1.4]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.0, 0.8]}><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            {[[-0.3, -0.5], [0.3, -0.5], [-0.3, 0.5], [0.3, 0.5]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.15, z]}><boxGeometry args={[0.12, 0.6, 0.12]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            ))}
            <mesh position={[0, 0.5, -0.9]}><boxGeometry args={[0.12, 0.12, 0.4]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
          </group>
        );
      case 'Rabbit':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[0.5, 0.35, 0.7]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.65, 0.5]}><sphereGeometry args={[0.25]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            <mesh position={[-0.15, 0.95, 0.3]}><boxGeometry args={[0.08, 0.45, 0.1]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            <mesh position={[0.15, 0.95, 0.3]}><boxGeometry args={[0.08, 0.45, 0.1]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
          </group>
        );
      case 'Fish':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[0.25, 0.2, 0.8]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.1, -0.5]}><coneGeometry args={[0.2, 0.2, 4]} /><meshStandardMaterial color={baseColor} roughness={0.4} /></mesh>
            <mesh position={[0.12, 0.25, 0.3]}><sphereGeometry args={[0.06]} /><meshBasicMaterial color="black" /></mesh>
            <mesh position={[-0.12, 0.25, 0.3]}><sphereGeometry args={[0.06]} /><meshBasicMaterial color="black" /></mesh>
          </group>
        );
      case 'Rat':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[0.35, 0.25, 0.6]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.4, 0.4]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            <mesh position={[0, 0.15, -0.45]}><capsuleGeometry args={[0.04, 0.4]} /><meshStandardMaterial color="#f472b6" roughness={0.5} /></mesh>
          </group>
        );
      case 'Deer':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
              <boxGeometry args={[0.8, 0.9, 1.8]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.4, 1.0]}><boxGeometry args={[0.4, 0.5, 0.5]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            <mesh position={[-0.3, 1.8, 0.8]}><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
            <mesh position={[0.3, 1.8, 0.8]}><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
            {[[-0.3, -0.6], [0.3, -0.6], [-0.3, 0.6], [0.3, 0.6]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.2, z]}><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            ))}
          </group>
        );
      case 'Fox':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[0.6, 0.5, 1.2]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.7, 0.7]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            {[[-0.25, -0.4], [0.25, -0.4], [-0.25, 0.4], [0.25, 0.4]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.1, z]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
            ))}
            <mesh position={[0, 0.3, -0.7]}><boxGeometry args={[0.12, 0.12, 0.4]} /><meshStandardMaterial color={baseColor} roughness={0.8} /></mesh>
          </group>
        );
      case 'Eagle':
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
              <boxGeometry args={[0.5, 0.4, 1.0]} />
              <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.9, 0.5]}><boxGeometry args={[0.25, 0.25, 0.25]} /><meshStandardMaterial color="#ffffff" roughness={0.5} /></mesh>
            <mesh position={[0.8, 0.6, 0]} rotation={[0, 0, Math.PI/8]}><boxGeometry args={[1.5, 0.1, 0.3]} /><meshStandardMaterial color="#5c4033" /></mesh>
            <mesh position={[-0.8, 0.6, 0]} rotation={[0, 0, -Math.PI/8]}><boxGeometry args={[1.5, 0.1, 0.3]} /><meshStandardMaterial color="#5c4033" /></mesh>
            <mesh position={[0, 0.2, -0.3]}><boxGeometry args={[0.1, 0.1, 0.2]} /><meshStandardMaterial color="black" /></mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.8]} />
            <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} position={initialPos}>
      {renderModel()}
      <Text ref={textRef} position={[0, 2.2, 0]} fontSize={0.3} color="white" anchorX="center" outlineWidth={0.02} outlineColor="black">
        Spawning...
      </Text>
      <mesh position={[0, 1.8, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#ef4444" />
        <mesh ref={hungerBarRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </mesh>
    </group>
  );
};

const CorpseMesh = ({ corpse }) => {
  const rotation = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < corpse.id.length; i++) { hash = ((hash << 5) - hash) + corpse.id.charCodeAt(i); hash |= 0; }
    return [0, (Math.abs(hash) % 360) * (Math.PI / 180), 0];
  }, [corpse.id]);
  return (
    <group>
      <mesh position={[corpse.pos[0], 0.1, corpse.pos[2]]} rotation={rotation} scale={[1 - corpse.decomposition, 0.2, 1 - corpse.decomposition]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color={`hsl(30, ${40 * corpse.decomposition}%, ${20 * (1 - corpse.decomposition)}%)`} roughness={0.8} opacity={1 - corpse.decomposition * 0.5} transparent />
      </mesh>
      {corpse.decomposition > 0.3 && corpse.decomposition < 0.9 && [...Array(3)].map((_, i) => (
        <mesh key={`${corpse.id}-${i}`} position={[corpse.pos[0] + (Math.random() - 0.5) * 0.3, 0.1 + Math.random() * 0.2, corpse.pos[2] + (Math.random() - 0.5) * 0.3]} scale={0.05}>
          <sphereGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="#8B4513" opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  );
};

const FoodItem = ({ food }) => {
  const stage = food.size / food.maxSize;
  return (
    <group position={[food.pos[0], 0.05, food.pos[2]]}>
      {stage < 0.15 && <mesh scale={0.05}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#a3e635" roughness={0.9} /></mesh>}
      {stage >= 0.15 && stage < 0.4 && <mesh scale={[food.size * 0.5, food.size, food.size * 0.5]}><coneGeometry args={[0.15, 0.3, 4]} /><meshStandardMaterial color="#65a30d" roughness={0.8} /></mesh>}
      {stage >= 0.4 && <mesh scale={[food.size, food.size * 0.3, food.size]}><cylinderGeometry args={[0.15, 0.15, 0.3]} /><meshStandardMaterial color="#15803d" roughness={0.7} /></mesh>}
      {stage > 0.8 && <mesh position={[0, 0.03, 0]} scale={[food.size * 1.5, 0.02, food.size * 1.5]}><cylinderGeometry args={[0.2, 0.01, 0.2]} /><meshBasicMaterial color="#22c55e" opacity={0.3} transparent /></mesh>}
    </group>
  );
};

// ==========================================
// 3. TERRAIN, MOUNTAINS, AND LIGHTING
// ==========================================
const Terrain = () => {
  const meshRef = useRef();
  
  const biomeColors = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const worldX = (x / 512 - 0.5) * MAP_SIZE;
        const worldZ = (y / 512 - 0.5) * MAP_SIZE;
        const biome = getBiome(worldX, worldZ);
        let color;
        switch (biome) {
          case BIOMES.FOREST: color = '#1b4d1b'; break;
          case BIOMES.GRASSLAND: color = '#4caf50'; break;
          case BIOMES.WETLAND: color = '#2e7d32'; break;
          case BIOMES.ROCKY: color = '#757575'; break;
          default: color = '#4caf50';
        }
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * MAP_SIZE;
      const z = (Math.random() - 0.5) * MAP_SIZE;
      const biome = getBiome(x, z);
      if (biome === BIOMES.FOREST || biome === BIOMES.WETLAND) {
        arr.push({ position: [x, 0, z] });
      } else if (Math.random() > 0.7) arr.push({ position: [x, 0, z] });
    }
    return arr;
  }, []);

  const mountains = useMemo(() => {
    const m = [];
    const radius = MAP_SIZE / 2 + 2; 
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const dist = radius + Math.random() * 5;
      m.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        height: 10 + Math.random() * 15,
        radius: 8 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#3f3f46' : '#27272a'
      });
    }
    return m;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} ref={meshRef}>
        <planeGeometry args={[MAP_SIZE + 10, MAP_SIZE + 10]} />
        <meshStandardMaterial map={biomeColors} roughness={1} />
      </mesh>
      {/* River */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[MAP_SIZE + 10, 6]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} roughness={0.1} metalness={0.2} />
      </mesh>
      {trees.map((tree, i) => (
        <group key={i} position={tree.position}>
          <mesh position={[0, 1, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 2]} /><meshStandardMaterial color="#5c4033" /></mesh>
          <mesh position={[0, 2.5, 0]} castShadow><dodecahedronGeometry args={[1.5]} /><meshStandardMaterial color="#1e4620" /></mesh>
        </group>
      ))}
      {/* Surrounding Mountains */}
      {mountains.map((mtn, i) => (
        <mesh key={`mtn-${i}`} position={[mtn.pos[0], mtn.height / 2, mtn.pos[2]]} castShadow receiveShadow>
          <coneGeometry args={[mtn.radius, mtn.height, 5]} />
          <meshStandardMaterial color={mtn.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// FIXED: Sun, Moon, Fog, and Lighting bound safely to Canvas
const EnvironmentSystems = () => {
  const { scene } = useThree();
  const weather = useStore(state => state.weather);
  const sunRef = useRef();
  const moonRef = useRef();
  const ambientRef = useRef();

  useFrame(() => {
    const timeOfDay = useStore.getState().timeOfDay;
    const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    const x = Math.cos(angle) * 50;
    const y = Math.sin(angle) * 50;
    
    if (sunRef.current) { 
      sunRef.current.position.set(x, y, 0); 
      sunRef.current.intensity = Math.max(0, Math.sin(angle) * 2.5); 
    }
    if (moonRef.current) { 
      moonRef.current.position.set(-x, -y, 0); 
      moonRef.current.intensity = Math.max(0, -Math.sin(angle) * 0.5); 
    }
    if (ambientRef.current) {
       ambientRef.current.intensity = y > 0 ? (weather === 'Rain' ? 0.3 : 0.6) : 0.1;
    }

    // Colors transition based on sun height
    let skyColor, fogColor;
    if (y > 20) { 
      skyColor = new THREE.Color(weather === 'Rain' ? '#6b7280' : '#87CEEB');
      fogColor = skyColor;
    } else if (y > 0) { 
      skyColor = new THREE.Color('#fdba74');
      fogColor = new THREE.Color('#ea580c');
    } else { 
      skyColor = new THREE.Color('#0f172a');
      fogColor = new THREE.Color('#020617');
    }

    scene.background = skyColor;
    scene.fog = new THREE.Fog(fogColor, 25, MAP_SIZE + 15);
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={sunRef} castShadow shadow-mapSize={[2048, 2048]} color="#ffeedd">
        <mesh><sphereGeometry args={[2]} /><meshBasicMaterial color="#fbbf24" /></mesh>
      </directionalLight>
      <directionalLight ref={moonRef} color="#bae6fd" castShadow shadow-mapSize={[1024, 1024]}>
        <mesh><sphereGeometry args={[1.5]} /><meshBasicMaterial color="#e0f2fe" /></mesh>
      </directionalLight>
      <Sky turbidity={weather === 'Rain' ? 5 : 0.1} rayleigh={weather === 'Rain' ? 2 : 0.5} />
      {weather === 'Rain' && <Sparkles count={2000} scale={[MAP_SIZE, 20, MAP_SIZE]} size={2} color="#93c5fd" speed={0.8} opacity={0.6} position={[0, 10, 0]} />}
    </>
  );
};

// FIXED: The game loop running safely inside the Canvas
const SimulationController = () => {
  const simulate = useStore(state => state.simulate);
  const entityIdString = useStore(state => state.entities.map(e => `${e.id}:${e.type}:${e.species}:${e.gender}`).join(','));
  const activeEntities = useMemo(() => {
    if (!entityIdString) return [];
    return entityIdString.split(',').map(str => {
      const [id, type, species, gender] = str.split(':');
      return { id, type, species, gender };
    });
  }, [entityIdString]);
  const food = useStore(state => state.food);
  const corpses = useStore(state => state.corpses);

  useFrame((state, delta) => simulate(Math.min(delta, 0.1)));

  return (
    <>
      <Terrain />
      <EnvironmentSystems />
      {food.map(f => <FoodItem key={f.id} food={f} />)}
      {corpses.map(c => <CorpseMesh key={c.id} corpse={c} />)}
      {activeEntities.map(e => <Animal key={e.id} id={e.id} type={e.type} species={e.species} gender={e.gender} initialPos={[0,0,0]} />)}
    </>
  );
};

// ==========================================
// 4. UI OVERLAY (ORIGINAL)
// ==========================================
const DashboardUI = () => {
  const [stats, setStats] = useState({
    time: 8, weather: 'Clear', season: 'Spring', herb: 0, carn: 0, dead: 0, food: 0,
    biomass: 0, biodiversity: 0, health: 0, waterQuality: 0.8, riverLevel: 0.5, carbon: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useStore.getState();
      const totalFoodSize = state.food.reduce((s, f) => s + f.size, 0);
      const herb = state.entities.filter(e => e.type === 'prey').length;
      const carn = state.entities.filter(e => e.type === 'predator').length;
      const total = herb + carn;
      const biomass = Math.min(100, totalFoodSize * 20);
      const speciesSet = new Set(state.entities.map(e => e.species));
      const biodiversity = Math.min(100, speciesSet.size * 15);
      const balance = total > 0 ? Math.min(100, Math.abs(herb - carn) < 5 ? 100 : 40) : 0;
      const health = Math.min(100, biomass * 0.35 + biodiversity * 0.35 + balance * 0.3);
      setStats({
        time: Math.floor(state.timeOfDay), weather: state.weather, season: state.season,
        herb, carn, dead: state.corpses.length, food: state.food.length,
        biomass, biodiversity, health: Math.round(health),
        waterQuality: state.waterQuality, riverLevel: state.riverLevel, carbon: state.carbonStorage,
      });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-0 left-0 right-0 p-4 z-10 flex flex-wrap justify-between items-start pointer-events-none gap-4 text-white">
      <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 w-44">
        {stats.weather === 'Clear' ? <Sun className="text-yellow-400" size={20} /> : <CloudRain className="text-blue-400" size={20} />}
        <div><p className="text-[10px] text-gray-400 uppercase font-bold">Time / Season</p><p className="font-semibold text-sm">{stats.time}:00 • {stats.season}</p><p className="text-[10px] text-gray-500">{stats.weather}</p></div>
      </div>
      <div className="flex gap-2">
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><p className="text-[9px] text-gray-400 uppercase font-bold">Herbivores</p><p className="font-mono text-green-400 font-bold">{stats.herb}</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><p className="text-[9px] text-gray-400 uppercase font-bold">Carnivores</p><p className="font-mono text-red-400 font-bold">{stats.carn}</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><p className="text-[9px] text-gray-400 uppercase font-bold">Plants</p><p className="font-mono text-green-500 font-bold">{Math.round(stats.biomass * 20)}</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><p className="text-[9px] text-gray-400 uppercase font-bold">Biodiversity</p><p className="font-mono text-blue-400 font-bold">{stats.biodiversity}</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><p className="text-[9px] text-gray-400 uppercase font-bold">Ecosystem</p><p className={`font-mono ${stats.health >= 80 ? 'text-green-400' : stats.health >= 60 ? 'text-yellow-400' : 'text-red-400'} font-bold`}>{stats.health}%</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><Waves size={12} className="text-blue-300 mb-1" /><p className="text-[9px] text-gray-400 uppercase font-bold">River</p><p className="font-mono text-xs">{Math.round(stats.riverLevel * 100)}%</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><Droplet size={12} className="text-blue-300 mb-1" /><p className="text-[9px] text-gray-400 uppercase font-bold">Water Q.</p><p className="font-mono text-xs">{Math.round(stats.waterQuality * 100)}%</p></div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center"><Thermometer size={12} className="text-orange-300 mb-1" /><p className="text-[9px] text-gray-400 uppercase font-bold">Carbon</p><p className="font-mono text-xs">{stats.carbon.toFixed(1)}</p></div>
      </div>
    </motion.div>
  );
};

const EntityInfoModal = ({ entity, onClose }) => {
  if (!entity) return null;
  const data = SPECIES_DATA[entity.species] || { role: 'Unknown', diet: 'Unknown', predators: 'None', status: 'Unknown', trophicLevel: 'Unknown' };
  const population = useStore.getState().entities.filter(e => e.species === entity.species).length;
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 z-50 w-80 text-white shadow-2xl"
      onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
      <h3 className="text-xl font-bold mb-2">{entity.species} ({entity.gender})</h3>
      <p className="text-sm"><span className="text-gray-500">Age:</span> {entity.age.toFixed(1)} yrs</p>
      <p className="text-sm"><span className="text-gray-500">State:</span> {entity.state}</p>
      <p className="text-sm"><span className="text-gray-500">Hunger:</span> {Math.round(entity.hunger)}%</p>
      <p className="text-sm"><span className="text-gray-500">Thirst:</span> {Math.round(entity.thirst)}%</p>
      <p className="text-sm"><span className="text-gray-500">Traits:</span> size {entity.traits.size.toFixed(2)}, speed {entity.traits.speed.toFixed(2)}</p>
      <hr className="my-2 border-gray-700" />
      <p className="text-sm"><span className="text-gray-500">Role:</span> {data.trophicLevel}</p>
      <p className="text-sm"><span className="text-gray-500">Diet:</span> {data.diet.join(', ')}</p>
      <p className="text-sm"><span className="text-gray-500">Predators:</span> {data.predators.length ? data.predators.join(', ') : 'None'}</p>
      <p className="text-sm"><span className="text-gray-500">Population:</span> {population}</p>
      <p className="text-sm"><span className="text-gray-500">Conservation:</span> {data.status}</p>
    </motion.div>
  );
};

const ControlsUI = () => {
  const spawnEntity = useStore(s => s.spawnEntity);
  const setWeather = useStore(s => s.setWeather);
  const setDisaster = useStore(s => s.setDisaster);
  const weather = useStore(s => s.weather);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const inspectRandomEntity = () => {
    const entities = useStore.getState().entities;
    if (entities.length > 0) setSelectedEntity(entities[Math.floor(Math.random() * entities.length)]);
  };

  return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute bottom-8 right-8 z-10 flex flex-col gap-3 w-80 pointer-events-auto">
      <div className="bg-black/70 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl text-white">
        <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-gray-400 flex items-center gap-2"><Activity size={14} /> God Controls</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {['Rabbit', 'Deer', 'Fish', 'Wolf', 'Fox', 'Eagle'].map(species => (
              <button key={species} onClick={() => spawnEntity(species)}
                className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer border border-white/10 hover:bg-white/10`}>
                <Sprout size={14} className="text-green-400" /> {species}
              </button>
            ))}
          </div>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setWeather(weather === 'Clear' ? 'Rain' : 'Clear')} className={`w-full transition-all py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border cursor-pointer ${weather === 'Clear' ? 'bg-blue-900/30 hover:bg-blue-800/50 border-blue-500/30 text-blue-200' : 'bg-yellow-900/30 hover:bg-yellow-800/50 border-yellow-500/30 text-yellow-200'}`}>
              {weather === 'Clear' ? <CloudRain size={14} /> : <Sun size={14} />} {weather === 'Clear' ? 'Rain' : 'Clear'}
            </button>
            <button onClick={() => {
              setWeather('Clear'); setDisaster(null);
              setTimeout(() => {
                const store = useStore.getState();
                store.spawnEntity('Rabbit'); store.spawnEntity('Deer'); store.spawnEntity('Wolf'); store.spawnEntity('Fox');
              }, 100);
            }} className="w-full bg-gray-800/50 hover:bg-gray-700/80 border border-gray-600/30 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setDisaster('wildfire')} className="bg-orange-900/40 hover:bg-orange-800/70 border border-orange-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Flame size={16} className="text-orange-400" /> Wildfire</button>
            <button onClick={() => setDisaster('drought')} className="bg-yellow-900/40 hover:bg-yellow-800/70 border border-yellow-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Sun size={16} className="text-yellow-400" /> Drought</button>
            <button onClick={() => setDisaster('invasion')} className="bg-red-900/40 hover:bg-red-800/70 border border-red-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Bug size={16} className="text-red-300" /> Invasion</button>
            <button onClick={() => setDisaster('overhunting')} className="bg-purple-900/40 hover:bg-purple-800/70 border border-purple-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Skull size={16} className="text-purple-400" /> Overhunt</button>
            <button onClick={() => setDisaster('pollution')} className="bg-green-900/40 hover:bg-green-800/70 border border-green-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Droplet size={16} className="text-green-300" /> Pollution</button>
            <button onClick={() => setDisaster('climatechange')} className="bg-gray-700/40 hover:bg-gray-600/70 border border-gray-500/30 py-2 rounded-xl text-xs flex flex-col items-center gap-1 cursor-pointer"><Thermometer size={16} className="text-gray-300" /> Climate</button>
          </div>
          <button onClick={inspectRandomEntity} className="w-full bg-gray-800/50 hover:bg-gray-700/80 border border-gray-600/30 transition-all py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"><Zap size={14} className="text-gray-300" /> Inspect Animal</button>
        </div>
      </div>
      {selectedEntity && <EntityInfoModal entity={selectedEntity} onClose={() => setSelectedEntity(null)} />}
    </motion.div>
  );
};

// ==========================================
// 5. MAIN EXPORT
// ==========================================
export default function EcoBalanceGame() {
  return (
    <div className="relative w-full h-screen bg-gray-950 text-white overflow-hidden font-sans select-none">
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [20, 25, 20], fov: 45 }}>
          
          <SimulationController />
          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.4} far={10} color="#000000" />
          
          {/* Locked Camera - prevents clipping under ground or going past mountains */}
          <OrbitControls 
            makeDefault 
            maxPolarAngle={Math.PI / 2 - 0.05} // Stops exactly above the ground
            minDistance={5} 
            maxDistance={MAP_SIZE / 1.5} // Keeps you inside the mountain ring
          />
        </Canvas>
      </div>
      <DashboardUI />
      <ControlsUI />
      <div className="absolute bottom-6 left-6 pointer-events-none text-white/40 text-xs font-mono">
        Left Click + Drag: Rotate | Scroll: Zoom | Right Click + Drag: Pan
      </div>
    </div>
  );
}