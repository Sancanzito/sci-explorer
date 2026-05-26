import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Trail, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, FastForward, Rewind, Info, 
  Search, Crosshair, ChevronRight, Orbit, Database, 
  Thermometer, Wind, Target, Activity, Globe, X
} from 'lucide-react';

const DISTANCE_SCALE = 15;
const SIZE_SCALE = 1;

const SYSTEM_DATA = {
  Sun: {
    name: "Sun",
    category: "Star",
    type: "Yellow Dwarf Star",
    color: "#ffcc00",
    emissive: "#ff8800",
    radius: 4.5 * SIZE_SCALE,
    distance: 0,
    speed: 0,
    image: "https://images.unsplash.com/photo-1542662565-7e4b66fae910?q=80&w=1000&auto=format&fit=crop",
    description: "The heart of our solar system. A nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process.",
    stats: {
      gravity: "274 m/s²",
      temp: "5,500 °C (Surface)",
      composition: "73% Hydrogen, 25% Helium",
      mass: "1.989 × 10^30 kg"
    },
    funFact: "One million Earths could fit inside the Sun."
  },
  Mercury: {
    name: "Mercury",
    category: "Planet",
    type: "Terrestrial Planet",
    color: "#a8a8a8",
    radius: 0.38 * SIZE_SCALE,
    distance: 0.39 * DISTANCE_SCALE + 6,
    speed: 4.15,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
    description: "The smallest planet in our solar system and closest to the Sun. It has a solid, cratered surface, much like the Earth's moon.",
    stats: {
      gravity: "3.7 m/s²",
      temp: "-173 to 427 °C",
      composition: "Oxygen, Sodium, Hydrogen",
      mass: "3.285 × 10^23 kg"
    },
    funFact: "A day on Mercury (one rotation) takes 59 Earth days."
  },
  Venus: {
    name: "Venus",
    category: "Planet",
    type: "Terrestrial Planet",
    color: "#e0a65c",
    radius: 0.95 * SIZE_SCALE,
    distance: 0.72 * DISTANCE_SCALE + 7,
    speed: 1.62,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    description: "Earth's planetary twin in size, but with a toxic, super-heated atmosphere trapped by runaway greenhouse effects.",
    stats: {
      gravity: "8.87 m/s²",
      temp: "462 °C",
      composition: "96% Carbon Dioxide, 3% Nitrogen",
      mass: "4.867 × 10^24 kg"
    },
    funFact: "Venus spins backward compared to most other planets."
  },
  Earth: {
    name: "Earth",
    category: "Planet",
    type: "Terrestrial Planet",
    color: "#2b82c9",
    emissive: "#114466",
    radius: 1 * SIZE_SCALE,
    distance: 1 * DISTANCE_SCALE + 8,
    speed: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
    description: "Our home planet. It is the only known planet to harbor life, characterized by its abundant liquid water and dynamic atmosphere.",
    stats: {
      gravity: "9.807 m/s²",
      temp: "-88 to 58 °C",
      composition: "78% Nitrogen, 21% Oxygen",
      mass: "5.972 × 10^24 kg"
    },
    funFact: "Earth's core is as hot as the surface of the sun."
  },
  Mars: {
    name: "Mars",
    category: "Planet",
    type: "Terrestrial Planet",
    color: "#c1440e",
    radius: 0.53 * SIZE_SCALE,
    distance: 1.52 * DISTANCE_SCALE + 9,
    speed: 0.53,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    description: "The Red Planet. A dusty, cold, desert world with a very thin atmosphere. It is a dynamic planet with seasons, polar ice caps, and weather.",
    stats: {
      gravity: "3.721 m/s²",
      temp: "-153 to 20 °C",
      composition: "95% Carbon Dioxide, 3% Nitrogen",
      mass: "6.39 × 10^23 kg"
    },
    funFact: "Home to Olympus Mons, the tallest volcano in the solar system."
  },
  Jupiter: {
    name: "Jupiter",
    category: "Planet",
    type: "Gas Giant",
    color: "#c99a77",
    radius: 3 * SIZE_SCALE,
    distance: 5.2 * DISTANCE_SCALE + 12,
    speed: 0.08,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    description: "The largest planet in our solar system. A gas giant known for its Great Red Spot, a storm that has been raging for hundreds of years.",
    stats: {
      gravity: "24.79 m/s²",
      temp: "-110 °C",
      composition: "90% Hydrogen, 10% Helium",
      mass: "1.898 × 10^27 kg"
    },
    funFact: "Jupiter has 95 officially recognized moons."
  },
  Saturn: {
    name: "Saturn",
    category: "Planet",
    type: "Gas Giant",
    color: "#eaddb6",
    radius: 2.5 * SIZE_SCALE,
    distance: 9.5 * DISTANCE_SCALE + 15,
    speed: 0.03,
    hasRings: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
    description: "The jewel of the solar system, famous for its extensive and complex ring system made of ice and rock.",
    stats: {
      gravity: "10.44 m/s²",
      temp: "-140 °C",
      composition: "96% Hydrogen, 3% Helium",
      mass: "5.683 × 10^26 kg"
    },
    funFact: "Saturn is the only planet less dense than water. It would float in a giant bathtub!"
  },
  Uranus: {
    name: "Uranus",
    category: "Planet",
    type: "Ice Giant",
    color: "#c6d3e3",
    radius: 1.5 * SIZE_SCALE,
    distance: 19.2 * DISTANCE_SCALE + 18,
    speed: 0.011,
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
    description: "An ice giant that rotates on its side. It has a blue-green color due to methane in its atmosphere.",
    stats: {
      gravity: "8.69 m/s²",
      temp: "-195 °C",
      composition: "83% Hydrogen, 15% Helium, 2% Methane",
      mass: "8.681 × 10^25 kg"
    },
    funFact: "Uranus rolls on its side, likely due to a massive collision in its past."
  },
  Neptune: {
    name: "Neptune",
    category: "Planet",
    type: "Ice Giant",
    color: "#3f54ba",
    radius: 1.4 * SIZE_SCALE,
    distance: 30.1 * DISTANCE_SCALE + 15,
    speed: 0.006,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829777372016%29.jpg",
    description: "Dark, cold, and whipped by supersonic winds. Ice giant Neptune is the eighth and most distant planet in our solar system.",
    stats: {
      gravity: "11.15 m/s²",
      temp: "-200 °C",
      composition: "80% Hydrogen, 19% Helium, 1% Methane",
      mass: "1.024 × 10^26 kg"
    },
    funFact: "Winds on Neptune can reach up to 1,200 miles per hour."
  },
  Pluto: {
    name: "Pluto",
    category: "Dwarf Planet",
    type: "Dwarf Planet",
    color: "#e2e2e2",
    radius: 0.3 * SIZE_SCALE,
    distance: 39.5 * DISTANCE_SCALE + 18,
    speed: 0.004,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg",
    description: "Once considered the ninth planet, Pluto is now the most famous dwarf planet residing in the Kuiper Belt.",
    stats: {
      gravity: "0.62 m/s²",
      temp: "-225 °C",
      composition: "Nitrogen, Methane, Carbon Monoxide",
      mass: "1.309 × 10^22 kg"
    },
    funFact: "Pluto has a giant glacier shaped like a heart that is the size of Texas and Oklahoma combined."
  },
  Halley: {
    name: "Halley's Comet",
    category: "Comet",
    type: "Periodic Comet",
    color: "#aae8ff",
    emissive: "#ffffff",
    radius: 0.15 * SIZE_SCALE,
    distance: 25 * DISTANCE_SCALE + 10,
    speed: 1.2,
    isComet: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Lspn_comet_halley.jpg",
    description: "A short-period comet visible from Earth every 75–76 years. It's the only known short-period comet regularly visible to the naked eye.",
    stats: {
      gravity: "0.0001 m/s²",
      temp: "-250 to 50 °C",
      composition: "Water, Carbon Monoxide, Methane",
      mass: "2.2 × 10^14 kg"
    },
    funFact: "Mark Twain was born during its appearance in 1835 and died during its next appearance in 1910."
  },
  Kepler186f: {
    name: "Kepler-186f",
    category: "Exoplanet",
    type: "Rocky Exoplanet",
    color: "#8a5a44",
    radius: 1.1 * SIZE_SCALE,
    distance: 60 * DISTANCE_SCALE, // Very far out
    speed: 0.002,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kepler186f_ArtistConcept_high_res.jpg/1024px-Kepler186f_ArtistConcept_high_res.jpg",
    description: "The first Earth-sized planet discovered in the habitable zone of another star, located 582 light-years from Earth.",
    stats: {
      gravity: "~10.5 m/s²",
      temp: "-85 °C",
      composition: "Unknown (Likely Rocky)",
      mass: "~8.5 × 10^24 kg"
    },
    funFact: "If plant life exists on Kepler-186f, its photosynthesis might be driven by red-wavelength photons, making its leaves red!"
  }
};

