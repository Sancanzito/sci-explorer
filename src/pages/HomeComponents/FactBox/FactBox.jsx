// pages/HomePage/HomeComponents/FactBox/FactBox.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactBoxData } from './FactBoxData';

// FIX: Point explicitly to the local extension file path matching your workspace setup (.js)
import { factBoxVariants, textRevealVariants } from './FactBoxAnimation'; 
import FactBoxCard from './FactBoxCard';

const FactBox = () => {
  const { theme, facts, activeCardIndex, isModalOpen, openModal, closeModal, nextCard, isLoading } = useFactBoxData();

  if (isLoading || !facts.length) {
    return <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-3xl" />;
  }

  const featuredFact = facts[0];

  return (
    <>
      <motion.div
        variants={factBoxVariants}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={openModal}
        className="relative overflow-hidden h-full bg-gradient-to-br from-emerald-500/[0.12] via-teal-500/[0.06] to-blue-600/[0.12] dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-blue-950/40 rounded-3xl p-6 border border-emerald-500/25 dark:border-emerald-500/15 cursor-pointer shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group flex flex-col justify-between"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">💡</span>
            <motion.h3 
              variants={textRevealVariants}
              className="font-black text-xs uppercase text-slate-500 dark:text-slate-400 font-mono tracking-widest"
            >
              Weekly Deck
            </motion.h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 shadow-sm">
            {theme}
          </span>
        </div>

        {/* Core Content Area */}
        <div className="my-auto py-3 relative z-10">
          <p className="text-base text-slate-800 dark:text-slate-200 font-semibold leading-relaxed line-clamp-3 tracking-wide">
            {featuredFact.text}
          </p>
        </div>

        {/* Footer Indicators */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide relative z-10">
          <div className="flex gap-1.5 items-center">
            {facts.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === 0 ? 'w-4 bg-emerald-500' : 'w-1.5 bg-emerald-500/20'}`} 
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-200/40 dark:border-slate-800/40 shadow-xs">
            <span>Review Stack ({facts.length})</span>
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              ✨
            </motion.span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <FactBoxCard
            facts={facts}
            theme={theme}
            activeCardIndex={activeCardIndex}
            isOpen={isModalOpen}
            onClose={closeModal}
            onNext={nextCard}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FactBox;