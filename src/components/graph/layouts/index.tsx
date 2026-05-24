// src/components/graph/layouts/index.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-200">
      <div className="container mx-auto p-6">
        <div className="flex gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, isCollapsed, onToggle }) => {
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 360 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-lg"
    >
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <div className={`p-6 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {children}
      </div>
      
      {isCollapsed && (
        <div className="flex flex-col items-center pt-20">
          <div className="text-xs text-gray-500 dark:text-gray-400 writing-mode-vertical">
            Scientific Controls
          </div>
        </div>
      )}
    </motion.aside>
  );
};

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 min-w-0">
      <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-lg">
        {children}
      </div>
    </main>
  );
};

interface AnalyticsPanelProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-6 bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 relative shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
      >
        <X size={14} />
      </button>
      {children}
    </motion.div>
  );
};