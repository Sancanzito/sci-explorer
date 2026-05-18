// SolarSystemCardData.jsx
import { planets } from './SolarSystemData';

const NATURAL_IMAGES = {
  Mercury: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
  Venus: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
  Earth: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
  Mars: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  Jupiter: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
  Saturn: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
  Uranus: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
  Neptune: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
};

export const planetCardData = planets.map(planet => ({
  ...planet,
  imageUrl: NATURAL_IMAGES[planet.name] || `https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400`,
  imageAlt: `Natural satellite view of ${planet.name}`
}));

export const getPlanetStyles = (color) => ({
  glow: {
    boxShadow: `0 0 40px ${color}66`,
    border: `1px solid ${color}44`
  },
  button: "hover:bg-white/10 transition-colors rounded-full p-2"
});