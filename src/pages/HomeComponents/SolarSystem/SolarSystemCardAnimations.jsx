// SolarSystemCardAnimations.jsx
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20,
    rotateX: -15 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    rotateX: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 10,
    transition: { duration: 0.2 } 
  }
};

export const contentFade = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { delay: 0.2 } 
  }
};