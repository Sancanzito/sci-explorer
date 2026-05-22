// animations/DiscoveryTimelineAnimations.js
export const containerVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo
      staggerChildren: 0.08,
      when: "beforeChildren"
    }
  }
};

export const headerVariants = {
  hidden: { x: -24, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 }
  }
};

export const timelineLineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1,
    transition: { delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }
  }
};

export const timelineNodeVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom) => ({ 
    y: 0, 
    opacity: 1,
    transition: { 
      delay: 0.2 + (custom * 0.08), 
      type: "spring", 
      stiffness: 180, 
      damping: 18 
    }
  })
};