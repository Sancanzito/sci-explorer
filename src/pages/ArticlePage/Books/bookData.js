const sections = [
  {
    id: 'why',
    title: 'WHY Questions',
    subtitle: 'Understanding Causes and Explanations',
    route: '/science-quest/why',
    gradient: 'from-amber-500 to-orange-500',
    color: 'amber',
    questions: [
      "Why is the sky blue?",
      "Why do leaves change color in autumn?",
      "Why do stars twinkle at night?",
      "Why do we have different seasons?",
      "Why do earthquakes happen?",
      "Why do volcanoes erupt?",
      "Why do humans need sleep?",
      "Why do we dream?",
      "Why does ice float on water?",
      "Why is the ocean salty?",
      "Why do animals migrate?",
      "Why do birds fly in formations?",
      "Why do plants need sunlight?",
      "Why do some animals hibernate?",
      "Why do we hiccup?",
      "Why do rainbows appear?",
      "Why does lightning occur?",
      "Why do magnets attract certain metals?",
      "Why do we have fingerprints?",
      "Why do humans age?",
      "Why do mosquitoes bite people?",
      "Why do cats purr?",
      "Why do dogs wag their tails?",
      "Why do some animals glow in the dark?",
      "Why is biodiversity important?"
    ]
  },
  {
    id: 'when',
    title: 'WHEN Questions',
    subtitle: 'Exploring Science Through Time',
    route: '/science-quest/when',
    gradient: 'from-amber-500 to-orange-500',
    color: 'amber',
    questions: [
      "When was fire first controlled by humans?",
      "When did the first dinosaurs appear?",
      "When did dinosaurs become extinct?",
      "When did the first humans evolve?",
      "When was the wheel invented?",
      "When was agriculture first developed?",
      "When was the first civilization established?",
      "When did the Ice Age occur?",
      "When was the telescope invented?",
      "When was the microscope invented?",
      "When did humans first reach the Moon?",
      "When was electricity first discovered?",
      "When did the first fish evolve?",
      "When did flowering plants appear?",
      "When was the first vaccine developed?",
      "When did the first mammals emerge?",
      "When did Earth form?",
      "When did life first appear on Earth?",
      "When was DNA discovered?",
      "When was the first computer created?",
      "When was penicillin discovered?",
      "When did the Industrial Revolution begin?",
      "When did plate tectonics start shaping Earth?",
      "When was the first satellite launched?",
      "When did modern humans begin using language?"
    ]
  },
  {
    id: 'where',
    title: 'WHERE Questions',
    subtitle: 'Discovering Locations and Origins',
    route: '/science-quest/where',
    gradient: 'from-amber-500 to-orange-500',
    color: 'amber',
    questions: [
      "Where is the first known civilization located?",
      "Where is the deepest part of the ocean?",
      "Where do hurricanes form?",
      "Where are most earthquakes found?",
      "Where is the largest desert on Earth?",
      "Where is the tallest mountain located?",
      "Where are fossils commonly found?",
      "Where does fresh water come from?",
      "Where is the largest rainforest?",
      "Where do monarch butterflies migrate?",
      "Where is the Great Barrier Reef located?",
      "Where can active volcanoes be found?",
      "Where do polar bears live?",
      "Where is the Earth's magnetic north pole?",
      "Where are most stars born?",
      "Where is the coldest place on Earth?",
      "Where is the hottest place on Earth?",
      "Where do coral reefs grow best?",
      "Where is the largest canyon on Earth?",
      "Where are black holes found?",
      "Where does photosynthesis occur in plants?",
      "Where is the largest glacier located?",
      "Where do sea turtles lay their eggs?",
      "Where are renewable energy resources commonly found?",
      "Where is the oldest known fossil discovered?"
    ]
  },
  {
    id: 'what',
    title: 'WHAT Questions',
    subtitle: 'Understanding Scientific Concepts and Objects',
    route: '/science-quest/what',
    gradient: 'from-amber-500 to-orange-500',
    color: 'amber',
    questions: [
      "What is the biggest known mammal?",
      "What is the smallest living organism?",
      "What is a black hole?",
      "What is dark matter?",
      "What is photosynthesis?",
      "What is the water cycle?",
      "What is DNA?",
      "What is an ecosystem?",
      "What is the greenhouse effect?",
      "What is biodiversity?",
      "What is gravity?",
      "What is the speed of light?",
      "What is a galaxy?",
      "What is artificial intelligence?",
      "What is renewable energy?",
      "What is climate change?",
      "What is evolution?",
      "What is a cell?",
      "What is the human genome?",
      "What is a comet?",
      "What is an exoplanet?",
      "What is quantum physics?",
      "What is nanotechnology?",
      "What is genetic engineering?",
      "What is the scientific method?"
    ]
  }
];

export const navigationItems = [
  { label: 'Cover', route: 'cover' },
  { label: 'About This Book', route: 'synopsis' },
  { label: 'How to Use', route: 'how-to-use' },
  { label: 'Table of Contents', route: 'table-of-contents' },
  // Removed the sections.map spread here
  { label: 'Completion', route: 'completion' }
];

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

export default sections;
