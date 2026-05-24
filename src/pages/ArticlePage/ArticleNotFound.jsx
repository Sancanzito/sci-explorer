// pages/ArticlePage/ArticleNotFound.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from './ArticlePageAnimation';

const ArticleNotFound = () => {
  const location = useLocation();
  const attemptedPath = location.pathname;

  // Check if it was an article route
  const isArticleRoute = attemptedPath.includes('/articles/');
  const articleId = isArticleRoute ? attemptedPath.split('/articles/')[1] : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg className="w-16 h-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Article Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              The educational material you're looking for doesn't exist or has been moved.
            </p>
            {articleId && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg inline-block">
                <p className="text-sm font-mono text-yellow-800 dark:text-yellow-300">
                  Requested ID: <span className="font-bold">{articleId}</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Available Articles Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-left"
          >
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Available Articles:
            </h3>
            <div className="space-y-2">
              <Link 
                to="/articles/chem-models"
                className="block p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-cyan-600 dark:text-cyan-400">The Use of Models in Chemistry</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: chem-models</p>
              </Link>
              <Link 
                to="/articles/particle-model-matter"
                className="block p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-cyan-600 dark:text-cyan-400">The Particle Model of Matter</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: particle-model-matter</p>
              </Link>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/articles"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              Browse All Articles
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Return to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ArticleNotFound;