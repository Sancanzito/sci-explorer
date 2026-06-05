// games/EcoBalance/EcoBalanceGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import Phaser from 'phaser';
import './EcoBalance.css';

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
    grass: { id: 'grass', name: 'Vegetation', population: 8000, carryingCapacity: 10000, growthRate: 0.03, mortalityRate: 0.01, trophicLevel: 1, icon: '🌳', visualScale: 250 },
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

// Natural, cohesive palette
const PALETTE = {
  skyDayTop: 0x7ec0ee, skyDayBot: 0xd6efc7,
  skyDuskTop: 0xf6a07a, skyDuskBot: 0xfcd9a8,
  skyNightTop: 0x0a1026, skyNightBot: 0x232a3d,
  mountainFar: 0x6a8a78, mountainNear: 0x4a6a55,
  groundTop: 0x7cb15a, groundBot: 0x4e8438,
  riverHealthy: 0x4aa3d4, riverSick: 0x5a6e2e
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
    events: [{ id: Date.now() + Math.random(), message, type, time: new Date() }, ...state.events].slice(0, 50)
  })),

  addNotification: (message, type) => {
    const id = Date.now() + Math.random();
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
          if (pct > 0 && pct < 200) useUIStore.getState().logEvent(`${data.name} population grew by ${pct}%`, 'growth');
          else if (pct < 0) useUIStore.getState().logEvent(`${data.name} population declined by ${Math.abs(pct)}%`, 'decline');
        }

        data.population = newPop;
        if (data.population / data.carryingCapacity < 0.15) endangeredCount++;
      }
    }

    this.health = Math.max(0, 100 - (endangeredCount * 15));
    return { species: this.species, health: this.health, timeStep: this.timeStep };
  }

  applyIntervention(type) {
    switch (type) {
      case 'nutrients':
        this.species.producers.grass.population *= 1.5;
        this.species.producers.algae.population *= 2.5;
        return "Nutrients added — algae and vegetation blooming!";
      case 'predator':
        this.species.apexPredators.wolf.population *= 1.5;
        return "Wolves introduced — apex pressure increased!";
      case 'toxins':
        this.environment.toxicity += 0.05;
        return "Toxins introduced — mortality rates rising!";
      case 'disease':
        this.species.primaryConsumers.rabbit.population *= 0.4;
        this.species.primaryConsumers.deer.population *= 0.4;
        return "Viral outbreak — herbivore populations plummeted!";
      case 'rain-up':
        this.environment.rainfall = 1.3;
        return "Rainfall increased — carrying capacity boosted!";
      case 'rain-down':
        this.environment.rainfall = 0.6;
        return "Drought — carrying capacity reduced!";
      default: return "Intervention applied.";
    }
  }
}

