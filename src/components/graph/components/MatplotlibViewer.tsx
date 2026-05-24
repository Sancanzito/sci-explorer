// src/components/graph/components/MatplotlibViewer.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, ZoomIn, ZoomOut, Download } from '@mui/icons-material';
import { ComputationType } from '../types';

interface MatplotlibViewerProps {
  imageData: string;
  metadata: Record<string, any>;
  computationType: ComputationType;
}

export const MatplotlibViewer: React.FC<MatplotlibViewerProps> = ({
  imageData,
  metadata,
  computationType,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `scientific_plot_${computationType}.png`;
    link.href = imageData;
    link.click();
  };

  return (
    <motion.div
      layout
      className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 m-4' : ''
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Tooltip title="Zoom In">
          <IconButton
            size="small"
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#00ff9d' }}
          >
            <ZoomIn />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton
            size="small"
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#00ff9d' }}
          >
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#00ff9d' }}
          >
            <Download />
          </IconButton>
        </Tooltip>
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <IconButton
            size="small"
            onClick={() => setIsFullscreen(!isFullscreen)}
            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#00ff9d' }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </div>

      <motion.div
        layout
        className="flex items-center justify-center p-6"
        style={{ transform: `scale(${zoom})` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <img
          src={imageData}
          alt="Scientific visualization"
          className="rounded-lg shadow-2xl max-w-full h-auto"
          style={{ maxHeight: '70vh' }}
        />
      </motion.div>

      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        >
          <div className="flex justify-center gap-4 text-xs text-gray-300">
            <span className="px-2 py-1 bg-black/50 rounded">Type: {computationType}</span>
            {Object.entries(metadata).slice(0, 3).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-black/50 rounded">
                {key}: {typeof value === 'number' ? value.toFixed(4) : String(value)}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};