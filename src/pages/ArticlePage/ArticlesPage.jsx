// pages/ArticlePage/ArticlesPage.jsx
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { articlesDatabase, filterArticles } from './ArticleData';
import { useTheme } from '../../ThemeProvider';
import { useArticleStore } from './articleStore';

// Lazy load the 3D background
const ScientificBackground = React.lazy(() => import('./ScientificBackground'));

// --- Typewriter Placeholder Hook ---
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
  const shouldReduceMotion = useReducedMotion();
  const placeholderText = useTypewriterPlaceholder([
    "Search molecules...", "Find reactions...", "Explore cells...", "Query physics laws..."
  ]);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Zustand State
  const { 
    searchQuery, setSearchQuery, previewArticle, setPreviewArticle,
    showDropdown, setShowDropdown, suggestions, selectedIndex, setSelectedIndex
  } = useArticleStore();

  const filteredArticles = useMemo(() => filterArticles(articlesDatabase, searchQuery), [searchQuery]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  // Keyboard Navigation
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

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className={`min-h-screen transition-colors duration-500 overflow-hidden relative ${isDarkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-800'}`}
    >
      {/* Dynamic 3D Background */}
      <Suspense fallback={null}>
        <ScientificBackground isDarkMode={isDarkMode} />
      </Suspense>

      {/* CSS Lens Flare tracking the top left */}
      <div className={`absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none z-0 ${isDarkMode ? 'bg-cyan-900/20' : 'bg-blue-200/40'}`} style={{ transform: 'translate(-30%, -30%)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-12 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-6 uppercase tracking-wide backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-cyan-500/30 text-cyan-300' : 'bg-white/60 border-cyan-400/40 text-cyan-700'}`}>
            <Activity size={16} /> Laboratory & Library
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-xl">
            Scientific <span className={`bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-600 to-blue-700'} bg-clip-text text-transparent`}>Modules</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl drop-shadow-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore comprehensive curriculum guides, theories, and laboratory protocols.
          </p>
        </header>

        {/* Search Architecture */}
        <div className="relative max-w-2xl mb-12 mx-auto md:mx-0 group" ref={dropdownRef}>
          <div className={`relative flex items-center backdrop-blur-xl border rounded-[2rem] p-3 shadow-2xl transition-all ${isDarkMode ? 'bg-white/5 border-white/20 shadow-cyan-900/20' : 'bg-white border-gray-200 shadow-gray-300/30'}`}>
            <Search className={`ml-3 mr-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={24} />
            <AnimatePresence mode="wait">
              <motion.input
                ref={searchInputRef}
                type="text"
                key={placeholderText} // Forces re-render for placeholder typing effect
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} exit={{ opacity: 0.5 }}
                className={`w-full bg-transparent border-none text-lg px-2 py-3 focus:outline-none font-light tracking-wide ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-500'}`}
              />
            </AnimatePresence>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`p-2 rounded-full mr-2 transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400' : 'bg-gray-100 hover:bg-red-100 text-slate-500 hover:text-red-500'}`}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Animated Dropdown */}
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl border ${isDarkMode ? 'bg-[#0f172a]/95 border-white/20 shadow-cyan-900/30' : 'bg-white/95 border-gray-200 shadow-xl'}`}
              >
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={suggestion.id}
                      onClick={() => { setSearchQuery(suggestion.title); setShowDropdown(false); }}
                      className={`w-full text-left px-4 py-3 border-b flex items-center gap-3 transition-colors ${isDarkMode ? 'border-white/5 hover:bg-white/10 text-white' : 'border-gray-100 hover:bg-gray-50 text-slate-800'} ${selectedIndex === idx ? (isDarkMode ? 'bg-cyan-500/20 border-l-4 border-l-cyan-400' : 'bg-cyan-50 border-l-4 border-l-cyan-500') : ''}`}
                    >
                      <BookOpen size={16} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm truncate">{suggestion.title}</p>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{suggestion.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Counter Animation */}
        <div className={`mb-6 text-sm font-semibold tracking-wider uppercase ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
          Showing{' '}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={filteredArticles.length}
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="inline-block mx-1 font-black text-lg"
            >
              {filteredArticles.length}
            </motion.span>
          </AnimatePresence>
          {' '}Protocols
        </div>

        {/* Lightweight Grid */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden" animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => {
              // Estimate reading time based on content length (assuming ~200 words per minute)
              const wordCount = JSON.stringify(article.content).split(' ').length;
              const readTime = Math.max(1, Math.ceil(wordCount / 200));

              return (
                <motion.div
                  key={article.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  onClick={() => setPreviewArticle(article)}
                  className="cursor-pointer h-full"
                >
                  {/* Replaced Framer Motion hover scale with CSS transform for performance */}
                  <div className={`h-full p-8 rounded-3xl border flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-2 group ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]' : 'bg-white border-gray-200 hover:border-cyan-400/70 hover:shadow-xl'}`}>
                    
                    <div className="flex justify-between items-start mb-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${isDarkMode ? 'text-cyan-300 bg-cyan-900/40 border-cyan-400/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-200'}`}>
                        {article.category}
                      </span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        ⏱ {readTime} min read
                      </span>
                    </div>

                    <h3 className={`font-bold text-2xl group-hover:text-cyan-500 transition-colors mb-3 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {article.title}
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-3 mb-8 font-light ${isDarkMode ? 'text-slate-400/90' : 'text-slate-600'}`}>
                      {article.description}
                    </p>
                    
                    <div className={`mt-auto flex items-center justify-between font-semibold text-sm transition-colors ${isDarkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-600 group-hover:text-cyan-700'}`}>
                      <span>Analyze Module</span>
                      <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center">
              <Search className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No Data Found</h3>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Try adjusting your search parameters.</p>
            </div>
          )}
        </motion.div>

        {/* Lightweight Preview Modal */}
        <AnimatePresence>
          {previewArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewArticle(null)}>
              <motion.div
                initial={!shouldReduceMotion ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 0 }}
                animate={!shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1 }}
                exit={!shouldReduceMotion ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-full max-w-2xl rounded-3xl border shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 md:p-10">
                  <span className={`text-xs font-black uppercase tracking-widest mb-3 block ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {previewArticle.category}
                  </span>
                  <h2 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {previewArticle.title}
                  </h2>
                  <p className={`text-lg leading-relaxed mb-8 font-light ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {previewArticle.description}
                  </p>
                  
                  <div className="flex gap-4 justify-end border-t pt-6 mt-6 border-slate-500/20">
                    <button onClick={() => setPreviewArticle(null)} className={`px-6 py-2.5 rounded-xl font-bold transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-800'}`}>
                      Close
                    </button>
                    <Link to={`/articles/${previewArticle.id}`} className={`px-8 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group ${isDarkMode ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>
                      Access Protocol <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
// --- ARTICLE READER (unchanged) ---
export const ArticleReader = () => {
  const { articleId } = useParams();
  const [currentArticle, setCurrentArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const found = articlesDatabase.find((article) => article.id === articleId);
    if (found) setCurrentArticle(found);
    else setNotFound(true);
  }, [articleId]);

  if (notFound) return <ArticleNotFound />;
  if (!currentArticle)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#020617] text-slate-200 relative pb-24">
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 origin-left z-50"
          style={{ scaleX }}
        />
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10">
          <FadeIn>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors mb-10 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-cyan-500/30"
            >
              <ArrowLeft size={16} /> Back to Library
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <article className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <BookOpen size={200} />
              </div>
              <header className="mb-12 relative z-10">
                <span className="inline-block text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-4 py-2 rounded-full mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  {currentArticle.category}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
                  {currentArticle.title}
                </h1>
                <div className="p-6 md:p-8 bg-white/5 border-l-4 border-cyan-500 rounded-r-2xl rounded-l-sm backdrop-blur-md">
                  <p className="text-xl text-slate-300 font-light leading-relaxed italic">
                    "{currentArticle.content?.introduction || 'No introduction available'}"
                  </p>
                </div>
              </header>
              <div className="space-y-12 relative z-10">
                {currentArticle.content?.sections?.map((section, idx) => (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="group"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 text-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {section.heading}
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed pl-14">{section.text}</p>
                  </motion.section>
                ))}
              </div>
            </article>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
};