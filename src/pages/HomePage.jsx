// pages/HomePage/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from './HomeComponents/WelcomeSection';
import TriviaWidget from './HomeComponents/TriviaWidget/TriviaWidget';
import FactBox from './HomeComponents/FactBox';
import FormulaWidget from './HomeComponents/FormulaWidget';
import SolarSystemModel from './HomeComponents/SolarSystem/SolarSystemModel';
import DiscoveryTimeline from './HomeComponents/DiscoveryTimeline';
import ArticleLibrary from './HomeComponents/ArticleLibrary';
import ConceptReview from './HomeComponents/ConceptReview';
import NewsFeed from './HomeComponents/NewsFeed';
import QuoteofDay from './HomeComponents/QuoteofDay';

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 
          Mobile: 1 Column (Stays stacked naturally)
          Tablet (md): 2 Columns 
          Desktop (lg): Clean 6-Column Bento Layout
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* --- HERO ZONE --- */}
          <div className="lg:col-span-2">
            <WelcomeSection />
          </div>
          
          <div className="lg:col-span-2">
            <TriviaWidget />
          </div>
          
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <SolarSystemModel />
          </div>
          
          <div className="lg:col-span-2">
            <FactBox />
          </div>
          
          <div className="lg:col-span-2">
            <FormulaWidget />
          </div>
          
          {/* --- MEGA FEATURE --- */}
          <div className="md:col-span-2 lg:col-span-6">
            <DiscoveryTimeline />
          </div>
          
          {/* --- DEEP DIVE ZONE --- */}
          <div className="md:col-span-1 lg:col-span-3">
            <ArticleLibrary />
          </div>
          
          <div className="md:col-span-1 lg:col-span-3">
            <ConceptReview />
          </div>
          
          {/* --- FOOTER ZONE --- */}
          <div className="md:col-span-1 lg:col-span-3">
            <NewsFeed />
          </div>
          
          <div className="md:col-span-1 lg:col-span-3">
            <QuoteofDay />
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;