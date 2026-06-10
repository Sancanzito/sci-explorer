import React, { useState } from 'react';
import { useTheme } from '../../../../ThemeProvider';

export function VocabularyBuilder({ terms }) {
  const { isDarkMode } = useTheme();
  const [expandedTerm, setExpandedTerm] = useState(null);
  const bg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  const toggleTerm = (word) => {
    setExpandedTerm(expandedTerm === word ? null : word);
  };

  return (
    <div className={`${bg} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}>
      <h2 className="text-2xl font-bold mb-4">Vocabulary Builder</h2>
      <div className="space-y-2">
        {terms.map((term, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleTerm(term.word)}
              className={`w-full text-left p-3 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <h3 className="text-lg font-bold">{term.word}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{term.pronunciation}</p>
            </button>
            {expandedTerm === term.word && (
              <div className={`mt-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-amber-50'} border border-amber-200 dark:border-amber-800`}>
                <p>{term.definition}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
