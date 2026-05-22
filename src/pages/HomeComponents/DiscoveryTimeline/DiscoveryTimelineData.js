// data/DiscoveryTimelineData.js

// Hardcoded explicit base reference date for weekly indexing comparisons
export const TIMELINE_ANCHOR_DATE = "2026-05-20T00:00:00";

export const timelineThemes = [
  {
    id: "computers",
    title: "Evolution of Computers Timeline 💻",
    description: "From giant vacuum tube mainframes to quantum processors and AI-powered edge devices.",
    events: [
      { 
        year: "1943", 
        title: "ENIAC Mainframe", 
        shortDesc: "First programmable electronic computer", 
        longDesc: "The Electronic Numerical Integrator and Computer (ENIAC) was the world's first general-purpose digital computer. Taking up an entire room, it utilized plugboards and switches to compute complex ballistic trajectories.", 
        icon: "📟", 
        color: "blue",
        image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "1950s", 
        title: "Vacuum Tubes", 
        shortDesc: "First generation hardware components", 
        longDesc: "Early computing architectures relied entirely on glass vacuum tubes for internal circuitry control. They generated massive amounts of heat, required frequent manual maintenance, and used magnetic drums for data memory.", 
        icon: "🎛️", 
        color: "purple",
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "1971", 
        title: "Intel Microprocessor", 
        shortDesc: "The single-chip revolution", 
        longDesc: "The launch of the Intel 4004 combined all CPU capabilities onto a single piece of silicon. This microchip breakthrough paved the way for small, accessible personal computers (PCs) instead of building floor-wide mainframes.", 
        icon: "🎚️", 
        color: "emerald",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "1980s", 
        title: "The PC Era", 
        shortDesc: "Computers enter the home", 
        longDesc: "Devices like the IBM PC and Apple Macintosh made computing user-friendly. Command lines eventually shifted into Graphical User Interfaces (GUIs), introducing mice, folders, and personal desktop applications.", 
        icon: "🖥️", 
        color: "amber",
        image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "2000s", 
        title: "Mobile Computing", 
        shortDesc: "Smartphones change connectivity", 
        longDesc: "High-density lithium-ion chemistries, capacitive multi-touch screens, and miniature SoC chipsets turned computers into pocketsize companions, linking global communications with a permanent wireless web network.", 
        icon: "📱", 
        color: "rose",
        image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=80"
      },
      { 
        year: "2020s", 
        title: "AI-Powered Systems", 
        shortDesc: "Local Neural Engine chips", 
        longDesc: "Modern compute architectures utilize dedicated hardware accelerators called Neural Processing Units (NPUs). These handle trillions of complex matrix mathematics equations locally per second to power real-time AI logic natively.", 
        icon: "🧠", 
        color: "cyan",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "atomic-model",
    title: "Atomic Model Timeline ⚛️",
    description: "The historical conceptual journey of unlocking the structure of matter and quantum mechanics.",
    events: [
      {
        year: "400 BC",
        title: "Democritus",
        shortDesc: "The original 'Atomos' theory",
        longDesc: "Greek philosopher Democritus proposed that all matter is made up of tiny, indivisible, and indestructible building blocks called 'atomos'. His conceptual breakthrough lacked empirical evidence but established structural atomism.",
        icon: "💭",
        color: "amber",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1803",
        title: "John Dalton",
        shortDesc: "Solid Sphere Model",
        longDesc: "John Dalton transformed philosophy into chemical science by formulating the first modern atomic theory. He proposed that elements consist of identical spherical atoms of specific weights that combine in fixed ratios.",
        icon: "🔮",
        color: "blue",
        image: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1897",
        title: "J.J. Thomson",
        shortDesc: "Plum Pudding Model",
        longDesc: "Using cathode ray tube experiments, J.J. Thomson discovered the electron. He visualized the atom as a positively charged sphere packed with tiny, negatively charged embedded corpuscles, breaking the theory of indivisible atoms.",
        icon: "🍮",
        color: "purple",
        image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1911",
        title: "Ernest Rutherford",
        shortDesc: "The Nuclear Model Breakthrough",
        longDesc: "Through his famous gold foil experiment, Rutherford observed alpha particles deflecting at extreme angles. He proved that the atom is mostly empty space with a dense, positively charged nucleus core at its center.",
        icon: "🎯",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1913",
        title: "Niels Bohr",
        shortDesc: "Planetary Orbit Model",
        longDesc: "Niels Bohr adapted quantum constraints to the nuclear map, suggesting electrons travel around the nucleus in fixed, quantized circular paths. Electrons jump between energy levels by emitting or absorbing light photons.",
        icon: "🪐",
        color: "rose",
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1926",
        title: "Quantum Model",
        shortDesc: "Electron Cloud Probability Map",
        longDesc: "Erwin Schrödinger and Werner Heisenberg discarded strict orbits for probability waves. The modern cloud model uses complex equations to trace mathematical orbital densities where finding an electron is most probable.",
        icon: "☁️",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "space-exploration",
    title: "Space Exploration Timeline 🚀",
    description: "Humanity's journey to leave the cradle of Earth and explore the vast cosmic ocean.",
    events: [
      {
        year: "1957",
        title: "Sputnik 1",
        shortDesc: "First artificial satellite in orbit",
        longDesc: "The Soviet Union launched Sputnik 1 into low Earth orbit, initiating the competitive Space Race. It transmitted basic radio beeps back to Earth for three weeks before burning up in the atmosphere.",
        icon: "📡",
        color: "blue",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1969",
        title: "Apollo 11",
        shortDesc: "First humans on the Moon",
        longDesc: "NASA's historic lunar module landed on the Sea of Tranquility. Astronaut Neil Armstrong became the first human to step onto an extraterrestrial world, fulfilling a monumental engineering milestone.",
        icon: "👨‍🚀",
        color: "amber",
        image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1997",
        title: "Mars Pathfinder",
        shortDesc: "Sojourner micro-rover arrives",
        longDesc: "Pathfinder deployed Sojourner, the first successful mobile robotic rover on Mars. It analyzed red soil chemistry and proved that autonomous rovers could survive the harsh planetary environment.",
        icon: "🚜",
        color: "rose",
        image: "https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2021",
        title: "James Webb Telescope",
        shortDesc: "Next-gen infrared observatory",
        longDesc: "Launched into deep space at the L2 Lagrange point, the JWST utilizes massive gold-plated mirrors and cryocoolers to peer through cosmic dust, capturing the first galaxies formed after the Big Bang.",
        icon: "🔭",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2020s",
        title: "Commercial Space Era",
        shortDesc: "Reusable rockets & Artemis plans",
        longDesc: "The emergence of rapid vertical rocket landing capabilities drastically reduced launch costs. Private space corporations and global alliances are currently establishing deep space lunar bases.",
        icon: "✨",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "medicine",
    title: "History of Medicine Timeline 🩺",
    description: "From eradicating ancient plagues to programming custom genetic therapies.",
    events: [
      {
        year: "1796",
        title: "Smallpox Vaccine",
        shortDesc: "The birth of immunization",
        longDesc: "Edward Jenner noticed milkmaids were immune to smallpox due to cowpox exposure. He successfully inoculated a boy with cowpox matter, creating the world's first true scientific vaccine strategy.",
        icon: "💧",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1895",
        title: "X-Rays Discovered",
        shortDesc: "Peering inside the living body",
        longDesc: "Wilhelm Röntgen stumbled upon electromagnetic radiation waves while experimenting with vacuum tubes. He captured the iconic internal image of his wife's hand bones, revolutionizing diagnostic medicine.",
        icon: "🩻",
        color: "blue",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1928",
        title: "Penicillin Unlocked",
        shortDesc: "The antibiotic miracle age",
        longDesc: "Alexander Fleming returned to his lab to find Penicillium mold killing off surrounding Staphylococcus bacteria dishes. This discovery birthed mass-produced antibiotics, saving millions from infections.",
        icon: "💊",
        color: "purple",
        image: "https://images.unsplash.com/photo-1628771065518-0d82f1113871?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1967",
        title: "Heart Transplant",
        shortDesc: "First successful organ swap",
        longDesc: "Dr. Christiaan Barnard performed the first human-to-human heart transplant in South Africa. Though the patient survived only 18 days, it paved the way for modern immunosuppressant drugs and complex surgeries.",
        icon: "❤️",
        color: "rose",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2020s",
        title: "Biotechnology & mRNA",
        shortDesc: "Programmable synthetic health",
        longDesc: "Modern medical delivery mechanisms leverage highly tailored mRNA instructions and 3D organ bio-printing tracks, shifting clinical priorities from generic symptom management toward precise cellular curation.",
        icon: "🧬",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "communication",
    title: "Evolution of Communication Technology Timeline 📡",
    description: "The historical path of compressing distance and connecting human minds globally.",
    events: [
      {
        year: "1837",
        title: "The Telegraph",
        shortDesc: "Instant electronic pulses",
        longDesc: "Samuel Morse and partners commercialized the electrical telegraph network. By converting alphabetical strings into discrete patterns of dots and dashes, message transit drops from weeks to fractions of a second.",
        icon: "🔌",
        color: "amber",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1876",
        title: "The Telephone",
        shortDesc: "Voice transmission over copper",
        longDesc: "Alexander Graham Bell patented acoustic electronic synthesis, transmitting the first clear vocal phrase over an isolated wire. This laid down the planetary infrastructure for global telecommunication loops.",
        icon: "☎️",
        color: "blue",
        image: "https://images.unsplash.com/photo-1520923642038-b4259a3199c3?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1895",
        title: "Wireless Radio",
        shortDesc: "Breaking the physical tether",
        longDesc: "Guglielmo Marconi conducted pioneering experiments sending long-distance radio waves across open spaces without tethered copper links, enabling continuous communication across oceans.",
        icon: "📻",
        color: "purple",
        image: "https://images.unsplash.com/photo-1551633512-bc7cc39c2980?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1969",
        title: "ARPANET / Internet",
        shortDesc: "Birth of distributed packet networks",
        longDesc: "The Advanced Research Projects Agency connected nodes between distant universities to share data packets. This underlying infrastructure eventually scaled into the open World Wide Web protocol stack.",
        icon: "🌐",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2007",
        title: "Smartphone Explosion",
        shortDesc: "The continuous pocket network",
        longDesc: "The debut of highly advanced pocket computing form factors localized high-speed internet, real-time geolocation mapping, and persistent global social networking directly into standard human routines.",
        icon: "📱",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "transportation",
    title: "Evolution of Transportation Timeline 🚗✈️",
    description: "How civilization conquered physical terrain, oceans, atmospheres, and orbital tracks.",
    events: [
      {
        year: "3500 BC",
        title: "Invention of the Wheel",
        shortDesc: "The foundational mechanical hub",
        longDesc: "Originating in ancient Mesopotamia, structural potters' wheels were adapted for transport carts. This simple structural mechanical axis dramatically amplified agricultural logistics and migration capacity.",
        icon: "⭕",
        color: "amber",
        image: "https://images.unsplash.com/photo-1519074069444-1ba4aaf7207c?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1769",
        title: "Steam Locomotive",
        shortDesc: "The industrial traction leap",
        longDesc: "By leveraging expanding steam pressure generated from burning fossil coal reserves, heavy mechanical engines bypassed horse dependencies, standardizing scheduled overland economic trade lines.",
        icon: "🚂",
        color: "purple",
        image: "https://images.unsplash.com/photo-1532103054090-334e6e60ab29?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1903",
        title: "Wright Brothers' Flight",
        shortDesc: "First controlled powered aviation",
        longDesc: "Orville and Wilbur Wright executed the first sustained, aerodynamic controlled flight of a powered, heavier-than-air aircraft at Kitty Hawk, fulfilling a historical atmospheric engineering milestone.",
        icon: "🛩️",
        color: "blue",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2008",
        title: "Modern EV Revolution",
        shortDesc: "Transition to electric drivetrains",
        longDesc: "The scaling of performance electric powertrains and dense lithium pack management proved that clean vehicles could outperform internal combustion options, initializing a massive shift away from fossil fuels.",
        icon: "⚡",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2020s",
        title: "Commercial Space Tourism",
        shortDesc: "Private suborbital flight tracks",
        longDesc: "Advancements in automated aerospace vertical recovery allowed regular non-astronaut travelers to buy passages past the Karman Line into zero-gravity trajectories, reshaping future luxury tourism.",
        icon: "🚀",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "periodic-table",
    title: "Periodic Table Development Timeline 🧪",
    description: "The systemic cataloging of the elemental building blocks of the observable cosmos.",
    events: [
      {
        year: "1789",
        title: "First Element Catalog",
        shortDesc: "Lavoisier's foundational list",
        longDesc: "Antoine Lavoisier published the first modern list of 33 distinct chemical substances, grouping them loosely into gases, non-metals, metals, and earths, helping overthrow ancient alchemical trends.",
        icon: "📝",
        color: "blue",
        image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1829",
        title: "Döbereiner's Triads",
        shortDesc: "Recognizing early atomic patterns",
        longDesc: "Johann Döbereiner noticed groups of three elements where the middle element's atomic weight was the average of the other two. This opened up investigations into repeating physical periodicity.",
        icon: "🔺",
        color: "purple",
        image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1869",
        title: "Mendeleev's Matrix",
        shortDesc: "Predicting undiscovered matter",
        longDesc: "Dmitri Mendeleev organized elements by increasing atomic mass. Crucially, he left strategic empty gaps in his table layout, confidently predicting the exact density and mass properties of elements yet to be discovered.",
        icon: "📊",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1913",
        title: "Moseley's Numbers",
        shortDesc: "Sorting by true nuclear charge",
        longDesc: "Henry Moseley analyzed X-ray spectra outputs to prove that elements are perfectly ordered by atomic number (proton count) rather than atomic mass, fixing minor anomalies in Mendeleev's layout.",
        icon: "🔢",
        color: "rose",
        image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2016",
        title: "Row 7 Completion",
        shortDesc: "Nihonium through Oganesson",
        longDesc: "The IUPAC officially finalized the names for elements 113, 115, 117, and 118, fully completing the final synthetic tracks of the seventh row of the modern standard periodic layout.",
        icon: "👑",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "genetics",
    title: "DNA and Genetics Discoveries Timeline 🧬",
    description: "The structural resolution of life's biological operating instructions.",
    events: [
      {
        year: "1865",
        title: "Mendelian Inheritance",
        shortDesc: "The pea plant experiments",
        longDesc: "Monk Gregor Mendel cross-bred thousands of pea plants to track how traits inherit across generations. He proved that physical features pass down via discrete dominant or recessive units, now called genes.",
        icon: "🌱",
        color: "emerald",
        image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1953",
        title: "The Double Helix",
        shortDesc: "Mapping structural blueprint maps",
        longDesc: "Leveraging Rosalind Franklin's critical X-ray diffraction images, James Watson and Francis Crick modeled the double helix DNA structure, explaining how genetic data replicates without errors.",
        icon: "🌀",
        color: "blue",
        image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2003",
        title: "Human Genome Project",
        shortDesc: "The complete sequence log",
        longDesc: "An international collaborative mega-project successfully read all three billion chemical base pairs making up human DNA, establishing an open reference library for comparative medical science.",
        icon: "🗺️",
        color: "purple",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2012",
        title: "CRISPR-Cas9 Unlocked",
        shortDesc: "Precision molecular editing",
        longDesc: "Jennifer Doudna and Emmanuelle Charpentier adapted a bacterial immune mechanism into an easily programmable molecular toolkit, allowing researchers to cut and edit DNA segments with pinpoint accuracy.",
        icon: "✂️",
        color: "rose",
        image: "https://images.unsplash.com/photo-1628771065518-0d82f1113871?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2020s",
        title: "Personalized Therapeutics",
        shortDesc: "In-vivo genetic corrections",
        longDesc: "Clinical trials have scaled to deploy genetic repairs inside living human tissues, treating inherited blindness, cell disorders, and malignant tumors through highly tailored, patient-specific molecular tailoring.",
        icon: "🎯",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "robotics-ai",
    title: "Robotics and Artificial Intelligence Timeline 🤖",
    description: "The historical path from clockwork mechanical automatons to complex generative neural brains.",
    events: [
      {
        year: "1495",
        title: "Mechanical Knight",
        shortDesc: "Da Vinci's humanoid clockwork",
        longDesc: "Leonardo da Vinci sketched plans for an intricate armor-clad mechanical knight. Driven by internal pulleys and gears, it could sit down, move its arms, and lift its visor, starting the humanoid mechanical lineage.",
        icon: "⚙️",
        color: "amber",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1950",
        title: "The Turing Test",
        shortDesc: "Can a machine think?",
        longDesc: "Alan Turing published his landmark paper establishing a conversational imitation game benchmark. He proposed that if a machine conversationally fools humans into believing it is human, it exhibits intelligence.",
        icon: "📋",
        color: "blue",
        image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1961",
        title: "Unimate Robot",
        shortDesc: "First industrial factory line robot",
        longDesc: "General Motors deployed the Unimate mechanical arm on its assembly floor. It automated hazardous tasks like picking up glowing, hot diecast metals, initiating modern manufacturing automation.",
        icon: "🦾",
        color: "purple",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "1997",
        title: "Deep Blue Defeat",
        shortDesc: "Supercomputer beats chess champion",
        longDesc: "IBM's Deep Blue defeated world chess champion Garry Kasparov in a formal six-game match. It used advanced brute-force parallel processing chips to evaluate up to 200 million distinct chess moves per second.",
        icon: "♟️",
        color: "rose",
        image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2022",
        title: "Generative LLM Explosion",
        shortDesc: "Cognitive transformer scaling",
        longDesc: "The rapid consumer scaling of Transformer-based models transformed AI into a contextual, generative collaborator. These models manipulate logical code, write text, and process complex multimodal datasets fluently.",
        icon: "🧠",
        color: "cyan",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

export const getEventColor = (color) => {
  const colors = {
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/50 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/50 text-purple-400",
    rose: "from-rose-500/20 to-rose-600/10 border-rose-500/50 text-rose-400",
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/50 text-cyan-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/50 text-amber-400"
  };
  return colors[color] || colors.blue;
};