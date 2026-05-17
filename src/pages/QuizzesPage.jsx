// pages/QuizzesPage.jsx
import React, { useState } from 'react';

const QuizzesPage = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(0);
  
  // Example quiz data
  const quizzes = [
    { id: 1, title: 'Biology Quiz', questions: 10, difficulty: 'Medium' },
    { id: 2, title: 'Chemistry Quiz', questions: 8, difficulty: 'Hard' },
    { id: 3, title: 'Physics Quiz', questions: 12, difficulty: 'Easy' },
  ];

  const startQuiz = (quizId) => {
    setActiveQuiz(quizId);
    setScore(0);
    console.log(`Starting quiz ${quizId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-800 pb-4">
        Self-Assessment
      </h1>
      
      {!activeQuiz ? (
        // Quiz selection screen
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="p-4 border rounded-lg dark:border-gray-700">
              <h3 className="font-semibold text-lg">{quiz.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Questions: {quiz.questions} | Difficulty: {quiz.difficulty}
              </p>
              <button 
                onClick={() => startQuiz(quiz.id)}
                className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-700"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Active quiz screen
        <div className="mt-6 p-6 border rounded-lg dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quiz in Progress</h2>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Exit Quiz
            </button>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Score: {score}
          </p>
          {/* Add your quiz questions here */}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;