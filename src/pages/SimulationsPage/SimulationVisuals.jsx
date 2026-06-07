// components/SimulationVisuals.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Unified Background: Grid + Particles + Electron Cloud

export const AmbientBackground = ({ opacity = 0.4 }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <SpacetimeGrid />
        <HeroParticles />
      </Canvas>
    </div>
  );
};
const SpacetimeGrid = () => {
  const meshRef = useRef();
  
  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    // Warping grid based on time and mouse parallax
    meshRef.current.rotation.x = -Math.PI / 2.5 + (mouse.y * 0.1);
    meshRef.current.rotation.y = mouse.x * 0.1;
    meshRef.current.position.y = -5 + Math.sin(time * 0.5) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, -5, 0]}>
      <planeGeometry args={[50, 50, 40, 40]} />
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.15} />
    </mesh>
  );
};

const HeroParticles = () => {
  const ref = useRef();
  const particleCount = 3000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return pos;
  }, [particleCount]);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    ref.current.position.x = mouse.x * 2; // Follow cursor slightly
    ref.current.position.y = mouse.y * 2;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a855f7" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

// 2. Data Orb for "Why Use Our Simulations" Section
export const DataOrbCanvas = ({ color }) => {
  return (
    <div className="w-24 h-24 mx-auto mb-6">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[1.5, 32, 32]}>
            <MeshTransmissionMaterial 
              color={color} 
              transmission={0.9} 
              roughness={0.1} 
              thickness={2} 
              ior={1.5} 
            />
          </Sphere>
          {/* Inner Core */}
          <Sphere args={[0.5, 16, 16]}>
            <meshBasicMaterial color="#ffffff" wireframe />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};

// --- FIX APPLIED HERE ---
// 3a. Extract the hook logic into a child scene component
const BlackHoleScene = ({ isHovered }) => {
  const ref = useRef();
  
  useFrame(() => {
    if (!ref.current) return;
    const speed = isHovered ? 2 : 0.2;
    ref.current.rotation.z -= 0.01 * speed;
    if (isHovered) {
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 0.5, 0.05));
    } else {
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 1, 0.05));
    }
  });

  return (
    <group ref={ref}>
      {/* Swirling accretion disk approximation */}
      <Sphere args={[5, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      <TorusRing size={6} color="#06b6d4" />
      <TorusRing size={7.5} color="#a855f7" />
      <TorusRing size={9} color="#3b82f6" />
    </group>
  );
};

// 3b. Keep the Canvas wrapper purely for rendering the context
export const BlackHoleFooterCanvas = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 15] }}>
        {/* Render the logic component INSIDE the Canvas */}
        <BlackHoleScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

const TorusRing = ({ size, color }) => (
  <mesh rotation={[Math.PI / 2.2, 0, 0]}>
    <torusGeometry args={[size, 0.05, 16, 100]} />
    <meshBasicMaterial color={color} transparent opacity={0.5} />
  </mesh>
);
