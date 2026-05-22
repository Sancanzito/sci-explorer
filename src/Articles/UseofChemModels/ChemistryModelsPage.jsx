// pages/ChemistryModelsPage.jsx
import React, { useState, useEffect } from 'react';
import ScrollSpy from './ChemistryModelScroll';
import MainContent from './MainContent';
import Footer from './Footer';

const ChemistryModelsPage = () => {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "what-is-model", title: "What is a Model?" },
    { id: "importance", title: "Importance" },
    { id: "types-of-models", title: "Types of Models" },
    { id: "models-of-matter", title: "Models of Matter" },
    { id: "limitations", title: "Limitations" },
    { id: "observable-nonobservable", title: "Observable vs Non-observable" },
    { id: "additional-features", title: "Resources" },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = element.offsetTop - 90;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      
      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Fixed the sticky position container wrapper constraints */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-5 w-full max-w-[260px]">
            
            {/* Module 1: Lesson Title */}
            <div className="p-2 select-none">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-md">
                Chemistry • Article
              </span>
              <h2 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 mt-2 leading-tight">
                The Use of Models in Chemistry
              </h2>
            </div>

            {/* Module 2: The ScrollSpy Component */}
            <ScrollSpy 
              sections={sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />

            {/* Module 3: Key Concepts Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/40 rounded-2xl p-4 border border-gray-200/60 dark:border-gray-700/60">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-200 dark:border-gray-700 pb-1.5 select-none">
                Key Concepts
              </p>
              <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 mt-0.5 select-none">✦</span>
                  <span>Using representations to study systems beyond raw structural eyesight scale.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 mt-0.5 select-none">✦</span>
                  <span>Differentiating <strong>Physical</strong>, <strong>Conceptual</strong>, and <strong>Mathematical</strong> frameworks.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 mt-0.5 select-none">✦</span>
                  <span>Analyzing structural boundaries and predictive limits of modern theories.</span>
                </li>
              </ul>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: Content Stream */}
        <main className="col-span-1 lg:col-span-3">
          <MainContent />
        </main>

      </div>

      <Footer />

      {/* Mobile Floating Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl px-4 py-2 flex gap-3 border border-gray-200 dark:border-gray-700">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              title={section.title}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ChemistryModelsPage;