import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Telescope, Info, Maximize, X } from 'lucide-react';

const StellariumPage = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden text-slate-200">
      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/simulations')}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            title="Back to Simulations"
          >
            <ArrowLeft size={20} className="text-cyan-400" />
          </button>
          <div className="flex items-center gap-2">
            <Telescope className="text-cyan-400" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Virtual Observatory
            </h1>
          </div>
        </div>

        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-cyan-900 text-cyan-300' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Info size={20} />
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex">
        {/* Info Sidebar Panel */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: showInfo ? 0 : -350 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute left-4 top-4 bottom-4 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">How to use</h2>
            <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-4 text-sm text-slate-300 overflow-y-auto custom-scrollbar pr-2">
            <p>Welcome to the Virtual Observatory, powered by Stellarium Web.</p>
            
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-cyan-400 mb-1 flex items-center gap-2">
                <Maximize size={14}/> Navigation
              </h3>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Click & Drag</strong> to look around the sky.</li>
                <li><strong>Scroll</strong> to zoom in on planets and nebulae.</li>
                <li><strong>Click any star</strong> to see its scientific data.</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-purple-400 mb-1">Bottom Controls</h3>
              <p>Use the toolbar at the bottom of the screen to toggle constellations, atmosphere, landscapes, and equatorial grids.</p>
            </div>

            <div className="p-3 bg-blue-950/50 text-blue-200 rounded-lg text-xs">
              <strong>Note:</strong> Allow location access in your browser to see the exact night sky above you right now!
            </div>
          </div>
        </motion.div>

        {/* Stellarium iframe */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full bg-black"
        >
          <iframe
            src="https://stellarium-web.org/"
            title="Stellarium Web"
            className="w-full h-full border-none"
            allow="geolocation"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default StellariumPage;