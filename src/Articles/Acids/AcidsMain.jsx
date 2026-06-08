// pages/AcidsMain.jsx
import React, { useState, useEffect } from 'react';
import AcidsScroll from './AcidsScroll';
import AcidsFooter from './AcidsFooter';
import { Beaker, BookOpen, FlaskConical, ShieldAlert, Activity, CheckCircle2, Droplet, Info } from 'lucide-react';

const AcidsMain = () => {
  const sections = [
    { id: "chapter-overview", title: "Chapter Overview" },
    { id: "introduction", title: "1. Intro to Acids & Bases" },
    { id: "properties", title: "2. Properties of Acids, Bases & Salts" },
    { id: "understanding-ph", title: "3. Understanding pH" },
    { id: "chemical-indicators", title: "4. Chemical Indicators" },
    { id: "natural-indicators", title: "5. Natural Indicators" },
    { id: "neutralization", title: "6. Neutralization Reactions" },
    { id: "safety", title: "7. Safety & Handling" },
    { id: "daily-life", title: "8. Science in Daily Life" },
    { id: "assessment", title: "Chapter Assessment" },
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
      window.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-5 w-full max-w-[260px]">
            <div className="p-2 select-none">
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-950/40 px-2 py-1 rounded-md">
                Chemistry • Unit 5
              </span>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 mt-2 leading-tight">
                Acids, Bases, and Indicators
              </h2>
            </div>

            <AcidsScroll 
              sections={sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />

            <div className="bg-gradient-to-br from-violet-50/50 to-slate-100 dark:from-violet-900/20 dark:to-slate-800/40 rounded-2xl p-4 border border-violet-100 dark:border-violet-800/30">
              <p className="text-[10px] font-bold text-violet-600/80 dark:text-violet-500 uppercase tracking-widest mb-3 border-b border-violet-100 dark:border-violet-800/50 pb-1.5 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Core Objectives
              </p>
              <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <span>Define acids, bases, and salts.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <span>Understand pH and neutralization.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <span>Identify laboratory & natural indicators safely.</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Content Stream (The Textbook) */}
        <main id="printable-acids-content" className="col-span-1 lg:col-span-3 pb-24 prose prose-violet dark:prose-invert max-w-none">
          
          {/* Chapter Overview */}
          <section id="chapter-overview" className="scroll-mt-24">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">Chapter Overview</h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Many substances used in everyday life can be classified as acids or bases. Lemon juice, vinegar, soap, toothpaste, baking soda, and household cleaning products all possess chemical properties that make them acidic or basic. Scientists use indicators to identify these substances safely without relying on taste or touch.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Understanding acids, bases, and indicators helps us make informed decisions in laboratories, industries, healthcare, agriculture, and environmental science.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mt-6 shadow-sm">
              <h3 className="text-lg font-bold mt-0 mb-3 text-violet-700 dark:text-violet-400">Learning Objectives</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0 mb-2">By the end of this chapter, students should be able to:</p>
              <ul className="list-disc pl-5 m-0 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Define acids, bases, and salts.</li>
                <li>Compare the properties of acids and bases.</li>
                <li>Explain how neutralization occurs.</li>
                <li>Identify common laboratory and natural indicators.</li>
                <li>Interpret color changes in indicators.</li>
                <li>Understand the importance of safety when handling chemicals.</li>
                <li>Apply acid-base concepts to everyday situations.</li>
              </ul>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 1. Introduction to Acids and Bases */}
          <section id="introduction" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <FlaskConical className="text-violet-600" /> 1. Introduction to Acids and Bases
            </h2>
            
            <div className="relative w-full h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-md mb-8">
              <img 
                src="https://placehold.co/1200x450/4c1d95/ffffff?text=Acids+%26+Bases:+Lemons,+Vinegar,+Soap,+Baking+Soda" 
                alt="Banner showing lemons, vinegar, soap, baking soda, and laboratory solutions" 
                className="w-full h-full object-cover m-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <h3 className="text-white text-2xl font-bold m-0">The Chemistry of Everyday Products</h3>
              </div>
            </div>

            <p className="text-lg">Acids and bases are important classes of chemical substances that exhibit distinct physical and chemical properties.</p>
            <p>Some acids occur naturally in foods and beverages, while others are manufactured for industrial and laboratory applications. Likewise, bases are commonly found in cleaning products, soaps, and medicines. Understanding their characteristics allows scientists to safely identify and use these substances.</p>

            <div className="clearfix my-10">
              <figure className="float-right w-full sm:w-[40%] ml-0 sm:ml-6 mb-4">
                <img 
                  src="https://placehold.co/400x400/e2e8f0/475569?text=Acidic+vs+Basic+Household+Products" 
                  alt="Split-screen comparison of common acidic and basic household products" 
                  className="w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 m-0"
                />
                <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                  Figure 1. Everyday examples of acidic and basic substances.
                </figcaption>
              </figure>

              <h3 className="text-2xl font-bold mt-0">Everyday Examples</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-xl border border-rose-100 dark:border-rose-800/30">
                  <h4 className="text-rose-800 dark:text-rose-400 font-bold mt-0 mb-2">Acids</h4>
                  <ul className="text-rose-900 dark:text-rose-200 mt-0 space-y-1 text-sm">
                    <li>Lemon juice</li>
                    <li>Vinegar</li>
                    <li>Orange juice</li>
                    <li>Soft drinks</li>
                    <li>Stomach acid</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <h4 className="text-blue-800 dark:text-blue-400 font-bold mt-0 mb-2">Bases</h4>
                  <ul className="text-blue-900 dark:text-blue-200 mt-0 space-y-1 text-sm">
                    <li>Soap</li>
                    <li>Toothpaste</li>
                    <li>Baking soda</li>
                    <li>Household ammonia</li>
                    <li>Antacids</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 2. Properties of Acids, Bases, and Salts */}
          <section id="properties" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">2. Properties of Acids, Bases, and Salts</h2>
            <p>Every substance does not behave the same way when dissolved in water. Acids and bases display unique characteristics that help scientists identify them.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-0 flex items-center gap-2">
                  <Droplet className="w-5 h-5" /> Properties of Acids
                </h3>
                <p className="font-semibold mb-2">Acids generally:</p>
                <ul className="mt-0 text-sm text-gray-700 dark:text-gray-300">
                  <li>Taste sour <em>(never test chemicals by tasting)</em></li>
                  <li>React with certain metals</li>
                  <li>Conduct electricity when dissolved in water</li>
                  <li>Turn blue litmus paper red</li>
                </ul>
                <p className="font-semibold mb-1 mt-4">Examples include:</p>
                <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                  <li>Citric acid in lemons</li>
                  <li>Acetic acid in vinegar</li>
                  <li>Hydrochloric acid in the stomach</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-0 flex items-center gap-2">
                  <Droplet className="w-5 h-5" /> Properties of Bases
                </h3>
                <p className="font-semibold mb-2">Bases generally:</p>
                <ul className="mt-0 text-sm text-gray-700 dark:text-gray-300">
                  <li>Feel slippery</li>
                  <li>Taste bitter <em>(never test chemicals by tasting)</em></li>
                  <li>Conduct electricity in solution</li>
                  <li>Turn red litmus paper blue</li>
                </ul>
                <p className="font-semibold mb-1 mt-4">Examples include:</p>
                <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                  <li>Sodium bicarbonate</li>
                  <li>Magnesium hydroxide</li>
                  <li>Sodium hydroxide</li>
                </ul>
              </div>
            </div>

            <div className="bg-violet-50 dark:bg-violet-900/10 border-l-4 border-violet-500 p-6 rounded-r-2xl my-8">
              <h3 className="text-2xl font-bold text-violet-800 dark:text-violet-300 mt-0">What Are Salts?</h3>
              <p className="text-violet-900 dark:text-violet-100">Salts are ionic compounds formed when acids and bases react with one another. This process is called <strong>neutralization</strong>.</p>
              <p className="font-semibold mb-1 text-violet-900 dark:text-violet-100">Examples include:</p>
              <ul className="mt-0 text-sm text-violet-800 dark:text-violet-200">
                <li>Table salt (sodium chloride)</li>
                <li>Potassium nitrate</li>
                <li>Calcium sulfate</li>
              </ul>
            </div>

            <figure className="my-10 text-center block w-full">
              <img 
                src="https://placehold.co/900x400/e2e8f0/475569?text=Acids+|+Bases+|+Salts+Infographic" 
                alt="Three-column infographic comparing acids, bases, and salts" 
                className="w-[80%] mx-auto block rounded-2xl shadow-sm m-0"
              />
              <figcaption className="text-xs text-gray-500 mt-3 italic">
                Figure 2. Comparison of acids, bases, and salts.
              </figcaption>
            </figure>

            <h3 className="text-2xl font-bold mt-8 mb-4">Acids, Bases, and Salts Comparison Table</h3>
            <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
              <table className="w-full text-left border-collapse m-0">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">Property</th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">Acids</th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">Bases</th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">Salts</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 text-sm">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">Taste</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Sour</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Bitter</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Varies</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">Feel</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Not slippery</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Slippery</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Varies</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">Litmus Effect</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Blue to Red</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Red to Blue</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Usually no effect</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">pH Range</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Below 7</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Above 7</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Usually near 7</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">Examples</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Vinegar, Lemon Juice</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Soap, Baking Soda</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Table Salt</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-5 rounded-xl shadow-sm">
              <h4 className="text-amber-800 dark:text-amber-400 font-bold mt-0 mb-2">Real-Life Connection</h4>
              <p className="mb-0 text-amber-900 dark:text-amber-200 text-sm">When indigestion occurs, excess stomach acid may cause discomfort. Antacid tablets contain bases that neutralize excess acid and help relieve symptoms.</p>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 3. Understanding pH */}
          <section id="understanding-ph" className="scroll-mt-24">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <Activity className="text-violet-600" /> 3. Understanding pH
            </h2>
            
            <figure className="mb-8 w-full">
              <img 
                src="https://placehold.co/1200x250/cbd5e1/1e293b?text=pH+Scale+0+to+14+(Red+to+Blue)" 
                alt="Colorful pH scale ranging from 0 to 14" 
                className="w-full rounded-2xl shadow-sm m-0"
              />
              <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                Figure 3. The pH scale and common substances.
              </figcaption>
            </figure>

            <p className="text-lg">Scientists use the pH scale to measure how acidic or basic a substance is. The scale ranges from 0 to 14.</p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
              <h3 className="text-xl font-bold mt-0 mb-3 text-gray-900 dark:text-white">pH Classification</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-medium list-none pl-0 m-0">
                <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div> pH less than 7 = Acidic</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> pH equal to 7 = Neutral</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-500"></div> pH greater than 7 = Basic</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Examples on the pH Scale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { name: 'Battery Acid', ph: 1, color: 'bg-red-600' },
                { name: 'Lemon Juice', ph: 2, color: 'bg-red-500' },
                { name: 'Vinegar', ph: 3, color: 'bg-orange-500' },
                { name: 'Coffee', ph: 5, color: 'bg-yellow-500' },
                { name: 'Pure Water', ph: 7, color: 'bg-green-500' },
                { name: 'Baking Soda', ph: 8, color: 'bg-teal-500' },
                { name: 'Soap', ph: 10, color: 'bg-blue-400' },
                { name: 'Ammonia', ph: 11, color: 'bg-blue-600' },
                { name: 'Bleach', ph: 13, color: 'bg-indigo-700' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg mb-2 shadow-sm ${item.color}`}>
                    {item.ph}
                  </div>
                  <span className="text-sm font-medium text-center">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-5 rounded-xl my-8 shadow-sm">
              <h4 className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold m-0 text-lg mb-3">
                <Info className="w-5 h-5" /> Knowledge Check 1
              </h4>
              <p className="text-indigo-900 dark:text-indigo-100 mt-0 mb-2">Classify the following as acidic, neutral, or basic:</p>
              <ol className="list-decimal pl-5 m-0 space-y-1 text-indigo-800 dark:text-indigo-200">
                <li>Pure water</li>
                <li>Soap solution</li>
                <li>Vinegar</li>
                <li>Baking soda solution</li>
                <li>Lemon juice</li>
              </ol>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 4. Chemical Indicators */}
          <section id="chemical-indicators" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">4. Chemical Indicators</h2>
            
            <div className="clearfix mb-8">
              <figure className="float-left w-full sm:w-[45%] mr-0 sm:mr-6 mb-4">
                <img 
                  src="https://placehold.co/400x300/e2e8f0/475569?text=Litmus+Paper+%26+Universal+Indicator" 
                  alt="Laboratory indicators including litmus paper, universal indicator, and pH strips" 
                  className="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700 m-0"
                />
                <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                  Figure 4. Common laboratory indicators.
                </figcaption>
              </figure>

              <p className="text-lg">Scientists use indicators to determine whether a substance is acidic or basic without tasting or touching it. Indicators change color depending on pH.</p>

              <h3 className="text-2xl font-bold mt-6">Litmus Paper</h3>
              <p>Litmus is one of the most widely used indicators.</p>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 rounded-r-lg">
                  <h4 className="font-bold text-rose-800 dark:text-rose-400 mt-0 mb-1">Red Litmus Paper</h4>
                  <ul className="text-sm m-0 pl-5 text-rose-900 dark:text-rose-200">
                    <li>Remains red in acids</li>
                    <li>Turns blue in bases</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-lg">
                  <h4 className="font-bold text-blue-800 dark:text-blue-400 mt-0 mb-1">Blue Litmus Paper</h4>
                  <ul className="text-sm m-0 pl-5 text-blue-900 dark:text-blue-200">
                    <li>Remains blue in bases</li>
                    <li>Turns red in acids</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-10">Universal Indicator</h3>
            <p>Universal indicator provides a broad range of colors corresponding to different pH values.</p>

            <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 my-6 max-w-2xl mx-auto">
              <table className="w-full text-left border-collapse m-0">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Color</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">pH Range</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 text-sm">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">Red</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Strong Acid</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-semibold text-orange-500 dark:text-orange-400">Orange</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Acid</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-semibold text-yellow-500 dark:text-yellow-400">Yellow</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Weak Acid</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-semibold text-green-600 dark:text-green-400">Green</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Neutral</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-semibold text-blue-500 dark:text-blue-400">Blue</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Weak Base</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-600 dark:text-purple-400">Purple</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">Strong Base</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <figure className="my-8 text-center block w-full">
              <img 
                src="https://placehold.co/800x200/e2e8f0/475569?text=Universal+Indicator+Color+Chart" 
                alt="Universal indicator color chart" 
                className="w-[75%] mx-auto block rounded-xl shadow-sm m-0"
              />
              <figcaption className="text-xs text-gray-500 mt-2 italic">
                Figure 5. Universal indicator color scale.
              </figcaption>
            </figure>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 5. Natural Indicators */}
          <section id="natural-indicators" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">5. Natural Indicators</h2>
            <p className="text-lg">Many plants contain pigments that change color in acidic or basic conditions. These natural substances can serve as inexpensive indicators.</p>

            <div className="clearfix my-8">
              <figure className="float-right w-full sm:w-[40%] ml-0 sm:ml-6 mb-4">
                <img 
                  src="https://placehold.co/400x300/e2e8f0/475569?text=Red+Cabbage+Juice+Colors" 
                  alt="Red cabbage indicator showing multiple color changes across pH values" 
                  className="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700 m-0"
                />
                <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                  Figure 6. Color changes produced by red cabbage indicator.
                </figcaption>
              </figure>

              <h3 className="text-2xl font-bold mt-0">Red Cabbage Indicator</h3>
              <p>Red cabbage contains pigments called <em>anthocyanins</em>.</p>
              <p className="font-semibold mt-2 mb-1">Color changes:</p>
              <ul className="mt-0 text-sm">
                <li>Acidic → Red/Pink</li>
                <li>Neutral → Purple</li>
                <li>Basic → Blue/Green</li>
              </ul>

              <h3 className="text-2xl font-bold mt-6">Turmeric Indicator</h3>
              <p>Turmeric behaves differently.</p>
              <ul className="mt-0 text-sm">
                <li>Acidic → Yellow</li>
                <li>Neutral → Yellow</li>
                <li>Basic → Reddish-brown</li>
              </ul>

              <h3 className="text-2xl font-bold mt-6">Hibiscus Indicator</h3>
              <p>Hibiscus petals can also be used as natural indicators. Typical changes include:</p>
              <ul className="mt-0 text-sm">
                <li>Red in acidic solutions</li>
                <li>Greenish in basic solutions</li>
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl my-8">
              <h4 className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold m-0 text-xl mb-4">
                <FlaskConical className="w-6 h-6" /> Laboratory Investigation: Making a Red Cabbage Indicator
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-300 mt-0 mb-2">Materials</p>
                  <ul className="list-disc pl-5 m-0 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>Red cabbage leaves</li>
                    <li>Hot water</li>
                    <li>Blender</li>
                    <li>Filter paper</li>
                    <li>Small containers</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-300 mt-0 mb-2">Procedure</p>
                  <ol className="list-decimal pl-5 m-0 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>Chop cabbage leaves.</li>
                    <li>Blend with warm water.</li>
                    <li>Filter the mixture.</li>
                    <li>Collect the purple liquid.</li>
                    <li>Test various household solutions.</li>
                    <li>Record color changes.</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 6. Neutralization Reactions */}
          <section id="neutralization" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">6. Neutralization Reactions</h2>
            <p className="text-lg">When acids and bases react, they neutralize one another. The products formed are:</p>
            <ul>
              <li>Water</li>
              <li>Salt</li>
            </ul>

            <div className="bg-slate-100 dark:bg-slate-800 py-6 px-4 rounded-xl text-center font-mono text-xl md:text-2xl font-bold text-violet-700 dark:text-violet-400 my-6 border border-slate-200 dark:border-slate-700">
              Acid + Base → Salt + Water
            </div>

            <figure className="my-8 w-full block">
              <img 
                src="https://placehold.co/1200x300/e2e8f0/475569?text=Acid+++Base+Reaction+Diagram" 
                alt="Molecular diagram showing neutralization reaction" 
                className="w-full rounded-2xl shadow-sm m-0"
              />
              <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                Figure 7. Neutralization between an acid and a base.
              </figcaption>
            </figure>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-lg font-bold mt-0 mb-2 text-gray-800 dark:text-gray-200">Example 1: Lab Reaction</h4>
                <p className="text-sm font-medium mb-1">Hydrochloric Acid + Sodium Hydroxide</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">Produces:</p>
                <ul className="text-sm mt-0 text-gray-600 dark:text-gray-400">
                  <li>Water</li>
                  <li>Sodium Chloride (Table Salt)</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="text-lg font-bold mt-0 mb-2 text-gray-800 dark:text-gray-200">Example 2: Acidic Soil Treatment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">Farmers sometimes add lime (a base) to acidic soil. The lime neutralizes excess acidity and improves plant growth.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8">Real-Life Applications</h3>
            <p className="mb-2">Neutralization is used in:</p>
            <ul className="mt-0 text-gray-700 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2">
              <li>Agriculture</li>
              <li>Wastewater treatment</li>
              <li>Medicine</li>
              <li>Environmental protection</li>
              <li>Chemical manufacturing</li>
            </ul>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 7. Safety in Handling Acids and Bases */}
          <section id="safety" className="scroll-mt-24">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <ShieldAlert className="text-rose-600" /> 7. Safety in Handling Acids and Bases
            </h2>

            <figure className="mb-8 w-full block">
              <img 
                src="https://placehold.co/1200x400/991b1b/ffffff?text=Laboratory+Safety:+Goggles,+Gloves,+Lab+Coats" 
                alt="Students wearing laboratory goggles, gloves, and lab coats" 
                className="w-full h-[300px] object-cover rounded-2xl shadow-md m-0"
              />
              <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                Figure 8. Proper laboratory safety equipment.
              </figcaption>
            </figure>

            <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">Strong acids and bases can be dangerous.</p>
            <p className="mb-2">Some chemicals can:</p>
            <ul className="mt-0">
              <li>Burn skin</li>
              <li>Damage eyes</li>
              <li>Corrode materials</li>
              <li>Produce harmful fumes</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-4">Essential Laboratory Safety Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-bold mt-0 mb-3 text-slate-800 dark:text-slate-200">Personal Protective Equipment (PPE)</h4>
                <p className="text-sm font-semibold mb-2">Always wear:</p>
                <ul className="text-sm mt-0 text-slate-700 dark:text-slate-300">
                  <li>Safety goggles</li>
                  <li>Laboratory coat</li>
                  <li>Protective gloves</li>
                  <li>Closed shoes</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-bold mt-0 mb-3 text-slate-800 dark:text-slate-200">Safe Chemical Practices</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">Never:</p>
                    <ul className="text-xs mt-0 text-slate-700 dark:text-slate-300 pl-4">
                      <li>Taste chemicals</li>
                      <li>Touch unknown substances</li>
                      <li>Smell chemicals directly</li>
                      <li>Mix chemicals without instructions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">Always:</p>
                    <ul className="text-xs mt-0 text-slate-700 dark:text-slate-300 pl-4">
                      <li>Read labels carefully</li>
                      <li>Follow teacher instructions</li>
                      <li>Use indicators for identification</li>
                      <li>Report spills immediately</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-600 p-5 rounded-r-xl my-8">
              <h4 className="text-rose-800 dark:text-rose-400 font-bold mt-0 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Safety Reminder
              </h4>
              <p className="text-rose-900 dark:text-rose-200 m-0 text-sm">
                You should <strong>never</strong> identify acids and bases using taste, smell, or touch. Scientists rely on indicators and proper testing procedures.
              </p>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 8. Science in Daily Life */}
          <section id="daily-life" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">8. Science in Daily Life</h2>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-0">Why Do Antacids Work?</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2 mb-0 text-sm">Antacids contain bases that neutralize excess stomach acid. This helps reduce heartburn and indigestion.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-0">Why Does Vinegar Remove Mineral Deposits?</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2 mb-0 text-sm">Vinegar contains acetic acid. The acid reacts with mineral deposits, helping dissolve them.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-0">Why Are Soaps Effective Cleaners?</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2 mb-0 text-sm">Most soaps are mildly basic. Their chemical properties help break down oils and grease.</p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* Chapter Summary & Assessment */}
          <section id="assessment" className="scroll-mt-24">
            
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-3xl p-8 mb-8 border border-violet-100 dark:border-violet-800/50">
              <h2 className="text-3xl font-bold mt-0 mb-6 text-violet-900 dark:text-violet-100">Chapter Summary</h2>
              <h3 className="text-xl font-bold text-violet-800 dark:text-violet-200 mt-0 mb-4">Key Concepts</h3>
              <ul className="space-y-2 text-violet-900 dark:text-violet-100 list-none pl-0 m-0">
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Acids have properties different from bases.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Acids generally have pH values below 7.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Bases generally have pH values above 7.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Salts are produced during neutralization.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Indicators change color according to pH.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Litmus paper is a common laboratory indicator.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Natural indicators can be made from plants.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Strong acids and bases require careful handling.</li>
                <li><span className="text-violet-600 dark:text-violet-400 mr-2">✔</span> Safety procedures must always be followed.</li>
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mt-0 mb-6 text-gray-900 dark:text-white">End-of-Chapter Assessment</h2>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6">Multiple Choice</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Which pH value represents a neutral substance?</li>
                <li>Which indicator turns blue in a base?</li>
                <li>What products are formed during neutralization?</li>
                <li>Which natural indicator comes from red cabbage?</li>
                <li>Which PPE protects the eyes?</li>
              </ol>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">Short Response</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Differentiate acids and bases.</li>
                <li>Explain how litmus paper works.</li>
                <li>Describe a neutralization reaction.</li>
                <li>Discuss the role of natural indicators.</li>
                <li>Explain why safety procedures are necessary.</li>
              </ol>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">Practical Investigation</h3>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                <h4 className="text-lg font-bold mt-0 mb-4 text-violet-700 dark:text-violet-400">Testing Household Acids and Bases</h4>
                
                <p className="font-semibold mb-2 mt-0">Materials:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-0 grid grid-cols-2 sm:grid-cols-3">
                  <li>Vinegar</li>
                  <li>Lemon juice</li>
                  <li>Baking soda solution</li>
                  <li>Soap solution</li>
                  <li>Red cabbage indicator</li>
                </ul>
                
                <p className="font-semibold mb-2 mt-4">Procedure:</p>
                <ol className="list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400 mt-0 mb-0">
                  <li>Prepare indicator solution.</li>
                  <li>Test each substance.</li>
                  <li>Observe color changes.</li>
                  <li>Record results.</li>
                  <li>Classify substances as acidic, neutral, or basic.</li>
                  <li>Present findings using a data table and conclusion.</li>
                </ol>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AcidsFooter />

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
                  ? 'bg-violet-600 dark:bg-violet-400 scale-125 shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcidsMain;