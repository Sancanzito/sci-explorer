// src/Simulations/MicrobeRPG/PhaserScenes.js
// All enhanced Phaser 3 scenes for the MicrobeRPG laboratory simulation

import Phaser from 'phaser';
import { DISEASES, MEDIA_OPTIONS, CORRECT_MEDIA_MAP, COLONY_APPEARANCES, STAIN_STEPS } from './gameData.js';

// ============================================================
// SCENE 1: MICROSCOPE - Interactive viewport with procedural sprites
// ============================================================
export class MicroscopeScene extends Phaser.Scene {
  constructor() {
    super('MicroscopeScene');
    this.zoom = 1;
    this.focus = 50;
    this.light = 80;
    this.organisms = [];
    this.specimenField = 0;
  }

  init(data) {
    this.patient = data.patient;
    this.disease = data.patient ? DISEASES[data.patient.diseaseId] : null;
    this.onSave = data.onSave || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);
    this.add.text(width / 2, 10, '🔬 Microscope View', { fontSize: '14px', color: '#ccc' }).setOrigin(0.5, 0);

    // Circular viewport mask
    const lens = this.make.graphics();
    lens.fillStyle(0xffffff);
    lens.fillCircle(width / 2, height / 2, Math.min(width, height) * 0.38);
    const mask = new Phaser.Display.Masks.BitmapMask(this, lens);

    this.viewport = this.add.container(width / 2, height / 2);
    this.viewport.setMask(mask);

    // Background glow (light)
    this.bgLight = this.add.circle(0, 0, 300, 0xdddddd);
    this.viewport.add(this.bgLight);

    // Slide stage (draggable)
    this.stage = this.add.container(0, 0);
    this.viewport.add(this.stage);

    // Slide glass background
    this.slideBg = this.add.rectangle(0, 0, 600, 600, 0xffffff, 0.03);
    this.slideBg.setStrokeStyle(1, 0x88aaff, 0.2);
    this.stage.add(this.slideBg);

    // Grid lines (like a real microscope grid)
    const gridGfx = this.add.graphics();
    gridGfx.lineStyle(1, 0x88aaff, 0.08);
    for (let i = -300; i <= 300; i += 50) {
      gridGfx.moveTo(i, -300);
      gridGfx.lineTo(i, 300);
      gridGfx.moveTo(-300, i);
      gridGfx.lineTo(300, i);
    }
    gridGfx.strokePath();
    this.stage.add(gridGfx);

    // Spawn organisms
    this.spawnOrganisms();

    // Interactive drag area
    const hitArea = this.add.rectangle(0, 0, 600, 600, 0xffffff, 0);
    hitArea.setInteractive(new Phaser.Geom.Rectangle(-300, -300, 600, 600), Phaser.Geom.Rectangle.Contains);
    this.input.setDraggable(hitArea);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      this.stage.x = dragX - 300;
      this.stage.y = dragY - 250;
    });

    // Field counter label
    this.fieldLabel = this.add.text(width / 2, height - 12, '', { fontSize: '11px', color: '#666' }).setOrigin(0.5);

    this.applyLight();
    this.updateBlur();

    // Mouse wheel zoom
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const zoomDelta = deltaY > 0 ? -0.5 : 0.5;
      this.setZoom(Math.max(1, Math.min(6, this.zoom + zoomDelta)));
    });
  }

  spawnOrganisms() {
    const type = this.disease ? this.disease.pathogen : 'none';
    const isCOVID = this.disease?.type === 'virus';

    if (isCOVID || type === 'none') {
      // Empty field - no organisms visible for viral infections
      this.add.text(0, -20, 'No organisms visible', { fontSize: '14px', color: '#888' }).setOrigin(0.5);
      return;
    }

    const organismsPerField = this.specimenField === 0 ? 40 : 30;

    for (let i = 0; i < organismsPerField; i++) {
      const x = Phaser.Math.Between(-250, 250);
      const y = Phaser.Math.Between(-250, 250);
      const org = this.drawOrganism(type, x, y);

      if (org) {
        org.setPosition(x, y);
        // Store custom properties for animation
        org._vx = (Math.random() - 0.5) * 0.6;
        org._vy = (Math.random() - 0.5) * 0.6;
        org._type = type;
        this.organisms.push(org);
        this.stage.add(org);
      }
    }
  }

  drawOrganism(type, x, y) {
    const g = this.add.graphics();

    switch (type) {
      // ---------- Streptococcus pyogenes ----------
      case 'Streptococcus pyogenes': {
        const chainLen = Phaser.Math.Between(4, 8);
        const color = 0x8844cc; // Gram-positive purple
        g.fillStyle(color, 0.9);
        for (let j = 0; j < chainLen; j++) {
          const offX = j * 6 + (Math.random() - 0.5) * 2;
          const offY = (Math.random() - 0.5) * 3;
          g.fillCircle(offX, offY, 3 + Math.random() * 1.5);
        }
        break;
      }
      // ---------- Escherichia coli ----------
      case 'Escherichia coli': {
        const color = 0xff66bb; // Gram-negative pink
        g.fillStyle(color, 0.85);
        const rodLen = 12 + Math.random() * 6;
        const rodWid = 4 + Math.random() * 2;
        g.fillRoundedRect(0, 0, rodLen, rodWid, 2);
        // Nuclear region
        g.fillStyle(0xff88cc, 0.4);
        g.fillCircle(rodLen / 4, rodWid / 2, 1.5);
        g.fillCircle((rodLen * 3) / 4, rodWid / 2, 1.5);
        break;
      }
      // ---------- Streptococcus pneumoniae ----------
      case 'Streptococcus pneumoniae': {
        const color = 0x9944dd;
        g.fillStyle(color, 0.9);
        // Capsule halo (faint)
        g.fillStyle(0x9944dd, 0.15);
        g.fillEllipse(-1, 1, 16, 12);
        // Diplococci pair
        g.fillStyle(color, 0.9);
        g.fillCircle(-3, 0, 4 + Math.random() * 1);
        g.fillCircle(3, 0, 4 + Math.random() * 1);
        break;
      }
      // ---------- Candida albicans ----------
      case 'Candida albicans': {
        g.fillStyle(0x8844aa, 0.85);
        // Main yeast cell
        g.fillEllipse(0, 0, 10, 14);
        // Nucleus
        g.fillStyle(0xaa66cc, 0.6);
        g.fillCircle(0, -1, 2);
        // Occasional budding
        if (Math.random() > 0.55) {
          g.fillStyle(0x8844aa, 0.7);
          g.fillEllipse(8, -7, 6, 8);
          // Bud scar
          g.fillStyle(0xaa66cc, 0.3);
          g.fillCircle(4, -4, 1);
        }
        // Occasional pseudohyphae
        if (Math.random() > 0.7) {
          g.lineStyle(2, 0x8844aa, 0.6);
          g.beginPath();
          g.moveTo(8, -7);
          g.lineTo(16, -14);
          g.strokePath();
          // Septum
          g.fillStyle(0x8844aa, 0.4);
          g.fillCircle(12, -10, 1.5);
        }
        break;
      }
      // ---------- Mycobacterium tuberculosis ----------
      case 'Mycobacterium tuberculosis': {
        g.fillStyle(0xff4444, 0.8); // Acid-fast red
        const rodLen = 10 + Math.random() * 6;
        const rodWid = 2 + Math.random() * 1;
        g.fillRoundedRect(0, 0, rodLen, rodWid, 1);
        // Beaded appearance (AFB characteristic)
        g.fillStyle(0xff6666, 0.6);
        for (let b = 0; b < rodLen; b += 3) {
          g.fillCircle(b + 1, rodWid / 2, 0.8);
        }
        break;
      }
      // ---------- Plasmodium falciparum ----------
      case 'Plasmodium falciparum': {
        // Red blood cell
        g.fillStyle(0xffaaaa, 0.5);
        g.fillCircle(0, 0, 12);
        g.lineStyle(1, 0xcc6666, 0.6);
        g.strokeCircle(0, 0, 12);

        // Ring form inside RBC
        if (Math.random() > 0.3) {
          const rx = -3 + Math.random() * 6;
          const ry = -3 + Math.random() * 6;
          g.lineStyle(2, 0x8b0000, 0.9);
          g.strokeCircle(rx, ry, 3);
          // Chromatin dot
          g.fillStyle(0x8b0000, 0.9);
          g.fillCircle(rx + 2, ry - 1, 1);
          // Second ring (some RBCs have multiple)
          if (Math.random() > 0.8) {
            g.lineStyle(1.5, 0x8b0000, 0.6);
            g.strokeCircle(rx + 5, ry + 3, 2);
            g.fillStyle(0x8b0000, 0.6);
            g.fillCircle(rx + 6, ry + 2, 0.8);
          }
        }
        break;
      }
      // ---------- Neisseria meningitidis ----------
      case 'Neisseria meningitidis': {
        const color = 0xff66bb;
        g.fillStyle(color, 0.85);
        // Diplococci (coffee bean shape)
        g.fillEllipse(-3, 0, 6, 5);
        g.fillEllipse(3, 0, 6, 5);
        // Intracellular location hint
        g.lineStyle(1, 0xcc88aa, 0.2);
        g.strokeCircle(0, 0, 8);
        break;
      }
      default:
        return null;
    }

    return g;
  }

  update(time, delta) {
    // Animate all organisms
    const speedMultiplier = Math.min(2, delta / 16); // cap to avoid huge jumps
    this.organisms.forEach(org => {
      if (!org || !org._type) return;
      const type = org._type;

      // Brownian motion (all organisms)
      org.x += (Math.random() - 0.5) * 0.8 * speedMultiplier;
      org.y += (Math.random() - 0.5) * 0.8 * speedMultiplier;

      // Active motility for flagellated organisms
      if (type === 'Escherichia coli') {
        org.x += org._vx * speedMultiplier;
        org.y += org._vy * speedMultiplier;
        if (Math.random() < 0.02) {
          org._vx = (Math.random() - 0.5) * 2;
          org._vy = (Math.random() - 0.5) * 2;
        }
      }
    });

    // Update field label
    const zoomNames = { 1: '10x', 3: '40x', 6: '100x' };
    const zoomLabel = Object.entries(zoomNames).reduce((acc, [k, v]) =>
      Math.abs(this.zoom - parseFloat(k)) < 0.3 ? v : acc, 'Custom');
    this.fieldLabel.setText(`Field ${this.specimenField + 1} | ${zoomLabel} | Focus: ${Math.round(this.focus)}%`);
  }

  applyLight() {
    const brightness = 0.3 + (this.light / 100) * 0.7;
    this.viewport.setAlpha(brightness);
    this.bgLight.setAlpha(Math.min(1, this.light / 80));
    this.bgLight.setScale(1 + (100 - this.light) / 100);
  }

  updateBlur() {
    const deviation = Math.abs(50 - this.focus);
    const alpha = Math.max(0.15, 1 - (deviation / 55));
    this.stage.setAlpha(alpha);
    this.viewport.setScale(this.zoom);
  }

  setZoom(val) {
    this.zoom = Math.max(1, Math.min(6, val));
    this.updateBlur();
  }

  setFocus(val) {
    this.focus = Math.max(0, Math.min(100, val));
    this.updateBlur();
  }

  setLight(val) {
    this.light = Math.max(0, Math.min(100, val));
    this.applyLight();
  }

  getOrganismCounts() {
    const type = this.disease ? this.disease.pathogen : 'none';
    const organismsPresent = ['Streptococcus pyogenes', 'Escherichia coli', 'Streptococcus pneumoniae',
      'Candida albicans', 'Mycobacterium tuberculosis', 'Plasmodium falciparum', 'Neisseria meningitidis'];
    return organismsPresent.reduce((acc, o) => ({ ...acc, [o]: type === o ? this.organisms.length : 0 }), {});
  }
}

// ============================================================
// SCENE 2: GRAM STAIN - 4-step workflow with procedural errors
// ============================================================
export class GramStainScene extends Phaser.Scene {
  constructor() {
    super('GramStainScene');
    this.step = 0;
    this.alcoholCount = 0;
    this.errors = [];
    this.disease = null;
  }

  init(data) {
    this.disease = data.disease || null;
    this.onFinish = data.onFinish || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Lab bench
    this.add.rectangle(0, height - 60, width, 120, 0x333355).setOrigin(0).setAlpha(0.5);

    // Slide
    this.slide = this.add.rectangle(width / 2, height / 2 - 20, 300, 160, 0xeeeeee);
    this.slide.setStrokeStyle(3, 0xffffff);

    // Slide label
    this.stepLabel = this.add.text(width / 2, 15, 'Gram Stain Procedure', {
      fontSize: '16px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // Step indicator
    this.progressText = this.add.text(width / 2, 35, 'Step 0/4: Place slide', {
      fontSize: '12px', color: '#aaa'
    }).setOrigin(0.5, 0);

    // Result label
    this.resultLabel = this.add.text(width / 2, height / 2 + 100, '', {
      fontSize: '14px', color: '#ffd700'
    }).setOrigin(0.5, 0.5);

    // Error label
    this.errorLabel = this.add.text(width / 2, height / 2 + 120, '', {
      fontSize: '11px', color: '#ff6666'
    }).setOrigin(0.5, 0.5);

    // Chemical bottles visualization (decorative)
    const bottles = STAIN_STEPS.gram;
    bottles.forEach((b, i) => {
      const bx = 40 + i * 130;
      const by = height - 40;
      const bottle = this.add.rectangle(bx, by, 30, 40, b.color, 0.7);
      bottle.setStrokeStyle(1, 0xffffff, 0.3);
      bottle.setInteractive({ useHandCursor: false });
      this.add.text(bx, by - 30, b.name.split(' ')[0], {
        fontSize: '8px', color: '#ccc'
      }).setOrigin(0.5);
    });
  }

  applyChemical(chemicalName) {
    const { width, height } = this.cameras.main;
    const expectedStep = this.step;
    const expectedChemical = STAIN_STEPS.gram[expectedStep]?.name || '';

    // Check if sequence is correct
    if (chemicalName !== expectedChemical) {
      // Check for reapplication of same chemical
      if (chemicalName === expectedChemical && this.step < 4) {
        // Same step, let it through
      } else {
        this.errors.push(`Wrong sequence: applied ${chemicalName} instead of ${expectedChemical}`);
        this.errorLabel.setText(`⚠️ Wrong sequence! Expected ${expectedChemical}`);
        this.time.addEvent({
          delay: 2000,
          callback: () => {
            this.errorLabel.setText('');
          }
        });
        return;
      }
    }

    this.step++;
    this.progressText.setText(`Step ${this.step}/4: ${chemicalName}`);

    // Visual transitions
    switch (chemicalName) {
      case 'Crystal Violet':
        this.slide.setFillStyle(0x6a0dad, 0.8);
        this.flashEffect(0x6a0dad);
        break;
      case "Gram's Iodine":
        this.slide.setFillStyle(0x3d0c02, 0.85);
        this.flashEffect(0x3d0c02);
        break;
      case 'Alcohol Decolorizer':
        this.alcoholCount++;
        if (this.alcoholCount >= 3) {
          // Over-decolorized: slide becomes very pale (false gram-negative)
          this.slide.setFillStyle(0xdddddd, 0.95);
          this.errors.push('Over-decolorization: excess alcohol removed CV from Gram-positive cells');
          this.errorLabel.setText('⚠️ Excess alcohol! Slide over-decolorized.');
        } else {
          this.slide.setFillStyle(0xcccccc, 0.6);
        }
        this.shakeEffect();
        break;
      case 'Safranin':
        if (this.alcoholCount >= 3) {
          // Over-decolorized → always appears gram-negative
          this.slide.setFillStyle(0xff66bb, 0.7);
          this.resultLabel.setText('Result: Gram Negative (Pink) - May be FALSE due to over-decolorization');
          this.onFinish('gram_negative', this.errors);
        } else if (this.disease?.observations?.gram === 'gram_positive') {
          this.slide.setFillStyle(0x6a0dad, 0.9);
          this.resultLabel.setText('✓ Result: Gram Positive (Purple)');
          this.onFinish('gram_positive', this.errors);
        } else {
          this.slide.setFillStyle(0xff66bb, 0.8);
          this.resultLabel.setText('✓ Result: Gram Negative (Pink)');
          this.onFinish('gram_negative', this.errors);
        }
        this.flashEffect(0xffd700);
        break;
      default:
        break;
    }
  }

  flashEffect(color) {
    const { width, height } = this.cameras.main;
    const flash = this.add.rectangle(width / 2, height / 2, width, height, color, 0.3);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      onComplete: () => flash.destroy()
    });
  }

  shakeEffect() {
    const originalX = this.slide.x;
    this.tweens.add({
      targets: this.slide,
      x: originalX + 5,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.slide.x = originalX
    });
  }

  reset() {
    this.step = 0;
    this.alcoholCount = 0;
    this.slide.setFillStyle(0xeeeeee);
    this.progressText.setText('Step 0/4: Place slide');
    this.resultLabel.setText('');
    this.errorLabel.setText('');
  }
}

// ============================================================
// SCENE 3: ACID FAST STAIN - Ziehl-Neelsen procedure
// ============================================================
export class AcidFastScene extends Phaser.Scene {
  constructor() {
    super('AcidFastScene');
    this.step = 0;
    this.disease = null;
  }

  init(data) {
    this.disease = data.disease || null;
    this.onFinish = data.onFinish || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x0d0d1a).setOrigin(0);

    // Slide
    this.slide = this.add.rectangle(width / 2, height / 2 - 20, 300, 160, 0xf5f5f5);
    this.slide.setStrokeStyle(3, 0xffffff);

    // Slide label
    this.add.text(width / 2, 15, 'Ziehl-Neelsen Acid-Fast Stain', {
      fontSize: '15px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.progressText = this.add.text(width / 2, 35, 'Step 0/4', {
      fontSize: '12px', color: '#aaa'
    }).setOrigin(0.5, 0);

    this.resultLabel = this.add.text(width / 2, height / 2 + 100, '', {
      fontSize: '14px', color: '#ffd700'
    }).setOrigin(0.5, 0.5);

    // Draw AFB organisms on the slide
    this.afbGraphics = this.add.graphics();
    this.drawAFBOrganisms();
  }

  drawAFBOrganisms() {
    const isAFBPositive = this.disease?.observations?.acidFast === 'positive';
    const isTB = this.disease?.pathogen === 'Mycobacterium tuberculosis';

    if (isAFBPositive || isTB) {
      // Draw red AFB rods (initially hidden / same as background)
      for (let i = 0; i < 20; i++) {
        const x = Phaser.Math.Between(-120, 120);
        const y = Phaser.Math.Between(-60, 60);
        this.afbGraphics.fillStyle(0xff4444, 0.15);
        this.afbGraphics.fillRoundedRect(x, y, 10 + Math.random() * 6, 2 + Math.random(), 1);
        // Beaded
        this.afbGraphics.fillStyle(0xff6666, 0.1);
        for (let b = 0; b < 10; b += 3) {
          this.afbGraphics.fillCircle(x + b + 1, y + 1, 0.6);
        }
      }
    }
  }

  applyChemical(stepNumber) {
    this.step = stepNumber;
    const steps = STAIN_STEPS.acidFast;
    const step = steps[stepNumber - 1];
    if (!step) return;

    this.progressText.setText(`Step ${stepNumber}/4: ${step.name}`);

    switch (stepNumber) {
      case 1: // Carbol Fuchsin
        this.slide.setFillStyle(0xff3333, 0.7);
        this.flashEffect(0xff0000);
        break;
      case 2: // Heat
        this.slide.setFillStyle(0xcc2222, 0.85);
        this.heatEffect();
        // AFB rods become more visible
        this.afbGraphics.clear();
        this.drawAFBOrganisms();
        this.afbGraphics.setAlpha(0.5);
        break;
      case 3: // Acid Alcohol
        this.slide.setFillStyle(0xdddddd, 0.6);
        // AFB retain red, background loses color
        this.afbGraphics.clear();
        this.drawAFBOrganisms();
        this.afbGraphics.setAlpha(0.9);
        break;
      case 4: // Methylene Blue
        this.slide.setFillStyle(0x2244aa, 0.4);
        // Final result: red AFB rods on blue background
        this.afbGraphics.clear();
        this.drawAFBOrganisms();
        this.afbGraphics.setAlpha(1.0);

        const isAFB = this.disease?.observations?.acidFast === 'positive';
        if (isAFB) {
          // Draw prominent red rods on blue
          this.afbGraphics.clear();
          for (let i = 0; i < 25; i++) {
            const x = Phaser.Math.Between(-130, 130);
            const y = Phaser.Math.Between(-65, 65);
            this.afbGraphics.fillStyle(0xff3333, 0.9);
            const rodLen = 10 + Math.random() * 8;
            this.afbGraphics.fillRoundedRect(x, y, rodLen, 3, 1);
            this.afbGraphics.fillStyle(0xff6666, 0.7);
            for (let b = 0; b < rodLen; b += 3) {
              this.afbGraphics.fillCircle(x + b + 1, y + 1.5, 0.8);
            }
          }
          this.resultLabel.setText('✓ Acid-Fast Positive: Red rods visible on blue background');
        } else {
          this.resultLabel.setText('Acid-Fast Negative: No red rods (only blue background)');
        }
        this.fadeEffect();
        break;
    }
  }

  flashEffect(color) {
    const { width, height } = this.cameras.main;
    const flash = this.add.rectangle(width / 2, height / 2, width, height, color, 0.25);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 1000,
      onComplete: () => flash.destroy()
    });
  }

  heatEffect() {
    const { width, height } = this.cameras.main;
    const glow = this.add.circle(width / 2, height / 2, 100, 0xff4400, 0.15);
    this.tweens.add({
      targets: glow,
      alpha: 0.4,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1500,
      yoyo: true,
      onComplete: () => glow.destroy()
    });
  }

  fadeEffect() {
    const { width, height } = this.cameras.main;
    const fade = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0.1);
    this.tweens.add({
      targets: fade,
      alpha: 0,
      duration: 500,
      onComplete: () => fade.destroy()
    });
  }

  reset() {
    this.step = 0;
    this.slide.setFillStyle(0xf5f5f5);
    this.progressText.setText('Step 0/4');
    this.resultLabel.setText('');
    this.afbGraphics.clear();
    this.drawAFBOrganisms();
  }
}

// ============================================================
// SCENE 4: BLOOD SMEAR - Parasitemia counting
// ============================================================
export class BloodSmearScene extends Phaser.Scene {
  constructor() {
    super('BloodSmearScene');
    this.infectedFound = 0;
    this.totalRBCs = 0;
    this.infectedRBCs = [];
    this.allRBCs = [];
  }

  init(data) {
    this.patient = data.patient;
    this.disease = data.patient ? DISEASES[data.patient.diseaseId] : null;
    this.onComplete = data.onComplete || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xfff5ee).setOrigin(0);

    // Title
    this.add.text(width / 2, 12, 'Peripheral Blood Smear', {
      fontSize: '15px', color: '#333', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // Counter
    this.counterText = this.add.text(10, 32, 'RBCs: 0 | Infected: 0 | 0.00%', {
      fontSize: '12px', color: '#555'
    });

    // Field count indicator
    this.fieldText = this.add.text(width - 10, 32, 'Field 1/3', {
      fontSize: '11px', color: '#888'
    }).setOrigin(1, 0);

    // Instructions
    this.add.text(width / 2, height - 8, 'Click infected RBCs (ring forms) to count parasitemia', {
      fontSize: '10px', color: '#999'
    }).setOrigin(0.5, 0.5);

    // Parasitemia guide
    this.add.text(5, height - 8, 'Guide: <1% mild, 1-5% moderate, >5% severe', {
      fontSize: '8px', color: '#bbb'
    }).setOrigin(0, 0.5);

    this.generateBloodCells(width, height);
  }

  generateBloodCells(width, height) {
    const isMalaria = this.disease?.pathogen === 'Plasmodium falciparum';
    const margin = 25;
    const cellSpacing = 28;
    const startX = margin;
    const startY = 48;
    const cols = Math.floor((width - margin * 2) / cellSpacing);
    const rows = Math.floor((height - 80) / cellSpacing);
    this.totalRBCs = cols * rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = row % 2 === 0 ? 0 : cellSpacing / 2;
        const x = startX + col * cellSpacing + offsetX;
        const y = startY + row * cellSpacing * 0.87;

        // Random slight position jitter
        const jx = x + (Math.random() - 0.5) * 3;
        const jy = y + (Math.random() - 0.5) * 3;
        const radius = 11 + Math.random() * 3;

        const isInfected = isMalaria && Math.random() < 0.08;

        const g = this.add.graphics();
        // RBC
        const rbcColor = isInfected ? 0xffaaaa : 0xffcccc;
        g.fillStyle(rbcColor, 0.85);
        g.fillCircle(jx, jy, radius);
        g.lineStyle(1, 0xcc8888, 0.5);
        g.strokeCircle(jx, jy, radius);
        // Central pallor
        g.fillStyle(0xffdddd, 0.3);
        g.fillCircle(jx, jy, radius * 0.35);

        this.allRBCs.push({ x: jx, y: jy, radius, g, isInfected, counted: false });

        if (isInfected) {
          // Ring form
          const rx = jx + (Math.random() - 0.5) * 4;
          const ry = jy + (Math.random() - 0.5) * 4;
          const ringG = this.add.graphics();
          ringG.lineStyle(2, 0x8b0000, 0.9);
          ringG.strokeCircle(rx, ry, 3);
          // Chromatin dot
          ringG.fillStyle(0x8b0000, 0.9);
          ringG.fillCircle(rx + 2, ry - 1, 1.2);

          this.infectedRBCs.push({ rbc: this.allRBCs[this.allRBCs.length - 1], ringG, rx, ry });
        }
      }
    }

    this.counterText.setText(`RBCs: ${this.totalRBCs} | Infected: 0 | 0.00%`);

    // Make all infected RBCs clickable
    this.infectedRBCs.forEach((item, index) => {
      const hitZone = this.add.circle(item.rbc.x, item.rbc.y, item.rbc.radius + 2, 0xffffff, 0);
      hitZone.setInteractive({ useHandCursor: true });
      hitZone.on('pointerdown', () => this.countInfected(item, index));
      hitZone.on('pointerover', () => {
        if (!item.rbc.counted) {
          item.ringG.clear();
          item.ringG.lineStyle(2, 0x00ff00, 0.5);
          item.ringG.strokeCircle(item.rx, item.ry, 3);
        }
      });
      hitZone.on('pointerout', () => {
        if (!item.rbc.counted) {
          item.ringG.clear();
          item.ringG.lineStyle(2, 0x8b0000, 0.9);
          item.ringG.strokeCircle(item.rx, item.ry, 3);
          item.ringG.fillStyle(0x8b0000, 0.9);
          item.ringG.fillCircle(item.rx + 2, item.ry - 1, 1.2);
        }
      });
    });
  }

  countInfected(item, index) {
    if (item.rbc.counted) return;
    item.rbc.counted = true;
    this.infectedFound++;

    // Visual feedback - turn green
    item.ringG.clear();
    item.ringG.lineStyle(2, 0x00ff00, 1);
    item.ringG.strokeCircle(item.rx, item.ry, 3);
    item.ringG.fillStyle(0x00ff00, 0.8);
    item.ringG.fillCircle(item.rx + 2, item.ry - 1, 1.2);

    // Pulse animation
    const pulse = this.add.circle(item.rbc.x, item.rbc.y, item.rbc.radius, 0x00ff00, 0.25);
    this.tweens.add({
      targets: pulse,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => pulse.destroy()
    });

    const percentage = parseFloat(((this.infectedFound / this.totalRBCs) * 100).toFixed(2));
    this.counterText.setText(`RBCs: ${this.totalRBCs} | Infected: ${this.infectedFound} | ${percentage}%`);

    // Check if all infected cells found
    if (this.infectedFound >= this.infectedRBCs.length) {
      this.counterText.setText(`✓ All infected RBCs found! ${percentage}% parasitemia`);
      this.onComplete(this.infectedFound, this.totalRBCs, percentage);
    }
  }
}

// ============================================================
// SCENE 5: CULTURE LAB - Media selection and colony growth
// ============================================================
export class CultureScene extends Phaser.Scene {
  constructor() {
    super('CultureScene');
    this.disease = null;
    this.selectedMedia = null;
    this.colonies = [];
  }

  init(data) {
    this.disease = data.disease || null;
    this.patient = data.patient || null;
    this.onFinish = data.onFinish || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x2a2a3e).setOrigin(0);

    // Title
    this.add.text(width / 2, 15, 'Culture Laboratory', {
      fontSize: '16px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.instructionText = this.add.text(width / 2, 35, 'Select a culture media plate:', {
      fontSize: '12px', color: '#aaa'
    }).setOrigin(0.5, 0);

    // Petri dishes display area
    this.dishArea = this.add.container(width / 2, height / 2 - 20);

    // Draw empty petri dish
    this.petriDish = this.add.graphics();
    this.petriDish.lineStyle(3, 0x888888, 0.8);
    this.petriDish.strokeEllipse(0, 0, 200, 120);
    this.petriDish.fillStyle(0xeeeeee, 0.15);
    this.petriDish.fillEllipse(0, 0, 196, 116);
    this.dishArea.add(this.petriDish);

    // Media name label
    this.mediaLabel = this.add.text(0, -10, 'No media selected', {
      fontSize: '13px', color: '#888'
    }).setOrigin(0.5);
    this.dishArea.add(this.mediaLabel);

    // Colonies container (initially empty)
    this.colonyContainer = this.add.container(0, 0);
    this.dishArea.add(this.colonyContainer);

    // Growth label
    this.growthLabel = this.add.text(0, 40, '', {
      fontSize: '11px', color: '#aaa'
    }).setOrigin(0.5);
    this.dishArea.add(this.growthLabel);

    // Media selection buttons
    const plateY = height - 50;
    MEDIA_OPTIONS.forEach((media, i) => {
      const px = 40 + i * (width - 80) / MEDIA_OPTIONS.length;
      const plate = this.add.rectangle(px, plateY, (width - 100) / MEDIA_OPTIONS.length - 10, 60, media.color, 0.8);
      plate.setStrokeStyle(2, 0xffffff, 0.3);
      plate.setInteractive({ useHandCursor: true });

      const label = this.add.text(px, plateY - 15, media.label, {
        fontSize: '10px', color: '#fff', fontStyle: 'bold'
      }).setOrigin(0.5);

      const desc = this.add.text(px, plateY + 5, media.description, {
        fontSize: '7px', color: '#ddd'
      }).setOrigin(0.5);

      plate.on('pointerdown', () => this.selectMedia(media, plate));
      plate.on('pointerover', () => plate.setStrokeStyle(2, 0xffff00));
      plate.on('pointerout', () => plate.setStrokeStyle(2, 0xffffff, 0.3));
    });

    // Inoculation loop indicator
    this.loop = this.add.text(10, height - 8, '🔄 Inoculation loop ready', {
      fontSize: '10px', color: '#666'
    });
  }

  selectMedia(media, plateElement) {
    if (this.selectedMedia === media.id) return;
    this.selectedMedia = media.id;
    this.mediaLabel.setText(media.id);

    // Visual feedback
    this.dishArea.setScale(1);
    this.tweens.add({
      targets: this.dishArea,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 200,
      yoyo: true
    });

    // Clear previous colonies
    this.colonyContainer.removeAll(true);
    this.colonies = [];

    // Check if correct media
    const pathogen = this.disease?.pathogen;
    const correctMedia = CORRECT_MEDIA_MAP[pathogen];
    const colonyInfo = COLONY_APPEARANCES[pathogen];

    if (correctMedia === media.id && colonyInfo) {
      this.growthLabel.setText('✓ Growth observed!');
      this.growthLabel.setColor('#44ff44');
      this.loop.setText('🔄 Inoculation complete - colonies forming...');
      this.growColonies(colonyInfo);
    } else if (correctMedia === null && colonyInfo) {
      // Organism doesn't grow on standard media
      this.growthLabel.setText('No growth after 48 hours');
      this.growthLabel.setColor('#ffaa44');
      // Still call onFinish with no growth
      const result = { media: this.selectedMedia, growth: false, description: 'No growth observed' };
      this.onFinish(result);
    } else {
      this.growthLabel.setText('No growth observed');
      this.growthLabel.setColor('#ff6666');
      // Show a few contaminant colonies
      this.growContaminants();
      const result = { media: this.selectedMedia, growth: false, description: 'No growth observed (contaminants)' };
      this.onFinish(result);
    }

    // Highlight selected
    if (this.lastPlate) this.lastPlate.setStrokeStyle(2, 0xffffff, 0.3);
    if (plateElement) {
      plateElement.setStrokeStyle(3, 0xffff00, 0.8);
      this.lastPlate = plateElement;
    }
  }

  growColonies(colonyInfo) {
    const numColonies = 15 + Math.floor(Math.random() * 15);

    for (let i = 0; i < numColonies; i++) {
      const cx = Phaser.Math.Between(-80, 80);
      const cy = Phaser.Math.Between(-45, 45);
      const size = 3 + Math.random() * 6;

      const colony = this.add.graphics();

      // Base colony
      colony.fillStyle(colonyInfo.color, 0.7);
      colony.fillCircle(cx, cy, size);

      // Colony center (darker)
      colony.fillStyle(colonyInfo.color, 0.5);
      colony.fillCircle(cx - 1, cy - 1, size * 0.5);

      // Beta hemolysis for Strep pyogenes
      if (colonyInfo.hemolysis === 'beta') {
        colony.lineStyle(2, 0xffffcc, 0.2);
        colony.strokeCircle(cx, cy, size + 8);
      }

      // Alpha hemolysis for Strep pneumoniae
      if (colonyInfo.hemolysis === 'alpha') {
        colony.lineStyle(2, 0x88ff88, 0.15);
        colony.strokeCircle(cx, cy, size + 6);
      }

      // Start tiny and grow
      colony.setScale(0.1);
      this.colonies.push(colony);
      this.colonyContainer.add(colony);

      // Staggered growth animation
      this.tweens.add({
        targets: colony,
        scaleX: 1,
        scaleY: 1,
        duration: 600 + Math.random() * 400,
        delay: i * 50,
        ease: 'Back.easeOut'
      });
    }

    // Store result and call onFinish after animations complete
    const result = {
      media: this.selectedMedia,
      growth: true,
      colonyCount: numColonies,
      description: colonyInfo.description,
      hemolysis: colonyInfo.hemolysis
    };
    // Delay to allow all colonies to finish growing visually
    this.time.delayedCall(1000, () => {
      this.onFinish(result);
    });
  }

  growContaminants() {
    const numColonies = 2 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numColonies; i++) {
      const cx = Phaser.Math.Between(-60, 60);
      const cy = Phaser.Math.Between(-30, 30);
      const colony = this.add.graphics();
      colony.fillStyle(0x88aa88, 0.3);
      colony.fillCircle(cx, cy, 2 + Math.random() * 3);
      colony.setScale(0.1);
      this.colonies.push(colony);
      this.colonyContainer.add(colony);

      this.tweens.add({
        targets: colony,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: i * 100
      });
    }
    // Call onFinish after contaminants appear (no growth, but we still pass a result)
    this.time.delayedCall(500, () => {
      const result = { media: this.selectedMedia, growth: false, description: 'No growth observed (contaminants)' };
      this.onFinish(result);
    });
  }

  reset() {
    this.selectedMedia = null;
    this.colonyContainer.removeAll(true);
    this.colonies = [];
    this.mediaLabel.setText('No media selected');
    this.growthLabel.setText('');
    this.loop.setText('🔄 Inoculation loop ready');
  }
}

// ============================================================
// SCENE 6: PATIENT EXAMINATION ROOM
// ============================================================
export class PatientExamScene extends Phaser.Scene {
  constructor() {
    super('PatientExamScene');
    this.findings = {};
  }

  init(data) {
    this.exam = data.exam || {};
    this.onLog = data.onLog || (() => {});
    this.onSave = data.onSave || (() => {});
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xd0e8f2).setOrigin(0);

    // Examination bed
    this.add.rectangle(width / 2, height - 20, width - 20, 30, 0x4477aa, 0.3);
    this.add.text(width / 2, 8, 'Patient Examination', {
      fontSize: '14px', color: '#333', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // Patient body
    const g = this.add.graphics();

    // Body (torso)
    g.fillStyle(0xffddbb, 1);
    g.fillRoundedRect(width / 2 - 50, 150, 100, 160, 20);
    g.lineStyle(2, 0xccaa88, 0.5);
    g.strokeRoundedRect(width / 2 - 50, 150, 100, 160, 20);

    // Head
    g.fillStyle(0xffddbb, 1);
    g.fillCircle(width / 2, 90, 45);
    g.lineStyle(2, 0xccaa88, 0.5);
    g.strokeCircle(width / 2, 90, 45);

    // Eyes
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(width / 2 - 12, 85, 8);
    g.fillCircle(width / 2 + 12, 85, 8);
    g.fillStyle(0x444444, 0.8);
    g.fillCircle(width / 2 - 12, 85, 4);
    g.fillCircle(width / 2 + 12, 85, 4);

    // Mouth
    g.lineStyle(2, 0xcc8888, 0.6);
    g.beginPath();
    g.arc(width / 2, 105, 12, 0.2, Math.PI - 0.2, false);
    g.strokePath();

    // Arms
    g.fillStyle(0xffddbb, 1);
    g.fillRoundedRect(width / 2 - 80, 155, 30, 120, 10);
    g.fillRoundedRect(width / 2 + 50, 155, 30, 120, 10);

    // Legs
    g.fillRoundedRect(width / 2 - 40, 310, 30, 100, 10);
    g.fillRoundedRect(width / 2 + 10, 310, 30, 100, 10);

    // Clickable body regions with labels
    const regions = [
      { id: 'head', x: width / 2, y: 85, r: 30, label: 'Head' },
      { id: 'eyes', x: width / 2, y: 85, r: 15, label: 'Eyes' },
      { id: 'throat', x: width / 2, y: 140, r: 15, label: 'Throat' },
      { id: 'chest', x: width / 2, y: 190, r: 25, label: 'Chest' },
      { id: 'abdomen', x: width / 2, y: 250, r: 25, label: 'Abdomen' },
      { id: 'skin', x: width / 2 - 65, y: 225, w: 20, h: 70, label: 'Skin' }
    ];

    // Region labels
    regions.forEach(reg => {
      const lbl = this.add.text(reg.x, reg.y, '', {
        fontSize: '8px', color: '#0066cc', fontStyle: 'bold'
      }).setOrigin(0.5);
      lbl.setAlpha(0);

      let zone;
      if (reg.r) {
        zone = this.add.circle(reg.x, reg.y, reg.r + 5, 0x00ff00, 0.01);
      } else {
        zone = this.add.rectangle(reg.x, reg.y, reg.w + 10, reg.h + 10, 0x00ff00, 0.01);
      }

      zone.setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        lbl.setText(reg.label);
        lbl.setAlpha(1);
        zone.setAlpha(0.08);
      });

      zone.on('pointerout', () => {
        lbl.setAlpha(0);
        zone.setAlpha(0.01);
      });

      zone.on('pointerdown', () => {
        // Highlight effect
        const highlight = this.add.circle(reg.x, reg.y, reg.r || Math.max(reg.w, reg.h) / 2, 0x00aaff, 0.35);
        this.tweens.add({
          targets: highlight,
          scaleX: 1.8,
          scaleY: 1.8,
          alpha: 0,
          duration: 500,
          onComplete: () => highlight.destroy()
        });

        const finding = this.exam[reg.id] || 'Normal';
        this.findings[reg.id] = finding;
        this.onLog(reg.id, finding);

        // Show finding floating text
        const ft = this.add.text(reg.x, reg.y - 20, finding, {
          fontSize: '9px', color: '#006600', fontStyle: 'bold', backgroundColor: '#ffffffaa',
          padding: { x: 4, y: 2 }
        }).setOrigin(0.5);
        this.tweens.add({
          targets: ft,
          y: ft.y - 30,
          alpha: 0,
          duration: 2000,
          onComplete: () => ft.destroy()
        });
      });
    });

    this.findingsText = this.add.text(width / 2, height - 8, 'Click body regions to examine', {
      fontSize: '10px', color: '#888'
    }).setOrigin(0.5, 0.5);

    // Findings counter
    this.add.text(width - 10, height - 8, '6 regions', {
      fontSize: '9px', color: '#aaa'
    }).setOrigin(1, 0.5);
  }
}

// ============================================================
// SCENE 7: OUTCOME SCENE - Patient recovery visualization
// ============================================================
export class OutcomeScene extends Phaser.Scene {
  constructor() {
    super('OutcomeScene');
  }

  init(data) {
    this.patient = data.patient || null;
    this.vitalsHistory = data.vitalsHistory || [];
  }

  create() {
    const { width, height } = this.cameras.main;
    const bgColor = this.patient?.treatmentPlan?.score === 'correct' ? 0x1a2e1a : 0x2e1a1a;
    this.add.rectangle(0, 0, width, height, bgColor).setOrigin(0);

    this.add.text(width / 2, 20, `Outcome: ${this.patient?.name || 'Patient'}`, {
      fontSize: '16px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // Recovery arrow
    const g = this.add.graphics();
    g.lineStyle(3, 0x44ff44, 0.6);
    const data = this.vitalsHistory;
    if (data.length > 1) {
      g.beginPath();
      data.forEach((point, i) => {
        const x = (width - 40) * (i / (data.length - 1)) + 20;
        const y = height - 40 - (point.temp / 42) * (height - 80);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.strokePath();
    }

    // Day markers
    data.forEach((point, i) => {
      const x = (width - 40) * (i / (data.length - 1)) + 20;
      this.add.text(x, height - 22, `D${point.day}`, {
        fontSize: '9px', color: '#888'
      }).setOrigin(0.5, 0);
    });

    // Status indicator
    const status = this.patient?.treatmentPlan?.score === 'correct' ? '✓ RECOVERED' :
      this.patient?.treatmentPlan?.score === 'partial' ? '⚠ IMPROVING' : '✗ DETERIORATING';
    const statusColor = this.patient?.treatmentPlan?.score === 'correct' ? '#44ff44' :
      this.patient?.treatmentPlan?.score === 'partial' ? '#ffaa00' : '#ff4444';

    this.add.text(width / 2, height / 2, status, {
      fontSize: '24px', color: statusColor, fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Stats
    const lastVitals = data[data.length - 1];
    if (lastVitals) {
      this.add.text(width / 2, height / 2 + 30, `Final Temp: ${lastVitals.temp}°C | HR: ${lastVitals.hr} | O2: ${lastVitals.o2sat}%`, {
        fontSize: '11px', color: '#ccc'
      }).setOrigin(0.5, 0.5);
    }
  }
}

// ============================================================
// SCENE REGISTRY & EXPORTS
// ============================================================
export const ALL_SCENES = [
  MicroscopeScene,
  GramStainScene,
  AcidFastScene,
  BloodSmearScene,
  CultureScene,
  PatientExamScene,
  OutcomeScene
];

export const SCENE_NAMES = {
  microscope: 'MicroscopeScene',
  gram: 'GramStainScene',
  acidfast: 'AcidFastScene',
  bloodsmear: 'BloodSmearScene',
  culture: 'CultureScene',
  exam: 'PatientExamScene',
  outcome: 'OutcomeScene'
};