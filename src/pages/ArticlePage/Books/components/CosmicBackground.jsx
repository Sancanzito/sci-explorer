import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
// Note: Adjust this import path depending on where ThemeProvider is relative to this file
import { useTheme } from '../../../../ThemeProvider'; 

function AnimatedStarfield({ isDarkMode }) {
  const starsRef = useRef(null);

  // Replaced the harsh positional jitter with a gentle, continuous rotation
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
      starsRef.current.rotation.x += 0.0001;
    }
  });

  // White/light stars for dark mode, soft deep blue stars for light mode
  const starColor = isDarkMode ? "#ffffff" : "#1e3a8a"; 

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={3000}       // Reduced from 5000 for a less cluttered, cleaner look
      factor={4}         // Adjusted for softer star sizing
      saturation={0.5}   // Adds a subtle tint to the stars
      fade={true}        // Smooths out the edges of the stars so they aren't sharp dots
      speed={1}          // Enables a natural twinkling effect
      color={starColor}
    />
  );
}

export function CosmicBackground() {
  const { isDarkMode } = useTheme();

  // Softer dark space blue for dark mode, gentle sky blue for light mode
  const bgColor = isDarkMode ? '#0b0f19' : '#e0f2fe';

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 50], fov: 50 }}
        style={{ touchAction: 'none' }}
        // Note: Removed frameloop="demand" so the slow rotation animation can run smoothly
      >
        <AnimatedStarfield isDarkMode={isDarkMode} />
        <ambientLight intensity={isDarkMode ? 0.3 : 0.8} />
        <directionalLight position={[10, 10, 10]} intensity={isDarkMode ? 0.5 : 1} />
      </Canvas>
    </div>
  );
}