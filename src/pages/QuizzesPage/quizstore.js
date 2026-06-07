// store/quizStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuizStore = create(
  persist(
    (set, get) => ({
      activeQuiz: null,
      score: 0,
      currentQuestion: 0,
      selectedAnswer: null,
      showResult: false,
      quizAnswers: [],

      startQuiz: (quizId) => set({
        activeQuiz: quizId,
        score: 0,
        currentQuestion: 0,
        selectedAnswer: null,
        showResult: false,
        quizAnswers: []
      }),

      submitAnswer: (answerIndex, isCorrect, currentQ, totalQuestions) => {
        set((state) => {
          const newAnswers = [...state.quizAnswers];
          newAnswers[state.currentQuestion] = {
            question: currentQ.text,
            selected: answerIndex,
            correct: currentQ.correct,
            isCorrect: isCorrect,
            explanation: currentQ.explanation
          };
          return {
            selectedAnswer: answerIndex,
            quizAnswers: newAnswers,
            score: isCorrect ? state.score + 10 : state.score
          };
        });

        // Delay moving to the next question to show answer feedback
        setTimeout(() => {
          set((state) => {
            if (state.currentQuestion + 1 < totalQuestions) {
              return { currentQuestion: state.currentQuestion + 1, selectedAnswer: null };
            } else {
              return { showResult: true };
            }
          });
        }, 1500);
      },

      resetQuiz: () => set({
        activeQuiz: null,
        score: 0,
        currentQuestion: 0,
        selectedAnswer: null,
        showResult: false,
        quizAnswers: []
      })
    }),
    {
      name: 'science-quiz-storage',
      // Selective persistence: Only save ID and Score to save performance
      partialize: (state) => ({ activeQuiz: state.activeQuiz, score: state.score }),
    }
  )
);