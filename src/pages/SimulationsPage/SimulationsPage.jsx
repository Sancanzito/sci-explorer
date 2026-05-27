// pages/SimulationsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GiPlantRoots, 
  GiWaterDrop, 
  GiHeatHaze, 
  GiPoisonGas,
  GiMicroscope,
  GiDna1,
  GiPlanetCore
} from 'react-icons/gi';
import { FaGamepad, FaArrowRight } from 'react-icons/fa';

const SimulationsPage = () => {
  const simulations = [
    {
      id: 'eco-balance',
      name: 'Eco-Balance: The Trophic Navigator',
      description: 'An interactive ecosystem simulation where you manipulate environmental conditions and observe how species populations respond. Learn about trophic levels, energy transfer, and ecological balance.',
      longDescription: 'Step into the role of an ecosystem manager! Control environmental variables, introduce interventions, and watch as predator-prey relationships evolve in real-time. Master the delicate balance of nature through scientific gameplay.',
      icon: <GiPlantRoots className="w-12 h-12" />,
      color: 'from-green-600 to-emerald-700',
      path: '/games/eco-balance',
      features: [
        'Real-time population dynamics using ecological models',
        'Interactive food web visualization',
        'Environmental intervention system',
        'Live population charts and analytics',
        'Educational feedback and ecosystem reports'
      ]
    },
    {
      id: 'cell-explorer',
      name: '3D Cell Explorer',
      description: 'Explore animal and plant cells in stunning 3D! Navigate through organelles, learn their functions, and discover fascinating facts about cellular biology.',
      longDescription: 'Step inside the microscopic world! Toggle between animal and plant cells, interact with organelles, and learn about their functions in this immersive 3D simulation.',
      icon: <GiMicroscope className="w-12 h-12" />,
      color: 'from-purple-600 to-pink-700',
      path: '/simulations/cell-explorer',
      features: [
        'Interactive 3D organelle exploration',
        'Toggle between animal and plant cells',
        'X-ray and exploded view modes',
        'Educational organelle information',
        'Real-time cellular animations'
      ]
    },
    {
      id: 'dna-extraction',
      name: 'DNA Extraction Lab',
      description: 'Extract DNA from a strawberry in this interactive virtual lab. Learn the steps of DNA extraction: cell disruption, lysis, filtration, and precipitation.',
      longDescription: 'Become a molecular biologist! Perform mechanical disruption, chemical lysis, filtration, and alcohol precipitation to extract and visualize strawberry DNA. Learn the science behind each step with real-time feedback.',
      icon: <GiDna1 className="w-12 h-12" />,
      color: 'from-blue-600 to-purple-700',
      path: '/simulations/dna-extraction',
      features: [
        'Interactive lab equipment simulation',
        'Step-by-step guided protocol',
        'Real-time purity scoring system',
        'Scientific explanations for each step',
        'Visual DNA precipitation effect'
      ]
    },
    {
      id: 'solar-system',
      name: '3D Solar System Explorer',
      description: 'Explore our solar system in stunning 3D! Navigate through space, observe planetary orbits, and learn fascinating facts about each celestial body.',
      longDescription: 'Take a journey through our cosmic neighborhood! This immersive 3D simulation lets you explore all planets, control time speed, and discover detailed scientific data about each planet. Perfect for astronomy enthusiasts and space lovers.',
      icon: <GiPlanetCore className="w-12 h-12" />,
      color: 'from-purple-600 to-pink-700',
      path: '/simulations/solar-system',
      features: [
        'Real-time 3D planetary orbits',
        'Interactive camera controls',
        'Scientific data for each planet',
        'Time control (0.5x - 20x speed)',
        'Asteroid belt visualization',
        'Saturn ring rendering'
      ]
    },
    {
      id: 'dna-lab',
      name: 'DNA Structure Lab',
      description: 'Explore the double helix structure of DNA and learn about genetics.',
      icon: <GiMicroscope className="w-12 h-12" />,
      color: 'from-blue-600 to-cyan-700',
      path: '#',
      features: ['3D DNA visualization', 'Base pair matching', 'Genetic code explorer'],
      comingSoon: true
    },
    {
      id: 'physics-lab',
      name: 'Physics Motion Lab',
      description: 'Experiment with forces, motion, and energy conservation.',
      icon: <GiHeatHaze className="w-12 h-12" />,
      color: 'from-purple-600 to-indigo-700',
      path: '#',
      features: ['Projectile motion', 'Force vectors', 'Energy tracking'],
      comingSoon: true
    },
    {
      id: 'chem-reactions',
      name: 'Chemical Reactions Lab',
      description: 'Mix virtual compounds and observe chemical reactions.',
      icon: <GiPoisonGas className="w-12 h-12" />,
      color: 'from-orange-600 to-red-700',
      path: '#',
      features: ['Reaction balancing', 'pH simulation', 'Heat measurement'],
      comingSoon: true
    }
  ];

  // Featured simulations - now showing 3 featured simulations (first 3)
  const featuredSimulations = simulations.slice(0, 3);
  const allSimulations = simulations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
              Virtual Laboratories
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto">
              Interactive simulations that bring science to life through hands-on exploration and discovery
            </p>
          </motion.div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12 text-gray-100 dark:text-dark-bg">
            <path fill="currentColor" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"/>
          </svg>
        </div>
      </div>

      {/* Featured Simulations Banner - Show three featured simulations */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Eco-Balance Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-2xl overflow-hidden h-full">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                  <FaGamepad className="w-4 h-4" />
                  <span className="text-sm font-semibold">Featured Simulation</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  Eco-Balance: Trophic Navigator
                </h2>
                <p className="text-green-100 text-sm mb-4 line-clamp-3">
                  Experience ecosystem balance in this immersive simulation. Manipulate environmental conditions and observe species populations.
                </p>
                <Link to="/games/eco-balance">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-green-700 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    Play Now
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 3D Cell Explorer Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl shadow-2xl overflow-hidden h-full">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                  <GiMicroscope className="w-4 h-4" />
                  <span className="text-sm font-semibold">3D Biology Lab</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  3D Cell Explorer
                </h2>
                <p className="text-purple-100 text-sm mb-4 line-clamp-3">
                  Explore animal and plant cells in stunning 3D! Interact with organelles and learn about cellular biology.
                </p>
                <Link to="/simulations/cell-explorer">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-700 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    Explore Cells
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* DNA Extraction Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden h-full">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                  <GiDna1 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Molecular Biology Lab</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  DNA Extraction Lab
                </h2>
                <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                  Extract real DNA from a strawberry! Learn cell disruption, chemical lysis, filtration, and precipitation techniques.
                </p>
                <Link to="/simulations/dna-extraction">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-700 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    Launch Lab
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* All Simulations Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore All Simulations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose from our growing collection of interactive science labs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allSimulations.map((sim, index) => (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className={`bg-white dark:bg-dark-surface rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${sim.comingSoon ? 'opacity-75' : ''}`}>
                <div className={`bg-gradient-to-r ${sim.color} p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    {sim.icon}
                    {sim.comingSoon && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mt-4">{sim.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {sim.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {sim.features.slice(0, 3).map(feature => (
                      <span key={feature} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    ))}
                  </div>
                  {sim.comingSoon ? (
                    <button disabled className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed">
                      Coming Soon
                    </button>
                  ) : (
                    <Link to={sim.path}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        Launch Simulation
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Educational Resources Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Use Our Simulations?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
              Our interactive labs are designed to make complex scientific concepts accessible and engaging
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Hands-on Learning',
                description: 'Manipulate variables in real-time and observe immediate outcomes',
                icon: '🔬'
              },
              {
                title: 'Visual Feedback',
                description: 'Dynamic visualizations help understand abstract concepts',
                icon: '📊'
              },
              {
                title: 'Self-Paced',
                description: 'Learn at your own speed with unlimited experimentation',
                icon: '⏱️'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-surface rounded-xl p-6 text-center shadow-md"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationsPage;