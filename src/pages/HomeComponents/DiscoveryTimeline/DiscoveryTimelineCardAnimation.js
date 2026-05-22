// animations/DiscoveryTimelineCardAnimations.js
export const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    y: -6,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 22 }
  },
  tap: { scale: 0.97 },
  selected: { 
    scale: 1.04,
    y: -4,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

export const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.15, 
    rotate: [0, -8, 8, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  selected: {
    scale: 1.1,
    borderColor: "rgba(34, 211, 238, 0.4)"
  }
};

export const glowVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 0.4,
    transition: { duration: 0.3 }
  },
  selected: {
    opacity: 0.8
  }
};