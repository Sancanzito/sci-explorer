// CellExplorer.jsx (Enhanced with Free Camera Movement)
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Divider, Slider, Tooltip, IconButton } from '@mui/material';
import { create } from 'zustand';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PanToolIcon from '@mui/icons-material/PanTool';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';

// Zustand store with enhanced camera control
const useCellStore = create((set, get) => ({
  selected: 'nucleus',
  cellType: 'plant',
  carouselIndex: 0,
  zoomDir: 0,
  cameraMode: 'orbit', // 'orbit' or 'free'
  showControls: true,
  cameraSpeed: 1,
  setSelected: (id) => set({ selected: id }),
  setCellType: (type) => set({ cellType: type, selected: 'nucleus', carouselIndex: 0 }),
  setCarouselIndex: (index) => set({ carouselIndex: index }),
  setZoomDir: (dir) => set({ zoomDir: dir }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setShowControls: (show) => set({ showControls: show }),
  setCameraSpeed: (speed) => set({ cameraSpeed: speed }),
  resetCamera: () => set({ cameraMode: 'orbit' }),
}));

// Full organelle data for Plant & Animal cells
export const organelles = {
  plant: [
    { id: "nucleus", title: "Nucleus", desc: "Control center of the cell.", function: "Stores DNA and controls cell activities." },
    { id: "chloroplast", title: "Chloroplast", desc: "Photosynthesis site.", function: "Converts sunlight into glucose (energy)." },
    { id: "cell_wall", title: "Cell Wall", desc: "Rigid outer layer.", function: "Provides structure and protection." },
    { id: "cell_membrane", title: "Cell Membrane", desc: "Selective protective barrier.", function: "Controls movement of substances in and out of the cell." },
    { id: "vacuole", title: "Central Vacuole", desc: "Storage organelle.", function: "Stores water, nutrients, and waste." },
    { id: "mitochondria", title: "Mitochondria", desc: "Energy producer.", function: "Generates ATP through respiration." },
    { id: "cytoplasm", title: "Cytoplasm", desc: "Gel-like internal fluid.", function: "Suspends organelles and supports chemical reactions." },
    { id: "rough_er", title: "Rough ER", desc: "Protein processing network.", function: "Synthesizes and transports proteins." },
    { id: "smooth_er", title: "Smooth ER", desc: "Lipid synthesis network.", function: "Produces lipids and detoxifies chemicals." },
    { id: "golgi", title: "Golgi Apparatus", desc: "Packaging and transport center.", function: "Modifies, sorts, and packages proteins." },
    { id: "ribosome", title: "Ribosome", desc: "Protein factory.", function: "Synthesizes proteins." },
    { id: "peroxisome", title: "Peroxisome", desc: "Detoxification organelle.", function: "Breaks down fatty acids and harmful substances." },
    { id: "plasmodesmata", title: "Plasmodesmata", desc: "Cell communication channels.", function: "Allows transport and communication between plant cells." },
    { id: "cytoskeleton", title: "Cytoskeleton", desc: "Internal support framework.", function: "Maintains cell shape and organelle movement." }
  ],
  animal: [
    { id: "nucleus", title: "Nucleus", desc: "Control center of the cell.", function: "Stores DNA and controls cell activities." },
    { id: "nucleolus", title: "Nucleolus", desc: "Structure inside nucleus.", function: "Produces ribosomes." },
    { id: "cell_membrane", title: "Cell Membrane", desc: "Protective flexible barrier.", function: "Regulates movement of substances into and out of the cell." },
    { id: "mitochondria", title: "Mitochondria", desc: "Energy powerhouse.", function: "Produces ATP for cell energy." },
    { id: "cytoplasm", title: "Cytoplasm", desc: "Gel-like internal fluid.", function: "Holds organelles and supports metabolic reactions." },
    { id: "rough_er", title: "Rough ER", desc: "Protein synthesis network.", function: "Produces and folds proteins using ribosomes." },
    { id: "smooth_er", title: "Smooth ER", desc: "Lipid production center.", function: "Synthesizes lipids and detoxifies substances." },
    { id: "golgi", title: "Golgi Apparatus", desc: "Packaging center.", function: "Modifies and transports proteins." },
    { id: "lysosome", title: "Lysosome", desc: "Waste disposal system.", function: "Breaks down waste and old cell parts." },
    { id: "peroxisome", title: "Peroxisome", desc: "Detoxifying organelle.", function: "Breaks down fatty acids and harmful compounds." },
    { id: "centrosome", title: "Centrosome", desc: "Cell division organizer.", function: "Helps in spindle formation during mitosis." },
    { id: "ribosome", title: "Ribosome", desc: "Protein factory.", function: "Synthesizes proteins." },
    { id: "cytoskeleton", title: "Cytoskeleton", desc: "Structural support network.", function: "Maintains cell shape and assists movement." },
    { id: "vesicle", title: "Vesicle", desc: "Transport sac.", function: "Stores and transports materials inside the cell." }
  ]
};

// Custom SVG Organelle Renderer
const OrganelleSvg = ({ id, color = "#10b981" }) => {
  const SvgWrapper = ({ children }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ filter: `drop-shadow(0px 0px 4px ${color})` }}>
      {children}
    </svg>
  );

  switch (id) {
    case "nucleus":
      return <SvgWrapper><circle cx="50" cy="50" r="40" fill={color} opacity="0.4" stroke={color} strokeWidth="2"/><circle cx="65" cy="35" r="15" fill={color} opacity="0.8"/><path d="M 30 50 Q 50 30 70 50 Q 50 70 30 50" fill="none" stroke={color} strokeWidth="1" opacity="0.6"/></SvgWrapper>;
    case "chloroplast":
      return <SvgWrapper><ellipse cx="50" cy="50" rx="45" ry="25" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><rect x="30" y="35" width="10" height="30" rx="2" fill={color}/><rect x="45" y="35" width="10" height="30" rx="2" fill={color}/><rect x="60" y="35" width="10" height="30" rx="2" fill={color}/></SvgWrapper>;
    case "cell_wall":
      return <SvgWrapper><path d="M 15 15 L 85 15 L 85 85 L 15 85 Z" fill="none" stroke={color} strokeWidth="10"/><path d="M 25 25 L 75 25 L 75 75 L 25 75 Z" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/></SvgWrapper>;
    case "vacuole":
      return <SvgWrapper><path d="M 20 50 C 20 20, 80 10, 85 50 C 90 90, 20 80, 20 50 Z" fill={color} opacity="0.4" stroke={color} strokeWidth="2"/></SvgWrapper>;
    case "mitochondria":
      return <SvgWrapper><ellipse cx="50" cy="50" rx="40" ry="20" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><path d="M 20 50 Q 30 25 40 50 T 60 50 T 80 50" fill="none" stroke={color} strokeWidth="3"/></SvgWrapper>;
    case "ribosome":
      return <SvgWrapper><circle cx="45" cy="40" r="15" fill={color} opacity="0.7"/><circle cx="55" cy="60" r="20" fill={color} opacity="0.9"/></SvgWrapper>;
    case "lysosome":
      return <SvgWrapper><circle cx="50" cy="50" r="35" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><circle cx="40" cy="40" r="4" fill={color}/><circle cx="60" cy="45" r="5" fill={color}/><circle cx="45" cy="60" r="3" fill={color}/></SvgWrapper>;
    case "centrosome":
      return <SvgWrapper><rect x="42" y="20" width="16" height="60" fill={color} opacity="0.8" rx="2"/><rect x="20" y="42" width="60" height="16" fill={color} opacity="0.6" rx="2"/></SvgWrapper>;
    case "golgi":
      return <SvgWrapper><path d="M 20 30 Q 50 10 80 30" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"/><path d="M 25 50 Q 50 30 75 50" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"/><path d="M 30 70 Q 50 50 70 70" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"/><circle cx="15" cy="50" r="5" fill={color}/><circle cx="85" cy="60" r="4" fill={color}/></SvgWrapper>;
    case "cell_membrane":
      return <SvgWrapper><circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="4" strokeDasharray="8 4"/><circle cx="50" cy="50" r="34" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/></SvgWrapper>;
    case "cytoplasm":
      return <SvgWrapper><circle cx="50" cy="50" r="45" fill={color} opacity="0.1"/><circle cx="30" cy="30" r="2" fill={color}/><circle cx="70" cy="40" r="3" fill={color}/><circle cx="40" cy="70" r="2" fill={color}/><circle cx="80" cy="75" r="1.5" fill={color}/><circle cx="20" cy="60" r="2.5" fill={color}/></SvgWrapper>;
    case "rough_er":
      return <SvgWrapper><path d="M 20 20 Q 50 50 80 20 M 20 50 Q 50 80 80 50 M 20 80 Q 50 100 80 80" fill="none" stroke={color} strokeWidth="4" opacity="0.7"/><circle cx="30" cy="35" r="3" fill={color}/><circle cx="60" cy="35" r="3" fill={color}/><circle cx="40" cy="65" r="3" fill={color}/><circle cx="70" cy="65" r="3" fill={color}/></SvgWrapper>;
    case "smooth_er":
      return <SvgWrapper><path d="M 20 30 Q 40 10 60 30 T 80 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.8"/><path d="M 30 70 Q 50 90 70 70 T 90 40" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.6"/></SvgWrapper>;
    case "peroxisome":
      return <SvgWrapper><circle cx="50" cy="50" r="35" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><polygon points="50,30 65,50 50,70 35,50" fill={color} opacity="0.8"/></SvgWrapper>;
    case "plasmodesmata":
      return <SvgWrapper><rect x="20" y="20" width="25" height="60" fill={color} opacity="0.5"/><rect x="55" y="20" width="25" height="60" fill={color} opacity="0.5"/><path d="M 45 40 L 55 40 M 45 60 L 55 60" stroke={color} strokeWidth="4"/></SvgWrapper>;
    case "cytoskeleton":
      return <SvgWrapper><line x1="20" y1="20" x2="80" y2="80" stroke={color} strokeWidth="2"/><line x1="20" y1="80" x2="80" y2="20" stroke={color} strokeWidth="2"/><line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="2" opacity="0.5"/><line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="2" opacity="0.5"/></SvgWrapper>;
    case "vesicle":
      return <SvgWrapper><circle cx="50" cy="50" r="25" fill={color} opacity="0.6" stroke={color} strokeWidth="3"/></SvgWrapper>;
    case "nucleolus":
      return <SvgWrapper><circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/><circle cx="50" cy="50" r="20" fill={color} opacity="0.9"/></SvgWrapper>;
    default:
      return <SvgWrapper><circle cx="50" cy="50" r="30" fill={color} opacity="0.5" stroke={color} strokeWidth="2"/></SvgWrapper>;
  }
};

// Carousel Component
function OrganelleCarousel() {
  const { cellType, setSelected, selected, carouselIndex, setCarouselIndex } = useCellStore();
  const data = organelles[cellType];
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const currentIndex = data.findIndex(org => org.id === selected);
    if (currentIndex !== -1 && currentIndex !== carouselIndex) {
      setCarouselIndex(currentIndex);
      scrollToIndex(currentIndex);
    }
  }, [selected, data]);

  const scrollToIndex = (index) => {
    if (scrollRef.current && itemRefs.current[index]) {
      const container = scrollRef.current;
      const item = itemRefs.current[index];
      const itemLeft = item.offsetLeft;
      const itemCenter = itemLeft + item.offsetWidth / 2;
      const containerCenter = container.offsetWidth / 2;
      container.scrollTo({ left: itemCenter - containerCenter, behavior: 'smooth' });
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

  const primaryColor = cellType === 'plant' ? '#10b981' : '#f97316';

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {carouselIndex > 0 && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={handlePrev} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full p-1.5 shadow-lg border border-white/10 backdrop-blur-md">
            <ChevronLeftIcon fontSize="small" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {carouselIndex < data.length - 1 && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={handleNext} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full p-1.5 shadow-lg border border-white/10 backdrop-blur-md">
            <ChevronRightIcon fontSize="small" />
          </motion.button>
        )}
      </AnimatePresence>
      <div ref={scrollRef} className="w-full overflow-x-auto flex gap-4 py-2 px-4 scrollbar-none snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
        {data.map((organelle, index) => (
          <motion.div key={organelle.id} ref={el => itemRefs.current[index] = el} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} onClick={() => handleItemClick(index, organelle.id)} className={`min-w-[160px] snap-center rounded-2xl p-4 cursor-pointer backdrop-blur-xl border transition-all duration-300 relative overflow-hidden ${selected === organelle.id ? `border-${cellType === 'plant' ? 'emerald' : 'orange'}-400/50 bg-${cellType === 'plant' ? 'emerald' : 'orange'}-500/10 shadow-[0_0_20px_rgba(${cellType === 'plant' ? '16,185,129' : '249,115,22'},0.15)]` : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center p-2 transition-all ${selected === organelle.id ? `bg-${cellType === 'plant' ? 'emerald' : 'orange'}-500/20 border border-${cellType === 'plant' ? 'emerald' : 'orange'}-400/30` : 'bg-black/30 border border-white/5'}`}>
                <OrganelleSvg id={organelle.id} color={selected === organelle.id ? primaryColor : '#94a3b8'} />
              </div>
              <h3 className="text-white font-bold text-[14px] text-center tracking-wide">{organelle.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 text-center line-clamp-1">{organelle.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Model Loader
function CellModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} />;
}

// Enhanced Camera Controller with Pan and Free Movement
function SceneControls() {
  const orbitRef = useRef();
  const zoomDir = useCellStore(state => state.zoomDir);
  const resetZoom = useCellStore(state => state.resetZoom);
  const cameraMode = useCellStore(state => state.cameraMode);
  const cameraSpeed = useCellStore(state => state.cameraSpeed);
  const { camera } = useThree();

  // Handle keyboard zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      } else if (e.key === 'p' || e.key === 'P') {
        // Toggle camera mode with 'P' key
        useCellStore.getState().setCameraMode(cameraMode === 'orbit' ? 'free' : 'orbit');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraMode]);

  const zoomIn = () => {
    const currentDistance = camera.position.length();
    if (currentDistance > 0.4) {
      camera.position.multiplyScalar(0.92);
      if (orbitRef.current) orbitRef.current.update();
    }
  };

  const zoomOut = () => {
    const currentDistance = camera.position.length();
    if (currentDistance < 18) {
      camera.position.multiplyScalar(1.08);
      if (orbitRef.current) orbitRef.current.update();
    }
  };

  useFrame((state, delta) => {
    if (zoomDir !== 0 && orbitRef.current) {
      const currentDistance = camera.position.length();
      const zoomSpeed = 3.5 * delta * cameraSpeed;
      
      if (zoomDir === 1 && currentDistance < 0.8) return;
      if (zoomDir === -1 && currentDistance > 18) return;

      const factor = zoomDir === 1 ? (1 - zoomSpeed) : (1 + zoomSpeed);
      camera.position.multiplyScalar(factor);
      orbitRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={orbitRef} 
      makeDefault 
      enablePan={true} 
      enableZoom={true}
      enableRotate={true}
      panSpeed={1.5 * cameraSpeed}
      rotateSpeed={1.2 * cameraSpeed}
      zoomSpeed={1.5 * cameraSpeed}
      dampingFactor={0.05} 
      minDistance={0.8} 
      maxDistance={20} 
    />
  );
}

// Camera Control Panel UI
function CameraControlPanel() {
  const { cameraMode, setCameraMode, showControls, setShowControls, cameraSpeed, setCameraSpeed, resetCamera } = useCellStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const primaryHex = useCellStore(state => state.cellType === 'plant' ? '#10b981' : '#f97316');

  return (
    <motion.div 
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-30"
    >
      <div className="bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-white/10"
        >
          <SettingsIcon sx={{ fontSize: 18, color: primaryHex }} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Camera Controls</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="ml-auto">
            <ChevronLeftIcon sx={{ fontSize: 16, color: 'white' }} className="transform" />
          </motion.div>
        </div>

        {/* Controls Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 min-w-[200px]">
                {/* Camera Mode Toggle */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Camera Mode</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCameraMode('orbit')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        cameraMode === 'orbit' 
                          ? `bg-${useCellStore.getState().cellType === 'plant' ? 'emerald' : 'orange'}-500/30 border border-${useCellStore.getState().cellType === 'plant' ? 'emerald' : 'orange'}-400/50 text-white` 
                          : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                      }`}
                    >
                      <RotateRightIcon sx={{ fontSize: 14 }} />
                      Orbit
                    </button>
                    <button
                      onClick={() => setCameraMode('free')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        cameraMode === 'free' 
                          ? `bg-${useCellStore.getState().cellType === 'plant' ? 'emerald' : 'orange'}-500/30 border border-${useCellStore.getState().cellType === 'plant' ? 'emerald' : 'orange'}-400/50 text-white` 
                          : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                      }`}
                    >
                      <PanToolIcon sx={{ fontSize: 14 }} />
                      Free Pan
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1 text-center">
                    {cameraMode === 'orbit' ? '🔄 Rotate around center' : '✋ Free pan movement'}
                  </p>
                </div>

                {/* Camera Speed Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                    <span>Movement Speed</span>
                    <span className="text-white">{cameraSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={cameraSpeed}
                    onChange={(_, val) => setCameraSpeed(val)}
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    sx={{
                      color: primaryHex,
                      '& .MuiSlider-thumb': {
                        backgroundColor: primaryHex,
                      },
                    }}
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    resetCamera();
                    // Reset camera position via OrbitControls reference
                    const orbitControls = document.querySelector('canvas')?.__r3f?.root?.children?.find(c => c.type === 'OrbitControls');
                    if (orbitControls?.current) {
                      orbitControls.current.target.set(0, 0, 0);
                      orbitControls.current.update();
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                  <CenterFocusStrongIcon sx={{ fontSize: 14 }} />
                  Reset Camera View
                </button>

                {/* Help Text */}
                <div className="text-[9px] text-slate-500 text-center border-t border-white/10 pt-3 mt-2">
                  🖱️ Drag to rotate • Right-click + drag to pan<br/>
                  Scroll to zoom • Press 'P' to toggle mode
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CellExplorer() {
  const { selected, cellType, setCellType, resetZoom, setZoomDir, showControls } = useCellStore();
  const selectedOrganelle = organelles[cellType].find(org => org.id === selected) || organelles[cellType][0];
  const primaryHex = cellType === 'plant' ? '#10b981' : '#f97316';
  const primaryColor = cellType === 'plant' ? 'emerald' : 'orange';

  // Manual zoom controls with state
  const handleZoomIn = () => {
    setZoomDir(1);
    setTimeout(() => setZoomDir(0), 100);
  };

  const handleZoomOut = () => {
    setZoomDir(-1);
    setTimeout(() => setZoomDir(0), 100);
  };

  return (
    <div className="relative h-screen w-full bg-[#020617] p-4 lg:p-8 flex items-center justify-center overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-slate-950" />
        <div className={`absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${cellType === 'plant' ? 'bg-emerald-600' : 'bg-orange-600'}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${cellType === 'plant' ? 'bg-teal-500' : 'bg-rose-600'}`} />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-1 gap-6 h-full max-h-[900px] w-full max-w-[1600px]">
        
        {/* 3D Viewport */}
        <div className="lg:col-span-3 h-[40vh] lg:h-full bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          <div className="absolute top-6 left-6 z-10">
            <div className={`px-4 py-1.5 rounded-full border bg-black/40 backdrop-blur-md flex items-center gap-2 ${cellType === 'plant' ? 'border-emerald-500/30' : 'border-orange-500/30'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${cellType === 'plant' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">3D Explorer</span>
            </div>
          </div>

          {/* Quick Zoom Controls (Left Side) */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-black/50 p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
            <button 
              onPointerDown={handleZoomIn}
              onPointerUp={() => setZoomDir(0)}
              onPointerLeave={() => setZoomDir(0)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-110"
              title="Zoom In (Closer)"
            >
              <ZoomInIcon fontSize="small" />
            </button>
            <div className="w-full h-px bg-white/20" />
            <button 
              onPointerDown={handleZoomOut}
              onPointerUp={() => setZoomDir(0)}
              onPointerLeave={() => setZoomDir(0)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-110"
              title="Zoom Out"
            >
              <ZoomOutIcon fontSize="small" />
            </button>
            <div className="w-full h-px bg-white/20" />
            <button 
              onClick={resetZoom}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-110"
              title="Reset View"
            >
              <RestartAltIcon fontSize="small" />
            </button>
          </div>

          {/* Camera Control Panel (Right Side) */}
          <CameraControlPanel />

          {/* Info Banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/70 border border-white/10 pointer-events-none flex gap-3">
            <span>🖱️ Left-click + drag: Rotate</span>
            <span>✋ Right-click + drag: Pan</span>
            <span>📌 Scroll: Zoom</span>
            <span>⌨️ P: Toggle Mode</span>
          </div>

          <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 5, 0]} intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={0.3} />
            <Stage environment="city" intensity={0.6} adjustCamera={false}>
              <AnimatePresence mode="wait">
                <motion.group
                  key={cellType}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <CellModel modelUrl={`/cellmodels/${cellType}cell.glb`} />
                </motion.group>
              </AnimatePresence>
            </Stage>
            <SceneControls />
          </Canvas>
        </div>

        {/* Info Dashboard */}
        <div className="lg:col-span-2 lg:col-start-4 h-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl flex flex-col min-h-0 relative overflow-hidden">
          
          <div className="flex-shrink-0 flex justify-between items-center mb-6">
            <div>
              <Typography variant="h4" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight leading-none">
                {cellType.toUpperCase()} CELL
              </Typography>
              <Typography variant="caption" className="text-slate-400 uppercase tracking-widest mt-1 block">
                Interactive 3D Model
              </Typography>
            </div>
            <div className={`text-xs font-mono px-3 py-1 rounded-full border bg-black/30 backdrop-blur-md ${cellType === 'plant' ? 'text-emerald-400 border-emerald-500/30' : 'text-orange-400 border-orange-500/30'}`}>
              🧬 Live
            </div>
          </div>
          
          <div className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
            <div className="flex-shrink-0">
              <OrganelleCarousel />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={selected}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-[200px] p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 shadow-inner"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 w-12 h-12 rounded-lg bg-${primaryColor}-500/20 border border-${primaryColor}-500/30 flex items-center justify-center`}>
                    <OrganelleSvg id={selectedOrganelle.id} color={primaryHex} />
                  </div>
                  <Typography variant="h5" className={`text-${primaryColor}-400 font-bold tracking-tight`}>
                    {selectedOrganelle.title}
                  </Typography>
                </div>
                
                <Typography variant="body1" className="text-slate-200/90 leading-relaxed font-light mb-4">
                  {selectedOrganelle.desc}
                </Typography>
                
                <Divider className="!border-white/10 !my-4" />
                
                <div className="flex items-stretch gap-4 mt-auto bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className={`w-1 rounded-full flex-shrink-0 bg-gradient-to-b ${cellType === 'plant' ? 'from-emerald-400 to-teal-600' : 'from-orange-400 to-rose-600'}`} />
                  <div>
                    <Typography variant="overline" className={`block font-bold uppercase tracking-widest mb-1 leading-none text-${primaryColor}-400/80`}>
                      Primary Function
                    </Typography>
                    <Typography variant="body2" className="text-white/95 leading-relaxed text-[15px]">
                      {selectedOrganelle.function}
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-shrink-0 flex gap-4 pt-6 mt-4 border-t border-white/10">
            <button onClick={() => setCellType('plant')} className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${cellType === 'plant' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)] border border-emerald-400/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'}`}>
              🌱 PLANT CELL
            </button>
            <button onClick={() => setCellType('animal')} className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${cellType === 'animal' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] border border-orange-400/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'}`}>
              🧬 ANIMAL CELL
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}