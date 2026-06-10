import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';
import canvasConfetti from 'canvas-confetti';

export function Completion() {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const handleConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);

      canvasConfetti({
        ...defaults,
        particleCount,
        startVelocity: 0,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#ff0', '#cc0']
      });
      canvasConfetti({
        ...defaults,
        particleCount,
        startVelocity: 0,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#ff0', '#cc0']
      });
    }, 250);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8">The Spirit of Scientific Inquiry</h1>

            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              You've explored the fascinating world of science through the lens of the Four W's: What, Why, When, and Where. Each question you've pondered has brought you closer to understanding the intricate tapestry of our universe.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`${cardBg} p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left`}
              >
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">What You've Discovered</h2>
                <p className="text-lg">
                  You've uncovered the fundamental building blocks of reality, from the smallest particles to the vast cosmic structures that shape our existence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`${cardBg} p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left`}
              >
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">The Spirit of Inquiry</h2>
                <p className="text-lg">
                  True scientific thinking isn't about having all the answers—it's about asking better questions, seeking evidence, and remaining open to wonder.
                </p>
              </motion.div>
            </div>

            <div className="text-center mb-12">
              <button
                onClick={handleConfetti}
                className={`px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto`}
              >
                <Trophy size={24} /> Celebrate Your Journey
              </button>
            </div>

            <p className={`text-xl mt-8 ${mutedText}`}>
              Remember: Every great scientist was once a curious beginner who dared to ask "What if?" and "Why not?"
            </p>

            <p className="text-2xl mt-8 font-semibold text-amber-600 dark:text-amber-400">
              Keep exploring, keep questioning, and keep discovering the magnificent world around you.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}