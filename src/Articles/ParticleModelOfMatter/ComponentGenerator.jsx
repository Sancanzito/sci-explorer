// ComponentGenerator.jsx (Cleaned up Click-to-Reveal Exploration Board)
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  alpha,
  useTheme,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { Science, Whatshot, Air as AirIcon, HelpOutlineOutlined, AutoAwesome } from '@mui/icons-material';

const ComponentGenerator = () => {
  const [customOutputs, setCustomOutputs] = useState([]);
  const theme = useTheme();

  // 3 Ready-made student-friendly questions and answers
  const sampleQuestions = [
    {
      id: 'q1',
      buttonLabel: "🧊 Why do ice cubes melt?",
      query: "Why do ice cubes melt when left out on the table?",
      category: "Melting Magic! 🔥",
      color: "error",
      answer: "Ice cubes melt because the warm air gives their locked-up particles an energy boost! This extra heat makes them wiggle faster and faster until they break free from their tight rows and slide around smoothly as liquid water."
    },
    {
      id: 'q2',
      buttonLabel: "💨 Where does puddle water go?",
      query: "Where do puddles disappear to on a sunny afternoon?",
      category: "Evaporation Escape! ☀️",
      color: "secondary",
      answer: "The sun acts like an energy injector! It heats up the water particles on the very top of the puddle, giving them enough speed to break away from their liquid friends and fly straight up into the air as invisible gas (water vapor)."
    },
    {
      id: 'q3',
      buttonLabel: "🧲 How do drops stay together?",
      query: "Why do water droplets stick together on a leaf?",
      category: "Particle Attraction! 🧲",
      color: "primary",
      answer: "Particles behave like tiny microscopic magnets! They naturally have an attracting force that pulls them toward each other. That's why separate water drops will automatically snap into one big bead when they touch."
    }
  ];

  // Helper function to process a query and add it to the display list
  const addModuleToList = (queryText, categoryText, colorTheme, answerText) => {
    const newModule = {
      id: Date.now() + Math.random(), // Unique ID
      query: queryText,
      category: categoryText,
      color: colorTheme,
      answer: answerText
    };
    setCustomOutputs([newModule, ...customOutputs]);
  };

  // Handles clicking one of the preset question buttons
  const handleSampleClick = (sample) => {
    // Prevent adding duplicates of the same question at the very top of the list
    if (customOutputs.length > 0 && customOutputs[0].query === sample.query) return;
    addModuleToList(sample.query, sample.category, sample.color, sample.answer);
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: 'background.paper' }}>
      
      {/* Header Section */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom display="flex" alignItems="center" gap={1}>
          <AutoAwesome sx={{ color: 'amber.500' }} /> Interactive Particle Query Board
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click a question below to uncover the secrets of the invisible world and reveal the answer!
        </Typography>
      </Box>

      {/* Quick-Click Student Questions */}
      <Box mb={2}>
        <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing="widest" display="block" mb={1.5}>
          👉 Pick a Question:
        </Typography>
        <Box display="flex" gap={1.5} flexWrap="wrap">
          {sampleQuestions.map((sample) => (
            <Button
              key={sample.id}
              variant="outlined"
              color={sample.color}
              onClick={() => handleSampleClick(sample)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                px: 2,
                py: 1,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              {sample.buttonLabel}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Answers Display List */}
      {customOutputs.length > 0 && (
        <Box mt={4}>
          <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
          
          <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing="widest">
            Science Revelations ({customOutputs.length})
          </Typography>
          
          <List sx={{ mt: 2, maxHeight: 450, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {customOutputs.map((item) => (
              <ListItem 
                key={item.id}
                alignItems="flex-start"
                sx={{ 
                  flexDirection: 'column', 
                  alignItems: 'stretch',
                  px: 2.5,
                  py: 2.5,
                  bgcolor: alpha(theme.palette[item.color].main, 0.05),
                  borderRadius: 3,
                  borderLeft: `5px solid ${theme.palette[item.color].main}`,
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)'
                }}
              >
                {/* Badge Category Header */}
                <Box mb={1.5}>
                  <Chip 
                    label={item.category}
                    size="small"
                    color={item.color}
                    icon={item.color === 'error' ? <Whatshot /> : item.color === 'secondary' ? <AirIcon /> : <Science />}
                    sx={{ fontWeight: 'bold', px: 0.5 }}
                  />
                </Box>
                
                {/* The Student Question */}
                <Typography variant="body2" fontWeight="bold" color="text.primary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                  Thinking Point: "{item.query}"
                </Typography>
                
                {/* The Friendly Answer Block */}
                <Box mt={1} p={1.5} bgcolor="background.paper" borderRadius={2} border="1px solid" borderColor="divider">
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <HelpOutlineOutlined color={item.color} sx={{ mt: 0.3, shrink: 0, fontSize: 18 }} />
                    <span>{item.answer}</span>
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default ComponentGenerator;