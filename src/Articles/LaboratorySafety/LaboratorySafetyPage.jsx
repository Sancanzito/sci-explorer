// src/Articles/LaboratorySafety/LaboratorySafetyPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LabSafetyFooter from './LaboratorySafetyFooter';
import LabSafetyScrollSpy from './LabSafetyScrollSpy';

// Import our newly created interactive components
import PPEEquipper from './PPEEquipper';
import EmergencySimulator from './EmergencySimulator';
import SafetyQuizComponent from './SafetyQuizComponent';

const sections = [
  { id: 'importance', title: '1. Importance of Safety' },
  { id: 'ppe', title: '2. Personal Protective Equipment' },
  { id: 'rules', title: '3. Laboratory Rules' },
  { id: 'hazards', title: '4. Hazard Symbols' },
  { id: 'emergency', title: '5. Emergency Procedures' },
  { id: 'handling', title: '6. Proper Chemical Handling' },
  { id: 'cleanliness', title: '7. Cleanliness & Disposal' },
  { id: 'quiz', title: '8. Safety Quiz' }
];

const CautionTape = () => (
  <div className="w-full h-8 overflow-hidden relative my-12 shadow-lg">
    <motion.div
      className="absolute top-0 left-0 h-full w-[200%]"
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #fbbf24, #fbbf24 20px, #111827 20px, #111827 40px)' }}
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 10 }}
    />
  </div>
);

const LaboratorySafetyPage = () => {
  const [activeSection, setActiveSection] = useState('importance');

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-bold text-sm mb-6 uppercase tracking-wider">
            Laboratory Safety Guide
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Safety First — Every Experiment <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Begins with Responsibility
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-10">
            Master the essential protocols, hazard symbols, and emergency procedures required for a secure and productive laboratory environment.
          </p>
        </div>
      </div>

      <CautionTape />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10">
        
        <div className="hidden lg:block lg:w-1/4 shrink-0 relative">
          <div className="sticky top-28">
            <LabSafetyScrollSpy sections={sections} activeSection={activeSection} onSectionClick={scrollToSection} />
          </div>
        </div>

        <main id="printable-safety-content" className="w-full lg:w-3/4 space-y-24 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
          
          <section id="importance" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">1. The Importance of Laboratory Safety</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Understanding and practicing lab safety is the foundation of scientific inquiry. It protects you, your peers, and the environment from avoidable accidents and equipment damage.
            </p>
          </section>

          <section id="ppe" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">2. Personal Protective Equipment (PPE)</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Your first line of defense. Proper attire minimizes exposure to hazardous chemicals and prevents physical injuries. Use the interactive tool below to equip your scientist.
            </p>
            {/* INJECTED COMPONENT */}
            <PPEEquipper />
          </section>

          <section id="rules" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">3. Essential Laboratory Rules</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { rule: 'No eating or drinking in the lab', correct: false },
                { rule: 'Tie back long hair', correct: true },
                { rule: 'Never smell chemicals directly (waft instead)', correct: true },
                { rule: 'Mix unknown substances to see what happens', correct: false }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 ${item.correct ? 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <div className={`mt-0.5 p-1 rounded-full ${item.correct ? 'bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-400'}`}>
                    {item.correct ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.rule}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="hazards" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">4. Universal Hazard Symbols</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: 'Flammable', desc: 'Catches fire easily. Keep away from heat/sparks.' },
                { name: 'Toxic', desc: 'Can cause severe illness or death if inhaled or swallowed.' },
                { name: 'Corrosive', desc: 'Destroys living tissue and equipment on contact.' }
              ].map((hazard, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-yellow-500 transition-colors text-center">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4 text-yellow-600 dark:text-yellow-500 font-black text-2xl border-2 border-yellow-500">!</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{hazard.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{hazard.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="emergency" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">5. Emergency Procedures</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Know the location of emergency equipment and how to respond calmly to accidents. Test your instincts below.</p>
            {/* INJECTED COMPONENT */}
            <EmergencySimulator />
          </section>

          <section id="handling" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">6. Proper Chemical Handling</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Reading Labels', desc: 'Always read labels twice before using a chemical.' },
                { title: 'Pouring Safely', desc: 'Pour chemicals away from your body and face.' },
                { title: 'Never Mix Blindly', desc: 'Do not mix chemicals unless explicitly instructed.' }
              ].map((step, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="cleanliness" className="scroll-mt-28">
            <h2 className="text-3xl font-bold border-b-2 border-yellow-500 inline-block pb-2 mb-6">7. Laboratory Cleanliness</h2>
            <ul className="space-y-4 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-yellow-500 rounded-full shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">Dispose of chemicals in designated hazardous waste bins, never down the sink unless explicitly told it is safe.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-yellow-500 rounded-full shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">Broken glass must go in dedicated sharps containers, not regular trash cans.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 bg-yellow-500 rounded-full shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">Always wipe down your workstation and wash your hands thoroughly before leaving the laboratory.</span>
              </li>
            </ul>
          </section>

          <section id="quiz" className="scroll-mt-28 pt-8">
             <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-1 rounded-3xl shadow-xl">
               <div className="bg-white dark:bg-gray-900 p-8 rounded-[22px] flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ready to Test Your Knowledge?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                    Validate your understanding of laboratory safety protocols by taking the interactive assessment.
                  </p>
                  {/* INJECTED COMPONENT */}
                  <SafetyQuizComponent />
               </div>
             </div>
          </section>

        </main>
      </div>
      
      <LabSafetyFooter />
    </div>
  );
};

export default LaboratorySafetyPage;