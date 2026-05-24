// ParticleModelScroll.jsx (updated with MUI styling)
import React from 'react';
import { Box, Paper, Typography, Button, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const ParticleModelScroll = ({ sections, activeSection, onSectionClick }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      variant="outlined"
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing="widest">
          Document Sections
        </Typography>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          borderLeft: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
          ml: 1,
          pl: 2
        }}>
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            
            return (
              <Button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.25,
                  px: 2,
                  borderRadius: 2,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.5),
                  },
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: -18,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: isActive ? theme.palette.primary.main : theme.palette.divider,
                    transition: 'all 0.2s',
                    ...(isActive && {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                      transform: 'scale(1.2)',
                    }),
                  }}
                />
                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                  {section.title}
                </Typography>
                
                {isActive && (
                  <motion.div
                    layoutId="particleIndicatorBar"
                    style={{
                      position: 'absolute',
                      right: 8,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  />
                )}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default ParticleModelScroll;