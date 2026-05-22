// components/ChemistryModels/ModelAnimation.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//images
import sphere from "../../assets/UseofChemModels/sphere.jpg"
import plum from "../../assets/UseofChemModels/plum.jpg"
import nuclear from "../../assets/UseofChemModels/nuclear.png"
import planetary from "../../assets/UseofChemModels/planetary.png"

// Particle Animation Component
export const ParticleAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-blue-500 rounded-full opacity-20 absolute" />
            <div className="w-12 h-12 bg-blue-500 rounded-full opacity-40 absolute m-4" />
            <div className="w-6 h-6 bg-blue-500 rounded-full absolute m-9" />
          </motion.div>
          <p className="mt-24 text-sm text-gray-600 dark:text-gray-300">Gas Particles in Motion</p>
        </div>
      </div>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-500 rounded-full opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Bond Formation Animation
export const BondFormation = () => {
  const [isBonded, setIsBonded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBonded(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center">
      <div className="flex items-center justify-center gap-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
            H
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            width: isBonded ? 80 : 40,
            opacity: isBonded ? 1 : 0.3,
          }}
          transition={{ duration: 0.5 }}
          className="h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"
        />
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            O
          </div>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 text-sm text-gray-600 dark:text-gray-300"
      >
        {isBonded ? "💧 Water Molecule Formed!" : "⚡ Forming Chemical Bond..."}
      </motion.p>
    </div>
  );
};

// Diffusion Animation
export const DiffusionAnimation = () => {
  const [molecules, setMolecules] = useState([]);

  useEffect(() => {
    const mols = [];
    for (let i = 0; i < 20; i++) {
      mols.push({
        id: i,
        x: 20 + Math.random() * 20,
        y: 30 + Math.random() * 40,
      });
    }
    setMolecules(mols);
  }, []);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex">
        <div className="w-1/2 border-r-2 border-dashed border-gray-400 flex items-center justify-center">
          <span className="text-sm font-medium">High Concentration</span>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <span className="text-sm font-medium">Low Concentration</span>
        </div>
      </div>
      {molecules.map((mol) => (
        <motion.div
          key={mol.id}
          className="absolute w-3 h-3 bg-purple-500 rounded-full"
          style={{ left: `${mol.x}%`, top: `${mol.y}%` }}
          animate={{
            x: [0, 30, 60],
            opacity: [1, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: mol.id * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-300">
        Diffusion: Spreading of particles from high to low concentration
      </div>
    </div>
  );
};

// Atomic Evolution Component (Updated with Buttons and Manual Reset Timer)
export const AtomicEvolution = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const models = [
    {
      name: "Democritus & Dalton",
      year: "400 BCE / 1803",
      tagline: "Solid Sphere Model",
      img: sphere,
      description: "An indivisible, featureless solid billiard ball structure mapping uniform, immutable mass combinations without subatomic fractions."
    },
    {
      name: "J.J. Thomson",
      year: "1897",
      tagline: "Plum Pudding Model",
      img: plum,
      description: "A diffuse, fluid field of positive electrical charge embedded with discrete, negatively charged corpuscles (electrons) scattered throughout to balance electrostatic forces."
    },
    {
      name: "Ernest Rutherford",
      year: "1911",
      tagline: "Nuclear Model",
      img: nuclear,
      description: "A tiny, dense, highly concentrated positive core called the nucleus containing most of the atomic mass, with electrons orbiting through vast, empty outer space."
    },
    {
      name: "Niels Bohr",
      year: "1913",
      tagline: "Planetary Model",
      img: planetary,
      description: "Electrons traveling exclusively along stable, fixed circular orbits (quantized shells). Transitions between orbits require absorbing or emitting concrete light energy quanta."
    }
  ];

  // Safe cyclic index manipulation handlers
  const prevModel = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + models.length) % models.length);
  };

  const nextModel = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % models.length);
  };

  // Automated 10-Second Flip Interval 
  // Adding currentIndex to dependencies ensures manual clicks reset the 10-second timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % models.length);
    }, 10000); // 10000ms = 10 seconds

    // Clear interval on unmount or slide change to prevent unexpected skips
    return () => clearInterval(timer);
  }, [currentIndex, models.length]);

  return (
    <div 
      className="relative w-full min-h-[340px] bg-white dark:bg-gray-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-800"
      style={{ perspective: 1200 }} 
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, rotateY: -90, scale: 0.95 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full flex flex-col md:flex-row items-center gap-6 backface-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Framed Image Display Panel */}
          <div className="w-full md:w-1/2 aspect-video md:aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm relative group">
            <img 
              src={models[currentIndex].img} 
              alt={models[currentIndex].name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-[10px] font-bold font-mono tracking-wide text-blue-400 px-2 py-0.5 rounded border border-white/10 uppercase">
              {models[currentIndex].tagline}
            </div>
          </div>

          {/* Typography Data Deck */}
          <div className="w-full md:w-1/2 text-left space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
              {models[currentIndex].year}
            </span>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mt-1">
              {models[currentIndex].name}
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
              {models[currentIndex].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Deck (Includes Left & Right Chevrons alongside Pagination Dots) */}
      <div className="mt-6 flex items-center gap-4 z-10">
        {/* Previous Button */}
        <button
          onClick={prevModel}
          title="Previous Model"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="Previous atomic model"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Navigation Indicator Dots */}
        <div className="flex gap-2.5">
          {models.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              title={`Switch to ${models[idx].name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? "w-6 bg-blue-600 dark:bg-blue-500 shadow-xs" 
                  : "w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextModel}
          title="Next Model"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="Next atomic model"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default {
  ParticleAnimation,
  BondFormation,
  DiffusionAnimation,
  AtomicEvolution,
};