const PLANET_KEYS = Object.keys(SYSTEM_DATA).filter(k => k !== 'Sun');

// ==========================================
// 2. STATE MANAGEMENT 
// ==========================================

// Global state context to avoid deep prop drilling in the single file
const AppContext = React.createContext(null);

function useAppStore() {
  const [selectedBody, setSelectedBody] = useState(null);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [scienceMode, setScienceMode] = useState(false);
  
  // Shared time reference for sync across all bodies
  const timeRef = useRef(0);
  
  return {
    selectedBody, setSelectedBody,
    timeMultiplier, setTimeMultiplier,
    isPlaying, setIsPlaying,
    showLabels, setShowLabels,
    showOrbits, setShowOrbits,
    scienceMode, setScienceMode,
    timeRef
  };
}

// ==========================================
// 3. THREE.JS COMPONENTS
// ==========================================

const CameraController = ({ selectedBody }) => {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    
    if (selectedBody && selectedBody !== 'Sun') {
      // We handle focus smoothly in useFrame within the Planet component
    } else if (selectedBody === 'Sun' || !selectedBody) {
      // Reset view
      const targetPos = new THREE.Vector3(0, 0, 0);
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(0, 100, 150); // Top down angle, backed up slightly
      
      let t = 0;
      const animateCamera = () => {
        t += 0.02;
        if (t <= 1) {
          camera.position.lerpVectors(startPos, endPos, t);
          controlsRef.current.target.lerp(targetPos, t);
          controlsRef.current.update();
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  }, [selectedBody, camera]);

  return (
    <OrbitControls 
      ref={controlsRef} 
      makeDefault
      enablePan={true}
      enableZoom={true}
      maxDistance={2000} // Increased so Kepler and Pluto can be reached easily
      minDistance={3}
    />
  );
};

// Reusable Belt component for Asteroids and Kuiper belt objects
const ParticleBelt = ({ innerRadius, outerRadius, count, color, sizeMultiplier = 1 }) => {
  const meshRef = useRef();
  const { isPlaying, timeMultiplier } = React.useContext(AppContext);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill().map(() => {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const theta = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * (outerRadius - innerRadius) * 0.1; // proportional thickness
      const speed = (0.5 + Math.random() * 0.5) * 0.2;
      
      return { radius, theta, y, speed, scale: (Math.random() * 0.15 + 0.05) * sizeMultiplier };
    });
  }, [innerRadius, outerRadius, count, sizeMultiplier]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const dt = isPlaying ? delta * timeMultiplier * 0.1 : 0;
    
    particles.forEach((particle, i) => {
      particle.theta += dt * particle.speed * (1 / particle.radius);
      
      const x = Math.cos(particle.theta) * particle.radius;
      const z = Math.sin(particle.theta) * particle.radius;
      
      dummy.position.set(x, particle.y, z);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </instancedMesh>
  );
};

const OrbitPath = ({ distance, color, isComet }) => {
  const points = useMemo(() => {
    const pts = [];
    // Comets get an elliptical visual representation
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      const x = Math.cos(angle) * distance;
      // Elongate z slightly for comets to make orbit look elliptical
      const z = Math.sin(angle) * distance * (isComet ? 1.5 : 1);
      
      // Shift comets off center
      const xOffset = isComet ? distance * 0.4 : 0;
      pts.push(new THREE.Vector3(x - xOffset, 0, z));
    }
    return pts;
  }, [distance, isComet]);

  return (
    <Line points={points} color={color} opacity={0.15} transparent lineWidth={1} />
  );
};

