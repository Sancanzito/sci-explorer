// components/ArticleReader.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articlesDatabase } from './ArticlePageData';
import { FadeIn, SlideIn, StaggerContainer, PageTransition } from './ArticlePageAnimation';

const ArticleReader = () => {
  const { articleId } = useParams();

  const currentArticle = articlesDatabase.find((art) => art.id === articleId);

  if (!currentArticle) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Material Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">The reading resource you are looking for does not exist.</p>
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }} className="mt-6">
              <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                ← Return to Dashboard Catalog
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-900 dark:text-white">
        {/* Back Button */}
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }} className="mb-6 w-fit">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Back to Articles Catalog
            </Link>
          </motion.div>
        </FadeIn>

        {/* Main Article Content */}
        <article className="p-6 sm:p-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl">
          <FadeIn delay={0.2}>
            <div className="mb-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 px-3 py-1 rounded-full">
                {currentArticle.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                {currentArticle.title}
              </h1>
              <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-indigo-50 dark:from-cyan-950/30 dark:to-indigo-950/30 rounded-xl border-l-4 border-cyan-500">
                <p className="text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentArticle.content?.introduction}
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

          {currentArticle.content?.sections && (
            <StaggerContainer staggerDelay={0.05}>
              {currentArticle.content.sections.map((section, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <SlideIn direction="left" delay={idx * 0.05}>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 pb-2 border-b-2 border-cyan-500 inline-block">
                      {section.heading}
                    </h2>
                  </SlideIn>

                  <SlideIn direction="right" delay={idx * 0.05 + 0.05}>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base mt-3">
                      {section.text}
                    </p>
                  </SlideIn>

                  {/* Bullet Points */}
                  {section.points && (
                    <SlideIn direction="up" delay={idx * 0.05 + 0.1}>
                      <ul className="list-disc list-outside pl-5 mt-3 space-y-2">
                        {section.points.map((pt, pIdx) => (
                          <motion.li
                            key={pIdx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 + 0.1 + pIdx * 0.03 }}
                            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"
                          >
                            {pt}
                          </motion.li>
                        ))}
                      </ul>
                    </SlideIn>
                  )}

                  {/* Subsections Grid */}
                  {section.subsections && (
                    <SlideIn direction="up" delay={idx * 0.05 + 0.1}>
                      <div className="grid gap-4 sm:grid-cols-3 mt-4">
                        {section.subsections.map((sub, sIdx) => (
                          <motion.div
                            key={sIdx}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:border-cyan-500/50"
                          >
                            <h4 className="font-bold text-cyan-600 dark:text-cyan-400 text-sm uppercase mb-2">
                              {sub.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {sub.desc}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </SlideIn>
                  )}

                  {/* Phase Changes Special Box */}
                  {section.phaseChanges && (
                    <SlideIn direction="up" delay={idx * 0.05 + 0.1}>
                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border border-cyan-200 dark:border-cyan-800 space-y-2">
                        {section.phaseChanges.map((change, cIdx) => (
                          <p key={cIdx} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {change}
                          </p>
                        ))}
                      </div>
                    </SlideIn>
                  )}
                </div>
              ))}
            </StaggerContainer>
          )}
        </article>
      </div>
    </PageTransition>
  );
};

export default ArticleReader;