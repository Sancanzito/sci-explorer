// components/Navbar/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.span 
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-2xl drop-shadow-md"
      >
        🔬
      </motion.span>
      <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-mono">
        Sci<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 group-hover:from-cyan-500 group-hover:to-indigo-500 transition-all duration-300">Hub</span>
      </span>
    </Link>
  );
};

export default Logo;