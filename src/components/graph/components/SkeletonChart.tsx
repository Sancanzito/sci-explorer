// src/components/graph/components/SkeletonChart.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonChart: React.FC = () => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mt-8 w-full"
    >
      <div className="h-[400px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-4">
        <div className="h-full w-full bg-gray-800/30 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer" />
          
          {/* Simulated axes */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-600/50" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-600/50" />
          
          {/* Simulated sine wave */}
          <svg className="w-full h-full opacity-30">
            <path
              d="M0,200 Q100,100 200,200 T400,200 T600,200"
              fill="none"
              stroke="#00ff9d"
              strokeWidth="2"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};