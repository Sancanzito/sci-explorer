// pages/ArticlesPage.jsx
import React, { useState } from 'react';

const ArticlesPage = () => {
  // You can add your articles data and logic here
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Example: Add articles list
  const articles = [
    { id: 1, title: 'Biology Basics', description: 'Introduction to cellular biology' },
    { id: 2, title: 'Chemistry Fundamentals', description: 'Atomic structure and bonding' },
    { id: 3, title: 'Physics Principles', description: 'Laws of motion and energy' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">
        Reading Materials & Protocols
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Select a module from the navigation menu to view specific lab procedures.
      </p>
      
      {/* You can add your articles grid here */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <div key={article.id} className="p-4 border rounded-lg dark:border-gray-700">
            <h3 className="font-semibold text-lg">{article.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{article.description}</p>
            <button className="mt-2 text-cyan-600 dark:text-cyan-400 text-sm">
              Read More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;