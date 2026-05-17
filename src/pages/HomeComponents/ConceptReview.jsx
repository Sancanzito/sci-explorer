// pages/HomePage/components/ConceptReview.jsx
import { motion, AnimatePresence } from 'framer-motion';  // ← Add AnimatePresence here
import React, { useState } from 'react';

const ConceptReview = () => {
  const [mode, setMode] = useState('flashcards');
  const [flipped, setFlipped] = useState(false);
  
  const flashcards = [
    { front: "What is CRISPR?", back: "A gene-editing technology that allows scientists to modify DNA sequences" },
    { front: "Define: Phenotype", back: "The observable characteristics of an organism resulting from genotype and environment" },
    { front: "What does DNA stand for?", back: "Deoxyribonucleic Acid" }
  ];
  
  const [currentCard, setCurrentCard] = useState(0);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xl">🎯</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Concept Review Arena</h3>
        </div>
        
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-2 py-1 rounded ${mode === 'flashcards' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setMode('vocab')}
            className={`px-2 py-1 rounded ${mode === 'vocab' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Vocabulary
          </button>
        </div>
      </div>
      
      {mode === 'flashcards' && (
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setFlipped(!flipped)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer min-h-[180px] flex items-center justify-center shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={flipped ? 'back' : 'front'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-800 dark:text-white"
              >
                {flipped ? flashcards[currentCard].back : flashcards[currentCard].front}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
                setFlipped(false);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-500">{currentCard + 1}/{flashcards.length}</span>
            <button
              onClick={() => {
                setCurrentCard((prev) => (prev + 1) % flashcards.length);
                setFlipped(false);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {mode === 'vocab' && (
        <div className="space-y-2">
          {[
            { term: "Genotype", def: "The genetic makeup of an organism" },
            { term: "Allele", def: "Variant form of a gene" },
            { term: "Homozygous", def: "Having two identical alleles" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <span className="font-semibold text-sm">{item.term}</span>
              <span className="text-xs text-gray-500 ml-2">— {item.def}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ConceptReview;