import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useMicrobeStore } from './useMicrobeStore';

/* ── Polyfill for Phaser 4 missing UUID ── */
function uuid() {
  try { return crypto.randomUUID(); } catch (_) {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* ───────────────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────────────── */
const WORLD_W = 2400;
const WORLD_H = 1800;
const PLAYER_SPEED = 180;
const MICROBE_BASE_SPEED = 25;

/* ───────────────────────────────────────────────────────────────────
   Microbe species definitions (visual + metadata)
   12 total — 6 original + 6 new
   ─────────────────────────────────────────────────────────────────── */
const SPECIES = [
  // ── Tier 1 (0-20 pts) ──
  {
    key: 'cocci',    label: 'Staphylococcus aureus',   tier: 1,
    fill: 0x44dd44,  radius: 5,
    morph: 'Spherical (cocci), clustered',
    gram:  'Gram-positive',
    motil: 'Non-motile',
    disease: 'Skin infections, pneumonia',
    kingdom: 'Bacteria',
  },
  {
    key: 'bacilli',  label: 'Bacillus subtilis',        tier: 1,
    fill: 0x33bb33,  w: 14, h: 7,
    morph: 'Rod-shaped (bacilli), chains',
    gram:  'Gram-positive',
    motil: 'Motile (flagella)',
    disease: 'Rarely pathogenic',
    kingdom: 'Bacteria',
  },
  {
    key: 'ecoli',    label: 'Escherichia coli',         tier: 1,
    fill: 0x55cc55,  w: 16, h: 6,
    morph: 'Short rod (coccobacillus)',
    gram:  'Gram-negative',
    motil: 'Motile (peritrichous flagella)',
    disease: 'UTI, food poisoning',
    kingdom: 'Bacteria',
  },
  // ── Tier 2 (20-50 pts) ──
  {
    key: 'spirilla', label: 'Helicobacter pylori',      tier: 2,
    fill: 0x22aa44,  radius: 6,
    morph: 'Spiral (spirilla)',
    gram:  'Gram-negative',
    motil: 'Highly motile (flagella)',
    disease: 'Gastric ulcers',
    kingdom: 'Bacteria',
  },
  {
    key: 'fungi',    label: 'Candida albicans',         tier: 2,
    fill: 0xaa44cc,  radius: 7,
    morph: 'Oval yeast, pseudohyphae',
    gram:  'N/A (fungal)',
    motil: 'Non-motile',
    disease: 'Yeast infections',
    kingdom: 'Fungi',
  },
  {
    key: 'pseudomonas', label: 'Pseudomonas aeruginosa', tier: 2,
    fill: 0x55bb88,  w: 14, h: 6,
    morph: 'Slender rod, single polar flagellum',
    gram:  'Gram-negative',
    motil: 'Motile (single polar flagellum)',
    disease: 'Opportunistic infections, cystic fibrosis',
    kingdom: 'Bacteria',
  },
  {
    key: 'aspergillus', label: 'Aspergillus fumigatus',  tier: 2,
    fill: 0x88aa44,  radius: 8,
    morph: 'Filamentous hyphae, conidial head',
    gram:  'N/A (fungal)',
    motil: 'Non-motile',
    disease: 'Aspergillosis',
    kingdom: 'Fungi',
  },
  // ── Tier 3 (50+ pts) ──
  {
    key: 'giardia',  label: 'Giardia lamblia',          tier: 3,
    fill: 0x3388ff,  w: 10, h: 14,
    morph: 'Teardrop-shaped with flagella',
    gram:  'N/A (protozoan)',
    motil: 'Motile (flagella)',
    disease: 'Giardiasis (diarrhea)',
    kingdom: 'Protozoa',
  },
  {
    key: 'taenia',   label: 'Taenia saginata',          tier: 3,
    fill: 0xff8844,  w: 22, h: 6,
    morph: 'Segmented flatworm (proglottids)',
    gram:  'N/A (helminth)',
    motil: 'Motile (muscular)',
    disease: 'Taeniasis',
    kingdom: 'Helminthes',
  },
  {
    key: 'plasmodium', label: 'Plasmodium falciparum',   tier: 3,
    fill: 0xdd3355,  radius: 5,
    morph: 'Ring-shaped trophozoite inside RBC',
    gram:  'N/A (protozoan)',
    motil: 'Non-motile (gliding motility)',
    disease: 'Malaria',
    kingdom: 'Protozoa',
  },
  {
    key: 'schistosoma', label: 'Schistosoma mansoni',    tier: 3,
    fill: 0xff6644,  w: 20, h: 8,
    morph: 'Elongated paired worm (schistosomulum)',
    gram:  'N/A (helminth)',
    motil: 'Motile (muscular)',
    disease: 'Schistosomiasis',
    kingdom: 'Helminthes',
  },
  {
    key: 'enterococcus', label: 'Enterococcus faecalis', tier: 3,
    fill: 0xdd8844,  radius: 5,
    morph: 'Spherical (cocci), pair or short chain',
    gram:  'Gram-positive',
    motil: 'Non-motile',
    disease: 'UTI, endocarditis',
    kingdom: 'Bacteria',
  },
];

/* ───────────────────────────────────────────────────────────────────
   Procedural texture builder
   ─────────────────────────────────────────────────────────────────── */
function buildTextures(scene) {
  const g = scene.add.graphics();

  const makeTex = (key, w, h, draw) => {
    g.clear();
    draw(g);
    const rt = scene.add.renderTexture(0, 0, w, h);
    rt.draw(g);
    scene.textures.addRenderTexture(key, rt);
  };

  // Cocci – cluster of 4 green circles
  makeTex('cocci', 32, 32, (gr) => {
    gr.fillStyle(0x44dd44, 0.9); gr.fillCircle(8, 8, 5);
    gr.fillCircle(20, 8, 5); gr.fillCircle(8, 22, 5); gr.fillCircle(20, 22, 5);
  });
  // Bacilli – rounded rect
  makeTex('bacilli', 24, 16, (gr) => {
    gr.fillStyle(0x33bb33, 0.9); gr.fillRoundedRect(2, 2, 20, 12, 4);
  });
  // E. coli – short rounded rect with a small dot at one end
  makeTex('ecoli', 24, 14, (gr) => {
    gr.fillStyle(0x55cc55, 0.9); gr.fillRoundedRect(2, 2, 18, 10, 3);
    gr.fillStyle(0xffffff, 0.3); gr.fillCircle(6, 7, 2);
  });
  // Spirilla – wavy line
  makeTex('spirilla', 32, 32, (gr) => {
    gr.lineStyle(3, 0x22aa44, 0.9);
    gr.beginPath(); gr.moveTo(2, 20);
    for (let t = 0; t < Math.PI * 4; t += 0.15)
      gr.lineTo(2 + t * 2.2, 16 + Math.sin(t * 1.5) * 10);
    gr.strokePath();
  });
  // Fungi – purple circle with spikes
  makeTex('fungi', 32, 32, (gr) => {
    gr.fillStyle(0xaa44cc, 0.85); gr.fillCircle(16, 16, 8);
    for (let a = 0; a < 360; a += 45) {
      const r = a * Math.PI / 180;
      gr.lineStyle(2, 0xaa44cc, 0.7);
      gr.beginPath(); gr.moveTo(16 + 8 * Math.cos(r), 16 + 8 * Math.sin(r));
      gr.lineTo(16 + 18 * Math.cos(r), 16 + 18 * Math.sin(r)); gr.strokePath();
    }
  });
  // Pseudomonas – rod with a wavy tail
  makeTex('pseudomonas', 28, 16, (gr) => {
    gr.fillStyle(0x55bb88, 0.9); gr.fillRoundedRect(2, 3, 16, 8, 3);
    gr.lineStyle(1, 0x55bb88, 0.7);
    gr.beginPath(); gr.moveTo(18, 7);
    for (let t = 0; t < Math.PI * 2; t += 0.3)
      gr.lineTo(18 + t * 1.5, 7 + Math.sin(t * 2) * 3);
    gr.strokePath();
  });
  // Aspergillus – circle with radiating spokes
  makeTex('aspergillus', 32, 32, (gr) => {
    gr.fillStyle(0x88aa44, 0.85); gr.fillCircle(16, 16, 7);
    for (let a = 0; a < 360; a += 30) {
      const r = a * Math.PI / 180;
      gr.lineStyle(1, 0x88aa44, 0.5);
      gr.beginPath(); gr.moveTo(16 + 7 * Math.cos(r), 16 + 7 * Math.sin(r));
      gr.lineTo(16 + 15 * Math.cos(r), 16 + 15 * Math.sin(r)); gr.strokePath();
    }
    gr.fillStyle(0xffffff, 0.1); gr.fillCircle(16, 16, 3);
  });
  // Giardia – teardrop + 2 flagella
  makeTex('giardia', 28, 28, (gr) => {
    gr.fillStyle(0x3388ff, 0.85); gr.fillEllipse(14, 10, 10, 16);
    gr.lineStyle(2, 0x3388ff, 0.7);
    gr.beginPath(); gr.moveTo(14, 18); gr.lineTo(4, 26); gr.strokePath();
    gr.beginPath(); gr.moveTo(14, 18); gr.lineTo(24, 26); gr.strokePath();
  });
  // Taenia – segmented bar
  makeTex('taenia', 40, 12, (gr) => {
    gr.fillStyle(0xff8844, 0.85);
    for (let i = 0; i < 5; i++) gr.fillEllipse(4 + i * 8, 6, 6, 8);
  });
  // Plasmodium – ring shape
  makeTex('plasmodium', 24, 24, (gr) => {
    gr.lineStyle(3, 0xdd3355, 0.9);
    gr.strokeCircle(12, 12, 5);
    gr.fillStyle(0xdd3355, 0.3); gr.fillCircle(12, 12, 3);
  });
  // Schistosoma – elongated oval pair
  makeTex('schistosoma', 32, 16, (gr) => {
    gr.fillStyle(0xff6644, 0.85); gr.fillEllipse(10, 8, 14, 10);
    gr.fillStyle(0xff8844, 0.6); gr.fillEllipse(22, 8, 14, 10);
  });
  // Enterococcus – pair of circles
  makeTex('enterococcus', 24, 16, (gr) => {
    gr.fillStyle(0xdd8844, 0.9); gr.fillCircle(7, 8, 5); gr.fillCircle(16, 8, 5);
  });

  // Nucleus obstacle
  makeTex('nucleus', 48, 48, (gr) => {
    gr.fillStyle(0xff3333, 0.25); gr.fillCircle(24, 24, 20);
    gr.lineStyle(2, 0xff5555, 0.5); gr.strokeCircle(24, 24, 20);
  });
  g.destroy();
}

/* ── Player texture ── */
function buildPlayerTexture(scene) {
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.1); g.fillCircle(16, 16, 16);
  g.fillStyle(0x55ccff, 1);   g.fillCircle(16, 16, 10);
  g.fillStyle(0xffffff, 0.7); g.fillCircle(12, 11, 3);
  scene.textures.addRenderTexture('player', scene.add.renderTexture(0, 0, 32, 32).draw(g));
  g.destroy();
}

/* ── Particle texture ── */
function buildParticleTexture(scene) {
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.6); g.fillCircle(4, 4, 4);
  scene.textures.addRenderTexture('particle', scene.add.renderTexture(0, 0, 8, 8).draw(g));
  g.destroy();
}

