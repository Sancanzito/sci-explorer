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
        },
        {
          heading: "Types of Scientific Models",
          text: "Scientists classify models into three major structural groups based on how they represent data:",
          subsections: [
            {
              title: "Physical Models",
              desc: "Tangible, 3D representations you can touch, such as a plastic globe, a model airplane, or a physical ball-and-stick molecular kit."
            },
            {
              title: "Conceptual Models",
              desc: "Mental frameworks, analogies, or metaphors used to explain abstract concepts (e.g., comparing the human heart to a mechanical water pump)."
            },
            {
              title: "Mathematical Models",
              desc: "Equations, formulas, or computer simulations that calculate and track real-world behaviors, such as weather forecasting algorithms."
            }
          ]
        },
        {
          heading: "Models Used in Studying Matter",
          text: "Because individual atoms and molecules are too small to be seen with standard microscopes, chemistry relies heavily on models. Scientists use particle diagrams, structural drawings, and animated computer simulations to illustrate how particles organize and interact."
        },
        {
          heading: "Limitations of Scientific Models",
          text: "While models are powerful, they are approximations of reality and carry inherent limitations:",
          points: [
            "Omissions: They leave out minor details to avoid overcomplication.",
            "Scale Inaccuracies: Sizes and relative distances are often exaggerated for clarity.",
            "Static Nature: A printed diagram cannot perfectly replicate the continuous, dynamic motion of real-world particles."
          ]
        },
        {
          heading: "Observable vs. Non-observable Phenomena",
          text: "Observable phenomena are events or objects that can be directly detected using human senses or basic laboratory tools (e.g., color changes, liquid boiling). Non-observable phenomena cannot be seen directly because they are too small or hidden (e.g., the flow of electrons or chemical bond formations). When dealing with the unobservable, scientists collect indirect evidence by measuring how a system responds to changes (like mass or temperature alterations) to infer the underlying structure."
        }
      ]
    }
  },
  {
    id: 'chem-particle-model',
    title: 'The Particle Model of Matter',
    category: 'Chemistry',
    description: 'An in-depth look at the core principles governing matter, its characteristics, and indirect evidence of particle motion.',
    content: {
      introduction: "The behavior and physical properties of everything around us are explained by the Particle Model of Matter. This foundational theory dictates that matter is not continuous, but rather constructed of distinct, moving particles.",
      sections: [
        {
          heading: "Core Characteristics of Matter",
          text: "Matter is defined as anything that has mass and takes up space (volume). All matter is composed of pure substances or mixtures made up of tiny particles."
        },
        {
          heading: "The Four Principles of the Particle Model",
          text: "Four essential rules govern the microscopic behavior of matter:",
          points: [
            "All matter is made of tiny particles (atoms or molecules).",
            "Particles are in constant random motion—they are never perfectly still.",
            "There are empty spaces between particles.",
            "Attractive forces exist between particles, holding them together with varying degrees of strength."
          ]
        },
        {
          heading: "Pure Substances and Their Particles",
          text: "A pure substance consists of only one unique type of particle throughout (e.g., pure water contains only water molecules; pure gold contains only gold atoms). Because their particles are identical, pure substances maintain completely uniform and predictable physical properties."
        },
        {
          heading: "The Effect of Heat on Particles",
          text: "Adding heat directly increases the kinetic energy of particles, causing them to move faster and push further apart, weakening their attractive forces. Conversely, cooling removes kinetic energy, slowing particles down and allowing attractive forces to pull them closer together."
        },
        {
          heading: "Evidence of Particle Motion",
          text: "We can witness indirect evidence of constant particle movement through two common phenomena:",
          points: [
            "Diffusion: The spontaneous spreading and mixing of particles from an area of high concentration to an area of low concentration (e.g., smelling perfume across a room or a drop of food coloring spreading in water).",
            "Brownian Motion: The erratic, zig-zag jumping movement of microscopic particles suspended in a fluid, caused by continuous collisions with invisible, fast-moving water or air molecules."
          ]
        },
        {
          heading: "States of Matter Comparison",
          text: "The physical state of a substance depends on the balance between its particle motion and its intermolecular attraction:",
          subsections: [
            {
              title: "Solids",
              desc: "Particles are tightly packed in a regular, fixed geometric pattern. They have extremely strong attractive forces and can only vibrate in their fixed positions."
            },
            {
              title: "Liquids",
              desc: "Particles are closely packed but arranged randomly. They possess moderate attractive forces, giving them the freedom to slide, roll, and tumble past one another."
            },
            {
              title: "Gases",
              desc: "Particles have immense empty spaces between them and move dynamically at high velocities. Intermolecular attraction is virtually negligible."
            }
          ]
        }
      ]
    }
  },
  {
    id: 'chem-state-changes',
    title: 'Changes of State and Energy Pathways',
    category: 'Chemistry',
    description: 'Learn how thermal energy transfers drive phase changes by altering particle arrangement and motion.',
    content: {
      introduction: "A change of state is a physical transformation from one state of matter to another. These transitions are driven entirely by moving thermal energy (heat) into or out of a system, altering particle behavior without shifting its chemical identity.",
      sections: [
        {
          heading: "Heat and Energy in Matter",
          text: "Temperature is a direct measure of the average kinetic energy of the particles in a substance. Higher temperatures mean faster average particle speeds, while lower temperatures mean slower speeds."
        },
        {
          heading: "Particle Dynamics During State Changes",
          text: "When substances undergo phase changes, the energy added or removed goes directly into manipulating the spaces and attractive forces between particles rather than altering their identity."
        },
        {
          heading: "Phase Change Directions",
          text: "Phase changes are classified into two thermal categories depending on whether energy is taken in or released:",
          phaseChanges: [
            "Endothermic Transitions (Heat Absorbed): Melting (Solid → Liquid) causes particles to vibrate so violently they break free from fixed layouts. Evaporation & Boiling (Liquid → Gas) provides enough energy for particles to completely overcome attractive forces and fly apart.",
            "Exothermic Transitions (Heat Released): Condensation (Gas → Liquid) causes gas particles to cool down, slow down, and drop back into a fluid layout. Freezing (Liquid → Solid) locks slow-moving particles into a rigid, ordered matrix."
          ]
        },
        {
          heading: "Heating and Cooling Processes",
          text: "Using particle diagrams and flowcharts allows us to map exactly where energy is being redirected. During a heating process, energy breaks attractive frameworks apart. During a cooling process, energy leaves, allowing structural bonds to re-establish themselves."
        }
      ]
    }
  },
  {
    id: 'chem-scientific-skills',
    title: 'Scientific Investigation Skills',
    category: 'Chemistry',
    description: 'A comprehensive guide to laboratory safety, proper equipment usage, and the structured steps of an investigation.',
    content: {
      introduction: "A scientific investigation is a systematic approach used to answer questions and explore natural phenomena. It relies on objective observation, controlled experimentation, and repeatable data collection.",
      sections: [
        {
          heading: "Laboratory Safety Rules",
          text: "Safety is the foundation of lab work. Key protocols include wearing Personal Protective Equipment (goggles, lab coats), avoiding eating or drinking, utilizing the 'wafting' technique to smell vapors safely, and knowing the locations of the eyewash station and safety shower."
        },
        {
          heading: "Basic Laboratory Equipment",
          text: "Using the correct tools ensures accurate, safe, and controlled experimentation:",
          subsections: [
            {
              title: "Beaker & Flask",
              desc: "Used for holding, mixing, or heating liquids; provide rough volume estimations."
            },
            {
              title: "Graduated Cylinder",
              desc: "Used for measuring precise volumes of liquids. Measurements must always be read at the bottom of the curved meniscus at eye level."
            },
            {
              title: "Balances & Meters",
              desc: "Triple beam or digital balances measure mass precisely in grams (g), while thermometers record temperature in degrees Celsius (°C)."
            }
          ]
        },
        {
          heading: "Steps in a Scientific Investigation",
          text: "Scientists follow a rigid sequence to test hypotheses and arrive at reliable conclusions:",
          points: [
            "Aim or Problem: A clear, testable statement defining what you are trying to solve.",
            "Materials and Equipment: A thorough list of all tools and specimens used.",
            "Writing Procedures/Methods: Designing detailed, repeatable, step-by-step instructions.",
            "Identifying Variables: Tracking the Independent Variable (what you change), the Dependent Variable (what you measure), and Controlled Variables (what stays identical).",
            "Recording Results and Data: Organizing numbers and descriptions neatly using data tables.",
            "Making Conclusions: Summarizing findings to state clearly whether the data supports or rejects the hypothesis."
          ]
        },
        {
          heading: "Accurate Measurement",
          text: "To maintain scientific accuracy, observations should rely on quantified metrics using standard units of measurement (grams, milliliters, centimeters, and degrees Celsius) rather than vague estimates."
        }
      ]
    }
  },
  {
    id: 'chem-solutions',
    title: 'Solutions, Solubility, and Concentration',
    category: 'Chemistry',
    description: 'Explore solute-solvent interactions, quantitative expressions of concentration, and factors affecting solubility.',
    content: {
      introduction: "A solution is a uniform, homogeneous mixture formed when one or more substances dissolve completely into another. Because the particles mix evenly at the molecular level, solutions appear clear and will not settle over time.",
      sections: [
        {
          heading: "Solute and Solvent Dynamics",
          text: "Every solution consists of two fundamental components: the Solute (the substance being dissolved, usually present in smaller amounts, like salt or sugar) and the Solvent (the dissolving medium doing the work, usually present in larger amounts). Water is known as the 'universal solvent' because it dissolves more substances than any other liquid."
        },
        {
          heading: "Concentration: Dilute vs. Concentrated",
          text: "A dilute solution contains a relatively small amount of dissolved solute compared to the volume of solvent. A concentrated solution contains a large, dense amount of dissolved solute relative to the volume of solvent."
        },
        {
          heading: "Measuring Concentration Quantitatively",
          text: "To express solute amounts accurately, scientists use mathematical ratios like Percent by Mass, which is calculated by dividing the mass of the solute by the total mass of the solution (solute + solvent) and multiplying by 100."
        },
        {
          heading: "Understanding Solubility and Saturation",
          text: "Solubility is the maximum amount of solute that can dissolve in a specific volume of solvent at a set temperature. This gives rise to three saturation states:",
          points: [
            "Unsaturated Solution: Can still dissolve more solute at its current temperature.",
            "Saturated Solution: Contains the absolute maximum amount of dissolved solute for that temperature; any extra solute sinks to the bottom undissolved.",
            "Supersaturated Solution: An unstable solution that holds more dissolved solute than it normally should, created by dissolving excess solute at high temperatures and cooling it slowly."
          ]
        },
        {
          heading: "Factors Affecting Solubility",
          text: "Four main environmental triggers change how fast and how much solute dissolves:",
          points: [
            "Temperature: Raising heat increases solubility for most solid solutes, but decreases solubility for gaseous solutes.",
            "Stirring / Agitation: Mechanically brings solvent molecules into faster contact with the solute, speeding up the rate of dissolving.",
            "Particle Size (Surface Area): Crushing a solid solute into a fine powder exposes more surface area, accelerating dissolution.",
            "Nature of Solute and Solvent: Regulated by the rule 'like dissolves like' (polar solvents dissolve polar/ionic solutes; non-polar solvents dissolve non-polar solutes)."
          ]
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
      introduction: "Solutions found in everyday life can be classified chemically into acids, bases, or neutral salts. Understanding their interactions allows us to determine their proper use and manage them safely.",
      sections: [
        {
          heading: "Acids, Bases, and Salts Table",
          text: "Substances are categorized based on their taste, physical feel, and chemical reactivity:",
          subsections: [
            {
              title: "Acids",
              desc: "Taste sour, are corrosive, react with metals to produce hydrogen gas, and turn blue litmus paper red (e.g., vinegar, lemon juice)."
            },
            {
              title: "Bases",
              desc: "Taste bitter, feel slippery/soapy, are caustic to organic tissue, and turn red litmus paper blue (e.g., soap, bleach, baking soda)."
            },
            {
              title: "Salts",
              desc: "Neutral compounds formed when an acid and a base counteract and neutralize one another; they cause no color changes on litmus paper."
            }
          ]
        },
        {
          heading: "Chemical Indicators",
          text: "An indicator is a compound that shifts colors across different chemical environments. While litmus paper is a standard laboratory tool, natural indicators can be cleanly extracted from common plant pigments found in red cabbage, purple sweet potato, or hibiscus flowers."
        },
        {
          heading: "Safety in Handling Solutions and Chemicals",
          text: "Meticulous safety handling protocols must be strictly maintained. Always wear protective gloves and eyewear when working with strong household acids (like muriatic acid) or strong corrosive bases (like liquid drain cleaner/lye). If accidental contact occurs, flush the area immediately with large volumes of running water for at least 15 minutes."
        }
      ]
    }
  },
  {
    id: 'biology-fundamentals',
    title: 'Biology Basics',
    category: 'Biology',
    description: 'Introduction to cellular biology, structural organizations, and cell theory fundamentals.',
    content: { introduction: "An introductory read exploring structural cell mechanisms, organelles, and basic biological classification frameworks." }
  },
  {
    id: 'physics-fundamentals',
    title: 'Physics Principles',
    category: 'Physics',
    description: 'Core concepts exploring Newtonian mechanics, force interactions, and foundational energy laws.',
    content: { introduction: "Understanding basic laws of motion, dynamic system vectors, and kinetic energy calculations." }
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