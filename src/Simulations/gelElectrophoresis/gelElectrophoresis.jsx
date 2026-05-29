import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Power, Play, RotateCcw, Lightbulb, LightbulbOff, 
  Info, Beaker, CheckCircle2, AlertTriangle, Fingerprint,
  ChevronRight, ArrowRight, Dna, FileSearch, Pipette, 
  FolderSearch, X, Calculator, FlaskConical, TestTube,
  Plus, Minus, Save, Edit2, ChevronLeft
} from 'lucide-react';

// --- DATA & CONSTANTS ---
const SAMPLES = {
  ladder: { 
    id: 'ladder', 
    name: 'DNA Ladder', 
    color: 'bg-slate-300', 
    neonColor: 'bg-teal-300',
    glowColor: 'rgba(94, 234, 212, 0.8)',
    bands: [1000, 800, 600, 400, 200, 100],
    description: 'A standard reference with known fragment sizes used to measure unknown DNA.'
  },
  suspect1: { 
    id: 'suspect1', 
    name: 'Suspect A', 
    color: 'bg-blue-400', 
    neonColor: 'bg-blue-300',
    glowColor: 'rgba(147, 197, 253, 0.8)',
    bands: [800, 400, 200],
    description: 'DNA collected from the primary suspect in the investigation.'
  },
  suspect2: { 
    id: 'suspect2', 
    name: 'Suspect B', 
    color: 'bg-purple-400', 
    neonColor: 'bg-purple-300',
    glowColor: 'rgba(216, 180, 254, 0.8)',
    bands: [1000, 600, 100],
    description: 'DNA collected from a secondary person of interest.'
  },
  crimeScene: { 
    id: 'crimeScene', 
    name: 'Crime Scene', 
    color: 'bg-red-400', 
    neonColor: 'bg-pink-300',
    glowColor: 'rgba(249, 168, 212, 0.8)',
    bands: [800, 400, 200],
    description: 'Unknown blood sample recovered from the crime scene.'
  },
};

const SCENES = {
  INTRO: 'INTRO',
  PREPARE_GEL: 'PREPARE_GEL',
  INTRODUCE_SAMPLES: 'INTRODUCE_SAMPLES',
  LOAD_SAMPLES: 'LOAD_SAMPLES',
  CONNECT_POWER: 'CONNECT_POWER',
  RUNNING: 'RUNNING',
  UV_ANALYSIS: 'UV_ANALYSIS',
  RESULTS: 'RESULTS',
  SUMMARY: 'SUMMARY',
  SANDBOX: 'SANDBOX'
};

// --- ZUSTAND STORE ---
const useGelLabStore = create((set) => ({
  scene: SCENES.INTRO,
  voltage: 120,
  gelPercentage: 1.5,
  runTime: 30,
  elapsedTime: 0, 
  uvEnabled: false,
  wells: Array(4).fill(null),
  mistakes: [],
  matchSelection: null, 
  selectedSampleId: null,
  showCalculationsModal: false,
  customSamples: [],

  setScene: (s) => set({ scene: s }),
  setVoltage: (v) => set({ voltage: v }),
  setGelPercentage: (g) => set({ gelPercentage: g }),
  setRunTime: (t) => set({ runTime: t }),
  toggleUV: () => set((state) => ({ uvEnabled: !state.uvEnabled })),
  setMatchSelection: (val) => set({ matchSelection: val }),
  setSelectedSampleId: (id) => set({ selectedSampleId: id }),
  setShowCalculationsModal: (val) => set({ showCalculationsModal: val }),
  
  addCustomSample: (sample) => set((state) => ({ 
    customSamples: [...state.customSamples, sample] 
  })),
  
  removeCustomSample: (id) => set((state) => ({ 
    customSamples: state.customSamples.filter(s => s.id !== id) 
  })),
  
  loadWell: (index, sampleId) => set((state) => {
    const newWells = [...state.wells];
    newWells[index] = sampleId;
    return { wells: newWells, selectedSampleId: null };
  }),
  
  tick: () => set((state) => {
    const nextTime = state.elapsedTime + 0.5;
    if (nextTime >= state.runTime) {
      return { elapsedTime: state.runTime, scene: SCENES.UV_ANALYSIS };
    }
    return { elapsedTime: nextTime };
  }),
  
  reset: () => set({ 
    scene: SCENES.INTRO, 
    elapsedTime: 0, 
    wells: Array(4).fill(null), 
    uvEnabled: false,
    mistakes: [],
    matchSelection: null,
    selectedSampleId: null,
    showCalculationsModal: false,
    customSamples: []
  })
}));

// --- MATH LOGIC ---
const calculateDistance = (bp, gelPct, voltage, elapsed, total) => {
  const logMW = Math.log10(bp);
  const baseDistance = (4.5 - logMW) * 26; 
  const gelFactor = 1.5 / gelPct;
  const voltFactor = voltage / 120;
  const maxDist = baseDistance * gelFactor * voltFactor;
  const currentDist = maxDist * (elapsed / total);
  return Math.max(0, Math.min(95, currentDist)); 
};

