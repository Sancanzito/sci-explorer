import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

function Starfield() {
  const starsRef = useRef(null);
  
  useEffect(() => {
    if (starsRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.01;
        positions[i + 1] += (Math.random() - 0.5) * 0.01;
        positions[i + 2] += (Math.random() - 0.5) * 0.01;
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <Stars 
      ref={starsRef}
      radius={100} 
      depth={50} 
      count={5000} 
      factor={100} 
      saturation={0} 
      opacity={0.8}
      color="#ffffff"
      size={1}
    />
  );
}

export function CosmicBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
    >
      <Canvas 
        className="w-full h-full"
        camera={{ position: [0, 0, 50], fov: 50 }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <Starfield />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
    </motion.div>
  );
}