import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import Scrollspy from 'react-scrollspy-navigation';
import { Link } from 'react-router-dom';

// Helper function to slugify text for URL paths
const slugify = (text) => 
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single
    .trim();

export function TableOfContents() {
  const { isDarkMode } = useTheme();
   
  // Questions for each section (from user's request)
  const whyQuestions = [
    "Why is the sky blue?",
    "Why do leaves change color in autumn?",
    "Why do stars twinkle at night?",
    "Why do we have different seasons?",
    "Why do earthquakes happen?",
    "Why do volcanoes erupt?",
    "Why do humans need sleep?",
    "Why do we dream?",
    "Why does ice float on water?",
    "Why is the ocean salty?",
    "Why do animals migrate?",
    "Why do birds fly in formations?",
    "Why do plants need sunlight?",
    "Why do some animals hibernate?",
    "Why do we hiccup?",
    "Why do rainbows appear?",
    "Why does lightning occur?",
    "Why do magnets attract certain metals?",
    "Why do we have fingerprints?",
    "Why do humans age?",
    "Why do mosquitoes bite people?",
    "Why do cats purr?",
    "Why do dogs wag their tails?",
    "Why do some animals glow in the dark?",
    "Why is biodiversity important?"
  ];
   
  const whenQuestions = [
    "When was fire first controlled by humans?",
    "When did the first dinosaurs appear?",
    "When did dinosaurs become extinct?",
    "When did the first humans evolve?",
    "When was the wheel invented?",
    "When was agriculture first developed?",
    "When was the first civilization established?",
    "When did the Ice Age occur?",
    "When was the telescope invented?",
    "When was the microscope invented?",
    "When did humans first reach the Moon?",
    "When was electricity first discovered?",
    "When did the first fish evolve?",
    "When did flowering plants appear?",
    "When was the first vaccine developed?",
    "When did the first mammals emerge?",
    "When did Earth form?",
    "When did life first appear on Earth?",
    "When was DNA discovered?",
    "When was the first computer created?",
    "When was penicillin discovered?",
    "When did the Industrial Revolution begin?",
    "When did plate tectonics start shaping Earth?",
    "When was the first satellite launched?",
    "When did modern humans begin using language?"
  ];
   
  const whereQuestions = [
    "Where is the first known civilization located?",
    "Where is the deepest part of the ocean?",
    "Where do hurricanes form?",
    "Where are most earthquakes found?",
    "Where is the largest desert on Earth?",
    "Where is the tallest mountain located?",
    "Where are fossils commonly found?",
    "Where does fresh water come from?",
    "Where is the largest rainforest?",
    "Where do monarch butterflies migrate?",
    "Where is the Great Barrier Reef located?",
    "Where can active volcanoes be found?",
    "Where do polar bears live?",
    "Where is the Earth's magnetic north pole?",
    "Where are most stars born?",
    "Where is the coldest place on Earth?",
    "Where is the hottest place on Earth?",
    "Where do coral reefs grow best?",
    "Where is the largest canyon on Earth?",
    "Where are black holes found?",
    "Where does photosynthesis occur in plants?",
    "Where is the largest glacier located?",
    "Where do sea turtles lay their eggs?",
    "Where are renewable energy resources commonly found?",
    "Where is the oldest known fossil discovered?"
  ];
   
  const whatQuestions = [
    "What is the biggest known mammal?",
    "What is the smallest living organism?",
    "What is a black hole?",
    "What is dark matter?",
    "What is photosynthesis?",
    "What is the water cycle?",
    "What is DNA?",
    "What is an ecosystem?",
    "What is the greenhouse effect?",
    "What is biodiversity?",
    "What is gravity?",
    "What is the speed of light?",
    "What is a galaxy?",
    "What is artificial intelligence?",
    "What is renewable energy?",
    "What is climate change?",
    "What is evolution?",
    "What is a cell?",
    "What is the human genome?",
    "What is a comet?",
    "What is an exoplanet?",
    "What is quantum physics?",
    "What is nanotechnology?",
    "What is genetic engineering?",
    "What is the scientific method?"
  ];
   
  return (
    <BookLayout prevPage="/science-quest/how-to-use" nextPage="/science-quest/why">
      <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} text-${isDarkMode ? 'gray-100' : 'gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8 text-${isDarkMode ? 'gray-100' : 'gray-900'}">
              Table of Contents
            </h1>
          </motion.div>
          
          <div className="relative">
            {/* ScrollSpy Nav with Links */}
            <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex space-x-6">
                <Link 
                  to="/science-quest/why"
                  className={`px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors`}
                >
                  WHY
                </Link>
                <Link 
                  to="/science-quest/when"
                  className={`px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors`}
                >
                  WHEN
                </Link>
                <Link 
                  to="/science-quest/where"
                  className={`px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors`}
                >
                  WHERE
                </Link>
                <Link 
                  to="/science-quest/what"
                  className={`px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors`}
                >
                  WHAT
                </Link>
              </div>
            </nav>
            
            {/* ScrollSpy Content for visual feedback */}
            <Scrollspy offset={-100} className="pt-20">
              {/* WHY Section */}
              <section id="why" className={`mb-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-6 border border-${isDarkMode ? 'gray-700' : 'gray-200'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <h2 className="text-2xl font-bold text-${isDarkMode ? 'gray-100' : 'gray-900'} mb-2">
                    WHY Questions
                  </h2>
                  <p className="text-sm text-${isDarkMode ? 'gray-400' : 'gray-500'}">
                    Understanding Causes and Explanations
                  </p>
                </motion.div>
                <div className="space-y-3">
                  {whyQuestions.map((q, idx) => {
                    const slug = slugify(q);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="text-base whitespace-pre-line leading-relaxed"
                      >
                        <Link
                          to={`/science-quest/why/${slug}`}
                          className="flex items-center gap-2 hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors duration-200"
                        >
                          •
                          <span>{q}</span>
                        </Link>
                      </motion.p>
                    );
                  })}
                </div>
              </section>
              
              {/* WHEN Section */}
              <section id="when" className={`mb-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-6 border border-${isDarkMode ? 'gray-700' : 'gray-200'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <h2 className="text-2xl font-bold text-${isDarkMode ? 'gray-100' : 'gray-900'} mb-2">
                    WHEN Questions
                  </h2>
                  <p className="text-sm text-${isDarkMode ? 'gray-400' : 'gray-500'}">
                    Exploring Science Through Time
                  </p>
                </motion.div>
                <div className="space-y-3">
                  {whenQuestions.map((q, idx) => {
                    const slug = slugify(q);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="text-base whitespace-pre-line leading-relaxed"
                      >
                        <Link
                          to={`/science-quest/when/${slug}`}
                          className="flex items-center gap-2 hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors duration-200"
                        >
                          •
                          <span>{q}</span>
                        </Link>
                      </motion.p>
                    );
                  })}
                </div>
              </section>
              
              {/* WHERE Section */}
              <section id="where" className={`mb-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-6 border border-${isDarkMode ? 'gray-700' : 'gray-200'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-4"
                >
                  <h2 className="text-2xl font-bold text-${isDarkMode ? 'gray-100' : 'gray-900'} mb-2">
                    WHERE Questions
                  </h2>
                  <p className="text-sm text-${isDarkMode ? 'gray-400' : 'gray-500'}">
                    Discovering Locations and Origins
                  </p>
                </motion.div>
                <div className="space-y-3">
                  {whereQuestions.map((q, idx) => {
                    const slug = slugify(q);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="text-base whitespace-pre-line leading-relaxed"
                      >
                        <Link
                          to={`/science-quest/where/${slug}`}
                          className="flex items-center gap-2 hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors duration-200"
                        >
                          •
                          <span>{q}</span>
                        </Link>
                      </motion.p>
                    );
                  })}
                </div>
              </section>
              
              {/* WHAT Section */}
              <section id="what" className={`mb-16 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-6 border border-${isDarkMode ? 'gray-700' : 'gray-200'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-4"
                >
                  <h2 className="text-2xl font-bold text-${isDarkMode ? 'gray-100' : 'gray-900'} mb-2">
                    WHAT Questions
                  </h2>
                  <p className="text-sm text-${isDarkMode ? 'gray-400' : 'gray-500'}">
                    Understanding Scientific Concepts and Objects
                  </p>
                </motion.div>
                <div className="space-y-3">
                  {whatQuestions.map((q, idx) => {
                    const slug = slugify(q);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="text-base whitespace-pre-line leading-relaxed"
                      >
                        <Link
                          to={`/science-quest/what/${slug}`}
                          className="flex items-center gap-2 hover:text-${isDarkMode ? 'blue-400' : 'blue-600'} transition-colors duration-200"
                        >
                          •
                          <span>{q}</span>
                        </Link>
                      </motion.p>
                    );
                  })}
                </div>
              </section>
            </Scrollspy>
          </div>
        </div>
      </div>
    </BookLayout>
  );
}