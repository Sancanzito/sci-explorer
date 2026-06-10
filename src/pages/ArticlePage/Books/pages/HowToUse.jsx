import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { BookOpen, List, Bookmark, Search, Trophy, Compass, Book } from 'lucide-react';
import { useTheme } from '../../../../ThemeProvider';

export function HowToUse() {
  const { isDarkMode } = useTheme();
  
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Navigation",
      description: "Use the arrow buttons or swipe left/right to turn pages"
    },
    {
      icon: <List size={24} />,
      title: "Table of Contents",
      description: "Access any chapter instantly from the interactive table of contents"
    },
    {
      icon: <Bookmark size={24} />,
      title: "Bookmarks",
      description: "Save your favorite pages for quick access"
    },
    {
      icon: <Search size={24} />,
      title: "Search",
      description: "Find any topic by keyword using the search bar"
    },
    {
      icon: <Trophy size={24} />,
      title: "Quizzes",
      description: "Test your knowledge with interactive quizzes"
    },
    {
      icon: <Compass size={24} />,
      title: "Explore",
      description: "Discover related topics with our exploration feature"
    },
    {
      icon: <Book size={24} />,
      title: "Achievements",
      description: "Collect badges as you learn and explore"
    },
    {
      icon: <BookOpen size={24} />,
      title: "Sample Content",
      description: "View a sample of the Science Quest content with 100 fascinating scientific questions"
    }
  ];

     return (
       <BookLayout prevPage="/science-quest/synopsis" nextPage="/science-quest/table-of-contents">
        <div className={`min-h-screen p-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                How to Use This Book
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`text-blue-300 ${isDarkMode ? 'dark:text-blue-400' : ''} mr-3`}>
                        {feature.icon}
                      </div>
                      <h2 className="text-2xl font-bold">{feature.title}</h2>
                    </div>
                    <p className="text-lg">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </BookLayout>
    );
}