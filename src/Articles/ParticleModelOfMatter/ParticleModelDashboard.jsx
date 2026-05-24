// ParticleModelDashboard.jsx - Grid Layout Optimization
import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  Typography,
  alpha 
} from '@mui/material';
import { School as SchoolIcon, Layers as LayersIcon } from '@mui/icons-material';

import ScrollSpy from './ParticleModelScroll';
import ParticleFooter from './ParticleFooter';
import MainContent from './MainContent';
import ComponentGenerator from './ComponentGenerator';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#60a5fa', dark: '#1e3a8a' },
    secondary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
    success: { main: '#059669', light: '#34d399', dark: '#065f46' },
    info: { main: '#0891b2', light: '#22d3ee', dark: '#155e75' },
    warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309' },
    error: { main: '#dc2626', light: '#f87171', dark: '#991b1b' },
    background: {
      default: '#f8fafc', 
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", -apple-system, sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    body2: { lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 16, 
  },
});

// Synced with MainContent section IDs perfectly
const sections = [
  { id: 'section-1', title: '1. What is Matter?' },
  { id: 'section-2', title: '2. The 4 Main Rules' },
  { id: 'section-3', title: '3. States of Matter' },
  { id: 'section-4', title: '4. Heat & Movement' },
];

export default function ParticleModelDashboard() {
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    const observers = [];
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          },
          { rootMargin: '-20% 0px -60% 0px' }
        );
        observer.observe(element);
        observers.push({ observer, element });
      }
    });
    return () => {
      observers.forEach(({ observer, element }) => observer.unobserve(element));
    };
  }, []);

  const handleSectionClick = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -40; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          
          {/* Custom 5x5 Grid Layout Implementation */}
          <div className="grid grid-cols-5 gap-6">
            
            {/* COLUMN 1: Sticky Sidebar Navigation Tracker Track */}
            <div className="col-span-1 row-span-4 self-start sticky top-10 space-y-4">
              <ScrollSpy 
                sections={sections} 
                activeSection={activeSection} 
                onSectionClick={handleSectionClick} 
              />
              
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 4, 
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.6),
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SchoolIcon fontSize="small" color="primary" />
                  <Typography variant="caption" fontWeight="800" color="primary.main" letterSpacing="0.05em" textTransform="uppercase">
                    Chemistry
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  The Particle Model of Matter
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  1. What Exactly is Matter?<br />
                  2. The 4 Rules of Particles<br />
                  3. The Three States of Matter & Temperature Changes
                </Typography>
              </Box>
            </div>

            {/* COLUMNS 2-5: Main Interactive Learning deck */}
            <div className="col-span-4 row-span-4 space-y-6">
              
              {/* Core Header Banner occupying the absolute top part */}
              <Box 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  borderRadius: 4, 
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  color: 'white',
                  boxShadow: '0 10px 30px -10px rgba(37, 99, 235, 0.3)'
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                  <LayersIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="subtitle2" fontWeight="600" sx={{ opacity: 0.9, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Interactive Science Hub
                  </Typography>
                </Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  The Particle Model of Matter
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 700, fontSize: '0.95rem' }}>
                  Explore the fundamental concepts of how atoms and molecules interact, rearrange, and shift behaviors across varying thermodynamic states.
                </Typography>
              </Box>

              {/* Document Container Content */}
              <Box
                id="printable-chemistry-content"
                sx={{ 
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.6),
                  p: { xs: 3, sm: 5 },
                  boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.03)',
                }}
              >
                <MainContent />
              </Box>

              {/* Dynamic Workspace Utilities */}
              <Box>
                <ComponentGenerator />
              </Box>
            </div>

            {/* FULL WIDTH SPAN ROW: Footer Layout Component */}
            <div className="col-span-5 mt-4">
              <ParticleFooter />
            </div>

          </div>
          
        </Container>
      </Box>
    </ThemeProvider>
  );
}