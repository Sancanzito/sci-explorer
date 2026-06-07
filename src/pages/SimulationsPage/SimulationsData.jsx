// data/SimulationsData.jsx
import React from 'react';
import { 
  GiPlantRoots, GiWaterDrop, GiHeatHaze, GiPoisonGas,
  GiMicroscope, GiDna1, GiPlanetCore, GiMolecule 
} from 'react-icons/gi';
import { FaGamepad, FaFlask } from 'react-icons/fa';
import { Atom, Telescope, Activity } from 'lucide-react';

export const CATEGORIES = [
  "All", "Biology", "Chemistry", "Physics", "Astronomy", "Earth Science"
];

export const simulationsData = [
  {
    id: 'molview',
    name: 'Molecular Workstation: 3D Chemical Lab',
    category: 'Chemistry',
    description: 'Draw, visualize, and analyze molecules in 3D! Search PubChem database, draw custom structures, and explore molecular properties.',
    longDescription: 'A professional-grade molecular visualization tool! Draw chemical structures using the JSME editor, search the PubChem database, and analyze molecular properties.',
    icon: <Atom className="w-12 h-12" />,
    color: 'from-cyan-600 to-blue-700',
    path: '/molview',
    features: ['Interactive drawing canvas', 'PubChem integration', 'Real-time analysis', '3D visualization']
  },
  {
    id: 'gel-electrophoresis',
    name: 'Forensic DNA Analysis: Gel Electrophoresis',
    category: 'Biology',
    description: 'Solve a forensic mystery using gel electrophoresis! Load DNA samples, run the gel, and match crime scene DNA.',
    longDescription: 'Step into a real forensics lab! Load DNA samples into an agarose gel, run electrophoresis, visualize with UV light, and analyze banding patterns.',
    icon: <GiDna1 className="w-12 h-12" />,
    color: 'from-purple-600 to-indigo-700',
    path: '/simulations/gel-electrophoresis',
    features: ['Micropipette simulation', 'Adjustable voltage', 'Real-time migration', 'UV visualization']
  },
  {
    id: 'eco-balance',
    name: 'Eco-Balance: The Trophic Navigator',
    category: 'Earth Science',
    description: 'An interactive ecosystem simulation where you manipulate environmental conditions and observe how species populations respond.',
    longDescription: 'Step into the role of an ecosystem manager! Control environmental variables, introduce interventions, and watch predator-prey relationships evolve.',
    icon: <FaGamepad className="w-12 h-12" />,
    color: 'from-green-600 to-emerald-700',
    path: '/games/eco-balance',
    features: ['Real-time dynamics', 'Food web visualization', 'Live charts', 'Ecosystem reports']
  },
  {
    id: 'cell-explorer',
    name: '3D Cell Explorer',
    category: 'Biology',
    description: 'Explore animal and plant cells in stunning 3D! Navigate through organelles, learn their functions, and discover facts.',
    longDescription: 'Step inside the microscopic world! Toggle between animal and plant cells, interact with organelles, and learn about their functions.',
    icon: <GiMicroscope className="w-12 h-12" />,
    color: 'from-pink-600 to-rose-700',
    path: '/simulations/cell-explorer',
    features: ['3D organelle exploration', 'Animal vs Plant cells', 'X-ray views', 'Real-time animations']
  },
  {
    id: 'solar-system',
    name: '3D Solar System Explorer',
    category: 'Astronomy',
    description: 'Explore our solar system in stunning 3D! Navigate through space, observe planetary orbits, and learn fascinating facts.',
    longDescription: 'Take a journey through our cosmic neighborhood! This immersive 3D simulation lets you explore all planets, control time speed, and discover detailed data.',
    icon: <GiPlanetCore className="w-12 h-12" />,
    color: 'from-slate-800 to-indigo-900',
    path: '/simulations/solar-system',
    features: ['Real-time 3D orbits', 'Interactive camera', 'Time control', 'Asteroid belt']
  },
  {
    id: 'tectonics',
    name: 'Tectonic Plates & Seismic Monitor',
    category: 'Earth Science',
    description: 'Interact with an accurate 3D Earth globe to explore tectonic plate boundaries, fault lines, and live earthquake hotspots.',
    longDescription: 'Powered by CesiumJS, this 3D simulation maps major historical and structural earthquakes. Learn the difference between divergent, convergent, and transform boundaries.',
    icon: <Activity className="w-12 h-12" />,
    color: 'from-slate-700 to-emerald-900',
    path: '/simulations/tectonic-explorer',
    features: ['CesiumJS 3D Earth', 'Seismic visualization', 'Boundary classifications', 'Magnitude scaling']
  },
  {
    id: 'energy-skate-park',
    name: 'Kinetic & Potential Energy',
    category: 'Physics',
    description: 'Design skate tracks and analyze the conservation of energy using real-time physics bar charts and graphs.',
    longDescription: 'Master the laws of thermodynamics and motion. Build custom tracks and observe how potential energy converts to kinetic and thermal energy.',
    icon: <GiHeatHaze className="w-12 h-12" />,
    color: 'from-amber-500 to-orange-700',
    path: '/simulations/energy-skate-park',
    features: ['Custom track builder', 'Live pie charts', 'Friction controls', 'Mass manipulation']
  },{
    id: 'dna-extraction',
    name: 'Virtual DNA Extraction Lab',
    category: 'Biology',
    description: 'Extract DNA from a strawberry using virtual lab equipment – learn each step of the process.',
    longDescription: 'Follow a real DNA extraction protocol: mash, filter, precipitate, and spool DNA. Perfect for introductory genetics.',
    icon: <GiDna1 className="w-12 h-12" />,
    color: 'from-blue-600 to-cyan-700',
    path: '/simulations/dna-extraction',
    features: ['Step‑by‑step guidance', 'Virtual pipetting', 'Microcentrifuge simulation', 'Real‑time feedback']
  },
  {
    id: 'microbe-rpg',
    name: 'Microbe RPG: Immune System Defender',
    category: 'Biology',
    description: 'Play as a white blood cell and fight off pathogens in this educational role‑playing game.',
    longDescription: 'Learn about innate and adaptive immunity while battling bacteria and viruses. Upgrade your defenses and unlock antibody powers.',
    icon: <GiMicroscope className="w-12 h-12" />,
    color: 'from-red-600 to-pink-700',
    path: '/simulations/microbe-rpg',
    features: ['Turn‑based combat', 'Immune system facts', 'Upgradeable skills', 'Boss battles']
  },
  {
    id: 'stellarium',
    name: 'Stellarium: Live Sky Map',
    category: 'Astronomy',
    description: 'Explore an interactive 3D star map – identify constellations, planets, and deep‑sky objects.',
    longDescription: 'Web‑based version of the famous planetarium. Change observation location, time, and see the night sky from anywhere on Earth.',
    icon: <Telescope className="w-12 h-12" />,
    color: 'from-indigo-700 to-purple-900',
    path: '/simulations/stellarium',
    features: ['Real‑time sky simulation', '10,000+ stars', 'Constellation lines', 'Search planets']
  },
  {
    id: 'natural-selection',
    name: 'Natural Selection Simulator',
    category: 'Biology',
    description: 'Control environmental pressures and watch a population evolve over generations.',
    longDescription: 'Adjust traits like fur color, speed, or camouflage. See how mutation, selection, and genetic drift affect allele frequencies.',
    icon: <GiDna1 className="w-12 h-12" />,
    color: 'from-green-600 to-teal-700',
    path: '/simulations/natural-selection',
    features: ['Heritability sliders', 'Population graphs', 'Predator pressure', 'Generation counter']
  },
  {
    id: 'gravity-orbits',
    name: 'Gravity & Orbits',
    category: 'Physics',
    description: 'Discover how gravity shapes planetary orbits – change masses, distances, and watch the motion.',
    longDescription: 'Newtonian gravity simulation. Toggle between Sun‑Earth, Earth‑Moon, or create your own two‑body system.',
    icon: <GiPlanetCore className="w-12 h-12" />,
    color: 'from-yellow-600 to-orange-700',
    path: '/simulations/gravity-orbits',
    features: ['Velocity vectors', 'Gravity force arrows', 'Orbit trails', 'Mass sliders']
  },
  {
    id: 'microscope-game',
    name: 'Microscope Detective',
    category: 'Biology',
    description: 'Identify mystery specimens under a virtual microscope – test your microscopy skills.',
    longDescription: 'Adjust focus, zoom, and light to reveal clues. Perfect for learning cell types and micro‑organisms.',
    icon: <GiMicroscope className="w-12 h-12" />,
    color: 'from-amber-600 to-yellow-700',
    path: '/microscope-game',
    features: ['Virtual focus knob', 'Sample library', 'Multiple choice quiz', 'Score tracking']
  }
];