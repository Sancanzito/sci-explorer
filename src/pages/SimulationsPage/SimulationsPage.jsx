// pages/SimulationsPage.jsx
import React, { useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { simulationsData, CATEGORIES } from './SimulationsData';
import { AmbientBackground, DataOrbCanvas, BlackHoleFooterCanvas } from './SimulationVisuals';
import { useTheme } from '../../ThemeProvider'; // adjust import path if needed

const SimulationsPage = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFooterHovered, setIsFooterHovered] = useState(false);

  const filteredSimulations = useMemo(() => {
    return simulationsData.filter(sim => {
      const matchesSearch = sim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sim.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || sim.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Theme-aware base classes
  const bgClass = isDarkMode ? 'bg-[#020617]' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const cardBgClass = isDarkMode ? 'bg-slate-900/40' : 'bg-white/70';
  const cardBorderClass = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const inputBgClass = isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white/80 border-gray-200';
  const filterBarBgClass = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200 shadow-sm';

  return (
    <LazyMotion features={domAnimation}>
      <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-cyan-500/30 font-sans relative overflow-x-hidden`}>
        
        <Suspense fallback={<div className={`fixed inset-0 ${isDarkMode ? 'bg-[#020617]' : 'bg-gray-50'} z-0`} />}>
          <AmbientBackground opacity={isDarkMode ? 0.4 : 0.15} />
        </Suspense>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 px-6 z-10 border-b border-white/5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700'} text-sm font-bold mb-8 uppercase tracking-widest backdrop-blur-md`}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Virtual Laboratories
            </div>
            <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Simulate the <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Universe</span>
            </h1>
            <p className={`text-xl font-light max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Manipulate variables, observe reactions, and explore hyper-realistic scientific models directly in your browser.
            </p>
          </m.div>
        </div>

        {/* Search & Filter */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className={`flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-2xl p-4 rounded-3xl shadow-md ${filterBarBgClass} ${cardBorderClass}`}>
            <div className="relative w-full md:w-1/2 flex items-center">
              <Search className={`absolute left-4 ${isDarkMode ? 'text-cyan-500' : 'text-cyan-600'}`} size={20} />
              <input
                type="text"
                placeholder="Query simulations, topics, or phenomena..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${inputBgClass} border ${cardBorderClass} rounded-2xl py-3 pl-12 pr-4 ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-gray-800 placeholder-gray-400'} focus:outline-none focus:border-cyan-500/50 transition-colors font-light`}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === category 
                      ? isDarkMode
                        ? 'bg-cyan-500 text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-cyan-600 text-white shadow-md'
                      : isDarkMode
                        ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10 min-h-[400px]">
          <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSimulations.length > 0 ? (
                filteredSimulations.map((sim) => (
                  <m.div
                    key={sim.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  >
                    <m.div 
                      whileHover={{ y: -10, scale: 1.02 }}
                      className={`h-full ${cardBgClass} backdrop-blur-xl border ${cardBorderClass} rounded-[2rem] p-6 flex flex-col group relative overflow-hidden`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/${isDarkMode ? '10' : '5'} group-hover:to-purple-500/${isDarkMode ? '10' : '5'} transition-colors duration-500 pointer-events-none`} />
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <m.div 
                          whileHover={{ rotate: 180 }} 
                          transition={{ duration: 0.5 }}
                          className={`p-3 rounded-2xl bg-gradient-to-br ${sim.color} text-white shadow-lg`}
                        >
                          {sim.icon}
                        </m.div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cardBorderClass} ${isDarkMode ? 'text-slate-400 bg-black/30' : 'text-gray-500 bg-white/60'}`}>
                          {sim.category}
                        </span>
                      </div>

                      <h3 className={`text-xl font-black mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2 relative z-10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {sim.name}
                      </h3>
                      <p className={`text-sm mb-6 line-clamp-3 font-light relative z-10 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {sim.description}
                      </p>

                      <div className="mt-auto relative z-10">
                        <Link to={sim.path}>
                          <m.button
                            whileTap={{ scale: 0.95 }}
                            className={`w-full py-3 px-4 rounded-xl border ${cardBorderClass} font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_0_rgba(6,182,212,0)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] ${
                              isDarkMode
                                ? 'bg-white/5 text-white group-hover:bg-cyan-500 group-hover:text-[#020617] group-hover:border-cyan-400'
                                : 'bg-gray-100 text-gray-800 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-400'
                            }`}
                          >
                            Launch Parameters
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </m.button>
                        </Link>
                      </div>
                    </m.div>
                  </m.div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <div className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mb-4 flex justify-center`}><Search size={48} /></div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No Observational Data</h3>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Adjust your parameters to find matching simulations.</p>
                </div>
              )}
            </AnimatePresence>
          </m.div>
        </div>

        {/* 3D Data Orbs Section (unchanged but theme-aware) */}
        <div className={`relative py-24 border-t ${cardBorderClass} ${isDarkMode ? 'bg-slate-900/50' : 'bg-white/40'} z-10`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Laboratory Advantages</h2>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Theoretical concepts made tangible through computational modeling.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Variable Manipulation', desc: 'Control physics and chemistry inputs in real-time.', color: '#06b6d4' },
                { title: 'Abstract to Concrete', desc: 'Visual models for concepts invisible to the naked eye.', color: '#a855f7' },
                { title: 'Iterative Testing', desc: 'Fail safely and retry infinitely without material costs.', color: '#10b981' }
              ].map((item, i) => (
                <m.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="text-center"
                >
                  <Suspense fallback={<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 animate-pulse" />}>
                    <DataOrbCanvas color={item.color} />
                  </Suspense>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                  <p className={`text-sm font-light ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Black Hole Footer */}
        <div 
          className={`relative py-32 overflow-hidden border-t ${cardBorderClass} cursor-crosshair group`}
          onMouseEnter={() => setIsFooterHovered(true)}
          onMouseLeave={() => setIsFooterHovered(false)}
        >
          <Suspense fallback={null}>
            <BlackHoleFooterCanvas isHovered={isFooterHovered} />
          </Suspense>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pointer-events-none">
            <h2 className={`text-4xl md:text-5xl font-black transition-colors duration-700 ${isFooterHovered ? 'text-red-400' : (isDarkMode ? 'text-white' : 'text-gray-800')}`}>
              {isFooterHovered ? 'Event Horizon Reached' : 'Ready to begin your research?'}
            </h2>
            <p className={`mt-4 max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Select a module above to initiate your virtual laboratory session.
            </p>
          </div>
        </div>

      </div>
    </LazyMotion>
  );
};

export default SimulationsPage;