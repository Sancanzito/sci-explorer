// src/components/graph/components/ScientificForm.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Slider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Chip,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { GraphParameters, ComputationType } from '../types';

interface ScientificFormProps {
  computationType: ComputationType;
  onTypeChange: (type: ComputationType) => void;
  onSubmit: (params: GraphParameters) => Promise<void>;
  isLoading: boolean;
}

const defaultParams: GraphParameters = {
  waveform_type: 'sine',
  amplitude: 1.0,
  frequency: 5.0,
  phase: 0,
  duration: 1.0,
  sample_rate: 1000,
  smoothing: 0,
  compute_fft: false,
  noise_level: 0,
  filter_type: 'lowpass',
  cutoff_freq: 10,
  filter_order: 4,
  matrix_dimensions: [3, 3],
  matrix_type: 'random',
  operation_type: 'eigenvalues',
  distribution_type: 'normal',
  sample_size: 1000,
};

export const ScientificForm: React.FC<ScientificFormProps> = ({
  computationType,
  onTypeChange,
  onSubmit,
  isLoading,
}) => {
  const [params, setParams] = useState<GraphParameters>(defaultParams);

  const updateParam = <K extends keyof GraphParameters>(key: K, value: GraphParameters[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(params);
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Scientific Workspace
        </h2>
        <p className="text-xs text-gray-400">Advanced computational visualization</p>
      </div>

      <FormControl fullWidth size="small">
        <InputLabel>Computation Type</InputLabel>
        <Select
          value={computationType}
          onChange={(e) => onTypeChange(e.target.value as ComputationType)}
          label="Computation Type"
        >
          <MenuItem value="waveform">Waveform Analysis</MenuItem>
          <MenuItem value="matrix">Matrix Operations</MenuItem>
          <MenuItem value="statistical">Statistical Analysis</MenuItem>
          <MenuItem value="filter">Signal Filtering</MenuItem>
        </Select>
      </FormControl>

      <AnimatePresence mode="wait">
        {computationType === 'waveform' && (
          <motion.div
            key="waveform"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <FormControl fullWidth size="small">
              <InputLabel>Waveform Type</InputLabel>
              <Select
                value={params.waveform_type}
                onChange={(e) => updateParam('waveform_type', e.target.value as any)}
                label="Waveform Type"
              >
                <MenuItem value="sine">Sine Wave</MenuItem>
                <MenuItem value="cosine">Cosine Wave</MenuItem>
                <MenuItem value="square">Square Wave</MenuItem>
                <MenuItem value="sawtooth">Sawtooth Wave</MenuItem>
                <MenuItem value="triangle">Triangle Wave</MenuItem>
              </Select>
            </FormControl>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Amplitude: {params.amplitude}</label>
              <Slider
                value={params.amplitude}
                onChange={(_, val) => updateParam('amplitude', val as number)}
                min={0.1}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ color: '#00ff9d' }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Frequency (Hz): {params.frequency}</label>
              <Slider
                value={params.frequency}
                onChange={(_, val) => updateParam('frequency', val as number)}
                min={0.1}
                max={100}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ color: '#00ff9d' }}
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={params.compute_fft}
                  onChange={(e) => updateParam('compute_fft', e.target.checked)}
                  sx={{ '& .MuiSwitch-track': { bgcolor: '#1a1a2e' } }}
                />
              }
              label="Compute FFT Spectrum"
            />

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Noise Level: {params.noise_level}</label>
              <Slider
                value={params.noise_level}
                onChange={(_, val) => updateParam('noise_level', val as number)}
                min={0}
                max={0.5}
                step={0.01}
                valueLabelDisplay="auto"
                sx={{ color: '#ff6b6b' }}
              />
            </div>
          </motion.div>
        )}

        {computationType === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Rows"
                type="number"
                size="small"
                value={params.matrix_dimensions[0]}
                onChange={(e) => updateParam('matrix_dimensions', [parseInt(e.target.value), params.matrix_dimensions[1]])}
                fullWidth
              />
              <TextField
                label="Columns"
                type="number"
                size="small"
                value={params.matrix_dimensions[1]}
                onChange={(e) => updateParam('matrix_dimensions', [params.matrix_dimensions[0], parseInt(e.target.value)])}
                fullWidth
              />
            </div>

            <FormControl fullWidth size="small">
              <InputLabel>Matrix Type</InputLabel>
              <Select
                value={params.matrix_type}
                onChange={(e) => updateParam('matrix_type', e.target.value as any)}
                label="Matrix Type"
              >
                <MenuItem value="random">Random Matrix</MenuItem>
                <MenuItem value="identity">Identity Matrix</MenuItem>
              </Select>
            </FormControl>

            {params.matrix_dimensions[0] === params.matrix_dimensions[1] && (
              <FormControl fullWidth size="small">
                <InputLabel>Operation</InputLabel>
                <Select
                  value={params.operation_type}
                  onChange={(e) => updateParam('operation_type', e.target.value as any)}
                  label="Operation"
                >
                  <MenuItem value="eigenvalues">Eigenvalues</MenuItem>
                  <MenuItem value="determinant">Determinant</MenuItem>
                  <MenuItem value="inverse">Inverse Matrix</MenuItem>
                  <MenuItem value="svd">SVD Decomposition</MenuItem>
                </Select>
              </FormControl>
            )}
          </motion.div>
        )}

        {computationType === 'statistical' && (
          <motion.div
            key="statistical"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <FormControl fullWidth size="small">
              <InputLabel>Distribution</InputLabel>
              <Select
                value={params.distribution_type}
                onChange={(e) => updateParam('distribution_type', e.target.value as any)}
                label="Distribution"
              >
                <MenuItem value="normal">Normal (Gaussian)</MenuItem>
                <MenuItem value="uniform">Uniform</MenuItem>
                <MenuItem value="exponential">Exponential</MenuItem>
                <MenuItem value="poisson">Poisson</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Sample Size"
              type="number"
              size="small"
              value={params.sample_size}
              onChange={(e) => updateParam('sample_size', parseInt(e.target.value))}
              fullWidth
            />
          </motion.div>
        )}

        {computationType === 'filter' && (
          <motion.div
            key="filter"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <FormControl fullWidth size="small">
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={params.filter_type}
                onChange={(e) => updateParam('filter_type', e.target.value as any)}
                label="Filter Type"
              >
                <MenuItem value="lowpass">Low-pass Filter</MenuItem>
                <MenuItem value="highpass">High-pass Filter</MenuItem>
                <MenuItem value="bandpass">Band-pass Filter</MenuItem>
                <MenuItem value="butterworth">Butterworth Filter</MenuItem>
              </Select>
            </FormControl>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Cutoff Frequency: {params.cutoff_freq} Hz</label>
              <Slider
                value={params.cutoff_freq}
                onChange={(_, val) => updateParam('cutoff_freq', val as number)}
                min={0.1}
                max={50}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ color: '#4ecdc4' }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Filter Order: {params.filter_order}</label>
              <Slider
                value={params.filter_order}
                onChange={(_, val) => updateParam('filter_order', val as number)}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{ color: '#4ecdc4' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          {isLoading ? 'Computing...' : 'Execute Computation'}
        </Button>
      </motion.div>
    </motion.form>
  );
};