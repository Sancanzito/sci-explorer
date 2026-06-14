// pages/ArticlePage/ArticleDebugging.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';

const ArticleNotFound = () => {
  const location = useLocation();
  const attemptedPath = location.pathname;

  const isArticleRoute = attemptedPath.includes('/articles/');
  const articleId = isArticleRoute ? attemptedPath.split('/articles/')[1] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-dark-bg text-white flex items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--fluorescent-magenta)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Animated 404 Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-10 flex justify-center"
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-[var(--fluorescent-magenta)]/10 border border-[var(--fluorescent-magenta)]/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,0,255,0.2)]"
          >
            <AlertCircle size={64} className="text-[var(--fluorescent-magenta)]" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Document Missing
          </h1>
          <p className="text-xl text-[var(--dark-bg)]/60 mb-4 max-w-lg mx-auto leading-relaxed">
            The educational material you're looking for doesn't exist, has been moved, or is restricted.
          </p>
          {articleId && (
            <div className="mt-6 inline-block px-4 py-2 bg-[var(--fluorescent-magenta)]/30 border border-[var(--fluorescent-magenta)]/50 rounded-xl">
              <p className="text-sm font-mono text-[var(--fluorescent-magenta)]/80">
                Requested ID: <span className="font-bold">{articleId}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Suggestions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-12 p-8 bg-[var(--dark-surface)]/10 border border-[var(--fluorescent-cyan)]/20 rounded-3xl backdrop-blur-md text-left"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--fluorescent-cyan)]/80 mb-6 flex items-center gap-2">
            <BookOpen size={16} /> Suggested Reading
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/articles/chem-models" className="block p-5 bg-[var(--dark-surface)]/20 rounded-2xl hover:bg-[var(--fluorescent-cyan)]/30 hover:border-[var(--fluorescent-cyan)]/50 border border-[var(--fluorescent-cyan)]/20 transition-all group">
              <p className="font-bold text-[var(--dark-bg)]/80 group-hover:text-[var(--fluorescent-cyan)] transition-colors">The Use of Models in Chemistry</p>
              <p className="text-xs text-[var(--dark-bg)]/60 mt-2 font-mono">chem-models</p>
            </Link>
            <Link to="/articles/particle-model-matter" className="block p-5 bg-[var(--dark-surface)]/20 rounded-2xl hover:bg-[var(--fluorescent-cyan)]/30 hover:border-[var(--fluorescent-cyan)]/50 border border-[var(--fluorescent-cyan)]/20 transition-all group">
              <p className="font-bold text-[var(--dark-bg)]/80 group-hover:text-[var(--fluorescent-cyan)] transition-colors">The Particle Model of Matter</p>
              <p className="text-xs text-[var(--dark-bg)]/60 mt-2 font-mono">particle-model-matter</p>
            </Link>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/articles" className="px-8 py-4 bg-gradient-to-r from-[var(--fluorescent-cyan)] to-[var(--fluorescent-magenta)] text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
            <BookOpen size={20} /> Browse Library
          </Link>
          <Link to="/" className="px-8 py-4 bg-[var(--dark-surface)]/10 border border-[var(--fluorescent-cyan)]/20 text-white font-bold rounded-2xl hover:bg-[var(--dark-surface)]/20 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Return Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArticleNotFound;