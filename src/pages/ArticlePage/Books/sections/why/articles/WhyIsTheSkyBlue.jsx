import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../../../ThemeProvider';

export function WhySkyIsBlue() {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const accentBg = isDarkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200';
  const sectionBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

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
          >
            <h1 className="text-3xl font-bold mb-8 text-center">Why is the sky blue?</h1>

            <div className={`${cardBg} p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6`}>
              <div className={`p-4 rounded-xl ${sectionBg} border border-gray-200 dark:border-gray-600`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Quick Answer</h2>
                <p className="text-lg">
                  The sky appears blue due to a phenomenon called Rayleigh scattering, where molecules in Earth's atmosphere scatter blue light from the sun more than other colors.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${sectionBg} border`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">The Journey of Sunlight</h2>
                <p className="text-lg mb-4">
                  Sunlight may appear white, but it contains all the colors of the rainbow. When sunlight enters Earth's atmosphere, it collides with tiny gas molecules that scatter the light in different directions.
                </p>

                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Understanding Light Scattering</h2>
                <p className="text-lg mb-4">
                  Blue light has a shorter wavelength than other colors, making it scatter more easily when it hits particles in the atmosphere.
                </p>

                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">The Role of Earth's Atmosphere</h2>
                <p className="text-lg mb-4">
                  Earth's atmosphere is filled with nitrogen and oxygen molecules that are much smaller than the wavelength of light. These molecules scatter light in all directions.
                </p>

                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Why Sunsets Are Red</h2>
                <p className="text-lg">
                  During sunset, sunlight travels through more of the atmosphere, causing more blue light to be scattered away, leaving the longer red wavelengths to reach our eyes.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${accentBg}`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Did You Know?</h2>
                <p className="text-lg">
                  On Mars, sunsets appear blue due to the different composition of its atmosphere!
                </p>
              </div>

              <div className={`p-4 rounded-xl ${sectionBg} border`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Real World Connections</h2>
                <p className="text-lg">
                  Understanding light scattering helps scientists study atmospheres of other planets and stars.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${sectionBg} border`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Explore Further</h2>
                <p className="text-lg">
                  Learn about atmospheric optics and other light phenomena.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${sectionBg} border`}>
                <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">Reflection Question</h2>
                <p className="text-lg">
                  Why do you think other colors of light don't get scattered as much as blue light in our atmosphere?
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}