// components/Navbar/ThemeToggle.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-200"
      style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Background particles for light mode */}
      {!isDarkMode && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Stars for dark mode */}
      {isDarkMode && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Sliding Handle */}
      <motion.div
        className="absolute top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
        style={{
          backgroundColor: isDarkMode ? '#fbbf24' : '#6366f1',
          left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
        }}
        animate={{
          left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem',
          rotate: isDarkMode ? 0 : 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          scale: {
            duration: 0.3,
            times: [0, 0.5, 1],
          }
        }}
      >
        <motion.span
          className="text-xs"
          initial={false}
          animate={{
            scale: [0, 1.2, 1],
          }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;