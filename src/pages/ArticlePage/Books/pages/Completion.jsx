import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, BookOpen } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';
import canvasConfetti from 'canvas-confetti';

export function Completion() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const handleConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      canvasConfetti({
        particleCount,
        startVelocity: 0,
        ticks: 60,
        platform: 6,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        },
        colors: ['#ff0', '#cc0', '#ff6', '#644', '#f00', '#c00']
      });
      canvasConfetti({
        particleCount,
        startVelocity: 0,
        ticks: 60,
        platform: 6,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#ff0', '#cc0', '#ff6', '#644', '#f00', '#c00']
      });
    }, 250);
  };

  return (
     <BookLayout prevPage="/science-quest/what">
       <div className={`min-h-screen p-8 md:p-12 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              The Spirit of Scientific Inquiry
            </h1>
            
            <div className="prose prose-invert max-w-2xl mx-auto">
              <motion.p className="text-xl mb-8 leading-relaxed">
                You've explored the fascinating world of science through the lens of the Four W's: What, Why, When, and Where. Each question you've pondered has brought you closer to understanding the intricate tapestry of our universe.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-yellow-300">What You've Discovered</h2>
                  <p className="text-lg">
                    You've uncovered the fundamental building blocks of reality, from the smallest particles to the vast cosmic structures that shape our existence.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-green-300">The Spirit of Inquiry</h2>
                  <p className="text-lg">
                    True scientific thinking isn't about having all the answers—it's about asking better questions, seeking evidence, and remaining open to wonder.
                  </p>
                </motion.div>
              </div>
              
              <motion.div className="text-center mb-12">
                <button 
                  onClick={handleConfetti}
                  className={`px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 ${isDarkMode ? 'dark:hover:from-cyan-500 dark:hover:to-blue-500' : ''}`}
                >
                  <Trophy size={24} /> Celebrate Your Journey
                </button>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl mt-8 text-center"
              >
                Remember: Every great scientist was once a curious beginner who dared to ask "What if?" and "Why not?"
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-2xl mt-8 text-center"
              >
                Keep exploring, keep questioning, and keep discovering the magnificent world around you.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </BookLayout>
  );
}