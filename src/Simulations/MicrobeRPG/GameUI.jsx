/**
 * @fileoverview React overlay for MicrobeRPG.
 * Provides a SCANNING modal + Snackbar + tool selector on top of the Phaser canvas.
 * Also handles E/1/2 keyboard shortcuts as a React backup.
 */

import React, { useEffect } from 'react';
import { useMicrobeStore } from './useMicrobeStore';
import {
  Typography,
  Button,
  Box,
  Paper,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Fab,
} from '@mui/material';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';

/* ── Answer options pool (must match SPECIES in GameCanvas) ── */
const ALL_MICROBES = [
  // Tier 1
  { id: '1', name: 'Staphylococcus aureus' },
  { id: '2', name: 'Bacillus subtilis' },
  { id: '3', name: 'Escherichia coli' },
  // Tier 2
  { id: '4', name: 'Helicobacter pylori' },
  { id: '5', name: 'Candida albicans' },
  { id: '6', name: 'Pseudomonas aeruginosa' },
  { id: '7', name: 'Aspergillus fumigatus' },
  // Tier 3
  { id: '8', name: 'Giardia lamblia' },
  { id: '9', name: 'Taenia saginata' },
  { id: '10', name: 'Plasmodium falciparum' },
  { id: '11', name: 'Schistosoma mansoni' },
  { id: '12', name: 'Enterococcus faecalis' },
];

const GameUI = () => {
  const {
    health,
    energy,
    scientificProgressionPoints,
    gamePhase,
    activeTarget,
    setGamePhase,
    addToTaxonomyEncyclopedia,
    setActiveTarget,
    addScientificProgressionPoints,
    currentTool,
    setCurrentTool,
  } = useMicrobeStore();

  const [snack, setSnack] = React.useState({ open: false, msg: '', severity: 'info' });

  /* ── React-side keyboard shortcuts (backup for Phaser) ── */
  useEffect(() => {
    const handler = (e) => {
      if (gamePhase === 'SCANNING') return; // let the modal handle it
      const key = e.key;
      if (key === 'e' || key === 'E') {
        if (gamePhase === 'ENCYCLOPEDIA') setGamePhase('EXPLORING');
        else setGamePhase('ENCYCLOPEDIA');
        e.preventDefault();
      } else if (key === '1') {
        setCurrentTool('microscope');
        e.preventDefault();
      } else if (key === '2') {
        setCurrentTool('gram stain');
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gamePhase, setGamePhase, setCurrentTool]);

  /* ── Build 4-option dropdown ── */
  const buildOptions = () => {
    if (!activeTarget) return [];

    const correctLabel = activeTarget.metadata.label;
    const decoys = ALL_MICROBES
      .filter((m) => m.name !== correctLabel)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((m) => ({ value: m.name, label: m.name }));

    return [...decoys, { value: correctLabel, label: correctLabel }].sort(() => Math.random() - 0.5);
  };

  /* ── Identification handler ── */
  const handleIdentify = (selectedLabel) => {
    if (!activeTarget) return;

    const correctLabel = activeTarget.metadata.label;

    if (selectedLabel === correctLabel) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      addToTaxonomyEncyclopedia({
        id: activeTarget.id,
        name: correctLabel,
        morphology: activeTarget.metadata.morph,
        gramStain: activeTarget.metadata.gram,
        motility: activeTarget.metadata.motil,
        disease: activeTarget.metadata.disease,
        kingdom: activeTarget.metadata.kingdom,
        discoveredAt: new Date().toISOString(),
      });
      addScientificProgressionPoints(10);
      document.dispatchEvent(new CustomEvent('microbe-identified', { detail: { id: activeTarget.id } }));
    } else {
      setSnack({ open: true, msg: `Not quite — that has ${activeTarget.metadata.morph}. Try again!`, severity: 'warning' });
      document.dispatchEvent(new CustomEvent('microbe-misidentified', { detail: { id: activeTarget.id } }));
    }

    setGamePhase('EXPLORING');
    setActiveTarget(null);
  };

  /* ── Auto-close snack ── */
  useEffect(() => {
    if (!snack.open) return;
    const t = setTimeout(() => setSnack((s) => ({ ...s, open: false })), 3000);
    return () => clearTimeout(t);
  }, [snack.open]);

  /* ════════════════════════════════════════════════════════════════
     RENDER HELPERS
     ════════════════════════════════════════════════════════════════ */

  /** Simple HUD (top-left) */
  const hud = (
    <Box sx={{ position: 'fixed', top: 8, left: 8, display: 'flex', gap: 1.5, alignItems: 'center', zIndex: 1000 }}>
      <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: health > 50 ? 'success.main' : 'warning.main' }}>
        {Math.round(health)}
      </Avatar>
      <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: energy > 50 ? 'info.main' : 'warning.main' }}>
        {Math.round(energy)}
      </Avatar>
      <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: 'primary.main' }}>
        {scientificProgressionPoints}
      </Avatar>
      <Button size="small" variant="contained" color="secondary" onClick={() => setGamePhase('ENCYCLOPEDIA')}>
        Encyclopedia (E)
      </Button>
    </Box>
  );

  /** Tool selector — floating vertical button stack */
  const toolSelector = (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[
        { key: 'microscope', label: 'Microscope [1]', icon: <BiotechIcon fontSize="small" /> },
        { key: 'gram stain', label: 'Gram Stain [2]', icon: <ScienceIcon fontSize="small" /> },
      ].map((t) => (
        <Fab
          key={t.key}
          size="small"
          sx={{
            bgcolor: t.key === currentTool ? 'success.main' : 'grey.600',
            color: '#fff',
            '&:hover': { bgcolor: t.key === currentTool ? 'success.dark' : 'grey.700' },
          }}
          onClick={() => setCurrentTool(t.key)}
          title={t.label}
        >
          {t.icon}
        </Fab>
      ))}
    </Box>
  );

  /** SCANNING modal */
  const scanModal = (gamePhase === 'SCANNING' && activeTarget) ? (
    <Box sx={{
      pointerEvents: 'auto', // Fix: allow interaction with the modal
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1100,
    }}>
      {/* Fix: changed 'bg' to 'bgcolor' for MUI Box compatibility */}
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 24, maxWidth: 380, width: '92%' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          <Typography variant="h5" gutterBottom>Identify the Microorganism</Typography>

          {currentTool === 'microscope' ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Morphology: <strong>{activeTarget.metadata.morph}</strong>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'text.secondary' }}>
              Morphology: <em>Requires Microscope Tool [1]</em>
            </Typography>
          )}

          {currentTool === 'gram stain' ? (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Gram-Stain: <strong>{activeTarget.metadata.gram}</strong>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
              Gram-Stain: <em>Requires Gram Stain Tool [2]</em>
            </Typography>
          )}

          <FormControl fullWidth size="small">
            <InputLabel>Select the pathogen</InputLabel>
            <Select label="Select the pathogen" value="" onChange={(e) => handleIdentify(e.target.value)} displayEmpty>
              <MenuItem value="" disabled>Make a selection</MenuItem>
              {buildOptions().map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </motion.div>
      </Box>
    </Box>
  ) : null;

  /** ENCYCLOPEDIA overlay */
  const encyclopedia = (gamePhase === 'ENCYCLOPEDIA') ? (() => {
    const entries = useMicrobeStore.getState().taxonomyEncyclopedia;
    const grouped = entries.reduce((acc, p) => {
      const k = p.kingdom || 'Unknown';
      (acc[k] = acc[k] || []).push(p);
      return acc;
    }, {});

    return (
      <Box sx={{ 
        pointerEvents: 'auto', // Fix: allow interaction with the encyclopedia
        position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 
      }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          {/* Fix: changed 'bg' to 'bgcolor' for MUI Box compatibility */}
          <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, maxWidth: 600, width: '92%', maxHeight: '85vh', overflow: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>Taxonomy Encyclopedia</Typography>
            <Button variant="outlined" size="small" sx={{ display: 'block', mx: 'auto', mb: 2 }} onClick={() => setGamePhase('EXPLORING')}>
              Return to Exploration [E]
            </Button>
            {Object.keys(grouped).map((k) => (
              <Paper key={k} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{k}</Typography>
                <List dense>
                  {grouped[k].map((p, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={p.name} secondary={`${p.morphology} · ${p.gramStain}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
            {entries.length === 0 && <Typography align="center" color="text.secondary">No discoveries yet!</Typography>}
          </Box>
        </motion.div>
      </Box>
    );
  })() : null;

  /* ════════════════════════════════════════════════════════════════
     ROOT RENDER
     ════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto' }}>{hud}</div>
      <div style={{ pointerEvents: 'auto' }}>{toolSelector}</div>
      {scanModal}
      {encyclopedia}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
};

export default GameUI;