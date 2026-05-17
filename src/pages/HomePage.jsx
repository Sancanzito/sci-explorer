// pages/HomePage/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from './HomeComponents/WelcomeSection';
import TriviaWidget from './HomeComponents/TriviaWidget';
import FactBox from './HomeComponents/FactBox';
import FormulaWidget from './HomeComponents/FormulaWidget';
import SolarSystemModel from './HomeComponents/SolarSystemModel';
import DiscoveryTimeline from './HomeComponents/DiscoveryTimeline';
import ArticleLibrary from './HomeComponents/ArticleLibrary';
import ConceptReview from './HomeComponents/ConceptReview';
import NewsFeed from './HomeComponents/NewsFeed';
import QuoteofDay from './HomeComponents/QuoteofDay';
import { Quote } from 'lucide-react';

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-6 grid-rows-12 gap-4 min-h-screen">
          
          {/* Row 1-4: Hero Zone */}
          <div className="col-span-2 row-span-2">
            <WelcomeSection />
          </div>
          
          <div className="col-span-2 row-span-4 col-start-5 row-start-1">
            <SolarSystemModel />
          </div>
          
          <div className="col-span-2 row-span-2 col-start-3 row-start-1">
            <TriviaWidget />
          </div>
          
          <div className="col-span-2 row-span-2 row-start-3">
            <FactBox />
          </div>
          
          <div className="col-span-2 row-span-2 col-start-3 row-start-3">
            <FormulaWidget />
          </div>
          
          {/* Row 5-6: Mega Feature Banner */}
          <div className="col-span-6 row-span-2 row-start-5">
            <DiscoveryTimeline />
          </div>
          
          {/* Row 7-11: Deep Dive Zone */}
          <div className="col-span-3 row-span-5 row-start-7">
            <ArticleLibrary />
          </div>
          
          <div className="col-span-3 row-span-5 col-start-4 row-start-7">
            <ConceptReview />
          </div>
          
          {/* Row 12: Footer Zone */}
          <div className="col-span-3 row-start-12">
            <NewsFeed />
          </div>
          
          <div className="col-span-3 col-start-4 row-start-12">
            <QuoteofDay />
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;