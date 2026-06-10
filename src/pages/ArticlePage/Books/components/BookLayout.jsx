import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Menu,
  Bookmark,
  Search,
  List,
  Map,
  Trophy
} from 'lucide-react';

export function BookLayout({ children, prevPage, nextPage }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // null for closed, or string for modal type

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  // Modal content placeholders
  const renderModalContent = () => {
    switch (modal) {
      case 'table-of-contents':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
            <div className="space-y-4">
              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold mb-2">WHY Questions</h4>
                <p className="text-sm">Understanding Causes and Explanations (25 Articles)</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold mb-2">WHEN Questions</h4>
                <p className="text-sm">Exploring Science Through Time (25 Articles)</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold mb-2">WHERE Questions</h4>
                <p className="text-sm">Discovering Locations and Origins (25 Articles)</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold mb-2">WHAT Questions</h4>
                <p className="text-sm">Understanding Scientific Concepts and Objects (25 Articles)</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Click on any section in the Table of Contents button above to navigate directly to that chapter.
            </p>
          </div>
        );
      case 'bookmarks':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Bookmarks</h3>
            <p className="mb-4">This is a placeholder for the Bookmarks modal.</p>
            <p>Here you would see your saved bookmarks for quick access.</p>
          </div>
        );
      case 'search':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Search</h3>
            <p className="mb-4">This is a placeholder for the Search modal.</p>
            <p>Enter keywords to find any topic in the book.</p>
          </div>
        );
      case 'quizzes':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Quizzes</h3>
            <p className="mb-4">This is a placeholder for the Quizzes modal.</p>
            <p>Test your knowledge with interactive quizzes from each section.</p>
          </div>
        );
      case 'explore':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <p className="mb-4">This is a placeholder for the Explore modal.</p>
            <p>Discover related topics and dive deeper into subjects that interest you.</p>
          </div>
        );
      case 'achievements':
        return (
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Achievements</h3>
            <p className="mb-4">This is a placeholder for the Achievements modal.</p>
            <p>Collect badges as you learn and explore the Science Quest book.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="min-h-screen w-full relative">
        <div className="absolute inset-0 z-0 fixed">
          <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 ${isDarkMode ? 'dark:bg-gradient-to-br from-gray-900/30 to-gray-800/30' : ''}`} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto pb-24">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              {/* Table of Contents Button */}
              <button 
                onClick={() => openModal('table-of-contents')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <Menu size={20} />
                <span className="text-xs">Contents</span>
              </button>
              
              {/* Bookmarks Button */}
              <button 
                onClick={() => openModal('bookmarks')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <Bookmark size={20} />
                <span className="text-xs">Bookmarks</span>
              </button>
              
              {/* Search Button */}
              <button 
                onClick={() => openModal('search')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <Search size={20} />
                <span className="text-xs">Search</span>
              </button>
            </div>
            
            <div className="flex gap-3">
              {/* Quizzes Button */}
              <button 
                onClick={() => openModal('quizzes')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <List size={20} />
                <span className="text-xs">Quizzes</span>
              </button>
              
              {/* Explore Button */}
              <button 
                onClick={() => openModal('explore')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <Map size={20} />
                <span className="text-xs">Explore</span>
              </button>
              
              {/* Achievements Button */}
              <button 
                onClick={() => openModal('achievements')}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md text-white border border-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                <Trophy size={20} />
                <span className="text-xs">Achievements</span>
              </button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>

        {/* --- BOOK NAVIGATION ARROWS --- */}
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center gap-8 px-4 pointer-events-none">
          <div className="w-full max-w-4xl flex justify-between pointer-events-auto">
            {prevPage ? (
              <button 
                onClick={() => navigate(prevPage)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 transition-all shadow-lg"
              >
                <ChevronLeft size={24} /> Previous
              </button>
            ) : <div />}

            {nextPage ? (
              <button 
                onClick={() => navigate(nextPage)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 transition-all shadow-lg"
              >
                Next <ChevronRight size={24} />
              </button>
            ) : <div />}
          </div>
        </div>
        
        {/* Modal Backdrop and Content */}
        {modal && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={closeModal} />
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/70 rounded-2xl p-6 max-w-2xl w-full backdrop-blur-md border border-white/20 shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">{modal === 'table-of-contents' ? 'Table of Contents' : 
                                 modal === 'bookmarks' ? 'Bookmarks' :
                                 modal === 'search' ? 'Search' :
                                 modal === 'quizzes' ? 'Quizzes' :
                                 modal === 'explore' ? 'Explore' :
                                 modal === 'achievements' ? 'Achievements' : ''}</h2>
                  <button 
                    onClick={closeModal}
                    className="text-white/50 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
                {renderModalContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}