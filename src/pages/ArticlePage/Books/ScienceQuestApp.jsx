import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CosmicBackground } from './components/CosmicBackground';
import { CoverPage } from './pages/CoverPage';
import { Synopsis }from './pages/Synopsis';
import { HowToUse } from './pages/HowToUse';
import { TableOfContents } from './pages/TableOfContents';
import { WhySection } from './sections/why/index';
import { WhenSection } from './sections/when/index';
import { WhereSection } from './sections/where/index';
import { WhatSection } from './sections/what/index';
import { Completion } from './pages/Completion';
import { BookLayout } from './components/BookLayout';
import { QuestionPlaceholder } from './pages/QuestionPlaceholder';

export default function ScienceQuestApp() {
  return (
    <div className="relative min-h-screen w/font-sans">
      <CosmicBackground />
      
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/synopsis" element={<Synopsis />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/table-of-contents" element={<TableOfContents />} />
        
        <Route path="/why" element={<WhySection />} />
        <Route path="/why/*" element={<QuestionPlaceholder />} />
        
        <Route path="/when" element={<WhenSection />} />
        <Route path="/when/*" element={<QuestionPlaceholder />} />
        
        <Route path="/where" element={<WhereSection />} />
        <Route path="/where/*" element={<QuestionPlaceholder />} />
        
        <Route path="/what" element={<WhatSection />} />
        <Route path="/what/*" element={<QuestionPlaceholder />} />
        
        <Route path="/completion" element={<Completion />} />
        
        {/* Article routes will be added here */}
      </Routes>
    </div>
  );
}