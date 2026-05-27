import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Typography, Box, Divider, IconButton } from '@mui/material';
import { create } from 'zustand';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Zustand store
const useCellStore = create((set) => ({
  selected: 'nucleus',
  cellType: 'plant',
  carouselIndex: 0,
  setSelected: (id) => set({ selected: id }),
  setCellType: (type) => set({ cellType: type, selected: 'nucleus', carouselIndex: 0 }),
  setCarouselIndex: (index) => set({ carouselIndex: index }),
}));

// Full organelle data for Plant & Animal cells
export const organelles = {
  plant: [
    {
      id: "nucleus",
      title: "Nucleus",
      desc: "Control center of the cell.",
      function: "Stores DNA and controls cell activities.",
      image: "/organelle/nucleus.png"
    },
    {
      id: "chloroplast",
      title: "Chloroplast",
      desc: "Photosynthesis site.",
      function: "Converts sunlight into glucose (energy).",
      image: "/organelle/chloroplast.png"
    },
    {
      id: "cell_wall",
      title: "Cell Wall",
      desc: "Rigid outer layer.",
      function: "Provides structure and protection.",
      image: "/organelle/cellwall.png"
    },
    {
      id: "vacuole",
      title: "Central Vacuole",
      desc: "Storage organelle.",
      function: "Stores water, nutrients, and waste.",
      image: "/organelle/vacuole.png"
    },
    {
      id: "mitochondria",
      title: "Mitochondria",
      desc: "Energy producer.",
      function: "Generates ATP through respiration.",
      image: "/organelle/mitochondria.png"
    },
    {
      id: "ribosome",
      title: "Ribosome",
      desc: "Protein factory.",
      function: "Synthesizes proteins.",
      image: "/organelle/ribosome.png"
    }
  ],
  animal: [
    {
      id: "nucleus",
      title: "Nucleus",
      desc: "Control center of the cell.",
      function: "Stores DNA and controls cell activities.",
      image: "/organelle/nucleus.png"
    },
    {
      id: "mitochondria",
      title: "Mitochondria",
      desc: "Energy powerhouse.",
      function: "Produces ATP for cell energy.",
      image: "/organelle/mitochondria.png"
    },
    {
      id: "lysosome",
      title: "Lysosome",
      desc: "Waste disposal system.",
      function: "Breaks down waste and old cell parts.",
      image: "/organelle/lysosome.png"
    },
    {
      id: "centrosome",
      title: "Centrosome",
      desc: "Cell division organizer.",
      function: "Helps in spindle formation during mitosis.",
      image: "/organelle/centrosome.png"
    },
    {
      id: "ribosome",
      title: "Ribosome",
      desc: "Protein factory.",
      function: "Synthesizes proteins.",
      image: "/organelle/ribosome.png"
    },
    {
      id: "golgi",
      title: "Golgi Apparatus",
      desc: "Packaging center.",
      function: "Modifies and transports proteins.",
      image: "/organelle/golgi.png"
    }
  ]
};

