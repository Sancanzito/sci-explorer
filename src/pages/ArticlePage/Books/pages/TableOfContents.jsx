import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import { Link } from 'react-router-dom';
import sections, { slugify } from '../bookData';
import { Search } from 'lucide-react';

export function TableOfContents() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const bg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const linkColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  const allQuestions = sections.flatMap((section) =>
    section.questions.map((q) => ({ question: q, section: section.id, sectionTitle: section.title }))
  );

  const filtered = searchQuery
    ? allQuestions.filter((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()))
    : allQuestions;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Table of Contents</h1>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${textColor} outline-none focus:ring-2 focus:ring-amber-500`}
            />
          </div>
        </div>

        {!searchQuery ? (
          <div className="space-y-10">
            {sections.map((section, sIdx) => (
              <section key={section.id} className={`${bg} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + sIdx * 0.2 }}
                  className="mb-4"
                >
                  <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>
                    {section.title}
                  </h2>
                  <p className={`text-sm ${mutedText}`}>{section.subtitle}</p>
                </motion.div>
                <div className="space-y-2">
                  {section.questions.map((q, idx) => {
                    const slug = slugify(q);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                      >
                        <Link
                          to={`/science-quest/${section.id}/${slug}`}
                          className={`flex items-center gap-2 ${linkColor} hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200`}
                        >
                          <span className="text-amber-500">•</span>
                          <span>{q}</span>
                        </Link>
                      </motion.p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className={`text-sm ${mutedText} mb-4`}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map((item, i) => (
              <Link
                key={i}
                to={`/science-quest/${item.section}/${slugify(item.question)}`}
                className={`block p-3 rounded-lg ${bg} border border-gray-200 dark:border-gray-700 ${linkColor} hover:text-amber-600 dark:hover:text-amber-400 transition-colors`}
              >
                <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mr-2">{item.sectionTitle}</span>
                {item.question}
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className={`text-center py-8 ${mutedText}`}>No questions match your search.</p>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
