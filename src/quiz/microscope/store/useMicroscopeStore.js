import { create } from 'zustand';

const initialParts = [
  { id: 'eyepiece', label: 'Eyepiece & Head' },
  { id: 'arm', label: 'Arm' },
  { id: 'objectives', label: 'Objective Lenses' },
  { id: 'stage', label: 'Stage' },
  { id: 'stageClips', label: 'Stage Clips' }, // NEW
  { id: 'condenser', label: 'Condenser' },    // NEW
  { id: 'slide', label: 'Glass Slide' },
  { id: 'focus', label: 'Focus Knobs' },
  { id: 'lamp', label: 'Light Source' },
  { id: 'base', label: 'Base' },
];

export const useMicroscopeStore = create((set) => ({
  parts: initialParts,
  placedParts: {}, 
  selectedPart: null, 
  score: 0,
  mistakes: 0,
  
  selectPart: (partId) => set({ selectedPart: partId }),
  
  placePart: (zoneId) => set((state) => {
    if (!state.selectedPart) return state; 

    // Scoring & Placement Logic
    if (state.selectedPart === zoneId) {
      // Correct placement
      const newPlaced = { ...state.placedParts };
      newPlaced[zoneId] = state.selectedPart;
      return { 
        placedParts: newPlaced, 
        selectedPart: null, // Drop the part
        score: state.score + 10 // Reward
      };
    } else {
      // Incorrect placement
      return {
        selectedPart: null, // Drop the part back in the box
        score: Math.max(0, state.score - 5), // Penalty, but don't go below 0
        mistakes: state.mistakes + 1
      };
    }
  }),
  
  removePart: (zoneId) => set((state) => {
    const newPlaced = { ...state.placedParts };
    delete newPlaced[zoneId];
    return { placedParts: newPlaced };
  }),
  
  resetGame: () => set({ placedParts: {}, selectedPart: null, score: 0, mistakes: 0 }),
  
  isComplete: () => set((state) => ({ 
    isComplete: Object.keys(state.placedParts).length === initialParts.length 
  }))
}));