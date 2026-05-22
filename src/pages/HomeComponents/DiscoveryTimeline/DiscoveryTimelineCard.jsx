// components/DiscoveryTimelineCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants, iconVariants, glowVariants } from './DiscoveryTimelineCardAnimation';
import { getEventColor } from './DiscoveryTimelineData';

const DiscoveryTimelineCard = ({ event, index, isSelected, onClick }) => {
  const colorGradient = getEventColor(event.color);
  
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isSelected ? "selected" : "initial"}
      onClick={onClick}
      // REMOVED: layoutId string to isolate layouts cleanly 
      className={`relative flex-shrink-0 cursor-pointer rounded-2xl p-[1px] transition-all overflow-hidden
        ${isSelected ? 'shadow-2xl shadow-cyan-500/10' : 'hover:shadow-xl hover:shadow-black/40'}`}
      style={{ minWidth: '155px' }}
    >
      {/* Interactive Border/Glow Gradient */}
      <motion.div
        variants={glowVariants}
        className={`absolute inset-0 bg-gradient-to-br ${colorGradient.split(' ')[0]} ${colorGradient.split(' ')[1]} opacity-0 pointer-events-none rounded-2xl`}
      />
      
      {/* Card Body */}
      <div className="relative bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 h-full flex flex-col justify-between">
        <div>
          {/* Animated Card Header Icon */}
          <motion.div 
            variants={iconVariants} 
            className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700/30"
          >
            {event.icon}
          </motion.div>
          
          <div className="text-2xl font-black tracking-tight text-white mb-0.5">{event.year}</div>
          <div className="text-sm font-bold text-slate-100 tracking-tight leading-snug mb-1">{event.title}</div>
          <p className="text-[11px] text-slate-400 font-medium leading-normal">{event.shortDesc}</p>
        </div>
        
        {/* Active Item Ring Indicator */}
        {isSelected && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default DiscoveryTimelineCard;