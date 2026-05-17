// pages/HomePage/components/NewsFeed.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NewsFeed = () => {
  const news = [
    { title: "NASA's Perseverance finds organic molecules on Mars", source: "Space News", time: "2h ago", icon: "🚀" },
    { title: "New exoplanet discovered in habitable zone", source: "Astronomy Today", time: "5h ago", icon: "🪐" },
    { title: "Breakthrough in quantum computing achieved", source: "Tech Science", time: "1d ago", icon: "💻" }
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-4 border border-red-500/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-lg">📰</div>
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Science in the News</h3>
      </div>
      
      <div className="space-y-2">
        {news.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ x: 5 }}
            className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg cursor-pointer"
          >
            <div className="text-lg">{item.icon}</div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-800 dark:text-white">{item.title}</p>
              <div className="flex gap-2 mt-1 text-[9px] text-gray-500">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 text-center w-full">
        View all headlines →
      </button>
    </motion.div>
  );
};

export default NewsFeed;