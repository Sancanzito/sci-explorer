import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Box, Typography, Button, Paper, Select, MenuItem, FormControl,
  InputLabel, List, ListItem, ListItemButton, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, LinearProgress,
  Slider, FormGroup, FormControlLabel, Checkbox, Tooltip as MuiTooltip,
  Stack, Collapse, Tabs, Tab, Card, CardContent, CardHeader, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Accordion,
  AccordionSummary, AccordionDetails, Grid, IconButton
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

import { DISEASES, MEDICATION_INVENTORY, DURATIONS, ACHIEVEMENTS, STAIN_STEPS } from './gameData.js';
import { useGameStore } from './useMicrobeStore.js';
import {
  MicroscopeScene as MS, GramStainScene as GS,
  AcidFastScene as AF, BloodSmearScene as BS,
  CultureScene as CS, PatientExamScene as PE
} from './PhaserScenes.js';
import PhaserSceneManager from './PhaserSceneManager.js';

const formatAnalysis = (shape, arrangement) => {
  if (shape === 'cocci' && arrangement === 'pairs') return 'Cocci in pairs (Diplococci)';
  if (shape === 'cocci' && arrangement === 'chains') return 'Cocci in chains (Streptococci)';
  if (shape === 'cocci' && arrangement === 'clusters') return 'Cocci in clusters (Staphylococci)';
  if (shape === 'bacilli' && arrangement === 'chains') return 'Bacilli in chains (Streptobacilli)';
  if (shape === 'bacilli' && arrangement === 'pairs') return 'Bacilli in pairs (Diplobacilli)';

  const shapeText = shape ? shape.charAt(0).toUpperCase() + shape.slice(1).replace('_', ' ') : '';
  const arrText = arrangement ? arrangement.charAt(0).toUpperCase() + arrangement.slice(1) : '';

  if (shapeText && arrText) return `${shapeText} in arrangement: ${arrText}`;
  if (shapeText) return shapeText;
  return 'Pending';
};

// ============================================================
// TUTORIAL CARD COMPONENT
// ============================================================
const TutorialCard = ({ title, content, icon, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <Card sx={{ borderLeft: '4px solid #1976d2', mb: 2 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon} {title}
          </Box>
        }
        action={
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

// ============================================================
// REFERENCE LIBRARY COMPONENT (FIXED)
// ============================================================
const ReferenceLibrary = ({ open, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPathogens = Object.entries(DISEASES).filter(([_, d]) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Reference Library</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)} sx={{ mb: 2 }}>
          <Tab label="Pathogens" />
          <Tab label="Antibiotics" />
          <Tab label="Lab Techniques" />
          <Tab label="Treatment Manual" />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search pathogens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            {filteredPathogens.map(([key, d]) => (
              <Accordion key={key} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {d.name}
                  </Typography>
                  <Chip label={d.pathogen} size="small" sx={{ ml: 2 }} />
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                      <strong>Type:</strong> {d.type}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                      <strong>Symptoms:</strong> {d.symptoms.join(', ')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                      <strong>Culture Media:</strong> {d.cultureMedia || 'Does not culture on standard media'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      <strong>Stain Results:</strong> Gram: {d.observations.gram || 'N/A'}, AFB: {d.observations.acidFast || 'Negative'}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {selectedTab === 1 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Drug</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Doses</strong></TableCell>
                  <TableCell><strong>Frequencies</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(MEDICATION_INVENTORY).map(([name, info]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{info.class}</TableCell>
                    <TableCell>{info.doseRange.join(', ')}</TableCell>
                    <TableCell>{info.freqRange.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedTab === 2 && (
          <Box>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Gram Stain Procedure
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {STAIN_STEPS.gram.map((step, idx) => (
                    <Box key={step.name} sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                        Step {idx + 1}: {step.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                        {step.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Duration: {step.duration}s
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Acid‑Fast (Ziehl‑Neelsen) Stain
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {STAIN_STEPS.acidFast.map((step, idx) => (
                    <Box key={step.name} sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                        Step {idx + 1}: {step.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                        {step.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Duration: {step.duration}s
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {selectedTab === 3 && (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Pathogen</strong></TableCell>
                  <TableCell><strong>Required Regimen</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPathogens.map(([key, d]) => (
                  <TableRow key={key}>
                    <TableCell>{d.pathogen}</TableCell>
                    <TableCell>
                      {d.treatments.map((t, i) => (
                        <Typography key={i} variant="caption" display="block">
                          {t.drug}: {t.dose}, {t.frequency} ({t.days} days)
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ============================================================
// PATIENT CHART COMPONENT (Aggregated View)
// ============================================================
const PatientChart = ({ patient }) => {
  if (!patient) return null;

  const disease = DISEASES[patient.diseaseId];
  const lf = patient.labFindings || {};

  return (
    <Paper sx={{ p: 2, mb: 2, maxHeight: 600, overflow: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentIcon /> Complete Patient Chart: {patient.name}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Current Vitals
            </Typography>
            <Stack spacing={0.5}>
              <Chip label={`🌡 Temp: ${patient.vitals.temp[0]}°C`} size="small" />
              <Chip label={`💓 HR: ${patient.vitals.hr[0]} bpm`} size="small" />
              <Chip label={`🫁 O2 Sat: ${patient.vitals.o2sat[0]}%`} size="small" />
              <Chip label={`💨 RR: ${patient.vitals.rr[0]}  /min`} size="small" />
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Diagnosis
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Suspected:</strong> {disease?.name}
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Pathogen:</strong> {disease?.pathogen}
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Type:</strong> {disease?.type}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ p: 1.5, bgcolor: '#f0f4ff', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Lab Findings
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  <strong>Microscopy:</strong>{' '}
                  {lf.observations && Object.keys(lf.observations).length > 0
                    ? Object.entries(lf.observations)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' | ')
                    : 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  <strong>Gram Stain:</strong> {lf.gramStain?.result || 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  <strong>AFB Stain:</strong> {lf.acidFast?.result || 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  <strong>Culture:</strong> {lf.culture ? (lf.culture.growth ? 'Positive' : 'Negative') : 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  <strong>Parasitemia:</strong> {lf.parasitemia?.percentage || 'N/A'}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ p: 1.5, bgcolor: '#f0f8f0', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Differential Diagnoses
            </Typography>
            {lf.differentials?.length > 0 ? (
              lf.differentials.map((d, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ width: 180 }}>
                    {d.organism}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={d.confidence}
                    sx={{ flex: 1, mx: 1, height: 8, borderRadius: 4 }}
                    color={d.confidence > 80 ? 'success' : d.confidence > 50 ? 'warning' : 'error'}
                  />
                  <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right' }}>
                    {d.confidence}%
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="caption" color="textSecondary">
                Collect more lab data to generate differentials.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// ============================================================
// OBSERVATION CHECKLIST
// ============================================================
const ObservationChecklist = ({ checklist, setChecklist, diseaseId, patientObservations }) => {
  const disease = DISEASES[diseaseId];
  const correct = disease?.correctChecklist || {};

  const calcConfidence = () => {
    let score = 0;
    let total = 0;
    ['shape', 'arrangement'].forEach(key => {
      if (checklist[key]) {
        total++;
        if (checklist[key] === correct[key]) score++;
      }
    });
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const confidence = calcConfidence();
  const confidenceColor = confidence >= 80 ? 'success' : confidence >= 50 ? 'warning' : 'error';

  const categories = [
    { label: 'Shape', key: 'shape', options: [
      { value: 'cocci', label: 'Cocci (Spheres)' },
      { value: 'bacilli', label: 'Bacilli (Rods)' },
      { value: 'yeast', label: 'Yeast (Oval)' },
      { value: 'ring_form', label: 'Ring Forms' },
      { value: 'none', label: 'None Visible' }
    ]},
    { label: 'Arrangement', key: 'arrangement', options: [
      { value: 'chains', label: 'Chains (Strepto-)' },
      { value: 'pairs', label: 'Pairs (Diplo-)' },
      { value: 'clusters', label: 'Clusters (Staphylo-)' },
      { value: 'single', label: 'Single' },
      { value: 'none', label: 'None Visible' }
    ]}
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: '#f8faff' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MenuBookIcon fontSize="small" /> Microscopy Checklist
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
        Identify the organism's morphology
      </Typography>

      {categories.map(cat => (
        <Box key={cat.key} sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555', display: 'block', mb: 0.5 }}>
            {cat.label}:
          </Typography>
          <FormGroup row>
            {cat.options.map(opt => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    size="small"
                    checked={checklist[cat.key] === opt.value}
                    onChange={(e) =>
                      setChecklist(prev => ({ ...prev, [cat.key]: e.target.checked ? opt.value : '' }))
                    }
                    sx={{ '&.Mui-checked': { color: '#1976d2' } }}
                  />
                }
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
          <Box sx={{ flex: 1, mx: 1 }}>
            <LinearProgress variant="determinate" value={confidence} color={confidenceColor} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
          {confidence}%
        </Typography>
      </Box>

      {patientObservations && Object.values(patientObservations).filter(Boolean).length > 0 && (
        <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f8f0', borderRadius: 1 }}>
          <Typography variant="caption" color="success.main">
            ✓ Recorded: {formatAnalysis(patientObservations.shape, patientObservations.arrangement)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// ============================================================
// PHASER LAB MODAL (FIXED LAYOUT)
// ============================================================
const SCENE_KEY_MAP = {
  microscope: MS,
  gram: GS,
  acidfast: AF,
  bloodsmear: BS,
  culture: CS,
  exam: PE
};

const PhaserLabModal = ({ sceneType, patientId, onClose }) => {
  const containerRef = useRef(null);
  const sceneManagerRef = useRef(null);
  const store = useGameStore();
  const [isGameLoading, setIsGameLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const [checklist, setChecklist] = useState({ shape: '', arrangement: '', stain: '', special: '' });
  const [gramErrors, setGramErrors] = useState([]);
  const [parasitemia, setParasitemia] = useState({ infected: 0, total: 0, percentage: 0 });
  const [cultureResult, setCultureResult] = useState(null);
  const [examFindings, setExamFindings] = useState({});
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState(50);
  const [light, setLight] = useState(80);
  const [tutorialCard, setTutorialCard] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const patient = store.patients.find(p => p.id === patientId);
  const disease = patient ? DISEASES[patient.diseaseId] : null;

  useEffect(() => {
    let mounted = true;

    const initializeScene = async () => {
      try {
        if (!patient) throw new Error('Patient not found');

        const SceneClass = SCENE_KEY_MAP[sceneType];
        if (!SceneClass) throw new Error(`Unknown scene type: ${sceneType}`);

        await new Promise(resolve => {
          const checkContainer = () => {
            if (containerRef.current && containerRef.current.getBoundingClientRect().width > 0) {
              resolve();
            } else {
              setTimeout(checkContainer, 100);
            }
          };
          checkContainer();
        });

        if (!mounted) return;

        const initData = getSceneInitData();

        const manager = new PhaserSceneManager(containerRef, { sceneType, SceneClass, initData });
        sceneManagerRef.current = manager;
        await manager.initialize();
        if (!mounted) return;
        setupSceneListeners(manager);
        setIsGameLoading(false);
      } catch (error) {
        if (mounted) {
          console.error('Scene initialization error:', error);
          setInitError(error.message);
          setIsGameLoading(false);
        }
      }
    };

    const setupSceneListeners = (manager) => {
      const scene = manager.getScene();
      if (!scene) return;

      scene.events.on('procedure-complete', (data) => {
        if (sceneType === 'gram') {
          setGramErrors(data.errors || []);
          store.recordGramStainResult(patientId, data.result, data.errors);
          toast.success(`Gram stain completed: ${data.result}`);
          showTutorial(generateGramTutorial(data.result, data.errors));
        } else if (sceneType === 'acidfast') {
          store.recordAcidFastResult(patientId, data.result);
          toast.success(`AFB stain: ${data.result}`);
        }
      });

      scene.events.on('scan-complete', (data) => {
        setParasitemia(data);
        store.recordBloodSmearResult(patientId, data.infected, data.total, data.percentage);
        toast.success(`Blood smear analysis complete: ${data.percentage}% parasitemia`);
      });

      scene.events.on('culture-result', (data) => {
        setCultureResult(data);
        store.saveCultureResult(patientId, data);
        toast.success(`Culture result recorded`);
        showTutorial(generateCultureTutorial(data));
      });

      scene.events.on('exam-finding', (data) => {
        setExamFindings(prev => ({ ...prev, [data.region]: data.finding }));
      });

      scene.events.on('zoom-changed', (data) => {
        setZoom(data.zoom);
      });

      scene.events.on('focus-changed', (data) => {
        setFocus(data.focus);
      });

      scene.events.on('light-changed', (data) => {
        setLight(data.light);
      });

      scene.events.on('error-occurred', (data) => {
        toast.error(`Procedural error: ${data.error}`);
      });
    };

    const getSceneInitData = () => {
      const dataMap = {
        microscope: { patient, onSave: (obs) => store.saveMicroscopeObservations(patientId, obs || checklist) },
        gram: { disease, onFinish: (r, e) => setGramErrors(e || []) },
        acidfast: { disease, onFinish: (r) => {} },
        bloodsmear: { patient, onComplete: (i, t, p) => setParasitemia({ infected: i, total: t, percentage: p }) },
        culture: { disease, patient, onFinish: (r) => setCultureResult(r) },
        exam: { exam: disease?.physicalExam || {}, onLog: (region, finding) => setExamFindings(prev => ({ ...prev, [region]: finding })), onSave: () => {} }
      };
      return dataMap[sceneType];
    };

    const showTutorial = (tutorial) => {
      if (tutorial) setTutorialCard(tutorial);
    };

    const generateGramTutorial = (result, errors) => {
      const explanations = {
        gram_positive:
          'Gram-positive bacteria have a thick peptidoglycan layer that retains Crystal Violet-Iodine complex, appearing purple. Common Gram-positive pathogens include Streptococcus and Staphylococcus species.',
        gram_negative:
          'Gram-negative bacteria have a thin peptidoglycan layer surrounded by an outer membrane, which is disrupted by alcohol decolorization. They retain Safranin, appearing pink. Examples: E. coli, Neisseria.'
      };
      const errorMessages = errors.length > 0
        ? `Your errors: ${errors.join('; ')}. Remember: proper decolorization timing is critical. Too much alcohol removes dye from all bacteria.`
        : 'Perfect technique! You performed the stain correctly.';
      return {
        title: '📚 Gram Stain Result',
        content: `${explanations[result] || ''} ${errorMessages}`,
        icon: <ScienceIcon />
      };
    };

    const generateCultureTutorial = (result) => {
      const mediaExplanations = {
        'Blood Agar': 'Blood Agar is enriched with sheep red blood cells. It supports growth of many fastidious organisms and allows observation of hemolysis patterns.',
        'MacConkey Agar': 'MacConkey Agar is selective for Gram-negative bacteria and differential for lactose fermentation. Pink colonies = lactose fermenters (like E. coli); colorless = non-fermenters.',
        'Chocolate Agar': 'Chocolate Agar contains lysed RBCs, providing X (hematin) and V (NAD) factors. Essential for fastidious organisms like Neisseria and Haemophilus.',
        'Sabouraud Agar': 'Sabouraud Agar has acidic pH and high sugar content, selective for fungi and yeasts. Inhibits bacterial growth.'
      };
      const explanation = mediaExplanations[result.media] || `${result.media} was selected.`;
      const growthStatus = result.growth
        ? `Growth observed: ${result.description}. Colony count: ~${result.colonyCount} CFU.`
        : 'No growth observed. This may indicate the wrong medium was selected or the organism requires special conditions.';
      return {
        title: '📚 Culture Media Guide',
        content: `${explanation} ${growthStatus}`,
        icon: <BiotechIcon />
      };
    };

    initializeScene();

    return () => {
      mounted = false;
      if (sceneManagerRef.current) {
        sceneManagerRef.current.shutdown();
      }
    };
  }, [sceneType, patientId]);

  const handleSliderChange = (setting, value) => {
    if (!sceneManagerRef.current) return;
    const scene = sceneManagerRef.current.getScene();
    if (!scene) return;

    if (setting === 'zoom') {
      setZoom(value);
      scene.setZoom?.(value);
    } else if (setting === 'focus') {
      setFocus(value);
      scene.setFocus?.(value);
    } else if (setting === 'light') {
      setLight(value);
      scene.setLight?.(value);
    }
  };

  const handleGramChemical = (chemicalName) => {
    if (!sceneManagerRef.current) return;
    const scene = sceneManagerRef.current.getScene();
    if (scene) {
      scene.events.emit('apply-chemical', { chemicalName });
    }
  };

  const handleAcidFastStep = (stepNum) => {
    if (!sceneManagerRef.current) return;
    const scene = sceneManagerRef.current.getScene();
    if (scene) {
      scene.events.emit('apply-step', { stepNumber: stepNum });
    }
  };

  const handleSaveMicroscopy = () => {
    if (!sceneManagerRef.current) return;
    const scene = sceneManagerRef.current.getScene();
    if (scene) {
      store.saveMicroscopeObservations(patientId, checklist);
      toast.success('Observations saved');
      scene.events.emit('save-observations', {});
    }
  };

  const renderSidePanel = () => {
    switch (sceneType) {
      case 'microscope':
        return (
          <>
            <Paper sx={{ p: 2, mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Microscope Controls
              </Typography>
              <Typography variant="caption">Zoom</Typography>
              <Slider size="small" min={1} max={6} step={1} value={zoom} onChange={(_, v) => handleSliderChange('zoom', v)} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Fine Focus
              </Typography>
              <Slider size="small" min={0} max={100} value={focus} onChange={(_, v) => handleSliderChange('focus', v)} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Light Source
              </Typography>
              <Slider size="small" min={0} max={100} value={light} onChange={(_, v) => handleSliderChange('light', v)} />
              <Button fullWidth variant="contained" size="small" sx={{ mt: 1 }} onClick={handleSaveMicroscopy}>
                Save Observations
              </Button>
            </Paper>
            <ObservationChecklist
              checklist={checklist}
              setChecklist={setChecklist}
              diseaseId={patient.diseaseId}
              patientObservations={patient.labFindings?.observations}
            />
          </>
        );

      case 'gram':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Gram Stain Procedure
            </Typography>
            <List dense>
              {STAIN_STEPS.gram.map((step, idx) => (
                <ListItem key={step.name} disablePadding sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleGramChemical(step.name)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: `#${step.color.toString(16).padStart(6, '0')}`
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: `#${step.color.toString(16).padStart(6, '0')}`,
                        mr: 1,
                        borderRadius: '50%'
                      }}
                    />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2">
                        {idx + 1}. {step.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {step.description}
                      </Typography>
                    </Box>
                  </Button>
                </ListItem>
              ))}
            </List>
            {gramErrors.length > 0 && (
              <Box sx={{ mt: 2, p: 1, bgcolor: '#fff0f0', borderRadius: 1 }}>
                <Typography variant="caption" color="error">
                  Procedural Errors:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: '12px', color: '#d32f2f' }}>
                  {gramErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        );

      case 'acidfast':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Acid-Fast Stain (Ziehl-Neelsen)
            </Typography>
            <List dense>
              {STAIN_STEPS.acidFast.map((step, idx) => (
                <ListItem key={step.name} disablePadding sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAcidFastStep(idx + 1)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: `#${step.color.toString(16).padStart(6, '0')}`
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: `#${step.color.toString(16).padStart(6, '0')}`,
                        mr: 1,
                        borderRadius: '50%'
                      }}
                    />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2">
                        {idx + 1}. {step.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {step.description}
                      </Typography>
                    </Box>
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        );

      case 'bloodsmear':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Parasitemia Analysis
            </Typography>
            <Typography variant="body2">Total RBCs Counted: {parasitemia.total}</Typography>
            <Typography variant="body2">Infected RBCs: {parasitemia.infected}</Typography>
            <Box sx={{ mt: 2, p: 1, bgcolor: parasitemia.percentage > 0 ? '#fff0f0' : '#f0f8f0', borderRadius: 1 }}>
              <Typography variant="subtitle1" align="center" color={parasitemia.percentage > 0 ? 'error' : 'success.main'}>
                {parasitemia.percentage}% Parasitemia
              </Typography>
            </Box>
          </Paper>
        );

      case 'culture':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Culture Results
            </Typography>
            {cultureResult ? (
              <Box>
                <Typography variant="body2">
                  <strong>Media:</strong> {cultureResult.media}
                </Typography>
                <Typography variant="body2">
                  <strong>Growth:</strong> {cultureResult.growth ? 'Positive' : 'Negative'}
                </Typography>
                {cultureResult.growth && (
                  <>
                    <Typography variant="body2">
                      <strong>Count:</strong> ~{cultureResult.colonyCount} CFU
                    </Typography>
                    <Typography variant="body2">
                      <strong>Appearance:</strong> {cultureResult.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Hemolysis:</strong> {cultureResult.hemolysis || 'None'}
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Select a media plate to inoculate.
              </Typography>
            )}
          </Paper>
        );

      case 'exam':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Physical Findings
            </Typography>
            <List dense>
              {['head', 'eyes', 'throat', 'chest', 'abdomen', 'skin'].map(region => (
                <ListItem key={region} divider sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={region.charAt(0).toUpperCase() + region.slice(1)}
                    secondary={
                      <Typography
                        variant="body2"
                        color={examFindings[region] && examFindings[region] !== 'Normal' ? 'error' : 'textSecondary'}
                      >
                        {examFindings[region] || 'Not examined'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={onClose}>
              Finish Examination
            </Button>
          </Paper>
        );

      default:
        return null;
    }
  };

  if (!patient) return null;

  return (
    <Dialog open fullScreen onClose={onClose} keepMounted transitionDuration={200}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', bgcolor: '#1e293b', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {sceneType === 'microscope' && <><BiotechIcon /> Microscopy Lab</>}
          {sceneType === 'gram' && <><ScienceIcon /> Gram Stain Lab</>}
          {sceneType === 'acidfast' && <><ScienceIcon /> Acid-Fast Stain Lab</>}
          {sceneType === 'bloodsmear' && <><BloodtypeIcon /> Blood Smear Lab</>}
          {sceneType === 'culture' && <><ScienceIcon /> Culture Laboratory</>}
          {sceneType === 'exam' && <><PersonIcon /> Patient Examination Room</>}
          <Typography variant="subtitle1" sx={{ ml: 2, borderLeft: '1px solid #334155', pl: 2 }}>
            Patient: {patient.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button startIcon={<AssessmentIcon />} sx={{ color: '#fff' }} onClick={() => setShowChart(!showChart)}>
            {showChart ? 'Hide' : 'Show'} Chart
          </Button>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          bgcolor: '#0b0f1a',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', border: '2px solid #1e293b', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div ref={containerRef} style={{ flex: 1, minHeight: 0, width: '100%' }} />

          {isGameLoading && !initError && (
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                bgcolor: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', zIndex: 10
              }}
            >
              <div
                style={{
                  width: 40, height: 40,
                  border: '4px solid #f3f3f3', borderTop: '4px solid #3498db',
                  borderRadius: '50%', animation: 'spin 1s linear infinite'
                }}
              />
              <Typography variant="body2" sx={{ color: '#fff', mt: 2 }}>
                Loading laboratory equipment...
              </Typography>
            </Box>
          )}

          {initError && (
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                bgcolor: 'rgba(0,0,0,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', zIndex: 10
              }}
            >
              <Typography variant="body2" sx={{ color: '#ff6666', mb: 1, textAlign: 'center', px: 2 }}>
                {initError}
              </Typography>
              <Button size="small" variant="contained" onClick={onClose}>
                Close Lab
              </Button>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: 340,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: 'auto',
            height: '100%',
            flexShrink: 0,
            pr: 1
          }}
        >
          {tutorialCard && (
            <TutorialCard
              title={tutorialCard.title}
              content={tutorialCard.content}
              icon={tutorialCard.icon}
              onClose={() => setTutorialCard(null)}
            />
          )}
          {renderSidePanel()}
        </Box>
      </DialogContent>

      <Dialog open={showChart} onClose={() => setShowChart(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Patient Chart</DialogTitle>
        <DialogContent>
          <PatientChart patient={patient} />
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog>
  );
};

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
const useKeyboardShortcuts = (store) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'g':
            e.preventDefault();
            if (store.currentPatient) store.startLabScene('gram', store.currentPatient.id);
            break;
          case 'm':
            e.preventDefault();
            if (store.currentPatient) store.startLabScene('microscope', store.currentPatient.id);
            break;
          case 'c':
            e.preventDefault();
            if (store.currentPatient) store.startLabScene('culture', store.currentPatient.id);
            break;
          case 'l':
            e.preventDefault();
            store.setCurrentRoom('lab');
            break;
          case 'p':
            e.preventDefault();
            store.setCurrentRoom('pharmacy');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [store]);
};

// ============================================================
// HOSPITAL DASHBOARD
// ============================================================
const HospitalDashboard = () => {
  const store = useGameStore();
  const { achievements, outcomeHistory, diagnosticStats, reputation, money, hospitalDay } = store;

  return (
    <Paper sx={{ p: 2, bgcolor: '#1e293b', color: '#fff', mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentIcon /> Hospital Dashboard
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="h5" color="#60a5fa">
            {hospitalDay}
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            Hospital Day
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="h5" color="#4ade80">
            ${money}
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            Budget
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="h5" color="#facc15">
            {reputation}%
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            Reputation
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="h5" color="#f3a461">
            {diagnosticStats.correct}/{diagnosticStats.totalCases}
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            Correct Cases
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip size="small" label={`✅ Correct: ${diagnosticStats.correct}`} color="success" variant="outlined" />
        <Chip size="small" label={`⚠ Partial: ${diagnosticStats.partial}`} color="warning" variant="outlined" />
        <Chip size="small" label={`❌ Wrong: ${diagnosticStats.wrong}`} color="error" variant="outlined" />
        <Chip size="small" label={`📊 Total: ${diagnosticStats.totalCases}`} color="info" variant="outlined" />
      </Box>
      {achievements.length > 0 && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #334155' }}>
          <Typography variant="caption" color="#94a3b8" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <EmojiEventsIcon sx={{ fontSize: 14 }} /> Achievements:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {achievements.map(a => (
              <MuiTooltip key={a} title={ACHIEVEMENTS[a]?.description || a}>
                <Chip
                  size="small"
                  label={`${ACHIEVEMENTS[a]?.icon || '🏆'} ${ACHIEVEMENTS[a]?.name || a}`}
                  sx={{ bgcolor: '#334155', color: '#fff', fontSize: 10 }}
                />
              </MuiTooltip>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// ============================================================
// PHARMACY PANEL
// ============================================================
const PharmacyPanel = () => {
  const store = useGameStore();
  const patient = store.currentPatient;
  const [draftDrug, setDraftDrug] = useState({ drug: '', dose: '', frequency: '', days: '' });
  const [regimenCart, setRegimenCart] = useState([]);

  if (!patient) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <MedicationIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">Select a patient from the Ward first.</Typography>
      </Paper>
    );
  }

  const selectedDrug = MEDICATION_INVENTORY[draftDrug.drug];
  const totalCost = regimenCart.reduce((sum, rx) => sum + MEDICATION_INVENTORY[rx.drug].cost, 0);
  // Inside PharmacyPanel component, after the cart display and before the Administer button

// Helper to get the standard regimen for the current patient's disease
const getStandardRegimen = () => {
  const disease = DISEASES[patient.diseaseId];
  if (!disease || !disease.treatments) return [];
  // Map directly to cart format
  return disease.treatments.map(tx => ({
    drug: tx.drug,
    dose: tx.dose,
    frequency: tx.frequency,
    days: tx.days
  }));
};

// Function to load standard regimen into cart (respecting allergies – shows warning)
const loadStandardRegimen = () => {
  const standard = getStandardRegimen();
  if (standard.length === 0) {
    toast.info("No standard drug regimen defined for this disease.");
    return;
  }
  // Check for allergies
  const allergicDrug = standard.find(rx => patient.allergies.includes(MEDICATION_INVENTORY[rx.drug]?.class));
  if (allergicDrug) {
    toast.error(`Cannot use standard regimen: ${allergicDrug.drug} is contraindicated due to allergy.`);
    return;
  }
  setRegimenCart(standard);
  toast.success("Standard regimen loaded. Review and administer.");
};

// Then add the button somewhere in the JSX, e.g., next to the total cost display:

<Button
  variant="outlined"
  color="secondary"
  onClick={loadStandardRegimen}
  sx={{ ml: 2 }}
  disabled={!patient}
>
  Use Standard Regimen
</Button>
  const handleAddToCart = () => {
    if (regimenCart.some(rx => rx.drug === draftDrug.drug)) {
      toast.error(`${draftDrug.drug} is already in the regimen.`);
      return;
    }
    setRegimenCart([...regimenCart, { ...draftDrug }]);
    setDraftDrug({ drug: '', dose: '', frequency: '', days: '' });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setRegimenCart(regimenCart.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="h5" mb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><MedicationIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Pharmacy & Treatment</span>
          <Chip label={`Budget: $${store.money}`} color={store.money < totalCost ? "error" : "success"} />
        </Typography>

        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Patient Profile: {patient.name}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2"><b>Age:</b> {patient.age} yrs</Typography>
              <Typography variant="body2"><b>Weight:</b> {patient.weight} kg</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2" color="error">
                <b>Known Allergies:</b> {patient.allergies?.length > 0 ? patient.allergies.join(', ') : 'None'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Vitals: Temp {patient.vitals.temp[0].toFixed(1)}°C | HR {patient.vitals.hr[0]}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="subtitle2" gutterBottom>Build Regimen</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Box sx={{ gridColumn: { xs: '1fr', md: 'span 4' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Medication</InputLabel>
              <Select
                value={draftDrug.drug} label="Select Medication"
                onChange={e => {
                  const drug = e.target.value;
                  const info = MEDICATION_INVENTORY[drug];
                  setDraftDrug({ ...draftDrug, drug, dose: '', frequency: '', days: info?.doseRange?.[0] ? draftDrug.days : '' });
                }}
              >
                {Object.entries(MEDICATION_INVENTORY).map(([name, info]) => (
                  <MenuItem key={name} value={name}>
                    {name} <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      ({info.class}) - ${info.cost}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedDrug && (
            <>
              <FormControl fullWidth size="small">
                <InputLabel>Dose</InputLabel>
                <Select value={draftDrug.dose} label="Dose" onChange={e => setDraftDrug({ ...draftDrug, dose: e.target.value })}>
                  {selectedDrug.doseRange.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Frequency</InputLabel>
                <Select value={draftDrug.frequency} label="Frequency" onChange={e => setDraftDrug({ ...draftDrug, frequency: e.target.value })}>
                  {selectedDrug.freqRange.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Duration</InputLabel>
                <Select value={draftDrug.days} label="Duration" onChange={e => setDraftDrug({ ...draftDrug, days: e.target.value })}>
                  {DURATIONS.map(d => <MenuItem key={d} value={d}>{d} Days</MenuItem>)}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={handleAddToCart}
                disabled={!draftDrug.drug || !draftDrug.dose || !draftDrug.frequency || !draftDrug.days}
              >
                Add to Cart
              </Button>
            </>
          )}
        </Box>

        <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <span>Prescription Cart ({regimenCart.length} item{regimenCart.length !== 1 ? 's' : ''})</span>
            <span>Total Cost: ${totalCost}</span>
          </Typography>
          {regimenCart.length === 0 ? (
            <Typography variant="caption" color="textSecondary">Cart is empty. Add drugs above to build a combination therapy.</Typography>
          ) : (
            <List dense disablePadding>
              {regimenCart.map((rx, idx) => (
                <ListItem key={idx} sx={{ bgcolor: '#fff', mb: 0.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <ListItemText
                    primary={<b>{rx.drug}</b>}
                    secondary={`${rx.dose} | ${rx.frequency} | ${rx.days} Days`}
                  />
                  <IconButton size="small" color="error" onClick={() => handleRemoveFromCart(idx)}>
                    <CloseIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          sx={{ mt: 3 }}
          disabled={regimenCart.length === 0 || store.money < totalCost}
          onClick={() => {
            store.evaluateTreatment(patient.id, regimenCart);
            setRegimenCart([]);
          }}
        >
          {store.money < totalCost ? 'Insufficient Hospital Funds' : 'Administer Regimen'}
        </Button>
      </Paper>
    </motion.div>
  );
};

// ============================================================
// TRIAGE PANEL
// ============================================================
const TriagePanel = ({ patients, onAdmit }) => {
  const store = useGameStore();
  const unadmitted = patients.filter(p => !p.admitted);

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        🚑 Emergency Triage
      </Typography>
      <AnimatePresence>
        {unadmitted.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }}>
            <Paper sx={{ p: 2, m: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Symptoms: {p.symptoms.join(', ')}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip size="small" label={`🌡 ${p.vitals.temp[0].toFixed(1)}°C`} color={p.vitals.temp[0] > 38 ? 'error' : 'default'} variant="outlined" />
                  <Chip size="small" label={`💓 ${p.vitals.hr[0]} bpm`} variant="outlined" />
                  <Chip size="small" label={`🫁 ${p.vitals.o2sat[0]}%`} color={p.vitals.o2sat[0] < 95 ? 'warning' : 'default'} variant="outlined" />
                </Stack>
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  store.updatePatient(p.id, { admitted: true });
                  store.setCurrentPatient(p);
                  store.setCurrentRoom('ward');
                  store.logObservation(`Admitted ${p.name}`);
                  toast.info(`${p.name} admitted to the ward.`);
                }}
              >
                Admit to Ward
              </Button>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
      {unadmitted.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography color="textSecondary" mb={1}>
            No patients waiting.
          </Typography>
          <Button variant="outlined" onClick={() => store.addPatient(store.generatePatient())}>
            Call Next Patient
          </Button>
        </Box>
      )}
    </Box>
  );
};

// ============================================================
// WARD PANEL
// ============================================================
const WardPanel = ({ patients, onSelectPatient }) => {
  const store = useGameStore();
  const admitted = patients.filter(p => p.admitted);

  if (admitted.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LocalHospitalIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">No patients currently admitted.</Typography>
        <Typography variant="caption" color="textSecondary">
          Go to Triage to admit patients.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        🏥 Patient Ward
      </Typography>
      {admitted.map(p => (
        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper sx={{ p: 2, m: 1, borderLeft: store.currentPatient?.id === p.id ? '6px solid #1976d2' : '6px solid transparent', bgcolor: store.currentPatient?.id === p.id ? '#f0f7ff' : '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {DISEASES[p.diseaseId]?.name || 'Unknown condition'} — Day {store.hospitalDay}
                </Typography>
              </Box>
              <Button
                variant={store.currentPatient?.id === p.id ? 'contained' : 'outlined'}
                onClick={() => onSelectPatient(p)}
              >
                {store.currentPatient?.id === p.id ? 'Selected' : 'Examine'}
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 4fr 5fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Vitals:
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  <Chip size="small" label={`🌡 ${p.vitals.temp[0].toFixed(1)}°C`} color={p.vitals.temp[0] > 38 ? 'error' : 'default'} variant="outlined" />
                  <Chip size="small" label={`💓 ${p.vitals.hr[0]} bpm`} variant="outlined" />
                  <Chip size="small" label={`🫁 ${p.vitals.o2sat[0]}%`} color={p.vitals.o2sat[0] < 95 ? 'warning' : 'default'} variant="outlined" />
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Fever Trend:
                </Typography>
                <Box sx={{ width: '100%', height: 60, minHeight: 60, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height={60} minWidth={1}>
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
                <Typography variant="caption" color="textSecondary">
                  Differentials:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                  {p.labFindings?.differentials?.length > 0 ? (
                    p.labFindings.differentials.map(d => (
                      <MuiTooltip key={d.organism} title={`Confidence: ${d.confidence}%`}>
                        <Chip
                          label={`${d.organism.split(' ').slice(-1)[0]} (${d.confidence}%)`}
                          size="small"
                          color={d.confidence > 80 ? 'success' : d.confidence > 50 ? 'warning' : 'default'}
                          variant="outlined"
                          sx={{ fontSize: 9 }}
                        />
                      </MuiTooltip>
                    ))
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      No lab data yet. Run lab tests.
                    </Typography>
                  )}
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
// LAB PANEL
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
    { type: 'exam', icon: <PersonIcon />, label: 'Physical Exam', color: '#1976d2', shortcut: 'Ctrl+E', done: Object.keys(lf.exam || {}).length > 0 },
    { type: 'gram', icon: <ScienceIcon />, label: 'Gram Stain', color: '#6a0dad', shortcut: 'Ctrl+G', done: !!lf.gramStain },
    { type: 'microscope', icon: <BiotechIcon />, label: 'Microscopy', color: '#00897b', shortcut: 'Ctrl+M', done: lf.observations && Object.keys(lf.observations).length > 0 },
    { type: 'acidfast', icon: <ScienceIcon />, label: 'Acid Fast Stain', color: '#d32f2f', shortcut: 'Ctrl+A', done: !!lf.acidFast },
    { type: 'bloodsmear', icon: <BloodtypeIcon />, label: 'Blood Smear', color: '#e91e63', shortcut: 'Ctrl+B', done: !!lf.bloodSmear },
    { type: 'culture', icon: <ScienceIcon />, label: 'Culture', color: '#f57c00', shortcut: 'Ctrl+C', done: !!lf.culture }
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        🔬 Laboratory Tests
      </Typography>

      <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight="bold">
          Microscopy:
        </Typography>
        {lf.observations && Object.keys(lf.observations).length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              label={formatAnalysis(lf.observations.shape, lf.observations.arrangement)}
              variant="outlined"
              sx={{ m: 0.2, fontSize: 11 }}
            />
            {lf.observations.stain && (
              <Chip size="small" label={lf.observations.stain} variant="outlined" sx={{ m: 0.2, fontSize: 11 }} />
            )}
          </Box>
        ) : (
          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
            Pending
          </Typography>
        )}
      </Box>

      <Grid container spacing={2}>
        {labTests.map(test => (
          <Grid item xs={12} sm={6} md={4} key={test.type}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: test.done ? '#f0f8f0' : '#fff',
                border: `1px solid ${test.done ? '#4caf50' : '#e0e0e0'}`,
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => store.startLabScene(test.type, currentPatient.id)}
            >
              <Box sx={{ color: test.done ? '#4caf50' : test.color, mb: 1 }}>
                {test.icon}
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {test.label}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block">
                Shortcut: {test.shortcut}
              </Typography>
              {test.done && (
                <CheckCircleIcon color="success" sx={{ fontSize: 16, mt: 1 }} />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ============================================================
// LEADERBOARD COMPONENT
// ============================================================
const Leaderboard = ({ open, onClose }) => {
  const store = useGameStore();

  const stats = [
    { label: 'Total Cases', value: store.diagnosticStats.totalCases },
    { label: 'Correct Diagnoses', value: store.diagnosticStats.correct },
    { label: 'Accuracy Rate', value: store.diagnosticStats.totalCases > 0 ? `${Math.round((store.diagnosticStats.correct / store.diagnosticStats.totalCases) * 100)}%` : 'N/A' },
    { label: 'Reputation', value: `${store.reputation}%` },
    { label: 'Budget', value: `$${store.money}` },
    { label: 'Achievements', value: store.achievements.length }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Performance Metrics</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {stats.map((stat, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================
// HOSPITAL ROOM (Main Component)
// ============================================================
const HospitalRoom = () => {
  const store = useGameStore();
  const { currentRoom, patients, currentPatient, labSceneActive } = store;
  const [refLibraryOpen, setRefLibraryOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  useKeyboardShortcuts(store);

  if (labSceneActive)
    return (
      <PhaserLabModal sceneType={labSceneActive} patientId={store.labPatientId} onClose={store.endLabScene} />
    );

  const renderRoom = () => {
    switch (currentRoom) {
      case 'triage':
        return <TriagePanel patients={patients} />;
      case 'ward':
        return <WardPanel patients={patients} onSelectPatient={(p) => { store.setCurrentPatient(p); store.logObservation(`Selected ${p.name} for examination`); }} />;
      case 'lab':
        return <LabPanel currentPatient={currentPatient} />;
      case 'pharmacy':
        return <PharmacyPanel />;
      case 'logs':
        return (
          <Box>
            <Typography variant="h5" mb={2}>
              📋 Activity Logs
            </Typography>
            <Box sx={{ mb: 2 }}>
              <HospitalDashboard />
            </Box>
            <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {store.observationLog.map((log, i) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={<Typography variant="body2">{log.msg}</Typography>}
                      secondary={<Typography variant="caption" color="textSecondary">{log.time}</Typography>}
                    />
                  </ListItem>
                ))}
                {store.observationLog.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No activity yet. Start by admitting patients." />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Box>
        );
      default:
        return <Typography>Unknown room: {currentRoom}</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#eef2f6' }}>
      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />

      {/* Sidebar */}
      <Paper
        sx={{
          width: 240,
          m: 0.5,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#1e293b',
          color: '#fff',
          flexShrink: 0,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 16 }}>
          <LocalHospitalIcon sx={{ mr: 1, color: '#60a5fa' }} /> MicrobeRPG
        </Typography>
        <Typography variant="caption" sx={{ mb: 1.5, color: '#94a3b8' }}>
          Day {store.hospitalDay}
        </Typography>

        <List sx={{ flex: 1, '& .MuiListItemButton-root': { borderRadius: 1, mb: 0.2 } }}>
          {[
            { id: 'triage', icon: '🚑', label: 'Triage' },
            { id: 'ward', icon: '🏥', label: 'Ward' },
            { id: 'lab', icon: '🔬', label: 'Lab Dashboard' },
            { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
            { id: 'logs', icon: '📋', label: 'Logs & Stats' }
          ].map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentRoom === item.id}
                onClick={() => store.setCurrentRoom(item.id)}
                sx={{ '&.Mui-selected': { bgcolor: '#334155', '&:hover': { bgcolor: '#3d4a63' } } }}
              >
                <ListItemText primary={`${item.icon} ${item.label}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1, borderColor: '#334155' }} />

        <Button
          variant="outlined"
          sx={{ color: '#fff', borderColor: '#60a5fa', mb: 1, fontSize: 12 }}
          onClick={() => { store.advanceDay(); toast.info(`Day ${store.hospitalDay + 1}`); }}
          fullWidth
          startIcon={<TimelineIcon />}
        >
          Advance Day
        </Button>

        <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
          <Button
            size="small"
            variant="text"
            startIcon={<MenuBookIcon />}
            onClick={() => setRefLibraryOpen(true)}
            sx={{ color: '#fff', fontSize: 10, flex: 1 }}
          >
            Library
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<EmojiEventsIcon />}
            onClick={() => setLeaderboardOpen(true)}
            sx={{ color: '#fff', fontSize: 10, flex: 1 }}
          >
            Stats
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<KeyboardIcon />}
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            sx={{ color: '#fff', fontSize: 10, flex: 1 }}
          >
            Keys
          </Button>
        </Stack>

        {showKeyboardShortcuts && (
          <Paper sx={{ p: 1, bgcolor: '#0f172a', borderRadius: 1, mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#94a3b8', display: 'block', mb: 0.5 }}>
              Keyboard Shortcuts:
            </Typography>
            <Typography variant="caption" color="#ccc" display="block" sx={{ fontSize: 9 }}>
              Ctrl+G: Gram stain | Ctrl+M: Microscopy | Ctrl+C: Culture | Ctrl+L: Lab | Ctrl+P: Pharmacy
            </Typography>
          </Paper>
        )}

        <Box sx={{ p: 1, bgcolor: '#0f172a', borderRadius: 1 }}>
          <Typography variant="caption" color="#94a3b8" fontWeight="bold">
            Stats
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="#4ade80">
              💰 ${store.money}
            </Typography>
            <Typography variant="caption" color="#facc15">
              ⭐ {store.reputation}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="#60a5fa">
              ✅ {store.diagnosticStats.correct}
            </Typography>
            <Typography variant="caption" color="#94a3b8">
              📊 {store.diagnosticStats.totalCases}
            </Typography>
          </Box>
        </Box>

        {store.achievements.length > 0 && (
          <Box sx={{ mt: 1, p: 0.5, bgcolor: '#0f172a', borderRadius: 1 }}>
            <Typography variant="caption" color="#94a3b8">
              🏆 {store.achievements.length} achievement{store.achievements.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, m: 0.5, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, overflowY: 'auto' }}>
        {renderRoom()}
      </Box>

      {/* Dialogs */}
      <ReferenceLibrary open={refLibraryOpen} onClose={() => setRefLibraryOpen(false)} />
      <Leaderboard open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
    </Box>
  );
};

export default function App() {
  const store = useGameStore();
  useEffect(() => {
    if (store.patients.length === 0) {
      for (let i = 0; i < 3; i++) {
        store.addPatient(store.generatePatient());
      }
    }
  }, [store]);
  return <HospitalRoom />;
}