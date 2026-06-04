// src/Simulations/MicrobeRPG/MicrobeRPG.jsx
import React, { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';
import Phaser from 'phaser';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Howl } from 'howler';

// MUI Core
import {
  Box, Typography, Button, Paper, Select, MenuItem, FormControl, 
  InputLabel, List, ListItem, ListItemButton, ListItemText, Divider, 
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, Chip, LinearProgress
} from '@mui/material';

// MUI Icons
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';

// --------------------------------------------------------------
// 1. DATA LAYER: DISEASE DATABASE & REFERENCE DATA
// --------------------------------------------------------------

const DISEASES = {
  'strep-throat': {
    name: 'Streptococcal Pharyngitis', pathogen: 'Streptococcus pyogenes', type: 'bacteria',
    symptoms: ['Sore throat', 'Fever', 'Swollen tonsils', 'Painful swallowing'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Erythema, tonsillar exudate', chest: 'Clear', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'cocci', arrangement: 'chains', special: 'beta_hemolysis' },
    treatment: { drug: 'Amoxicillin', dose: '500mg', frequency: 'TID', days: 10 }
  },
  'uti': {
    name: 'Urinary Tract Infection', pathogen: 'Escherichia coli', type: 'bacteria',
    symptoms: ['Burning urination', 'Frequent urination', 'Lower abdominal pain'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Clear', abdomen: 'Suprapubic tenderness', skin: 'Normal' },
    observations: { gram: 'gram_negative', morphology: 'bacilli', arrangement: 'single', special: 'lactose_fermenter' },
    treatment: { drug: 'Ciprofloxacin', dose: '500mg', frequency: 'BID', days: 7 }
  },
  'pneumonia': {
    name: 'Community-Acquired Pneumonia', pathogen: 'Streptococcus pneumoniae', type: 'bacteria',
    symptoms: ['Cough', 'Fever', 'Chest pain', 'Shortness of breath'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Crackles in right lower lobe', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'cocci', arrangement: 'pairs', special: 'capsule' },
    treatment: { drug: 'Azithromycin', dose: '500mg', frequency: 'Daily', days: 5 }
  },
  'tuberculosis': {
    name: 'Pulmonary Tuberculosis', pathogen: 'Mycobacterium tuberculosis', type: 'bacteria',
    symptoms: ['Chronic cough', 'Night sweats', 'Weight loss', 'Hemoptysis'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Apical crepitations', abdomen: 'Normal', skin: 'Pale' },
    observations: { gram: 'none', acidFast: 'positive', morphology: 'bacilli', arrangement: 'single', special: 'slow_grower' },
    treatment: { drug: 'Rifampin', dose: '600mg', frequency: 'Daily', days: 180 }
  },
  'meningitis': {
    name: 'Bacterial Meningitis', pathogen: 'Neisseria meningitidis', type: 'bacteria',
    symptoms: ['Sudden high fever', 'Stiff neck', 'Severe headache', 'Confusion'],
    physicalExam: { head: 'Nuchal rigidity', eyes: 'Photophobia', throat: 'Normal', chest: 'Clear', abdomen: 'Normal', skin: 'Petechial rash' },
    observations: { gram: 'gram_negative', morphology: 'cocci', arrangement: 'pairs', special: 'intracellular' },
    treatment: { drug: 'Ceftriaxone', dose: '2g', frequency: 'BID', days: 7 }
  },
  'candidiasis': {
    name: 'Oral Candidiasis (Thrush)', pathogen: 'Candida albicans', type: 'fungi',
    symptoms: ['White patches in mouth', 'Loss of taste', 'Pain while eating'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'White curd-like plaques on tongue/palate', chest: 'Clear', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'yeast', arrangement: 'clusters', special: 'pseudohyphae' },
    treatment: { drug: 'Fluconazole', dose: '200mg', frequency: 'Daily', days: 7 }
  },
  'malaria': {
    name: 'Malaria', pathogen: 'Plasmodium falciparum', type: 'protozoa',
    symptoms: ['Cyclic fever', 'Chills', 'Sweats', 'Fatigue'],
    physicalExam: { head: 'Normal', eyes: 'Pallor', throat: 'Normal', chest: 'Clear', abdomen: 'Splenomegaly', skin: 'Jaundice' },
    observations: { gram: 'none', morphology: 'ring_form', arrangement: 'intracellular', special: 'parasitemia' },
    expectedParasitemia: 2.5,
    treatment: { drug: 'Artemisinin Combination', dose: 'Standard', frequency: 'BID', days: 3 }
  },
  'covid': {
    name: 'COVID-19', pathogen: 'SARS-CoV-2', type: 'virus',
    symptoms: ['Fever', 'Dry cough', 'Anosmia', 'Fatigue'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Mild erythema', chest: 'Bilateral diffuse wheezing', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'none', morphology: 'none', arrangement: 'none', special: 'none' }, 
    treatment: { drug: 'Supportive Care', dose: 'N/A', frequency: 'PRN', days: 14 }
  }
};

const MEDICATION_INVENTORY = {
  'Amoxicillin': { class: 'Penicillin', doseRange: ['250mg', '500mg', '1g'], freqRange: ['BID', 'TID'] },
  'Ciprofloxacin': { class: 'Fluoroquinolone', doseRange: ['250mg', '500mg'], freqRange: ['BID'] },
  'Azithromycin': { class: 'Macrolide', doseRange: ['250mg', '500mg'], freqRange: ['Daily'] },
  'Rifampin': { class: 'Antimycobacterial', doseRange: ['300mg', '600mg'], freqRange: ['Daily'] },
  'Ceftriaxone': { class: 'Cephalosporin', doseRange: ['1g', '2g'], freqRange: ['Daily', 'BID'] },
  'Fluconazole': { class: 'Antifungal', doseRange: ['100mg', '200mg', '400mg'], freqRange: ['Daily'] },
  'Artemisinin Combination': { class: 'Antimalarial', doseRange: ['Standard'], freqRange: ['BID'] },
  'Supportive Care': { class: 'General', doseRange: ['N/A'], freqRange: ['PRN'] },
  'Ibuprofen': { class: 'NSAID', doseRange: ['200mg', '400mg', '600mg'], freqRange: ['QID', 'PRN'] }
};

const DURATIONS = [3, 5, 7, 10, 14, 180];

const ORGANISM_TRAITS = {
  'Streptococcus pyogenes': { morphology: { cocci: 5, bacilli: -5 }, arrangement: { chains: 5, clusters: -2 }, stain: { gram_positive: 5 } },
  'Escherichia coli': { morphology: { bacilli: 5, cocci: -5 }, arrangement: { single: 3 }, stain: { gram_negative: 5 } },
  'Streptococcus pneumoniae': { morphology: { cocci: 5, bacilli: -5 }, arrangement: { pairs: 5 }, stain: { gram_positive: 5 } },
  'Mycobacterium tuberculosis': { morphology: { bacilli: 3 }, stain: { acid_fast: 10, gram_negative: -5, gram_positive: -5 } },
  'Neisseria meningitidis': { morphology: { cocci: 5 }, arrangement: { pairs: 5 }, stain: { gram_negative: 5 } },
  'Candida albicans': { morphology: { yeast: 10 }, stain: { gram_positive: 3 }, special: { pseudohyphae: 5 } },
  'Plasmodium falciparum': { special: { ring_form: 10, parasitemia: 10 } }
};

// --------------------------------------------------------------
// 2. PHASER LAB SCENES
// --------------------------------------------------------------

class MicroscopeScene extends Phaser.Scene {
  constructor() { 
    super('MicroscopeScene'); 
    this.zoom = 1; 
    this.focus = 50; 
    this.organisms = []; 
  }
  
  init(data) { 
    this.patient = data.patient; 
    this.disease = DISEASES[this.patient.diseaseId]; 
  }
  
  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
    
    // Lens Mask
    const lens = this.make.graphics();
    lens.fillStyle(0xffffff);
    lens.fillCircle(width/2, height/2, 200);
    const mask = new Phaser.Display.Masks.BitmapMask(this, lens);
    
    this.viewport = this.add.container(width/2, height/2);
    this.viewport.setMask(mask);
    
    // Light
    this.bgLight = this.add.circle(0, 0, 300, 0xdddddd);
    this.viewport.add(this.bgLight);

    // Draggable Stage
    this.stage = this.add.container(0, 0);
    this.viewport.add(this.stage);
    
    // Interactive drag area
    const hitArea = this.add.rectangle(0, 0, 800, 800, 0xffffff, 0);
    hitArea.setInteractive(new Phaser.Geom.Rectangle(-400, -400, 800, 800), Phaser.Geom.Rectangle.Contains);
    this.input.setDraggable(hitArea);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      this.stage.x = dragX - 400; 
      this.stage.y = dragY - 300;
    });

    this.spawnOrganisms();
    this.updateBlur();
  }

  spawnOrganisms() {
    const type = this.disease.pathogen;
    const count = 60;
    
    for(let i=0; i<count; i++) {
      let x = Phaser.Math.Between(-300, 300);
      let y = Phaser.Math.Between(-300, 300);
      let orgGraphic = this.add.graphics();
      
      if (type === 'Streptococcus pyogenes') {
        orgGraphic.fillStyle(0x6a0dad, 1);
        for(let j=0; j<Phaser.Math.Between(4,8); j++) orgGraphic.fillCircle(j*8, j*Phaser.Math.Between(-2,2), 5);
      } else if (type === 'Escherichia coli') {
        orgGraphic.fillStyle(0xff66bb, 1);
        orgGraphic.fillRoundedRect(0, 0, 15, 6, 3);
        // E. coli are motile! Give them a velocity vector.
        orgGraphic.vx = (Math.random() - 0.5) * 2;
        orgGraphic.vy = (Math.random() - 0.5) * 2;
      } else if (type === 'Streptococcus pneumoniae') {
        orgGraphic.fillStyle(0x6a0dad, 1);
        orgGraphic.fillCircle(0, 0, 5); orgGraphic.fillCircle(8, 0, 5);
      } else if (type === 'Candida albicans') {
        orgGraphic.fillStyle(0x4b0082, 1);
        orgGraphic.fillEllipse(0, 0, 12, 18);
        if(Math.random()>0.7) orgGraphic.fillEllipse(10, -10, 8, 12);
      } else if (type === 'Neisseria meningitidis') {
        orgGraphic.fillStyle(0xff66bb, 1);
        orgGraphic.fillCircle(0, 0, 4); orgGraphic.fillCircle(7, 0, 4);
      } else if (type === 'Mycobacterium tuberculosis') {
        orgGraphic.fillStyle(0x4444ff, 0.2); 
        orgGraphic.fillRect(0, 0, 12, 2);
      } else {
        // Default / empty field
        orgGraphic.fillStyle(0xffffff, 0);
        orgGraphic.fillCircle(0,0,1);
      }
      
      orgGraphic.setPosition(x, y);
      this.organisms.push(orgGraphic);
      this.stage.add(orgGraphic);
    }
  }

  update(time, delta) {
    // Animate organisms every frame!
    this.organisms.forEach(org => {
        // 1. Brownian Motion (everything jiggles slightly due to water molecules)
        org.x += (Math.random() - 0.5) * 0.8;
        org.y += (Math.random() - 0.5) * 0.8;

        // 2. Active Motility (Swimming for flagellated organisms like E. coli)
        if (this.disease.pathogen === 'Escherichia coli') {
            org.x += org.vx;
            org.y += org.vy;
            
            // Randomly change direction occasionally
            if(Math.random() < 0.02) {
                org.vx = (Math.random() - 0.5) * 2;
                org.vy = (Math.random() - 0.5) * 2;
            }
        }
    });
  }

  updateBlur() {
    const deviation = Math.abs(50 - this.focus);
    const alpha = Math.max(0.1, 1 - (deviation / 50));
    this.viewport.setAlpha(alpha);
    this.viewport.setScale(this.zoom);
  }
  
  setZoom(val) { this.zoom = val; this.updateBlur(); }
  setFocus(val) { this.focus = val; this.updateBlur(); }
}

class GramStainScene extends Phaser.Scene {
  constructor() { super('GramStainScene'); }
  init(data) { this.disease = DISEASES[data.patient.diseaseId]; }
  
  create() {
    const {width, height} = this.cameras.main;
    this.add.rectangle(0,0,width,height,0x222222).setOrigin(0);
    this.slide = this.add.rectangle(width/2, height/2, 300, 150, 0xdddddd).setStrokeStyle(4, 0xffffff);
    this.add.text(width/2, height/2 - 120, 'Gram Stain Protocol', { fontSize: '20px' }).setOrigin(0.5);
  }

  applyChemical(chemical, isCorrectResult, overDecolorized) {
    if(chemical === 'Crystal Violet') this.slide.setFillStyle(0x6a0dad);
    if(chemical === 'Iodine') this.slide.setFillStyle(0x3d0c02);
    if(chemical === 'Alcohol') this.slide.setFillStyle(0xdddddd);
    if(chemical === 'Safranin') {
      if(overDecolorized) this.slide.setFillStyle(0xff66bb);
      else this.slide.setFillStyle(isCorrectResult === 'gram_positive' ? 0x6a0dad : 0xff66bb);
    }
  }
}

class AcidFastScene extends Phaser.Scene {
  constructor() { super('AcidFastScene'); }
  init(data) { this.disease = DISEASES[data.patient.diseaseId]; }
  
  create() {
    const {width, height} = this.cameras.main;
    this.add.rectangle(0,0,width,height,0x1a1a2e).setOrigin(0);
    this.slide = this.add.rectangle(width/2, height/2, 300, 150, 0xdddddd).setStrokeStyle(4, 0xffffff);
    this.add.text(width/2, height/2 - 120, 'Acid Fast Stain', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);
  }

  applyChemical(step) {
    if(step === 1) this.slide.setFillStyle(0xff0000); 
    if(step === 2) this.slide.setFillStyle(0xaa0000); 
    if(step === 3) this.slide.setFillStyle(this.disease.observations.acidFast === 'positive' ? 0xffaaaa : 0xdddddd); 
    if(step === 4) this.slide.setFillStyle(this.disease.observations.acidFast === 'positive' ? 0x8844ff : 0x0000ff); 
  }
}

class BloodSmearScene extends Phaser.Scene {
  constructor() { super('BloodSmearScene'); this.infectedFound = 0; }
  init(data) { this.patient = data.patient; this.disease = DISEASES[this.patient.diseaseId]; }
  
  create() {
    const {width, height} = this.cameras.main;
    this.add.rectangle(0,0,width,height,0xfff5ee).setOrigin(0);
    this.counterText = this.add.text(10, 10, 'Parasites Found: 0', { fontSize: '18px', color: '#000' });
    
    const isMalaria = this.disease.pathogen === 'Plasmodium falciparum';
    
    for(let i=0; i<100; i++) {
      let x = Phaser.Math.Between(20, width-20);
      let y = Phaser.Math.Between(50, height-20);
      let rbc = this.add.circle(x, y, 14, 0xffaaaa).setStrokeStyle(1, 0xcc6666);
      
      if (isMalaria && Math.random() < 0.08) {
        let ring = this.add.circle(x, y, 4).setStrokeStyle(2, 0x8b0000);
        let dot = this.add.circle(x+3, y-1, 1, 0x8b0000);
        
        rbc.setInteractive({ useHandCursor: true });
        rbc.on('pointerdown', () => {
          if(!rbc.counted) {
            rbc.counted = true;
            ring.setStrokeStyle(2, 0x00ff00); dot.setFillStyle(0x00ff00);
            this.infectedFound++;
            this.counterText.setText(`Parasites Found: ${this.infectedFound}`);
          }
        });
      }
    }
  }
}

class PatientExamScene extends Phaser.Scene {
  constructor() { super('PatientExamScene'); }
  init(data) { this.exam = DISEASES[data.patient.diseaseId].physicalExam; this.onLog = data.onLog; }
  
  create() {
    const {width, height} = this.cameras.main;
    this.add.rectangle(0,0,width,height,0xd0e8f2).setOrigin(0);
    
    const g = this.add.graphics();
    g.lineStyle(4, 0x333333, 1);
    g.fillStyle(0xffddbb, 1);
    
    g.fillCircle(width/2, 100, 40); g.strokeCircle(width/2, 100, 40);
    g.fillRoundedRect(width/2 - 50, 150, 100, 150, 20); g.strokeRoundedRect(width/2 - 50, 150, 100, 150, 20);
    
    const regions = [
      { id: 'head', x: width/2, y: 80, r: 25 },
      { id: 'eyes', x: width/2, y: 100, r: 15 },
      { id: 'throat', x: width/2, y: 130, r: 15 },
      { id: 'chest', x: width/2, y: 180, r: 35 },
      { id: 'abdomen', x: width/2, y: 260, r: 35 },
      { id: 'skin', x: width/2 - 80, y: 220, w: 30, h: 80 }
    ];

    regions.forEach(reg => {
      let zone = reg.r ? this.add.circle(reg.x, reg.y, reg.r, 0xffffff, 0.01) : this.add.rectangle(reg.x, reg.y, reg.w, reg.h, 0xffffff, 0.01);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        this.add.tween({ targets: zone, alpha: 0.5, yoyo: true, duration: 200, fillColor: 0x00ff00 });
        this.onLog(reg.id, this.exam[reg.id]);
      });
    });
  }
}

// --------------------------------------------------------------
// 3. UTILITY FUNCTIONS
// --------------------------------------------------------------

const generateDifferentials = (observations) => {
  if (!observations || Object.keys(observations).length === 0) return [];
  
  let scores = [];
  for (const [org, traits] of Object.entries(ORGANISM_TRAITS)) {
    let score = 0; let possible = 0;
    
    if (observations.shape && traits.morphology?.[observations.shape]) { score += traits.morphology[observations.shape]; possible += 5; }
    if (observations.arrangement && traits.arrangement?.[observations.arrangement]) { score += traits.arrangement[observations.arrangement]; possible += 5; }
    if (observations.stain && traits.stain?.[observations.stain]) { score += traits.stain[observations.stain]; possible += 5; }
    if (observations.special && traits.special?.[observations.special]) { score += traits.special[observations.special]; possible += 5; }
    
    let confidence = possible > 0 ? Math.max(0, Math.round((score / possible) * 100)) : 0;
    scores.push({ organism: org, confidence });
  }
  return scores.sort((a,b) => b.confidence - a.confidence).slice(0, 3);
};

// --------------------------------------------------------------
// 4. ZUSTAND STORE
// --------------------------------------------------------------

const useGameStore = create((set, get) => ({
  patients: [],
  currentPatient: null,
  currentRoom: 'triage',
  money: 1000,
  reputation: 60,
  completedCases: 0,
  labSceneActive: null,
  labPatientId: null,
  hospitalDay: 1,
  observationLog: [],
  diagnosticStats: { totalCases: 0, correct: 0, partial: 0, wrong: 0 },

  addPatient: (p) => set(s => ({ patients: [...s.patients, p] })),
  setCurrentPatient: (p) => set({ currentPatient: p }),
  setCurrentRoom: (r) => set({ currentRoom: r }),
  updatePatient: (id, upd) => set(s => ({
    patients: s.patients.map(p => p.id === id ? {...p, ...upd} : p),
    currentPatient: s.currentPatient?.id === id ? {...s.currentPatient, ...upd} : s.currentPatient
  })),
  
  startLabScene: (type, patientId) => set({ labSceneActive: type, labPatientId: patientId }),
  endLabScene: () => set({ labSceneActive: null }),

  logObservation: (msg) => set(s => ({
    observationLog: [{ time: `Day ${s.hospitalDay}`, msg }, ...s.observationLog]
  })),

  generatePatient: () => {
    const keys = Object.keys(DISEASES);
    const rand = keys[Math.floor(Math.random() * keys.length)];
    const disease = DISEASES[rand];
    const initialTemp = 38.5 + Math.random();
    return {
      id: Date.now() + Math.random(),
      name: `Patient ${Math.floor(Math.random()*1000)}`,
      diseaseId: rand,
      symptoms: disease.symptoms,
      labFindings: { observations: {}, differentials: [], exam: {} },
      admitted: false,
      vitals: { temp: [initialTemp, 0], hr: [90 + Math.floor(Math.random()*30), 0] },
      vitalsHistory: [{ day: 1, temp: parseFloat(initialTemp.toFixed(1)) }],
      treatmentPlan: null
    };
  },

  evaluateTreatment: (patientId, plan) => {
    const s = get();
    const patient = s.patients.find(p => p.id === patientId);
    const disease = DISEASES[patient.diseaseId];
    const correctTx = disease.treatment;
    
    let score = 'wrong';
    if (plan.drug === correctTx.drug) {
      score = (plan.dose === correctTx.dose && plan.frequency === correctTx.frequency) ? 'correct' : 'partial';
    } else if (MEDICATION_INVENTORY[plan.drug]?.class === MEDICATION_INVENTORY[correctTx.drug]?.class) {
      score = 'partial';
    }

    s.updatePatient(patientId, { treatmentPlan: { ...plan, score } });
    
    let moneyGained = 0; let repGained = 0; let statCat = '';
    
    // Evaluate with Toastify
    if (score === 'correct') { 
      moneyGained = 500; repGained = 15; statCat = 'correct'; 
      confetti();
      toast.success(`Complete Recovery! ${patient.name} responds well to ${plan.drug}.`);
    } else if (score === 'partial') { 
      moneyGained = 200; repGained = 0; statCat = 'partial'; 
      toast.warning(`Partial Recovery. ${plan.drug} works, but the dosage/frequency is suboptimal.`);
    } else { 
      moneyGained = -100; repGained = -20; statCat = 'wrong'; 
      toast.error(`Treatment Failed! ${patient.name}'s condition worsened. (Hint: Try a ${MEDICATION_INVENTORY[correctTx.drug]?.class})`);
      // Optional: new Howl({ src: ['path_to_error_sound.mp3'] }).play();
    }

    set(st => ({
      money: st.money + moneyGained,
      reputation: Math.min(100, Math.max(0, st.reputation + repGained)),
      completedCases: st.completedCases + 1,
      diagnosticStats: { ...st.diagnosticStats, totalCases: st.diagnosticStats.totalCases+1, [statCat]: st.diagnosticStats[statCat]+1 },
      patients: st.patients.filter(p => p.id !== patientId),
      currentPatient: null,
      currentRoom: 'triage'
    }));
    
    s.logObservation(`Discharged ${patient.name} - Result: ${score.toUpperCase()}`);
  },

  advanceDay: () => set(s => {
    const updatedPatients = s.patients.map(p => {
      let newTemp = p.vitals.temp[0];
      
      if(p.admitted) {
        if (!p.treatmentPlan) {
            newTemp += 0.2; // Worsens without treatment
        } else {
            if(p.treatmentPlan.score === 'correct') newTemp = Math.max(37.0, newTemp - 0.5);
            if(p.treatmentPlan.score === 'partial') newTemp = Math.max(37.0, newTemp - 0.2);
            if(p.treatmentPlan.score === 'wrong') newTemp += 0.4;
        }
      }
      return { 
          ...p, 
          vitals: { ...p.vitals, temp: [newTemp, 0] },
          vitalsHistory: [...p.vitalsHistory, { day: s.hospitalDay + 1, temp: parseFloat(newTemp.toFixed(1)) }] 
      };
    });
    return { hospitalDay: s.hospitalDay + 1, patients: updatedPatients };
  })
}));

