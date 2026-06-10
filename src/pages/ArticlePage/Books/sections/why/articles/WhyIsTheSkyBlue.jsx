import React from 'react';
import { BookLayout } from '../../../components/BookLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../../../ThemeProvider';

export function WhySkyIsBlue() {
  const { isDarkMode } = useTheme();
  
  return (
    <BookLayout>
      <div className={`max-w-4xl mx-auto ${isDarkMode ? 'dark:bg-gray-900' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
            Why is the sky blue?
          </h1>
          
          <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-left ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
            <div className="mb-8 p-4 bg-blue-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                Quick Answer
              </h2>
              <p className="text-lg">
                The sky appears blue due to a phenomenon called Rayleigh scattering, where molecules in Earth's atmosphere scatter blue light from the sun more than other colors.
              </p>
            </div>
            
            <div className="mb-8 p-4 bg-blue-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                The Journey of Sunlight
              </h2>
              <p className="text-lg mb-4">
                Sunlight may appear white, but it contains all the colors of the rainbow. When sunlight enters Earth's atmosphere, it collides with tiny gas molecules that scatter the light in different directions.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                Understanding Light Scattering
              </h2>
              <p className="text-lg mb-4">
                Blue light has a shorter wavelength than other colors, making it scatter more easily when it hits particles in the atmosphere.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                The Role of Earth's Atmosphere
              </h2>
              <p className="text-lg mb-4">
                Earth's atmosphere is filled with nitrogen and oxygen molecules that are much smaller than the wavelength of light. These molecules scatter light in all directions.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                Why Sunsets Are Red
              </h2>
              <p className="text-lg">
                During sunset, sunlight travels through more of the atmosphere, causing more blue light to be scattered away, leaving the longer red wavelengths to reach our eyes.
              </p>
            </div>
            
            <div className="mb-8 p-4 bg-purple-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Did You Know?
              </h2>
              <p className="text-lg">
                On Mars, sunsets appear blue due to the different composition of its atmosphere!
              </p>
            </div>
            
            <div className="mb-8 p-4 bg-indigo-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                Real World Connections
              </h2>
              <p className="text-lg">
                Understanding light scattering helps scientists study atmospheres of other planets and stars.
              </p>
            </div>
            
            <div className="mb-8 p-4 bg-pink-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-pink-300">
                Explore Further
              </h2>
              <p className="text-lg">
                Learn about atmospheric optics and other light phenomena.
              </p>
            </div>
            
            <div className="p-4 bg-cyan-900/30 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300">
                Reflection Question
              </h2>
              <p className="text-lg">
                Why do you think other colors of light don't get scattered as much as blue light in our atmosphere?
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </BookLayout>
  );
}