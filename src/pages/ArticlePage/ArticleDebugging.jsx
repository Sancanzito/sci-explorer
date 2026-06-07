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
      className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

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
            className="w-32 h-32 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]"
          >
            <AlertCircle size={64} className="text-red-400" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Document Missing
          </h1>
          <p className="text-xl text-slate-400 mb-4 max-w-lg mx-auto leading-relaxed">
            The educational material you're looking for doesn't exist, has been moved, or is restricted.
          </p>
          {articleId && (
            <div className="mt-6 inline-block px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-xl">
              <p className="text-sm font-mono text-red-300">
                Requested ID: <span className="font-bold">{articleId}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Suggestions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md text-left"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <BookOpen size={16} /> Suggested Reading
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/articles/chem-models" className="block p-5 bg-slate-900/50 rounded-2xl hover:bg-cyan-950/30 hover:border-cyan-500/30 border border-white/5 transition-all group">
              <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">The Use of Models in Chemistry</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">chem-models</p>
            </Link>
            <Link to="/articles/particle-model-matter" className="block p-5 bg-slate-900/50 rounded-2xl hover:bg-cyan-950/30 hover:border-cyan-500/30 border border-white/5 transition-all group">
              <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">The Particle Model of Matter</p>
              <p className="text-xs text-slate-500 mt-2 font-mono">particle-model-matter</p>
            </Link>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/articles" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
            <BookOpen size={20} /> Browse Library
          </Link>
          <Link to="/" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Return Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArticleNotFound;