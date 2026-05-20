// pages/HomePage/HomeComponents/FactBox/FactBoxData.js
import { useState, useEffect } from 'react';

export const facts = [
  { text: "The speed of light in a vacuum is 299,792,458 m/s, but in water it slows to 225,000,000 m/s!", icon: "⚡" },
  { text: "A single human cell nucleus is only 6 micrometers wide - you could fit 16,000 of them on a pinhead!", icon: "🔬" },
  { text: "There are more stars in the universe than grains of sand on all Earth's beaches.", icon: "⭐" },
  { text: "Your body produces 25 million new cells every second!", icon: "🧬" }
];

export const useFactBoxData = () => {
  const [currentFact, setCurrentFact] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    facts,
    currentFact,
    isModalOpen,
    openModal,
    closeModal
  };
};