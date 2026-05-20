// pages/HomePage/HomeComponents/FactBox/FactBoxAnimation.js

export const commonTransition = {
  type: "spring",
  stiffness: 280,
  damping: 24,
  mass: 0.6
};

export const factBoxVariants = {
  initial: { opacity: 0, scale: 0.92, y: 30 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { ...commonTransition, delay: 0.15 }
  }
};

// --- FIX: Ensure this exact named object is exported properly ---
export const textRevealVariants = {
  initial: { opacity: 0, letterSpacing: "0.05em", y: 5 },
  animate: { 
    opacity: 1, 
    letterSpacing: "0.11em", 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: commonTransition },
  exit: { opacity: 0, scale: 0.93, y: 20, transition: { duration: 0.2, ease: "easeIn" } }
};

export const cardShuffleVariants = {
  active: {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    zIndex: 10,
    opacity: 1,
    transition: commonTransition
  },
  exit: {
    x: [0, 160, -80],
    y: [0, -15, 20],
    rotate: [0, 12, -8],
    opacity: 0,
    zIndex: 0,
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

export const lightbulbGlowVariants = {
  animate: {
    scale: [0.85, 1.25, 0.85],
    opacity: [0.25, 0.6, 0.25],
    backgroundColor: ["rgba(245, 158, 11, 0.2)", "rgba(251, 191, 36, 0.55)", "rgba(245, 158, 11, 0.2)"],
    filter: ["blur(16px)", "blur(28px)", "blur(16px)"],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

export const continuousZoomVariants = {
  animate: {
    scale: [1, 1.04, 1],
    rotate: [0, 0.5, 0, -0.5, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  }
};

export const textPulsateVariants = {
  animate: {
    scale: [1, 1.015, 1],
    textShadow: [
      "0 0 0px rgba(0,0,0,0)", 
      "0 2px 8px rgba(16,185,129,0.06)", 
      "0 0 0px rgba(0,0,0,0)"
    ],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};