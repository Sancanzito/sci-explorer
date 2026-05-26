import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SciSkillsScrollSpy from './ScientificScrollSpy';
import SciSkillsFooter from './Scientificfooter';
import { 
  ObservationActivity, 
  QuestionSorter, 
  VariableSimulator, 
  MeasurementSimulator, 
  GraphBuilder 
} from './ScientificInteractions';

const sections = [
  { id: 'intro', title: '1. What is Scientific Investigation?' },
  { id: 'observation', title: '2. Observation Skills' },
  { id: 'questions', title: '3. Asking Questions' },
  { id: 'hypothesis', title: '4. Forming a Hypothesis' },
  { id: 'variables', title: '5. Experiment Variables' },
  { id: 'method', title: '6. The Scientific Method' },
  { id: 'measurement', title: '7. Accurate Measurement' },
  { id: 'data', title: '8. Data & Graphing' },
  { id: 'communication', title: '9. Communication' },
  { id: 'challenge', title: '10. The Challenge' }
];

// Floating Background Particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{
            y: -100,
            x: `+=${Math.random() * 100 - 50}`
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

const InvestigationPage = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-gray-900 to-black overflow-hidden border-b-4 border-cyan-500">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-sm mb-6 uppercase tracking-widest backdrop-blur-sm"
          >
            Core Scientific Skills
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            Science is not just knowledge — <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              It is a process of discovery.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-medium mb-12"
          >
            Master the art of observing, testing, and analyzing the world around you like a true scientist.
          </motion.p>
          
          {/* Image Placeholder: Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -15, 0] // Creates a continuous floating effect
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.6 },
              scale: { duration: 0.8, delay: 0.6, ease: "easeOut" },
              y: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.4 // Starts floating after the entrance animation
              }
            }}
            className="w-full max-w-4xl mx-auto h-64 sm:h-80 bg-gray-800/60 rounded-3xl border border-gray-700/50 flex flex-col items-center justify-center text-gray-500 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-blue-500/5"></div>
             <motion.svg 
               initial={{ rotate: -10 }}
               animate={{ rotate: 10 }}
               transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
               className="w-16 h-16 mb-4 opacity-50 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
             </motion.svg>
             <span className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400">[ Scientist Investigating Animation Placeholder ]</span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:w-1/4 shrink-0 relative">
          <div className="sticky top-28">
            <SciSkillsScrollSpy sections={sections} activeSection={activeSection} onSectionClick={scrollToSection} />
          </div>
        </div>

        {/* Main Content Area */}
        <main id="printable-investigation-content" className="w-full lg:w-3/4 space-y-24 bg-white dark:bg-gray-900 p-6 sm:p-12 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800">
          
          {/* 1. Intro */}
          <section id="intro" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🔍</span>
              1. What is Scientific Investigation?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              Scientific investigation is a structured process used to answer questions and solve problems using evidence and experimentation. Scientists rely on observation, testing, and analysis to understand how things work.
            </p>
            {/* Image Placeholder: Flow Diagram */}
            <div className="bg-slate-50 dark:bg-gray-800 rounded-2xl h-48 border-2 border-dashed border-blue-200 dark:border-gray-700 flex flex-col items-center justify-center text-blue-400 dark:text-gray-500">
              <span>[ Investigation Flow Diagram Placeholder ]</span>
            </div>
          </section>

          {/* 2. Observation */}
          <section id="observation" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">👀</span>
              2. Observation Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">Qualitative Observations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Describes the qualities of an object using your senses (color, texture, smell, shape).</p>
              </div>
              <div className="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                <h4 className="font-bold text-teal-700 dark:text-teal-400 mb-2">Quantitative Observations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Involves numbers, counting, or accurate measurements (weight, length, temperature).</p>
              </div>
            </div>
            <ObservationActivity />
          </section>

          {/* 3. Questions */}
          <section id="questions" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">❓</span>
              3. Asking Scientific Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Not all questions are scientific! Good scientific questions must be <strong>testable</strong>. This means you can design an experiment to find the answer.
            </p>
            <QuestionSorter />
          </section>

          {/* 4. Hypothesis */}
          <section id="hypothesis" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">💡</span>
              4. Forming a Hypothesis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              A hypothesis is a predicted answer to your question based on research. The best format to write one is the <strong>If... then... because...</strong> format.
            </p>
            <div className="bg-gray-900 p-8 rounded-3xl shadow-xl text-white font-medium text-lg leading-loose border-l-8 border-cyan-500">
              <span className="text-cyan-400 font-bold">If</span> plants receive more sunlight,<br/>
              <span className="text-blue-400 font-bold">then</span> they will grow taller,<br/>
              <span className="text-purple-400 font-bold">because</span> sunlight provides the energy needed for photosynthesis.
            </div>
          </section>

          {/* 5. Variables */}
          <section id="variables" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🎛️</span>
              5. Variables in Experiments
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              To keep an experiment fair, you must control the parts that change. These are called variables.
            </p>
            <VariableSimulator />
          </section>

          {/* 6. Scientific Method */}
          <section id="method" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📋</span>
              6. Steps of the Scientific Method
            </h2>
            <div className="relative py-8">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              {[
                { step: '1', title: 'Problem', desc: 'Ask a testable question.' },
                { step: '2', title: 'Research', desc: 'Gather background information.' },
                { step: '3', title: 'Hypothesis', desc: 'Predict the outcome.' },
                { step: '4', title: 'Experiment', desc: 'Test the hypothesis using steps.' },
                { step: '5', title: 'Data Analysis', desc: 'Organize and interpret results.' },
                { step: '6', title: 'Conclusion', desc: 'State if hypothesis was supported.' }
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-center mb-8 last:mb-0">
                  <div className="w-16 h-16 shrink-0 bg-white dark:bg-gray-900 border-4 border-cyan-500 rounded-full flex items-center justify-center font-black text-xl text-cyan-600 dark:text-cyan-400 z-10 shadow-md">
                    {item.step}
                  </div>
                  <div className="ml-6 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Measurement */}
          <section id="measurement" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📏</span>
              7. Accurate Measurement
            </h2>
            <MeasurementSimulator />
          </section>

          {/* 8. Data & Graphing */}
          <section id="data" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📊</span>
              8. Data Collection & Graphing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Recording observations in tables and converting them into graphs makes it much easier to spot patterns and trends.
            </p>
            <GraphBuilder />
          </section>

          {/* 9. Communication */}
          <section id="communication" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📢</span>
              9. Scientific Communication
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20 p-8 rounded-3xl border border-blue-100 dark:border-cyan-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                Science only advances when we share our discoveries! Scientists communicate their findings through Lab Reports, peer-reviewed journals, and presentations. Sharing allows other scientists to test the experiment themselves to ensure the results are reliable.
              </p>
            </div>
          </section>

          {/* 10. Challenge */}
          <section id="challenge" className="scroll-mt-28 pt-8">
             <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-1.5 rounded-[2.5rem] shadow-xl">
               <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.25rem] flex flex-col items-center text-center">
                  <h3 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">Investigation Challenge</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg text-lg">
                    Are you ready to run a virtual experiment from start to finish?
                  </p>
                  
                  {/* Image Placeholder: Virtual Challenge */}
                  <div className="w-full h-72 bg-slate-50 dark:bg-gray-950 rounded-2xl border-2 border-dashed border-cyan-300 dark:border-gray-700 flex flex-col items-center justify-center text-cyan-600 dark:text-gray-500 group cursor-pointer hover:bg-cyan-50 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-12 h-12 mb-3 opacity-60 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-bold tracking-wide">[ Start Virtual Experiment Simulator ]</span>
                    <span className="text-sm mt-2 opacity-70">Will be replaced with interactive React Game</span>
                  </div>
               </div>
             </div>
          </section>

        </main>
      </div>
      
      <SciSkillsFooter />
    </div>
  );
};

export default InvestigationPage;