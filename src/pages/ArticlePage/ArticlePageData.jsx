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
  id: 'LaboratorySafety',
  title: 'Laboratory Safety Guide',
  category: 'Chemistry',
  description: 'Learn the essential laboratory rules, hazard awareness, emergency procedures, and safe scientific practices needed inside a laboratory environment.',
  content: {
    introduction: "Before scientists perform experiments, they must first understand how to work safely and responsibly inside the laboratory. Laboratory safety protects people, equipment, and experiments from accidents and contamination. By learning proper safety procedures, students can confidently explore science while minimizing risks and maintaining a productive learning environment.",
    
    sections: [
      {
        heading: "Introduction to Laboratory Safety",
        text: "Laboratory safety involves the rules, habits, and procedures designed to prevent accidents and ensure safe scientific work. Scientists must always think carefully, follow instructions, and remain aware of their surroundings while working in a laboratory."
      },

      {
        heading: "Importance of Laboratory Safety",
        text: "Safety is important because laboratories contain chemicals, glassware, heat sources, and equipment that can become dangerous if handled incorrectly. Following safety procedures helps prevent injuries, protects equipment, and ensures experiments are performed accurately."
      },

      {
        heading: "Personal Protective Equipment (PPE)",
        text: "Scientists wear protective equipment such as goggles, gloves, aprons, and closed shoes to reduce exposure to hazards. PPE helps protect the eyes, skin, and clothing from chemicals, heat, and broken materials."
      },

      {
        heading: "Basic Laboratory Rules",
        text: "Students should never eat, drink, run, or play inside the laboratory. Long hair should be tied back, instructions should be followed carefully, and all chemicals and equipment must be handled responsibly."
      },

      {
        heading: "Laboratory Hazard Symbols",
        text: "Hazard symbols warn people about dangerous substances and materials. Common symbols include flammable, toxic, corrosive, explosive, and biohazard signs. Understanding these symbols helps scientists recognize and avoid potential dangers."
      },

      {
        heading: "Safe Handling of Chemicals",
        text: "Chemicals should always be labeled properly and handled carefully. Never taste chemicals, directly inhale fumes, or mix unknown substances together. Scientists should use proper tools and follow instructions when transferring or heating chemicals."
      },

      {
        heading: "Proper Use of Laboratory Equipment",
        text: "Laboratory tools such as beakers, test tubes, graduated cylinders, and Bunsen burners must be used correctly to avoid accidents and obtain reliable results. Equipment should always be checked before and after use."
      },

      {
        heading: "Emergency Procedures",
        text: "Scientists must know what to do during emergencies such as spills, burns, fires, or broken glass accidents. Laboratories often contain emergency equipment such as fire extinguishers, eye wash stations, first aid kits, and safety showers."
      },

      {
        heading: "Proper Waste Disposal and Cleanliness",
        text: "Keeping the laboratory clean prevents contamination and accidents. Chemicals, broken glass, and biological materials should be disposed of properly according to laboratory rules. Workstations should always be cleaned after experiments."
      },

      {
        heading: "Responsible Scientific Behavior",
        text: "Good scientists show responsibility, honesty, patience, and careful observation while working in the laboratory. Scientific work requires discipline, teamwork, and respect for safety procedures."
      }
    ]
  }
},

{
  id: 'ScientificSkills',
  title: 'Scientific Investigation Skills',
  category: 'Science',
  description: 'Develop the essential scientific process skills used to observe, measure, investigate, analyze data, and solve scientific problems.',
  
  content: {
    introduction: "Science is more than memorizing facts — it is a process of asking questions, gathering evidence, and discovering explanations about the world. Scientists use investigation skills to observe carefully, conduct experiments, collect accurate data, and communicate their findings logically and clearly.",

    sections: [
      {
        heading: "Introduction to Scientific Investigation",
        text: "Scientific investigation is a structured process used to answer questions and solve problems using evidence and experimentation. Scientists rely on observation, testing, and analysis to understand how things work."
      },

      {
        heading: "Observation Skills",
        text: "Observation involves using the senses and scientific tools to gather information. Qualitative observations describe qualities such as color or texture, while quantitative observations involve measurements and numbers."
      },

      {
        heading: "Asking Scientific Questions",
        text: "Scientific investigations begin with questions that can be tested through observation and experimentation. Good scientific questions are clear, focused, and measurable."
      },

      {
        heading: "Forming a Hypothesis",
        text: "A hypothesis is a possible explanation or prediction that can be tested through experiments. Scientists often write hypotheses using the format: 'If... then... because...'."
      },

      {
        heading: "Variables in an Experiment",
        text: "Experiments contain different types of variables. The independent variable is changed by the scientist, the dependent variable is measured, and controlled variables are kept constant to ensure fair testing."
      },

      {
        heading: "Steps of the Scientific Method",
        text: "The scientific method provides an organized way to investigate problems. Common steps include identifying a problem, researching, forming a hypothesis, conducting an experiment, collecting data, analyzing results, and drawing conclusions."
      },

      {
        heading: "Using Laboratory Equipment",
        text: "Scientists use laboratory tools such as thermometers, balances, rulers, microscopes, and graduated cylinders to collect accurate observations and measurements during investigations."
      },

      {
        heading: "Accurate Measurement",
        text: "Accurate measurements improve the reliability of experiments. Scientists use standard metric units, read scales carefully, and measure liquids at eye level using the meniscus."
      },

      {
        heading: "Data Collection and Recording",
        text: "During investigations, scientists carefully record observations and measurements in tables, charts, and notebooks. Organized data helps scientists identify patterns and interpret results."
      },

      {
        heading: "Analyzing and Interpreting Data",
        text: "Scientists study collected data to identify trends, relationships, and possible errors. Graphs and charts help make scientific information easier to understand."
      },

      {
        heading: "Drawing Conclusions",
        text: "After analyzing results, scientists determine whether the evidence supports the hypothesis. Conclusions should be based on evidence gathered during the investigation."
      },

      {
        heading: "Communicating Scientific Findings",
        text: "Scientists share their results through reports, presentations, graphs, and discussions. Scientific communication allows others to learn from investigations and verify findings."
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