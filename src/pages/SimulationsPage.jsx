// pages/SimulationsPage.jsx
import React, { useEffect, useRef } from 'react';

const SimulationsPage = () => {
  const godotContainerRef = useRef(null);
  
  // You can add Godot integration logic here
  useEffect(() => {
    // Example: Initialize Godot simulation when component mounts
    console.log('Simulations page loaded, ready to mount Godot');
    
    // Cleanup when component unmounts
    return () => {
      console.log('Cleaning up simulation');
    };
  }, []);

  const simulations = [
    { id: 'dna', name: 'DNA Structure', description: 'Explore DNA double helix' },
    { id: 'physics', name: 'Physics Lab', description: 'Experiment with forces' },
    { id: 'chemistry', name: 'Chemical Reactions', description: 'Mix virtual compounds' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">
        Virtual Laboratories
      </h1>
      
      {/* Simulation selector */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {simulations.map(sim => (
          <button
            key={sim.id}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {sim.name}
          </button>
        ))}
      </div>
      
      {/* Godot container */}
      <div 
        ref={godotContainerRef}
        className="mt-6 p-8 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl text-center text-gray-500"
      >
        Godot simulation frames will be mounted here.
      </div>
    </div>
  );
};

export default SimulationsPage;