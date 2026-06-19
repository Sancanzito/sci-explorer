// pages/ArticlePage/ArticlesPage.jsx
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LazyMotion, domAnimation, m, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Search, X, BookOpen, ChevronRight, Activity, ArrowLeft } from 'lucide-react';
import { articlesDatabase, filterArticles } from './ArticleData';
import { useTheme } from '../../ThemeProvider';
import { useArticleStore } from './articleStore';
import ArticleNotFound from './ArticleDebugging';
import ScientificBackground from './ScientificBackground';

const useTypewriterPlaceholder = (phrases) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % phrases.length), 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);
  return phrases[index];
};

export const ArticlesPage = () => {
  const { isDarkMode } = useTheme();
  const placeholderText = useTypewriterPlaceholder([
    "Search 'Chemical Models'...", "Query 'Particle Dynamics'...", "Find 'Safety Protocols'..."
  ]);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { 
    searchQuery, setSearchQuery, previewArticle, setPreviewArticle,
    showDropdown, setShowDropdown, suggestions, selectedIndex, setSelectedIndex
  } = useArticleStore();

  const filteredArticles = useMemo(() => filterArticles(articlesDatabase, searchQuery), [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setSearchQuery(suggestions[selectedIndex].title);
      setShowDropdown(false);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      searchInputRef.current?.blur();
    }
  };

  // Theme-aware base classes perfectly matching SimulationsPage
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
          <ScientificBackground isDarkMode={isDarkMode} />
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
              <Activity size={16} />
              Literature Archive
            </div>
            <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Scientific <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Modules</span>
            </h1>
            <p className={`text-xl font-light max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Query technical documents, foundational theories, and interactive curriculum directly from the database.
            </p>
          </m.div>
        </div>

        {/* Search Architecture */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className={`flex flex-col md:flex-row gap-4 items-center justify-center backdrop-blur-2xl p-4 rounded-3xl shadow-md ${filterBarBgClass} ${cardBorderClass}`}>
            <div className="relative w-full md:w-2/3 flex items-center" ref={dropdownRef}>
              <Search className={`absolute left-4 ${isDarkMode ? 'text-cyan-500' : 'text-cyan-600'}`} size={20} />
              
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className={`w-full ${inputBgClass} border ${cardBorderClass} rounded-2xl py-3 pl-12 pr-12 ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-gray-800 placeholder-gray-400'} focus:outline-none focus:border-cyan-500/50 transition-colors font-light`}
              />

              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className={`absolute right-4 p-1 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-400 hover:text-cyan-600'}`}
                >
                  <X size={18} />
                </button>
              )}

              {/* Animated Dropdown */}
              <AnimatePresence>
                {showDropdown && suggestions.length > 0 && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl border ${isDarkMode ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}
                  >
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={suggestion.id}
                          onClick={() => { setSearchQuery(suggestion.title); setShowDropdown(false); }}
                          className={`w-full text-left px-4 py-3 border-b flex items-center gap-3 transition-colors ${
                            isDarkMode 
                              ? 'border-white/5 hover:bg-white/5 text-white' 
                              : 'border-gray-100 hover:bg-gray-50 text-gray-800'
                          } ${selectedIndex === idx 
                              ? (isDarkMode ? `border-l-4 border-l-cyan-500 bg-cyan-900/20` : 'border-l-4 border-l-cyan-500 bg-cyan-50') 
                              : ''}`}
                        >
                          <BookOpen size={16} className={isDarkMode ? 'text-cyan-500' : 'text-cyan-600'} />
                          <div className="flex-1 truncate">
                            <p className="font-semibold text-sm truncate">{suggestion.title}</p>
                            <p className={`text-xs font-mono truncate ${isDarkMode ? 'text-cyan-500/60' : 'text-slate-500'}`}>
                              {suggestion.category}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick Link Token */}
            <div className="w-full md:w-auto flex justify-center">
               <Link to="/science-quest" className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}>
                  <BookOpen size={16} /> Open The 4W's of science
               </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10 min-h-[400px]">
          <div className="mb-6 flex justify-between items-center">
             <div className={`text-xs font-mono tracking-widest uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
               Showing {filteredArticles.length} Results
             </div>
          </div>

          <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => {
                  const wordCount = JSON.stringify(article.content).split(' ').length;
                  const readTime = Math.max(1, Math.ceil(wordCount / 200));

                  return (
                    <m.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    >
                      <m.div 
                        onClick={() => setPreviewArticle(article)}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={`h-full cursor-pointer ${cardBgClass} backdrop-blur-xl border ${cardBorderClass} rounded-[2rem] p-6 flex flex-col group relative overflow-hidden`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/${isDarkMode ? '10' : '5'} group-hover:to-purple-500/${isDarkMode ? '10' : '5'} transition-colors duration-500 pointer-events-none`} />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${cardBorderClass} ${isDarkMode ? 'text-cyan-400 bg-cyan-950/50' : 'text-cyan-700 bg-cyan-50'}`}>
                            {article.category}
                          </span>
                          <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            T_READ: {readTime}M
                          </span>
                        </div>

                        <h3 className={`text-xl font-black mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 relative z-10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {article.title}
                        </h3>
                        <p className={`text-sm mb-6 line-clamp-3 font-light relative z-10 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          {article.description}
                        </p>

                        <div className="mt-auto relative z-10 flex items-center justify-between font-bold text-sm transition-colors">
                           <span className={isDarkMode ? 'text-slate-500 group-hover:text-white transition-colors' : 'text-slate-400 group-hover:text-gray-900 transition-colors'}>Start Reading</span>
                           <ChevronRight size={18} className={`transform group-hover:translate-x-1 transition-transform ${isDarkMode ? 'text-cyan-500' : 'text-cyan-600'}`} />
                        </div>
                      </m.div>
                    </m.div>
                  );
                })
              ) : (
                <div className="col-span-full py-24 text-center">
                  <div className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mb-4 flex justify-center`}><Search size={48} /></div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No Documents Found</h3>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Adjust your query parameters to find matching literature.</p>
                </div>
              )}
            </AnimatePresence>
          </m.div>
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {previewArticle && (
            <m.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
              onClick={() => setPreviewArticle(null)}
            >
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`w-full max-w-2xl rounded-[2rem] border shadow-2xl relative overflow-hidden ${cardBgClass} backdrop-blur-2xl ${cardBorderClass}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 md:p-10">
                  <div className={`w-full h-1 absolute top-0 left-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500`} />
                  
                  <span className={`text-[10px] font-mono uppercase tracking-widest mb-4 block ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {previewArticle.category} // ID: {previewArticle.id}
                  </span>
                  
                  <h2 className={`text-3xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {previewArticle.title}
                  </h2>
                  <p className={`text-lg leading-relaxed mb-8 font-light ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {previewArticle.description}
                  </p>
                  
                  <div className={`flex gap-4 justify-end border-t pt-6 mt-6 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <button onClick={() => setPreviewArticle(null)} className={`px-6 py-2.5 rounded-xl font-bold transition-colors ${
                      isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-gray-100 hover:text-gray-800'
                    }`}>
                      Abort
                    </button>
                    <Link to={`/articles/${previewArticle.id}`} className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 group ${
                      isDarkMode 
                        ? 'bg-cyan-500 text-[#020617] hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md'
                    }`}>
                      Access Document <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export const ArticleReader = () => {
  const { articleId } = useParams();
  const [currentArticle, setCurrentArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const found = articlesDatabase.find((article) => article.id === articleId);
    if (found) setCurrentArticle(found);
    else setNotFound(true);
  }, [articleId]);

  if (notFound) return <ArticleNotFound />;
  
  if (!currentArticle) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#020617]' : 'bg-gray-50'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  const bgClass = isDarkMode ? 'bg-[#020617]' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-slate-200' : 'text-slate-800';

  return (
    <LazyMotion features={domAnimation}>
      <div className={`min-h-screen relative pb-24 ${bgClass} ${textClass}`}>
        <m.div
          className="fixed top-0 left-0 right-0 h-1.5 origin-left z-50 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          style={{ scaleX }}
        />
        
        <div className="max-w-4xl mx-auto px-6 pt-32 relative z-10">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/articles"
              className={`inline-flex items-center gap-2 text-sm font-bold transition-colors mb-10 px-4 py-2 rounded-full border ${
                isDarkMode 
                  ? 'text-cyan-400 bg-white/5 border-white/10 hover:border-cyan-500/50' 
                  : 'text-cyan-700 bg-white/80 border-gray-200 hover:border-cyan-300'
              }`}
            >
              <ArrowLeft size={16} /> Return to Article Page
            </Link>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <article className={`backdrop-blur-xl border rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden ${
              isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white/90 border-gray-200'
            }`}>
              <header className="mb-12 relative z-10">
                <span className={`inline-block text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full mb-6 border ${
                  isDarkMode ? 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30' : 'text-cyan-800 bg-cyan-100 border-cyan-200'
                }`}>
                  {currentArticle.category}
                </span>
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentArticle.title}
                </h1>
                <div className={`p-6 md:p-8 border-l-4 rounded-r-2xl rounded-l-sm backdrop-blur-md ${
                  isDarkMode ? 'bg-white/5 border-cyan-500' : 'bg-gray-50 border-cyan-400'
                }`}>
                  <p className={`text-xl font-light leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{currentArticle.content?.introduction || 'No introduction available'}"
                  </p>
                </div>
              </header>
              
              <div className="space-y-12 relative z-10">
                {currentArticle.content?.sections?.map((section, idx) => (
                  <m.section
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="group"
                  >
                    <h2 className={`text-2xl font-bold mb-4 flex items-center gap-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <span className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-mono ${
                        isDarkMode ? 'bg-white/5 border-white/10 text-cyan-400' : 'bg-gray-50 border-gray-200 text-cyan-600'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {section.heading}
                    </h2>
                    <p className={`text-lg leading-relaxed pl-14 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {section.text}
                    </p>
                  </m.section>
                ))}
              </div>
            </article>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
};