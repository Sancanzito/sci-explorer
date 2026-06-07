import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer, Entity, PointGraphics, Scene, GeoJsonDataSource } from 'resium';
import { Cartesian3, Color, Ion } from 'cesium';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, Info, Map, X, Layers, AlertCircle } from 'lucide-react';

// IMPORTANT: Set your Cesium Ion token here (or from your .env file)
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMzhlOGY3Yi1lNjc0LTRhZmItODJlZi03ZDFjY2IwMmE3YTciLCJpZCI6NDQxMjYwLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODA4MTkxMDV9.mnngKfpDPZS_2WU19KI33fdH8HGFrSM-mQpd7Vu6RAY";

// Publicly available scientific GeoJSON dataset for tectonic plate boundaries
const TECTONIC_PLATES_GEOJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// USGS Live Earthquake Data (Magnitude 4.5+, past 30 days)
const USGS_EARTHQUAKE_API = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

const TectonicExplorer = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(true);
  const [showFaultLines, setShowFaultLines] = useState(true);
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch live earthquake data from USGS
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await fetch(USGS_EARTHQUAKE_API);
        const data = await response.json();
        
        // Parse the GeoJSON features into a clean array for Resium
        const parsedData = data.features.map((feature) => ({
          id: feature.id,
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          depth: feature.geometry.coordinates[2], // Depth is the 3rd coordinate in km
          mag: feature.properties.mag,
          location: feature.properties.place,
          time: new Date(feature.properties.time).toLocaleString()
        }));

        setEarthquakes(parsedData);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Failed to fetch USGS earthquake data:", error);
        setIsLoadingData(false);
      }
    };

    fetchEarthquakes();
  }, []);

  // Helper to determine color based on magnitude severity
  const getMagColor = (mag) => {
    if (mag >= 7.0) return Color.RED;
    if (mag >= 6.0) return Color.ORANGE;
    if (mag >= 5.0) return Color.YELLOW;
    return Color.LIGHTGREEN;
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden text-slate-200">
      
      {/* Top Navigation */}
      <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/simulations')} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-emerald-400" />
          </button>
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Live Seismic Activity Monitor
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoadingData ? (
            <span className="text-xs text-emerald-400 animate-pulse flex items-center gap-2">
              <Activity size={14} /> Fetching live USGS data...
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Tracking {earthquakes.length} recent earthquakes (Mag 4.5+)
            </span>
          )}
          <button onClick={() => setShowInfo(!showInfo)} className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-emerald-900 text-emerald-300' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex">
        
        {/* Educational Sidebar overlaying Cesium */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute left-4 top-4 bottom-4 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Map size={18}/> Plate Tectonics</h2>
                <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              
              <div className="space-y-4 text-sm text-slate-300 overflow-y-auto custom-scrollbar pr-2">
                <p>This visualization uses live data from the <strong>United States Geological Survey (USGS)</strong>, showing all earthquakes of Magnitude 4.5+ from the past 30 days.</p>
                
                {/* --- Map Controls Section --- */}
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <h3 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Layers size={16} /> Map Layers
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showFaultLines} 
                      onChange={() => setShowFaultLines(!showFaultLines)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-700 border-slate-600"
                    />
                    <span>Show Tectonic Fault Lines</span>
                  </label>
                </div>

                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <h3 className="font-semibold text-emerald-400 mb-2">Student Challenge</h3>
                  <p className="mb-2">Turn off the fault lines. Can you identify where the plate boundaries are just by looking at the earthquake clusters?</p>
                  <p className="text-xs text-slate-400 italic">Notice how deep earthquakes often occur alongside subduction zones (convergent boundaries).</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cesium Canvas Container */}
        <div className="w-full h-full">
          <Viewer 
            full 
            animation={false} 
            timeline={false} 
            infoBox={true} 
            baseLayerPicker={true} 
          >
            <Scene requestRenderMode={true} maximumRenderTimeChange={Infinity} />

            {/* --- Render Fault Lines from GeoJSON --- */}
            {showFaultLines && (
              <GeoJsonDataSource 
                data={TECTONIC_PLATES_GEOJSON}
                stroke={Color.CYAN.withAlpha(0.8)} 
                strokeWidth={3}
                fill={Color.TRANSPARENT} 
              />
            )}

            {/* Plot Live USGS Earthquakes */}
            {earthquakes.map((eq) => (
              <Entity
                key={eq.id}
                name={`M ${eq.mag.toFixed(1)} - ${eq.location}`}
                description={`
                  <div style="font-family: sans-serif; padding: 10px;">
                    <h3 style="margin-top: 0; color: #ef4444;">Magnitude: ${eq.mag.toFixed(1)}</h3>
                    <p><strong>Location:</strong> ${eq.location}</p>
                    <p><strong>Depth:</strong> ${eq.depth.toFixed(1)} km</p>
                    <p><strong>Time:</strong> ${eq.time}</p>
                    <hr style="border: 0; height: 1px; background: #ccc; margin: 10px 0;" />
                    <p style="font-size: 11px; color: #666;">Data provided by USGS</p>
                  </div>
                `}
                position={Cartesian3.fromDegrees(eq.lon, eq.lat)}
              >
                <PointGraphics 
                  pixelSize={Math.max(5, eq.mag * 2.5)} // Dynamic scaling
                  color={getMagColor(eq.mag)} 
                  outlineColor={Color.WHITE} 
                  outlineWidth={1} 
                />
              </Entity>
            ))}
          </Viewer>
        </div>
      </div>
    </div>
  );
};

export default TectonicExplorer;