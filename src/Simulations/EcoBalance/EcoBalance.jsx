// games/EcoBalance/EcoBalanceGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import Phaser from 'phaser';

// ============================================================================
// PART 1: CONSTANTS & ECOLOGICAL RULES
// ============================================================================
const PREDATION_MATRIX = {
  rabbit: { grass: 0.00005, algae: 0.00003 },
  deer: { grass: 0.00003, algae: 0.00002 },
  fox: { rabbit: 0.00015, deer: 0.00005 },
  snake: { rabbit: 0.00012, deer: 0.00003 },
  wolf: { deer: 0.00008, rabbit: 0.00006, fox: 0.0003, snake: 0.0002 },
  eagle: { rabbit: 0.00009, snake: 0.00025, fox: 0.00015 }
};

const INITIAL_SPECIES = {
  producers: {
    grass: { id: 'grass', name: 'Vegetation', population: 8000, carryingCapacity: 10000, growthRate: 0.03, mortalityRate: 0.01, trophicLevel: 1, icon: '🌿', visualScale: 250 },
    algae: { id: 'algae', name: 'River Algae', population: 1000, carryingCapacity: 8500, growthRate: 0.045, mortalityRate: 0.012, trophicLevel: 1, icon: '🟢', visualScale: 400 }
  },
  primaryConsumers: {
    rabbit: { id: 'rabbit', name: 'Rabbit', population: 1200, carryingCapacity: 2000, growthRate: 0.025, mortalityRate: 0.02, trophicLevel: 2, icon: '🐇', visualScale: 80 },
    deer: { id: 'deer', name: 'Deer', population: 400, carryingCapacity: 800, growthRate: 0.02, mortalityRate: 0.018, trophicLevel: 2, icon: '🦌', visualScale: 35 }
  },
  secondaryConsumers: {
    fox: { id: 'fox', name: 'Fox', population: 200, carryingCapacity: 400, growthRate: 0.015, mortalityRate: 0.025, trophicLevel: 3, icon: '🦊', visualScale: 20 },
    snake: { id: 'snake', name: 'Snake', population: 250, carryingCapacity: 500, growthRate: 0.018, mortalityRate: 0.022, trophicLevel: 3, icon: '🐍', visualScale: 25 }
  },
  apexPredators: {
    wolf: { id: 'wolf', name: 'Wolf', population: 50, carryingCapacity: 100, growthRate: 0.01, mortalityRate: 0.03, trophicLevel: 4, icon: '🐺', visualScale: 6 },
    eagle: { id: 'eagle', name: 'Eagle', population: 35, carryingCapacity: 70, growthRate: 0.012, mortalityRate: 0.028, trophicLevel: 4, icon: '🦅', visualScale: 5 }
  }
};

// ============================================================================
// PART 2: ZUSTAND UI STORE
// ============================================================================
const useUIStore = create((set, get) => ({
  selectedSpecies: null,
  activePanel: null, 
  speciesData: INITIAL_SPECIES,
  ecosystemHealth: 100,
  timeStep: 0,
  events: [],
  notifications: [],
  isRunning: true,
  simulationSpeed: 1,

  setSelectedSpecies: (species) => set({ selectedSpecies: species }),
  togglePanel: (panel) => set(state => ({ activePanel: state.activePanel === panel ? null : panel })),
  clearEvents: () => set({ events: [] }),
  
  syncSimulation: (data) => set({ 
    speciesData: data.species, 
    ecosystemHealth: data.health,
    timeStep: data.timeStep
  }),
  
  logEvent: (message, type) => set(state => ({ 
    events: [{ id: Date.now(), message, type, time: new Date() }, ...state.events].slice(0, 50) 
  })),

  addNotification: (message, type) => {
    const id = Date.now();
    set(state => ({ notifications: [{ id, message, type }, ...state.notifications].slice(0, 5) }));
    setTimeout(() => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })), 4000);
  },

  toggleRunning: () => set(state => {
    window.dispatchEvent(new CustomEvent('eco-toggle-pause', { detail: !state.isRunning }));
    return { isRunning: !state.isRunning };
  }),
  
  setSpeed: (speed) => set(() => {
    window.dispatchEvent(new CustomEvent('eco-set-speed', { detail: speed }));
    return { simulationSpeed: speed };
  }),
  
  triggerIntervention: (actionId) => window.dispatchEvent(new CustomEvent('eco-intervention', { detail: actionId }))
}));