// ============================================================================
// PART 4: PHASER ENGINE (POLISHED WORLD & ORGANIC AI)
// ============================================================================
class MainEcosystemScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainEcosystemScene' });
    this.simulation = new EcosystemSimulation();
    this.entityGroups = {};
    this.isPaused = false;
    this.simSpeed = 1;
    this.timeOfDay = 12;
    this.currentAlgaeHealth = 0.1;
    this.targetAlgaeHealth = 0.1;
  }

  create() {
    const { width, height } = this.scale;
    this.horizon = height * 0.55;

    this.createProceduralTextures();

    // --- SKY ---
    this.skyGraphics = this.add.graphics();

    // --- STARS ---
    this.stars = this.add.graphics();
    this.stars.fillStyle(0xffffff, 0.9);
    for (let i = 0; i < 160; i++) {
      this.stars.fillCircle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, this.horizon), Math.random() * 1.4 + 0.3);
    }
    this.stars.setAlpha(0);

    // --- SUN / MOON (with soft glow) ---
    this.sunGlow = this.add.circle(0, 0, 80, 0xffe9a8, 0.25);
    this.sun = this.add.circle(0, 0, 42, 0xffe066);
    this.moonGlow = this.add.circle(0, 0, 60, 0xdfe7ff, 0.18);
    this.moon = this.add.circle(0, 0, 32, 0xf4f6f0);

    // --- CLOUDS ---
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      let c = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(30, this.horizon - 70), 'cloud');
      c.scale = Phaser.Math.FloatBetween(0.6, 1.3);
      c.speed = Phaser.Math.FloatBetween(8, 22);
      c.setAlpha(0.85);
      this.clouds.push(c);
    }

    // --- MOUNTAINS (two layers for depth) ---
    this.mountainsFar = this.add.graphics();
    this.mountainsFar.fillStyle(PALETTE.mountainFar, 1);
    this.mountainsFar.beginPath();
    this.mountainsFar.moveTo(0, this.horizon);
    this.mountainsFar.lineTo(width * 0.15, this.horizon - 90);
    this.mountainsFar.lineTo(width * 0.35, this.horizon - 40);
    this.mountainsFar.lineTo(width * 0.6, this.horizon - 110);
    this.mountainsFar.lineTo(width * 0.85, this.horizon - 55);
    this.mountainsFar.lineTo(width, this.horizon - 95);
    this.mountainsFar.lineTo(width, this.horizon);
    this.mountainsFar.fillPath();

    this.mountains = this.add.graphics();
    this.mountains.fillStyle(PALETTE.mountainNear, 1);
    this.mountains.beginPath();
    this.mountains.moveTo(0, this.horizon);
    this.mountains.lineTo(width * 0.2, this.horizon - 130);
    this.mountains.lineTo(width * 0.45, this.horizon - 65);
    this.mountains.lineTo(width * 0.7, this.horizon - 160);
    this.mountains.lineTo(width, this.horizon - 100);
    this.mountains.lineTo(width, this.horizon);
    this.mountains.fillPath();
    // snow caps
    this.mountains.fillStyle(0xeaf2ee, 0.9);
    this.mountains.fillTriangle(width * 0.2, this.horizon - 130, width * 0.16, this.horizon - 100, width * 0.24, this.horizon - 100);
    this.mountains.fillTriangle(width * 0.7, this.horizon - 160, width * 0.65, this.horizon - 125, width * 0.75, this.horizon - 125);

    // --- GROUND (gradient + soft top edge) ---
    this.groundGraphics = this.add.graphics();
    this.groundGraphics.fillGradientStyle(PALETTE.groundTop, PALETTE.groundTop, PALETTE.groundBot, PALETTE.groundBot, 1);
    this.groundGraphics.fillRect(0, this.horizon, width, height - this.horizon);
    // grass texture flecks
    this.groundGraphics.fillStyle(0x8fc468, 0.4);
    for (let i = 0; i < 400; i++) {
      const gx = Phaser.Math.Between(0, width);
      const gy = Phaser.Math.Between(this.horizon, height);
      this.groundGraphics.fillRect(gx, gy, 2, Phaser.Math.Between(3, 7));
    }

    // --- RIVER ---
    this.riverGraphics = this.add.graphics();

    // --- NIGHT OVERLAY ---
    this.nightOverlay = this.add.rectangle(0, 0, width, height, 0x0a1430)
      .setOrigin(0, 0).setBlendMode(Phaser.BlendModes.MULTIPLY).setAlpha(0);

    // --- POPULATIONS ---
    this.initializeEntityPools();

    // --- TICK LOOP ---
    this.simTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.runSimulationTick() });

    this._onPause = (e) => (this.isPaused = e.detail);
    this._onSpeed = (e) => { this.simSpeed = e.detail; this.simTimer.delay = 1000 / this.simSpeed; };
    this._onIntervene = (e) => {
      const msg = this.simulation.applyIntervention(e.detail);
      useUIStore.getState().logEvent(msg, 'intervention');
      useUIStore.getState().addNotification(msg, 'success');
    };
    window.addEventListener('eco-toggle-pause', this._onPause);
    window.addEventListener('eco-set-speed', this._onSpeed);
    window.addEventListener('eco-intervention', this._onIntervene);

    this.events.on('shutdown', () => {
      window.removeEventListener('eco-toggle-pause', this._onPause);
      window.removeEventListener('eco-set-speed', this._onSpeed);
      window.removeEventListener('eco-intervention', this._onIntervene);
    });
  }

  // -------- POLISHED PROCEDURAL ART --------
  createProceduralTextures() {
    const g = this.make.graphics();
    const OUTLINE = 0x2a3a28;

    // ----- TREE -----
    g.fillStyle(0x6b4a2b); g.fillRoundedRect(13, 22, 6, 16, 2);            // trunk
    g.fillStyle(0x3f8f3a); g.fillCircle(16, 14, 13);                       // back foliage
    g.fillStyle(0x57b04a); g.fillCircle(11, 12, 9);                        // mid
    g.fillStyle(0x6fc95e); g.fillCircle(20, 11, 8);                        // highlight
    g.fillStyle(0x8ada76); g.fillCircle(14, 8, 4);                         // top light
    g.generateTexture('grass', 32, 40); g.clear();

    // ----- RABBIT -----
    g.fillStyle(0xe8e4dc); g.fillEllipse(13, 16, 16, 12);                  // body
    g.fillStyle(0xf2efe9); g.fillCircle(20, 12, 6);                        // head
    g.fillStyle(0xe8e4dc); g.fillEllipse(18, 4, 3, 8); g.fillEllipse(22, 4, 3, 8); // ears
    g.fillStyle(0xffc0cb); g.fillEllipse(18, 4, 1.4, 5); g.fillEllipse(22, 4, 1.4, 5); // inner ear
    g.fillStyle(0xffffff); g.fillCircle(6, 16, 4);                         // tail
    g.fillStyle(0x222222); g.fillCircle(22, 11, 1.4);                      // eye
    g.generateTexture('rabbit', 28, 24); g.clear();

    // ----- DEER -----
    g.fillStyle(0xa9743f); g.fillRoundedRect(4, 12, 22, 12, 5);           // body
    g.fillStyle(0x8a5d30); g.fillRect(6, 22, 3, 8); g.fillRect(20, 22, 3, 8); // legs
    g.fillStyle(0xb98a52); g.fillCircle(26, 9, 6);                         // head
    g.fillStyle(0x6b4a28); g.fillRect(24, 0, 1.6, 6); g.fillRect(28, 0, 1.6, 6); // antlers
    g.fillStyle(0xf0e6d2); g.fillCircle(8, 16, 1.6); g.fillCircle(13, 18, 1.6); // spots
    g.fillStyle(0x222222); g.fillCircle(28, 8, 1.4);                       // eye
    g.generateTexture('deer', 34, 32); g.clear();

    // ----- FOX -----
    g.fillStyle(0xe07b34); g.fillEllipse(12, 14, 16, 9);                   // body
    g.fillStyle(0xf08f44); g.fillCircle(19, 11, 6);                        // head
    g.fillStyle(0xc25e20); g.fillTriangle(15, 8, 17, 2, 19, 8);            // ear
    g.fillStyle(0xc25e20); g.fillTriangle(20, 8, 22, 2, 24, 8);            // ear
    g.fillStyle(0xf5f1ea); g.fillEllipse(3, 15, 6, 4);                     // tail tip
    g.fillStyle(0xe07b34); g.fillEllipse(7, 14, 8, 5);                     // tail
    g.fillStyle(0x222222); g.fillCircle(21, 10, 1.3);                      // eye
    g.generateTexture('fox', 26, 22); g.clear();

    // ----- SNAKE -----
    g.lineStyle(5, 0x5a8f3a); 
    g.beginPath(); g.moveTo(2, 14); g.lineTo(8, 6); g.lineTo(15, 16); g.lineTo(22, 8); g.strokePath();
    g.fillStyle(0x6fae47); g.fillCircle(22, 8, 3.5);                       // head
    g.fillStyle(0x222222); g.fillCircle(23, 7, 1);                         // eye
    g.fillStyle(0xc0392b); g.fillTriangle(25, 8, 28, 6, 28, 10);          // tongue
    g.generateTexture('snake', 30, 22); g.clear();

    // ----- WOLF -----
    g.fillStyle(0x6b7280); g.fillRoundedRect(3, 10, 22, 12, 5);           // body
    g.fillStyle(0x565d68); g.fillRect(5, 20, 3, 7); g.fillRect(20, 20, 3, 7); // legs
    g.fillStyle(0x7b828d); g.fillCircle(25, 9, 6);                         // head
    g.fillStyle(0x565d68); g.fillTriangle(22, 5, 23, 0, 26, 5);           // ear
    g.fillStyle(0x565d68); g.fillTriangle(26, 5, 28, 0, 30, 5);           // ear
    g.fillStyle(0xeeeeee); g.fillTriangle(8, 12, 3, 16, 8, 18);           // bushy tail
    g.fillStyle(0xffd24a); g.fillCircle(27, 8, 1.3);                       // eye
    g.generateTexture('wolf', 34, 30); g.clear();

    // ----- EAGLE -----
    g.fillStyle(0x5b3a22); g.fillEllipse(16, 12, 8, 10);                   // body
    g.fillStyle(0x4a2f1b); g.fillTriangle(2, 14, 14, 8, 14, 16);          // left wing
    g.fillStyle(0x4a2f1b); g.fillTriangle(30, 14, 18, 8, 18, 16);         // right wing
    g.fillStyle(0xf4f1ea); g.fillCircle(16, 6, 4);                        // white head
    g.fillStyle(0xf5a623); g.fillTriangle(16, 6, 19, 7, 16, 9);           // beak
    g.fillStyle(0x222222); g.fillCircle(17, 5, 1);                        // eye
    g.generateTexture('eagle', 32, 22); g.clear();

    // ----- CLOUD (soft) -----
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(24, 26, 20); g.fillCircle(52, 22, 26); g.fillCircle(82, 28, 18); g.fillCircle(64, 34, 20);
    g.fillStyle(0xeef4ff, 0.9); g.fillCircle(40, 34, 22);
    g.generateTexture('cloud', 104, 56); g.clear();

    // ----- SHADOW (soft ellipse under creatures) -----
    g.fillStyle(0x000000, 0.18); g.fillEllipse(16, 6, 30, 10);
    g.generateTexture('shadow', 32, 14); g.clear();

    g.destroy();
  }

  isSafeFromRiver(x) {
    const w = this.scale.width;
    return x < w * 0.15 || x > w * 0.55;
  }

  getSafeSpawnPoint(isEagle) {
    const { width, height } = this.scale;
    let x, y, safe = false, attempts = 0;
    while (!safe && attempts < 20) {
      x = Phaser.Math.Between(20, width - 20);
      y = isEagle ? Phaser.Math.Between(20, this.horizon - 40) : Phaser.Math.Between(this.horizon + 20, height - 20);
      if (isEagle || this.isSafeFromRiver(x)) safe = true;
      attempts++;
    }
    return { x, y };
  }

  initializeEntityPools() {
    for (const level of Object.keys(INITIAL_SPECIES)) {
      for (const [id, data] of Object.entries(INITIAL_SPECIES[level])) {
        if (id === 'algae') continue;
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
    const isAir = id === 'eagle';
    // depth-sort by Y so creatures lower on screen render in front
    const container = this.add.container(x, y).setDepth(y).setAlpha(0);

    // soft shadow (not for plants/eagle)
    if (!isAir && data.trophicLevel > 1) {
      const shadow = this.add.image(0, data.trophicLevel > 1 ? 14 : 0, 'shadow').setScale(0.7, 0.6);
      container.add(shadow);
    }

    const sprite = this.add.image(0, 0, id).setOrigin(0.5);
    container.add(sprite);
    container.sprite = sprite;
    container.speciesId = id;

    container.setSize(sprite.width, sprite.height);
    container.setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: container, alpha: 1, duration: 800 });

    container.on('pointerdown', () => {
      const flatData = {};
      for (const lvl of Object.keys(this.simulation.species)) Object.assign(flatData, this.simulation.species[lvl]);
      useUIStore.getState().setSelectedSpecies(flatData[id]);
      // little bounce on tap
      this.tweens.add({ targets: container, scale: 1.25, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
    });

    if (data.trophicLevel > 1) {
      // gentle idle bob
      this.tweens.add({ targets: sprite, y: -3, duration: Phaser.Math.Between(900, 1500), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.assignWanderAI(container);
    } else {
      // plants sway
      sprite.setOrigin(0.5, 1);
      container.y = y; sprite.y = sprite.height / 2;
      this.tweens.add({ targets: sprite, angle: Phaser.Math.Between(-4, 4), duration: Phaser.Math.Between(2200, 4000), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    this.entityGroups[id].add(container);
    return container;
  }

  assignWanderAI(container) {
    const { width, height } = this.scale;
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000),
      loop: true,
      callback: () => {
        if (this.isPaused || !container.active) return;
        const isAir = container.speciesId === 'eagle';
        let targetX = Phaser.Math.Clamp(container.x + Phaser.Math.Between(-70, 70), 50, width - 50);
        let targetY = Phaser.Math.Clamp(container.y + Phaser.Math.Between(-45, 45),
          isAir ? 20 : this.horizon + 20, isAir ? this.horizon - 40 : height - 30);

        if (!isAir && !this.isSafeFromRiver(targetX)) {
          targetX = container.x + (container.x > width * 0.4 ? 50 : -50);
        }

        if (container.sprite) {
          if (targetX < container.x) container.sprite.setFlipX(true);
          else if (targetX > container.x) container.sprite.setFlipX(false);
        }

        this.tweens.add({
          targets: container, x: targetX, y: targetY,
          duration: Phaser.Math.Between(2200, 3600), ease: 'Sine.easeInOut',
          onUpdate: () => container.setDepth(container.y)
        });
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
    const algaeData = speciesState.producers.algae;
    this.targetAlgaeHealth = Math.min(1, algaeData.population / algaeData.carryingCapacity);

    for (const level of Object.keys(speciesState)) {
      for (const [id, data] of Object.entries(speciesState[level])) {
        if (id === 'algae') continue;
        const group = this.entityGroups[id];
        if (!group) continue;

        const targetVisualCount = Math.floor(data.population / data.visualScale);
        const activeSprites = group.getChildren().filter(s => s.active);
        const currentVisualCount = activeSprites.length;

        if (targetVisualCount > currentVisualCount) {
          const numToSpawn = targetVisualCount - currentVisualCount;
          for (let i = 0; i < numToSpawn; i++) {
            let spawnX, spawnY;
            if (activeSprites.length > 0) {
              const p = Phaser.Utils.Array.GetRandom(activeSprites);
              spawnX = Phaser.Math.Clamp(p.x + Phaser.Math.Between(-40, 40), 20, width - 20);
              spawnY = Phaser.Math.Clamp(p.y + Phaser.Math.Between(-40, 40), id === 'eagle' ? 20 : this.horizon + 20, id === 'eagle' ? this.horizon - 40 : height - 20);
              if (id !== 'eagle' && !this.isSafeFromRiver(spawnX)) spawnX = p.x;
            } else {
              const safe = this.getSafeSpawnPoint(id === 'eagle');
              spawnX = safe.x; spawnY = safe.y;
            }
            this.spawnSprite(id, data, spawnX, spawnY);
          }
        } else if (targetVisualCount < currentVisualCount) {
          const doomed = Phaser.Utils.Array.Shuffle(activeSprites).slice(0, currentVisualCount - targetVisualCount);
          doomed.forEach(container => {
            container.active = false;
            this.tweens.add({ targets: container, alpha: 0, scale: 0.4, duration: 1500, ease: 'Quad.easeIn', onComplete: () => group.remove(container, true, true) });
          });
        }
      }
    }
  }

  drawRiver() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.currentAlgaeHealth += (this.targetAlgaeHealth - this.currentAlgaeHealth) * 0.05;
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(PALETTE.riverHealthy),
      Phaser.Display.Color.ValueToColor(PALETTE.riverSick),
      100, this.currentAlgaeHealth * 100
    );
    const riverColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

    this.riverGraphics.clear();

    // bank/outline
    this.riverGraphics.fillStyle(0x3a5a3a, 0.5);
    this._riverPath(w, h, 6);
    this.riverGraphics.fillPath();

    // water
    this.riverGraphics.fillStyle(riverColor, 1);
    this._riverPath(w, h, 0);
    this.riverGraphics.fillPath();

    // subtle highlight ribbon
    this.riverGraphics.fillStyle(0xffffff, 0.10);
    this.riverGraphics.beginPath();
    const hl = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.45, this.horizon),
      new Phaser.Math.Vector2(w * 0.38, h * 0.75),
      new Phaser.Math.Vector2(w * 0.22, h)
    );
    hl.getPoints(20).forEach((p, i) => i === 0 ? this.riverGraphics.moveTo(p.x, p.y) : this.riverGraphics.lineTo(p.x, p.y));
    this.riverGraphics.lineTo(w * 0.26, h);
    const hl2 = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.26, h),
      new Phaser.Math.Vector2(w * 0.41, h * 0.75),
      new Phaser.Math.Vector2(w * 0.455, this.horizon)
    );
    hl2.getPoints(20).forEach(p => this.riverGraphics.lineTo(p.x, p.y));
    this.riverGraphics.fillPath();
  }

  _riverPath(w, h, pad) {
    this.riverGraphics.beginPath();
    this.riverGraphics.moveTo(w * 0.44 - pad, this.horizon);
    const leftCurve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.44 - pad, this.horizon),
      new Phaser.Math.Vector2(w * 0.35 - pad, h * 0.75),
      new Phaser.Math.Vector2(w * 0.15 - pad, h)
    );
    leftCurve.getPoints(24).forEach(p => this.riverGraphics.lineTo(p.x, p.y));
    this.riverGraphics.lineTo(w * 0.35 + pad, h);
    const rightCurve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(w * 0.35 + pad, h),
      new Phaser.Math.Vector2(w * 0.45 + pad, h * 0.75),
      new Phaser.Math.Vector2(w * 0.46 + pad, this.horizon)
    );
    rightCurve.getPoints(24).forEach(p => this.riverGraphics.lineTo(p.x, p.y));
  }

  update(time, delta) {
    if (this.isPaused) return;
    const { width, height } = this.scale;

    this.timeOfDay = (this.timeOfDay + (delta * 0.0005 * this.simSpeed)) % 24;
    const isDay = this.timeOfDay >= 6 && this.timeOfDay <= 18;
    const isDusk = (this.timeOfDay > 17 && this.timeOfDay <= 18) || (this.timeOfDay >= 6 && this.timeOfDay < 7);

    this.drawRiver();

    // Clouds
    this.clouds.forEach(c => {
      c.x += (c.speed * delta * 0.001 * this.simSpeed);
      if (c.x > width + 120) { c.x = -120; c.y = Phaser.Math.Between(30, this.horizon - 70); }
    });

    // Sky gradient (day / dusk / night blend)
    this.skyGraphics.clear();
    let top, bot;
    if (isDusk) { top = PALETTE.skyDuskTop; bot = PALETTE.skyDuskBot; }
    else if (isDay) { top = PALETTE.skyDayTop; bot = PALETTE.skyDayBot; }
    else { top = PALETTE.skyNightTop; bot = PALETTE.skyNightBot; }
    this.skyGraphics.fillGradientStyle(top, top, bot, bot, 1);
    this.skyGraphics.fillRect(0, 0, width, this.horizon);

    // Celestial bodies
    if (isDay) {
      const dayProgress = (this.timeOfDay - 6) / 12;
      const sx = width * dayProgress;
      const sy = this.horizon - Math.sin(dayProgress * Math.PI) * (this.horizon * 0.8);
      this.sun.setPosition(sx, sy).setVisible(true);
      this.sunGlow.setPosition(sx, sy).setVisible(true);
      this.moon.setVisible(false); this.moonGlow.setVisible(false);
      this.stars.setAlpha(0);
    } else {
      const nightProgress = (this.timeOfDay >= 18 ? this.timeOfDay - 18 : this.timeOfDay + 6) / 12;
      const mx = width * nightProgress;
      const my = this.horizon - Math.sin(nightProgress * Math.PI) * (this.horizon * 0.8);
      this.moon.setPosition(mx, my).setVisible(true);
      this.moonGlow.setPosition(mx, my).setVisible(true);
      this.sun.setVisible(false); this.sunGlow.setVisible(false);
      this.stars.setAlpha(Math.sin(nightProgress * Math.PI));
    }

    // Global night darkness
    this.nightOverlay.setAlpha(Phaser.Math.Linear(this.nightOverlay.alpha, isDay ? 0 : 0.5, 0.05));
  }
}

// ============================================================================
// PART 5: REACT-PHASER MOUNTING BRIDGE
// ============================================================================
const PhaserGameContainer = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-root',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [MainEcosystemScene],
      backgroundColor: '#0e1a14',
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="phaser-root" className="absolute inset-0 z-0" />;
};

// ============================================================================
// PART 6: REACT UI OVERLAYS
// ============================================================================
const ControlBar = () => {
  const { isRunning, simulationSpeed, toggleRunning, setSpeed, ecosystemHealth, togglePanel, timeStep, activePanel } = useUIStore();
  const healthColor = ecosystemHealth > 60 ? 'from-emerald-400 to-green-500' : ecosystemHealth > 30 ? 'from-amber-400 to-yellow-500' : 'from-rose-500 to-red-600';

  const Tab = ({ id, label, icon }) => (
    <button onClick={() => togglePanel(id)}
      className={`eco-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold text-sm border transition
        ${activePanel === id ? 'bg-white/15 border-white/30 text-white' : 'bg-white/5 border-white/10 text-emerald-100/80 hover:bg-white/10'}`}>
      <span>{icon}</span><span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="absolute bottom-0 w-full eco-glass border-t border-white/10 z-20">
      <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={toggleRunning}
            className="eco-btn flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-900/40">
            {isRunning ? '❚❚ Pause' : '► Play'}
          </button>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {[0.5, 1, 2, 5].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-3 py-2 text-sm font-bold transition ${simulationSpeed === s ? 'bg-emerald-500/80 text-white' : 'text-emerald-100/70 hover:bg-white/10'}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-white font-semibold">
          <span className="text-emerald-100/70 text-sm hidden lg:inline">Day {Math.floor(timeStep)}</span>
          <span className="text-sm hidden md:inline">Health</span>
          <div className="w-40 md:w-48 h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div className={`h-full bg-gradient-to-r ${healthColor} eco-shimmer transition-all duration-500`} style={{ width: `${ecosystemHealth}%` }} />
          </div>
          <span className="text-sm tabular-nums w-10 text-right">{Math.round(ecosystemHealth)}%</span>
        </div>

        <div className="flex gap-2">
          <Tab id="events" label="Log" icon="📋" />
          <Tab id="dashboard" label="Stats" icon="📊" />
          <Tab id="interventions" label="Tools" icon="🧪" />
        </div>
      </div>
    </div>
  );
};

const EventFeed = () => {
  const { events, clearEvents, togglePanel } = useUIStore();
  const styleFor = (type) => {
    if (type === 'growth') return 'border-emerald-400 bg-emerald-950/40';
    if (type === 'decline') return 'border-rose-400 bg-rose-950/40';
    if (type === 'intervention') return 'border-violet-400 bg-violet-950/40';
    return 'border-slate-500 bg-slate-900/40';
  };
  return (
    <motion.div initial={{ y: 420, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 420, opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[520px] max-w-[92vw] eco-glass rounded-2xl z-20 overflow-hidden">
      <div className="p-3.5 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-bold text-emerald-50 flex items-center gap-2">📋 Event Log</h2>
        <div className="flex gap-3 items-center">
          <button onClick={clearEvents} className="text-xs text-emerald-200/60 hover:text-white transition">Clear</button>
          <button onClick={() => togglePanel('events')} className="text-emerald-200/60 hover:text-white text-lg leading-none">✕</button>
        </div>
      </div>
      <div className="h-64 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-center text-emerald-100/40 p-10"><div className="text-4xl mb-2">🌱</div><p>The ecosystem is calm. No events yet.</p></div>
        ) : (
          events.map(event => (
            <div key={event.id} className={`text-xs p-2.5 rounded-lg border-l-4 text-emerald-50 ${styleFor(event.type)}`}>
              <p className="leading-snug">{event.message}</p>
              <p className="text-[10px] text-emerald-100/40 mt-0.5">{event.time.toLocaleTimeString()}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const InterventionsPanel = () => {
  const trigger = useUIStore(state => state.triggerIntervention);
  const tools = [
    { id: 'nutrients', icon: '🌱', title: 'Add Fertilizer', desc: 'Boosts plant & algae growth (risk: eutrophication)', accent: 'emerald' },
    { id: 'predator', icon: '🐺', title: 'Introduce Wolves', desc: 'Adds apex predators to curb overpopulation', accent: 'sky' },
    { id: 'disease', icon: '🦠', title: 'Release Virus', desc: 'Culls the herbivore population sharply', accent: 'rose' },
    { id: 'toxins', icon: '☠️', title: 'Add Toxins', desc: 'Raises mortality across all species', accent: 'amber' },
    { id: 'rain-up', icon: '💧', title: 'Increase Rainfall', desc: 'Expands plant carrying capacity', accent: 'cyan' },
    { id: 'rain-down', icon: '🌵', title: 'Trigger Drought', desc: 'Shrinks plant carrying capacity', accent: 'orange' },
  ];
  const accents = {
    emerald: 'hover:border-emerald-400/60 hover:bg-emerald-500/10',
    sky: 'hover:border-sky-400/60 hover:bg-sky-500/10',
    rose: 'hover:border-rose-400/60 hover:bg-rose-500/10',
    amber: 'hover:border-amber-400/60 hover:bg-amber-500/10',
    cyan: 'hover:border-cyan-400/60 hover:bg-cyan-500/10',
    orange: 'hover:border-orange-400/60 hover:bg-orange-500/10',
  };
  return (
    <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      className="absolute right-4 top-4 bottom-24 w-80 eco-glass rounded-2xl p-4 z-20 overflow-y-auto custom-scrollbar">
      <h2 className="text-emerald-300 font-bold mb-1 flex items-center gap-2 eco-title">🧪 Intervention Tools</h2>
      <p className="text-emerald-100/40 text-xs mb-4">Shape the ecosystem and watch it respond.</p>
      <div className="space-y-2.5">
        {tools.map(t => (
          <button key={t.id} onClick={() => trigger(t.id)}
            className={`eco-btn w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 transition ${accents[t.accent]}`}>
            <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-lg">{t.icon}</span>{t.title}</div>
            <div className="text-emerald-100/50 text-xs mt-1 leading-snug">{t.desc}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const StatsDashboard = () => {
  const speciesData = useUIStore(state => state.speciesData);
  const sum = (obj) => Object.values(obj).reduce((a, b) => a + b.population, 0);
  const tiers = [
    { label: 'Producers', val: sum(speciesData.producers), max: 20000, color: 'from-green-400 to-emerald-500', text: 'text-emerald-300' },
    { label: 'Herbivores', val: sum(speciesData.primaryConsumers), max: 5000, color: 'from-lime-400 to-yellow-500', text: 'text-lime-300' },
    { label: 'Carnivores', val: sum(speciesData.secondaryConsumers), max: 1000, color: 'from-amber-400 to-orange-500', text: 'text-amber-300' },
    { label: 'Apex Predators', val: sum(speciesData.apexPredators), max: 200, color: 'from-rose-400 to-red-500', text: 'text-rose-300' },
  ];
  return (
    <motion.div initial={{ x: -400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -400, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      className="absolute left-4 top-4 w-72 eco-glass rounded-2xl p-4 z-20">
      <h2 className="text-emerald-300 font-bold mb-1 eco-title">📊 Food Web</h2>
      <p className="text-emerald-100/40 text-xs mb-4">Population by trophic tier</p>
      <div className="space-y-4">
        {tiers.map(t => (
          <div key={t.label}>
            <div className={`flex justify-between text-xs font-bold mb-1.5 ${t.text}`}>
              <span>{t.label}</span><span className="tabular-nums text-white">{Math.round(t.val).toLocaleString()}</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div className={`h-full bg-gradient-to-r ${t.color} transition-all duration-500`} style={{ width: `${Math.min(100, t.val / t.max * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SpeciesModal = () => {
  const { selectedSpecies, setSelectedSpecies } = useUIStore();
  if (!selectedSpecies) return null;
  const ratio = selectedSpecies.population / selectedSpecies.carryingCapacity;
  const status = ratio < 0.15 ? { t: 'Endangered', c: 'text-rose-400' } : ratio > 0.85 ? { t: 'Overpopulated', c: 'text-amber-400' } : { t: 'Stable', c: 'text-emerald-400' };

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelectedSpecies(null)}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }} onClick={e => e.stopPropagation()}
        className="rounded-3xl w-full max-w-sm overflow-hidden border border-white/15 shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-600 to-green-800 p-6 text-center text-white relative">
          <div className="text-7xl mb-2 animate-float drop-shadow-lg">{selectedSpecies.icon}</div>
          <h2 className="text-3xl font-extrabold tracking-tight">{selectedSpecies.name}</h2>
          <span className={`text-sm font-bold ${status.c} bg-black/30 px-3 py-0.5 rounded-full inline-block mt-2`}>{status.t}</span>
          <button onClick={() => setSelectedSpecies(null)} className="absolute top-3 right-4 text-white/60 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4 bg-slate-900">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5 text-slate-300">
            <span>Population</span><span className="text-white font-bold text-lg tabular-nums">{Math.round(selectedSpecies.population).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5 text-slate-300">
            <span>Carrying Capacity</span><span className="text-white font-bold text-lg tabular-nums">{selectedSpecies.carryingCapacity.toLocaleString()}</span>
          </div>
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5"><span>Capacity Used</span><span className="text-white font-bold">{Math.round(ratio * 100)}%</span></div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500" style={{ width: `${Math.min(100, ratio * 100)}%` }} />
            </div>
          </div>
          <div className="flex justify-between items-center text-slate-300 pt-1">
            <span>Trophic Level</span><span className="text-white font-bold bg-white/10 px-3 py-0.5 rounded-full">Tier {selectedSpecies.trophicLevel}</span>
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
          <motion.div key={n.id} initial={{ y: -20, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0, scale: 0.9 }}
            className="eco-glass text-white px-6 py-3 rounded-full shadow-2xl border border-emerald-400/40 font-semibold text-sm tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />{n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const TitleBadge = () => (
  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
    <h1 className="eco-title text-white/90 font-extrabold text-lg md:text-xl tracking-wide">🌍 EcoBalance</h1>
    <p className="text-emerald-100/40 text-[11px] -mt-0.5">Tap any creature to inspect it</p>
  </div>
);

// ============================================================================
// PART 7: ROOT COMPONENT
// ============================================================================
export default function EcoBalanceGame() {
  const activePanel = useUIStore(state => state.activePanel);
  return (
    <div className="eco-game-root relative w-screen h-screen overflow-hidden bg-black select-none">
      <PhaserGameContainer />
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="pointer-events-auto h-full w-full">
          <TitleBadge />
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