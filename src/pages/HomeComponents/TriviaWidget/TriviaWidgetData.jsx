import { useState, useEffect, useCallback } from 'react';
import { format, isYesterday, isToday, parseISO } from 'date-fns';

const TRIVIA_QUESTIONS = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Astronomy",
    icon: "🚀",
    gradient: "from-orange-500/10 to-red-500/10",
    fact: "Mars appears red because of iron oxide (rust) on its surface."
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    correct: 2,
    category: "Science",
    icon: "💎",
    gradient: "from-blue-500/10 to-cyan-500/10",
    fact: "Diamonds are made of pure carbon in an extremely hard crystal structure."
  }
];

export const useTriviaData = () => {
  const [state, setState] = useState({
    currentTrivia: null,
    selectedAnswer: null,
    showResult: false,
    streak: 0,
    lastAnsweredDate: null,
    lastStreakUpdate: null, 
    history: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('triviaWidget');
    const todayIndex = new Date().getDate() % TRIVIA_QUESTIONS.length;
    const currentQuestion = TRIVIA_QUESTIONS[todayIndex];
    
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // STREAK RESET LOGIC: 
      // If the last update wasn't today AND wasn't yesterday, the streak is broken.
      let currentStreak = parsed.streak || 0;
      if (parsed.lastStreakUpdate) {
        const lastDate = parseISO(parsed.lastStreakUpdate);
        if (!isToday(lastDate) && !isYesterday(lastDate)) {
          currentStreak = 0; // Reset to zero if a day was missed
        }
      }

      setState(prev => ({ 
        ...prev, 
        ...parsed,
        streak: currentStreak,
        currentTrivia: currentQuestion,
        showResult: false 
      }));
    } else {
      setState(prev => ({ ...prev, currentTrivia: currentQuestion }));
    }
  }, []);

  const handleAnswer = useCallback((answerIndex) => {
    // Only block if they already answered AND it's still marked as "answered" in state
    if (state.lastAnsweredDate && isToday(parseISO(state.lastAnsweredDate))) return;
    
    const isCorrect = answerIndex === state.currentTrivia?.correct;
    const now = new Date();
    const nowISO = now.toISOString();
    const todayLabel = format(now, 'MMM dd');
    
    let newStreak = state.streak;
    let newLastStreakUpdate = state.lastStreakUpdate;

    // 1. STREAK LOCK: Only increment if they haven't earned a point yet TODAY
    if (isCorrect) {
      const lastUpdate = state.lastStreakUpdate ? parseISO(state.lastStreakUpdate) : null;
      if (!lastUpdate || isYesterday(lastUpdate)) {
        newStreak += 1;
        newLastStreakUpdate = nowISO;
      }
    } else {
      newStreak = 0; // Wrong answer always resets streak
      newLastStreakUpdate = nowISO;
    }

    // 2. PREVENT NESTING: Check if today's entry already exists in history
    let updatedHistory = [...state.history];
    const existingEntryIndex = updatedHistory.findIndex(entry => entry.date === todayLabel);

    const newEntry = {
      question: state.currentTrivia.question,
      icon: state.currentTrivia.icon,
      isCorrect: isCorrect,
      date: todayLabel
    };

    if (existingEntryIndex !== -1) {
      // Update existing entry instead of nesting/adding a new one
      updatedHistory[existingEntryIndex] = newEntry;
    } else {
      // Add new entry for a new day
      updatedHistory = [newEntry, ...updatedHistory];
    }

    const updatedState = {
      ...state,
      selectedAnswer: answerIndex,
      showResult: true,
      streak: newStreak,
      lastAnsweredDate: nowISO,
      lastStreakUpdate: newLastStreakUpdate,
      history: updatedHistory
    };

    setState(updatedState);
    localStorage.setItem('triviaWidget', JSON.stringify(updatedState));
    setTimeout(() => setState(prev => ({ ...prev, showResult: false })), 4000);
  }, [state]);

  const resetToday = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, selectedAnswer: null, lastAnsweredDate: null };
      localStorage.setItem('triviaWidget', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Use parseISO to ensure date strings are handled correctly
  const hasAnsweredToday = () => state.lastAnsweredDate && isToday(parseISO(state.lastAnsweredDate));

  return { state, handleAnswer, hasAnsweredToday, resetToday };
};