// ============================================================================
// PART 3: SIMULATION MATHEMATICS CORE
// ============================================================================
class EcosystemSimulation {
  constructor() {
    this.species = JSON.parse(JSON.stringify(INITIAL_SPECIES));
    this.health = 100;
    this.timeStep = 0;
    this.environment = { rainfall: 1.0, toxicity: 0 };
  }

  calculatePredationPressure(preyId) {
    let pressure = 0;
    for (const level of ['secondaryConsumers', 'apexPredators']) {
      for (const [predId, data] of Object.entries(this.species[level] || {})) {
        pressure += (PREDATION_MATRIX[predId]?.[preyId] || 0) * data.population;
      }
    }
    return pressure;
  }

  tick() {
    this.timeStep++;
    let endangeredCount = 0;

    for (const level of Object.keys(this.species)) {
      for (const [id, data] of Object.entries(this.species[level])) {
        const pressure = this.calculatePredationPressure(id);
        const carryingFactor = Math.max(0, 1 - (data.population / data.carryingCapacity));
        const births = data.population * data.growthRate * this.environment.rainfall * carryingFactor;
        const deaths = (data.population * data.mortalityRate) + (data.population * pressure * 0.3) + (data.population * this.environment.toxicity);
        
        let newPop = data.population + births - deaths;
        if (newPop < 5 && data.population > 0) newPop = 0;
        
        if (data.population > 0 && Math.abs((newPop - data.population) / data.population) > 0.15) {
            const pct = Math.round(((newPop - data.population) / data.population) * 100);
            if (pct > 0 && pct < 200) useUIStore.getState().logEvent(`📈 ${data.name} grew by ${pct}%`, 'growth');
            else if (pct < 0) useUIStore.getState().logEvent(`📉 ${data.name} declined by ${Math.abs(pct)}%`, 'decline');
        }

        data.population = newPop;
        if (data.population / data.carryingCapacity < 0.15) endangeredCount++;
      }
    }

    this.health = Math.max(0, 100 - (endangeredCount * 15));
    return { species: this.species, health: this.health, timeStep: this.timeStep };
  }

  applyIntervention(type) {
    switch(type) {
        case 'nutrients':
            this.species.producers.grass.population *= 1.5;
            this.species.producers.algae.population *= 2.5; // Algae responds faster
            return "🌱 Nutrients Added: Algae and vegetation blooming!";
        case 'predator':
            this.species.apexPredators.wolf.population *= 1.5;
            return "🐺 Introduced Wolves: Apex pressure increased!";
        case 'toxins':
            this.environment.toxicity += 0.05;
            return "☠️ Toxins Introduced: Mortality rates increased!";
        case 'disease':
            this.species.primaryConsumers.rabbit.population *= 0.4;
            this.species.primaryConsumers.deer.population *= 0.4;
            return "🦠 Viral Outbreak: Herbivore populations plummeted!";
        case 'rain-up':
            this.environment.rainfall = 1.3;
            return "💧 Rainfall Increased: Plant carrying capacity boosted!";
        case 'rain-down':
            this.environment.rainfall = 0.6;
            return "🌵 Drought: Plant carrying capacity reduced!";
        default: return "Intervention applied.";
    }
  }
}

// ============================================================================
// PART 4: PHASER ENGINE (AESTHETIC WORLD & ORGANIC AI)
// ============================================================================
class MainEcosystemScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainEcosystemScene' });
    this.simulation = new EcosystemSimulation();
    this.entityGroups = {}; 
    this.isPaused = false;
    this.simSpeed = 1;
    this.timeOfDay = 12; // Start at Noon
    this.currentAlgaeHealth = 0.1; 
  }

  create() {
    const { width, height } = this.scale;
    this.horizon = height * 0.55;

    // 1. GENERATE PROCEDURAL TEXTURES
    this.createProceduralTextures();

    // 2. BACKGROUND (Sky, Stars, Celestial, Clouds, Mountains, Ground)
    this.skyGraphics = this.add.graphics();
    
    this.stars = this.add.graphics();
    this.stars.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 150; i++) this.stars.fillCircle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, this.horizon), Math.random() * 1.5);
    this.stars.setAlpha(0);

    this.sun = this.add.circle(0, 0, 45, 0xFFE066);
    this.moon = this.add.circle(0, 0, 35, 0xF4F6F0);

    // Clouds
    this.clouds = [];
    for(let i=0; i<6; i++) {
        let c = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(20, this.horizon - 50), 'cloud');
        c.scale = Phaser.Math.FloatBetween(0.5, 1.2);
        c.speed = Phaser.Math.FloatBetween(10, 25);
        c.setAlpha(0.6);
        this.clouds.push(c);
    }

    // Mountains
    this.mountains = this.add.graphics();
    this.mountains.fillStyle(0x3a5a4a, 1);
    this.mountains.beginPath();
    this.mountains.moveTo(0, this.horizon);
    this.mountains.lineTo(width * 0.2, this.horizon - 120);
    this.mountains.lineTo(width * 0.45, this.horizon - 60); // Valley for river
    this.mountains.lineTo(width * 0.7, this.horizon - 150);
    this.mountains.lineTo(width, this.horizon - 90);
    this.mountains.lineTo(width, this.horizon);
    this.mountains.fillPath();

    this.ground = this.add.rectangle(0, this.horizon, width, height - this.horizon, 0x4a8c3a).setOrigin(0, 0);

    // 3. RIVER GRAPHICS (Drawn dynamically in update loop for Algae color)
    this.riverGraphics = this.add.graphics();

    // 4. NIGHT OVERLAY
    this.nightOverlay = this.add.rectangle(0, 0, width, height, 0x000033).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.MULTIPLY).setAlpha(0);

    // 5. INITIAL POPULATIONS
    this.initializeEntityPools();

    // 6. TICK LOOP & LISTENERS
    this.simTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.runSimulationTick() });

    window.addEventListener('eco-toggle-pause', (e) => this.isPaused = e.detail);
    window.addEventListener('eco-set-speed', (e) => {
      this.simSpeed = e.detail;
      this.simTimer.delay = 1000 / this.simSpeed;
    });
    window.addEventListener('eco-intervention', (e) => {
      const msg = this.simulation.applyIntervention(e.detail);
      useUIStore.getState().logEvent(msg, 'intervention');
      useUIStore.getState().addNotification(msg, 'success');
    });
  }

  // Draw simple procedural assets so we don't rely on text emojis
  createProceduralTextures() {
      const g = this.make.graphics();
      
      // Grass/Tree
      g.fillStyle(0x654321); g.fillRect(8, 12, 4, 12); // Trunk
      g.fillStyle(0x22c55e); g.fillCircle(10, 8, 10); g.fillCircle(4, 14, 6); g.fillCircle(16, 14, 6); // Leaves
      g.generateTexture('grass', 20, 24); g.clear();
      
      // Rabbit (White)
      g.fillStyle(0xffffff); g.fillCircle(8, 10, 6); g.fillEllipse(5, 4, 2, 6); g.fillEllipse(11, 4, 2, 6);
      g.generateTexture('rabbit', 16, 16); g.clear();

      // Deer (Brown)
      g.fillStyle(0xa0522d); g.fillRoundedRect(0, 8, 20, 12, 4); g.fillCircle(16, 6, 6);
      g.generateTexture('deer', 22, 20); g.clear();

      // Fox (Orange)
      g.fillStyle(0xf97316); g.fillTriangle(0,12, 6,0, 12,12); g.fillCircle(6, 10, 4);
      g.generateTexture('fox', 12, 12); g.clear();

      // Snake (Red Squiggle)
      g.lineStyle(3, 0xef4444); g.beginPath(); g.moveTo(0,6); g.lineTo(4,0); g.lineTo(8,12); g.lineTo(12,6); g.strokePath();
      g.generateTexture('snake', 12, 12); g.clear();

      // Wolf (Dark Grey)
      g.fillStyle(0x4b5563); g.fillRoundedRect(0, 6, 18, 10, 3); g.fillTriangle(14, 0, 12, 8, 20, 8);
      g.generateTexture('wolf', 20, 16); g.clear();

      // Eagle (V-Shape)
      g.lineStyle(3, 0xffffff); g.beginPath(); g.moveTo(0,0); g.lineTo(10,10); g.lineTo(20,0); g.strokePath();
      g.generateTexture('eagle', 20, 12); g.clear();

      // Cloud
      g.fillStyle(0xffffff); g.fillCircle(20,20,20); g.fillCircle(45,20,25); g.fillCircle(70,20,15);
      g.generateTexture('cloud', 90, 45); g.clear();
  }

  // The River originates narrowly from the mountain and widens at the bottom left
  isSafeFromRiver(x) {
      const w = this.scale.width;
      // River occupies x from ~0.2 (bottom left) to ~0.55 (mountain center). Safe zones: left edge or right half.
      return x < w * 0.15 || x > w * 0.55;
  }

  getSafeSpawnPoint(isEagle) {
      const { width, height } = this.scale;
      let x, y;
      let safe = false;
      let attempts = 0;
      while(!safe && attempts < 20) {
          x = Phaser.Math.Between(20, width - 20);
          y = isEagle ? Phaser.Math.Between(20, this.horizon - 40) : Phaser.Math.Between(this.horizon + 20, height - 20);
          if (isEagle || this.isSafeFromRiver(x)) safe = true;
          attempts++;
      }
      return {x, y};
  }

  initializeEntityPools() {
    for (const level of Object.keys(INITIAL_SPECIES)) {
      for (const [id, data] of Object.entries(INITIAL_SPECIES[level])) {
        if (id === 'algae') continue; // Algae doesn't spawn physically; it colors the river.

        this.entityGroups[id] = this.add.group();
        const initialCount = Math.floor(data.population / data.visualScale);
        for (let i = 0; i < initialCount; i++) {
          const spawn = this.getSafeSpawnPoint(id === 'eagle');
          this.spawnSprite(id, data, spawn.x, spawn.y);
        }
      }
    }
  }

  spawnSprite(id, data, x, y) {
    const sprite = this.add.image(x, y, id).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0); 
    sprite.speciesId = id;
    this.tweens.add({ targets: sprite, alpha: 1, duration: 800 });

    sprite.on('pointerdown', () => {
      const flatData = {};
      for (const lvl of Object.keys(this.simulation.species)) Object.assign(flatData, this.simulation.species[lvl]);
      useUIStore.getState().setSelectedSpecies(flatData[id]);
    });

    if (data.trophicLevel > 1) {
        this.assignWanderAI(sprite);
    } else {
        // Plants randomly sway
        sprite.setOrigin(0.5, 1);
        this.tweens.add({ targets: sprite, angle: Phaser.Math.Between(-5, 5), duration: Phaser.Math.Between(2000, 4000), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    this.entityGroups[id].add(sprite);
    return sprite;
  }

  assignWanderAI(sprite) {
    const { width, height } = this.scale;
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000),
      loop: true,
      callback: () => {
        if (this.isPaused || !sprite.active) return;
        
        let targetX = Phaser.Math.Clamp(sprite.x + Phaser.Math.Between(-60, 60), 50, width - 50);
        let targetY = Phaser.Math.Clamp(sprite.y + Phaser.Math.Between(-40, 40), sprite.speciesId === 'eagle' ? 20 : this.horizon + 20, sprite.speciesId === 'eagle' ? this.horizon - 40 : height - 40);

        // Turn around if walking into the river
        if (sprite.speciesId !== 'eagle' && !this.isSafeFromRiver(targetX)) {
            targetX = sprite.x + (sprite.x > width * 0.4 ? 40 : -40); // bounce away
        }

        // Flip sprite direction
        if (targetX < sprite.x) sprite.setFlipX(false);
        else if (targetX > sprite.x) sprite.setFlipX(true);

        this.tweens.add({ targets: sprite, x: targetX, y: targetY, duration: Phaser.Math.Between(2000, 3500), ease: 'Sine.easeInOut' });
      }
    });
  }

  runSimulationTick() {
    if (this.isPaused) return;
    const newState = this.simulation.tick();
    useUIStore.getState().syncSimulation(newState);
    this.handleOrganicPopulationFlow(newState.species);
  }

  handleOrganicPopulationFlow(speciesState) {
    const { width, height } = this.scale;
    
    // 1. Process Algae (River Eutrophication)
    const algaeData = speciesState.producers.algae;
    this.targetAlgaeHealth = Math.min(1, algaeData.population / algaeData.carryingCapacity);

    // 2. Process physical species
    for (const level of Object.keys(speciesState)) {
      for (const [id, data] of Object.entries(speciesState[level])) {
        if (id === 'algae') continue;

        const group = this.entityGroups[id];
        if (!group) continue;

        const targetVisualCount = Math.floor(data.population / data.visualScale);
        const activeSprites = group.getChildren().filter(s => s.active);
        const currentVisualCount = activeSprites.length;

        if (targetVisualCount > currentVisualCount) { 
          // BIRTHS: Spawn near parents
          const numToSpawn = targetVisualCount - currentVisualCount;
          for (let i = 0; i < numToSpawn; i++) {
            let spawnX, spawnY;
            if (activeSprites.length > 0) {
              const p = Phaser.Utils.Array.GetRandom(activeSprites);
              spawnX = Phaser.Math.Clamp(p.x + Phaser.Math.Between(-40, 40), 20, width - 20);
              spawnY = Phaser.Math.Clamp(p.y + Phaser.Math.Between(-40, 40), id === 'eagle' ? 20 : this.horizon + 20, id === 'eagle' ? this.horizon - 40 : height - 20);
              if (id !== 'eagle' && !this.isSafeFromRiver(spawnX)) spawnX = p.x; // Abort bad birth location
            } else {
              const safe = this.getSafeSpawnPoint(id === 'eagle');
              spawnX = safe.x; spawnY = safe.y;
            }
            this.spawnSprite(id, data, spawnX, spawnY);
          }
        } 
        else if (targetVisualCount < currentVisualCount) { 
          // DEATHS: Smooth fade to soil
          const doomed = Phaser.Utils.Array.Shuffle(activeSprites).slice(0, currentVisualCount - targetVisualCount);
          doomed.forEach(sprite => {
            sprite.active = false; 
            this.tweens.add({ targets: sprite, alpha: 0, scale: 0.5, duration: 1500, onComplete: () => group.remove(sprite, true, true) });
          });
        }
      }
    }
  }

  drawRiver() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Smoothly transition river color based on Algae health
    this.currentAlgaeHealth += (this.targetAlgaeHealth - this.currentAlgaeHealth) * 0.05;
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(0x3498db), // Healthy Blue
        Phaser.Display.Color.ValueToColor(0x2d4c1e), // Algae Swamp Green
        100, this.currentAlgaeHealth * 100
    );

    this.riverGraphics.clear();
    this.riverGraphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
    this.riverGraphics.beginPath();
    
    // Starts narrow at the mountain valley
    this.riverGraphics.moveTo(w * 0.44, this.horizon);

    // Left Edge Curve
    const leftCurve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.44, this.horizon),
      new Phaser.Math.Vector2(w * 0.35, h * 0.75),
      new Phaser.Math.Vector2(w * 0.15, h) // Flows to bottom left
    );
    leftCurve.getPoints(24).forEach(p => this.riverGraphics.lineTo(p.x, p.y));

    // Right Edge Curve
    this.riverGraphics.lineTo(w * 0.35, h); // Width of river at bottom
    const rightCurve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.35, h),
      new Phaser.Math.Vector2(w * 0.45, h * 0.75),
      new Phaser.Math.Vector2(w * 0.46, this.horizon) // Width of river at source
    );
    rightCurve.getPoints(24).forEach(p => this.riverGraphics.lineTo(p.x, p.y));

    this.riverGraphics.fillPath();
  }

  update(time, delta) {
    if (this.isPaused) return;
    const { width, height } = this.scale;
    
    // Time & River
    this.timeOfDay = (this.timeOfDay + (delta * 0.0005 * this.simSpeed)) % 24;
    const isDay = this.timeOfDay >= 6 && this.timeOfDay <= 18;
    this.drawRiver(); // Redraws to handle algae color changes
    
    // Clouds
    this.clouds.forEach(c => {
        c.x += (c.speed * delta * 0.001 * this.simSpeed);
        if (c.x > width + 100) { c.x = -100; c.y = Phaser.Math.Between(20, this.horizon - 50); }
    });

    // Sky Gradient
    this.skyGraphics.clear();
    const skyTop = isDay ? 0x87CEEB : 0x0B0C10;
    const skyBot = isDay ? 0xb8e4b8 : 0x1f2833;
    this.skyGraphics.fillGradientStyle(skyTop, skyTop, skyBot, skyBot, 1);
    this.skyGraphics.fillRect(0, 0, width, this.horizon);

    // Celestial Bodies
    if (isDay) {
        const dayProgress = (this.timeOfDay - 6) / 12;
        this.sun.x = width * dayProgress;
        this.sun.y = this.horizon - Math.sin(dayProgress * Math.PI) * (this.horizon * 0.8);
        this.sun.setVisible(true); this.moon.setVisible(false); this.stars.setAlpha(0);
    } else {
        const nightProgress = (this.timeOfDay >= 18 ? this.timeOfDay - 18 : this.timeOfDay + 6) / 12;
        this.moon.x = width * nightProgress;
        this.moon.y = this.horizon - Math.sin(nightProgress * Math.PI) * (this.horizon * 0.8);
        this.moon.setVisible(true); this.sun.setVisible(false);
        this.stars.setAlpha(Math.sin(nightProgress * Math.PI)); 
    }

    // Global Darkness Overlay (Automatically darkens ground, river, animals, mountains)
    this.nightOverlay.setAlpha(Phaser.Math.Linear(this.nightOverlay.alpha, isDay ? 0 : 0.55, 0.05));
  }
}

// ============================================================================
// PART 5: REACT-PHASER MOUNTING BRIDGE
// ============================================================================
const PhaserGameContainer = () => {
  useEffect(() => {
    const config = {
      type: Phaser.WEBGL,
      parent: 'phaser-root',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [MainEcosystemScene],
      backgroundColor: '#1a1a2e',
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="phaser-root" className="absolute inset-0 z-0" />;
};

// ============================================================================
// PART 6: REACT UI OVERLAYS (Tailwind + Framer Motion)
// ============================================================================
const ControlBar = () => {
  const { isRunning, simulationSpeed, toggleRunning, setSpeed, ecosystemHealth, togglePanel } = useUIStore();
  return (
    <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-md border-t border-white/20 z-20">
      <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={toggleRunning} className="px-4 py-2 bg-emerald-600 rounded-lg font-bold text-white hover:bg-emerald-700">
            {isRunning ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <select value={simulationSpeed} onChange={e => setSpeed(Number(e.target.value))} className="px-3 py-2 bg-gray-700 rounded-lg text-white font-bold outline-none border border-gray-600">
            <option value={0.5}>0.5x Speed</option>
            <option value={1}>1x Speed</option>
            <option value={2}>2x Speed</option>
            <option value={5}>5x Speed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3 text-white font-bold hidden md:flex">
          <div>Ecosystem Health: {Math.round(ecosystemHealth)}%</div>
          <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${ecosystemHealth > 60 ? 'bg-green-500' : ecosystemHealth > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${ecosystemHealth}%` }} />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => togglePanel('events')} className="px-4 py-2 bg-gray-600 rounded-lg font-bold text-white hover:bg-gray-500 shadow-lg">📋 Log</button>
          <button onClick={() => togglePanel('dashboard')} className="px-4 py-2 bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-700 shadow-lg">📊 Stats</button>
          <button onClick={() => togglePanel('interventions')} className="px-4 py-2 bg-purple-600 rounded-lg font-bold text-white hover:bg-purple-700 shadow-lg">🎮 Intervene</button>
        </div>
      </div>
    </div>
  );
};

const EventFeed = () => {
    const { events, clearEvents, togglePanel } = useUIStore();
    return (
      <motion.div initial={{ y: 400, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 400, opacity: 0 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[500px] max-w-[90vw] bg-black/85 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-20 overflow-hidden">
        <div className="p-3 border-b border-white/20 flex justify-between items-center bg-black/50">
          <h2 className="font-bold text-gray-200">📋 Ecosystem Event Log</h2>
          <div className="flex gap-2">
            <button onClick={clearEvents} className="text-xs text-gray-400 hover:text-white">Clear</button>
            <button onClick={() => togglePanel('events')} className="text-gray-400 hover:text-white">✕</button>
          </div>
        </div>
        <div className="h-64 overflow-y-auto p-2 space-y-1">
          {events.length === 0 ? (
            <div className="text-center text-gray-400 p-8"><div className="text-4xl mb-2">🌿</div><p>No events yet.</p></div>
          ) : (
            events.map(event => (
              <div key={event.id} className="text-xs p-2 rounded border-l-4 border-gray-500 bg-gray-900/40 text-gray-200">
                <p>{event.message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{event.time.toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    );
};

const InterventionsPanel = () => {
  const trigger = useUIStore(state => state.triggerIntervention);
  return (
    <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
      className="absolute right-4 top-4 bottom-20 w-80 bg-black/85 backdrop-blur-md rounded-xl p-4 border border-white/20 z-20 shadow-2xl overflow-y-auto custom-scrollbar">
      <h2 className="text-purple-400 font-bold mb-4 border-b border-white/20 pb-2 flex items-center gap-2"><span>⚙️</span> Controls</h2>
      <div className="space-y-3">
        <button onClick={() => trigger('nutrients')} className="w-full text-left p-3 rounded-lg bg-green-900/50 border border-green-500/30 hover:bg-green-800/80 transition">
          <div className="text-white font-bold text-sm">🌱 Add Fertilizer</div><div className="text-gray-400 text-xs mt-1">Causes eutrophication in river</div>
        </button>
        <button onClick={() => trigger('predator')} className="w-full text-left p-3 rounded-lg bg-orange-900/50 border border-orange-500/30 hover:bg-orange-800/80 transition">
          <div className="text-white font-bold text-sm">🐺 Introduce Apex Predators</div><div className="text-gray-400 text-xs mt-1">Controls herbivore overpopulation</div>
        </button>
        <button onClick={() => trigger('disease')} className="w-full text-left p-3 rounded-lg bg-red-900/50 border border-red-500/30 hover:bg-red-800/80 transition">
          <div className="text-white font-bold text-sm">🦠 Introduce Virus</div><div className="text-gray-400 text-xs mt-1">Culls primary consumer population</div>
        </button>
      </div>
    </motion.div>
  );
};

const StatsDashboard = () => {
  const speciesData = useUIStore(state => state.speciesData);
  const producers = Object.values(speciesData.producers).reduce((a, b) => a + b.population, 0);
  const consumers = Object.values(speciesData.primaryConsumers).reduce((a, b) => a + b.population, 0);
  const secondary = Object.values(speciesData.secondaryConsumers).reduce((a, b) => a + b.population, 0);
  const apex = Object.values(speciesData.apexPredators).reduce((a, b) => a + b.population, 0);

  return (
    <motion.div initial={{ x: -400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -400, opacity: 0 }}
      className="absolute left-4 top-4 w-72 bg-black/85 backdrop-blur-md rounded-xl p-4 border border-white/20 z-20 shadow-2xl">
      <h2 className="text-blue-400 font-bold mb-4 border-b border-white/20 pb-2">Population Tiers</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-green-300 font-bold mb-1"><span>Producers</span> <span>{Math.round(producers)}</span></div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${Math.min(100, producers/20000 * 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-yellow-300 font-bold mb-1"><span>Herbivores</span> <span>{Math.round(consumers)}</span></div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: `${Math.min(100, consumers/5000 * 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-orange-300 font-bold mb-1"><span>Secondary Consumers</span> <span>{Math.round(secondary)}</span></div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-orange-500" style={{ width: `${Math.min(100, secondary/1000 * 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-red-300 font-bold mb-1"><span>Apex Predators</span> <span>{Math.round(apex)}</span></div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${Math.min(100, apex/200 * 100)}%` }} /></div>
        </div>
      </div>
    </motion.div>
  );
}

const SpeciesModal = () => {
  const { selectedSpecies, setSelectedSpecies } = useUIStore();
  if (!selectedSpecies) return null;

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelectedSpecies(null)}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}
        className="bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden border border-white/20 shadow-2xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 text-center text-white relative">
          <div className="text-7xl mb-2 filter drop-shadow-lg">{selectedSpecies.icon}</div>
          <h2 className="text-3xl font-bold">{selectedSpecies.name}</h2>
          <button onClick={() => setSelectedSpecies(null)} className="absolute top-3 right-4 text-white/50 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4 bg-gray-900">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2 text-gray-300">
            <span>Current Population:</span><span className="text-white font-bold text-lg">{Math.round(selectedSpecies.population).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2 text-gray-300">
            <span>Carrying Capacity:</span><span className="text-white font-bold text-lg">{selectedSpecies.carryingCapacity.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>Trophic Level:</span><span className="text-white font-bold text-lg bg-gray-700 px-3 rounded-full">{selectedSpecies.trophicLevel}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ToastNotifications = () => {
  const notifications = useUIStore(state => state.notifications);
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div key={n.id} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="bg-green-900 text-white px-6 py-3 rounded-full shadow-2xl border border-green-500/50 font-bold text-sm tracking-wide">
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// PART 7: ROOT COMPONENT
// ============================================================================
export default function EcoBalanceGame() {
  const activePanel = useUIStore(state => state.activePanel);
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
      <PhaserGameContainer />
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="pointer-events-auto h-full w-full">
          <ToastNotifications />
          <AnimatePresence>
            {activePanel === 'interventions' && <InterventionsPanel />}
            {activePanel === 'dashboard' && <StatsDashboard />}
            {activePanel === 'events' && <EventFeed />}
          </AnimatePresence>
          <SpeciesModal />
          <ControlBar />
        </div>
      </div>
    </div>
  );
}