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
  Stack, Collapse, CircularProgress // <-- Added this
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

// ============================================================
// FIXED PhaserLabModal - waits for container dimensions
// ============================================================
const PhaserLabModal = ({ sceneType, patientId, onClose }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const store = useGameStore();
  const patient = store.patients.find(p => p.id === patientId);

  // 1. ADDED: State to track if the Phaser game is loading
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

    // Reset loading state every time the modal opens
    setIsGameLoading(true);

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

    let timeoutId;

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
        banner: false
      };

      const game = new Phaser.Game(phaserConfig);
      gameRef.current = game;

      game.events.once('ready', () => {
        if (gameRef.current) {
          game.scene.add(sceneType, cfg.Scene, true, cfg.initData);
          // 2. ADDED: Turn off the loading spinner once Phaser is ready
          setIsGameLoading(false);
        }
      });
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

  // --- Handlers remain exactly the same ---
  const handleSlider = (type, val) => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('MicroscopeScene');
      if (!scene) return;
      if (type === 'zoom') { scene.setZoom(val); setZoom(val); }
      if (type === 'focus') { scene.setFocus(val); setFocus(val); }
      if (type === 'light') { scene.setLight(val); setLight(val); }
    } catch (e) {}
  };

  const handleGramStain = (chemical) => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('GramStainScene');
      if (scene) {
        scene.applyChemical(chemical);
        setStainStep(prev => Math.min(prev + 1, 4));
      }
    } catch (e) {}
  };

  const handleGramReset = () => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('GramStainScene');
      if (scene) scene.reset();
      setStainStep(0);
      setGramErrors([]);
    } catch (e) {}
  };

  const handleAcidFast = (step) => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('AcidFastScene');
      if (scene) {
        scene.applyChemical(step);
        if (step >= 4) {
          const isAFB = disease?.observations?.acidFast === 'positive';
          store.recordAcidFastResult(patientId, isAFB ? 'positive' : 'negative');
        }
      }
    } catch (e) {}
  };

  const saveMicroscope = () => {
    store.saveMicroscopeObservations(patientId, checklist);
    const p = store.patients.find(pr => pr.id === patientId);
    if (p?.labFindings?.observations && Object.keys(p.labFindings.observations).filter(k => p.labFindings.observations[k]).length >= 3) {
      setTimeout(() => store.addAchievement('full_workup'), 1000);
    }
    onClose();
  };

  const saveExam = () => {
    store.updatePatient(patientId, { labFindings: { ...((store.patients.find(p => p.id === patientId))?.labFindings || {}), exam: examFindings } });
    store.logObservation(`Physical exam completed for patient.`);
    onClose();
  };

  // --- renderSidePanel() remains exactly the same ---
  // (Paste your existing renderSidePanel function here)
  const renderSidePanel = () => {
    switch (sceneType) {
      case 'microscope':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><BiotechIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Microscope Controls</Typography>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption">Zoom: {zoom.toFixed(1)}x</Typography>
              <Slider size="small" min={1} max={6} step={0.5} value={zoom} onChange={(e, v) => handleSlider('zoom', v)} sx={{ mt: 0 }} />
              <Stack direction="row" spacing={0.5}>
                {[{v:1,l:'10x'},{v:3,l:'40x'},{v:6,l:'100x'}].map(p => (
                  <Button key={p.v} size="small" variant={zoom === p.v ? 'contained' : 'outlined'} onClick={() => handleSlider('zoom', p.v)} sx={{ minWidth: 40, fontSize: 10 }}>{p.l}</Button>
                ))}
              </Stack>
            </Box>
            <Box sx={{ mb: 1.5 }}><Typography variant="caption">Focus</Typography><Slider size="small" min={0} max={100} value={focus} onChange={(e, v) => handleSlider('focus', v)} /></Box>
            <Box sx={{ mb: 1.5 }}><Typography variant="caption">Light Intensity</Typography><Slider size="small" min={0} max={100} value={light} onChange={(e, v) => handleSlider('light', v)} /></Box>
            <Divider sx={{ my: 1 }} />
            <ObservationChecklist checklist={checklist} setChecklist={setChecklist} diseaseId={patient?.diseaseId} patientObservations={patient?.labFindings?.observations} />
            <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={saveMicroscope} disabled={!checklist.shape} startIcon={<CheckCircleIcon />}>Record Observations</Button>
          </>
        );
      case 'gram':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><ScienceIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Gram Stain Protocol</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>Apply chemicals in order: CV → Iodine → Alcohol → Safranin</Typography>
            {STAIN_STEPS.gram.map((step, i) => (
              <Button key={step.name} fullWidth variant={stainStep > i ? 'outlined' : 'contained'} disabled={stainStep !== i}
                sx={{ mb: 0.5, bgcolor: stainStep === i ? step.color : undefined, '&.Mui-disabled': stainStep > i ? { bgcolor: '#e0e0e0' } : {}, color: stainStep > i ? '#000' : '#fff', justifyContent: 'flex-start', textTransform: 'none' }}
                onClick={() => handleGramStain(step.name)} startIcon={stainStep > i ? <CheckCircleIcon /> : null}>
                {i + 1}. {step.name}
              </Button>
            ))}
            {gramErrors.length > 0 && (
              <Paper sx={{ p: 1, mt: 1, bgcolor: '#fff0f0' }}>
                <Typography variant="caption" color="error">⚠️ Errors detected: {gramErrors.length}</Typography>
                {gramErrors.map((err, i) => <Typography key={i} variant="caption" display="block" color="error.main" sx={{ fontSize: 9 }}>• {err}</Typography>)}
              </Paper>
            )}
            <Box sx={{ mt: 'auto', pt: 1 }}>
              {stainStep >= 4 && <Typography variant="caption" color="success.main" sx={{ mb: 0.5, display: 'block' }}>✓ Stain procedure complete</Typography>}
              <Button fullWidth variant="outlined" color="warning" size="small" onClick={handleGramReset} startIcon={<RestartAltIcon />}>Reset Procedure</Button>
              <Button fullWidth variant="contained" color="success" sx={{ mt: 0.5 }} disabled={stainStep < 4} onClick={onClose}>Close & Save Results</Button>
            </Box>
          </>
        );
      case 'acidfast':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><ScienceIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Ziehl-Neelsen Stain</Typography>
            {[1, 2, 3, 4].map(step => (
              <Button key={step} fullWidth variant={stainStep >= step ? 'outlined' : 'contained'} disabled={stainStep >= step}
                sx={{ mb: 0.5, bgcolor: stainStep < step ? ['#ff4444', '#ff6600', '#dddddd', '#2244aa'][step - 1] : undefined, color: stainStep < step ? '#fff' : '#000', justifyContent: 'flex-start', textTransform: 'none' }}
                onClick={() => { handleAcidFast(step); setStainStep(step); }} startIcon={stainStep >= step ? <CheckCircleIcon /> : null}>
                {step}. {STAIN_STEPS.acidFast[step - 1].name}
              </Button>
            ))}
            <Box sx={{ mt: 'auto', pt: 1 }}><Button fullWidth variant="contained" color="success" disabled={stainStep < 4} onClick={onClose}>Close & Save Results</Button></Box>
          </>
        );
      case 'bloodsmear':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><BloodtypeIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Blood Smear Analysis</Typography>
            <Paper sx={{ p: 2, bgcolor: '#fff5f5', mb: 1 }}>
              <Typography variant="h4" color="error" sx={{ textAlign: 'center' }}>{parasitemia.infected}</Typography>
              <Typography variant="caption" display="block" textAlign="center">Infected RBCs Found</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">Total RBCs: <b>{parasitemia.total}</b></Typography>
              <Typography variant="body2">Parasitemia: <b>{parasitemia.percentage}%</b></Typography>
            </Paper>
            <Typography variant="caption" color="textSecondary">Click on infected RBCs (ring forms) to count them.</Typography>
            {parasitemia.infected > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: '#f0fff0', borderRadius: 1 }}>
                <Typography variant="caption" color="success.main">Severity: {parasitemia.percentage < 1 ? 'Mild (<1%)' : parasitemia.percentage < 5 ? 'Moderate (1-5%)' : 'Severe (>5%)'}</Typography>
              </Box>
            )}
            <Button fullWidth variant="contained" color="success" sx={{ mt: 'auto' }} disabled={parasitemia.infected === 0} onClick={() => { store.logObservation(`Blood smear: ${parasitemia.percentage}% parasitemia`); onClose(); }}>Save Blood Smear Results</Button>
          </>
        );
      case 'culture':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><ScienceIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Culture Results</Typography>
            {cultureResult ? (
              <Paper sx={{ p: 2, bgcolor: '#f0fff0', mb: 1 }}>
                <Typography variant="subtitle2" color="success.main">✓ Growth Observed</Typography>
                <Typography variant="body2">{cultureResult.description}</Typography>
                {cultureResult.hemolysis === 'beta' && <Typography variant="caption" color="warning.main">Beta-hemolysis detected</Typography>}
                {cultureResult.hemolysis === 'alpha' && <Typography variant="caption" color="info.main">Alpha-hemolysis detected</Typography>}
              </Paper>
            ) : <Typography variant="caption" color="textSecondary">Select a culture media from the bench below.</Typography>}
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" fontWeight="bold">Available Media:</Typography>
              {MEDIA_OPTIONS.map(m => (
                <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: `#${m.color.toString(16).padStart(6,'0')}` }} />
                  <Box><Typography variant="caption">{m.label}</Typography><Typography variant="caption" display="block" color="textSecondary" sx={{ fontSize: 9 }}>{m.description}</Typography></Box>
                </Box>
              ))}
            </Box>
            <Button fullWidth variant="contained" color="primary" sx={{ mt: 'auto' }} onClick={() => { store.logObservation(`Culture completed: ${cultureResult?.description || 'No growth'}`); onClose(); }}>Close Culture Lab</Button>
          </>
        );
      case 'exam':
        return (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}><PersonIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} /> Physical Examination</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>Click body regions on the patient to examine.</Typography>
            <Paper sx={{ p: 1.5, bgcolor: '#f5faff', flex: 1, overflow: 'auto' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>Findings:</Typography>
              {Object.keys(examFindings).length === 0 ? <Typography variant="caption" color="textSecondary">No findings yet. Click on body regions.</Typography> : (
                Object.entries(examFindings).map(([reg, val]) => (
                  <Box key={reg} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>{reg}:</Typography>
                    <Typography variant="caption" color={val === 'Normal' ? 'textSecondary' : 'warning.main'}>{val}</Typography>
                  </Box>
                ))
              )}
            </Paper>
            <Button fullWidth variant="contained" color="primary" sx={{ mt: 1 }} onClick={saveExam}>Log Examination Results</Button>
          </>
        );
      default:
        return <Typography>Unknown lab type: {sceneType}</Typography>;
    }
  }; 

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
        
        {/* 3. UPDATED: Wrapper box for the Phaser container AND the Loading Overlay */}
        <Box sx={{ position: 'relative', width: 550, height: 420, borderRadius: 2, overflow: 'hidden', border: '2px solid #333', flexShrink: 0, bgcolor: '#000' }}>
          
          {/* Phaser injects its canvas into this inner ref */}
          <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />
          
          {/* The Loading Overlay */}
          {isGameLoading && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#000000', zIndex: 10 }}>
              <CircularProgress size={48} sx={{ color: '#60a5fa', mb: 2 }} />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Initializing Lab Environment...
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 320 }}>
          {renderSidePanel()}
        </Box>
      </DialogContent>

      <DialogActions>
        {sceneType !== 'exam' && sceneType !== 'microscope' && (<Button onClick={onClose}>Close</Button>)}
      </DialogActions>
    </Dialog>
  );
};

// ============================================================
// PharmacyPanel (unchanged)
// ============================================================
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

// ============================================================
// HospitalDashboard (unchanged)
// ============================================================
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

// ============================================================
// TriagePanel (unchanged)
// ============================================================
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

// ============================================================
// WardPanel (fixed chart container)
// ============================================================
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

              {/* FIX 1: Added minWidth: 0 to prevent CSS Grid calculation errors */}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="textSecondary">Fever Trend:</Typography>
                <Box sx={{ width: '100%', height: 60 }}>
                  {/* FIX 2: Replaced height="100%" with height={60} */}
                  <ResponsiveContainer width="100%" height={60}>
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

// ============================================================
// LabPanel (unchanged)
// ============================================================
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

// ============================================================
// HospitalRoom (unchanged)
// ============================================================
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

const MicrobeRPG = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GameCanvas />
      <GameUI />
    </div>
  );
};

export default MicrobeRPG;