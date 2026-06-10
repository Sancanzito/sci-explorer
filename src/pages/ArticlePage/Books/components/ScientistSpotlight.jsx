import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';

export function ScientistSpotlight({ scientist }) {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  if (!scientist) return null;

  return (
    <div className={`${bg} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}>
      <h2 className="text-2xl font-bold mb-4">Scientist Spotlight</h2>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">{scientist.name}</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {scientist.dates} | {scientist.field}
        </p>
        <div className="text-left">
          <p className="text-lg mb-4">{scientist.biography}</p>
          <h4 className="text-lg font-bold mb-2">Key Discoveries:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {scientist.discoveries.map((discovery, index) => (
              <li key={index}>{discovery}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
