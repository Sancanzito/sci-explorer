// pages/HomePage/HomePage.jsx
import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import AnimatedBackground from './HomeComponents/AnimatedBackground/AnimatedBackground';
import WelcomeSection from './HomeComponents/WelcomeSection/WelcomeSection';
import TriviaWidget from './HomeComponents/TriviaWidget/TriviaWidget';
import FactBox from './HomeComponents/FactBox/FactBox';
import FormulaWidget from './HomeComponents/FormulaWidget/FormulaWidget';
import SolarSystemModel from './HomeComponents/SolarSystem/SolarSystemModel';
import DiscoveryTimeline from './HomeComponents/DiscoveryTimeline/DiscoveryTimeline';
import ArticleLibrary from './HomeComponents/ArticleLibrary/ArticleLibrary';
import ConceptReview from './HomeComponents/ConceptReview/ConceptReview';
import QuoteofDay from './HomeComponents/QuoteofDay/QuoteofDay';

// Scroll-animated wrapper component
const ScrollAnimatedSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px", threshold: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            delay, 
            ease: [0.25, 0.1, 0.25, 1] 
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <>
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen p-8"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <ScrollAnimatedSection delay={0.1} className="lg:col-span-2">
              <WelcomeSection />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.2} className="lg:col-span-2">
              <TriviaWidget />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.15} className="md:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="h-full">
                <SolarSystemModel />
              </div>
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.3} className="lg:col-span-2">
              <FactBox />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.4} className="lg:col-span-2">
              <FormulaWidget />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.35} className="md:col-span-2 lg:col-span-6">
              <DiscoveryTimeline />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.45} className="md:col-span-1 lg:col-span-3">
              <ArticleLibrary />
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection delay={0.5} className="md:col-span-1 lg:col-span-3">
              <ConceptReview />
            </ScrollAnimatedSection>
          </div>

          <ScrollAnimatedSection delay={0.55}>
            <QuoteofDay />
          </ScrollAnimatedSection>
          
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;