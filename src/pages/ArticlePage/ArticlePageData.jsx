// components/ArticlePageData.jsx

export const articlesDatabase = [
  {
    id: 'chem-models',
    title: 'The Use of Models in Chemistry',
    category: 'Chemistry',
    description: 'Discover how and why scientists use physical, conceptual, and mathematical models to study phenomena that cannot be seen directly.',
    content: {
      introduction: "In science, phenomena often occur at scales too massive or incredibly minuscule to observe directly. This article explores how scientists deploy models to explain behavior, predict interactions, and illustrate mechanisms of things that escape the naked eye.",
      sections: [
        {
          heading: "What is a Scientific Model?",
          text: "A scientific model is a conceptual, physical, mathematical, or visual representation of a system, process, or phenomenon designed to make complex parts of the universe easier to visualize, test, and understand."
        },
        {
          heading: "Importance of Models in Science",
          text: "Models are essential tools in scientific inquiry because they allow researchers to simplify highly complex systems, safely test 'what-if' scenarios via predictions, and communicate abstract theories using concrete visual aids."
        }
      ]
    }
  },
  {
    id: 'particle-model-matter', // FIXED: Changed from 'chem-particle-model' to match custom dashboards and routing references
    title: 'The Particle Model of Matter',
    category: 'Chemistry',
    description: 'Everything around us is made of tiny, microscopic building blocks that never sit still. This guide breaks down exactly how these particles behave in solids, liquids, and gases.',
    content: {
      introduction: "Everything around us is constructed of microscopic particles that are constantly moving. This interactive curriculum breaks down how solids, liquids, and gases behave under real-world scenarios.",
      sections: [
        {
          heading: "What Is Matter?",
          text: "Matter is anything that possesses mass and occupies physical space (volume). All physical objects are built from microscopic atomic building blocks joining together."
        },
        {
          heading: "The Four Main Ideas of the Particle Model",
          text: "1. All matter is made of tiny particles. 2. Particles are always moving. 3. There are spaces between particles. 4. Particles attract each other."
        },
        {
          heading: "States of Matter: Solids, Liquids, and Gases",
          text: "Particles change structural spacing configurations. Solids are locked and vibrate; liquids slide past neighbors; gases break into rapid, free-form random vectors."
        },
        {
          heading: "Heat and Kinetic Particle Movement",
          text: "Adding thermal heat energy accelerates individual particle velocities and expands empty separation voids, initiating phase shifts like melting or evaporation."
        }
      ]
    }
  },
  {
    id: 'ScienceSkills',
    title: 'Scientific Investigation Skills',
    category: 'Chemistry',
    description: 'A comprehensive guide to laboratory safety, proper equipment usage, and the structured steps of an investigation.',
    content: {
      introduction: "Every great scientific discovery starts with rigorous, safe, and structured inquiry. Mastering laboratory workflows is vital for translating curiosity into reproducible facts.",
      sections: [
        {
          heading: "Laboratory Safety Rules",
          text: "Safety is the foundation of lab work. Always wear protective gear (goggles, aprons), handle chemicals with caution, know the locations of emergency stations, and never eat or drink in the lab."
        },
        {
          heading: "Basic Laboratory Equipment",
          text: "Familiarity with tools like beakers, graduated cylinders, Bunsen burners, and test tubes ensures that experiments are conducted efficiently and correctly."
        },
        {
          heading: "Steps in a Scientific Investigation",
          text: "The scientific method guides exploration: identify a problem, form a testable hypothesis, design a controlled experiment, collect data, analyze findings, and draw logical conclusions."
        },
        {
          heading: "Accurate Measurement",
          text: "Precision matters. Learn to read the meniscus at eye level on volumetric tools, properly calibrate scales, and utilize standard metric units to minimize experimental error."
        }
      ]
    }
  },
  {
    id: 'chem-solutions-solubility',
    title: 'Solutions, Solubility, and Concentration',
    category: 'Chemistry',
    description: 'Explore solute-solvent interactions, quantitative expressions of concentration, and factors affecting solubility.',
    content: {
      introduction: "Solutions are homogeneous mixtures encountered everywhere in daily life. This guide dives deep into how substances dissolve and how we calculate and manipulate their strengths.",
      sections: [
        {
          heading: "Solute and Solvent Dynamics",
          text: "A solution is composed of a solute (the substance being dissolved) thoroughly dispersed throughout a solvent (the dissolving medium, such as water)."
        },
        {
          heading: "Concentration: Dilute vs. Concentrated",
          text: "Concentration describes the amount of solute present in a given volume of solution. Dilute solutions hold relatively little solute, whereas concentrated solutions contain a large amount."
        },
        {
          heading: "Measuring Concentration Quantitatively",
          text: "Concentration can be precisely calculated and communicated through mathematical expressions such as percentage by mass, percentage by volume, or parts per million (ppm)."
        },
        {
          heading: "Understanding Solubility and Saturation",
          text: "Solubility is the maximum amount of solute that can dissolve at a specific temperature. Solutions can be classified as unsaturated, saturated, or highly unstable supersaturated."
        },
        {
          heading: "Factors Affecting Solubility",
          text: "The rate and extent of dissolving are governed by distinct factors: temperature changes, pressure variations (especially in gases), surface area exposure, and stirring rate."
        }
      ]
    }
  },
  {
    id: 'chem-acids-bases',
    title: 'Acids, Bases, and Indicators',
    category: 'Chemistry',
    description: 'Learn how to identify and classify acids, bases, and salts safely using litmus and natural plant indicators.',
    content: {
      introduction: "Chemical solutions often exhibit distinct properties based on their acidic or basic nature. Learn how to spot them safely without putting your senses at risk.",
      sections: [
        {
          heading: "Acids, Bases, and Salts Table",
          text: "Acids generally taste sour and react with metals; bases feel slippery and taste bitter. When combined, they neutralize one another to produce water and neutral ionic substances known as salts."
        },
        {
          heading: "Chemical Indicators",
          text: "Indicators are substances that change color depending on pH. This includes standard laboratory litmus paper alongside accessible, vibrant natural plant options like red cabbage juice or turmeric."
        },
        {
          heading: "Safety in Handling Solutions and Chemicals",
          text: "Many strong acids and bases are highly corrosive. Never smell or taste chemicals directly to classify them; rely entirely on indicators and use strict personal protective equipment."
        }
      ]
    }
  },
  {
    id: 'biology-fundamentals',
    title: 'Biology Basics',
    category: 'Biology',
    description: 'Introduction to cellular biology, structural organizations, and cell theory fundamentals.',
    content: { 
      introduction: "An introductory read exploring structural cell mechanisms, organelles, and basic biological classification frameworks.",
      sections: [{ heading: "Cell Theory", text: "All living organisms are made up of one or more basic cells." }]
    }
  },
  {
    id: 'physics-fundamentals',
    title: 'Physics Principles',
    category: 'Physics',
    description: 'Core concepts exploring Newtonian mechanics, force interactions, and foundational energy laws.',
    content: { 
      introduction: "Understanding basic laws of motion, dynamic system vectors, and kinetic energy calculations.",
      sections: [{ heading: "Newton's Laws", text: "Objects in motion remain in motion unless acted upon by an external net force." }]
    }
  }
];

export const filterArticles = (articles, searchQuery) => {
  const query = searchQuery.toLowerCase();
  return articles.filter(article => {
    return (
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  });
};