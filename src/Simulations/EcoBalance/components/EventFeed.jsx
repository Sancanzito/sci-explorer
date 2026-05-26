// games/EcoBalance/components/EventFeed.jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const EventFeed = () => {
  const scrollRef = useRef(null);
  const { events, clearEvents } = useGameStore();
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);
  
  const getEventIcon = (type) => {
    switch(type) {
      case 'predation': return '🐺';
      case 'growth': return '📈';
      case 'decline': return '📉';
      case 'warning': return '⚠️';
      case 'critical': return '💀';
      case 'success': return '✅';
      case 'intervention': return '🎮';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };
  
  const getEventColor = (type) => {
    switch(type) {
      case 'predation': return 'border-red-500 bg-red-950/40';
      case 'growth': return 'border-green-500 bg-green-950/40';
      case 'decline': return 'border-orange-500 bg-orange-950/40';
      case 'warning': return 'border-yellow-500 bg-yellow-950/40';
      case 'critical': return 'border-red-500 bg-red-950/60';
      case 'success': return 'border-green-500 bg-green-950/40';
      case 'intervention': return 'border-purple-500 bg-purple-950/40';
      default: return 'border-gray-500 bg-gray-950/40';
    }
  };

  // Helper function to safely parse and format timestamps (handles Date objects, strings, and numbers)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime()) ? new Date().toLocaleTimeString() : date.toLocaleTimeString();
    } catch {
      return new Date().toLocaleTimeString();
    }
  };
  
  if (events.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-md rounded-lg border border-white/20 h-full flex flex-col">
        <div className="p-3 border-b border-white/20">
          <h3 className="font-bold text-green-400 text-sm flex items-center gap-2">
            📋 Ecosystem Event Log
            <span className="text-xs text-gray-400">(Real-time updates)</span>
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-400 text-sm">
            <div className="text-4xl mb-2">🌿</div>
            <p>No events yet.</p>
            <p className="text-xs mt-1">Apply interventions to see ecosystem responses!</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg border border-white/20 h-full flex flex-col">
      <div className="p-3 border-b border-white/20 flex justify-between items-center">
        <h3 className="font-bold text-green-400 text-sm flex items-center gap-2">
          📋 Ecosystem Event Log
          <span className="text-xs text-gray-400">(Real-time updates)</span>
        </h3>
        <button
          onClick={clearEvents}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence mode="popLayout">
          {events.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`text-xs p-2 rounded border-l-4 ${getEventColor(event.type)} text-gray-200 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="break-words">{event.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatTimestamp(event.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Event counter */}
      <div className="p-2 border-t border-white/20 text-center">
        <p className="text-[10px] text-gray-500">
          {events.length} events recorded
        </p>
      </div>
    </div>
  );
};

export default EventFeed;