import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Text, Sparkles } from '@react-three/drei';
import { create } from 'zustand';
import { motion } from 'framer-motion';
import { Activity, Droplet, Sun, Wind, CloudRain, Skull, Leaf } from 'lucide-react';
import * as THREE from 'three';

// ==========================================
// 1. ZUSTAND ECOSYSTEM ENGINE
// ==========================================
const MAP_SIZE = 40;
const RIVER_Z_BOUNDS = [-2, 2];

const useStore = create((set) => ({
  weather: 'Clear',
  timeOfDay: 8,
  dayCycle: 0,
  corpses: 0,
  entities: [
    { id: 'wolf-1', type: 'predator', species: 'Wolf', pos: [5, 0, 5], target: [5, 0, 5], hunger: 100, thirst: 80, state: 'wandering' },
    { id: 'rabbit-1', type: 'prey', species: 'Rabbit', pos: [-5, 0, -5], target: [-5, 0, -5], hunger: 100, thirst: 100, state: 'grazing' },
    { id: 'rabbit-2', type: 'prey', species: 'Rabbit', pos: [-6, 0, -4], target: [-6, 0, -4], hunger: 90, thirst: 95, state: 'grazing' },
  ],

  // Main AI & Physics Loop - Runs at 60FPS
  tick: (delta) => {
    set((state) => {
      let aliveEntities = [];
      let newCorpses = state.corpses;
      const weatherMultiplier = state.weather === 'Rain' ? 0.5 : 1;

      state.entities.forEach(entity => {
        let hunger = entity.hunger - (delta * 1.5);
        let thirst = entity.thirst - (delta * 2.5 * weatherMultiplier);
        let currentState = entity.state;
        let target = [...entity.target];

        // Death Check
        if (hunger <= 0 || thirst <= 0) {
          newCorpses++;
          return; 
        }

        const distanceToTarget = Math.hypot(entity.pos[0] - target[0], entity.pos[2] - target[2]);
        const isAtTarget = distanceToTarget < 1.0;

        // Behavior Tree
        if (thirst < 40) {
          currentState = 'seeking_water';
          if (isAtTarget || entity.pos[2] < RIVER_Z_BOUNDS[0] || entity.pos[2] > RIVER_Z_BOUNDS[1]) {
            target = [entity.pos[0] + (Math.random() * 4 - 2), 0, 0]; 
          }
          if (Math.abs(entity.pos[2]) <= 2.5) thirst += delta * 40;
        } 
        else if (hunger < 50) {
          currentState = entity.type === 'predator' ? 'hunting' : 'foraging';
          if (isAtTarget) {
             target = [
               Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, entity.pos[0] + (Math.random() * 10 - 5))),
               0,
               Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, entity.pos[2] + (Math.random() * 10 - 5)))
             ];
          }
          if (isAtTarget && Math.random() > 0.95) hunger += 30; 
        } 
        else {
          currentState = 'wandering';
          if (isAtTarget) {
            target = [
              Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, entity.pos[0] + (Math.random() * 6 - 3))),
              0,
              Math.max(-MAP_SIZE/2, Math.min(MAP_SIZE/2, entity.pos[2] + (Math.random() * 6 - 3)))
            ];
          }
        }

        hunger = Math.min(100, hunger);
        thirst = Math.min(100, thirst);

        // Move logical position toward target to sync physics with rendering
        const moveSpeed = (entity.type === 'predator' && currentState === 'hunting' ? 4 : 2) * delta;
        const dx = target[0] - entity.pos[0];
        const dz = target[2] - entity.pos[2];
        const dist = Math.hypot(dx, dz);
        
        let newPos = [...entity.pos];
        if (dist > 0.1) {
            newPos[0] += (dx / dist) * moveSpeed;
            newPos[2] += (dz / dist) * moveSpeed;
        }

        aliveEntities.push({ ...entity, hunger, thirst, state: currentState, target, pos: newPos });
      });

      const newDayCycle = state.dayCycle + (delta * 0.1);
      const timeOfDay = (8 + newDayCycle) % 24;

      return { entities: aliveEntities, corpses: newCorpses, dayCycle: newDayCycle, timeOfDay };
    });
  },

  spawnEntity: (species, type) => {
    set((state) => ({
      entities: [...state.entities, {
        id: `${species}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type,
        species,
        pos: [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE],
        target: [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() - 0.5) * MAP_SIZE],
        hunger: 100,
        thirst: 100,
        state: 'wandering'
      }]
    }));
  },

  setWeather: (weather) => set({ weather }),
}));

// ==========================================
// 2. TRANSIENT 3D ENTITIES
// ==========================================
const Animal = ({ id, type, initialPos }) => {
  const groupRef = useRef();
  const textRef = useRef();
  const hungerBarRef = useRef();
  const bodyMaterialRef = useRef();

  const isPredator = type === 'predator';
  const size = isPredator ? [0.6, 0.6, 1.2] : [0.3, 0.3, 0.5];
  
  // Memoize colors so we don't instantiate them every frame
  const baseColor = useMemo(() => new THREE.Color(isPredator ? '#3f3f46' : '#d4d4d8'), [isPredator]);
  const warningColor = useMemo(() => new THREE.Color('#ef4444'), []);
  const targetVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    // TRANSIENT STATE: Read directly from the store without triggering React re-renders!
    const entity = useStore.getState().entities.find(e => e.id === id);
    if (!entity || !groupRef.current) return;

    // 1. Update Position
    targetVec.set(entity.pos[0], 0, entity.pos[2]);
    groupRef.current.position.copy(targetVec);
    
    const lookTarget = new THREE.Vector3(entity.target[0], 0, entity.target[2]);
    groupRef.current.lookAt(lookTarget);

    // 2. Update UI Text
    if (textRef.current) textRef.current.text = entity.state;

    // 3. Update Health Bar Scale
    if (hungerBarRef.current) {
        hungerBarRef.current.scale.x = Math.max(0.01, entity.hunger / 100);
        hungerBarRef.current.position.x = (entity.hunger / 100 - 1) / 2;
    }

    // 4. Update Color Warning
    if (bodyMaterialRef.current) {
        const needsWarning = entity.hunger < 20 || entity.thirst < 20;
        bodyMaterialRef.current.color.lerp(needsWarning ? warningColor : baseColor, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <mesh castShadow receiveShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial ref={bodyMaterialRef} color={baseColor} roughness={0.8} />
      </mesh>
      
      <Text ref={textRef} position={[0, size[1] + 0.6, 0]} fontSize={0.3} color="white" anchorX="center" outlineWidth={0.02} outlineColor="black">
        Spawning...
      </Text>
      
      <mesh position={[0, size[1] + 0.3, 0]}>
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

const Terrain = () => {
  const trees = useMemo(() => [...Array(15)].map(() => ({
    position: [(Math.random() - 0.5) * MAP_SIZE, 0, (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 15 + 3)]
  })), []);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[MAP_SIZE + 10, MAP_SIZE + 10]} />
        <meshStandardMaterial color="#2d5a27" roughness={1} />
      </mesh>
      
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[MAP_SIZE + 10, 4]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} roughness={0.1} metalness={0.2} />
      </mesh>

      {trees.map((tree, i) => (
        <group key={i} position={tree.position}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
             <dodecahedronGeometry args={[1.5]} />
             <meshStandardMaterial color="#1e4620" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const EnvironmentSystems = () => {
  const weather = useStore(state => state.weather);
  const timeRef = useRef({ angle: 0 });
  const lightRef = useRef();
  const skyRef = useRef();

  useFrame(() => {
     // Transient time read
     const timeOfDay = useStore.getState().timeOfDay;
     timeRef.current.angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
     
     const x = Math.cos(timeRef.current.angle) * 50;
     const y = Math.sin(timeRef.current.angle) * 50;

     if (lightRef.current) {
        lightRef.current.position.set(x, y, 0);
        lightRef.current.intensity = Math.max(0, Math.sin(timeRef.current.angle) * 2);
     }
  });

  return (
    <>
      <Sky ref={skyRef} turbidity={weather === 'Rain' ? 5 : 0.1} rayleigh={weather === 'Rain' ? 2 : 0.5} />
      <ambientLight intensity={weather === 'Rain' ? 0.2 : 0.4} />
      <directionalLight 
        ref={lightRef}
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={20} shadow-camera-bottom={-20}
      />
      {weather === 'Rain' && (
        <Sparkles count={2000} scale={[MAP_SIZE, 20, MAP_SIZE]} size={2} color="#93c5fd" speed={0.8} opacity={0.6} position={[0, 10, 0]} />
      )}
    </>
  );
};

const SimulationController = () => {
  const tick = useStore(state => state.tick);
  
  // Only re-render when the STRING of IDs changes (prevents loop)
  const entityIdString = useStore(state => state.entities.map(e => `${e.id}:${e.type}`).join(','));
  const activeEntities = useMemo(() => {
    if (!entityIdString) return [];
    return entityIdString.split(',').map(str => {
       const [id, type] = str.split(':');
       return { id, type };
    });
  }, [entityIdString]);

  useFrame((state, delta) => tick(Math.min(delta, 0.1)));

  return (
    <>
      <Terrain />
      <EnvironmentSystems />
      {activeEntities.map(entity => (
        <Animal key={entity.id} id={entity.id} type={entity.type} initialPos={[0,0,0]} />
      ))}
    </>
  );
};

// ==========================================
// 3. UI OVERLAY (DECOUPLED FROM 60FPS)
// ==========================================
const DashboardUI = () => {
  const [stats, setStats] = useState({ time: 8, weather: 'Clear', herb: 0, carn: 0, dead: 0 });

  useEffect(() => {
    // Update the UI HTML only 4 times a second, not 60!
    const interval = setInterval(() => {
      const state = useStore.getState();
      setStats({
        time: Math.floor(state.timeOfDay),
        weather: state.weather,
        herb: state.entities.filter(e => e.type === 'prey').length,
        carn: state.entities.filter(e => e.type === 'predator').length,
        dead: state.corpses
      });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-0 left-0 right-0 p-4 z-10 flex flex-wrap justify-between items-start pointer-events-none gap-4">
      <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 w-40">
        {stats.weather === 'Clear' ? <Sun className="text-yellow-400" size={20} /> : <CloudRain className="text-blue-400" size={20} />}
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Time & Weather</p>
          <p className="font-semibold text-sm">{stats.time}:00 • {stats.weather}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Herbivores</p>
          <p className="font-mono text-green-400 font-bold text-lg">{stats.herb}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Carnivores</p>
          <p className="font-mono text-red-400 font-bold text-lg">{stats.carn}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center">
           <p className="text-[10px] text-gray-400 uppercase font-bold">Deceased</p>
           <p className="font-mono text-gray-500 font-bold text-lg flex items-center gap-1"><Skull size={14}/> {stats.dead}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ControlsUI = () => {
  // Read static functions, no reactive subscriptions here
  const { spawnEntity, setWeather } = useStore.getState();
  const weather = useStore(state => state.weather); // Weather is slow-changing, okay to subscribe

  return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute bottom-8 right-8 z-10 flex flex-col gap-3 w-72 pointer-events-auto">
      <div className="bg-black/70 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
        <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Activity size={14} /> God Controls
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => spawnEntity('Rabbit', 'prey')} className="bg-green-900/50 hover:bg-green-700/80 border border-green-500/30 transition-all py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 cursor-pointer">
              <Leaf size={16} className="text-green-400" /> + Rabbit
            </button>
            <button onClick={() => spawnEntity('Wolf', 'predator')} className="bg-red-900/50 hover:bg-red-700/80 border border-red-500/30 transition-all py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 cursor-pointer">
              <Skull size={16} className="text-red-400" /> + Wolf
            </button>
          </div>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <button onClick={() => setWeather(weather === 'Clear' ? 'Rain' : 'Clear')} className={`w-full transition-all py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border cursor-pointer ${weather === 'Clear' ? 'bg-blue-900/30 hover:bg-blue-800/50 border-blue-500/30 text-blue-200' : 'bg-yellow-900/30 hover:bg-yellow-800/50 border-yellow-500/30 text-yellow-200'}`}>
            {weather === 'Clear' ? <CloudRain size={16} /> : <Sun size={16} />} 
            {weather === 'Clear' ? 'Trigger Storm' : 'Clear Skies'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 4. MAIN EXPORT (CLEAN SHELL)
// ==========================================
export default function EcoBalanceGame() {
  return (
    <div className="relative w-full h-screen bg-gray-950 text-white overflow-hidden font-sans select-none">
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [15, 20, 15], fov: 45 }}>
          <SimulationController />
          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.4} far={10} color="#000000" />
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={40} />
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