// --- CUSTOM CURSOR (MICROPIPETTE) ---
const PipetteCursor = () => {
  const { selectedSampleId, scene, customSamples } = useGelLabStore();
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (scene !== SCENES.LOAD_SAMPLES || !selectedSampleId) return null;

  const allSamples = { ...SAMPLES, ...Object.fromEntries(customSamples.map(s => [s.id, s])) };
  const sampleColor = allSamples[selectedSampleId]?.color || 'bg-gray-400';

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: mousePos.x, top: mousePos.y - 28 }}
    >
      <div className="relative">
        <Pipette className="w-6 h-6 text-slate-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -rotate-45" />
        <div className={`absolute bottom-0 left-1 w-2 h-2 rounded-full ${sampleColor} shadow-lg animate-pulse`} />
      </div>
    </motion.div>
  );
};

// --- INTRO SCENE ---
const IntroScene = () => {
  const setScene = useGelLabStore((s) => s.setScene);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center bg-slate-900 border border-slate-700/50 rounded-b-2xl p-6 relative overflow-hidden shadow-2xl text-center min-h-[500px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950"></div>
      
      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <Dna className="w-10 h-10 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-4 tracking-tight">
          Forensic DNA Analysis Lab
        </h1>
        
        <p className="text-base text-slate-300 leading-relaxed mb-6">
          Welcome to the forensics lab, detective. We've recovered an unknown biological sample from the crime scene. 
          Your mission is to perform <strong className="text-cyan-400">Gel Electrophoresis</strong> to separate the DNA fragments and match the genetic fingerprint against our two primary suspects.
        </p>
        
        <button 
          onClick={() => setScene(SCENES.PREPARE_GEL)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all transform hover:scale-105 flex items-center gap-2 text-base"
        >
          Enter Laboratory <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// --- EDUCATIONAL SUMMARY SCENE ---
const EducationalSummaryScene = () => {
  const { reset, setScene } = useGelLabStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-slate-900 border border-slate-700/50 rounded-b-2xl overflow-hidden shadow-2xl min-h-[600px]"
    >
      <div className="bg-gradient-to-r from-emerald-900 to-cyan-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">Investigation Complete!</h2>
          </div>
          <button 
            onClick={reset}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> New Experiment
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Video Section */}
          <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <div className="bg-slate-800/50 p-3 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                Gel Electrophoresis Educational Video
              </h3>
            </div>
            <div className="aspect-video bg-slate-900">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/mNINZDOj3Fo" 
                title="Gel Electrophoresis Explained"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Experiment Synopsis */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Beaker className="w-6 h-6 text-cyan-400" />
              Experiment Synopsis
            </h3>
            
            <div className="space-y-4 text-slate-300">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-cyan-400 mb-2">🔬 What is Gel Electrophoresis?</h4>
                <p className="text-sm leading-relaxed">
                  Gel electrophoresis is a laboratory technique used to separate mixtures of DNA, RNA, or proteins based on their molecular size. 
                  In this forensic application, we used it to compare DNA fragments from a crime scene with those from suspects.
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-cyan-400 mb-2">⚡ How It Works</h4>
                <p className="text-sm leading-relaxed">
                  DNA molecules are negatively charged due to their phosphate backbone. When placed in an electric field, they migrate toward the 
                  positive electrode. The agarose gel acts as a molecular sieve - smaller fragments move faster and travel farther, while larger 
                  fragments are slowed down. This creates distinct bands based on fragment size.
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-cyan-400 mb-2">🎯 Forensic Application</h4>
                <p className="text-sm leading-relaxed">
                  In this investigation, we compared DNA banding patterns between the crime scene sample and two suspects. The banding pattern 
                  represents variations in non-coding regions called Short Tandem Repeats (STRs). A perfect match between the crime scene and 
                  Suspect A's DNA provided strong forensic evidence for identification.
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-cyan-400 mb-2">📊 Key Findings</h4>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong className="text-emerald-400">Suspect A</strong> showed identical banding patterns to the crime scene sample</li>
                  <li><strong className="text-red-400">Suspect B</strong> had a completely different DNA fingerprint</li>
                  <li>The DNA ladder confirmed fragment sizes through standard comparison</li>
                  <li>UV visualization revealed the fluorescent DNA bands after electrophoresis</li>
                </ul>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-2">✅ Conclusion</h4>
                <p className="text-sm leading-relaxed">
                  Based on the DNA evidence, <strong className="text-emerald-400">Suspect A</strong> is the source of the biological material found at the crime scene. 
                  This demonstrates the power of gel electrophoresis in forensic science and criminal investigation.
                </p>
              </div>
            </div>
          </div>

          {/* Try Sandbox Mode */}
          <div className="text-center">
            <button 
              onClick={() => setScene(SCENES.SANDBOX)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-3 mx-auto shadow-lg"
            >
              <Edit2 className="w-5 h-5" />
              Try Sandbox Mode - Create Custom DNA Samples
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SANDBOX MODE ---
const SandboxMode = () => {
  const { customSamples, addCustomSample, removeCustomSample, setScene } = useGelLabStore();
  const [newSampleName, setNewSampleName] = useState('');
  const [newSampleBands, setNewSampleBands] = useState('');
  const [sample1, setSample1] = useState(null);
  const [sample2, setSample2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const colors = ['bg-pink-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-teal-400', 'bg-indigo-400'];

  const handleAddSample = () => {
    if (!newSampleName || !newSampleBands) return;
    const bandsArray = newSampleBands.split(',').map(b => parseInt(b.trim())).filter(b => !isNaN(b));
    if (bandsArray.length === 0) return;
    
    const newSample = {
      id: `custom_${Date.now()}`,
      name: newSampleName,
      color: colors[customSamples.length % colors.length],
      neonColor: colors[customSamples.length % colors.length].replace('400', '300'),
      glowColor: 'rgba(147, 197, 253, 0.8)',
      bands: bandsArray.sort((a,b) => b - a),
      description: 'Custom DNA sample created in sandbox mode',
      isCustom: true
    };
    
    addCustomSample(newSample);
    setNewSampleName('');
    setNewSampleBands('');
  };

  const compareSamples = () => {
    if (!sample1 || !sample2) return;
    const allSamples = { ...SAMPLES, ...Object.fromEntries(customSamples.map(s => [s.id, s])) };
    const s1 = allSamples[sample1];
    const s2 = allSamples[sample2];
    
    if (!s1 || !s2) return;
    
    const commonBands = s1.bands.filter(band => s2.bands.includes(band));
    const uniqueTo1 = s1.bands.filter(band => !s2.bands.includes(band));
    const uniqueTo2 = s2.bands.filter(band => !s1.bands.includes(band));
    const perfectMatch = commonBands.length === s1.bands.length && commonBands.length === s2.bands.length;
    const matchPercentage = (commonBands.length / Math.max(s1.bands.length, s2.bands.length) * 100).toFixed(0);
    
    setComparisonResult({
      perfectMatch,
      commonBands,
      uniqueTo1,
      uniqueTo2,
      matchPercentage,
      sample1Name: s1.name,
      sample2Name: s2.name,
      sample1Bands: s1.bands,
      sample2Bands: s2.bands
    });
  };

  const allSamplesList = [...Object.values(SAMPLES), ...customSamples];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-slate-900 border border-slate-700/50 rounded-b-2xl overflow-hidden shadow-2xl min-h-[600px]"
    >
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit2 className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold">Sandbox Mode</h2>
          </div>
          <button 
            onClick={() => setScene(SCENES.SUMMARY)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Summary
          </button>
        </div>
        <p className="text-sm text-cyan-200 mt-2">Create custom DNA samples and compare banding patterns</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Create Custom Sample */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Create Custom DNA Sample
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sample Name (e.g., 'Unknown Sample')"
                value={newSampleName}
                onChange={(e) => setNewSampleName(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Band Sizes in bp (e.g., '700, 450, 200, 100')"
                value={newSampleBands}
                onChange={(e) => setNewSampleBands(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleAddSample}
              className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Custom Sample
            </button>
          </div>

          {/* Custom Samples Gallery */}
          {customSamples.length > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Custom Samples ({customSamples.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customSamples.map(sample => (
                  <div key={sample.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`w-3 h-8 rounded-full ${sample.color} inline-block mr-2 align-middle`}></div>
                        <span className="font-bold text-white">{sample.name}</span>
                      </div>
                      <button
                        onClick={() => removeCustomSample(sample.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sample.bands.map(bp => (
                        <span key={bp} className="text-xs bg-slate-900 px-2 py-0.5 rounded text-cyan-400">
                          {bp} bp
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DNA Comparison Tool */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-purple-400" />
              Compare DNA Samples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Select First Sample</label>
                <select
                  value={sample1 || ''}
                  onChange={(e) => setSample1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Choose a sample...</option>
                  {allSamplesList.map(sample => (
                    <option key={sample.id} value={sample.id}>{sample.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Select Second Sample</label>
                <select
                  value={sample2 || ''}
                  onChange={(e) => setSample2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Choose a sample...</option>
                  {allSamplesList.map(sample => (
                    <option key={sample.id} value={sample.id}>{sample.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={compareSamples}
              disabled={!sample1 || !sample2}
              className="mt-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <FolderSearch className="w-4 h-4" /> Compare Samples
            </button>

            {/* Comparison Results */}
            {comparisonResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${comparisonResult.perfectMatch ? 'bg-emerald-900/50 border border-emerald-500' : comparisonResult.matchPercentage > 0 ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-red-900/50 border border-red-500'}`}
              >
                <h4 className="font-bold text-white mb-3">Comparison Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{comparisonResult.sample1Name}:</span>
                    <div className="flex gap-1">
                      {comparisonResult.sample1Bands.map(bp => (
                        <span key={bp} className={`text-xs px-1.5 py-0.5 rounded ${comparisonResult.commonBands.includes(bp) ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{bp}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{comparisonResult.sample2Name}:</span>
                    <div className="flex gap-1">
                      {comparisonResult.sample2Bands.map(bp => (
                        <span key={bp} className={`text-xs px-1.5 py-0.5 rounded ${comparisonResult.commonBands.includes(bp) ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{bp}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Match Percentage:</span>
                    <span className={`font-bold ${comparisonResult.perfectMatch ? 'text-emerald-400' : comparisonResult.matchPercentage > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {comparisonResult.matchPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Common Bands:</span>
                    <span className="text-emerald-400">{comparisonResult.commonBands.join(', ') || 'None'}</span>
                  </div>
                  {comparisonResult.uniqueTo1.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unique to {comparisonResult.sample1Name}:</span>
                      <span className="text-red-400">{comparisonResult.uniqueTo1.join(', ')}</span>
                    </div>
                  )}
                  {comparisonResult.uniqueTo2.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unique to {comparisonResult.sample2Name}:</span>
                      <span className="text-red-400">{comparisonResult.uniqueTo2.join(', ')}</span>
                    </div>
                  )}
                  <div className={`mt-3 p-3 rounded-lg text-center ${comparisonResult.perfectMatch ? 'bg-emerald-900/30' : comparisonResult.matchPercentage > 0 ? 'bg-yellow-900/30' : 'bg-red-900/30'}`}>
                    {comparisonResult.perfectMatch ? (
                      <span className="text-emerald-400 font-bold">✓ PERFECT MATCH! These DNA samples are from the same source.</span>
                    ) : comparisonResult.matchPercentage > 0 ? (
                      <span className="text-yellow-400 font-bold">⚠ PARTIAL MATCH - These samples share some bands but are not identical.</span>
                    ) : (
                      <span className="text-red-400 font-bold">✗ NO MATCH - These DNA samples are from different sources.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Educational Info */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">💡 Sandbox Tips</h4>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Create custom DNA samples with any band sizes you want</li>
              <li>Compare crime scene samples with suspects to find matches</li>
              <li>Use realistic band sizes (50-2000 bp range works best)</li>
              <li>The more matching bands, the higher the match percentage</li>
              <li>Perfect matches indicate identical DNA profiles</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SUMMARY SCENE (Updated to show educational content on success) ---
const SummaryScene = () => {
  const { matchSelection, reset } = useGelLabStore();
  const isCorrect = matchSelection === 'suspect1';

  if (isCorrect) {
    return <EducationalSummaryScene />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center bg-slate-900 border border-slate-700/50 rounded-b-2xl p-6 relative overflow-hidden shadow-2xl text-center min-h-[500px]"
    >
      <div className="relative z-10 max-w-lg bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
        
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Incorrect Match</h2>
        
        <p className="text-slate-300 mb-6 leading-relaxed text-sm">
          The analysis does not support that conclusion. Remember to compare the horizontal alignment of the glowing bands between the suspect and the crime scene sample. They must match exactly.
        </p>

        <div className="flex gap-3 justify-center">
          <button 
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Retry Analysis
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- PHASE-SPECIFIC VIEWS (Keep all your existing working components) ---

const PhasePrepare = () => {
  const { voltage, gelPercentage, runTime, setVoltage, setGelPercentage, setRunTime, setScene } = useGelLabStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto min-h-[450px]"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Step 1: Matrix Preparation</h2>
        <p className="text-slate-400 text-sm">Configure your electrical and gel matrix settings before pouring.</p>
      </div>

      <div className="w-full bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-bold text-sm">Voltage</span>
              <span className="text-cyan-400 font-mono text-lg">{voltage}V</span>
            </div>
            <input type="range" min="80" max="150" step="10" value={voltage} onChange={(e) => setVoltage(e.target.value)} className="w-full accent-cyan-500" />
            <p className="text-xs text-slate-500 mt-2">Higher voltage speeds up migration</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-bold text-sm">Gel Concentration</span>
              <span className="text-cyan-400 font-mono text-lg">{gelPercentage}%</span>
            </div>
            <input type="range" min="0.8" max="2.5" step="0.1" value={gelPercentage} onChange={(e) => setGelPercentage(e.target.value)} className="w-full accent-cyan-500" />
            <p className="text-xs text-slate-500 mt-2">Higher = tighter mesh</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-bold text-sm">Run Time</span>
              <span className="text-cyan-400 font-mono text-lg">{runTime}m</span>
            </div>
            <input type="range" min="20" max="60" step="5" value={runTime} onChange={(e) => setRunTime(e.target.value)} className="w-full accent-cyan-500" />
            <p className="text-xs text-slate-500 mt-2">Total electrophoresis time</p>
          </div>
        </div>

        <button 
          onClick={() => setScene(SCENES.INTRODUCE_SAMPLES)}
          className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.4)] text-base hover:scale-105"
        >
          <Beaker className="w-5 h-5" /> Pour Gel Matrix & Prepare Samples
        </button>
      </div>
    </motion.div>
  );
};

const PhaseLoad = () => {
  const { scene, setScene, wells, selectedSampleId, setSelectedSampleId, customSamples } = useGelLabStore();
  const someLoaded = wells.filter(w => w !== null).length > 0;
  const isIntro = scene === SCENES.INTRODUCE_SAMPLES;
  const allSamples = [...Object.values(SAMPLES), ...customSamples];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-5 w-full h-full min-h-[450px]">
      
      {/* Samples Panel */}
      <div className="w-full md:w-1/3 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col">
        <h2 className="text-lg font-bold text-white mb-1">
          {isIntro ? "Review Specimens" : "Load Wells"}
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          {isIntro 
            ? "Review the biological samples provided below before loading." 
            : "Click a specimen below to equip your micropipette, then click an empty well to inject the sample."}
        </p>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 max-h-[350px]">
          {allSamples.map((sample, idx) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <motion.div 
                key={sample.id}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}
                onClick={() => scene === SCENES.LOAD_SAMPLES && setSelectedSampleId(isSelected ? null : sample.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border bg-slate-800/50 transition-all text-sm
                  ${scene === SCENES.LOAD_SAMPLES ? 'cursor-pointer hover:bg-slate-700' : 'cursor-default'}
                  ${isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-slate-800' : 'border-slate-700'}
                  ${isIntro ? 'hover:border-indigo-500/50 hover:bg-slate-800' : ''}`}
              >
                <div className={`w-3 h-8 rounded-full ${sample.color} shadow-inner flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  <div className="w-full h-1/2 bg-white/20 mt-4 rounded-b-full" />
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-bold block mb-0.5 ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {sample.name}
                  </span>
                  {isIntro && <span className="text-xs text-slate-400 block leading-relaxed">{sample.description}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {isIntro && (
          <button 
            onClick={() => setScene(SCENES.LOAD_SAMPLES)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            Ready to Load <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {scene === SCENES.LOAD_SAMPLES && someLoaded && (
          <button 
            onClick={() => setScene(SCENES.CONNECT_POWER)}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            Proceed to Power Setup <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chamber View */}
      <div className="w-full md:w-2/3 cursor-default">
        <GelChamber />
      </div>
    </motion.div>
  );
};

const PhaseRun = () => {
  const { scene } = useGelLabStore();
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-5 w-full h-full min-h-[450px]">
      <div className="w-full md:w-2/3">
        <GelChamber />
      </div>
      
      <div className="w-full md:w-1/3 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col justify-center">
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl shadow-inner">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="text-yellow-400 w-4 h-4" /> Physics at Play
          </h3>
          
          {scene === SCENES.CONNECT_POWER ? (
             <p className="text-slate-300 leading-relaxed text-xs">
               DNA is <strong className="text-red-400">negatively charged</strong> due to its phosphate backbone. 
               When power is connected, it will migrate through the matrix towards the <strong className="text-white">positive electrode</strong> (anode).
               <br/><br/>
               <span className="text-cyan-400 font-semibold">Action:</span> Click the power button in the chamber to begin.
             </p>
          ) : (
             <p className="text-slate-300 leading-relaxed text-xs">
               As the current flows, smaller DNA fragments (fewer base pairs) weave through the agarose gel matrix much faster than larger, bulkier fragments. 
               <br/><br/>
               This speed differential causes the fragments to separate entirely by size!
             </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PhaseAnalyze = () => {
  const { scene, toggleUV, setScene, setMatchSelection, setShowCalculationsModal } = useGelLabStore();
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-5 w-full h-full min-h-[450px]">
      <div className="w-full md:w-2/3">
        <GelChamber />
      </div>

      <div className="w-full md:w-1/3 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col justify-center gap-4">
        
        {scene === SCENES.UV_ANALYSIS && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Detection</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Electrophoresis is complete, but DNA is naturally invisible. 
              We mixed a fluorescent dye (Ethidium Bromide) into the gel.
            </p>
            <button 
              onClick={() => {
                toggleUV();
                setTimeout(() => setScene(SCENES.RESULTS), 1500); 
              }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.6)] flex items-center justify-center gap-2 transition-all hover:scale-105 text-sm"
            >
              <Lightbulb className="w-4 h-4" /> Activate UV Light
            </button>
          </div>
        )}

        {scene === SCENES.RESULTS && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white">Pattern Analysis</h2>
            
            <div className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-xl text-emerald-200 text-xs shadow-inner leading-relaxed">
              <strong>Objective:</strong> Hover over the glowing bands in the chamber. Compare the horizontal banding patterns of Suspect A and Suspect B to the Crime Scene DNA.
            </div>

            <button 
              onClick={() => setShowCalculationsModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-2 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <FolderSearch className="w-4 h-4 text-cyan-400" />
              View Migration Calculations
            </button>
            
            <div className="mt-2">
              <p className="text-white font-bold mb-3 text-center text-sm">Who matches the Crime Scene DNA?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setMatchSelection('suspect1'); setScene(SCENES.SUMMARY); }}
                  className="bg-slate-800 hover:bg-blue-900/50 border border-blue-500/50 text-blue-300 py-2 rounded-xl transition-all font-bold text-base hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  Match: Suspect A
                </button>
                <button 
                  onClick={() => { setMatchSelection('suspect2'); setScene(SCENES.SUMMARY); }}
                  className="bg-slate-800 hover:bg-purple-900/50 border border-purple-500/50 text-purple-300 py-2 rounded-xl transition-all font-bold text-base hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Match: Suspect B
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// --- CORE GEL CHAMBER COMPONENT ---
const GelChamber = () => {
  const { scene, wells, elapsedTime, runTime, uvEnabled, setScene, customSamples } = useGelLabStore();

  useEffect(() => {
    let interval;
    if (scene === SCENES.RUNNING) {
      interval = setInterval(() => {
        useGelLabStore.getState().tick();
      }, 100); 
    }
    return () => clearInterval(interval);
  }, [scene]);

  const progress = (elapsedTime / runTime) * 100;
  const showGel = scene !== SCENES.PREPARE_GEL;

  // Combine samples for lookup
  const allSamples = { ...SAMPLES, ...Object.fromEntries(customSamples.map(s => [s.id, s])) };

  return (
    <div className="w-full h-full min-h-[450px] bg-slate-900 border border-slate-700/50 rounded-2xl p-4 relative shadow-2xl flex flex-col items-center justify-center">
      
      {/* Power Cables Visual */}
      <div className={`absolute top-0 left-5 w-0.5 h-24 bg-red-600 transition-all duration-500 z-0 ${scene === SCENES.RUNNING ? 'shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'shadow-none opacity-50'}`} />
      <div className={`absolute bottom-0 right-5 w-0.5 h-24 bg-slate-800 transition-all duration-500 z-0 ${scene === SCENES.RUNNING ? 'shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-slate-400' : 'shadow-none opacity-50'}`} />

      {/* Main Tank */}
      <div className="w-[95%] max-w-md h-[380px] md:h-[420px] bg-slate-800/80 rounded-xl border-4 border-slate-700 relative flex justify-center z-10 p-2 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Buffer Liquid Layer */}
        <div className={`absolute inset-0 bg-blue-500/10 transition-opacity duration-1000 ${showGel ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* The Gel Matrix */}
        <AnimatePresence>
          {showGel && (
            <motion.div 
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className={`w-[85%] h-full rounded border-2 relative transition-all duration-700 origin-top
                ${uvEnabled 
                  ? 'bg-slate-950 border-cyan-800/80 shadow-[inset_0_0_60px_rgba(6,182,212,0.15)]' 
                  : 'bg-cyan-900/20 border-cyan-700/30'}`}
            >
              {/* Electric Field Overlay */}
              {scene === SCENES.RUNNING && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none"
                  animate={{ backgroundPosition: ['0% -100%', '0% 200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '100% 200%' }}
                />
              )}

              {/* Wells Grid */}
              <div className="absolute top-2 left-0 right-0 flex justify-evenly px-2">
                {wells.map((sampleId, idx) => (
                  <WellColumn key={idx} index={idx} sampleId={sampleId} allSamples={allSamples} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connect Power Overlay Action */}
      {scene === SCENES.CONNECT_POWER && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
        >
          <button
            onClick={() => setScene(SCENES.RUNNING)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-2 text-base transform transition-transform hover:scale-105"
          >
            <Power className="w-5 h-5" /> Connect Electrodes & Run
          </button>
        </motion.div>
      )}

      {/* Progress Bar during run */}
      {scene === SCENES.RUNNING && (
        <div className="absolute bottom-4 w-[80%] max-w-md flex flex-col items-center gap-1 z-20 bg-slate-900/90 p-3 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex justify-between w-full text-xs text-cyan-400 font-mono font-bold">
            <span>Electrophoresis in Progress...</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <motion.div 
              className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const WellColumn = ({ index, sampleId, allSamples }) => {
  const { scene, uvEnabled, elapsedTime, runTime, gelPercentage, voltage, loadWell, selectedSampleId } = useGelLabStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (scene === SCENES.LOAD_SAMPLES && selectedSampleId && !sampleId) {
      loadWell(index, selectedSampleId);
    }
  };

  const sample = sampleId ? allSamples[sampleId] : null;
  const isRunningOrLater = [SCENES.RUNNING, SCENES.UV_ANALYSIS, SCENES.RESULTS].includes(scene);
  const canLoad = scene === SCENES.LOAD_SAMPLES && selectedSampleId && !sampleId;

  return (
    <div className="relative h-full min-h-[350px] flex flex-col items-center w-12">
      
      {/* Explicit Labeling */}
      <div className="text-[8px] font-bold text-slate-400 mb-0.5 font-mono tracking-wider">
        W{index + 1}
      </div>

      {/* Well Hole */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-8 h-2 border rounded-[2px] z-10 transition-colors
          ${canLoad && isHovered ? 'border-green-400 bg-green-400/50 shadow-[0_0_15px_#4ade80] cursor-pointer' : 'border-slate-700/80 bg-slate-900/50'}
          ${sampleId ? 'bg-indigo-900/80 border-indigo-500/50 shadow-[inset_0_0_10px_rgba(99,102,241,0.5)]' : ''}`}
      />

      {/* Sample Tag underneath the well if loaded */}
      <div className="text-[7px] text-cyan-400 mt-0.5 h-2 text-center w-full truncate leading-tight font-medium">
        {sample ? sample.name.substring(0, 4) : ''}
      </div>

      {/* Render DNA Bands */}
      {sample && isRunningOrLater && sample.bands.map((bp, i) => {
        const distPercent = calculateDistance(bp, gelPercentage, voltage, elapsedTime, runTime);
        const baseColor = uvEnabled ? sample.neonColor : 'bg-slate-600/40';
        const shadow = uvEnabled ? `0 0 8px ${sample.glowColor}, 0 0 15px ${sample.glowColor}` : 'none';

        return (
          <motion.div
            key={i}
            className={`absolute w-6 h-[2px] rounded-full ${baseColor} transition-all duration-300 group cursor-crosshair`}
            style={{ 
              boxShadow: shadow,
              opacity: uvEnabled ? 1 : 0.3 
            }}
            animate={{ top: `calc(28px + ${distPercent}%)` }} 
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
          >
            {/* Tooltip on Hover in Analysis Scene */}
            {scene === SCENES.RESULTS && uvEnabled && (
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-cyan-100 text-[10px] py-0.5 px-2 rounded z-30 whitespace-nowrap pointer-events-none shadow-xl flex flex-col items-center">
                <span className="font-bold text-cyan-400">{bp} bp</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- DATA CALCULATIONS MODAL (Keep your existing working modal) ---
const CalculationsModal = () => {
  const { showCalculationsModal, setShowCalculationsModal, gelPercentage, voltage, wells, customSamples } = useGelLabStore();

  if (!showCalculationsModal) return null;

  const allSamples = { ...SAMPLES, ...Object.fromEntries(customSamples.map(s => [s.id, s])) };

  // Function to compare band patterns between two samples
  const compareBandPatterns = (sample1Id, sample2Id) => {
    if (!sample1Id || !sample2Id) return { match: false, commonBands: [], uniqueTo1: [], uniqueTo2: [] };
    
    const bands1 = allSamples[sample1Id]?.bands || [];
    const bands2 = allSamples[sample2Id]?.bands || [];
    
    const commonBands = bands1.filter(band => bands2.includes(band));
    const uniqueTo1 = bands1.filter(band => !bands2.includes(band));
    const uniqueTo2 = bands2.filter(band => !bands1.includes(band));
    
    const perfectMatch = commonBands.length === bands1.length && 
                        commonBands.length === bands2.length &&
                        bands1.length === bands2.length;
    
    const partialMatch = commonBands.length > 0 && !perfectMatch;
    
    return {
      match: perfectMatch,
      perfectMatch,
      partialMatch,
      commonBands,
      uniqueTo1,
      uniqueTo2,
      matchPercentage: (commonBands.length / Math.max(bands1.length, bands2.length) * 100).toFixed(0)
    };
  };

  const hasCrimeScene = wells.includes('crimeScene');
  const hasSuspect1 = wells.includes('suspect1');
  const hasSuspect2 = wells.includes('suspect2');

  const suspect1Comparison = compareBandPatterns('crimeScene', 'suspect1');
  const suspect2Comparison = compareBandPatterns('crimeScene', 'suspect2');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 sticky top-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="text-cyan-400 w-5 h-5" /> DNA Band Analysis & Comparison
          </h3>
          <button 
            onClick={() => setShowCalculationsModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-slate-300 text-sm leading-relaxed space-y-5 overflow-y-auto flex-1">
          
          {/* Migration Physics Explanation */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-md font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Gel Electrophoresis Physics
            </h4>
            <p className="text-xs">
              DNA fragments migrate through the agarose gel based on their size. Smaller fragments travel farther because they 
              navigate through the gel matrix more easily. The distance traveled is <strong className="text-cyan-400">inversely proportional to the logarithm of the base pair length</strong>.
            </p>
            <div className="bg-slate-900 p-2 mt-2 rounded-lg font-mono text-xs text-center text-emerald-300">
              Migration Distance ∝ 1 / log₁₀(Base Pairs)
            </div>
          </div>

          {/* Current Lab Conditions */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-white mb-2">Current Lab Conditions</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Gel Concentration:</span> <span className="text-cyan-400 font-bold">{gelPercentage}%</span></div>
              <div><span className="text-slate-400">Voltage:</span> <span className="text-cyan-400 font-bold">{voltage}V</span></div>
              <div><span className="text-slate-400">Run Time:</span> <span className="text-cyan-400 font-bold">30 min</span></div>
              <div><span className="text-slate-400">Migration Model:</span> <span className="text-cyan-400 font-bold">Logarithmic</span></div>
            </div>
          </div>

          {/* Standard Curve Table */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-white mb-2">📊 DNA Ladder Standard Curve</h4>
            <p className="text-xs text-slate-400 mb-2">Reference fragments used to determine unknown DNA sizes:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-slate-400">
                    <th className="p-2 border-b border-slate-700">Fragment Size</th>
                    <th className="p-2 border-b border-slate-700">log₁₀(Size)</th>
                    <th className="p-2 border-b border-slate-700">Migration Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLES.ladder.bands.map((bp) => {
                    const logMW = Math.log10(bp).toFixed(3);
                    const dist = calculateDistance(bp, gelPercentage, voltage, 30, 30).toFixed(1);
                    return (
                      <tr key={bp} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="p-2 font-bold text-teal-300">{bp} bp</td>
                        <td className="p-2 text-slate-400">{logMW}</td>
                        <td className="p-2 text-cyan-400">{dist}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DNA Band Pattern Comparison */}
          {hasCrimeScene && (hasSuspect1 || hasSuspect2) && (
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" /> DNA Band Pattern Analysis
              </h4>
              
              <div className="space-y-4">
                {/* Crime Scene Pattern */}
                <div className="bg-slate-900 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-red-400">🔴 Crime Scene DNA</span>
                    <span className="text-xs text-slate-400">{SAMPLES.crimeScene.bands.length} fragments</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLES.crimeScene.bands.map(bp => (
                      <span key={bp} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-mono">
                        {bp} bp
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suspect A Comparison */}
                {hasSuspect1 && (
                  <div className={`p-3 rounded-lg ${suspect1Comparison.perfectMatch ? 'bg-emerald-900/30 border border-emerald-500' : suspect1Comparison.partialMatch ? 'bg-yellow-900/30 border border-yellow-500' : 'bg-slate-900'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-400">🔵 Suspect A DNA</span>
                      <span className="text-xs text-slate-400">{SAMPLES.suspect1.bands.length} fragments</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SAMPLES.suspect1.bands.map(bp => (
                        <span key={bp} className={`px-2 py-1 rounded text-xs font-mono ${
                          SAMPLES.crimeScene.bands.includes(bp) 
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {bp} bp {SAMPLES.crimeScene.bands.includes(bp) && '✓'}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      {suspect1Comparison.perfectMatch ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-bold">✓ PERFECT MATCH! Banding patterns are identical.</span>
                        </div>
                      ) : suspect1Comparison.partialMatch ? (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-bold">⚠ PARTIAL MATCH ({suspect1Comparison.matchPercentage}% similarity)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <X className="w-4 h-4" />
                          <span className="text-sm font-bold">✗ NO MATCH - Different banding patterns</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suspect B Comparison */}
                {hasSuspect2 && (
                  <div className={`p-3 rounded-lg ${suspect2Comparison.perfectMatch ? 'bg-emerald-900/30 border border-emerald-500' : suspect2Comparison.partialMatch ? 'bg-yellow-900/30 border border-yellow-500' : 'bg-slate-900'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-400">🟣 Suspect B DNA</span>
                      <span className="text-xs text-slate-400">{SAMPLES.suspect2.bands.length} fragments</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SAMPLES.suspect2.bands.map(bp => (
                        <span key={bp} className={`px-2 py-1 rounded text-xs font-mono ${
                          SAMPLES.crimeScene.bands.includes(bp) 
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {bp} bp {SAMPLES.crimeScene.bands.includes(bp) && '✓'}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      {suspect2Comparison.perfectMatch ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-bold">✓ PERFECT MATCH! Banding patterns are identical.</span>
                        </div>
                      ) : suspect2Comparison.partialMatch ? (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-bold">⚠ PARTIAL MATCH ({suspect2Comparison.matchPercentage}% similarity)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <X className="w-4 h-4" />
                          <span className="text-sm font-bold">✗ NO MATCH - Different banding patterns</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Final Verdict */}
                <div className={`mt-3 p-3 rounded-lg text-center ${
                  suspect1Comparison.perfectMatch ? 'bg-emerald-900/50 border-2 border-emerald-500' :
                  suspect2Comparison.perfectMatch ? 'bg-emerald-900/50 border-2 border-emerald-500' :
                  suspect1Comparison.partialMatch || suspect2Comparison.partialMatch ? 'bg-yellow-900/50 border-2 border-yellow-500' :
                  'bg-red-900/50 border-2 border-red-500'
                }`}>
                  <h5 className="font-bold text-white mb-1">🔍 FORENSIC CONCLUSION</h5>
                  {suspect1Comparison.perfectMatch ? (
                    <p className="text-emerald-300 text-sm">
                      <strong>✓ SUSPECT A MATCHES the crime scene DNA!</strong> The banding patterns are identical.
                    </p>
                  ) : suspect2Comparison.perfectMatch ? (
                    <p className="text-emerald-300 text-sm">
                      <strong>✓ SUSPECT B MATCHES the crime scene DNA!</strong> The banding patterns are identical.
                    </p>
                  ) : suspect1Comparison.partialMatch || suspect2Comparison.partialMatch ? (
                    <p className="text-yellow-300 text-sm">
                      <strong>⚠ PARTIAL SIMILARITY DETECTED</strong> - Neither suspect shows a perfect match.
                    </p>
                  ) : (
                    <p className="text-red-300 text-sm">
                      <strong>✗ NO MATCH FOUND</strong> - Neither suspect matches the crime scene DNA profile.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message when samples aren't loaded */}
          {(!hasCrimeScene || (!hasSuspect1 && !hasSuspect2)) && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold">Samples Not Fully Loaded</h4>
              </div>
              <p className="text-sm text-slate-300">
                Load the Crime Scene sample and at least one suspect to see comparison results.
              </p>
            </div>
          )}
        </div>
        
        {/* Close button */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-end">
          <button 
            onClick={() => setShowCalculationsModal(false)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Close Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP EXPORT ---
export default function App() {
  const scene = useGelLabStore(state => state.scene);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-5 font-sans selection:bg-cyan-900">
      
      {/* Global Pipette Tracking cursor */}
      <PipetteCursor />

      <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-2rem)]">
        
        {/* Top Header Component - Hidden in Intro/Summary/Sandbox */}
        {scene !== SCENES.INTRO && scene !== SCENES.SUMMARY && scene !== SCENES.SANDBOX && (
          <div className="bg-slate-900 border-b border-indigo-500/30 p-3 rounded-t-2xl flex items-center justify-between shadow-lg z-20 relative">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                <Fingerprint className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wide">Gel Electrophoresis Lab</h1>
                <p className="text-xs text-indigo-300">Biotechnology Simulation</p>
              </div>
            </div>
          </div>
        )}

        {/* Scene Router */}
        <div className={`flex-1 flex flex-col ${scene !== SCENES.INTRO && scene !== SCENES.SUMMARY && scene !== SCENES.SANDBOX ? 'bg-slate-950 p-4 border-x border-b border-indigo-500/30 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''}`}>
          <AnimatePresence mode="wait">
            {scene === SCENES.INTRO && <IntroScene key="intro" />}
            
            {scene === SCENES.PREPARE_GEL && <PhasePrepare key="prepare" />}
            
            {(scene === SCENES.INTRODUCE_SAMPLES || scene === SCENES.LOAD_SAMPLES) && <PhaseLoad key="load" />}
            
            {(scene === SCENES.CONNECT_POWER || scene === SCENES.RUNNING) && <PhaseRun key="run" />}
            
            {(scene === SCENES.UV_ANALYSIS || scene === SCENES.RESULTS) && <PhaseAnalyze key="analyze" />}

            {scene === SCENES.SUMMARY && <SummaryScene key="summary" />}
            
            {scene === SCENES.SANDBOX && <SandboxMode key="sandbox" />}
          </AnimatePresence>
        </div>
        
        {/* Modals */}
        <AnimatePresence>
          <CalculationsModal />
        </AnimatePresence>
      </div>
    </div>
  );
}