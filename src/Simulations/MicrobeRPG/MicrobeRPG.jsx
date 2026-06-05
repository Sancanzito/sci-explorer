// src/Simulations/MicrobeRPG/MicrobeRPG.jsx

import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import {
  Box, Typography, Button, Paper, Select, MenuItem, FormControl,
  InputLabel, List, ListItem, ListItemButton, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, LinearProgress,
  Slider, FormGroup, FormControlLabel, Checkbox, Tooltip as MuiTooltip,
  Stack, Collapse
} from '@mui/material';

import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { DISEASES, MEDICATION_INVENTORY, DURATIONS, MEDIA_OPTIONS, ACHIEVEMENTS, STAIN_STEPS } from './gameData.js';
import { useGameStore } from './useMicrobeStore.js';
import {
  MicroscopeScene as MS, GramStainScene as GS,
  AcidFastScene as AF, BloodSmearScene as BS,
  CultureScene as CS, PatientExamScene as PE
} from './PhaserScenes.js';

// ----- ObservationChecklist component (unchanged) -----
const ObservationChecklist = ({ checklist, setChecklist, diseaseId, patientObservations }) => {
  const disease = DISEASES[diseaseId];
  const correct = disease?.correctChecklist || {};

  const calcConfidence = () => {
    let score = 0;
    let total = 0;
    ['shape', 'arrangement', 'stain', 'special'].forEach(key => {
      if (checklist[key] && checklist[key] !== 'none') {
        total++;
        if (checklist[key] === correct[key]) score++;
      }
    });
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const confidence = calcConfidence();
  const confidenceColor = confidence >= 80 ? 'success' : confidence >= 50 ? 'warning' : 'error';

  const categories = [
    { label: 'Shape', key: 'shape', options: [{ value: 'cocci', label: 'Cocci (Spheres)' }, { value: 'bacilli', label: 'Bacilli (Rods)' }, { value: 'diplococci', label: 'Diplococci (Pairs)' }, { value: 'yeast', label: 'Yeast (Oval)' }, { value: 'ring_form', label: 'Ring Forms' }, { value: 'curved_rod', label: 'Curved Rod' }] },
    { label: 'Arrangement', key: 'arrangement', options: [{ value: 'chains', label: 'Chains' }, { value: 'pairs', label: 'Pairs' }, { value: 'clusters', label: 'Clusters' }, { value: 'single', label: 'Single' }] },
    { label: 'Stain', key: 'stain', options: [{ value: 'gram_positive', label: 'Gram Positive (Purple)' }, { value: 'gram_negative', label: 'Gram Negative (Pink)' }, { value: 'acid_fast', label: 'Acid Fast (Red)' }] },
    { label: 'Special Features', key: 'special', options: [{ value: 'budding', label: 'Budding' }, { value: 'pseudohyphae', label: 'Pseudohyphae' }, { value: 'capsule', label: 'Capsule' }, { value: 'ring_forms', label: 'Ring Forms' }, { value: 'spores', label: 'Spores' }] }
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: '#f8faff' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MenuBookIcon fontSize="small" /> Observation Checklist
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>Check all observed features from the microscope view</Typography>

      {categories.map(cat => (
        <Box key={cat.key} sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555', display: 'block', mb: 0.5 }}>{cat.label}:</Typography>
          <FormGroup row>
            {cat.options.map(opt => (
              <FormControlLabel
                key={opt.value}
                control={<Checkbox size="small" checked={checklist[cat.key] === opt.value} onChange={(e) => setChecklist(prev => ({ ...prev, [cat.key]: e.target.checked ? opt.value : '' }))} sx={{ '&.Mui-checked': { color: '#1976d2' } }} />}
                label={<Typography variant="caption">{opt.label}</Typography>}
                sx={{ mr: 0.5, mb: 0 }}
              />
            ))}
          </FormGroup>
        </Box>
      ))}

      <Box sx={{ mt: 1, p: 1, bgcolor: '#eef4ff', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Confidence Score:
          <Box sx={{ flex: 1, mx: 1 }}><LinearProgress variant="determinate" value={confidence} color={confidenceColor} sx={{ height: 8, borderRadius: 4 }} /></Box>
          {confidence}%
        </Typography>
      </Box>

      {patientObservations && Object.values(patientObservations).filter(Boolean).length > 0 && (
        <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f8f0', borderRadius: 1 }}>
          <Typography variant="caption" color="success.main">
            ✓ Recorded: {Object.entries(patientObservations).filter(([, v]) => v && v !== 'none').map(([k, v]) => `${k}: ${v}`).join(', ')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// ----- PhaserLabModal (correctly creates Phaser canvas, no GameCanvas) -----
// ----- PhaserLabModal with loading indicator and postBoot callback -----
const PhaserLabModal = ({ sceneType, patientId, onClose }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const store = useGameStore();
  const patient = store.patients.find(p => p.id === patientId);

  // Loading state for the Phaser canvas
  const [isGameLoading, setIsGameLoading] = useState(true);

  const [checklist, setChecklist] = useState({ shape: '', arrangement: '', stain: '', special: '' });
  const [stainStep, setStainStep] = useState(0);
  const [examFindings, setExamFindings] = useState({});
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState(50);
  const [light, setLight] = useState(80);
  const [parasitemia, setParasitemia] = useState({ infected: 0, total: 0, percentage: 0 });
  const [gramErrors, setGramErrors] = useState([]);
  const [cultureResult, setCultureResult] = useState(null);

  const disease = patient ? DISEASES[patient.diseaseId] : null;

  useEffect(() => {
    if (!containerRef.current || !patient) return;

    const sceneConfigs = {
      microscope: { Scene: MS, initData: { patient, onSave: (obs) => store.saveMicroscopeObservations(patientId, obs || checklist) } },
      gram: { Scene: GS, initData: { disease, onFinish: (result, errors) => { setGramErrors(errors || []); store.recordGramStainResult(patientId, result, errors || []); } } },
      acidfast: { Scene: AF, initData: { disease, onFinish: (result) => store.recordAcidFastResult(patientId, result) } },
      bloodsmear: { Scene: BS, initData: { patient, onComplete: (infected, total, percentage) => { setParasitemia({ infected, total, percentage }); store.recordBloodSmearResult(patientId, infected, total, percentage); } } },
      culture: { Scene: CS, initData: { disease, patient, onFinish: (result) => { setCultureResult(result); store.saveCultureResult(patientId, result); } } },
      exam: { Scene: PE, initData: { exam: disease?.physicalExam || {}, onLog: (region, finding) => setExamFindings(prev => ({ ...prev, [region]: finding })), onSave: () => {} } }
    };

    const cfg = sceneConfigs[sceneType];
    if (!cfg) return;

    let timeoutId = null;

    const checkAndStart = () => {
      if (!containerRef.current) return;

      if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
        timeoutId = setTimeout(checkAndStart, 50);
        return;
      }

      const phaserConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 550,
        height: 420,
        backgroundColor: '#000000',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        banner: false,
        callbacks: {
          postBoot: (game) => {
            // Add the scene with its name (not the string 'microscope', but the class name)
            game.scene.add(cfg.Scene.name, cfg.Scene, true, cfg.initData);
            setIsGameLoading(false);
          }
        }
      };

      const game = new Phaser.Game(phaserConfig);
      gameRef.current = game;
    };

    checkAndStart();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [sceneType, patientId]);

  // (All handler functions – handleSlider, handleGramStain, etc. – stay exactly as before)
  // ... (copy your existing handlers here, unchanged) ...

  // Render side panel remains the same (renderSidePanel) ...

  if (!patient) return null;

  return (
    <Dialog open fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {sceneType === 'microscope' && <><BiotechIcon /> Microscopy Lab</>}
        {sceneType === 'gram' && <><ScienceIcon /> Gram Stain Lab</>}
        {sceneType === 'acidfast' && <><ScienceIcon /> Acid-Fast Stain Lab</>}
        {sceneType === 'bloodsmear' && <><BloodtypeIcon /> Blood Smear Lab</>}
        {sceneType === 'culture' && <><ScienceIcon /> Culture Laboratory</>}
        {sceneType === 'exam' && <><PersonIcon /> Patient Examination Room</>}
        <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>{patient.name}</Typography>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', gap: 2, minHeight: 420 }}>
        <Box
          ref={containerRef}
          sx={{
            width: 550,
            height: 420,
            borderRadius: 2,
            overflow: 'hidden',
            border: '2px solid #333',
            flexShrink: 0,
            bgcolor: '#000',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Loading overlay – visible while isGameLoading is true */}
          {isGameLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: 2
              }}
            >
              <Box sx={{ mb: 2 }}>
                <div className="loading-spinner" style={{
                  width: 40,
                  height: 40,
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Loading laboratory equipment...
              </Typography>
              <Typography variant="caption" sx={{ color: '#ccc', mt: 1 }}>
                Please wait a moment
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 320 }}>
          {renderSidePanel()}
        </Box>
      </DialogContent>
      <DialogActions>
        {sceneType !== 'exam' && sceneType !== 'microscope' && (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>

      {/* Add CSS animation keyframes for the spinner (inside a style tag or global CSS) */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog>
  );
};

// ----- PharmacyPanel (unchanged) -----
const PharmacyPanel = () => {
  const store = useGameStore();
  const patient = store.currentPatient;
  const [plan, setPlan] = useState({ drug: '', dose: '', frequency: '', days: '' });
  const [showInfo, setShowInfo] = useState(false);

  if (!patient) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <MedicationIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">Select a patient from the Ward first.</Typography>
      </Paper>
    );
  }

  const selectedDrug = MEDICATION_INVENTORY[plan.drug];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ p: 3, maxWidth: 700 }}>
        <Typography variant="h5" mb={2}><MedicationIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Pharmacy & Treatment</Typography>
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="subtitle1">Prescribing for: <b>{patient.name}</b></Typography>
          <Typography variant="body2" color="textSecondary">Symptoms: {patient.symptoms.join(', ')}</Typography>
          <Typography variant="body2" color="error">Temp: {patient.vitals.temp[0].toFixed(1)}°C | HR: {patient.vitals.hr[0]} | O2: {patient.vitals.o2sat[0]}%</Typography>
        </Paper>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Box sx={{ gridColumn: { xs: '1fr', md: 'span 3' } }}>
            <FormControl fullWidth>
              <InputLabel>Select Medication</InputLabel>
              <Select value={plan.drug} label="Select Medication" onChange={e => { const drug = e.target.value; const info = MEDICATION_INVENTORY[drug]; setPlan({ ...plan, drug, dose: '', frequency: '', days: info?.doseRange?.[0] ? plan.days : '' }); }}>
                {Object.entries(MEDICATION_INVENTORY).map(([name, info]) => <MenuItem key={name} value={name}>{name} <Typography variant="caption" color="textSecondary">({info.class})</Typography></MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          {selectedDrug && (
            <>
              <Box><FormControl fullWidth><InputLabel>Dose</InputLabel><Select value={plan.dose} label="Dose" onChange={e => setPlan({ ...plan, dose: e.target.value })}>{selectedDrug.doseRange.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl></Box>
              <Box><FormControl fullWidth><InputLabel>Frequency</InputLabel><Select value={plan.frequency} label="Frequency" onChange={e => setPlan({ ...plan, frequency: e.target.value })}>{selectedDrug.freqRange.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}</Select></FormControl></Box>
              <Box><FormControl fullWidth><InputLabel>Duration</InputLabel><Select value={plan.days} label="Duration" onChange={e => setPlan({ ...plan, days: e.target.value })}>{DURATIONS.map(d => <MenuItem key={d} value={d}>{d} Days</MenuItem>)}</Select></FormControl></Box>
              <Box sx={{ gridColumn: { xs: '1fr', md: 'span 3' } }}>
                <Button size="small" variant="text" onClick={() => setShowInfo(!showInfo)}>{showInfo ? 'Hide' : 'Show'} drug information</Button>
                <Collapse in={showInfo}>
                  <Paper sx={{ p: 1.5, mt: 1, bgcolor: '#f0f4ff' }}>
                    <Typography variant="caption"><b>Class:</b> {selectedDrug.class}<br /><b>Category:</b> {selectedDrug.category}<br /><b>Available doses:</b> {selectedDrug.doseRange.join(', ')}<br /><b>Available frequencies:</b> {selectedDrug.freqRange.join(', ')}</Typography>
                  </Paper>
                </Collapse>
              </Box>
            </>
          )}
        </Box>
        <Button fullWidth variant="contained" color="success" size="large" sx={{ mt: 3 }} disabled={!plan.drug || !plan.dose || !plan.frequency || !plan.days} onClick={() => { store.evaluateTreatment(patient.id, plan); setPlan({ drug: '', dose: '', frequency: '', days: '' }); }}>Administer Treatment</Button>
      </Paper>
    </motion.div>
  );
};

// ----- HospitalDashboard (unchanged) -----
const HospitalDashboard = () => {
  const store = useGameStore();
  const { achievements, outcomeHistory, diagnosticStats, reputation, money, hospitalDay } = store;

  return (
    <Paper sx={{ p: 2, bgcolor: '#1e293b', color: '#fff', mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}><AssessmentIcon /> Hospital Dashboard</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}><Typography variant="h5" color="#60a5fa">Day {hospitalDay}</Typography><Typography variant="caption" color="#94a3b8">Hospital Day</Typography></Box>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}><Typography variant="h5" color="#4ade80">${money}</Typography><Typography variant="caption" color="#94a3b8">Budget</Typography></Box>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}><Typography variant="h5" color="#facc15">{reputation}%</Typography><Typography variant="caption" color="#94a3b8">Reputation</Typography></Box>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip size="small" label={`✅ Correct: ${diagnosticStats.correct}`} color="success" variant="outlined" />
        <Chip size="small" label={`⚠ Partial: ${diagnosticStats.partial}`} color="warning" variant="outlined" />
        <Chip size="small" label={`❌ Wrong: ${diagnosticStats.wrong}`} color="error" variant="outlined" />
        <Chip size="small" label={`📊 Total: ${diagnosticStats.totalCases}`} color="info" variant="outlined" />
      </Box>
      {achievements.length > 0 && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #334155' }}>
          <Typography variant="caption" color="#94a3b8" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><EmojiEventsIcon sx={{ fontSize: 14 }} /> Achievements:</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {achievements.map(a => <MuiTooltip key={a} title={ACHIEVEMENTS[a]?.description || a}><Chip size="small" label={`${ACHIEVEMENTS[a]?.icon || '🏆'} ${ACHIEVEMENTS[a]?.name || a}`} sx={{ bgcolor: '#334155', color: '#fff', fontSize: 10 }} /></MuiTooltip>)}
          </Box>
        </Box>
      )}
      {outcomeHistory.length > 0 && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #334155' }}>
          <Typography variant="caption" color="#94a3b8">Recent Outcomes:</Typography>
          {outcomeHistory.slice(-3).reverse().map((o, i) => <Typography key={i} variant="caption" display="block" color="#ccc" sx={{ fontSize: 10 }}>{o.patientName ? `${o.patientName}: ${o.score} (${Math.round(o.effectiveness || 0)}%)` : `Day ${o.day}: ${o.patientCount} patients`}</Typography>)}
        </Box>
      )}
    </Paper>
  );
};

// ----- TriagePanel (unchanged) -----
const TriagePanel = ({ patients, onAdmit }) => {
  const store = useGameStore();
  const unadmitted = patients.filter(p => !p.admitted);

  return (
    <Box>
      <Typography variant="h5" mb={2}>🚑 Emergency Triage</Typography>
      <AnimatePresence>
        {unadmitted.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }}>
            <Paper sx={{ p: 2, m: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="body2" color="textSecondary">Symptoms: {p.symptoms.join(', ')}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip size="small" label={`🌡 ${p.vitals.temp[0].toFixed(1)}°C`} color={p.vitals.temp[0] > 38 ? 'error' : 'default'} variant="outlined" />
                  <Chip size="small" label={`💓 ${p.vitals.hr[0]} bpm`} variant="outlined" />
                  <Chip size="small" label={`🫁 ${p.vitals.o2sat[0]}%`} color={p.vitals.o2sat[0] < 95 ? 'warning' : 'default'} variant="outlined" />
                </Stack>
              </Box>
              <Button variant="contained" onClick={() => { store.updatePatient(p.id, { admitted: true }); store.setCurrentPatient(p); store.setCurrentRoom('ward'); store.logObservation(`Admitted ${p.name}`); toast.info(`${p.name} admitted to the ward.`); }}>Admit to Ward</Button>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
      {unadmitted.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography color="textSecondary" mb={1}>No patients waiting.</Typography>
          <Button variant="outlined" onClick={() => store.addPatient(store.generatePatient())}>Call Next Patient</Button>
        </Box>
      )}
    </Box>
  );
};

// ----- WardPanel (fixed chart container) -----
const WardPanel = ({ patients, onSelectPatient }) => {
  const store = useGameStore();
  const admitted = patients.filter(p => p.admitted);

  if (admitted.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LocalHospitalIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">No patients currently admitted.</Typography>
        <Typography variant="caption" color="textSecondary">Go to Triage to admit patients.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>🏥 Patient Ward</Typography>
      {admitted.map(p => (
        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper sx={{ p: 2, m: 1, borderLeft: store.currentPatient?.id === p.id ? '6px solid #1976d2' : '6px solid transparent', bgcolor: store.currentPatient?.id === p.id ? '#f0f7ff' : '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="caption" color="textSecondary">{DISEASES[p.diseaseId]?.name || 'Unknown condition'} — Day {store.hospitalDay}</Typography>
              </Box>
              <Button variant={store.currentPatient?.id === p.id ? "contained" : "outlined"} onClick={() => onSelectPatient(p)}>{store.currentPatient?.id === p.id ? 'Selected' : 'Examine'}</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 4fr 5fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">Vitals:</Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  <Chip size="small" label={`🌡 ${p.vitals.temp[0].toFixed(1)}°C`} color={p.vitals.temp[0] > 38 ? 'error' : 'default'} variant="outlined" />
                  <Chip size="small" label={`💓 ${p.vitals.hr[0]} bpm`} variant="outlined" />
                  <Chip size="small" label={`🫁 ${p.vitals.o2sat[0]}%`} color={p.vitals.o2sat[0] < 95 ? 'warning' : 'default'} variant="outlined" />
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Fever Trend:</Typography>
                <Box sx={{ width: '100%', height: 60, minHeight: 60, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={p.vitalsHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line type="monotone" dataKey="temp" stroke="#ff4d4f" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="hr" stroke="#60a5fa" strokeWidth={1} dot={false} opacity={0.5} />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                      <Tooltip contentStyle={{ fontSize: '11px', padding: '2px 4px' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Differentials:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                  {p.labFindings?.differentials?.length > 0 ? (
                    p.labFindings.differentials.map(d => (
                      <MuiTooltip key={d.organism} title={`Confidence: ${d.confidence}%`}>
                        <Chip label={`${d.organism.split(' ').slice(-1)[0]} (${d.confidence}%)`} size="small" color={d.confidence > 80 ? 'success' : d.confidence > 50 ? 'warning' : 'default'} variant="outlined" sx={{ fontSize: 9 }} />
                      </MuiTooltip>
                    ))
                  ) : <Typography variant="caption" color="textSecondary">No lab data yet. Run lab tests.</Typography>}
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      ))}
    </Box>
  );
};

// ----- LabPanel (unchanged) -----
const LabPanel = ({ currentPatient }) => {
  const store = useGameStore();

  if (!currentPatient) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ScienceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">Select a patient in the Ward first.</Typography>
      </Box>
    );
  }

  const lf = currentPatient.labFindings || {};
  const labTests = [
    { type: 'exam', icon: <PersonIcon />, label: 'Physical Exam', color: '#1976d2', done: Object.keys(lf.exam || {}).length > 0 },
    { type: 'gram', icon: <ScienceIcon />, label: 'Gram Stain', color: '#6a0dad', done: !!lf.gramStain },
    { type: 'microscope', icon: <BiotechIcon />, label: 'Microscopy', color: '#00897b', done: lf.observations && Object.keys(lf.observations).length > 0 },
    { type: 'acidfast', icon: <ScienceIcon />, label: 'Acid Fast Stain', color: '#d32f2f', done: !!lf.acidFast },
    { type: 'bloodsmear', icon: <BloodtypeIcon />, label: 'Blood Smear', color: '#e91e63', done: !!lf.bloodSmear },
    { type: 'culture', icon: <ScienceIcon />, label: 'Culture', color: '#f57c00', done: !!lf.culture }
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}><ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Laboratory — {currentPatient.name}</Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>Disease: {DISEASES[currentPatient.diseaseId]?.name || 'Unknown'}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1.5, mb: 3 }}>
        {labTests.map(test => (
          <Button key={test.type} fullWidth variant="contained" sx={{ py: 1.5, bgcolor: test.done ? `${test.color}22` : test.color, color: test.done ? test.color : '#fff', border: test.done ? `2px solid ${test.color}` : 'none', '&:hover': { bgcolor: test.color, color: '#fff', opacity: 0.9 } }} startIcon={test.done ? <CheckCircleIcon /> : test.icon} onClick={() => store.startLabScene(test.type, currentPatient.id)}>
            {test.done ? '✓ ' : ''}{test.label}
          </Button>
        ))}
      </Box>
      <Paper sx={{ p: 2, bgcolor: '#f8f9fa', mb: 2 }}>
        <Typography variant="h6" mb={1}>📋 Case File</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
          <Box>
            <Typography variant="caption" fontWeight="bold">Microscopy:</Typography>
            {lf.observations && Object.keys(lf.observations).length > 0 ? (
              <Box>{Object.entries(lf.observations).filter(([,v]) => v).map(([k, v]) => <Chip key={k} size="small" label={`${k}: ${v}`} variant="outlined" sx={{ m: 0.2, fontSize: 9 }} />)}</Box>
            ) : <Typography variant="caption" color="textSecondary">Pending</Typography>}
          </Box>
          <Box><Typography variant="caption" fontWeight="bold">Gram Stain:</Typography><Typography variant="caption" display="block">{lf.gramStain ? lf.gramStain.result : 'Pending'}</Typography></Box>
          <Box><Typography variant="caption" fontWeight="bold">AFB Stain:</Typography><Typography variant="caption" display="block">{lf.acidFast ? lf.acidFast.result : 'Pending'}</Typography></Box>
          <Box><Typography variant="caption" fontWeight="bold">Parasitemia:</Typography><Typography variant="caption" display="block">{lf.parasitemia ? `${lf.parasitemia.percentage}%` : 'Pending'}</Typography></Box>
        </Box>
      </Paper>
      <Paper sx={{ p: 2, bgcolor: '#f0f4ff' }}>
        <Typography variant="subtitle1" mb={1}>🧬 Differential Diagnosis Engine</Typography>
        {currentPatient.labFindings.differentials?.length > 0 ? (
          currentPatient.labFindings.differentials.map((d, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ width: { xs: 120, sm: 200 } }}>{d.organism}</Typography>
              <LinearProgress variant="determinate" value={d.confidence} sx={{ flex: 1, mx: 2, height: 10, borderRadius: 5, bgcolor: '#e0e0e0' }} color={d.confidence > 80 ? 'success' : d.confidence > 50 ? 'warning' : 'error'} />
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>{d.confidence}%</Typography>
            </Box>
          ))
        ) : <Typography variant="body2" color="textSecondary">Collect lab data to generate differential diagnoses.</Typography>}
        {currentPatient.labFindings.differentials?.length > 0 && <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>Higher confidence = better evidence match. Use all lab tests to narrow down.</Typography>}
      </Paper>
    </Box>
  );
};

// ----- HospitalRoom -----
const HospitalRoom = () => {
  const store = useGameStore();
  const { currentRoom, patients, currentPatient, labSceneActive } = store;

  if (labSceneActive) return <PhaserLabModal sceneType={labSceneActive} patientId={store.labPatientId} onClose={store.endLabScene} />;

  const renderRoom = () => {
    switch (currentRoom) {
      case 'triage': return <TriagePanel patients={patients} />;
      case 'ward': return <WardPanel patients={patients} onSelectPatient={(p) => { store.setCurrentPatient(p); store.logObservation(`Selected ${p.name} for examination`); }} />;
      case 'lab': return <LabPanel currentPatient={currentPatient} />;
      case 'pharmacy': return <PharmacyPanel />;
      case 'logs': return (
        <Box>
          <Typography variant="h5" mb={2}>📋 Activity Logs</Typography>
          <Box sx={{ mb: 2 }}><HospitalDashboard /></Box>
          <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List dense>
              {store.observationLog.map((log, i) => <ListItem key={i} divider><ListItemText primary={log.msg} secondary={log.time} primaryTypographyProps={{ variant: 'body2' }} secondaryTypographyProps={{ variant: 'caption' }} /></ListItem>)}
              {store.observationLog.length === 0 && <ListItem><ListItemText primary="No activity yet. Start by admitting patients." /></ListItem>}
            </List>
          </Paper>
        </Box>
      );
      default: return <Typography>Unknown room: {currentRoom}</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#eef2f6' }}>
      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />
      <Paper sx={{ width: 240, m: 0.5, p: 1.5, display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', color: '#fff', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 16 }}><LocalHospitalIcon sx={{ mr: 1, color: '#60a5fa' }} /> MicrobeRPG</Typography>
        <Typography variant="caption" sx={{ mb: 1.5, color: '#94a3b8' }}>Day {store.hospitalDay}</Typography>
        <List sx={{ flex: 1, '& .MuiListItemButton-root': { borderRadius: 1, mb: 0.2 } }}>
          {[{ id: 'triage', icon: '🚑', label: 'Triage' }, { id: 'ward', icon: '🏥', label: 'Ward' }, { id: 'lab', icon: '🔬', label: 'Lab Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'logs', icon: '📋', label: 'Logs & Stats' }].map(item => (
            <ListItem key={item.id} disablePadding><ListItemButton selected={currentRoom === item.id} onClick={() => store.setCurrentRoom(item.id)} sx={{ '&.Mui-selected': { bgcolor: '#334155', '&:hover': { bgcolor: '#3d4a63' } } }}><ListItemText primary={`${item.icon} ${item.label}`} /></ListItemButton></ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1, borderColor: '#334155' }} />
        <Button variant="outlined" sx={{ color: '#fff', borderColor: '#60a5fa', mb: 1, fontSize: 12 }} onClick={() => { store.advanceDay(); toast.info(`Day ${store.hospitalDay + 1}`); }} fullWidth startIcon={<TimelineIcon />}>Advance Day</Button>
        <Box sx={{ p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="caption" color="#94a3b8" fontWeight="bold">Stats</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}><Typography variant="caption" color="#4ade80">💰 ${store.money}</Typography><Typography variant="caption" color="#facc15">⭐ {store.reputation}</Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="caption" color="#60a5fa">✅ {store.diagnosticStats.correct}</Typography><Typography variant="caption" color="#94a3b8">📊 {store.diagnosticStats.totalCases}</Typography></Box>
        </Box>
        {store.achievements.length > 0 && <Box sx={{ mt: 1, p: 0.5, bgcolor: '#0f172a', borderRadius: 1 }}><Typography variant="caption" color="#94a3b8">🏆 {store.achievements.length} achievement{store.achievements.length > 1 ? 's' : ''}</Typography></Box>}
      </Paper>
      <Box sx={{ flex: 1, m: 0.5, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, overflowY: 'auto' }}>{renderRoom()}</Box>
    </Box>
  );
};

export default function App() {
  const store = useGameStore();
  useEffect(() => { if (store.patients.length === 0) { for (let i = 0; i < 3; i++) { store.addPatient(store.generatePatient()); } } }, [store]);
  return <HospitalRoom />;
}