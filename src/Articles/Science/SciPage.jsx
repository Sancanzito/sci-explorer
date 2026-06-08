// SciPage.jsx – fully cleaned, no SVG data URIs, all real images
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SciSkillsScrollSpy from './ScientificScrollSpy';
import SciSkillsFooter from './Scientificfooter';

const sections = [
  { id: 'intro', title: '1. Introduction to Investigation' },
  { id: 'nature', title: '2. Nature of Science' },
  { id: 'attitudes', title: '3. Scientific Attitudes' },
  { id: 'empiricism', title: '4. Empiricism & Evidence' },
  { id: 'observation', title: '5. Observation Skills' },
  { id: 'questions', title: '6. Asking Questions' },
  { id: 'research', title: '7. Scientific Research' },
  { id: 'hypothesis', title: '8. Formulating Hypotheses' },
  { id: 'variables', title: '9. Experimental Variables' },
  { id: 'method', title: '10. Scientific Method' },
  { id: 'measurement', title: '11. Measurement & Accuracy' },
  { id: 'data', title: '12. Data Interpretation' },
  { id: 'ethics', title: '13. Scientific Ethics' },
  { id: 'communication', title: '14. Communication' },
  { id: 'daily-life', title: '15. Science in Daily Life' },
  { id: 'assessment', title: '16. Module Assessment' },
  { id: 'reflection', title: '17. Reflection' },
  { id: 'references', title: '18. References' }
];

// Floating Background Particles (kept – they are safe, no SVG)
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

// No more ScienceBackgroundPattern – removed to fix 400 error

// Enhanced Image Component with real Wikipedia images
const SciImage = ({ src, alt, caption, align = "center" }) => {
  const alignmentClass = {
    left: "md:float-left md:mr-6 md:mb-4",
    right: "md:float-right md:ml-6 md:mb-4",
    center: "mx-auto"
  }[align];

  // Real fallback image from Wikimedia Commons
  const fallbackImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/800px-Commons-logo.svg.png";

  return (
    <div className={`my-6 max-w-md ${alignmentClass}`}>
      <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto max-h-64 object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        {caption && (
          <div className="p-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            {caption}
          </div>
        )}
      </div>
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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-gray-900 to-black overflow-hidden border-b-4 border-cyan-500 z-10">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10 relative z-10">
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:w-1/4 shrink-0 relative">
          <div className="sticky top-28">
            <SciSkillsScrollSpy sections={sections} activeSection={activeSection} onSectionClick={scrollToSection} />
          </div>
        </div>

        {/* Main Content Area */}
        <main id="printable-investigation-content" className="w-full lg:w-3/4 space-y-20 bg-white dark:bg-gray-900 p-6 sm:p-12 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          
          {/* 1. Intro */}
          <section id="intro" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🔍</span>
              1. What is Scientific Investigation?
            </h2>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Starr_070730-7919_Salvia_coccinea.jpg/800px-Starr_070730-7919_Salvia_coccinea.jpg"
              alt="Scientific observation in nature"
              caption="Observation is the first step of any scientific investigation."
              align="right"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              Scientific investigation is a structured process used to answer questions and solve problems using evidence and experimentation. Scientists rely on observation, testing, and analysis to understand how things work and to separate fact from assumption.
            </p>
          </section>

          {/* 2. Nature of Science */}
          <section id="nature" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🧬</span>
              2. Nature of Science
            </h2>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Portrait_of_Galileo_Galilei_%28scientist%29.jpg/800px-Portrait_of_Galileo_Galilei_%28scientist%29.jpg"
              alt="Galileo Galilei portrait"
              caption="Galileo Galilei, a pioneer of the scientific method."
              align="left"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              What makes a scientist? Science is defined by its practitioners' commitment to rigorous methodology. Effective scientists share specific characteristics:
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 mb-8 clear-both">
              {['Ask meaningful questions', 'Base conclusions on evidence', 'Think critically', 'Accept corrections', 'Collaborate with others', 'Communicate findings clearly', 'Follow ethical standards'].map((trait, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                  <span className="text-cyan-500">✓</span> {trait}
                </li>
              ))}
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Famous Examples:</strong> Galileo Galilei (Astronomy), Marie Curie (Radioactivity), Charles Darwin (Evolution), and Rosalind Franklin (DNA Structure).
            </p>
          </section>

          {/* 3. Scientific Attitudes */}
          <section id="attitudes" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🧠</span>
              3. Scientific Attitudes and Values
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Curiosity', 'Open-mindedness', 'Intellectual Honesty', 'Skepticism', 'Objectivity', 'Creativity', 'Perseverance', 'Responsibility', 'Respect for Evidence'].map((attitude, i) => (
                <span key={i} className="px-4 py-2 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800">
                  {attitude}
                </span>
              ))}
            </div>
          </section>

          {/* 4. Empiricism */}
          <section id="empiricism" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">⚖️</span>
              4. Empiricism and Evidence
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              <strong>Empiricism</strong> is the foundational principle that scientific knowledge comes exclusively from sensory observation, experimentation, and measurable evidence—not from personal beliefs, intuition, or assumptions.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <tr><th className="px-6 py-4 font-bold">Claim</th><th className="px-6 py-4 font-bold">Scientific?</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                  <tr><td className="px-6 py-4">"Plants grow because I believe they do."</td><td className="px-6 py-4 text-red-500 text-xl">❌</td></tr>
                  <tr><td className="px-6 py-4">"Plants grow faster because data from measurements show increased height."</td><td className="px-6 py-4 text-green-500 text-xl">✅</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Observation Skills */}
          <section id="observation" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">👀</span>
              5. Observation Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">Qualitative Observations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Describes the qualities of an object using your senses (e.g., the leaf is bright green, the rock is rough).</p>
              </div>
              <div className="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                <h4 className="font-bold text-teal-700 dark:text-teal-400 mb-2">Quantitative Observations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Involves exact numbers, counting, or accurate measurements (e.g., the beaker has 50mL, the plant grew 3cm).</p>
              </div>
            </div>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Plant_growth_measurement.jpg/800px-Plant_growth_measurement.jpg"
              alt="Measuring plant growth"
              caption="Quantitative observation: measuring plant height with a ruler."
              align="center"
            />
          </section>

          {/* 6. Asking Questions */}
          <section id="questions" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">❓</span>
              6. Asking Scientific Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Not all questions are scientific! Good scientific questions must be <strong>testable</strong>. This means you can design a measurable experiment to find the answer. "Which color is the best?" is subjective and non-testable. "At what temperature does salt water freeze?" is objective and testable.
            </p>
          </section>

          {/* 7. Research */}
          <section id="research" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📚</span>
              7. Scientific Research
            </h2>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Research_laboratory.jpg/800px-Research_laboratory.jpg"
              alt="Scientific research lab"
              caption="Modern research laboratory where experiments are conducted."
              align="right"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              <strong>What is Research?</strong> It is a systematic investigation conducted to generate new knowledge or solve problems.
            </p>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">Types of Research:</h4>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Basic Research:</strong> Expanding human knowledge without an immediate application.</li>
                <li><strong>Applied Research:</strong> Solving specific, practical problems.</li>
                <li><strong>Experimental Research:</strong> Testing variables in a controlled environment.</li>
                <li><strong>Descriptive & Field Research:</strong> Observing subjects in their natural environments.</li>
              </ul>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mt-6">Importance of Research:</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Research solves real-world problems, improves technology, advances medicine, protects the environment, and supports evidence-based decision making.
              </p>
            </div>
          </section>

          {/* 8. Hypothesis */}
          <section id="hypothesis" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">💡</span>
              8. Formulating Hypotheses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              A hypothesis is a testable prediction based on research. The most rigorous format to write one is the <strong>If... then... because...</strong> structure.
            </p>
            <div className="bg-gray-900 p-8 rounded-3xl shadow-lg text-white font-medium text-lg leading-loose border-l-8 border-cyan-500 mb-8">
              <span className="text-cyan-400 font-bold">If</span> plants receive more sunlight,<br/>
              <span className="text-blue-400 font-bold">then</span> they will grow taller,<br/>
              <span className="text-purple-400 font-bold">because</span> sunlight provides the energy needed for photosynthesis.
            </div>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Sunlight_plants.jpg/800px-Sunlight_plants.jpg"
              alt="Sunlight and plant growth"
              caption="Testing the hypothesis: more sunlight leads to taller plants."
              align="center"
            />
          </section>

          {/* 9. Variables */}
          <section id="variables" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🎛️</span>
              9. Variables and Experimental Design
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              To keep an experiment fair and ensure valid results, scientists isolate specific variables:
            </p>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li><strong className="text-cyan-600 dark:text-cyan-400">Independent Variable:</strong> The one condition you intentionally change (e.g., amount of sunlight).</li>
              <li><strong className="text-purple-600 dark:text-purple-400">Dependent Variable:</strong> The condition you measure as a result (e.g., plant height).</li>
              <li><strong className="text-orange-600 dark:text-orange-400">Controlled Variables:</strong> The conditions kept exactly the same to ensure fairness (e.g., water, soil type).</li>
            </ul>
          </section>

          {/* 10. Method */}
          <section id="method" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📋</span>
              10. The Scientific Method
            </h2>
            <div className="relative py-8">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              {[
                { step: '1', title: 'Problem', desc: 'Ask a testable question.' },
                { step: '2', title: 'Research', desc: 'Gather background information.' },
                { step: '3', title: 'Hypothesis', desc: 'Predict the outcome.' },
                { step: '4', title: 'Experiment', desc: 'Test the hypothesis using a fair procedure.' },
                { step: '5', title: 'Data Analysis', desc: 'Organize and interpret the results objectively.' },
                { step: '6', title: 'Conclusion', desc: 'State if the hypothesis was supported or rejected.' }
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

          {/* 11. Measurement */}
          <section id="measurement" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📏</span>
              11. Measurement and Accuracy
            </h2>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Graduated_cylinder_meniscus.svg/800px-Graduated_cylinder_meniscus.svg.png"
              alt="Graduated cylinder meniscus"
              caption="Reading the meniscus at eye level ensures accurate volume measurement."
              align="left"
            />
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Precise measurement is the backbone of quantitative data. A standard practice when reading liquids in a graduated cylinder is to measure from the <strong>bottom of the meniscus</strong> (the slight curve at the surface of the liquid) at eye level to prevent measurement errors.
            </p>
            <div className="clear-both"></div>
          </section>

          {/* 12. Data Interpretation */}
          <section id="data" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📊</span>
              12. Data Interpretation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Recording observations and converting them into graphs makes it easier to spot patterns, trends, and outliers. When reading scientific graphs, always analyze:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li><strong>Title:</strong> What is the overarching relationship being measured?</li>
              <li><strong>X-axis:</strong> Typically displays the Independent Variable.</li>
              <li><strong>Y-axis:</strong> Typically displays the Dependent Variable.</li>
              <li><strong>Trends & Correlation:</strong> Is the relationship positive, negative, or non-existent?</li>
              <li><strong>Outliers:</strong> Are there data points that deviate drastically from the norm?</li>
            </ul>
            <SciImage 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Scatter_plot.svg/800px-Scatter_plot.svg.png"
              alt="Example scatter plot"
              caption="Graphs help identify correlations and outliers in data."
              align="center"
            />
          </section>

          {/* 13. Scientific Ethics */}
          <section id="ethics" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🛡️</span>
              13. Scientific Ethics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Scientific integrity relies heavily on ethical conduct. Core ethical considerations include:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"><strong>Honesty:</strong> Truthful reporting of data without fabrication.</div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"><strong>Citation:</strong> Avoiding plagiarism and crediting past work.</div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"><strong>Informed Consent:</strong> Protecting human subjects.</div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"><strong>Welfare & Environment:</strong> Ensuring animal safety and environmental responsibility.</div>
            </div>
          </section>

          {/* 14. Communication */}
          <section id="communication" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">📢</span>
              14. Scientific Communication
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20 p-8 rounded-3xl border border-blue-100 dark:border-cyan-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                Science only advances when discoveries are shared. Scientists communicate findings through lab reports, presentations, and peer-reviewed journals. This transparency allows other scientists to reproduce the experiment and verify the reliability of the results.
              </p>
            </div>
          </section>

          {/* 15. Daily Life */}
          <section id="daily-life" className="scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 flex items-center justify-center text-xl">🌍</span>
              15. Science in Everyday Life
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <tr><th className="px-6 py-4 font-bold">Field</th><th className="px-6 py-4 font-bold">Example Application</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                  <tr><td className="px-6 py-4 font-medium">Medicine</td><td className="px-6 py-4">Vaccine development and disease mapping</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Agriculture</td><td className="px-6 py-4">Cultivating drought-resistant crop varieties</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Engineering</td><td className="px-6 py-4">Advancing renewable energy systems (Solar/Wind)</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Environmental</td><td className="px-6 py-4">Monitoring air quality and pollution levels</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Food Science</td><td className="px-6 py-4">Safety testing and improving nutritional longevity</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 16. Assessment */}
          <section id="assessment" className="scroll-mt-28 bg-blue-50 dark:bg-gray-800/40 p-8 rounded-[2rem] border border-blue-100 dark:border-gray-700">
            <h2 className="text-2xl font-extrabold text-blue-900 dark:text-cyan-400 mb-6">16. Module Assessment</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Part A: Knowledge Check</h4>
                <ol className="list-decimal pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>What is empiricism?</li>
                  <li>Differentiate qualitative and quantitative observations.</li>
                  <li>What constitutes a strong hypothesis?</li>
                  <li>Why is it necessary to isolate variables?</li>
                  <li>Why is ethics paramount in scientific research?</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 17. Reflection */}
          <section id="reflection" className="scroll-mt-28 bg-purple-50 dark:bg-purple-900/10 p-8 rounded-[2rem] border border-purple-100 dark:border-purple-900/30">
            <h2 className="text-2xl font-extrabold text-purple-900 dark:text-purple-400 mb-6">17. Reflection & Performance Task</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Part B: Reflection</h4>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>How can scientific thinking help you in everyday life?</li>
                  <li>Which scientific attitude do you believe is most important and why?</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-purple-200 dark:border-purple-800/30">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Part C: Performance Task</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Design a simple investigation framework involving:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-center">
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-purple-100 dark:border-gray-700">Question</div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-purple-100 dark:border-gray-700">Hypothesis</div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-purple-100 dark:border-gray-700">Variables</div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-purple-100 dark:border-gray-700">Procedure</div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-purple-100 dark:border-gray-700">Results</div>
                </div>
              </div>
            </div>
          </section>

          {/* 18. References */}
          <section id="references" className="scroll-mt-28">
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">18. References</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Please refer to the footer for educational standards and curriculum resources aligned with this module.
            </p>
          </section>
        </main>
      </div>
      
      <SciSkillsFooter />
    </div>
  );
};

export default InvestigationPage;