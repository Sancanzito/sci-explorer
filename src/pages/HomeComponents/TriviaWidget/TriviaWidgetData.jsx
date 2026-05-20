import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isYesterday, isToday, parseISO, subDays } from 'date-fns';

// 1. HARDCODED DATE DICTIONARY FOR PRECISE DEBUGGING
const TRIVIA_QUESTIONS = {
  // Yesterday's trivia
  "2026-05-19": {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Astronomy",
    icon: "🚀",
    gradient: "from-orange-500/10 to-red-500/10",
    fact: "Mars appears red because of iron oxide (rust) on its surface."
  },
  // Today's trivia
  "2026-05-20": {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    correct: 2,
    category: "Science",
    icon: "💎",
    gradient: "from-blue-500/10 to-cyan-500/10",
    fact: "Diamonds are made of pure carbon in an extremely hard crystal structure."
  },
  "2026-05-21": {
    "question": "What gas do plants absorb from the atmosphere during photosynthesis?",
    "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    "correct": 1,
    "category": "Biology",
    "icon": "🌱",
    "gradient": "from-green-500/10 to-emerald-500/10",
    "fact": "Plants use carbon dioxide, sunlight, and water to make food through photosynthesis."
  },
  "2026-05-22": {
    "question": "What part of the human body contains the smallest bones?",
    "options": ["Ear", "Hand", "Foot", "Spine"],
    "correct": 0,
    "category": "Human Body",
    "icon": "👂",
    "gradient": "from-pink-500/10 to-rose-500/10",
    "fact": "The smallest bones are found in the middle ear and help transmit sound vibrations."
  },
  "2026-05-23": {
    "question": "Which planet has the most moons in the Solar System?",
    "options": ["Earth", "Mars", "Neptune", "Saturn"],
    "correct": 3,
    "category": "Astronomy",
    "icon": "🪐",
    "gradient": "from-yellow-500/10 to-orange-500/10",
    "fact": "Saturn has over 140 confirmed moons."
  },
  "2026-05-24": {
    "question": "What force keeps planets orbiting the Sun?",
    "options": ["Magnetism", "Gravity", "Electricity", "Friction"],
    "correct": 1,
    "category": "Physics",
    "icon": "🌌",
    "gradient": "from-indigo-500/10 to-blue-500/10",
    "fact": "Gravity is the invisible force that attracts objects with mass toward one another."
  },
  "2026-05-25": {
    "question": "Which blood type is known as the universal donor?",
    "options": ["A", "B", "AB Positive", "O Negative"],
    "correct": 3,
    "category": "Medicine",
    "icon": "🩸",
    "gradient": "from-red-500/10 to-pink-500/10",
    "fact": "O negative blood can be safely given to people of all blood types in emergencies."
  },
  "2026-05-26": {
    "question": "What is the largest organ in the human body?",
    "options": ["Skin", "Heart", "Liver", "Lungs"],
    "correct": 0,
    "category": "Human Body",
    "icon": "🧍",
    "gradient": "from-orange-500/10 to-yellow-500/10",
    "fact": "Your skin protects your body and helps regulate temperature."
  },
  "2026-05-27": {
    "question": "Which scientist developed the theory of relativity?",
    "options": ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"],
    "correct": 2,
    "category": "Scientists",
    "icon": "🧠",
    "gradient": "from-violet-500/10 to-purple-500/10",
    "fact": "Einstein's theory of relativity changed how we understand space, time, and gravity."
  },
  "2026-05-28": {
    "question": "What is the boiling point of water at sea level?",
    "options": ["50°C", "75°C", "150°C", "100°C"],
    "correct": 3,
    "category": "Chemistry",
    "icon": "💧",
    "gradient": "from-cyan-500/10 to-blue-500/10",
    "fact": "Water boils at 100°C or 212°F at standard atmospheric pressure."
  },
  "2026-05-29": {
    "question": "Which organ pumps blood throughout the human body?",
    "options": ["Brain", "Heart", "Lungs", "Kidneys"],
    "correct": 1,
    "category": "Biology",
    "icon": "❤️",
    "gradient": "from-red-500/10 to-rose-500/10",
    "fact": "The human heart beats around 100,000 times each day."
  },
  "2026-05-30": {
    "question": "What is the chemical symbol for gold?",
    "options": ["Go", "Au", "Gd", "Ag"],
    "correct": 1,
    "category": "Chemistry",
    "icon": "🥇",
    "gradient": "from-yellow-500/10 to-amber-500/10",
    "fact": "The symbol Au comes from the Latin word 'aurum,' meaning gold."
  },
  "2026-05-31": {
    "question": "Which planet is famous for its giant rings?",
    "options": ["Saturn", "Mercury", "Uranus", "Venus"],
    "correct": 0,
    "category": "Astronomy",
    "icon": "🪐",
    "gradient": "from-amber-500/10 to-orange-500/10",
    "fact": "Saturn’s rings are mostly made of ice and rock particles."
  },
  "2026-06-01": {
    "question": "What type of energy comes from the Sun?",
    "options": ["Nuclear", "Wind", "Solar", "Geothermal"],
    "correct": 2,
    "category": "Energy",
    "icon": "☀️",
    "gradient": "from-yellow-500/10 to-orange-500/10",
    "fact": "Solar energy is renewable and can be converted into electricity using solar panels."
  },
  "2026-06-02": {
    "question": "Which layer of Earth is made of molten rock?",
    "options": ["Crust", "Core", "Mantle", "Atmosphere"],
    "correct": 2,
    "category": "Earth Science",
    "icon": "🌋",
    "gradient": "from-red-500/10 to-orange-500/10",
    "fact": "The mantle is the thickest layer of Earth and contains semi-molten rock."
  },
  "2026-06-03": {
    "question": "What particle carries a negative electric charge?",
    "options": ["Electron", "Proton", "Neutron", "Photon"],
    "correct": 0,
    "category": "Physics",
    "icon": "⚛️",
    "gradient": "from-blue-500/10 to-indigo-500/10",
    "fact": "Electrons orbit around the nucleus of an atom."
  },
  "2026-06-04": {
    "question": "Which vitamin is mainly produced when skin is exposed to sunlight?",
    "options": ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin D"],
    "correct": 3,
    "category": "Health",
    "icon": "🌞",
    "gradient": "from-yellow-500/10 to-lime-500/10",
    "fact": "Vitamin D helps the body absorb calcium for strong bones."
  },
  "2026-06-05": {
    "question": "What is the fastest land animal?",
    "options": ["Lion", "Cheetah", "Horse", "Wolf"],
    "correct": 1,
    "category": "Animals",
    "icon": "🐆",
    "gradient": "from-orange-500/10 to-yellow-500/10",
    "fact": "Cheetahs can run at speeds of up to 112 km/h (70 mph)."
  },
  "2026-06-06": {
    "question": "Which planet is closest to the Sun?",
    "options": ["Venus", "Earth", "Mercury", "Mars"],
    "correct": 2,
    "category": "Astronomy",
    "icon": "☄️",
    "gradient": "from-gray-500/10 to-yellow-500/10",
    "fact": "Mercury has very extreme temperatures because it lacks a thick atmosphere."
  },
  "2026-06-07": {
    "question": "What do bees primarily collect from flowers?",
    "options": ["Pollen and nectar", "Seeds", "Leaves", "Water"],
    "correct": 0,
    "category": "Biology",
    "icon": "🐝",
    "gradient": "from-yellow-500/10 to-amber-500/10",
    "fact": "Bees use nectar to make honey and help pollinate plants."
  },
  "2026-06-08": {
    "question": "What is the center of an atom called?",
    "options": ["Electron", "Nucleus", "Shell", "Core"],
    "correct": 1,
    "category": "Chemistry",
    "icon": "🔬",
    "gradient": "from-cyan-500/10 to-blue-500/10",
    "fact": "The nucleus contains protons and neutrons."
  },
  "2026-06-09": {
    "question": "Which planet is known for having a giant storm called the Great Red Spot?",
    "options": ["Mars", "Saturn", "Jupiter", "Neptune"],
    "correct": 2,
    "category": "Astronomy",
    "icon": "🌪️",
    "gradient": "from-orange-500/10 to-red-500/10",
    "fact": "The Great Red Spot is a massive storm larger than Earth."
  },
  "2026-06-10": {
    "question": "How many bones does an adult human typically have?",
    "options": ["106", "306", "406", "206"],
    "correct": 3,
    "category": "Human Body",
    "icon": "🦴",
    "gradient": "from-stone-500/10 to-gray-500/10",
    "fact": "Babies are born with more bones, which fuse together as they grow."
  },
  "2026-06-11": {
    "question": "What gas do humans need to breathe to survive?",
    "options": ["Carbon Dioxide", "Helium", "Hydrogen", "Oxygen"],
    "correct": 3,
    "category": "Biology",
    "icon": "🌬️",
    "gradient": "from-sky-500/10 to-cyan-500/10",
    "fact": "Oxygen is used by cells to release energy from food."
  },
  "2026-06-12": {
    "question": "Which instrument is used to look at stars and planets?",
    "options": ["Microscope", "Telescope", "Periscope", "Thermometer"],
    "correct": 1,
    "category": "Astronomy",
    "icon": "🔭",
    "gradient": "from-indigo-500/10 to-purple-500/10",
    "fact": "Telescopes collect light to help us observe distant objects in space."
  },
  "2026-06-13": {
    "question": "What is H2O commonly known as?",
    "options": ["Salt", "Hydrogen", "Water", "Oxygen"],
    "correct": 2,
    "category": "Chemistry",
    "icon": "💦",
    "gradient": "from-blue-500/10 to-cyan-500/10",
    "fact": "Each water molecule contains two hydrogen atoms and one oxygen atom."
  },
  "2026-06-14": {
    "question": "Which planet is called Earth's twin because of its similar size?",
    "options": ["Mars", "Venus", "Mercury", "Neptune"],
    "correct": 1,
    "category": "Astronomy",
    "icon": "🌍",
    "gradient": "from-yellow-500/10 to-orange-500/10",
    "fact": "Venus is similar in size to Earth but has an extremely hot atmosphere."
  },
  "2026-06-15": {
    "question": "What is the main source of energy for Earth?",
    "options": ["Moon", "Wind", "Sun", "Volcanoes"],
    "correct": 2,
    "category": "Earth Science",
    "icon": "☀️",
    "gradient": "from-yellow-500/10 to-red-500/10",
    "fact": "Almost all life on Earth depends on energy from the Sun."
  },
  "2026-06-16": {
    "question": "Which organ is responsible for filtering blood in the human body?",
    "options": ["Heart", "Lungs", "Pancreas", "Kidneys"],
    "correct": 3,
    "category": "Human Body",
    "icon": "🩺",
    "gradient": "from-pink-500/10 to-red-500/10",
    "fact": "Your kidneys remove waste and extra water to produce urine."
  },
  "2026-06-17": {
    "question": "What kind of animal is the largest living creature on Earth?",
    "options": ["Elephant", "Blue Whale", "Shark", "Giraffe"],
    "correct": 1,
    "category": "Animals",
    "icon": "🐋",
    "gradient": "from-blue-500/10 to-sky-500/10",
    "fact": "Blue whales can grow longer than a basketball court."
  },
  "2026-06-18": {
    "question": "What is the closest star to Earth?",
    "options": ["Polaris", "The Sun", "Alpha Centauri", "Sirius"],
    "correct": 1,
    "category": "Astronomy",
    "icon": "⭐",
    "gradient": "from-yellow-500/10 to-orange-500/10",
    "fact": "The Sun is a medium-sized star at the center of our Solar System."
  },
  "2026-06-19": {
    "question": "Which state of matter has no fixed shape or volume?",
    "options": ["Solid", "Gas", "Liquid", "Crystal"],
    "correct": 1,
    "category": "Physics",
    "icon": "🌫️",
    "gradient": "from-gray-500/10 to-slate-500/10",
    "fact": "Gas particles move freely and spread out to fill any container."
  },
  "2026-06-20": {
    "question": "Which scientist discovered gravity after observing a falling apple?",
    "options": ["Albert Einstein", "Marie Curie", "Charles Darwin", "Isaac Newton"],
    "correct": 3,
    "category": "Scientists",
    "icon": "🍎",
    "gradient": "from-green-500/10 to-lime-500/10",
    "fact": "Newton’s work on gravity became one of the foundations of classical physics."
  }
};

