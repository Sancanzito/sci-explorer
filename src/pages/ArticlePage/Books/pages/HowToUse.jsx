import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, List, Bookmark, Search, Trophy, Compass, Book } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';

const features = [
  { icon: BookOpen, title: "Navigation", desc: "Use the sidebar to navigate between sections and chapters." },
  { icon: List, title: "Table of Contents", desc: "Access any chapter instantly from the interactive table of contents." },
  { icon: Bookmark, title: "Bookmarks", desc: "Save your favorite pages for quick access." },
  { icon: Search, title: "Search", desc: "Find any topic by keyword using the search bar." },
  { icon: Trophy, title: "Quizzes", desc: "Test your knowledge with interactive quizzes." },
  { icon: Compass, title: "Explore", desc: "Discover related topics with our exploration feature." },
  { icon: Book, title: "Achievements", desc: "Collect badges as you learn and explore." },
  { icon: BookOpen, title: "Sample Content", desc: "Browse 100 fascinating scientific questions across four categories." },
];

export function HowToUse() {
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
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-12">How to Use This Book</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`${cardBg} p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left`}
              >
                <div className="flex items-center mb-4">
                  <Icon size={24} className="text-amber-500 mr-3" />
                  <h2 className="text-2xl font-bold">{feature.title}</h2>
                </div>
                <p className={`text-lg ${mutedText}`}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
