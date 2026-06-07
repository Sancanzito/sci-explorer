// pages/ArticlePage/ScientificBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Torus, Cylinder, Sphere } from '@react-three/drei';

const AtomicParticles = ({ isDarkMode }) => {
  const ref = useRef();
  const count = 250;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color={isDarkMode ? "#06b6d4" : "#2563eb"} 
        size={0.08} 
        sizeAttenuation={true} 
        depthWrite={false} 
        opacity={0.6}
      />
    </Points>
  );
};

const MolecularOrbits = ({ isDarkMode }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const color = isDarkMode ? "#a855f7" : "#4f46e5";

  return (
    <group ref={groupRef} position={[4, 2, -8]}>
      <Torus args={[2, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </Torus>
      <Torus args={[2, 0.02, 16, 64]} rotation={[0, Math.PI / 2, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </Torus>
      <Sphere args={[0.3, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </Sphere>
    </group>
  );
};

const LowPolyFlask = ({ isDarkMode }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 - 2;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  const glassColor = isDarkMode ? "#ffffff" : "#cbd5e1";
  const liquidColor = isDarkMode ? "#10b981" : "#059669";

  return (
    <group ref={groupRef} position={[-5, -2, -6]} rotation={[0.2, 0.5, 0]}>
      <Cylinder args={[0.4, 1.5, 2.5, 16]} material-transparent material-opacity={0.2} material-color={glassColor} />
      <Cylinder args={[0.4, 0.4, 1.5, 16]} position={[0, 2, 0]} material-transparent material-opacity={0.2} material-color={glassColor} />
      <Cylinder args={[0.35, 1.4, 2.2, 16]} position={[0, -0.1, 0]} material-transparent material-opacity={0.6} material-color={liquidColor} />
    </group>
  );
};

const ScientificBackground = ({ isDarkMode }) => {
  // Device capability check
  const isLowEnd = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return (navigator.deviceMemory && navigator.deviceMemory < 4) || 
           (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  }, []);

  if (isLowEnd) {
    return (
      <div className={`fixed inset-0 z-0 pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-cyan-900/20 to-purple-900/20' : 'bg-gradient-to-br from-cyan-100 to-blue-100'}`} />
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen">
      <Canvas dpr={Math.min(window.devicePixelRatio || 1, 2)} camera={{ position: [0, 0, 10], fov: 45 }}>
        <AtomicParticles isDarkMode={isDarkMode} />
        <MolecularOrbits isDarkMode={isDarkMode} />
        <LowPolyFlask isDarkMode={isDarkMode} />
      </Canvas>
    </div>
  );
};

export default ScientificBackground;