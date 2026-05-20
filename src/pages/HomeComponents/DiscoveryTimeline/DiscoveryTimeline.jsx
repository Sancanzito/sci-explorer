// pages/HomePage/components/DiscoveryTimeline.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DiscoveryTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const events = [
    { year: "1865", title: "Mendel's Laws", desc: "Gregor Mendel publishes his work on inheritance patterns in pea plants", icon: "🌱" },
    { year: "1953", title: "DNA Structure", desc: "Watson & Crick discover the double helix structure of DNA", icon: "🧬" },
    { year: "2003", title: "Human Genome", desc: "Human Genome Project completes mapping of all human genes", icon: "📊" },
    { year: "2012", title: "CRISPR-Cas9", desc: "Revolutionary gene-editing tool is developed", icon: "✂️" },
    { year: "2023", title: "AI in Genetics", desc: "AlphaFold predicts protein structures with AI", icon: "🤖" }
  ];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="h-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xl">📅</div>
        <h3 className="font-semibold text-white">Interactive Discovery Timeline</h3>
      </div>
      
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {events.map((event, idx) => (
          <motion.div
            key={event.year}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedEvent(selectedEvent === idx ? null : idx)}
            className={`flex-shrink-0 cursor-pointer transition-all p-3 rounded-lg ${
              selectedEvent === idx ? 'bg-cyan-500/20 border border-cyan-500' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            style={{ minWidth: '120px' }}
          >
            <div className="text-2xl mb-2">{event.icon}</div>
            <div className="text-lg font-bold text-cyan-400">{event.year}</div>
            <div className="text-xs font-semibold text-white">{event.title}</div>
            {selectedEvent === idx && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-[10px] text-gray-300"
              >
                {event.desc}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DiscoveryTimeline;