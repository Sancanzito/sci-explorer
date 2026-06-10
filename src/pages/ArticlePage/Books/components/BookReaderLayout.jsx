import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Add this line
import { useTheme } from '../../../../ThemeProvider';
import { navigationItems } from '../bookData';
import {
  BookMarked, Search, List, Compass, Trophy, BookOpen, X
} from 'lucide-react';
const sidebarControls = [
  { id: 'bookmarks', icon: BookMarked, label: 'Bookmarks' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'quizzes', icon: List, label: 'Quizzes' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'achievements', icon: Trophy, label: 'Achievements' },
];

const modalPlaceholders = {
  bookmarks: { title: 'Bookmarks', desc: 'Your saved bookmarks will appear here.' },
  search: { title: 'Search', desc: 'Search any topic across the book.' },
  quizzes: { title: 'Quizzes', desc: 'Interactive quizzes to test your knowledge.' },
  explore: { title: 'Explore', desc: 'Discover related topics and dive deeper.' },
  achievements: { title: 'Achievements', desc: 'Badges and milestones you\'ve earned.' },
};

export function BookReaderLayout() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(null);

  const sidebarBg = isDarkMode ? 'bg-gray-800/95' : 'bg-white/95';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const activeBg = 'bg-amber-100/50 dark:bg-amber-900/30';
  const activeText = 'text-amber-700 dark:text-amber-400';
  const hoverBg = isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50';
  const borderColor = isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50';

  const isActive = (route) => {
    if (route === 'cover') {
      return location.pathname === '/science-quest' || location.pathname === '/science-quest/';
    }
    return location.pathname === `/science-quest/${route}` || location.pathname.startsWith(`/science-quest/${route}/`);
  };

return (
    <div className={`flex h-screen min-h-screen ${textColor} relative`}>
      {/* Left Sidebar */}
      <aside className={`w-64 flex-shrink-0 ${sidebarBg} border-r ${borderColor} flex flex-col h-full overflow-hidden backdrop-blur-sm`}>
        {/* Brand */}
        <div className={`p-4 border-b ${borderColor}`}>
          <h1 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" />
            Science Quest
          </h1>
        </div>

        {/* Scrollspy Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${mutedText} px-2 pb-2`}>Navigation</p>
          {navigationItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(`/science-quest${item.route === 'cover' ? '' : `/${item.route}`}`)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(item.route)
                  ? `${activeBg} ${activeText} font-medium`
                  : `${mutedText} ${hoverBg}`
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls Section */}
        <div className={`p-3 border-t ${borderColor}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${mutedText} px-2 pb-2`}>Tools</p>
          <div className="grid grid-cols-2 gap-1">
            {sidebarControls.map((ctrl) => {
              const Icon = ctrl.icon;
              return (
                <button
                  key={ctrl.id}
                  onClick={() => setActiveModal(ctrl.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors ${mutedText} ${hoverBg}`}
                >
                  <Icon size={16} className="text-amber-500" />
                  <span>{ctrl.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-8 py-8">
          
          {/* AnimatePresence wraps the Outlet. The key tells it when to trigger animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Modal */}
      {activeModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className={`${sidebarBg} rounded-xl shadow-xl max-w-md w-full p-6 border ${borderColor} backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {modalPlaceholders[activeModal]?.title}
                </h3>
                <button onClick={() => setActiveModal(null)} className={`${mutedText} hover:text-gray-900 dark:hover:text-gray-100`}>
                  <X size={20} />
                </button>
              </div>
              <p className={mutedText}>
                {modalPlaceholders[activeModal]?.desc}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
