// InvestigationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SafetyDivider, Science, Biotech, ContentCopy, Rule,
  Gavel, MonitorHeart, Report, CheckCircle,
  MenuBook, Calculate, TableChart, Lightbulb, QuestionAnswer,
  Checklist, Warning as WarningIcon, Science as ScienceIcon,
  School, PictureAsPdf, Download, GitHub, // <-- Removed from here
  Visibility, RemoveRedEye, Thermostat, Straighten, Scale,
  Timeline, ShowChart, Engineering, LocalHospital, Kitchen,
  WbSunny, AcUnit, Grass, Liquor, OilBarrel, WaterDrop,
  BubbleChart, Park, RocketLaunch, Bolt, ThumbUp, ThumbDown,
  FiberManualRecord, ExpandLess, ExpandMore, Flaky, Yard, Speed
} from '@mui/icons-material';

// 2. ADD CircularProgress to this block:
import { 
  Tooltip, Chip, LinearProgress, Card, CardContent, 
  IconButton, Collapse, Button, Radio, RadioGroup, 
  FormControlLabel, Checkbox, Slider, CircularProgress // <-- Added here
} from '@mui/material';

// Import the three components
import ScrollSpy from './ScrollSpy';
import MainContent from './MainContent';
import InvestigationFooter from './InvestigationFooter';

const InvestigationPage = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const sectionRefs = useRef({});

  const sections = [
    { id: 'intro', title: '🔬 Introduction', icon: <ScienceIcon /> },
    { id: 'safety', title: '🥽 Safety Rules', icon: <SafetyDivider /> },
    { id: 'challenge', title: '⚠️ Safety Challenge', icon: <Report /> },
    { id: 'equipment', title: '🧪 Lab Equipment', icon: <Biotech /> },
    { id: 'measurement', title: '📏 Measurement Skills', icon: <Calculate /> },
    { id: 'steps', title: '📋 Investigation Steps', icon: <MenuBook /> },
    { id: 'variables', title: '🔄 Variables', icon: <Rule /> },
    { id: 'obs-infer', title: '👁️ Observation vs Inference', icon: <Visibility /> },
    { id: 'data', title: '📊 Data Recording', icon: <TableChart /> },
    { id: 'applications', title: '🌍 Real-Life Applications', icon: <Lightbulb /> },
    { id: 'checklist', title: '✅ Skills Checklist', icon: <Checklist /> },
    { id: 'mistakes', title: '⚠️ Common Mistakes', icon: <WarningIcon /> },
    { id: 'mini-investigations', title: '🧪 Mini Investigations', icon: <ScienceIcon /> },
    { id: 'reflection', title: '💭 Reflection', icon: <QuestionAnswer /> }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        sectionRefs.current[section.id] = element;
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleSectionClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200"
          >
            Be a Young Scientist!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto"
          >
            Learning How Scientists Investigate Safely and Accurately
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            <Chip icon={<ScienceIcon />} label="Hands-on Learning" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<SafetyDivider />} label="Lab Safety" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<MenuBook />} label="Inquiry-Based" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </motion.div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Column 1: ScrollSpy - hidden on mobile, visible on lg */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ScrollSpy 
                sections={sections} 
                activeSection={activeSection} 
                onSectionClick={handleSectionClick} 
              />
            </div>
          </div>

          {/* Column 2: Main Content - spans 4 columns on large screens */}
          <div className="lg:col-span-4" id="main-content-container">
            <MainContent />
          </div>
        </div>

        {/* Footer - full width below the grid */}
        <div className="mt-8">
          <InvestigationFooter />
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;