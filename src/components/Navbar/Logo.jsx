// components/Navbar/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <motion.span 
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-2xl"
      >
        🔬
      </motion.span>
      <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
        Sci<span className="text-cyan-600 dark:text-cyan-400">Hub</span>
      </span>
    </Link>
  );
};

export default Logo;