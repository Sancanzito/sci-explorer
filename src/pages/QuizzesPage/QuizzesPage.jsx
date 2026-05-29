import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MicroscopeGame from '../../quiz/microscope/MicroscopeGame';

const QuizzesPage = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  
  // Quiz data with educational microscope content
  const quizzes = [
    { 
      id: 1, 
      title: '🔬 Microscope Assembly Game', 
      description: 'Interactive drag-and-drop game to learn microscope parts!',
      questions: 13, 
      difficulty: 'Interactive',
      type: 'game',
      icon: '🎮',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 2, 
      title: '🧬 Biology Basics', 
      description: 'Test your knowledge of cells, tissues, and basic biology concepts.',
      questions: 10, 
      difficulty: 'Medium',
      type: 'quiz',
      icon: '🧬',
      color: 'from-green-500 to-teal-500',
      questionsList: [
        {
          text: "What is the basic unit of life?",
          options: ["Atom", "Molecule", "Cell", "Tissue"],
          correct: 2,
          explanation: "The cell is the basic structural and functional unit of all living organisms."
        },
        {
          text: "Which organelle is known as the 'powerhouse of the cell'?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
          correct: 1,
          explanation: "Mitochondria generate most of the cell's supply of ATP, used as a source of chemical energy."
        },
        {
          text: "What is the function of the nucleus?",
          options: ["Energy production", "Protein synthesis", "Store genetic material", "Waste disposal"],
          correct: 2,
          explanation: "The nucleus contains the cell's DNA and controls cellular activities."
        },
        {
          text: "Which organelle performs photosynthesis?",
          options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"],
          correct: 2,
          explanation: "Chloroplasts contain chlorophyll and convert light energy into chemical energy."
        },
        {
          text: "What is the main function of ribosomes?",
          options: ["Lipid synthesis", "Protein synthesis", "DNA replication", "Energy storage"],
          correct: 1,
          explanation: "Ribosomes synthesize proteins by translating messenger RNA."
        }
      ]
    },
    { 
      id: 3, 
      title: '⚛️ Chemistry Fundamentals', 
      description: 'Explore atoms, molecules, and chemical reactions.',
      questions: 8, 
      difficulty: 'Hard',
      type: 'quiz',
      icon: '⚛️',
      color: 'from-blue-500 to-indigo-500',
      questionsList: [
        {
          text: "What is the atomic number of Carbon?",
          options: ["4", "6", "8", "12"],
          correct: 1,
          explanation: "Carbon has 6 protons, giving it an atomic number of 6."
        },
        {
          text: "Which element has the symbol 'Na'?",
          options: ["Nickel", "Neon", "Sodium", "Nitrogen"],
          correct: 2,
          explanation: "Na comes from the Latin word 'Natrium' for Sodium."
        },
        {
          text: "What type of bond involves sharing electrons?",
          options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
          correct: 1,
          explanation: "Covalent bonds form when atoms share electron pairs."
        },
        {
          text: "What is pH of pure water?",
          options: ["0", "7", "10", "14"],
          correct: 1,
          explanation: "Pure water has a neutral pH of 7."
        }
      ]
    },
    { 
      id: 4, 
      title: '🔧 Physics in Action', 
      description: 'Test your understanding of motion, forces, and energy.',
      questions: 12, 
      difficulty: 'Easy',
      type: 'quiz',
      icon: '🔧',
      color: 'from-orange-500 to-red-500',
      questionsList: [
        {
          text: "What is Newton's First Law also known as?",
          options: ["Law of Acceleration", "Law of Inertia", "Action-Reaction", "Gravity Law"],
          correct: 1,
          explanation: "Objects maintain their state of motion unless acted upon by an external force."
        },
        {
          text: "What is the unit of force?",
          options: ["Joule", "Watt", "Newton", "Pascal"],
          correct: 2,
          explanation: "The Newton (N) measures force - 1N = 1 kg⋅m/s²"
        },
        {
          text: "What is the formula for speed?",
          options: ["Distance × Time", "Distance / Time", "Time / Distance", "Mass × Acceleration"],
          correct: 1,
          explanation: "Speed = Distance traveled divided by time taken."
        }
      ]
    }
  ];

  const startQuiz = (quizId) => {
    setActiveQuiz(quizId);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizAnswers([]);
  };

  const handleAnswer = (answerIndex) => {
    const quiz = quizzes.find(q => q.id === activeQuiz);
    const currentQ = quiz.questionsList[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    
    setSelectedAnswer(answerIndex);
    
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = {
      question: currentQ.text,
      selected: answerIndex,
      correct: currentQ.correct,
      isCorrect: isCorrect,
      explanation: currentQ.explanation
    };
    setQuizAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < quiz.questionsList.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizAnswers([]);
  };

  const activeQuizData = quizzes.find(q => q.id === activeQuiz);
  const isGameQuiz = activeQuizData?.type === 'game';

  // Render Microscope Game
  if (activeQuiz && isGameQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="relative">
          <button
            onClick={resetQuiz}
            className="fixed top-20 left-4 z-50 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Quizzes</span>
          </button>
          <MicroscopeGame />
        </div>
      </motion.div>
    );
  }

  // Render Quiz Result
  if (showResult && activeQuizData) {
    const totalQuestions = activeQuizData.questionsList.length;
    const maxScore = totalQuestions * 10;
    const percentage = (score / maxScore) * 100;
    const correctAnswers = quizAnswers.filter(a => a.isCorrect).length;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${activeQuizData.color} p-8 text-white`}>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete! 🎉</h1>
            <p className="text-white/90">{activeQuizData.title}</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
              </div>
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{Math.round(percentage)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-lg mb-4">Detailed Results:</h3>
              {quizAnswers.map((answer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect 
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{answer.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your answer: {activeQuizData.questionsList[idx].options[answer.selected]}
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct: {activeQuizData.questionsList[idx].options[answer.correct]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {answer.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={resetQuiz}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Try Different Quiz
              </button>
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Retake This Quiz
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Active Quiz Questions
  if (activeQuiz && activeQuizData && !isGameQuiz) {
    const currentQ = activeQuizData.questionsList[currentQuestion];
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="max-w-3xl mx-auto px-6 py-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${activeQuizData.color} p-6 text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{activeQuizData.title}</h2>
                <p className="text-white/80">Question {currentQuestion + 1} of {activeQuizData.questionsList.length}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm text-white/80">Score</div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                {currentQ.text}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !selectedAnswer && handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === null
                        ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : selectedAnswer === idx
                          ? idx === currentQ.correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : idx === currentQ.correct && selectedAnswer !== null
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-gray-800 dark:text-white">{option}</span>
                      {selectedAnswer !== null && idx === currentQ.correct && (
                        <span className="ml-auto text-green-500">✓</span>
                      )}
                      {selectedAnswer === idx && idx !== currentQ.correct && (
                        <span className="ml-auto text-red-500">✗</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Quiz Selection Screen
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Interactive Learning Quizzes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Choose a quiz or play the interactive microscope assembly game!
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer"
            onClick={() => startQuiz(quiz.id)}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className={`bg-gradient-to-r ${quiz.color} p-6 text-white`}>
                <div className="text-5xl mb-3">{quiz.icon}</div>
                <h3 className="text-xl font-bold mb-1">{quiz.title}</h3>
                <p className="text-white/80 text-sm">{quiz.description}</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      📊 {quiz.questions} {quiz.type === 'game' ? 'parts' : 'questions'}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  {quiz.type === 'game' ? '🎮 Play Game' : '📝 Start Quiz'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Educational Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Learning Tips
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span>🎮</span>
            <span>Start with the Microscope Game to learn part names visually</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>📚</span>
            <span>Take notes while playing to reinforce memory</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔄</span>
            <span>Repeat quizzes to improve your score and retention</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizzesPage;