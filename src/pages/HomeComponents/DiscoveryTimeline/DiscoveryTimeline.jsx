// pages/HomePage/components/DiscoveryTimeline.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import DiscoveryTimelineCard from './DiscoveryTimelineCard';
import DiscoveryTimelineModal from './DiscoveryTimelineModal';
import { timelineThemes, TIMELINE_ANCHOR_DATE } from './DiscoveryTimelineData';
import { 
  containerVariants, 
  headerVariants, 
  timelineLineVariants,
  timelineNodeVariants 
} from './DiscoveryTimelineAnimation';

// Date-matching function utilizing standard constant exports
const getDynamicThemeIndex = (currentDate = new Date()) => {
  const anchor = new Date(TIMELINE_ANCHOR_DATE);
  const diffInMs = currentDate.getTime() - anchor.getTime();
  if (diffInMs < 0) return 0; // Fallback edge handling
  
  const millisecondsInWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksElapsed = Math.floor(diffInMs / millisecondsInWeek);
  
  return weeksElapsed % timelineThemes.length;
};

const fetchWeeklyThemeData = async () => {
  const targetIndex = getDynamicThemeIndex(new Date());
  return timelineThemes[targetIndex];
};

const DiscoveryTimeline = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: currentTheme, isLoading, isError } = useQuery({
    queryKey: ['weeklyDiscoveryTheme'],
    queryFn: fetchWeeklyThemeData,
    staggerTime: 1000 * 60 * 60, // 1 hour caching layer
  });

  const handleCardClick = useCallback((index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[320px] flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-900">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !currentTheme) {
    return (
      <div className="w-full min-h-[320px] flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-900 text-slate-500 text-sm">
        ⚠️ Failed to parse dynamic theme sequence tracks.
      </div>
    );
  }

  const selectedEvent = selectedIndex !== null ? currentTheme.events[selectedIndex] : null;

  return (
    <LayoutGroup>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative w-full max-w-5xl mx-auto p-6 bg-slate-950/60 backdrop-blur-xl border border-slate-900/80 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Dynamic Theme Title Header */}
        <motion.div variants={headerVariants} className="mb-8 space-y-2">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
            {currentTheme.title}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
            {currentTheme.description}
          </p>
        </motion.div>

        {/* Timeline Axis Track */}
        <div className="relative w-full overflow-x-auto no-scrollbar py-6 px-2">
          {/* Main Horizontal Structural Vector connecting elements */}
          <motion.div 
            variants={timelineLineVariants}
            className="absolute top-[44px] left-8 right-8 h-[2px] bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent origin-left pointer-events-none"
          />

          <div className="relative flex items-start space-x-12 pb-4">
            {currentTheme.events.map((event, idx) => (
              <motion.div
                key={`${currentTheme.id}-${idx}`}
                variants={timelineNodeVariants}
                custom={idx}
                className="relative flex flex-col items-center"
              >
                {/* Node Dot Segment */}
                <div className="mb-6 relative z-10">
                  <motion.div 
                    animate={selectedIndex === idx ? { scale: 1.25 } : { scale: 1 }}
                    className={`w-6 h-6 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-all duration-300
                      ${selectedIndex === idx ? 'border-cyan-400 shadow-lg shadow-cyan-500/40' : 'border-slate-800'}`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-300
                      ${selectedIndex === idx ? 'bg-cyan-400' : 'bg-slate-700'}`} 
                    />
                  </motion.div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 translate-y-full text-[10px] font-black text-slate-500 tracking-wider">
                    {event.year}
                  </div>
                </div>
                
                <DiscoveryTimelineCard
                  event={event}
                  index={idx}
                  isSelected={selectedIndex === idx}
                  onClick={() => handleCardClick(idx)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Instructional Footer */}
        <motion.div 
          layout
          className="p-3 text-center text-slate-400 text-xs border border-slate-800/60 bg-slate-900/40 backdrop-blur-md rounded-xl max-w-xs mx-auto shadow-inner mt-4"
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            💡 Click on milestones to expand structural records
          </motion.span>
        </motion.div>

        {/* Integrated Modal Layer */}
        <AnimatePresence>
          {isModalOpen && selectedEvent && (
            <DiscoveryTimelineModal 
              event={selectedEvent} 
              onClose={() => {
                setIsModalOpen(false);
                setSelectedIndex(null);
              }} 
            />
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};

export default DiscoveryTimeline;