/* ═══════════════════════════════════════════════════════════════════
   PRELOAD SCENE
   ═══════════════════════════════════════════════════════════════════ */
class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  create() {
    buildTextures(this);
    buildPlayerTexture(this);
    buildParticleTexture(this);
    this.scene.start('MainWorldScene');
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN WORLD SCENE
   ═══════════════════════════════════════════════════════════════════ */
class MainWorldScene extends Phaser.Scene {
  constructor() {
    super('MainWorldScene');
    this.activeMicrobe = null;
    this._identHandler = null;
    this._missHandler = null;
    this._playerNameBar = null;
    this._shortcutHandler = null;
    // Mini-map
    this._minimapGraphics = null;
    this._minimapBg = null;
  }

  /* ────────── create ────────── */
  create() {
    /* ── World bounds & camera ── */
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBackgroundColor('#0b1b12');

    /* ── Grid background ── */
    this._drawBackground();

    /* ── Scenery labels ── */
    this._addSceneryLabels();

    /* ── Obstacles ── */
    this.obstacles = this.physics.add.staticGroup();
    for (let i = 0; i < 18; i++) {
      const o = this.obstacles.create(
        Phaser.Math.Between(80, WORLD_W - 80),
        Phaser.Math.Between(80, WORLD_H - 80),
        'nucleus'
      );
      o.setScale(Phaser.Math.FloatBetween(0.6, 1.8));
      o.refreshBody();
    }

    /* ── Player ── */
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDrag(120);
    this.player.setMaxVelocity(220);
    this.player.setDepth(10);
    this.cameras.main.startFollow(this.player, true, 0.06, 0.06);
    this.cameras.main.setZoom(1.3);

    this._playerNameBar = this.add.text(0, 0, '🧑‍🔬 Microbiologist', {
      fontSize: '10px', color: '#aaffaa', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5, 1).setDepth(11);

    /* ── Controls Text Overlay ── */
    this.add.text(this.scale.width / 2, 16, 'CONTROLS: [W][A][S][D] or [↑][↓][←][→] to move', {
      fontSize: '12px', color: '#88ff88', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3, alpha: 0.85
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    /* ── Microbes group ── */
    this.microbes = this.physics.add.group({ maxSize: 30 });
    this._spawnBatch(6);

    /* ── Overlap ── */
    this.physics.add.overlap(this.player, this.microbes, this._onOverlap, null, this);

    /* ── Input ── */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Collision: player vs obstacles
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.microbes, this.obstacles);

    // Spawn timer
    this.time.addEvent({ delay: 4500, callback: () => this._spawnBatch(1), loop: true });

    /* ── Event listeners (Phaser ← React bridge) ── */
    this._identHandler = (e) => this._onIdentified(e);
    this._missHandler  = (e) => this._onMisidentified(e);
    document.addEventListener('microbe-identified', this._identHandler);
    document.addEventListener('microbe-misidentified', this._missHandler);

    /* ── Keyboard shortcut listener (E / 1 / 2) ── */
    this._shortcutHandler = (e) => this._handleShortcut(e);
    document.addEventListener('keydown', this._shortcutHandler);

    /* ── Scene lifecycle cleanup ── */
    this.events.on('shutdown', this._cleanupListeners, this);
    this.events.on('destroy', this._cleanupListeners, this);

    /* ── Ambient particles ── */
    this._particleEmitter = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: WORLD_W }, y: { min: 0, max: WORLD_H },
      speed: { min: 2, max: 10 }, scale: { start: 0.5, end: 0 },
      alpha: { start: 0.15, end: 0 }, lifespan: 6000,
      frequency: 300, quantity: 2, blendMode: 'ADD',
    });

    /* ── Mini-map UI (camera-fixed overlay) ── */
    this._createMinimap();
  }

  /* ────────── update ────────── */
  update() {
    /* ── Player movement ── */
    const spd = this.player.body ? PLAYER_SPEED : 0;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -spd;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = spd;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -spd;
    else if (this.cursors.down.isDown || this.wasd.down.isDown)   vy = spd;
    this.player.setVelocity(vx, vy);

    useMicrobeStore.getState().setIsMoving(vx !== 0 || vy !== 0);

    /* ── Name-bar follow ── */
    if (this._playerNameBar && this.player.active)
      this._playerNameBar.setPosition(this.player.x, this.player.y - 22);

    this.microbes.getChildren().forEach((m) => {
      if (m.active && m._nameBar) m._nameBar.setPosition(m.x, m.y - 16);
    });

    /* ── Wander ── */
    this.microbes.getChildren().forEach((m) => {
      if (!m.active) return;
      if (Math.abs(m.body.velocity.x) < 5 && Math.abs(m.body.velocity.y) < 5) {
        m.body.velocity.x = Phaser.Math.Between(-MICROBE_BASE_SPEED, MICROBE_BASE_SPEED);
        m.body.velocity.y = Phaser.Math.Between(-MICROBE_BASE_SPEED, MICROBE_BASE_SPEED);
      }
    });

    /* ── Minimap redraw every frame ── */
    this._updateMinimap();
  }

  /* ═══════════════════════════════════════════════════════════════
     PRIVATE HELPERS
     ═══════════════════════════════════════════════════════════════ */

  /* ────────── Fuzzy Background & Grid ────────── */
  _drawBackground() {
    const g = this.add.graphics();
    
    // 1. Cloudy/Fuzzy organic background layer
    for (let i = 0; i < 200; i++) {
      const cx = Phaser.Math.Between(0, WORLD_W);
      const cy = Phaser.Math.Between(0, WORLD_H);
      const cr = Phaser.Math.Between(80, 280);
      
      // Soft organic green/teal hues to simulate fluid
      const colors = [0x112b1c, 0x183020, 0x0f2416];
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];
      
      g.fillStyle(color, Phaser.Math.FloatBetween(0.1, 0.35));
      g.fillCircle(cx, cy, cr);
    }

    // 2. Structural Grid (drawn over the clouds)
    g.lineStyle(1, 0x224422, 0.25);
    for (let x = 0; x <= WORLD_W; x += 80)  g.moveTo(x, 0).lineTo(x, WORLD_H);
    for (let y = 0; y <= WORLD_H; y += 80)  g.moveTo(0, y).lineTo(WORLD_W, y);
    g.strokePath();
  }

  /* ────────── Scenery labels ────────── */
  _addSceneryLabels() {
    const zones = [
      [WORLD_W * 0.85, 60,  '🧫 Culture Plate'],
      [WORLD_W * 0.1,  60,  '🧬 Host Tissue'],
      [60, WORLD_H * 0.85, '🦠 Infection Zone'],
      [WORLD_W * 0.85, WORLD_H * 0.85, '🔬 Observation Deck'],
      [WORLD_W / 2, WORLD_H / 2, '🫁 Alveolar Space'],
    ];
    zones.forEach(([x, y, txt]) => {
      this.add.text(x, y, txt, {
        fontSize: '11px', color: '#448844', fontFamily: 'monospace',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5, 0);
    });
  }

  /* ═════════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ═════════════════════════════════════════════════════════════ */
  _handleShortcut(e) {
    const key = e.key;
    const store = useMicrobeStore.getState();
    const phase = store.gamePhase;

    // Only respond if not in SCANNING (modal handles its own input)
    if (phase === 'SCANNING') return;

    if (key === 'e' || key === 'E') {
      if (phase === 'ENCYCLOPEDIA') store.setGamePhase('EXPLORING');
      else store.setGamePhase('ENCYCLOPEDIA');
      e.preventDefault();
    } else if (key === '1') {
      store.setCurrentTool('microscope');
      e.preventDefault();
    } else if (key === '2') {
      store.setCurrentTool('gram stain');
      e.preventDefault();
    }
  }

  /* ═════════════════════════════════════════════════════════════
     MINI-MAP
     ═════════════════════════════════════════════════════════════ */

  /** Create the mini-map camera-fixed overlay. */
  _createMinimap() {
    const mmW = 140, mmH = 105;   // aspect ~4:3 matching WORLD_W:WORLD_H
    const pad = 8;
    const x = pad, y = this.scale.height - mmH - pad - 50; // above tool selector

    // Background
    this._minimapBg = this.add.graphics();
    this._minimapBg.fillStyle(0x000000, 0.55);
    this._minimapBg.fillRoundedRect(x - 2, y - 2, mmW + 4, mmH + 4, 4);
    this._minimapBg.setScrollFactor(0).setDepth(100);

    // Graphics layer for dots
    this._minimapGraphics = this.add.graphics();
    this._minimapGraphics.setScrollFactor(0).setDepth(101);

    // Label
    this._minimapLabel = this.add.text(x + mmW / 2, y - 8, '🗺️ Mini-map', {
      fontSize: '8px', color: '#88aa88', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(101);

    // Store dimensions for _updateMinimap
    this._mmRect = { x, y, w: mmW, h: mmH };
  }

  /** Redraw mini-map dots each frame. */
  _updateMinimap() {
    const { x, y, w, h } = this._mmRect || { x: 0, y: 0, w: 1, h: 1 };
    const g = this._minimapGraphics;
    const discovered = useMicrobeStore.getState().taxonomyEncyclopedia;
    const discoveredSet = new Set(discovered.map((d) => d.id));
    if (!g) return;

    g.clear();

    // Viewport rectangle (where the camera is looking)
    const cam = this.cameras.main;
    const vp = {
      left:   cam.scrollX,
      top:    cam.scrollY,
      right:  cam.scrollX + cam.width / cam.zoom,
      bottom: cam.scrollY + cam.height / cam.zoom,
    };

    function tx(wx) { return x + (wx / WORLD_W) * w; }
    function ty(wy) { return y + (wy / WORLD_H) * h; }

    // Viewport outline
    g.lineStyle(1, 0x88ff88, 0.4);
    g.strokeRect(tx(vp.left), ty(vp.top), (vp.right - vp.left) / WORLD_W * w, (vp.bottom - vp.top) / WORLD_H * h);

    // Microbe dots
    this.microbes.getChildren().forEach((m) => {
      if (!m.active) return;
      const isDiscovered = discoveredSet.has(m.microbeData?.id);
      // Discovered = bright filled circle; undiscovered = dim outlined
      if (isDiscovered) {
        g.fillStyle(0x88ff88, 0.8);
        g.fillCircle(tx(m.x), ty(m.y), 2.5);
      } else {
        g.lineStyle(1, 0x88ff88, 0.3);
        g.strokeCircle(tx(m.x), ty(m.y), 2);
      }
    });

    // Player dot
    if (this.player && this.player.active) {
      g.fillStyle(0x55ccff, 1);
      g.fillTriangle(
        tx(this.player.x), ty(this.player.y - 4),
        tx(this.player.x - 4), ty(this.player.y + 3),
        tx(this.player.x + 4), ty(this.player.y + 3),
      );
    }
  }

  /* ═════════════════════════════════════════════════════════════
     MICROBE SPAWNING
     ═════════════════════════════════════════════════════════════ */

  _spawnBatch(count) {
    const pts = useMicrobeStore.getState().scientificProgressionPoints;
    const unlocked = SPECIES.filter((s) =>
      pts >= 50 ? s.tier <= 3 : pts >= 20 ? s.tier <= 2 : s.tier === 1
    );

    for (let i = 0; i < count; i++) {
      const def = unlocked[Phaser.Math.Between(0, unlocked.length - 1)];
      const sx = Phaser.Math.Between(100, WORLD_W - 100);
      const sy = Phaser.Math.Between(100, WORLD_H - 100);
      const microbe = this.microbes.create(sx, sy, def.key);
      if (!microbe) continue;

      microbe.setBounce(0.6, 0.6).setCollideWorldBounds(true);
      microbe.setDrag(20);
      microbe.setMaxVelocity(MICROBE_BASE_SPEED + Math.min(pts / 8, 12));
      microbe.setDepth(8);
      microbe.body.velocity.set(
        Phaser.Math.Between(-MICROBE_BASE_SPEED, MICROBE_BASE_SPEED),
        Phaser.Math.Between(-MICROBE_BASE_SPEED, MICROBE_BASE_SPEED),
      );

      microbe.microbeData = { id: uuid(), type: def.key, metadata: { ...def } };
      microbe.ignoreUntil = 0;

      const bar = this.add.text(sx, sy - 16, '?', {
        fontSize: '9px', color: '#88ff88', fontFamily: 'monospace',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5, 1).setDepth(9);
      microbe._nameBar = bar;

      this._spawnFlash(sx, sy);
    }
  }

  _spawnFlash(x, y) {
    const ring = this.add.circle(x, y, 2, 0xffffff, 0.4).setDepth(20);
    this.tweens.add({
      targets: ring, scaleX: 10, scaleY: 10, alpha: 0, duration: 400,
      onComplete: () => ring.destroy(),
    });
  }

  /* ═════════════════════════════════════════════════════════════
     OVERLAP / IDENTIFICATION EVENTS
     ═════════════════════════════════════════════════════════════ */

  _onOverlap(player, microbe) {
    if (!microbe.active) return;
    if (microbe.ignoreUntil && Date.now() < microbe.ignoreUntil) return;

    this.physics.pause();

    this.tweens.add({
      targets: player, alpha: 0.3, yoyo: true, duration: 150,
    });

    const store = useMicrobeStore.getState();
    store.setGamePhase('SCANNING');
    store.setActiveTarget(microbe.microbeData);
    this.activeMicrobe = microbe;
  }

  _onIdentified(e) {
    const id = e.detail?.id;
    if (!id || !this.activeMicrobe?.microbeData) return;
    if (this.activeMicrobe.microbeData.id !== id) return;
    this._destroyWithEffect(this.activeMicrobe);
    this.activeMicrobe = null;
    this.physics.resume();
  }

  _onMisidentified(e) {
    const id = e.detail?.id;
    if (!id || !this.activeMicrobe?.microbeData) return;
    if (this.activeMicrobe.microbeData.id !== id) return;
    this.activeMicrobe.ignoreUntil = Date.now() + 2000;
    this.activeMicrobe = null;
    this.physics.resume();
  }

  _destroyWithEffect(m) {
    if (!m || !m.active) return;
    m.setTintFill(0xffffff);
    this.time.delayedCall(80, () => {
      if (!m.active) return;
      m.setTint(0xffffff);
      this.tweens.add({
        targets: m, alpha: 0, scaleX: 3, scaleY: 3, duration: 300,
        onComplete: () => {
          if (m._nameBar) m._nameBar.destroy();
          m.destroy();
        },
      });
    });
  }

  /* ── Cleanup ── */
  _cleanupListeners() {
    if (this._identHandler) document.removeEventListener('microbe-identified', this._identHandler);
    if (this._missHandler)  document.removeEventListener('microbe-misidentified', this._missHandler);
    if (this._shortcutHandler) document.removeEventListener('keydown', this._shortcutHandler);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   REACT COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const GameCanvas = () => {
  const gameRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: canvasRef.current,
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1b12',
      physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
      scene: [PreloadScene, MainWorldScene],
    });
    gameRef.current = game;

    return () => {
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  }, []);

  return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default GameCanvas;