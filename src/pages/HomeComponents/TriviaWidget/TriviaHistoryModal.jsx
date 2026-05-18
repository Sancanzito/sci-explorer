// TriviaWidget/TriviaHistoryModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, backdropVariants } from './TriviaWidgetAnimations';

const TriviaHistoryModal = ({ isOpen, onClose, history }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trivia Journey</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                   <span className="text-gray-500">✕</span>
                </button>
              </div>

              {/* SCROLLABLE CONTAINER */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No history yet. Start playing!</p>
                ) : (
                  history.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.question}</p>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.date}</span>
                      </div>
                      <div className={item.isCorrect ? "text-green-500" : "text-red-500 font-bold"}>
                        {item.isCorrect ? "✓" : "✗"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/80 p-4 text-center">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
              >
                Close History
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Inline style for the custom scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dbdce0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a855f7;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default TriviaHistoryModal;