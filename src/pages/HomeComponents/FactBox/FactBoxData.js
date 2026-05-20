// pages/HomePage/HomeComponents/FactBox/FactBoxData.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getISOWeek, getYear } from 'date-fns';

export const fallbackFacts = [
  {
    week: 21, // Mid-May 2026
    theme: 'Extreme Nature 🌋',
    facts: [
      { id: "w21-1", text: "The axolotl can regenerate its limbs, spinal cord, and even parts of its brain without scarring!", image:"/factbox/axolotl.png", funPrompt: "Real-life superheroes! 🧬" },
      { id: "w21-2", text: "Honeybees can recognize human faces and remember them to communicate with their hive.", image: "/images/honeybee.png", funPrompt: "Be nice to your local bees! 🐝" },
      { id: "w21-3", text: "Crows are known to use tools, complete multi-step puzzles, and even hold grudges.", image: "/images/crow.png", funPrompt: "They might be watching you... 🐦" },
      { id: "w21-4", text: "Sloths can hold their breath underwater for up to 40 minutes by slowing their heart rate down.", image: "/images/sloth.png", funPrompt: "Slower than a dolphin! 🦥" },
      { id: "w21-5", text: "Lightning bolts can reach temperatures hotter than the surface of the sun—up to 30,000°C!", image: "/images/lightning.png", funPrompt: "Pure, chaotic power! ⚡" }
    ]
  },
  {
    week: 22,
    theme: 'Cosmic Wonders 🚀',
    facts: [
      { id: "w22-1", text: "One day on Venus is longer than an entire year on Venus due to its extremely slow rotation.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Venus_Venera13.jpg/1280px-Venus_Venera13.jpg", funPrompt: "Talk about a long workday! 🪐" },
      { id: "w22-2", text: "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/New_Insights_into_Neutron_Stars.jpg/1280px-New_Insights_into_Neutron_Stars.jpg", funPrompt: "Incredibly heavy physics! 🌌" },
      { id: "w22-3", text: "Space is completely silent because there is no atmosphere or air for sound waves to travel through.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Eisberg_um_03_Uhr_morgens_in_Antarktika.jpg/1280px-Eisberg_um_03_Uhr_morgens_in_Antarktika.jpg", funPrompt: "The ultimate quiet zone. 🤫" },
      { id: "w22-4", text: "Footprints left by astronauts on the Moon will stay there for millions of years since there is no wind.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Apollo_11_bootprint.jpg/1280px-Apollo_11_bootprint.jpg", funPrompt: "Permanent history in the dust! 🧑‍🚀" },
      { id: "w22-5", text: "There are more trees on Earth than stars in the Milky Way galaxy.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Trees_in_the_forest.jpg/1280px-Trees_in_the_forest.jpg", funPrompt: "Nature wins this round! 🌳" }
    ]
  }
];

const fetchWeeklyFactGroup = async (week, year) => {
  try {
    const response = await fetch(`https://api.yourdomain.com/facts?week=${week}&year=${year}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    // Safely silence the SSL / network resolution failure
    console.warn("Backend API not reachable. Using curated offline backup cards.");
    return null;
  }
};

export const useFactBoxData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  const currentWeek = getISOWeek(new Date());
  const currentYear = getYear(new Date());

  const { data: weekData, isLoading } = useQuery({
    queryKey: ['weekly-fact-group', currentWeek, currentYear],
    queryFn: () => fetchWeeklyFactGroup(currentWeek, currentYear),
    retry: false,
    initialData: () => null
  });

  // Decide current deck: server data or correct local week group
  const activeDeck = weekData || fallbackFacts.find(f => f.week === currentWeek) || fallbackFacts[0];

  const openModal = () => {
    setActiveCardIndex(0);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const nextCard = () => {
    if (activeDeck?.facts) {
      setActiveCardIndex((prev) => (prev + 1) % activeDeck.facts.length);
    }
  };

  return {
    theme: activeDeck?.theme || 'Discovery',
    facts: activeDeck?.facts || [],
    activeCardIndex,
    isLoading: false, // InitialData means we are ready to mount instantly
    isModalOpen,
    openModal,
    closeModal,
    nextCard
  };
};