const fetchDailyTrivia = async () => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  console.group("📅 TRIVIA DATE DEBUGGER");
  console.log("Looking up target key (Today):    ", todayStr);
  console.log("Comparing with yesterday's key: ", yesterdayStr);
  console.log("Is yesterday's data available?  ", !!TRIVIA_QUESTIONS[yesterdayStr]);
  console.log("Is today's data available?      ", !!TRIVIA_QUESTIONS[todayStr]);
  console.groupEnd();

  // Returns the exact trivia object matching today's date string. 
  // Falls back to yesterday's data if today's entry isn't found.
  return TRIVIA_QUESTIONS[todayStr] || TRIVIA_QUESTIONS[yesterdayStr];
};

export const useTriviaData = () => {
  const queryClient = useQueryClient();

  const { data: currentTrivia } = useQuery({
    queryKey: ['dailyTrivia'],
    queryFn: fetchDailyTrivia,
    staleTime: 0, // Keeps it fluid during debugging triggers
    refetchOnWindowFocus: true, 
  });

  const [state, setState] = useState({
    selectedAnswer: null,
    showResult: false,
    streak: 0,
    lastAnsweredDate: null,
    lastStreakUpdate: null, 
    history: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('triviaWidget');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      let currentStreak = parsed.streak || 0;
      if (parsed.lastStreakUpdate) {
        const lastDate = parseISO(parsed.lastStreakUpdate);
        if (!isToday(lastDate) && !isYesterday(lastDate)) {
          currentStreak = 0; 
        }
      }

      setState(prev => ({ 
        ...prev, 
        ...parsed,
        streak: currentStreak,
        showResult: false 
      }));
    }
  }, []);

  const handleAnswer = useCallback((answerIndex) => {
    if (!currentTrivia) return;
    if (state.lastAnsweredDate && isToday(parseISO(state.lastAnsweredDate))) return;
    
    const isCorrect = answerIndex === currentTrivia.correct;
    const now = new Date();
    const nowISO = now.toISOString();
    const todayLabel = format(now, 'MMM dd');
    
    let newStreak = state.streak;
    let newLastStreakUpdate = state.lastStreakUpdate;

    if (isCorrect) {
      const lastUpdate = state.lastStreakUpdate ? parseISO(state.lastStreakUpdate) : null;
      if (!lastUpdate || isYesterday(lastUpdate)) {
        newStreak += 1;
        newLastStreakUpdate = nowISO;
      }
    } else {
      newStreak = 0; 
      newLastStreakUpdate = nowISO;
    }

    let updatedHistory = [...state.history];
    const existingEntryIndex = updatedHistory.findIndex(entry => entry.date === todayLabel);

    const newEntry = {
      question: currentTrivia.question,
      icon: currentTrivia.icon,
      isCorrect: isCorrect,
      date: todayLabel
    };

    if (existingEntryIndex !== -1) {
      updatedHistory[existingEntryIndex] = newEntry;
    } else {
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
  }, [state, currentTrivia]);

  const resetToday = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, selectedAnswer: null, lastAnsweredDate: null };
      localStorage.setItem('triviaWidget', JSON.stringify(newState));
      return newState;
    });
    queryClient.invalidateQueries({ queryKey: ['dailyTrivia'] });
  }, [queryClient]);

  const hasAnsweredToday = () => state.lastAnsweredDate && isToday(parseISO(state.lastAnsweredDate));

  return { 
    state: { ...state, currentTrivia }, 
    handleAnswer, 
    hasAnsweredToday, 
    resetToday 
  };
};