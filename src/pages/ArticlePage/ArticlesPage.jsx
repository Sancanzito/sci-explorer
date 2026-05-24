// components/ArticlesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { articlesDatabase, filterArticles } from './ArticlePageData';
import { FadeIn, AnimatedCard, ArticleSkeleton, StaggerContainer, PageTransition } from './ArticlePageAnimation';

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState(articlesDatabase);
  const [previewArticle, setPreviewArticle] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setFilteredArticles(filterArticles(articlesDatabase, searchQuery));
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-gray-900 dark:text-white">
        {/* Header Section */}
        <FadeIn delay={0.1}>
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              Reading Materials & Articles
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Explore comprehensive curriculum guides and laboratory step-by-steps.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 pr-10 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all shadow-sm"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <StaggerContainer staggerDelay={0.05}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <AnimatedCard key={article.id} onClick={() => setPreviewArticle(article)}>
                  <div className="group h-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 shadow-sm overflow-hidden">
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex-1">
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 px-2 py-1 rounded-full mb-2">
                          {article.category}
                        </span>
                        <h3 className="font-bold text-xl mt-2 text-gray-800 dark:text-gray-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3 leading-relaxed">
                          {article.description}
                        </p>
                      </div>
                      
                      <button className="mt-5 w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 text-center font-medium text-sm rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300">
                        View Preview →
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <FadeIn delay={0.2}>
            <div className="text-center py-12 sm:py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No materials found matching your search criteria.</p>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-500">Try tweaking your keyword or resetting filters.</p>
            </div>
          </FadeIn>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewArticle && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setPreviewArticle(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="p-6 sm:p-8">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 px-2 py-1 rounded-full mb-3">
                    {previewArticle.category}
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {previewArticle.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-3 leading-relaxed">
                    {previewArticle.description}
                  </p>

                  {/* Core Themes / Headings List */}
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      Key Themes Covered:
                    </h4>
                    
                    {previewArticle.content?.sections && previewArticle.content.sections.length > 0 ? (
                      <ul className="space-y-2">
                        {previewArticle.content.sections.map((section, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="flex items-start gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-tight">{section.heading}</span>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-gray-400 dark:text-gray-500 pl-1">
                        Full outline details available inside the material.
                      </p>
                    )}
                  </div>
{/* Action Buttons - Updated to use correct routing */}
<div className="mt-8 flex gap-3 justify-end">
  <button
    onClick={() => setPreviewArticle(null)}
    className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
  >
    Close
  </button>
  
  <Link
    to={`/articles/${previewArticle.id}`}
    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all text-center shadow-md shadow-cyan-500/20"
  >
    Read Full Material →
  </Link>
</div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default ArticlesPage;