const Planet = ({ planetId }) => {
  const { 
    timeRef, isPlaying, timeMultiplier, 
    selectedBody, setSelectedBody, showLabels, showOrbits 
  } = React.useContext(AppContext);
  
  const planetRef = useRef();
  const groupRef = useRef();
  const data = SYSTEM_DATA[planetId];
  const isSelected = selectedBody === planetId;
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (isPlaying) {
      // Different movement for comets vs regular orbits
      if (data.isComet) {
        // Simple mock elliptical movement
        const time = state.clock.getElapsedTime() * timeMultiplier * data.speed * 0.05;
        const x = Math.cos(time) * data.distance - (data.distance * 0.4);
        const z = Math.sin(time) * data.distance * 1.5;
        groupRef.current.position.set(x, 0, z);
      } else {
        // Standard circular orbit
        groupRef.current.rotation.y += delta * timeMultiplier * data.speed * 0.1;
      }
    }
    
    // Self rotation (visual only)
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.5;
    }

    // Camera Following Logic
    if (isSelected && planetRef.current) {
      const planetPos = new THREE.Vector3();
      planetRef.current.getWorldPosition(planetPos);
      
      const offset = planetPos.clone().normalize().multiplyScalar(data.radius * 6 + 5); // Added base offset so small objects don't zoom in too close
      offset.y += data.radius * 2 + 2;
      
      const targetCamPos = planetPos.clone().add(offset);
      
      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(planetPos);
    }
  });

  const PlanetMesh = (
    <mesh 
      ref={planetRef} 
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBody(planetId);
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshStandardMaterial 
        color={data.color} 
        emissive={data.emissive || '#000000'}
        emissiveIntensity={data.isComet ? 0.8 : 0.2}
        roughness={0.6}
        metalness={0.1}
      />
      
      {data.hasRings && (
        <mesh rotation={[Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
          <meshStandardMaterial color="#c2b28f" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </mesh>
  );

  return (
    <group ref={groupRef}>
      {!data.isComet && showOrbits && <OrbitPath distance={data.distance} color={data.color} />}
      {data.isComet && showOrbits && <OrbitPath distance={data.distance} color={data.color} isComet={true} />}
      
      <group position={data.isComet ? [0,0,0] : [data.distance, 0, 0]}>
        
        {/* Render planet/comet core. If comet, wrap with glowing Trail */}
        {data.isComet ? (
          <Trail width={data.radius * 6} length={40} color={new THREE.Color(data.color)} attenuation={(t) => t * t}>
            {PlanetMesh}
          </Trail>
        ) : (
          PlanetMesh
        )}

        {/* Highlight Aura when selected */}
        {isSelected && (
          <mesh>
            <sphereGeometry args={[data.radius * 1.4 + 0.5, 32, 32]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.15} wireframe />
          </mesh>
        )}

        {/* HTML Label */}
        {showLabels && (
          <Html distanceFactor={40} position={[0, data.radius + 1.5, 0]} center zIndexRange={[100, 0]}>
            <div className={`
              px-2 py-1 rounded border backdrop-blur-sm text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap
              ${isSelected 
                ? 'bg-white/20 border-white text-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                : 'bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50 cursor-pointer'}
            `}
            onClick={(e) => { e.stopPropagation(); setSelectedBody(planetId); }}
            >
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

const Sun = () => {
  const { setSelectedBody, selectedBody, showLabels } = React.useContext(AppContext);
  const data = SYSTEM_DATA.Sun;
  const sunRef = useRef();
  const isSelected = selectedBody === 'Sun';

  useFrame(({ clock }) => {
    sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <mesh 
      ref={sunRef}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBody('Sun');
      }}
    >
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshBasicMaterial color={data.color} />
      {/* Sun Glow */}
      <pointLight intensity={1000} distance={1000} color={data.color} decay={2} />
      
      {showLabels && (
        <Html distanceFactor={40} position={[0, data.radius + 2, 0]} center>
          <div className={`
            px-3 py-1 rounded-full border backdrop-blur-md text-sm font-bold tracking-widest uppercase
            ${isSelected ? 'bg-yellow-500/30 border-yellow-400 text-yellow-100' : 'bg-black/50 border-yellow-500/30 text-yellow-500/80'}
          `}>
            {data.name}
          </div>
        </Html>
      )}
    </mesh>
  );
};

// ==========================================
// 4. USER INTERFACE COMPONENTS
// ==========================================

const TopHUD = () => {
  const { showLabels, setShowLabels, showOrbits, setShowOrbits, scienceMode, setScienceMode } = React.useContext(AppContext);
  
  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-sans tracking-tight">
          Solar Observatory
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mt-1 flex items-center gap-2">
          <Globe size={14} /> Interactive Star System
        </p>
      </div>

      <div className="flex gap-3 pointer-events-auto">
        <button 
          onClick={() => setShowLabels(!showLabels)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-md border ${showLabels ? 'bg-white/10 border-white/30 text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}
        >
          Labels
        </button>
        <button 
          onClick={() => setShowOrbits(!showOrbits)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-md border ${showOrbits ? 'bg-white/10 border-white/30 text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}
        >
          Orbits
        </button>
        <button 
          onClick={() => setScienceMode(!scienceMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-md border ${scienceMode ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-black/20 border-white/10 text-gray-300'}`}
        >
          <Database size={16} /> Data Mode
        </button>
      </div>
    </div>
  );
};

const LeftNavigation = () => {
  const { selectedBody, setSelectedBody } = React.useContext(AppContext);

  // Group planets by category
  const groupedCategories = useMemo(() => {
    const groups = { Planet: [], 'Dwarf Planet': [], Comet: [], Exoplanet: [] };
    PLANET_KEYS.forEach(key => {
      const cat = SYSTEM_DATA[key].category;
      if (groups[cat]) groups[cat].push(key);
    });
    return groups;
  }, []);

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-64 pointer-events-none">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 pointer-events-auto flex flex-col gap-2 shadow-2xl">
        <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase mb-2 px-2">
          <Target size={14} /> Celestial Bodies
        </div>
        
        {/* The Sun always gets top priority */}
        <button
          onClick={() => setSelectedBody('Sun')}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${selectedBody === 'Sun' ? 'bg-yellow-500/20 border border-yellow-500/50' : 'hover:bg-white/5 border border-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#ffcc00] shadow-[0_0_10px_#ffcc00]"></div>
            <span className={`font-semibold ${selectedBody === 'Sun' ? 'text-yellow-200' : 'text-gray-300'}`}>Sun</span>
          </div>
        </button>

        <div className="h-px bg-white/10 my-1"></div>

        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(groupedCategories).map(([category, keys]) => (
            <div key={category} className="mb-4">
              {keys.length > 0 && (
                <div className="text-[10px] text-white/40 uppercase tracking-widest px-2 mb-1.5 mt-2">
                  {category}s
                </div>
              )}
              {keys.map((key) => {
                const planet = SYSTEM_DATA[key];
                const isSelected = selectedBody === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedBody(key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-1 ${isSelected ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planet.color, boxShadow: isSelected ? `0 0 10px ${planet.color}` : 'none' }}></div>
                      <span className={`text-sm ${isSelected ? 'text-white font-bold' : 'text-gray-400 font-medium'}`}>{planet.name}</span>
                    </div>
                    {isSelected && <ChevronRight size={14} className="text-blue-400" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RightInfoPanel = () => {
  const { selectedBody, setSelectedBody, scienceMode } = React.useContext(AppContext);

  return (
    <AnimatePresence>
      {selectedBody && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-6 top-24 bottom-24 w-80 z-20 pointer-events-none"
        >
          <div className="bg-[#050714]/80 backdrop-blur-2xl border border-white/10 rounded-2xl h-full flex flex-col overflow-hidden pointer-events-auto shadow-2xl">
            
            {/* Header with Dynamic Image */}
            <div className="relative h-48 border-b border-white/10 overflow-hidden shrink-0">
              {SYSTEM_DATA[selectedBody].image && (
                <img 
                  src={SYSTEM_DATA[selectedBody].image} 
                  alt={SYSTEM_DATA[selectedBody].name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-[#050714]/60 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedBody(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/40 backdrop-blur-sm p-1.5 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6 z-10">
                <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-1 drop-shadow-md">
                  {SYSTEM_DATA[selectedBody].type}
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                  {SYSTEM_DATA[selectedBody].name}
                </h2>
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {SYSTEM_DATA[selectedBody].description}
              </p>

              {/* Data Cards (Shows extra details if Science Mode is ON) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Orbit size={16} /> <span className="text-xs uppercase tracking-wider">Gravity</span>
                  </div>
                  <span className="text-white font-mono text-sm text-right max-w-[120px]">{SYSTEM_DATA[selectedBody].stats.gravity}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Thermometer size={16} /> <span className="text-xs uppercase tracking-wider">Temp</span>
                  </div>
                  <span className="text-white font-mono text-sm text-right max-w-[120px]">{SYSTEM_DATA[selectedBody].stats.temp}</span>
                </div>

                {scienceMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-2 border-t border-white/10"
                  >
                     <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-3 text-blue-300">
                        <Activity size={16} /> <span className="text-xs uppercase tracking-wider">Mass</span>
                      </div>
                      <span className="text-blue-100 font-mono text-sm text-right max-w-[120px]">{SYSTEM_DATA[selectedBody].stats.mass}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Wind size={16} /> <span className="text-xs uppercase tracking-wider">Atmosphere</span>
                      </div>
                      <span className="text-white text-sm">{SYSTEM_DATA[selectedBody].stats.composition}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Fun Fact */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Did you know?</span>
                </div>
                <p className="text-purple-100 text-sm italic">
                  "{SYSTEM_DATA[selectedBody].funFact}"
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BottomControlBar = () => {
  const { isPlaying, setIsPlaying, timeMultiplier, setTimeMultiplier, selectedBody, setSelectedBody } = React.useContext(AppContext);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-2xl px-6">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 pointer-events-auto shadow-2xl flex items-center justify-between">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="h-8 w-px bg-white/20"></div>
          
          <div className="flex gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
            {[0.5, 1, 5, 20].map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeMultiplier(speed)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${timeMultiplier === speed ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Current Target Focus Reset */}
        {selectedBody && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
             <span className="text-xs text-gray-400 uppercase tracking-widest">Target:</span>
             <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2">
               <Crosshair size={14} className="text-blue-400" />
               {SYSTEM_DATA[selectedBody].name}
             </span>
             <button 
                onClick={() => setSelectedBody(null)}
                className="text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
              >
                Reset View
              </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN APPLICATION COMPONENT
// ==========================================

export default function SolarSystemObservatory() {
  const store = useAppStore();

  return (
    <AppContext.Provider value={store}>
      <div className="relative w-full h-screen bg-[#020308] overflow-hidden font-sans select-none">
        
        {/* CSS for custom scrollbar hidden in regular tailwind */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        `}} />

        {/* 3D Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 80, 120], fov: 45, far: 5000 }}>
            <color attach="background" args={['#050714']} />
            
            {/* Lighting */}
            <ambientLight intensity={0.1} />
            
            {/* Deep Space Background */}
            <Stars radius={1000} depth={100} count={9000} factor={4} saturation={0} fade speed={1} />
            
            <Suspense fallback={null}>
              <Sun />
              {PLANET_KEYS.map((key) => (
                <Planet key={key} planetId={key} />
              ))}
              
              {/* Main Asteroid Belt */}
              <ParticleBelt 
                innerRadius={1.52 * DISTANCE_SCALE + 12} 
                outerRadius={5.2 * DISTANCE_SCALE + 6} 
                count={2500} 
                color="#666666" 
              />
              
              {/* Distant Kuiper Belt (Past Neptune) */}
              <ParticleBelt 
                innerRadius={30.1 * DISTANCE_SCALE + 10} 
                outerRadius={45 * DISTANCE_SCALE + 20} 
                count={4000} 
                color="#8899aa"
                sizeMultiplier={1.5}
              />
            </Suspense>

            <CameraController selectedBody={store.selectedBody} />
          </Canvas>
        </div>

        {/* UI Overlay Layer */}
        <TopHUD />
        <LeftNavigation />
        <RightInfoPanel />
        <BottomControlBar />
        
        {/* Vignette Overlay for cinematic look */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-10 mix-blend-multiply"></div>
      </div>
    </AppContext.Provider>
  );
}