// pages/HomePage/components/ArticleLibrary.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ArticleLibrary = () => {
  const [expanded, setExpanded] = useState(null);
  
  const articles = [
    { title: "CRISPR: Rewriting Life's Code", author: "Dr. Jennifer Chen", readTime: "5 min", level: "Advanced", summary: "How gene editing is revolutionizing medicine and agriculture...", icon: "✂️" },
    { title: "The Hidden World of Microbiomes", author: "Prof. Marcus Wong", readTime: "4 min", level: "Intermediate", summary: "Understanding the bacteria that live inside us...", icon: "🦠" },
    { title: "Rosalind Franklin: The Unsung Hero", author: "Dr. Sarah Kumar", readTime: "3 min", level: "Beginner", summary: "The critical role of X-ray crystallography in DNA discovery...", icon: "👩‍🔬" }
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 border border-blue-500/20 overflow-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xl">📚</div>
        <h3 className="font-semibold text-gray-800 dark:text-white">Sci-Inquirer Library</h3>
      </div>
      
      <div className="space-y-3">
        {articles.map((article, idx) => (
          <motion.div
            key={idx}
            initial={false}
            className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="flex items-start gap-2">
              <div className="text-xl">{article.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">{article.title}</h4>
                <div className="flex gap-2 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.readTime} read</span>
                  <span>•</span>
                  <span className="text-cyan-600">{article.level}</span>
                </div>
                {expanded === idx && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-gray-600 dark:text-gray-300"
                  >
                    {article.summary}
                    <button className="block mt-1 text-cyan-600 text-[10px]">Read full article →</button>
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ArticleLibrary;