// --------------------------------------------------------------
// 5. REACT UI COMPONENTS
// --------------------------------------------------------------

const PhaserLabModal = ({ sceneType, patientId, onClose }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const store = useGameStore();
  const patient = store.patients.find(p => p.id === patientId);

  const [checklist, setChecklist] = useState({ shape: '', arrangement: '', stain: '', special: '' });
  const [stainStep, setStainStep] = useState(0);
  const [examFindings, setExamFindings] = useState({});

  useEffect(() => {
    if(!containerRef.current) return;
    const Scenes = { microscope: MicroscopeScene, gram: GramStainScene, acidfast: AcidFastScene, bloodsmear: BloodSmearScene, exam: PatientExamScene };
    
    const config = {
      type: Phaser.AUTO, parent: containerRef.current, width: 550, height: 450,
      backgroundColor: '#000000', scene: Scenes[sceneType], scale: { mode: Phaser.Scale.FIT }
    };
    gameRef.current = new Phaser.Game(config);
    
    setTimeout(() => {
      if(gameRef.current?.scene.getScene(Scenes[sceneType].name)) {
        gameRef.current.scene.start(Scenes[sceneType].name, { patient, onLog: handleExamLog });
      }
    }, 100);

    return () => { if(gameRef.current) gameRef.current.destroy(true); };
  }, [sceneType, patient]);

  const adjustMic = (type, dir) => {
    const scene = gameRef.current.scene.getScene('MicroscopeScene');
    if(type==='zoom') scene.setZoom(Math.max(1, Math.min(5, scene.zoom + dir)));
    if(type==='focus') scene.setFocus(Math.max(0, Math.min(100, scene.focus + dir)));
  };

  const saveMicroscope = () => {
    const diffs = generateDifferentials(checklist);
    store.updatePatient(patientId, { labFindings: { ...patient.labFindings, observations: checklist, differentials: diffs } });
    store.logObservation(`Microscopy for ${patient.name} logged.`);
    onClose();
  };

  const handleStain = (chemical, expectedStep) => {
    const scene = gameRef.current.scene.getScene('GramStainScene');
    if(stainStep === expectedStep) {
      scene.applyChemical(chemical, null, false);
      setStainStep(stainStep + 1);
    } else {
      alert("Wrong procedure sequence!");
      setStainStep(0); scene.applyChemical('Alcohol');
    }
  };
  
  const finishGram = () => {
    const scene = gameRef.current.scene.getScene('GramStainScene');
    scene.applyChemical('Safranin', DISEASES[patient.diseaseId].observations.gram, stainStep > 4); 
    setTimeout(() => onClose(), 1500);
  };

  const handleAcidFast = (step) => {
    gameRef.current.scene.getScene('AcidFastScene').applyChemical(step);
    setStainStep(step);
  };

  const handleExamLog = (region, finding) => setExamFindings(prev => ({ ...prev, [region]: finding }));
  
  const saveExam = () => {
    store.updatePatient(patientId, { labFindings: { ...patient.labFindings, exam: examFindings } });
    onClose();
  };

  return (
    <Dialog open fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>{sceneType.toUpperCase()} LAB</DialogTitle>
      <DialogContent sx={{ display: 'flex', gap: 2 }}>
        <Box ref={containerRef} sx={{ width: 550, height: 450, borderRadius: 2, overflow: 'hidden', border: '2px solid #ccc' }} />
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sceneType === 'microscope' && (
            <>
              <Typography variant="h6"><BiotechIcon/> Microscope Controls</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Button fullWidth variant="outlined" onClick={()=>adjustMic('zoom',0.5)}>Zoom In</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" onClick={()=>adjustMic('zoom',-0.5)}>Zoom Out</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" onClick={()=>adjustMic('focus',5)}>Focus +</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" onClick={()=>adjustMic('focus',-5)}>Focus -</Button></Grid>
              </Grid>
              <Divider sx={{my:1}}/>
              <Typography variant="subtitle1">Observation Checklist</Typography>
              <FormControl size="small" fullWidth><InputLabel>Shape</InputLabel><Select value={checklist.shape} onChange={e=>setChecklist({...checklist, shape: e.target.value})}><MenuItem value="cocci">Cocci (Spheres)</MenuItem><MenuItem value="bacilli">Bacilli (Rods)</MenuItem><MenuItem value="yeast">Yeast (Oval)</MenuItem><MenuItem value="ring_form">Ring Forms</MenuItem></Select></FormControl>
              <FormControl size="small" fullWidth><InputLabel>Arrangement</InputLabel><Select value={checklist.arrangement} onChange={e=>setChecklist({...checklist, arrangement: e.target.value})}><MenuItem value="chains">Chains</MenuItem><MenuItem value="clusters">Clusters</MenuItem><MenuItem value="pairs">Pairs</MenuItem><MenuItem value="single">Single</MenuItem></Select></FormControl>
              <FormControl size="small" fullWidth><InputLabel>Stain Result</InputLabel><Select value={checklist.stain} onChange={e=>setChecklist({...checklist, stain: e.target.value})}><MenuItem value="gram_positive">Gram Positive (Purple)</MenuItem><MenuItem value="gram_negative">Gram Negative (Pink)</MenuItem><MenuItem value="acid_fast">Acid Fast (Red)</MenuItem></Select></FormControl>
              <Button variant="contained" color="primary" sx={{ mt: 'auto' }} onClick={saveMicroscope}>Log Observations</Button>
            </>
          )}

          {sceneType === 'gram' && (
            <>
              <Typography variant="h6"><ScienceIcon/> Gram Stain</Typography>
              <Button variant={stainStep>=1?"outlined":"contained"} color="secondary" onClick={()=>handleStain('Crystal Violet',0)}>1. Crystal Violet</Button>
              <Button variant={stainStep>=2?"outlined":"contained"} sx={{bgcolor:stainStep<1?'#ccc':'#8b4513'}} onClick={()=>handleStain('Iodine',1)}>2. Iodine</Button>
              <Button variant={stainStep>=3?"outlined":"contained"} sx={{bgcolor:stainStep<2?'#ccc':'#ddd', color:'#000'}} onClick={()=>handleStain('Alcohol',2)}>3. Decolorizer</Button>
              <Button variant={stainStep>=4?"outlined":"contained"} color="error" onClick={()=>handleStain('Safranin',3)}>4. Safranin</Button>
              <Button variant="contained" color="success" sx={{ mt: 'auto' }} disabled={stainStep<4} onClick={finishGram}>Finish & View</Button>
            </>
          )}

          {sceneType === 'acidfast' && (
            <>
              <Typography variant="h6"><ScienceIcon/> AFB Stain</Typography>
              <Button variant={stainStep>=1?"outlined":"contained"} color="error" onClick={()=>handleAcidFast(1)}>1. Carbol Fuchsin</Button>
              <Button variant={stainStep>=2?"outlined":"contained"} color="warning" onClick={()=>handleAcidFast(2)}>2. Apply Heat</Button>
              <Button variant={stainStep>=3?"outlined":"contained"} sx={{bgcolor:'#ddd', color:'#000'}} onClick={()=>handleAcidFast(3)}>3. Acid Alcohol</Button>
              <Button variant={stainStep>=4?"outlined":"contained"} color="info" onClick={()=>handleAcidFast(4)}>4. Methylene Blue</Button>
              <Button variant="contained" color="success" sx={{ mt: 'auto' }} disabled={stainStep<4} onClick={onClose}>Finish</Button>
            </>
          )}
          
          {sceneType === 'exam' && (
            <>
              <Typography variant="h6"><PersonIcon/> Physical Findings</Typography>
              <Typography variant="body2" color="textSecondary">Click body regions on patient.</Typography>
              <List dense>
                {Object.entries(examFindings).map(([reg, val]) => (
                  <ListItem key={reg}><ListItemText primary={reg.toUpperCase()} secondary={val}/></ListItem>
                ))}
              </List>
              <Button variant="contained" color="primary" sx={{ mt: 'auto' }} onClick={saveExam}>Log Examination</Button>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
};

const PharmacyRoom = () => {
  const store = useGameStore();
  const patient = store.currentPatient;
  const [plan, setPlan] = useState({ drug: '', dose: '', frequency: '', days: '' });

  if(!patient) return <Typography>Select a patient from the ward first.</Typography>;

  return (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h5" mb={2}><MedicationIcon/> Pharmacy & Treatment</Typography>
        <Typography variant="subtitle1" mb={2}>Prescribing for: <b>{patient.name}</b></Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Medication</InputLabel>
              <Select value={plan.drug} onChange={e => setPlan({...plan, drug: e.target.value})}>
                {Object.keys(MEDICATION_INVENTORY).map(d => <MenuItem key={d} value={d}>{d} ({MEDICATION_INVENTORY[d].class})</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth disabled={!plan.drug}>
              <InputLabel>Dose</InputLabel>
              <Select value={plan.dose} onChange={e => setPlan({...plan, dose: e.target.value})}>
                {plan.drug && MEDICATION_INVENTORY[plan.drug].doseRange.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth disabled={!plan.drug}>
              <InputLabel>Frequency</InputLabel>
              <Select value={plan.frequency} onChange={e => setPlan({...plan, frequency: e.target.value})}>
                {plan.drug && MEDICATION_INVENTORY[plan.drug].freqRange.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select value={plan.days} onChange={e => setPlan({...plan, days: e.target.value})}>
                {DURATIONS.map(d => <MenuItem key={d} value={d}>{d} Days</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button fullWidth variant="contained" color="success" size="large" sx={{ mt: 3 }} onClick={()=>store.evaluateTreatment(patient.id, plan)}>
          Administer Treatment
        </Button>
      </Paper>
    </motion.div>
  );
};

const HospitalRoom = () => {
  const store = useGameStore();
  const { currentRoom, patients, currentPatient, labSceneActive, observationLog } = store;
  
  if(labSceneActive) return <PhaserLabModal sceneType={labSceneActive} patientId={store.labPatientId} onClose={store.endLabScene}/>;
  
  const renderRoom = () => {
    switch(currentRoom) {
      case 'triage':
        return (
          <Box>
            <Typography variant="h5" mb={2}>Emergency Triage</Typography>
            <AnimatePresence>
              {patients.filter(p=>!p.admitted).map((p, index) =>
                <motion.div key={p.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }}>
                  <Paper sx={{ p: 2, m: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{p.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Symptoms: {p.symptoms.join(', ')}</Typography>
                      <Typography variant="caption" color="error">Temp: {p.vitals.temp[0].toFixed(1)}°C | HR: {p.vitals.hr[0]}</Typography>
                    </Box>
                    <Button variant="contained" onClick={()=>{
                      store.updatePatient(p.id,{admitted:true}); 
                      store.setCurrentPatient(p); 
                      store.logObservation(`Admitted ${p.name}`);
                      toast.info(`${p.name} admitted to the ward.`);
                    }}>Admit to Ward</Button>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
            {patients.filter(p=>!p.admitted).length === 0 && <Button variant="outlined" onClick={()=>store.addPatient(store.generatePatient())}>Call Next Patient</Button>}
          </Box>
        );
      case 'ward':
        return (
          <Box>
            <Typography variant="h5" mb={2}>Patient Ward</Typography>
            {patients.filter(p=>p.admitted).map(p=>
              <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Paper sx={{ p: 2, m: 1, borderLeft: currentPatient?.id === p.id ? '6px solid #1976d2' : 'none' }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">{p.name}</Typography>
                    <Button variant={currentPatient?.id === p.id ? "contained" : "outlined"} onClick={()=>store.setCurrentPatient(p)}>Examine</Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Current Vitals:</Typography>
                      <Typography variant="body2" color={p.vitals.temp[0] > 38 ? 'error' : 'textSecondary'}>
                        T: {p.vitals.temp[0].toFixed(1)}°C
                      </Typography>
                      <Typography variant="body2">HR: {p.vitals.hr[0]} bpm</Typography>
                    </Grid>
                    
                    {/* Recharts Vitals Trend */}
                    <Grid item xs={4}>
                       <Typography variant="subtitle2">Fever Trend:</Typography>
                       <Box sx={{ width: '100%', height: 60 }}>
                         <ResponsiveContainer>
                           <LineChart data={p.vitalsHistory}>
                             <Line type="monotone" dataKey="temp" stroke="#ff4d4f" strokeWidth={2} dot={false} />
                             <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                             <Tooltip contentStyle={{ fontSize: '12px', padding: '2px' }}/>
                           </LineChart>
                         </ResponsiveContainer>
                       </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Differentials:</Typography>
                      {p.labFindings?.differentials?.length > 0 ? 
                        p.labFindings.differentials.map(d=><Chip key={d.organism} label={`${d.organism} (${d.confidence}%)`} size="small" sx={{m:0.2}}/>)
                        : <Typography variant="body2" color="textSecondary">Needs lab data.</Typography>
                      }
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            )}
          </Box>
        );
      case 'lab':
        if(!currentPatient) return <Typography>Select a patient in the Ward first.</Typography>;
        return (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
            <Typography variant="h5" mb={2}><ScienceIcon/> Laboratory - {currentPatient.name}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}><Button fullWidth variant="contained" sx={{py:2}} onClick={()=>store.startLabScene('exam', currentPatient.id)}><PersonIcon sx={{mr:1}}/> Physical Exam</Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="contained" sx={{py:2, bgcolor:'#6a0dad'}} onClick={()=>store.startLabScene('gram', currentPatient.id)}><BloodtypeIcon sx={{mr:1}}/> Gram Stain</Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="contained" sx={{py:2}} onClick={()=>store.startLabScene('microscope', currentPatient.id)}><BiotechIcon sx={{mr:1}}/> Microscopy</Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="contained" color="error" sx={{py:2}} onClick={()=>store.startLabScene('acidfast', currentPatient.id)}><ScienceIcon sx={{mr:1}}/> Acid Fast Stain</Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="contained" color="secondary" sx={{py:2}} onClick={()=>store.startLabScene('bloodsmear', currentPatient.id)}><BloodtypeIcon sx={{mr:1}}/> Blood Smear</Button></Grid>
            </Grid>
            <Paper sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6">Recorded Observations:</Typography>
              <pre style={{ margin: 0 }}>{JSON.stringify(currentPatient.labFindings.observations, null, 2)}</pre>
              <Divider sx={{my:2}}/>
              <Typography variant="h6">Differentials Engine:</Typography>
              {currentPatient.labFindings.differentials.map((d,i) => (
                <Box key={i} display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{width: 200}}>{d.organism}</Typography>
                  <LinearProgress variant="determinate" value={d.confidence} sx={{flex:1, mx:2, height:10, borderRadius:5}} color={d.confidence>80?'success':d.confidence>50?'warning':'error'}/>
                  <Typography variant="body2">{d.confidence}%</Typography>
                </Box>
              ))}
            </Paper>
          </motion.div>
        );
      case 'pharmacy': return <PharmacyRoom />;
      case 'logs':
        return (
          <Box>
            <Typography variant="h5" mb={2}>Hospital Logs</Typography>
            <List>
              {observationLog.map((log, i) => (
                <ListItem key={i} divider><ListItemText primary={log.msg} secondary={log.time} /></ListItem>
              ))}
            </List>
          </Box>
        );
      default: return null;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#eef2f6' }}>
      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />
      
      {/* Sidebar Navigation */}
      <Paper sx={{ width: 240, m: 2, p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', color: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <LocalHospitalIcon sx={{ mr: 1, color: '#60a5fa' }}/> MicrobeRPG
        </Typography>
        <Typography variant="caption" sx={{ mb: 2, color: '#94a3b8' }}>Day {store.hospitalDay}</Typography>
        
        <List sx={{ flex: 1, '& .MuiListItemButton-root': { borderRadius: 1, mb: 0.5 } }}>
          <ListItem disablePadding><ListItemButton selected={currentRoom==='triage'} onClick={()=>store.setCurrentRoom('triage')}><ListItemText primary="Triage" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton selected={currentRoom==='ward'} onClick={()=>store.setCurrentRoom('ward')}><ListItemText primary="Ward" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton selected={currentRoom==='lab'} onClick={()=>store.setCurrentRoom('lab')}><ListItemText primary="Lab Dashboard" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton selected={currentRoom==='pharmacy'} onClick={()=>store.setCurrentRoom('pharmacy')}><ListItemText primary="Pharmacy" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton selected={currentRoom==='logs'} onClick={()=>store.setCurrentRoom('logs')}><ListItemText primary="Activity Logs" /></ListItemButton></ListItem>
        </List>
        
        <Divider sx={{ my: 2, borderColor: '#334155' }} />
        <Button variant="outlined" sx={{color:'#fff', borderColor:'#60a5fa'}} onClick={store.advanceDay} fullWidth>
            Advance Day
        </Button>
        
        <Box sx={{ mt: 2, p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="#94a3b8">Hospital Stats</Typography>
          <Typography variant="body2">💰 ${store.money}</Typography>
          <Typography variant="body2">⭐ Rep: {store.reputation}</Typography>
          <Typography variant="body2">✅ Cured: {store.diagnosticStats.correct}</Typography>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, m: 2, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, overflowY: 'auto' }}>
        {renderRoom()}
      </Box>
    </Box>
  );
};

const MicrobeRPG = () => {
  const store = useGameStore();
  useEffect(() => { 
    if(store.patients.length === 0) {
      for(let i=0; i<3; i++) store.addPatient(store.generatePatient()); 
    }
  }, []);
  return <MicrobeRPG />; // Assuming this wraps HospitalRoom internally
};

export default function App() { return <HospitalRoom /> }