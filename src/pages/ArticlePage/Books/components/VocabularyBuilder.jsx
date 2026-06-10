import React, { useState } from 'react';
import { useTheme } from '../../../../ThemeProvider';

export function VocabularyBuilder({ terms }) {
  const { isDarkMode } = useTheme();
  const [expandedTerm, setExpandedTerm] = useState(null);

  const toggleTerm = (word) => {
    setExpandedTerm(expandedTerm === word ? null : word);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 ${isDarkMode ? 'dark:bg-gray-800/10 dark:border-gray-700' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">Vocabulary Builder</h2>
      <div className="space-y-2">
        {terms.map((term, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleTerm(term.word)}
              className={`w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/10 ${isDarkMode ? 'dark:bg-gray-700/10 dark:hover:bg-gray-600/10' : ''}`}
            >
              <h3 className="text-lg font-bold">{term.word}</h3>
              <p className="text-sm">{term.pronunciation}</p>
            </button>
            {expandedTerm === term.word && (
              <div className="mt-2 p-3 bg-white/5 rounded-lg">
                <p>{term.definition}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}