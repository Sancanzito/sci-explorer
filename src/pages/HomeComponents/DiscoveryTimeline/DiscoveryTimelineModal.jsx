// components/DiscoveryTimelineModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { getEventColor } from './DiscoveryTimelineData';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 30 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 26 }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.25, ease: "easeInOut" }
  }
};

const contentStepVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + (i * 0.08), duration: 0.4, ease: "easeOut" }
  })
};

const DiscoveryTimelineModal = ({ event, onClose }) => {
  if (!event) return null;
  const colorGradient = getEventColor(event.color);

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Top Floating Close Trigger */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-950/90 p-2 rounded-full border border-slate-800 transition-all duration-200"
        >
          ✕
        </button>

        {/* Dynamic Image Container targeting the clicked milestone */}
        <div className="relative h-60 w-full bg-slate-950 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover opacity-60 transform scale-100 hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            // Premium Fallback Gradient if an image property isn't defined yet
            <div className={`w-full h-full bg-gradient-to-tr ${colorGradient} opacity-30`} />
          )}
          
          {/* Shadow Overlay Gradient Mask for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Milestone Identifiers */}
          <div className="absolute bottom-4 left-6 flex items-center gap-4 z-10">
            <span className="text-4xl bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-xl">{event.icon}</span>
            <div>
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">{event.year} — Milestone</span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">{event.title}</h2>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <motion.div custom={0} variants={contentStepVariants}>
            <span className={`text-xs font-bold px-3 py-1.5 bg-gradient-to-r ${colorGradient.split(' ')[0]} ${colorGradient.split(' ')[1]} rounded-lg text-white border border-slate-700/50`}>
              {event.shortDesc}
            </span>
          </motion.div>

          <motion.p 
            custom={1} 
            variants={contentStepVariants}
            className="text-slate-300 text-sm md:text-base leading-relaxed tracking-normal font-normal"
          >
            {event.longDesc}
          </motion.p>

          {/* Action Footer */}
          <motion.div 
            custom={2} 
            variants={contentStepVariants}
            className="pt-4 border-t border-slate-800/80 flex justify-end"
          >
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/10 active:scale-95 transition-all duration-150"
            >
              Minimize View
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DiscoveryTimelineModal;