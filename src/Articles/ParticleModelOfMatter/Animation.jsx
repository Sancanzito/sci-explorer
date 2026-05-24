// Animation.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paper, Box, Typography, Button, ToggleButtonGroup, ToggleButton, alpha, useTheme } from '@mui/material';
import { AcUnit, WaterDrop, Air } from '@mui/icons-material';

// Component A: Standard States Renderer Engine
export const StateComparison = () => {
  const [currentState, setCurrentState] = useState('solid');
  const theme = useTheme();

  const variants = {
    solid: (i) => ({
      x: (i % 6) * 15 + 10,
      y: Math.floor(i / 6) * 15 + 10,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }),
    liquid: (i) => ({
      x: (i % 4) * 28 + Math.sin(i) * 8 + 5,
      y: Math.floor(i / 4) * 22 + Math.cos(i) * 6 + 15,
      transition: { type: "spring", stiffness: 100, damping: 14 }
    }),
    gas: (i) => ({
      x: Math.sin(i * 4.3) * 85 + 100,
      y: Math.cos(i * 2.9) * 45 + 50,
      transition: { type: "spring", stiffness: 50, damping: 8 }
    })
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="subtitle1" fontWeight="bold">Interactive Particle Array Map</Typography>
        <ToggleButtonGroup
          value={currentState}
          exclusive
          onChange={(e, value) => value && setCurrentState(value)}
          size="small"
          color="primary"
        >
          <ToggleButton value="solid"><AcUnit sx={{ mr: 0.5, fontSize: 16 }} /> Solid</ToggleButton>
          <ToggleButton value="liquid"><WaterDrop sx={{ mr: 0.5, fontSize: 16 }} /> Liquid</ToggleButton>
          <ToggleButton value="gas"><Air sx={{ mr: 0.5, fontSize: 16 }} /> Gas</ToggleButton>
          </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 160, bgcolor: 'grey.900', borderRadius: 2, position: 'relative', overflow: 'hidden', p: 2 }}>
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            animate={currentState}
            variants={variants}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: currentState === 'solid' ? '#60a5fa' : currentState === 'liquid' ? '#a78bfa' : '#f59e0b',
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

// Component B: Heat Slider Velocity Engine
export const HeatingSimulation = () => {
  const [temperature, setTemperature] = useState(25);
  const theme = useTheme();

  const getParticleColor = (temp) => {
    if (temp < 45) return theme.palette.info.main;
    if (temp < 75) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getSpeedMultiplier = (temp) => (temp / 25);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Thermal Kinetic Velocity Simulation
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Use slider to add thermal energy. Watch particle vibration change:
      </Typography>

      <Box sx={{ height: 140, bgcolor: 'grey.900', borderRadius: 2, position: 'relative', overflow: 'hidden', display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -12 * getSpeedMultiplier(temperature), 0],
              x: [0, (i % 2 === 0 ? 6 : -6) * getSpeedMultiplier(temperature), 0]
            }}
            transition={{
              repeat: Infinity,
              duration: Math.max(0.2, 1.5 - (temperature / 80)),
              ease: "easeInOut"
            }}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: getParticleColor(temperature),
              boxShadow: `0 0 8px ${alpha(getParticleColor(temperature), 0.6)}`
            }}
          />
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <input
          type="range"
          min="25"
          max="100"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.error.main} 100%)`,
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="caption" color="text.secondary">25°C (Cold)</Typography>
          <Typography variant="caption" color="text.secondary">60°C (Warm)</Typography>
          <Typography variant="caption" color="text.secondary">100°C (Boiling)</Typography>
        </Box>
      </Box>
    </Paper>
  );
};