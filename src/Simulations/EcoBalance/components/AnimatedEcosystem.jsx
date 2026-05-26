// games/EcoBalance/components/AnimatedEcosystem.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const VISUAL_SCALES = { grass: 800, algae: 800, rabbit: 200, deer: 100, fox: 50, snake: 50, wolf: 15, eagle: 10 };
const MAX_ENTITIES_PER_SPECIES = 15;

const AnimatedEcosystem = ({ onSpeciesClick }) => {
  const canvasRef = useRef(null);
  const { species, ecosystemHealth, timeOfDay, weather } = useGameStore();
  const [entities, setEntities] = useState([]);
  
  const landscapeCache = useRef({ width: 0, height: 0, trees: [], grass: [], flowers: [] });
  const particlesRef = useRef(Array.from({ length: 150 }).map(() => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, speed: Math.random() * 5 + 5, size: Math.random() * 3 + 1 })));
  const starsRef = useRef(Array.from({ length: 100 }).map(() => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight * 0.55, opacity: Math.random() })));

  const speciesIcons = {
    grass: { icon: '🌿', name: 'Grass', isProducer: true, isBird: false },
    algae: { icon: '🟢', name: 'Algae', isProducer: true, isBird: false },
    rabbit: { icon: '🐇', name: 'Rabbit', isProducer: false, isBird: false },
    deer: { icon: '🦌', name: 'Deer', isProducer: false, isBird: false },
    fox: { icon: '🦊', name: 'Fox', isProducer: false, isBird: false },
    snake: { icon: '🐍', name: 'Snake', isProducer: false, isBird: false },
    wolf: { icon: '🐺', name: 'Wolf', isProducer: false, isBird: false },
    eagle: { icon: '🦅', name: 'Eagle', isProducer: false, isBird: true }
  };

  const getProducerHealth = useCallback(() => {
    const grass = species.producers?.grass;
    const algae = species.producers?.algae;
    if (!grass && !algae) return 50;
    const grassHealth = grass ? (grass.population / grass.carryingCapacity) * 100 : 0;
    const algaeHealth = algae ? (algae.population / algae.carryingCapacity) * 100 : 0;
    return (grassHealth + algaeHealth) / 2;
  }, [species]);

  const getScreenBounds = useCallback(() => {
    const container = document.querySelector('.ecosystem-container');
    if (container) {
      return { minX: 40, maxX: container.clientWidth - 40, minY: 40, maxY: container.clientHeight - 60, horizon: container.clientHeight * 0.55, width: container.clientWidth, height: container.clientHeight };
    }
    return { minX: 40, maxX: 800, minY: 40, maxY: 550, horizon: 300, width: 800, height: 550 };
  }, []);

  const getPlantDensity = useCallback(() => {
    const grass = species.producers?.grass;
    const algae = species.producers?.algae;
    if (!grass && !algae) return 0.5;
    const grassRatio = grass ? grass.population / grass.carryingCapacity : 0;
    const algaeRatio = algae ? algae.population / algae.carryingCapacity : 0;
    return 0.3 + (((grassRatio + algaeRatio) / 2) * 1.2);
  }, [species]);

  const getGroundColor = useCallback(() => {
    const producerHealth = getProducerHealth();
    if (weather === 'snow') return { main: '#f8fafc', dark: '#e2e8f0', light: '#ffffff' };
    if (producerHealth / 100 < 0.3 || ecosystemHealth / 100 < 0.3) return { main: '#8B7355', dark: '#6B5335', light: '#A08060' };
    else if (producerHealth / 100 < 0.6 || ecosystemHealth / 100 < 0.6) return { main: '#6B8E5A', dark: '#4A6E3A', light: '#8AAE6A' };
    else return { main: '#4A8C3A', dark: '#2A6C1A', light: '#6AAC5A' };
  }, [ecosystemHealth, getProducerHealth, weather]);

  // --- ENTITY SPAWNING LOGIC ---
  useEffect(() => {
    const bounds = getScreenBounds();
    setEntities(currentEntities => {
      let updatedEntities = [...currentEntities];
      const allSpecies = [];
      for (const level of ['producers', 'primaryConsumers', 'secondaryConsumers', 'apexPredators']) {
        if (species[level]) {
          Object.entries(species[level]).forEach(([id, data]) => allSpecies.push({ id, ...data }));
        }
      }

      allSpecies.forEach(speciesData => {
        const speciesConfig = speciesIcons[speciesData.id];
        const targetCount = speciesData.population <= 0 ? 0 : 
          Math.max(1, Math.min(MAX_ENTITIES_PER_SPECIES, Math.floor(speciesData.population / (VISUAL_SCALES[speciesData.id] || 100))));
        
        const currentSpeciesEntities = updatedEntities.filter(e => e.speciesId === speciesData.id);
        
        // Sync disease status for existing entities
        currentSpeciesEntities.forEach(e => e.isSick = speciesData.outbreak > 0);

        if (currentSpeciesEntities.length > targetCount) {
          let removed = 0;
          updatedEntities = updatedEntities.filter(e => {
            if (e.speciesId === speciesData.id && !e.isLeader && removed < (currentSpeciesEntities.length - targetCount)) {
              removed++; return false;
            }
            return true;
          });
        } 
        else if (currentSpeciesEntities.length < targetCount) {
          const toAdd = targetCount - currentSpeciesEntities.length;
          for (let i = 0; i < toAdd; i++) {
            const hasLeader = updatedEntities.some(e => e.speciesId === speciesData.id && e.isLeader);
            const isProducer = speciesConfig?.isProducer;
            const isBird = speciesConfig?.isBird;
            
            let startX, startY;
            const leader = updatedEntities.find(e => e.speciesId === speciesData.id && e.isLeader);
            
            if (!isProducer && leader) {
              startX = leader.x + (Math.random() * 80 - 40);
              startY = leader.y + (Math.random() * 60 - 30);
            } else {
              startX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
              if (isBird) startY = bounds.minY + 40 + Math.random() * (bounds.horizon - 80);
              else if (isProducer) startY = bounds.horizon + 5 + Math.random() * 40;
              else startY = bounds.horizon + Math.random() * (bounds.maxY - bounds.horizon - 40);
            }

            startX = Math.max(bounds.minX, Math.min(bounds.maxX, startX));
            startY = Math.max(bounds.minY, Math.min(bounds.maxY, startY));

            updatedEntities.push({
              uid: `${speciesData.id}-${Date.now()}-${Math.random()}`,
              speciesId: speciesData.id,
              isLeader: !hasLeader, x: startX, y: startY,
              vx: isProducer ? 0 : (Math.random() * 1.5 - 0.75),
              vy: isProducer ? 0 : (Math.random() * 1.5 - 0.75),
              isProducer, isBird, isSick: speciesData.outbreak > 0, data: speciesData
            });
          }
        }
      });
      return updatedEntities;
    });
  }, [species, getScreenBounds]);

  // --- PHYSICS & MOVEMENT LOOP ---
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      const bounds = getScreenBounds();
      setEntities(prev => prev.map(entity => {
        if (entity.isProducer) return entity;
        let { x, y, vx, vy, isLeader, speciesId, isBird, isSick } = entity;

        vx += (Math.random() * 0.3 - 0.15); vy += (Math.random() * 0.3 - 0.15);
        
        // Sick animals move slowly (lethargy physics)
        const speedLimit = isSick ? 0.4 : (isLeader ? 1.2 : 1.8);
        vx = Math.max(-speedLimit, Math.min(speedLimit, vx));
        vy = Math.max(-speedLimit, Math.min(speedLimit, vy));

        if (!isLeader) {
          const leader = prev.find(e => e.speciesId === speciesId && e.isLeader);
          if (leader) {
            const dx = leader.x - x; const dy = leader.y - y;
            if (Math.sqrt(dx * dx + dy * dy) > 70) { vx += dx * 0.008; vy += dy * 0.008; }
          }
        }
        x += vx; y += vy;

        const minY = isBird ? bounds.minY : bounds.horizon;
        const maxY = isBird ? bounds.horizon - 20 : bounds.maxY - 30;

        if (x < bounds.minX) { x = bounds.minX; vx *= -0.8; }
        if (x > bounds.maxX) { x = bounds.maxX; vx *= -0.8; }
        if (y < minY) { y = minY; vy *= -0.8; }
        if (y > maxY) { y = maxY; vy *= -0.8; }

        return { ...entity, x, y, vx, vy };
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [getScreenBounds]);

  // --- CANVAS RENDER LOOP (Landscape + Weather + Day/Night) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = Date.now();

    const drawCanvas = () => {
      const time = (Date.now() - startTime) / 1000;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      canvas.width = width; canvas.height = height;
      const horizon = height * 0.55;

      const isDay = timeOfDay >= 6 && timeOfDay <= 18;
      const isDuskDawn = (timeOfDay > 5 && timeOfDay < 7) || (timeOfDay > 17 && timeOfDay < 19);
      const producerHealth = getProducerHealth();
      const plantDensity = getPlantDensity();
      const groundColors = getGroundColor();

      if (landscapeCache.current.width !== width || landscapeCache.current.height !== height) {
        landscapeCache.current.width = width; landscapeCache.current.height = height;
        const treeCount = Math.floor(6 + (plantDensity - 0.3) * 10);
        landscapeCache.current.trees = [];
        for (let i = 0; i < treeCount; i++) {
          let x, valid = false, attempts = 0;
          while (!valid && attempts < 20) {
            x = width * (0.05 + Math.random() * 0.9);
            const inRiver = x > width * 0.62 && x < width * 0.82;
            const nearOther = landscapeCache.current.trees.some(pos => Math.abs(pos.x - x) < width * 0.05);
            if (!inRiver && !nearOther) valid = true;
            attempts++;
          }
          landscapeCache.current.trees.push({ x, size: 18 + Math.random() * 20 });
        }
        
        landscapeCache.current.grass = [];
        const grassCount = Math.floor(150 * plantDensity);
        for (let i = 0; i < grassCount; i++) {
          const x = Math.random() * width; const y = horizon + 5 + Math.random() * 40;
          if (!(x > width * 0.62 && x < width * 0.82 && y > horizon + 20)) landscapeCache.current.grass.push({ x, y, dx: -1 + Math.random() * 2, dy: -5 - Math.random() * 8 });
        }

        landscapeCache.current.flowers = [];
        const flowerColors = ['#ff6b9d', '#ffb84d', '#ff4d4d', '#e86eff', '#ffa07a'];
        for (let i = 0; i < Math.floor(60 * plantDensity); i++) {
          const x = Math.random() * width; const y = horizon + 5 + Math.random() * 60;
          const inRiver = x > width * 0.62 && x < width * 0.82 && y > horizon + 20 && y < horizon + 180;
          const underTree = landscapeCache.current.trees.some(tree => Math.abs(tree.x - x) < 20);
          if (!inRiver && !underTree) landscapeCache.current.flowers.push({ x, y, color: flowerColors[Math.floor(Math.random() * flowerColors.length)], size: 2 + Math.random() * 2 });
        }
      }

      // Sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, horizon);
      if (weather === 'rain' || weather === 'snow') {
        skyGradient.addColorStop(0, '#4a5568'); skyGradient.addColorStop(1, '#718096');
      } else if (isDay && !isDuskDawn) {
        skyGradient.addColorStop(0, ecosystemHealth > 70 ? '#87CEEB' : '#b0c4de');
        skyGradient.addColorStop(1, ecosystemHealth > 70 ? '#b8e4b8' : '#9bc89b');
      } else if (isDuskDawn) {
        skyGradient.addColorStop(0, '#FF7F50'); skyGradient.addColorStop(1, '#6A5ACD');
      } else {
        skyGradient.addColorStop(0, '#0B0C10'); skyGradient.addColorStop(1, '#1f2833');
      }
      ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, width, horizon);

      // Stars
      if (!isDay || isDuskDawn) {
        starsRef.current.forEach(star => {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * Math.abs(Math.sin(time * 2 + star.x))})`;
          ctx.beginPath(); ctx.arc(star.x, star.y, 1.5, 0, 2 * Math.PI); ctx.fill();
        });
      }

      // Sun / Moon
      let celestialX, celestialY, color;
      if (isDay) {
        const dayProgress = (timeOfDay - 6) / 12;
        celestialX = width * dayProgress; celestialY = horizon - Math.sin(dayProgress * Math.PI) * (horizon * 0.8);
        color = ecosystemHealth > 70 ? '#FFE066' : '#DAA520';
      } else {
        const nightProgress = (timeOfDay >= 18 ? timeOfDay - 18 : timeOfDay + 6) / 12;
        celestialX = width * nightProgress; celestialY = horizon - Math.sin(nightProgress * Math.PI) * (horizon * 0.8);
        color = '#F4F6F0';
      }
      if (weather === 'clear') {
        ctx.fillStyle = color; ctx.shadowBlur = 20; ctx.shadowColor = color;
        ctx.beginPath(); ctx.arc(celestialX, celestialY, isDay ? 45 : 30, 0, 2 * Math.PI); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Clouds
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + ecosystemHealth / 200})`;
      const cloudOffset = (time * 15) % width;
      const drawCloud = (cx, cy) => {
        let x = cx + cloudOffset; if (x > width + 100) x -= (width + 200);
        ctx.beginPath(); ctx.ellipse(x, cy, 50, 30, 0, 0, 2 * Math.PI); ctx.ellipse(x + 30, cy - 5, 40, 25, 0, 0, 2 * Math.PI); ctx.ellipse(x - 30, cy - 5, 40, 25, 0, 0, 2 * Math.PI); ctx.fill();
      };
      drawCloud(width * 0.2 - cloudOffset, 60); drawCloud(width * 0.6 - cloudOffset, 80);

      // Mountains
      ctx.fillStyle = isDay ? (ecosystemHealth > 50 ? '#4a6a5a' : '#6a5a4a') : '#111827';
      ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(width * 0.25, horizon - 100); ctx.lineTo(width * 0.5, horizon); ctx.fill();
      ctx.fillStyle = isDay ? (ecosystemHealth > 50 ? '#5a8a6a' : '#7a6a5a') : '#1f2937';
      ctx.beginPath(); ctx.moveTo(width * 0.15, horizon); ctx.lineTo(width * 0.45, horizon - 90); ctx.lineTo(width * 0.75, horizon); ctx.fill();

      // Ground & River
      const groundGradient = ctx.createLinearGradient(0, horizon, 0, height);
      groundGradient.addColorStop(0, groundColors.main); groundGradient.addColorStop(1, groundColors.dark);
      ctx.fillStyle = groundGradient; ctx.fillRect(0, horizon, width, height - horizon);
      ctx.fillStyle = weather === 'snow' ? '#b0e0e6' : (ecosystemHealth > 50 ? '#4ab8d8' : '#7a9a8a');
      ctx.beginPath(); ctx.moveTo(width * 0.65, horizon - 5); ctx.quadraticCurveTo(width * 0.6, horizon + 60, width * 0.75, horizon + 120); ctx.quadraticCurveTo(width * 0.7, horizon + 180, width * 0.8, horizon + 230); ctx.lineTo(width * 0.84, horizon + 230); ctx.quadraticCurveTo(width * 0.74, horizon + 180, width * 0.79, horizon + 120); ctx.quadraticCurveTo(width * 0.64, horizon + 60, width * 0.69, horizon - 5); ctx.fill();

      // Cached Landscape
      landscapeCache.current.trees.forEach(tree => {
        ctx.fillStyle = '#5a3a1a'; ctx.fillRect(tree.x - 4, horizon - tree.size + 12, 8, tree.size - 12);
        const canopyColor = weather === 'snow' ? '#ffffff' : (producerHealth > 60 ? '#3a9a2a' : '#5a7a3a');
        ctx.fillStyle = canopyColor; ctx.beginPath(); ctx.arc(tree.x, horizon - tree.size + 8, tree.size * 0.4, 0, 2 * Math.PI); ctx.fill(); ctx.beginPath(); ctx.arc(tree.x - 8, horizon - tree.size + 4, tree.size * 0.35, 0, 2 * Math.PI); ctx.fill(); ctx.beginPath(); ctx.arc(tree.x + 8, horizon - tree.size + 4, tree.size * 0.35, 0, 2 * Math.PI); ctx.fill();
      });
      if (weather !== 'snow') {
        ctx.strokeStyle = producerHealth > 60 ? '#3a8a2a' : '#6a8a4a'; ctx.lineWidth = 1.5;
        landscapeCache.current.grass.forEach(g => { ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x + g.dx, g.y + g.dy); ctx.stroke(); });
        if (producerHealth > 50) {
          landscapeCache.current.flowers.forEach(f => {
            ctx.fillStyle = f.color; ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, 2 * Math.PI); ctx.fill();
            ctx.fillStyle = '#8B6914'; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - 1, f.y + 4); ctx.lineTo(f.x + 1, f.y + 4); ctx.fill();
          });
        }
      }

      // Night Overlay
      if (!isDay || isDuskDawn) {
        const opacity = isDay ? 0 : (isDuskDawn ? 0.3 : 0.6);
        ctx.fillStyle = `rgba(10, 15, 30, ${opacity})`; ctx.fillRect(0, horizon, width, height - horizon); ctx.fillRect(0, horizon - 100, width, 100);
      }

      // Weather Particles
      if (weather === 'rain' || weather === 'snow') {
        ctx.fillStyle = weather === 'rain' ? 'rgba(173, 216, 230, 0.6)' : 'rgba(255, 255, 255, 0.8)';
        particlesRef.current.forEach(p => {
          ctx.beginPath();
          if (weather === 'rain') { ctx.fillRect(p.x, p.y, 2, p.speed * 1.5); p.y += p.speed * 2; p.x -= 2; } 
          else { ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); p.y += p.speed * 0.5; p.x += Math.sin(time + p.y) * 2; }
          if (p.y > height) { p.y = -10; p.x = Math.random() * width + 100; }
        });
      }

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(10, 10, 80, 30);
      ctx.fillStyle = 'white'; ctx.font = '14px Arial'; ctx.fillText(`🕒 ${Math.floor(timeOfDay).toString().padStart(2, '0')}:00`, 20, 30);
      if (producerHealth < 30) { ctx.fillStyle = '#ff0000aa'; ctx.font = 'bold 14px Arial'; ctx.fillText('⚠️ PRODUCER CRISIS!', width / 2 - 100, horizon - 20); }

      animationFrameId = requestAnimationFrame(drawCanvas);
    };

    drawCanvas();
    return () => cancelAnimationFrame(animationFrameId);
  }, [ecosystemHealth, getGroundColor, getPlantDensity, getProducerHealth, timeOfDay, weather]);
  
  const getHealthColor = (population, carryingCapacity) => {
    const ratio = population / carryingCapacity;
    if (ratio < 0.2) return 'border-red-500 shadow-red-500/50';
    if (ratio < 0.4) return 'border-orange-500 shadow-orange-500/30';
    if (ratio > 0.9) return 'border-yellow-500 shadow-yellow-500/30';
    return 'border-green-500 shadow-green-500/30';
  };

  const getSpeciesLatestData = (id) => {
    for (const level of ['producers', 'primaryConsumers', 'secondaryConsumers', 'apexPredators']) {
      if (species[level] && species[level][id]) return species[level][id];
    }
    return null;
  };

  const grassData = species.producers?.grass;
  const algaeData = species.producers?.algae;

  return (
    <div className="ecosystem-container relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
      
      {/* Clickable Producer Status Circles */}
      {grassData && (
        <motion.div className="absolute cursor-pointer z-30" style={{ bottom: '20px', left: '20px' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onSpeciesClick({ id: 'grass', ...grassData })}>
          <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-2 shadow-xl border-2" style={{ borderColor: (grassData.population / grassData.carryingCapacity) < 0.3 ? '#ff4444' : (grassData.population / grassData.carryingCapacity) > 0.9 ? '#ffaa44' : '#44ff44' }}>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="text-4xl">🌿</div>
              <div>
                <div className="text-white font-bold text-sm">Grass</div>
                <div className="text-gray-300 text-xs">{Math.round(grassData.population)} / {grassData.carryingCapacity}</div>
                <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden"><motion.div className="h-full bg-green-500" style={{ width: `${(grassData.population / grassData.carryingCapacity) * 100}%` }} /></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {algaeData && (
        <motion.div className="absolute cursor-pointer z-30" style={{ bottom: '20px', right: '20px' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onSpeciesClick({ id: 'algae', ...algaeData })}>
          <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-2 shadow-xl border-2" style={{ borderColor: (algaeData.population / algaeData.carryingCapacity) < 0.3 ? '#ff4444' : (algaeData.population / algaeData.carryingCapacity) > 0.9 ? '#ffaa44' : '#44ff44' }}>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="text-4xl">🟢</div>
              <div>
                <div className="text-white font-bold text-sm">Algae</div>
                <div className="text-gray-300 text-xs">{Math.round(algaeData.population)} / {algaeData.carryingCapacity}</div>
                <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden"><motion.div className="h-full bg-green-500" style={{ width: `${(algaeData.population / algaeData.carryingCapacity) * 100}%` }} /></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Living Organisms Layer */}
      <div className="relative w-full h-full" style={{ zIndex: 15 }}>
        {entities.map(entity => {
          const freshData = getSpeciesLatestData(entity.speciesId);
          if (!freshData || freshData.population <= 0) return null;

          const healthRatio = freshData.population / freshData.carryingCapacity;
          const isEndangered = healthRatio < 0.2;
          const isSick = entity.isSick; // Fetched from the synced entity state
          const speciesConfig = speciesIcons[entity.speciesId];

          return (
            <motion.div
              key={entity.uid}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 
                ${!entity.isLeader ? 'opacity-85' : 'opacity-100'}
                ${isSick ? 'hue-rotate-90 sepia-[.5]' : ''} 
              `}
              style={{ 
                left: entity.x, top: entity.y, zIndex: entity.isLeader ? 30 : 20,
                filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.3))`
              }}
              whileHover={{ scale: 1.3, zIndex: 50 }}
              onClick={() => onSpeciesClick({ id: entity.speciesId, ...freshData })}
              animate={
                speciesConfig?.isProducer ? { y: [entity.y, entity.y - 2, entity.y], rotate: [-2, 0, 2, 0] } : 
                isSick ? { y: [entity.y, entity.y + 2, entity.y], rotate: [-5, 5, -5] } : {} 
              }
              transition={{ duration: isSick ? 4 : 3, repeat: (speciesConfig?.isProducer || isSick) ? Infinity : 0, ease: "easeInOut" }}
            >
              {entity.isLeader ? (
                <div className={`relative rounded-full border-4 
                  ${isSick ? 'border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.8)]' : getHealthColor(freshData.population, freshData.carryingCapacity)} 
                  bg-black/60 backdrop-blur-md p-2 shadow-xl transition-all duration-1000`}
                >
                  <div className="text-3xl text-center">{speciesConfig?.icon}</div>
                  <div className="absolute -top-2 -right-2 bg-black/90 border border-gray-500 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                    {Math.round(freshData.population)}
                  </div>
                  
                  {isSick && (
                    <motion.div className="absolute -top-6 left-0 text-lg" animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                      🦠
                    </motion.div>
                  )}

                  <div className="absolute -bottom-4 left-0 right-0 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div className={`h-full ${isSick ? 'bg-lime-500' : (healthRatio < 0.2 ? 'bg-red-500' : healthRatio > 0.9 ? 'bg-yellow-500' : 'bg-green-500')}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, healthRatio * 100))}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[8px] font-bold text-white bg-black/60 rounded px-1">
                    {speciesConfig?.name}
                  </div>
                  {isEndangered && !isSick && <div className="absolute -top-3 -left-3 text-red-500 animate-pulse text-sm font-bold">⚠️</div>}
                </div>
              ) : (
                <div className="text-2xl filter drop-shadow-lg transform transition-transform hover:scale-110 relative">
                  {speciesConfig?.icon}
                  {isSick && <span className="absolute -top-2 -right-2 text-[10px] animate-pulse">🦠</span>}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedEcosystem;