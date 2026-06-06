// src/Simulations/MicrobeRPG/PhaserScenes.js
import Phaser from 'phaser';
import { DISEASES, MEDIA_OPTIONS, CORRECT_MEDIA_MAP, COLONY_APPEARANCES, STAIN_STEPS } from './gameData.js';

// ============================================================
// MICROSCOPE SCENE (Accurate Morphology & Arrangements)
// ============================================================
export class MicroscopeScene extends Phaser.Scene {
  constructor() {
    super(); 
    this.zoom = 1;
    this.focus = 10; // Start out of focus
    this.light = 80;
    this.organisms = [];
  }

  init(data) {
    this.patient = data.patient;
    this.disease = data.patient ? DISEASES[data.patient.diseaseId] : null;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x111118).setOrigin(0);

    // Microscope lens mask
    const lens = this.make.graphics();
    lens.fillStyle(0xffffff);
    lens.fillCircle(width / 2, height / 2, Math.min(width, height) * 0.45);
    const mask = new Phaser.Display.Masks.BitmapMask(this, lens);

    this.viewport = this.add.container(width / 2, height / 2);
    this.viewport.setMask(mask);

    // Light background
    this.bgLight = this.add.circle(0, 0, 400, 0xe2ecee); 
    this.viewport.add(this.bgLight);

    // Debris for realism
    const debrisGraphics = this.add.graphics();
    debrisGraphics.fillStyle(0xccdadd, 0.4);
    for(let i = 0; i < 40; i++) {
      debrisGraphics.fillCircle(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-350, 350), Phaser.Math.Between(5, 30));
    }
    this.viewport.add(debrisGraphics);

    this.stage = this.add.container(0, 0);
    this.viewport.add(this.stage);

    // Blur filter
    this.blurFilter = this.cameras.main.postFX.addBlur();

    this.spawnOrganisms();

    // Panning
    const hitArea = this.add.rectangle(width / 2, height / 2, 800, 800, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.stage.x = Phaser.Math.Clamp(this.stage.x + (pointer.x - pointer.prevPosition.x), -250, 250);
        this.stage.y = Phaser.Math.Clamp(this.stage.y + (pointer.y - pointer.prevPosition.y), -250, 250);
      }
    });

    // Scientific HUD
    this.hudBg = this.add.rectangle(width / 2, height - 40, 450, 40, 0x000000, 0.7).setStrokeStyle(1, 0x4ade80);
    this.hudText = this.add.text(width / 2, height - 40, 'Initializing Optics...', {
      fontSize: '14px', color: '#4ade80', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.applyLight();
    this.updateBlur();
    this.events.emit('scene-ready', { type: 'microscope' });
  }

  // ------------------------------------------------------------
  // Core drawing methods for accurate shapes & arrangements
  // ------------------------------------------------------------
  getShapeForPathogen(pathogen) {
    if (!pathogen) return 'cocci';
    switch(pathogen) {
      case 'Streptococcus pyogenes':
      case 'Streptococcus pneumoniae':
      case 'Neisseria meningitidis':
        return 'cocci';
      case 'Escherichia coli':
      case 'Mycobacterium tuberculosis':
        return 'bacilli';
      case 'Candida albicans':
        return 'yeast';
      case 'Plasmodium falciparum':
        return 'ring_form';
      default:
        return 'cocci';
    }
  }

  getGramColor(pathogen) {
    switch(pathogen) {
      case 'Streptococcus pyogenes':
      case 'Streptococcus pneumoniae':
      case 'Candida albicans':
        return 0x4b0082; // purple (Gram+)
      case 'Escherichia coli':
      case 'Neisseria meningitidis':
        return 0xff1493; // pink (Gram-)
      case 'Mycobacterium tuberculosis':
        return 0xdc143c; // red (acid-fast)
      default:
        return 0xcccccc;
    }
  }

  getArrangement() {
    if (!this.disease) return 'single';
    // Use correctChecklist.arrangement from disease data if available
    const correct = this.disease.correctChecklist;
    if (correct && correct.arrangement) return correct.arrangement;
    // Fallback based on pathogen
    const pathogen = this.disease.pathogen;
    switch(pathogen) {
      case 'Streptococcus pyogenes': return 'chains';
      case 'Streptococcus pneumoniae': return 'pairs';
      case 'Neisseria meningitidis': return 'pairs';
      case 'Escherichia coli': return 'single';
      case 'Mycobacterium tuberculosis': return 'single';
      case 'Candida albicans': return 'clusters';
      default: return 'single';
    }
  }

  drawOrganism(pathogen) {
    const shape = this.getShapeForPathogen(pathogen);
    const arrangement = this.getArrangement();
    const group = this.add.container(0, 0);
    const color = this.getGramColor(pathogen);
    const opacity = 0.9;

    if (shape === 'cocci') {
      // Cocci are circles
      const radius = 4;
      if (arrangement === 'chains') {
        const count = Phaser.Math.Between(4, 8);
        for (let i = 0; i < count; i++) {
          const x = i * (radius * 2 + 2) - (count-1)*(radius+1);
          const circle = this.add.circle(x, 0, radius, color, opacity);
          group.add(circle);
        }
      } else if (arrangement === 'pairs') {
        const left = this.add.circle(-(radius+1), 0, radius, color, opacity);
        const right = this.add.circle(radius+1, 0, radius, color, opacity);
        group.add([left, right]);
      } else if (arrangement === 'clusters') {
        // Irregular cluster of 5-8 cells
        const count = Phaser.Math.Between(5, 8);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const rad = Phaser.Math.Between(2, radius*2);
          const x = Math.cos(angle) * rad;
          const y = Math.sin(angle) * rad;
          const circle = this.add.circle(x, y, radius, color, opacity);
          group.add(circle);
        }
      } else {
        // single
        group.add(this.add.circle(0, 0, radius, color, opacity));
      }
    } 
    else if (shape === 'bacilli') {
      // Rods: rectangles with rounded appearance (we use rectangle)
      const length = Phaser.Math.Between(12, 18);
      const width = 5;
      if (arrangement === 'chains') {
        const count = Phaser.Math.Between(3, 6);
        for (let i = 0; i < count; i++) {
          const x = i * (length - 2) - (count-1)*(length/2);
          const rect = this.add.rectangle(x, 0, length, width, color, opacity);
          group.add(rect);
        }
      } else {
        const rect = this.add.rectangle(0, 0, length, width, color, opacity);
        group.add(rect);
      }
    }
    else if (shape === 'yeast') {
      // Oval with budding
      const body = this.add.ellipse(0, 0, 12, 8, 0x6a0dad, opacity);
      const bud = this.add.circle(8, -4, 4, 0x8e5db3, opacity);
      group.add([body, bud]);
    }
    else if (shape === 'ring_form') {
      // Malaria ring form inside pale RBC
      const rbc = this.add.circle(0, 0, 10, 0xffaaaa, 0.5);
      const ring = this.add.ellipse(0, 0, 8, 6, 0x4b0082, 1);
      ring.setStrokeStyle(1, 0x8b008b);
      group.add([rbc, ring]);
    }
    else {
      // fallback dot
      group.add(this.add.circle(0, 0, 3, 0xcccccc, opacity));
    }
    return group;
  }

  spawnOrganisms() {
    const pathogen = this.disease ? this.disease.pathogen : null;
    if (!pathogen || this.disease?.type === 'virus') return;

    const count = 60;
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(-350, 350);
      const y = Phaser.Math.Between(-350, 350);
      const organism = this.drawOrganism(pathogen);
      if (organism) {
        organism.setPosition(x, y);
        organism.setRotation(Math.random() * Math.PI * 2);
        this.organisms.push(organism);
        this.stage.add(organism);

        // Gentle Brownian motion
        this.tweens.add({
          targets: organism,
          x: x + Phaser.Math.Between(-15, 15),
          y: y + Phaser.Math.Between(-15, 15),
          rotation: organism.rotation + Phaser.Math.Between(-0.2, 0.2),
          duration: Phaser.Math.Between(2500, 4500),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  // ------------------------------------------------------------
  // Microscope controls and HUD
  // ------------------------------------------------------------
  applyLight() { 
    this.bgLight.setAlpha(Math.min(1, this.light / 80)); 
  }
  
  updateBlur() {
    const focusDistance = Math.abs(50 - this.focus);
    if (this.blurFilter) {
      this.blurFilter.strength = (focusDistance / 50) * 4;
    }
    const actualZoom = 1 + (this.zoom - 1) * 0.4;
    this.viewport.setScale(actualZoom);

    // Update HUD text with morphology hints when resolved
    if (this.hudText) {
      if (this.disease?.type === 'virus' || !this.disease) {
        this.hudText.setText(`[MAG: ${this.zoom}x] Slide clear. No organisms detected.`);
        this.hudText.setColor('#4ade80');
        this.hudBg.setStrokeStyle(1, 0x4ade80);
      } else if (this.zoom < 3) {
        this.hudText.setText(`[MAG: ${this.zoom}x] Need more zoom to resolve structures.`);
        this.hudText.setColor('#facc15');
        this.hudBg.setStrokeStyle(1, 0xfacc15);
      } else if (focusDistance > 10) {
        this.hudText.setText(this.focus < 50 ? `[MAG: ${this.zoom}x] Out of focus. Increase fine focus.` : `[MAG: ${this.zoom}x] Out of focus. Decrease fine focus.`);
        this.hudText.setColor('#facc15');
        this.hudBg.setStrokeStyle(1, 0xfacc15);
      } else {
        const shape = this.getShapeForPathogen(this.disease.pathogen);
        let shapeText = '';
        switch(shape) {
          case 'cocci': shapeText = 'Cocci (spherical)'; break;
          case 'bacilli': shapeText = 'Bacilli (rod-shaped)'; break;
          case 'yeast': shapeText = 'Yeast (oval with buds)'; break;
          case 'ring_form': shapeText = 'Ring forms (intracellular)'; break;
          default: shapeText = 'Morphology visible';
        }
        this.hudText.setText(`[MAG: ${this.zoom}x] RESOLVED. ${shapeText}.`);
        this.hudText.setColor('#4ade80');
        this.hudBg.setStrokeStyle(1, 0x4ade80);
      }
    }
  }

  setZoom(val) { this.zoom = val; this.updateBlur(); }
  setFocus(val) { this.focus = val; this.updateBlur(); }
  setLight(val) { this.light = val; this.applyLight(); }
}

// ============================================================
// PATIENT EXAMINATION SCENE (Unchanged)
// ============================================================
export class PatientExamScene extends Phaser.Scene {
  constructor() { super(); this.findings = {}; }
  init(data) { this.exam = data.exam || {}; }
  create() {
    const { width, height } = this.cameras.main; const cx = width / 2;
    this.add.rectangle(0, 0, width, height, 0x1e293b).setOrigin(0);
    this.add.text(30, 30, 'Physical Examination', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' });
    this.add.text(30, 60, 'Click on the labeled regions to perform an assessment.', { fontSize: '14px', color: '#94a3b8' });

    const g = this.add.graphics();
    const skinTone = 0xdeaa88; const outline = 0x94a3b8;
    g.lineStyle(2, outline, 1); g.fillStyle(skinTone, 1);
    g.fillCircle(cx, 130, 45); g.strokeCircle(cx, 130, 45);
    g.fillStyle(0xffffff, 1); g.fillEllipse(cx - 15, 125, 14, 8); g.fillEllipse(cx + 15, 125, 14, 8);
    g.fillStyle(0x0f172a, 1); g.fillCircle(cx - 15, 125, 3); g.fillCircle(cx + 15, 125, 3);
    g.fillStyle(skinTone, 1); g.fillRect(cx - 15, 170, 30, 25); g.strokeRect(cx - 15, 170, 30, 25);
    g.fillRoundedRect(cx - 60, 190, 120, 170, 20); g.strokeRoundedRect(cx - 60, 190, 120, 170, 20);
    g.fillRoundedRect(cx - 95, 200, 30, 150, 15); g.strokeRoundedRect(cx - 95, 200, 30, 150, 15);
    g.fillRoundedRect(cx + 65, 200, 30, 150, 15); g.strokeRoundedRect(cx + 65, 200, 30, 150, 15);
    g.fillRoundedRect(cx - 55, 350, 45, 180, 20); g.strokeRoundedRect(cx - 55, 350, 45, 180, 20);
    g.fillRoundedRect(cx + 10, 350, 45, 180, 20); g.strokeRoundedRect(cx + 10, 350, 45, 180, 20);

    const regions = [
      { id: 'head', x: cx, y: 95, r: 25, label: 'Head / Scalp', labelX: cx - 180, labelY: 95 },
      { id: 'eyes', x: cx, y: 125, r: 15, label: 'Ocular / Eyes', labelX: cx + 180, labelY: 125 },
      { id: 'throat', x: cx, y: 180, r: 15, label: 'Oropharynx', labelX: cx - 180, labelY: 180 },
      { id: 'chest', x: cx, y: 240, r: 35, label: 'Thorax / Chest', labelX: cx + 180, labelY: 240 },
      { id: 'abdomen', x: cx, y: 310, r: 35, label: 'Abdomen', labelX: cx - 180, labelY: 310 },
      { id: 'skin', x: cx + 80, y: 270, r: 25, label: 'Dermatological', labelX: cx + 200, labelY: 310 }
    ];

    regions.forEach(reg => {
      const line = this.add.graphics();
      line.lineStyle(1, 0x4ade80, 0.5); line.beginPath(); line.moveTo(reg.labelX + (reg.labelX < cx ? 70 : -70), reg.labelY); line.lineTo(reg.x, reg.y); line.strokePath();
      const labelBg = this.add.rectangle(reg.labelX, reg.labelY, 140, 30, 0x0f172a, 0.9).setStrokeStyle(1, 0x4ade80);
      const labelText = this.add.text(reg.labelX, reg.labelY, reg.label, { fontSize: '12px', color: '#4ade80', fontFamily: 'monospace' }).setOrigin(0.5);
      let zone = this.add.circle(reg.x, reg.y, reg.r, 0x4ade80, 0);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => { zone.setFillStyle(0x4ade80, 0.3); labelBg.setFillStyle(0x4ade80, 1); labelText.setColor('#0f172a'); });
      zone.on('pointerout', () => { zone.setFillStyle(0x4ade80, 0); labelBg.setFillStyle(0x0f172a, 0.9); labelText.setColor('#4ade80'); });
      zone.on('pointerdown', () => {
        const finding = this.exam[reg.id] || 'Normal'; this.findings[reg.id] = finding;
        const isNormal = finding === 'Normal';
        const findingBg = this.add.rectangle(reg.labelX, reg.labelY + 28, 140, 25, isNormal ? 0x064e3b : 0x7f1d1d, 1).setOrigin(0.5).setStrokeStyle(1, isNormal ? 0x10b981 : 0xef4444);
        const findingText = this.add.text(reg.labelX, reg.labelY + 28, finding, { fontSize: '11px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        this.tweens.add({ targets: [findingBg, findingText], y: '-=15', alpha: 0, duration: 2500, ease: 'Power2', onComplete: () => { findingBg.destroy(); findingText.destroy(); } });
        this.events.emit('exam-finding', { region: reg.id, finding });
      });
    });
  }
}

// ============================================================
// GRAM STAIN SCENE (Enhanced Scientifically)
// ============================================================
export class GramStainScene extends Phaser.Scene {
  constructor() {
    super(); 
    this.errors = [];
    this.stepsCompleted = [];
  }

  init(data) {
    this.disease = data.disease;
    this.onFinish = data.onFinish;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xeeeeee).setOrigin(0);
    this.add.text(50, 50, 'Gram Stain Procedure', { fontSize: '24px', color: '#000' });

    this.slide = this.add.rectangle(width / 2, height / 2, 300, 150, 0xffffff).setStrokeStyle(2, 0x000000);
    this.bacteriaGraphics = this.add.graphics();
    this.drawBacteria();

    this.events.on('apply-chemical', (data) => {
      const chemical = data.chemicalName;
      this.stepsCompleted.push(chemical);
      this.playDropperAnimation(chemical);
    });
  }

  playDropperAnimation(chemical) {
    const colorMap = {
      'Crystal Violet': 0x6a0dad,
      'Gram\'s Iodine': 0x3d0c02,
      'Alcohol Decolorizer': 0xdddddd,
      'Safranin': 0xff1493
    };
    
    // Animate fake fluid drop
    const drop = this.add.circle(400, 200, 15, colorMap[chemical]);
    this.tweens.add({
      targets: drop,
      y: 300,
      scaleX: 5,
      scaleY: 0.5,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        drop.destroy();
        this.evaluateStep(chemical);
      }
    });
  }

  drawBacteria() {
    this.bacteriaGraphics.clear();
    const type = this.disease?.type;
    const pathogen = this.disease?.pathogen;
    
    // Wash away non-applicable organisms
    if (this.stepsCompleted.includes('Alcohol Decolorizer')) {
      if (type === 'virus') return; // Viruses wash away entirely
    }

    const color = this.stepsCompleted.includes('Safranin') ? 0xff69b4 : (this.stepsCompleted.includes('Crystal Violet') ? 0x6a0dad : 0xcccccc);
    
    if (type === 'protozoa') {
      // Draw messy eukaryotic debris
      this.bacteriaGraphics.fillStyle(color, 0.5);
      for (let i = 0; i < 15; i++) {
        this.bacteriaGraphics.fillEllipse(400 + (Math.random()-0.5)*200, 300 + (Math.random()-0.5)*100, 20 + Math.random()*15, 15 + Math.random()*15);
      }
    } else if (pathogen === 'Mycobacterium tuberculosis') {
      // Ghost cells (poorly stained)
      this.bacteriaGraphics.lineStyle(1, color, 0.3);
      for (let i = 0; i < 30; i++) {
        this.bacteriaGraphics.strokeRect(400 + (Math.random()-0.5)*200, 300 + (Math.random()-0.5)*100, 8, 3);
      }
    } else if (type === 'bacteria') {
      // Normal bacteria
      this.bacteriaGraphics.fillStyle(color, 0.8);
      for (let i = 0; i < 50; i++) {
        this.bacteriaGraphics.fillCircle(400 + (Math.random() - 0.5) * 200, 300 + (Math.random() - 0.5) * 100, 3);
      }
    }
  }

  evaluateStep(chemical) {
    const expectedOrder = STAIN_STEPS.gram.map(s => s.name);
    const idx = expectedOrder.indexOf(chemical);
    if (idx !== this.stepsCompleted.length - 1) {
      this.errors.push(`Out of order: ${chemical} applied before ${expectedOrder[this.stepsCompleted.length - 1] || 'finish'}`);
    }
    if (chemical === 'Alcohol Decolorizer' && !this.stepsCompleted.includes('Gram\'s Iodine')) {
      this.errors.push('Decolorizer applied before iodine mordant');
    }
    if (chemical === 'Safranin') {
      const finalGram = this.determineGramResult();
      this.onFinish?.(finalGram, this.errors);
      this.events.emit('procedure-complete', { result: finalGram, errors: this.errors });
      this.add.text(400, 500, `Result: ${finalGram}`, { fontSize: '18px', color: '#000', backgroundColor: '#fff', padding: 4 }).setOrigin(0.5);
    }
    this.drawBacteria();
  }

  determineGramResult() {
    if (!this.disease) return 'unknown';
    if (this.disease.type === 'virus') return 'No organisms visible (Viral agents do not stain)';
    if (this.disease.type === 'protozoa') return 'Atypical eukaryotic cells/debris seen';
    if (this.disease.pathogen === 'Mycobacterium tuberculosis') return 'Weakly Gram+ / Ghost Cells';
    
    const correct = this.disease.observations.gram;
    if (this.errors.length > 2) return correct === 'gram_positive' ? 'gram_negative' : 'gram_positive';
    return correct;
  }
}

// ============================================================
// ACID FAST SCENE (Interactive & Accurate)
// ============================================================
export class AcidFastScene extends Phaser.Scene {
  constructor() {
    super(); 
    this.step = 0;
  }

  init(data) {
    this.disease = data.disease;
    this.onFinish = data.onFinish;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xeeeeee).setOrigin(0);
    this.add.text(50, 50, 'Acid-Fast (Ziehl-Neelsen) Stain', { fontSize: '24px', color: '#000' });

    this.slide = this.add.rectangle(width / 2, height / 2, 300, 150, 0xffffff).setStrokeStyle(2, 0x000000);
    this.bacteriaGraphics = this.add.graphics();
    this.drawBacteria();

    this.events.on('apply-step', (data) => {
      this.playDropperAnimation(data.stepNumber);
    });
  }

  playDropperAnimation(stepNumber) {
    const colorMap = { 1: 0xff0000, 2: 0xcc0000, 3: 0xdddddd, 4: 0x0000cc };
    const drop = this.add.circle(400, 200, 15, colorMap[stepNumber]);
    
    this.tweens.add({
      targets: drop, y: 300, scaleX: 5, scaleY: 0.5, alpha: 0, duration: 500,
      onComplete: () => {
        drop.destroy();
        this.step = stepNumber;
        this.evaluateStep();
      }
    });
  }

  evaluateStep() {
    if (this.step === 4) {
      let result = 'negative';
      if (this.disease?.type === 'virus' || this.disease?.type === 'protozoa') result = 'No cells visible';
      else if (this.disease?.observations?.acidFast === 'positive') result = 'positive';
      
      this.onFinish?.(result);
      this.events.emit('procedure-complete', { result });
      this.add.text(400, 500, `Acid-Fast: ${result}`, { fontSize: '20px', color: '#000' }).setOrigin(0.5);
    }
    this.drawBacteria();
  }

  drawBacteria() {
    this.bacteriaGraphics.clear();
    const type = this.disease?.type;
    
    // Wash away non-bacteria
    if (this.step >= 3 && (type === 'virus' || type === 'protozoa')) return;

    let color = 0xdddddd;
    if (this.step === 4) {
      color = this.disease?.observations?.acidFast === 'positive' ? 0xff0000 : 0x0000cc; // Non-AFB turn blue!
    } else if (this.step >= 1) {
      color = 0xff0000;
    }

    this.bacteriaGraphics.fillStyle(color, 0.8);
    for (let i = 0; i < 50; i++) {
      this.bacteriaGraphics.fillRoundedRect(350 + Math.random() * 100, 250 + Math.random() * 100, 8, 3, 1);
    }
  }
}

// ============================================================
// BLOOD SMEAR SCENE (Automated Scanning)
// ============================================================
export class BloodSmearScene extends Phaser.Scene {
  constructor() {
    super(); 
    this.totalCells = 0;
    this.infectedCells = 0;
    this.cellsArray = [];
  }

  init(data) {
    this.patient = data.patient;
    this.onComplete = data.onComplete;
    this.disease = this.patient ? DISEASES[this.patient.diseaseId] : null;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xfef5e7).setOrigin(0);
    this.add.text(50, 50, 'Blood Smear Examination', { fontSize: '24px', color: '#000' });
    this.add.text(50, 90, 'Click [START AUTO-SCAN] to analyze 100 RBCs.', { fontSize: '16px', color: '#333' });

    this.scoreText = this.add.text(width - 200, 50, 'Total: 0 | Infected: 0', { fontSize: '18px', color: '#000' });
    this.stage = this.add.container(0, 0);

    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, 1200); 
      const y = Phaser.Math.Between(150, 800);
      const isInfected = (this.disease?.pathogen === 'Plasmodium falciparum' && Math.random() < 0.15);
      
      const cell = this.add.circle(x, y, 8, 0xffaaaa);
      
      this.tweens.add({
        targets: cell, y: y + Phaser.Math.Between(-5, 5), duration: Phaser.Math.Between(2000, 4000), yoyo: true, repeat: -1
      });
      
      this.stage.add(cell);
      this.cellsArray.push({ sprite: cell, isInfected });
    }

    const scanBtn = this.add.rectangle(width / 2, height - 50, 200, 40, 0x1976d2).setInteractive({ useHandCursor: true });
    const scanTxt = this.add.text(width / 2, height - 50, 'START AUTO-SCAN', { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    scanBtn.on('pointerdown', () => {
      scanBtn.destroy();
      scanTxt.destroy();
      this.startAutoScan();
    });
  }

  startAutoScan() {
    const cellsToScan = Phaser.Utils.Array.Shuffle(this.cellsArray).slice(0, 100);
    let currentIndex = 0;

    this.time.addEvent({
      delay: 40, // 40ms per cell = 4 seconds total scanning time
      callback: () => {
        if (currentIndex >= 100) return;

        const target = cellsToScan[currentIndex];
        this.totalCells++;

        if (target.isInfected) {
          this.infectedCells++;
          target.sprite.setFillStyle(0xff3333);
          this.stage.add(this.add.circle(target.sprite.x, target.sprite.y, 3, 0x4b0082).setDepth(1));
        } else {
          target.sprite.setFillStyle(0xcccccc); // Grey out healthy cells
        }

        this.scoreText.setText(`Total: ${this.totalCells} | Infected: ${this.infectedCells}`);

        // Lightly pan the camera toward the area currently being scanned
        this.cameras.main.pan(target.sprite.x, target.sprite.y, 100, 'Linear', false);

        currentIndex++;

        if (this.totalCells === 100) {
          this.cameras.main.pan(400, 300, 500, 'Power2'); // Return to center
          this.complete();
        }
      },
      repeat: 99
    });
  }

  complete() {
    const percentage = (this.infectedCells / 100) * 100;
    this.onComplete?.(this.infectedCells, 100, percentage);
    this.events.emit('scan-complete', { infected: this.infectedCells, total: 100, percentage });
    this.add.text(400, 500, `Parasitemia: ${percentage.toFixed(1)}%`, { fontSize: '20px', color: '#000', backgroundColor: '#fff', padding: 4 }).setOrigin(0.5);
  }
}

// ============================================================
// CULTURE SCENE (Interactive Streaking)
// ============================================================
export class CultureScene extends Phaser.Scene {
  constructor() {
    super(); 
    this.selectedMedia = null;
    this.isStreaking = false;
    this.streakCount = 0;
  }

  init(data) {
    this.disease = data.disease;
    this.patient = data.patient;
    this.onFinish = data.onFinish;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0xe8f0e8).setOrigin(0);
    this.instructionText = this.add.text(50, 50, 'Microbiology Culture: Select Media', { fontSize: '24px', color: '#000' });

    this.mediaButtons = [];
    const startY = 150;
    MEDIA_OPTIONS.forEach((media, idx) => {
      const btn = this.add.rectangle(150, startY + idx * 60, 200, 40, 0x4a6fa5).setInteractive({ useHandCursor: true });
      const txt = this.add.text(150, startY + idx * 60, media.label, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
      btn.on('pointerdown', () => this.startStreakingPhase(media));
      this.mediaButtons.push(btn, txt);
    });

    // Input logic for streaking
    this.input.on('pointermove', (pointer) => {
      if (this.isStreaking && pointer.isDown) {
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, 450, 300);
        if (dist < 140) { // Keep within the plate
          this.streakLines.fillCircle(pointer.x, pointer.y, 4);
          this.streakCount++;
          if (this.streakCount > 60) {
            this.isStreaking = false;
            this.showIncubationResult();
          }
        }
      }
    });
  }

  startStreakingPhase(media) {
    this.selectedMedia = media.id;
    this.mediaButtons.forEach(b => b.destroy());
    
    this.instructionText.setText(`Inoculating ${media.id}\nDrag your mouse across the plate in a zig-zag to streak.`);
    
    // Draw big plate
    this.plateBg = this.add.circle(450, 300, 150, media.color).setStrokeStyle(4, 0xcccccc);
    this.streakLines = this.add.graphics();
    this.streakLines.fillStyle(0x000000, 0.1);
    
    this.isStreaking = true;
    this.streakCount = 0;
  }

  showIncubationResult() {
    this.instructionText.setText('Incubating... (24 hours later)');
    this.streakLines.clear();

    const expectedMedia = CORRECT_MEDIA_MAP[this.disease?.pathogen];
    const isCorrect = (this.selectedMedia === expectedMedia);
    
    let growth = false;
    let description = 'No growth';
    let hemolysis = 'none';
    let colonyCount = 0;

    if (isCorrect && expectedMedia) {
      growth = true;
      colonyCount = 50 + Math.floor(Math.random() * 200);
      const appearance = COLONY_APPEARANCES[this.disease?.pathogen];
      if (appearance) {
        description = appearance.description;
        hemolysis = appearance.hemolysis || 'none';
      }
      // Draw simulated colonies along the streak lines
      this.streakLines.fillStyle(appearance?.color || 0xdddddd, 1);
      for(let i=0; i<40; i++) {
         const angle = Math.random() * Math.PI * 2;
         const r = Math.random() * 120;
         this.streakLines.fillCircle(450 + Math.cos(angle)*r, 300 + Math.sin(angle)*r, 3);
      }
    } else if (expectedMedia === null && this.disease?.type === 'virus') {
      description = 'No growth – viral agents require specialized cell culture.';
    } else if (expectedMedia === null && this.disease?.type === 'protozoa') {
      description = 'Parasite does not grow on routine bacterial agar.';
    } else {
      description = 'No growth – incorrect media selection for this pathogen.';
    }

    const result = { media: this.selectedMedia, growth, description, hemolysis, colonyCount };
    
    this.resultBox = this.add.rectangle(450, 500, 500, 100, 0xffffff, 0.9).setStrokeStyle(2, 0x000000);
    this.add.text(450, 500, `Result: ${growth ? 'Positive' : 'Negative'}\n${description}\nCFU: ~${colonyCount}`, { fontSize: '16px', color: '#333', align: 'center' }).setOrigin(0.5);
    
    this.onFinish?.(result);
    this.events.emit('culture-result', result);
  }
}