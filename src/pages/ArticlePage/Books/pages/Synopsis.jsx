import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

const cards = [
  { title: 'What', desc: 'Understanding objects, organisms, forces, and phenomena that make up our universe.', delay: 0.1 },
  { title: 'Why', desc: 'Exploring the causes and explanations behind natural events and phenomena.', delay: 0.2 },
  { title: 'When', desc: 'Investigating historical timelines and scientific milestones that shaped our understanding.', delay: 0.3 },
  { title: 'Where', desc: 'Discovering locations, habitats, environments, and origins of scientific wonders.', delay: 0.4 },
];

export function Synopsis() {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-8">About This Book</h1>

        <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
          Science begins with curiosity. This book is designed to inspire that curiosity through 100 fascinating questions about the world around us.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: card.delay }}
              className={`${cardBg} p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left`}
            >
              <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">
                {card.title}
              </h2>
              <p className="text-lg">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className={`text-xl mt-8 ${mutedText}`}>
          Each chapter contains fascinating scientific mysteries and discoveries designed to inspire inquiry and critical thinking.
        </p>

        <p className="text-2xl mt-8 font-semibold text-amber-600 dark:text-amber-400">
          Become a scientific explorer and uncover the wonders of our world!
        </p>
      </motion.div>
    </AnimatePresence>
  );
}