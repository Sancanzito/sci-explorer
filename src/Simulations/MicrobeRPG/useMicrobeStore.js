// src/Simulations/MicrobeRPG/useMicrobeStore.js

import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import {
  DISEASES, MEDICATION_INVENTORY, DRUG_CLASS_MATCHING,
  ACHIEVEMENTS, DURATIONS, ORGANISM_TRAITS
} from './gameData.js';

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
  parasitemiaCount: { total: 0, infected: 0, percentage: 0 },
  outcomeHistory: [],
  achievements: [],
  stainErrors: [],
  cultureResults: {},
  selectedMedia: null,
  microscopeSettings: { zoom: 1, focus: 50, light: 80 },

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

  generatePatient: () => {
    const keys = Object.keys(DISEASES);
    const rand = keys[Math.floor(Math.random() * keys.length)];
    const disease = DISEASES[rand];
    const initialTemp = 38.5 + Math.random() * 1.5;
    const initialHr = 85 + Math.floor(Math.random() * 30);
    const initialRr = 16 + Math.floor(Math.random() * 10);
    const initialO2 = rand === 'covid' ? 88 + Math.floor(Math.random() * 7) : 96 + Math.floor(Math.random() * 4);
    return {
      id: Date.now() + Math.random(),
      name: `Patient ${Math.floor(Math.random() * 1000)}`,
      diseaseId: rand,
      symptoms: disease.symptoms,
      labFindings: { observations: {}, differentials: [], exam: {}, gramStain: null, acidFast: null, parasitemia: null, bloodSmear: null, culture: null },
      admitted: false,
      vitals: {
        temp: [parseFloat(initialTemp.toFixed(1)), 0],
        hr: [initialHr, 0],
        rr: [initialRr, 0],
        o2sat: [initialO2, 0],
        symptomSeverity: 10
      },
      vitalsHistory: [{
        day: get().hospitalDay,
        temp: parseFloat(initialTemp.toFixed(1)),
        hr: initialHr,
        rr: initialRr,
        o2sat: initialO2,
        symptomSeverity: 10
      }],
      treatmentPlan: null
    };
  },

  evaluateTreatment: (patientId, plan) => {
    const s = get();
    const patient = s.patients.find(p => p.id === patientId);
    if (!patient) return;
    const disease = DISEASES[patient.diseaseId];
    const correctTx = disease.treatment;

    let score = 'wrong';
    let effectiveness = 0;
    let message = '';

    if (plan.drug === correctTx.drug) {
      const doseOk = plan.dose === correctTx.dose;
      const freqOk = plan.frequency === correctTx.frequency;
      const durOk = parseInt(plan.days) >= parseInt(correctTx.days);

      if (doseOk && freqOk && durOk) {
        score = 'correct';
        effectiveness = 100;
        message = `Complete Recovery! ${patient.name} responds well to ${plan.drug}.`;
      } else {
        score = 'partial';
        let parts = 0;
        if (doseOk) parts++;
        if (freqOk) parts++;
        if (durOk) parts++;
        effectiveness = 30 + (parts / 3) * 50;
        message = `Partial Recovery. ${plan.drug} works, but dosage/frequency/duration could be optimized.`;
      }
    } else {
      const planClass = MEDICATION_INVENTORY[plan.drug]?.class;
      const correctClass = MEDICATION_INVENTORY[correctTx.drug]?.class;
      const classInfo = DRUG_CLASS_MATCHING[planClass];

      if (planClass === correctClass) {
        score = 'partial';
        effectiveness = 60;
        message = `Partial Recovery. ${plan.drug} (same class as ${correctTx.drug}) shows some effect.`;
      } else if (classInfo?.similar?.includes(correctClass)) {
        score = 'partial';
        effectiveness = 40;
        message = `Weak response. ${plan.drug} has limited cross-reactivity with ${correctTx.drug}.`;
      } else if (disease.type === 'virus' && plan.drug === 'Supportive Care') {
        score = 'partial';
        effectiveness = 50;
        message = `Supportive care provided. ${patient.name} needs immune support.`;
      } else {
        score = 'wrong';
        effectiveness = 0;
        message = `Treatment Failed! ${patient.name}'s condition worsened. Consider a ${MEDICATION_INVENTORY[correctTx.drug]?.class || 'different'} antibiotic.`;
      }
    }

    s.updatePatient(patientId, { treatmentPlan: { ...plan, score, effectiveness } });

    let moneyGained = 0;
    let repGained = 0;
    let statCat = 'wrong';
    const newOutcome = { patientId, patientName: patient.name, treatmentDay: s.hospitalDay, score, effectiveness, disease: disease.name };

    if (score === 'correct') {
      moneyGained = 500;
      repGained = 15;
      statCat = 'correct';
      confetti();
      toast.success(message);
      if (!s.achievements.includes('first_diagnosis')) {
        setTimeout(() => get().addAchievement('first_diagnosis'), 1500);
      }
    } else if (score === 'partial') {
      moneyGained = 200;
      repGained = 5;
      statCat = 'partial';
      toast.warning(message);
    } else {
      moneyGained = -100;
      repGained = -20;
      statCat = 'wrong';
      toast.error(message);
      get().logObservation(`Treatment failure for ${patient.name}: ${message}`);
    }

    set(st => ({
      money: st.money + moneyGained,
      reputation: Math.min(100, Math.max(0, st.reputation + repGained)),
      completedCases: st.completedCases + 1,
      outcomeHistory: [...st.outcomeHistory, newOutcome],
      diagnosticStats: { ...st.diagnosticStats, totalCases: st.diagnosticStats.totalCases + 1, [statCat]: st.diagnosticStats[statCat] + 1 },
      patients: st.patients.filter(p => p.id !== patientId),
      currentPatient: st.currentPatient?.id === patientId ? null : st.currentPatient,
      currentRoom: st.currentRoom === 'pharmacy' ? 'triage' : st.currentRoom
    }));

    if (get().diagnosticStats.correct >= 3) get().addAchievement('triple_crown');
    if (get().diagnosticStats.totalCases >= 10) get().addAchievement('epidemiologist');
    get().logObservation(`Discharged ${patient.name} - Result: ${score.toUpperCase()} (${Math.round(effectiveness)}% effective)`);
  },

  advanceDay: () => set(s => {
    const historyEntry = { day: s.hospitalDay + 1, patientCount: s.patients.filter(p => p.admitted).length, money: s.money, reputation: s.reputation };

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
          if (plan.score === 'correct') {
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
            newRr = Math.min(45, newRr + 3);
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

    return { hospitalDay: s.hospitalDay + 1, patients: updatedPatients, outcomeHistory: [...s.outcomeHistory, historyEntry] };
  }),

  recordParasitemia: (infected, total) => {
    const percentage = total > 0 ? parseFloat(((infected / total) * 100).toFixed(2)) : 0;
    set({ parasitemiaCount: { total, infected, percentage } });
    get().addAchievement('parasite_hunter');
  },

  addAchievement: (key) => {
    const existing = get().achievements;
    if (existing.includes(key)) return;
    const achievement = ACHIEVEMENTS[key];
    if (!achievement) return;
    set(s => ({ achievements: [...s.achievements, key] }));
    toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, { autoClose: 5000, hideProgressBar: false });
    get().logObservation(`Achievement unlocked: ${achievement.name}`);
  },

  setCultureResult: (patientId, result) => {
    set(s => ({ cultureResults: { ...s.cultureResults, [patientId]: result } }));
    if (result && result.growth) get().addAchievement('culture_guru');
  },

  setMicroscopeSetting: (setting, value) => {
    set(s => ({ microscopeSettings: { ...s.microscopeSettings, [setting]: value } }));
  },

  // --- ALGORITHM ACTIONS ---
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

  // --- DIFFERENTIAL ENGINE ---
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