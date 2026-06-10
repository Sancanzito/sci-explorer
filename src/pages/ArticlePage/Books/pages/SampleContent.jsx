import React from 'react';
import { BookLayout } from '../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function SampleContent() {
  const { isDarkMode } = useTheme();
  
  // Content from user's request
  const content = `
# **Science Quest: Exploring the 4 W's of Science**

### *100 Fascinating Questions About What, Why, When, and Where*

* Why is the sky blue?

* Why do leaves change color in autumn?

* Why do stars twinkle at night?

* Why do we have different seasons?

* Why do earthquakes happen?

* Why do volcanoes erupt?

* Why do humans need sleep?

* Why do we dream?

* Why does ice float on water?

* Why is the ocean salty?

* Why do animals migrate?

* Why do birds fly in formations?

* Why do plants need sunlight?

* Why do some animals hibernate?

* Why do we hiccup?

* Why do rainbows appear?

* Why does lightning occur?

* Why do magnets attract certain metals?

* Why do we have fingerprints?

* Why do humans age?

* Why do mosquitoes bite people?

* Why do cats purr?

* Why do dogs wag their tails?

* Why do some animals glow in the dark?

* Why is biodiversity important?

* When was fire first controlled by humans?

* When did the first dinosaurs appear?

* When did dinosaurs become extinct?

* When did the first humans evolve?

* When was the wheel invented?

* When was agriculture first developed?

* When was the first civilization established?

* When did the Ice Age occur?

* When was the telescope invented?

* When was the microscope invented?

* When did humans first reach the Moon?

* When was electricity first discovered?

* When did the first fish evolve?

* When did flowering plants appear?

* When was the first vaccine developed?

* When did the first mammals emerge?

* When did Earth form?

* When did life first appear on Earth?

* When was DNA discovered?

* When was the first computer created?

* When was penicillin discovered?

* When did the Industrial Revolution begin?

* When did plate tectonics start shaping Earth?

* When was the first satellite launched?

* When did modern humans begin using language?

* Where is the first known civilization located?

* Where is the deepest part of the ocean?

* Where do hurricanes form?

* Where are most earthquakes found?

* Where is the largest desert on Earth?

* Where is the tallest mountain located?

* Where are fossils commonly found?

* Where does fresh water come from?

* Where is the largest rainforest?

* Where do monarch butterflies migrate?

* Where is the Great Barrier Reef located?

* Where can active volcanoes be found?

* Where do polar bears live?

* Where is the Earth's magnetic north pole?

* Where are most stars born?

* Where is the coldest place on Earth?

* Where is the hottest place on Earth?

* Where do coral reefs grow best?

* Where is the largest canyon on Earth?

* Where are black holes found?

* Where does photosynthesis occur in plants?

* Where is the largest glacier located?

* Where do sea turtles lay their eggs?

* Where are renewable energy resources commonly found?

* Where is the oldest known fossil discovered?

* What is the biggest known mammal?

* What is the smallest living organism?

* What is a black hole?

* What is dark matter?

* What is photosynthesis?

* What is the water cycle?

* What is DNA?

* What is an ecosystem?

* What is the greenhouse effect?

* What is biodiversity?

* What is gravity?

* What is the speed of light?

* What is a galaxy?

* What is artificial intelligence?

* What is renewable energy?

* What is climate change?

* What is evolution?

* What is a cell?

* What is the human genome?

* What is a comet?

* What is an exoplanet?

* What is quantum physics?

* What is nanotechnology?

* What is genetic engineering?

* What is the scientific method?

### Suggested Alternative Titles

* **The 4 W's of Science: 100 Questions That Changed the World**
* **WonderLab: 100 Science Questions About What, Why, When, and Where**
* **Science Mysteries: Exploring the What, Why, When, and Where**
* **Curious Minds: 100 Scientific Questions to Investigate**
* **The Great Science Inquiry: 100 Questions of Discovery**
* **Journey Through Science: The What, Why, When, and Where of Our World`
  ;

  return (
    <BookLayout prevPage="/science-quest/how-to-use" nextPage="/science-quest/table-of-contents">
      <div className={`min-h-screen p-8 md:p-12 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              Science Quest Content
            </h1>
          </motion.div>
          
          <div className="prose prose-invert max-w-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="whitespace-pre-line text-lg leading-relaxed"
            >
              {content}
            </motion.div>
          </div>
        </div>
      </div>
    </BookLayout>
  );
}