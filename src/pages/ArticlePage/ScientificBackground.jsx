// pages/ArticlePage/ScientificBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

const DataParticles = ({ isDarkMode }) => {
  const ref = useRef();
  const count = 1500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color={isDarkMode ? "#06b6d4" : "#0ea5e9"} 
        size={0.03} 
        sizeAttenuation={true} 
        depthWrite={false} 
        opacity={0.4}
      />
    </Points>
  );
};

// Represents floating "Documents" or "Data Slates"
const DataSlates = ({ isDarkMode }) => {
  const groupRef = useRef();
  const slateCount = 40;

  const slates = useMemo(() => {
    return new Array(slateCount).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      ],
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.05 + Math.random() * 0.1
    }));
  }, [slateCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(time * slates[i].speed) * 0.005;
      child.rotation.x += 0.001 * slates[i].speed;
      child.rotation.y += 0.002 * slates[i].speed;
    });
  });

  const materialColor = isDarkMode ? "#a855f7" : "#3b82f6";

  return (
    <group ref={groupRef}>
      <Instances limit={slateCount} range={slateCount}>
        <planeGeometry args={[1, 1.4]} />
        <meshBasicMaterial 
          color={materialColor} 
          transparent 
          opacity={isDarkMode ? 0.05 : 0.08} 
          wireframe 
          side={THREE.DoubleSide}
        />
        {slates.map((slate, i) => (
          <Instance 
            key={i} 
            position={slate.position} 
            rotation={slate.rotation} 
            scale={slate.scale} 
          />
        ))}
      </Instances>
    </group>
  );
};

const ScientificBackground = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* dpr restriction prevents high-res displays from tanking framerate */}
      <Canvas 
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
      >
        <DataParticles isDarkMode={isDarkMode} />
        <DataSlates isDarkMode={isDarkMode} />
      </Canvas>
    </div>
  );
};

export default ScientificBackground;