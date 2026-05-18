// SolarSystemData.jsx
export const planets = [
  {
    name: "Mercury",
    size: 6,
    distance: 50,
    color: "#A5A5A5",
    speed: 8,
    desc: "A cratered world baked by the Sun, Mercury is the smallest planet and has no atmosphere to trap heat.",
    fact: "A day on Mercury lasts 59 Earth days."
  },
  {
    name: "Venus",
    size: 10,
    distance: 75,
    color: "#E3BB76",
    speed: 12,
    desc: "Often called Earth's twin, Venus is trapped in a runaway greenhouse effect making it the hottest planet.",
    fact: "It spins backward compared to most other planets."
  },
  {
    name: "Earth",
    size: 11,
    distance: 105,
    color: "#2271B3",
    speed: 18,
    desc: "Our home base. The only known world with liquid water on the surface and a nitrogen-oxygen atmosphere.",
    fact: "Earth is the only planet not named after a god."
  },
  {
    name: "Mars",
    size: 9,
    distance: 135,
    color: "#E27B58",
    speed: 24,
    desc: "The Red Planet is a cold, desert world. It has seasons, polar ice caps, and extinct volcanoes.",
    fact: "Mars is home to Olympus Mons, the tallest volcano in the solar system."
  },
  {
    name: "Jupiter",
    size: 22,
    distance: 180,
    color: "#D39C7E",
    speed: 45,
    desc: "A gas giant more than twice as massive as all the other planets combined.",
    fact: "Jupiter has 95 officially recognized moons."
  },
  {
    name: "Saturn",
    size: 19,
    distance: 230,
    color: "#C5AB6E",
    speed: 60,
    hasRings: true,
    desc: "Adorned with a complex system of icy rings, Saturn is a gas giant made mostly of hydrogen and helium.",
    fact: "Saturn could float in water because it is mostly gas."
  },
  {
    name: "Uranus",
    size: 14,
    distance: 275,
    color: "#BBE1E4",
    speed: 85,
    desc: "An ice giant that rotates at a nearly 90-degree angle from the plane of its orbit.",
    fact: "Uranus was the first planet discovered with a telescope."
  },
  {
    name: "Neptune",
    size: 14,
    distance: 315,
    color: "#6081FF",
    speed: 110,
    desc: "The most distant major planet orbiting our Sun, Neptune is dark, cold and whipped by supersonic winds.",
    fact: "Neptune has the strongest winds in the solar system."
  }
];

export const sunData = {
  name: "Sun",
  size: 50,
  color: "from-orange-500 via-yellow-400 to-white",
  glowColor: "#f59e0b"
};