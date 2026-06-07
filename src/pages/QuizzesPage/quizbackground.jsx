// components/QuizBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '../../ThemeProvider';

const Particles = ({ isDarkMode }) => {
  const pointsRef = useRef();
  const count = 45; // Low-poly count to keep performance high

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return positions;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      // Gentle drift
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particlesPosition} itemSize={3} />
      </bufferGeometry>
      {/* Theme Aware Color Injection */}
      <pointsMaterial 
        size={0.1} 
        color={isDarkMode ? '#e2e8f0' : '#1e3a8a'} 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
      />
    </points>
  );
};

const QuizBackground = () => {
  const { isDarkMode } = useTheme();

  // Safeguard for Low-End Devices
  const isLowEnd = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return (navigator.deviceMemory && navigator.deviceMemory < 4) || 
           (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  }, []);

  if (isLowEnd) return null; // Fallback to CSS styles in parent if low-end

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
      <Canvas dpr={Math.min(2, window.devicePixelRatio || 1)}>
        <Particles isDarkMode={isDarkMode} />
      </Canvas>
    </div>
  );
};

export default QuizBackground;