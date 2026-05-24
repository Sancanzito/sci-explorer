// pages/ArticlePage/ArticleReader.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articlesDatabase } from './ArticlePageData';
import { FadeIn, PageTransition } from './ArticlePageAnimation';
import ArticleNotFound from './ArticleNotFound';

const ArticleReader = () => {
  const { articleId } = useParams();
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    // Check if article exists in database
    if (articlesDatabase && Array.isArray(articlesDatabase)) {
      const found = articlesDatabase.find(article => article.id === articleId);
      
      if (found) {
        setCurrentArticle(found);
        setArticleNotFound(false);
      } else {
        setArticleNotFound(true);
      }
    } else {
      setArticleNotFound(true);
    }
  }, [articleId]);

  // Show 404 component if article not found
  if (articleNotFound) {
    return <ArticleNotFound />;
  }

  // Show nothing while checking (prevents flash)
  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading article...</div>
      </div>
    );
  }

  // Successful render
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-900 dark:text-white">
        <FadeIn delay={0.1}>
          <div className="mb-6 w-fit">
            <Link to="/articles" className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-cyan-600">
              ← Back to Articles Catalog
            </Link>
          </div>
        </FadeIn>

        <article className="p-6 sm:p-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 px-3 py-1 rounded-full">
            {currentArticle.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 text-gray-900 dark:text-white">
            {currentArticle.title}
          </h1>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="italic text-gray-700 dark:text-gray-300">
              {currentArticle.content?.introduction || 'No introduction available'}
            </p>
          </div>

          <div className="my-6 border-t border-gray-200 dark:border-gray-800"></div>

          {currentArticle.content?.sections?.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b-2 border-cyan-500 inline-block pb-1">
                {section.heading}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </article>
      </div>
    </PageTransition>
  );
};

export default ArticleReader;