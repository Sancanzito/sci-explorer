import { create } from 'zustand';

/**
 * Global Zustand store for MicrobeRPG simulation.
 * Manages player stats, inventory, taxonomy encyclopedia, and game phase.
 */
export const useMicrobeStore = create((set, get) => ({
  // Player statistics
  health: 100,
  energy: 100,
  scientificProgressionPoints: 0,
  currentTool: 'microscope', // microscope, staining, culture, etc.
  isMoving: false,
  activeTarget: null, // Currently overlapped microbe entity

  // Inventory collections
  inventory: {
    antibiotics: [],
    antifungals: [],
    stains: [],
    laboratoryEquipment: []
  },

  // Taxonomy encyclopedia: discovered pathogens
  taxonomyEncyclopedia: [],

  // Game phase finite state machine
  gamePhase: 'EXPLORING', // EXPLORING, SCANNING, ENCYCLOPEDIA

  // Actions to update player statistics
  setHealth: (health) => set({ health }),
  setEnergy: (energy) => set({ energy }),
  addScientificProgressionPoints: (points) => set({ scientificProgressionPoints: get().scientificProgressionPoints + points }),
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setActiveTarget: (target) => set({ activeTarget: target }),

  // Inventory management
  addToInventory: (category, item) => set((state) => ({
    inventory: {
      ...state.inventory,
      [category]: [...state.inventory[category], item]
    }
  })),
  removeFromInventory: (category, itemId) => set((state) => ({
    inventory: {
      ...state.inventory,
      [category]: state.inventory[category].filter(item => item.id !== itemId)
    }
  })),

  // Taxonomy encyclopedia management
  addToTaxonomyEncyclopedia: (pathogen) => set((state) => ({
    taxonomyEncyclopedia: [...state.taxonomyEncyclopedia, pathogen]
  })),
  updateTaxonomyEntry: (pathogenId, updates) => set((state) => ({
    taxonomyEncyclopedia: state.taxonomyEncyclopedia.map(entry =>
      entry.id === pathogenId ? { ...entry, ...updates } : entry
    )
  })),

  // Game phase management
  setGamePhase: (phase) => set({ gamePhase: phase }),
  isExploring: () => get().gamePhase === 'EXPLORING',
  isScanning: () => get().gamePhase === 'SCANNING',
  isInEncyclopedia: () => get().gamePhase === 'ENCYCLOPEDIA'
}));