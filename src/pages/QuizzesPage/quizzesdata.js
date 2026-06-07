// data/QuizzesData.js
export const CATEGORIES = ["All", "Biology", "Chemistry", "Physics", "Interactive"];

export const quizzes = [
  { 
    id: 1, 
    title: '🔬 Microscope Assembly Game', 
    category: 'Interactive',
    description: 'Interactive drag-and-drop game to learn microscope parts!',
    fact: 'Did you know? Electron microscopes can magnify objects up to 50 million times!',
    questions: 13, 
    difficulty: 'Interactive',
    type: 'game',
    icon: '🔬',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 2, 
    title: '🧬 Biology Basics', 
    category: 'Biology',
    description: 'Test your knowledge of cells, tissues, and basic biology concepts.',
    fact: 'The human body contains approximately 30 trillion cells!',
    questions: 5, 
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
    category: 'Chemistry',
    description: 'Explore atoms, molecules, and chemical reactions.',
    fact: 'Glass is an amorphous solid—meaning its molecules are disorganized like a liquid, but frozen in place!',
    questions: 4, 
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
    category: 'Physics',
    description: 'Test your understanding of motion, forces, and energy.',
    fact: 'If you were to fall into a black hole, you would undergo a process famously called "spaghettification".',
    questions: 3, 
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