// Functional Carousel Component with auto-scroll and navigation
function OrganelleCarousel() {
  const { cellType, setSelected, selected, carouselIndex, setCarouselIndex } = useCellStore();
  const data = organelles[cellType];
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);

  // Find current index based on selected organelle
  useEffect(() => {
    const currentIndex = data.findIndex(org => org.id === selected);
    if (currentIndex !== -1 && currentIndex !== carouselIndex) {
      setCarouselIndex(currentIndex);
      scrollToIndex(currentIndex);
    }
  }, [selected, data]);

  // Scroll to specific index with smooth animation
  const scrollToIndex = (index) => {
    if (scrollRef.current && itemRefs.current[index]) {
      const container = scrollRef.current;
      const item = itemRefs.current[index];
      const itemLeft = item.offsetLeft;
      const itemCenter = itemLeft + item.offsetWidth / 2;
      const containerCenter = container.offsetWidth / 2;
      
      container.scrollTo({
        left: itemCenter - containerCenter,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, carouselIndex - 1);
    setCarouselIndex(newIndex);
    setSelected(data[newIndex].id);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(data.length - 1, carouselIndex + 1);
    setCarouselIndex(newIndex);
    setSelected(data[newIndex].id);
    scrollToIndex(newIndex);
  };

  const handleItemClick = (index, id) => {
    setCarouselIndex(index);
    setSelected(id);
    scrollToIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      {carouselIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        >
          <ChevronLeftIcon />
        </button>
      )}
      
      {carouselIndex < data.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto flex gap-4 p-4 scrollbar-thin scrollbar-thumb-white/20 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollBehavior: 'smooth' }}
      >
        {data.map((organelle, index) => (
          <motion.div
            key={organelle.id}
            ref={el => itemRefs.current[index] = el}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleItemClick(index, organelle.id)}
            className={`min-w-[180px] rounded-2xl p-4 cursor-pointer backdrop-blur-xl border transition-all duration-200
              ${selected === organelle.id 
                ? "border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20 scale-105" 
                : "border-white/10 bg-white/5 hover:bg-white/10"
              }
            `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <img
              src={organelle.image}
              alt={organelle.title}
              className="w-full h-20 object-contain mb-2"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Organelle'; }}
            />
            <h3 className="text-white font-bold text-sm text-center">{organelle.title}</h3>
            <p className="text-xs text-slate-300 mt-1 text-center line-clamp-2">{organelle.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-3">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCarouselIndex(index);
              setSelected(data[index].id);
              scrollToIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === carouselIndex 
                ? 'w-6 bg-emerald-400' 
                : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CellModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} />;
}

export default function App() {
  const { selected, cellType, setCellType, carouselIndex } = useCellStore();
  
  // Get selected organelle details for the info panel
  const selectedOrganelle = organelles[cellType].find(org => org.id === selected) || organelles[cellType][0];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 p-6 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-emerald-900/40" />
      
      <div className="relative grid grid-cols-5 grid-rows-5 gap-6 h-[90vh] w-[95vw] z-10">
        {/* 3D Viewport */}
        <div className="col-span-3 row-span-5 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <Stage environment="city" intensity={0.5}>
              <CellModel modelUrl={`/cellmodels/${cellType}cell.glb`} />
            </Stage>
            <OrbitControls makeDefault enablePan={false} dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* Information Dashboard with Carousel */}
        <div className="col-span-2 row-span-5 col-start-4 bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <Typography variant="h4" className="font-extrabold text-white">
              {cellType.toUpperCase()} CELL
            </Typography>
            <div className="text-xs text-emerald-400 font-mono">
              {carouselIndex + 1} / {organelles[cellType].length}
            </div>
          </div>
          
          {/* Carousel Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4">
            <OrganelleCarousel />
            
            {/* Selected Organelle Details Panel with animation */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={selected}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
              >
                <Typography variant="h5" className="text-emerald-400 font-bold mb-3">
                  {selectedOrganelle.title}
                </Typography>
                <Typography variant="body2" className="text-slate-300 mb-3 leading-relaxed">
                  {selectedOrganelle.desc}
                </Typography>
                <Divider className="!border-white/10 !my-3" />
                <div className="flex items-start gap-2">
                  <div className="w-1 h-6 bg-emerald-400 rounded-full mt-0.5" />
                  <div>
                    <Typography variant="caption" className="block text-emerald-400 font-bold uppercase tracking-wider mb-1">
                      Function
                    </Typography>
                    <Typography variant="body2" className="text-white/80 leading-relaxed">
                      {selectedOrganelle.function}
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button 
              onClick={() => setCellType('plant')} 
              className={`flex-1 p-3 rounded-xl font-bold transition-all duration-200 ${
                cellType === 'plant' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:scale-105'
              }`}
            >
              🌱 Plant Cell
            </button>
            <button 
              onClick={() => setCellType('animal')} 
              className={`flex-1 p-3 rounded-xl font-bold transition-all duration-200 ${
                cellType === 'animal' 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:scale-105'
              }`}
            >
              🧬 Animal Cell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}