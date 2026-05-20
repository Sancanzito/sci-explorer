// pages/HomePage/HomeComponents/FactBox/FactBoxCard.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  modalVariants, 
  overlayVariants, 
  cardShuffleVariants, 
  continuousZoomVariants,
  lightbulbGlowVariants,
  textPulsateVariants
} from './FactBoxAnimation';
const FactBoxCard = ({ facts, theme, activeCardIndex, isOpen, onClose, onNext }) => {
  if (!isOpen || !facts || !facts.length) return null;

  const currentCard = facts[activeCardIndex];

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="relative max-w-md w-full rounded-3xl p-5 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bubble Counter */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white font-extrabold tracking-widest text-xs bg-emerald-600 dark:bg-emerald-500 px-4 py-1.5 rounded-full border border-emerald-400/20 shadow-xl backdrop-blur-md">
          <span>{activeCardIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">{facts.length}</span>
        </div>

        {/* Stack Deck Graphic Frame Canvas */}
        <div className="relative w-full h-[440px] mb-6 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCardIndex}
              variants={cardShuffleVariants}
              initial="active"
              animate="active"
              exit="exit"
              className="absolute w-full h-full bg-gradient-to-b from-white via-slate-50/95 to-slate-100 dark:from-slate-900 dark:via-slate-900/98 dark:to-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between"
            >
              {/* Colored Aesthetic Top Banner Bar */}
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />
              
              {/* Decorative Accent Background Glows */}
              <div className="absolute top-12 right-4 w-24 h-24 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-16 left-4 w-24 h-24 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

              {/* Main Content Layout Container */}
              <div className="p-6 flex-1 flex flex-col items-center text-center justify-center relative z-10">
                
                {/* Dynamic Font-Weight Shifting Header Row */}
                <div className="flex flex-col items-center mb-4">
                  {/* Glowing Lightbulb Anchor Frame */}
                  <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                    <motion.div 
                      variants={lightbulbGlowVariants}
                      animate="animate"
                      className="absolute w-8 h-8 rounded-full"
                    />
                    <span className="relative text-2xl filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">💡</span>
                  </div>

                  {/* Header text changes smoothly from thin to heavy bold via CSS transition keyframes */}
                  <motion.h3 
                    animate={{ 
                      fontWeight: [300, 900, 300],
                      letterSpacing: ["0.08em", "0.18em", "0.08em"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xs uppercase text-slate-400 dark:text-slate-500 font-sans tracking-widest transition-all duration-1000"
                  >
                    Weekly Discovery
                  </motion.h3>
                </div>

                <span className="inline-block text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-3 py-0.5 rounded-full mb-4 border border-emerald-500/15">
                  {theme}
                </span>

                {/* Central Media Container Frame with Continuous Hover-Float Motion */}
                <motion.div 
                  variants={continuousZoomVariants}
                  animate="animate"
                  className="relative mb-4 inline-block"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl blur-md opacity-20 scale-105" />
                  <img
                    src={currentCard.image}
                    alt="Visual helper context"
                    className="relative h-32 w-56 object-cover rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80"
                  />
                </motion.div>

                {/* Dynamic Bold Typography Prompt Title */}
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 tracking-tight px-2">
                  {currentCard.funPrompt}
                </h4>

                {/* Main Pulsating Description Text Blocks */}
                <motion.p 
                  variants={textPulsateVariants}
                  animate="animate"
                  className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed px-3 overflow-y-auto max-h-24 scrollbar-thin transition-shadow"
                >
                  {currentCard.text}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3D Depth Card Deck Stack Simulation Overlays */}
          <div className="absolute inset-0 -z-10 translate-y-3.5 scale-[0.96] bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-lg pointer-events-none" />
          <div className="absolute inset-0 -z-20 translate-y-7 scale-[0.92] bg-white/50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl shadow-sm pointer-events-none" />
        </div>

        {/* Bottom Navigation Navigation Control Layout Row */}
        <div className="w-full grid grid-cols-4 gap-3 relative z-10">
          <button
            onClick={onClose}
            className="col-span-1 py-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors text-xs uppercase tracking-wider border border-slate-200/40 dark:border-slate-700/40"
          >
            Close
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="col-span-3 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all text-xs uppercase tracking-widest"
          >
            {activeCardIndex === facts.length - 1 ? "Reset Deck 🔄" : "Next Fact 🤯"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FactBoxCard;