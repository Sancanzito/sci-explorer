import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTriviaData } from './TriviaWidgetData';
import { containerVariants } from './TriviaWidgetAnimations';
import TriviaQuestion from './TriviaQuestion';
import TriviaOptions from './TriviaOptions';
import TriviaResult from './TriviaResult';
import TriviaStreak from './TriviaStreak';
import TriviaHistoryModal from './TriviaHistoryModal';
import { format } from 'date-fns';

const TriviaWidget = () => {
  const { state, handleAnswer, hasAnsweredToday, resetToday } = useTriviaData();
  const { currentTrivia, selectedAnswer, showResult, streak, history } = state;
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const isCorrect = selectedAnswer === currentTrivia?.correct;
  const answeredToday = hasAnsweredToday();

  return (
    <>
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className={`h-full bg-gradient-to-br ${currentTrivia?.gradient || 'from-purple-500/10 to-pink-500/10'} rounded-3xl p-6 border border-purple-500/20 shadow-xl relative min-h-[500px] flex flex-col`}
      >
        {/* HEADER: Flex container prevents Date and Streak from overlapping */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl shadow-inner">
              {currentTrivia?.icon || '🧠'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-sm">Daily Science</h3>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-tighter">
                {format(new Date(), 'EEEE, MMM do')}
              </p>
            </div>
          </div>
          <TriviaStreak streak={streak} hasAnsweredToday={answeredToday} />
        </div>

        <div className="flex-1 flex flex-col">
          {answeredToday && !showResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="text-5xl mb-4">🌟</div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Knowledge Secured!</h4>
                <p className="text-gray-500 text-sm mb-6">Mastered for today.</p>
                <button onClick={resetToday} className="px-6 py-2 bg-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
                  🔄 Play Again
                </button>
              </motion.div>
            </div>
          ) : (
            <>
              <TriviaQuestion question={currentTrivia?.question} category={currentTrivia?.category} icon={currentTrivia?.icon} />
              <TriviaOptions options={currentTrivia?.options || []} correctIndex={currentTrivia?.correct} selectedAnswer={selectedAnswer} showResult={showResult} onAnswer={handleAnswer} />
              <TriviaResult showResult={showResult} isCorrect={isCorrect} fact={currentTrivia?.fact} correctAnswer={currentTrivia?.options[currentTrivia?.correct]} />
            </>
          )}
        </div>

        <button onClick={() => setIsHistoryOpen(true)} className="mt-4 py-2 px-4 bg-white/50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 border border-white/20 transition-all">
          📜 View Past Trivia
        </button>
      </motion.div>
      <TriviaHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} />
    </>
  );
};

export default TriviaWidget;