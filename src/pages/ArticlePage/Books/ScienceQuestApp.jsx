import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import { BookReaderLayout } from './components/BookReaderLayout';
import { CosmicBackground } from './components/CosmicBackground';

// Pages
import { CoverPage } from './pages/CoverPage';
import { Synopsis } from './pages/Synopsis';
import { HowToUse } from './pages/HowToUse';
import { TableOfContents } from './pages/TableOfContents';
import { SectionPage } from './pages/SectionPage';
import { Completion } from './pages/Completion';
import { QuestionPlaceholder } from './pages/QuestionPlaceholder';
import { WhySkyIsBlue } from './sections/why/articles/WhyIsTheSkyBlue';

export default function ScienceQuestApp() {
  return (
    <div className="relative min-h-screen font-sans">
      <CosmicBackground />

      {/* Removed AnimatePresence here. 
        The Routes component should NOT have a key tied to the pathname, 
        otherwise the Layout (Sidebar) will unmount on every click.
      */}
      <Routes>
        <Route element={<BookReaderLayout />}>
          <Route index element={<CoverPage />} />
          <Route path="synopsis" element={<Synopsis />} />
          <Route path="how-to-use" element={<HowToUse />} />
          <Route path="table-of-contents" element={<TableOfContents />} />

          <Route path="why" element={<SectionPage sectionId="why" />} />
          <Route path="why/why-is-the-sky-blue" element={<WhySkyIsBlue />} />
          <Route path="why/*" element={<QuestionPlaceholder />} />

          <Route path="when" element={<SectionPage sectionId="when" />} />
          <Route path="when/*" element={<QuestionPlaceholder />} />

          <Route path="where" element={<SectionPage sectionId="where" />} />
          <Route path="where/*" element={<QuestionPlaceholder />} />

          <Route path="what" element={<SectionPage sectionId="what" />} />
          <Route path="what/*" element={<QuestionPlaceholder />} />

          <Route path="completion" element={<Completion />} />
        </Route>
      </Routes>
    </div>
  );
}