// src/components/graph/components/DataStreamView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Alert, CircularProgress, Button } from '@mui/material';
import { SkeletonChart } from './SkeletonChart';

interface DataStreamViewProps {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const DataStreamView: React.FC<DataStreamViewProps> = ({
  children,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px]"
      >
        <div className="relative">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#00ff9d',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-cyan-500/20"
          />
        </div>
        <p className="mt-4 text-gray-400 text-sm">Processing scientific computation...</p>
        <SkeletonChart />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[500px] p-8"
      >
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(255, 107, 107, 0.1)',
            color: '#ff6b6b',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}
        >
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={onRetry}
          sx={{
            borderColor: '#00ff9d',
            color: '#00ff9d',
            '&:hover': {
              borderColor: '#00ff9d',
              bgcolor: 'rgba(0, 255, 157, 0.1)',
            }
          }}
        >
          Retry Computation
        </Button>
      </motion.div>
    );
  }

  return <>{children}</>;
};