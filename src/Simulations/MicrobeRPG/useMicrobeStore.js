// src/Simulations/MicrobeRPG/useMicrobeStore.js

import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import {
  DISEASES, MEDICATION_INVENTORY, DRUG_CLASS_MATCHING,
  ACHIEVEMENTS, ORGANISM_TRAITS
} from './gameData.js';

// Helper for Toxicity Math
const calculateAbsoluteDose = (doseStr, patientWeight) => {
  if (!doseStr || doseStr === 'N/A' || doseStr === 'Standard') return 1;
  if (doseStr.includes('mg/kg')) {
    const mg = parseFloat(doseStr.replace('mg/kg', ''));
    return mg * patientWeight; 
  }
  if (doseStr.includes('g') && !doseStr.includes('mg')) {
    const g = parseFloat(doseStr.replace('g', ''));
    return g * 1000; 
  }
  if (doseStr.includes('kU')) {
    return parseFloat(doseStr.replace('kU', '')); 
  }
  return parseFloat(doseStr.replace('mg', ''));
};

const useGameStore = create((set, get) => ({
  // --- STATE ---
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
  parasitemiaCount: { total: 0, infected: 0, percentage: 0 },
  outcomeHistory: [],
  achievements: [],
  stainErrors: [],
  cultureResults: {},
  microscopeSettings: { zoom: 1, focus: 50, light: 80 },

  // --- BASIC ACTIONS ---
  addPatient: (p) => set(s => ({ patients: [...s.patients, p] })),
  setCurrentPatient: (p) => set({ currentPatient: p }),
  setCurrentRoom: (r) => set({ currentRoom: r }),

  updatePatient: (id, upd) => set(s => ({
    patients: s.patients.map(p => p.id === id ? { ...p, ...upd } : p),
    currentPatient: s.currentPatient?.id === id ? { ...s.currentPatient, ...upd } : s.currentPatient
  })),

  startLabScene: (type, patientId) => set({ labSceneActive: type, labPatientId: patientId }),
  endLabScene: () => set({ labSceneActive: null }),

  logObservation: (msg) => set(s => ({
    observationLog: [{ time: `Day ${s.hospitalDay}`, msg }, ...s.observationLog]
  })),

  addAchievement: (key) => {
    const existing = get().achievements;
    if (existing.includes(key)) return;
    const achievement = ACHIEVEMENTS[key];
    if (!achievement) return;
    set(s => ({ achievements: [...s.achievements, key] }));
    toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
    get().logObservation(`Achievement unlocked: ${achievement.name}`);
  },

  // --- CORE GAMEPLAY LOGIC ---
  generatePatient: () => {
    const keys = Object.keys(DISEASES);
    const rand = keys[Math.floor(Math.random() * keys.length)];
    const disease = DISEASES[rand];
    
    // Demographics & Constraints
    const age = 18 + Math.floor(Math.random() * 65);
    const weight = 50 + Math.floor(Math.random() * 50); // 50kg to 100kg
    const allergies = Math.random() < 0.2 ? ['Penicillin'] : []; 
    const resistantTo = Math.random() < 0.25 && disease.type === 'bacteria' 
      ? [MEDICATION_INVENTORY[disease.treatments?.[0]?.drug || 'Amoxicillin']?.class] 
      : []; 

    const initialTemp = 38.5 + Math.random() * 1.5;
    const initialHr = 85 + Math.floor(Math.random() * 30);
    const initialRr = 16 + Math.floor(Math.random() * 10);
    const initialO2 = rand === 'covid' ? 88 + Math.floor(Math.random() * 7) : 96 + Math.floor(Math.random() * 4);
    
    return {
      id: Date.now() + Math.random(),
      name: `Patient ${Math.floor(Math.random() * 1000)}`,
      age, weight, allergies, resistantTo,
      diseaseId: rand,
      symptoms: disease.symptoms,
      labFindings: { observations: {}, differentials: [], exam: {}, gramStain: null, acidFast: null, parasitemia: null, bloodSmear: null, culture: null },
      admitted: false,
      vitals: { temp: [parseFloat(initialTemp.toFixed(1)), 0], hr: [initialHr, 0], rr: [initialRr, 0], o2sat: [initialO2, 0], symptomSeverity: 10 },
      vitalsHistory: [{ day: get().hospitalDay, temp: parseFloat(initialTemp.toFixed(1)), hr: initialHr, rr: initialRr, o2sat: initialO2, symptomSeverity: 10 }],
      treatmentPlan: null
    };
  },

  evaluateTreatment: (patientId, regimenPlan) => {
    const s = get();
    const patient = s.patients.find(p => p.id === patientId);
    if (!patient) return;
    
    const disease = DISEASES[patient.diseaseId];
    const correctRegimen = disease.treatments || [];
    
    let score = 'wrong';
    let effectiveness = 0;
    let message = '';
    let isToxic = false;
    
    // 1. Economic Deduction
    const totalCost = regimenPlan.reduce((sum, rx) => sum + (MEDICATION_INVENTORY[rx.drug]?.cost || 0), 0);

    // 2. Fatal Constraint Checks (Allergies)
    const triggeredAllergy = regimenPlan.find(rx => patient.allergies.includes(MEDICATION_INVENTORY[rx.drug]?.class));
    if (triggeredAllergy) {
      score = 'wrong';
      effectiveness = -50; 
      message = `CRITICAL ERROR: Patient went into anaphylaxis! You prescribed ${triggeredAllergy.drug} to a patient allergic to ${MEDICATION_INVENTORY[triggeredAllergy.drug].class}s.`;
      isToxic = true;
    } else {
      
      // 3. Efficacy & Multi-drug Matching
      let drugsMatched = 0;
      let resistanceTriggered = false;

      regimenPlan.forEach(rx => {
        const invData = MEDICATION_INVENTORY[rx.drug];
        
        if (patient.resistantTo.includes(invData.class)) {
          resistanceTriggered = true;
          return;
        }

        const targetDrug = correctRegimen.find(c => c.drug === rx.drug) || 
                           (disease.fallbackClass === invData.class ? correctRegimen[0] : null);

        if (targetDrug) {
          const prescribedAmt = calculateAbsoluteDose(rx.dose, patient.weight);
          const targetAmt = calculateAbsoluteDose(targetDrug.dose, patient.weight);
          
          if (prescribedAmt > targetAmt * 1.5) {
             isToxic = true; 
             drugsMatched += 0.5; 
          } else if (prescribedAmt < targetAmt * 0.75) {
             drugsMatched += 0.25;
          } else {
             drugsMatched += 1;
          }
        }
      });

      // 4. Final Calculation
      const matchedRatio = correctRegimen.length > 0 ? (drugsMatched / correctRegimen.length) : 0;
      
      if (resistanceTriggered) {
        score = 'wrong';
        effectiveness = 10;
        message = `Treatment Failed. The pathogen showed antimicrobial resistance to the prescribed class.`;
      } else if (isToxic) {
        score = 'partial';
        effectiveness = 30;
        message = `TOXIC OVERDOSE! The pathogen was treated, but the excessive dosage caused severe organ toxicity for a ${patient.weight}kg patient.`;
      } else if (regimenPlan.length < correctRegimen.length) {
        score = 'partial';
        effectiveness = (matchedRatio * 100) / 2;
        message = `Incomplete Regimen. You missed required combination drugs for this disease.`;
      } else if (matchedRatio === 1) {
        score = 'correct';
        effectiveness = 100;
        message = `Complete Recovery! Perfectly matched and dosed regimen for ${disease.name}.`;
      } else if (matchedRatio > 0) {
        score = 'partial';
        effectiveness = matchedRatio * 100;
        message = `Partial Recovery. The regimen had some effect, but dosages or drug choices were suboptimal.`;
      } else {
        score = 'wrong';
        effectiveness = 0;
        message = `Treatment Failed! The prescribed regimen was ineffective against ${disease.name}.`;
      }
    }

    s.updatePatient(patientId, { treatmentPlan: { regimen: regimenPlan, score, effectiveness, isToxic } });

    // Rewards & Penalties
    let moneyGained = 0;
    let repGained = 0;
    let statCat = 'wrong';

    if (score === 'correct') {
      moneyGained = 600; repGained = 15; statCat = 'correct';
      confetti();
      toast.success(message);
      if (!s.achievements.includes('first_diagnosis')) setTimeout(() => get().addAchievement('first_diagnosis'), 1500);
    } else if (score === 'partial') {
      moneyGained = 200; repGained = -5; statCat = 'partial';
      toast.warning(message);
    } else {
      moneyGained = 0; repGained = -25; statCat = 'wrong';
      toast.error(message);
    }

    set(st => ({
      money: st.money - totalCost + moneyGained,
      reputation: Math.min(100, Math.max(0, st.reputation + repGained)),
      completedCases: st.completedCases + 1,
      outcomeHistory: [...st.outcomeHistory, { patientId, patientName: patient.name, treatmentDay: st.hospitalDay, score, effectiveness, disease: disease.name }],
      diagnosticStats: { ...st.diagnosticStats, totalCases: st.diagnosticStats.totalCases + 1, [statCat]: st.diagnosticStats[statCat] + 1 },
      patients: st.patients.filter(p => p.id !== patientId),
      currentPatient: st.currentPatient?.id === patientId ? null : st.currentPatient,
      currentRoom: st.currentRoom === 'pharmacy' ? 'triage' : st.currentRoom
    }));

    if (get().diagnosticStats.correct >= 3) get().addAchievement('triple_crown');
    if (get().diagnosticStats.totalCases >= 10) get().addAchievement('epidemiologist');
    get().logObservation(`Discharged ${patient.name} - Result: ${score.toUpperCase()}. Drug Cost: $${totalCost}`);
  },

  advanceDay: () => set(s => {
    const updatedPatients = s.patients.map(p => {
      let newTemp = p.vitals.temp[0];
      let newHr = p.vitals.hr[0];
      let newRr = p.vitals.rr[0];
      let newO2 = p.vitals.o2sat[0];
      let newSeverity = p.vitals.symptomSeverity;

      if (p.admitted) {
        if (!p.treatmentPlan) {
          newTemp = Math.min(42, newTemp + 0.3 + Math.random() * 0.2);
          newHr = Math.min(160, newHr + 5);
          newRr = Math.min(40, newRr + 2);
          newO2 = Math.max(80, newO2 - 1);
          newSeverity = Math.min(20, newSeverity + 1);
        } else {
          const plan = p.treatmentPlan;
          
          if (plan.isToxic) {
            newTemp = Math.max(35.0, newTemp - 1.5); // Hypothermia from shock
            newHr = Math.min(180, newHr + 30);       // Tachycardia
            newO2 = Math.max(75, newO2 - 8);         // Respiratory depression
            newSeverity = Math.min(20, newSeverity + 3);
          } else if (plan.score === 'correct') {
            newTemp = Math.max(36.5, newTemp - 0.4 - Math.random() * 0.3);
            newHr = Math.max(60, newHr - 4 - Math.floor(Math.random() * 3));
            newRr = Math.max(12, newRr - 1);
            newO2 = Math.min(100, newO2 + 1);
            newSeverity = Math.max(1, newSeverity - 2);
          } else if (plan.score === 'partial') {
            newTemp = Math.max(37.0, newTemp - 0.15 - Math.random() * 0.15);
            newHr = Math.max(65, newHr - 1);
            newSeverity = Math.max(3, newSeverity - 0.5);
          } else {
            newTemp = Math.min(42, newTemp + 0.5);
            newHr = Math.min(170, newHr + 8);
            newO2 = Math.max(75, newO2 - 2);
            newSeverity = Math.min(20, newSeverity + 2);
          }
        }
      }

      return {
        ...p,
        vitals: { temp: [parseFloat(newTemp.toFixed(1)), 0], hr: [Math.round(newHr), 0], rr: [Math.round(newRr), 0], o2sat: [Math.round(newO2), 0], symptomSeverity: Math.round(newSeverity) },
        vitalsHistory: [...p.vitalsHistory, { day: s.hospitalDay + 1, temp: parseFloat(newTemp.toFixed(1)), hr: Math.round(newHr), rr: Math.round(newRr), o2sat: Math.round(newO2), symptomSeverity: Math.round(newSeverity) }]
      };
    });

    return { hospitalDay: s.hospitalDay + 1, patients: updatedPatients };
  }),

  // --- UNTOUCHED LAB LOGIC ---
  recordParasitemia: (infected, total) => {
    const percentage = total > 0 ? parseFloat(((infected / total) * 100).toFixed(2)) : 0;
    set({ parasitemiaCount: { total, infected, percentage } });
    get().addAchievement('parasite_hunter');
  },

  setCultureResult: (patientId, result) => {
    set(s => ({ cultureResults: { ...s.cultureResults, [patientId]: result } }));
    if (result && result.growth) get().addAchievement('culture_guru');
  },

  setMicroscopeSetting: (setting, value) => {
    set(s => ({ microscopeSettings: { ...s.microscopeSettings, [setting]: value } }));
  },

  recordGramStainResult: (patientId, gramResult, errors) => {
    const p = get().patients.find(pat => pat.id === patientId);
    const newFindings = { ...p.labFindings, gramStain: { result: gramResult, errors: errors || [], timestamp: Date.now() } };
    const diffs = get().generateDifferentials(newFindings);
    get().updatePatient(patientId, { labFindings: { ...newFindings, differentials: diffs } });
    if (!errors || errors.length === 0) get().addAchievement('stain_expert');
    if (errors && errors.length > 0) set(s => ({ stainErrors: [...s.stainErrors, ...errors] }));
    get().logObservation(`Gram stain completed for patient: ${gramResult}`);
  },

  recordAcidFastResult: (patientId, afbResult) => {
    const p = get().patients.find(pat => pat.id === patientId);
    const newFindings = { ...p.labFindings, acidFast: { result: afbResult, timestamp: Date.now() } };
    const diffs = get().generateDifferentials(newFindings);
    get().updatePatient(patientId, { labFindings: { ...newFindings, differentials: diffs } });
    get().logObservation(`Acid-fast stain completed: ${afbResult}`);
  },

  recordBloodSmearResult: (patientId, infected, total, percentage) => {
    const p = get().patients.find(pat => pat.id === patientId);
    const newFindings = { ...p.labFindings, parasitemia: { infected, total, percentage, timestamp: Date.now() }, bloodSmear: { completed: true } };
    const diffs = get().generateDifferentials(newFindings);
    get().updatePatient(patientId, { labFindings: { ...newFindings, differentials: diffs } });
    get().logObservation(`Blood smear: ${percentage}% parasitemia`);
  },

  saveCultureResult: (patientId, cultureData) => {
    const p = get().patients.find(pat => pat.id === patientId);
    const newFindings = { ...p.labFindings, culture: cultureData };
    const diffs = get().generateDifferentials(newFindings);
    get().updatePatient(patientId, { labFindings: { ...newFindings, differentials: diffs } });
    get().logObservation(`Culture result saved for patient`);
  },

  saveMicroscopeObservations: (patientId, checklist) => {
    const p = get().patients.find(pat => pat.id === patientId);
    const newFindings = { ...p.labFindings, observations: checklist };
    const diffs = get().generateDifferentials(newFindings);
    get().updatePatient(patientId, { labFindings: { ...newFindings, differentials: diffs } });
    get().logObservation(`Microscopy observations logged.`);
  },

  generateDifferentials: (labFindings) => {
    if (!labFindings) return [];
    const obs = labFindings.observations || {};
    const gram = labFindings.gramStain?.result;
    const acid = labFindings.acidFast?.result;

    let scores = [];
    for (const [org, traits] of Object.entries(ORGANISM_TRAITS)) {
      let score = 0;
      let possible = 0;

      if (obs.shape && traits.morphology?.[obs.shape]) { score += traits.morphology[obs.shape]; possible += 5; }
      if (obs.arrangement && traits.arrangement?.[obs.arrangement]) { score += traits.arrangement[obs.arrangement]; possible += 5; }
      if (obs.stain && traits.stain?.[obs.stain]) { score += traits.stain[obs.stain]; possible += 5; }
      if (obs.special && traits.special?.[obs.special]) { score += traits.special[obs.special]; possible += 5; }
      
      if (gram) {
        if (traits.stain?.[gram]) { score += traits.stain[gram]; possible += 10; }
        else { score -= 5; possible += 10; } 
      }

      if (acid === 'positive') {
        if (traits.stain?.acid_fast > 0) { score += 20; possible += 20; }
        else { score -= 10; possible += 20; }
      }

      let confidence = possible > 0 ? Math.max(0, Math.round((score / possible) * 100)) : 0;
      scores.push({ organism: org, confidence });
    }
    return scores.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  }
}));

export { useGameStore };
export default useGameStore;