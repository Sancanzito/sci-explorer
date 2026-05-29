import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { 
  Search, Atom, Loader2, AlertCircle, 
  PenTool, Eraser, TestTube, Database, Info, Zap, ImageIcon, Beaker,
  Copy, Check, Activity
} from 'lucide-react';

// ============================================================
// JSME EDITOR COMPONENT (MEMORY-LEAK PATCHED)
// ============================================================
const Jsme = ({ width = "100%", height = "600px", options = "query,hydrogens", onChange, onInit }) => {
  const containerId = useRef(`jsme-${Math.random().toString(36).substring(2, 9)}`);
  const appletRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep callback reference updated without triggering re-mounts
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    // Inject JSME script dynamically if it doesn't exist
    if (!window.JSApplet && !document.getElementById('jsme-script')) {
      const script = document.createElement('script');
      script.src = 'https://jsme-editor.github.io/dist/jsme/jsme.nocache.js';
      script.id = 'jsme-script';
      document.head.appendChild(script);
    }

    let pollTimer;
    let structureTimer = null;

    pollTimer = setInterval(() => {
      if (window.JSApplet && window.JSApplet.JSME && document.getElementById(containerId.current)) {
        clearInterval(pollTimer);
        
        if (appletRef.current) return;

        const applet = new window.JSApplet.JSME(containerId.current, width, height, { options });
        appletRef.current = applet;

        const nativeReadMolFile = applet.readMolFile?.bind(applet);
        const nativeSmiles = applet.smiles?.bind(applet);
        const nativeNonIso = applet.nonisomericSmiles?.bind(applet);
        const nativeReadGeneric = applet.readGenericMolecularInput?.bind(applet);

        // Safe monkey-patching
        applet.getSMILES = () => {
          try { return nativeSmiles ? nativeSmiles() : ''; } 
          catch { try { return nativeNonIso ? nativeNonIso() : ''; } catch { return ''; } }
        };

        applet.setSMILES = (smiles) => {
          try { if (nativeReadGeneric) nativeReadGeneric(smiles); } 
          catch (err) { console.error('Failed to load SMILES:', err); }
        };

        applet.readMolFileSafe = (mol) => {
          try { if (nativeReadMolFile) nativeReadMolFile(mol); } 
          catch (err) { console.error('Failed to read MOL file:', err); }
        };
        
        applet.setEditable = () => {}; 

        if (onInit) onInit(applet);

        // Throttled JSME event listener for smooth drawing
        applet.setCallBack("AfterStructureModified", (event) => {
          if (onChangeRef.current && event.src) {
            if (structureTimer) clearTimeout(structureTimer);
            structureTimer = setTimeout(() => {
              try {
                onChangeRef.current(event.src.smiles());
              } catch {
                try { onChangeRef.current(event.src.nonisomericSmiles()); } 
                catch { onChangeRef.current(''); }
              }
            }, 120); // 120ms throttle
          }
        });
      }
    }, 100);

    return () => {
      clearInterval(pollTimer);
      if (structureTimer) clearTimeout(structureTimer);
      if (appletRef.current) {
        try {
          appletRef.current.setCallBack("AfterStructureModified", null);
        } catch {}
      }
    };
  }, [width, height, options, onInit]);

  return <div id={containerId.current} style={{ width, height }} />;
};

// ============================================================
// ANALYSIS SERVICE
// ============================================================
const AnalysisService = {
  normalizeSmiles: (smiles) => {
    if (!smiles) return '';
    return smiles.replace(/\s+/g, '').replace(/\\+/g, '\\').trim();
  },

  detectFunctionalGroups: (smiles) => {
    if (!smiles) return [];
    const groups = [];
    
    // Improved educational RegEx patterns to reduce false positives
    const patterns = [
      { name: 'Carboxylic Acid', regex: /C\(=O\)O(?![C,c])/i },
      { name: 'Ester', regex: /C\(=O\)O[C,c]/i },
      { name: 'Amide', regex: /C\(=O\)N/i },
      { name: 'Ketone/Aldehyde', regex: /C\(=O\)(?![O,N])/i },
      { name: 'Alcohol', regex: /(?<!C\(=O\))O(?![C,c,=O])/i }, 
      { name: 'Primary Amine', regex: /(?<!C\(=O\))N(?![C,c,=O])/i },
      { name: 'Nitrile', regex: /C#N/i },
      { name: 'Aromatic Ring', regex: /[a-z]1/ }, // Captures lowercase ring indices (e.g. c1, n1)
      { name: 'Sulfone/Sulfate', regex: /S\(=O\)\(=O\)/i },
      { name: 'Phosphate', regex: /P\(=O\)/i },
      { name: 'Halogen', regex: /F|Cl|Br|I/ }
    ];

    patterns.forEach(p => {
      if (p.regex.test(smiles)) groups.push(p.name);
    });

    return [...new Set(groups)];
  },

  analyzeBonds: (molFileString) => {
    if (!molFileString || typeof molFileString !== 'string') return null;
    const lines = molFileString.split('\n');
    if (lines.length < 4) return null;

    const countsLine = lines[3];
    if (!countsLine) return null;
    
    const numAtoms = parseInt(countsLine.substring(0, 3).trim(), 10);
    const numBonds = parseInt(countsLine.substring(3, 6).trim(), 10);

    if (isNaN(numAtoms) || isNaN(numBonds)) return null;

    const electronegativityMap = {
      'H': 2.20, 'Li': 0.98, 'Be': 1.57, 'B': 2.04, 'C': 2.55, 'N': 3.04, 
      'O': 3.44, 'F': 3.98, 'Na': 0.93, 'Mg': 1.31, 'Al': 1.61, 'Si': 1.90, 
      'P': 2.19, 'S': 2.58, 'Cl': 3.16, 'K': 0.82, 'Ca': 1.00, 'Fe': 1.83, 
      'Cu': 1.90, 'Zn': 1.65, 'Br': 2.96, 'I': 2.66
    };

    const atoms = [];
    let ionicCount = 0; let polarCount = 0; let nonPolarCount = 0;

    for (let i = 0; i < numAtoms; i++) {
      const line = lines[4 + i];
      if (!line) continue;
      atoms.push(line.substring(31, 34).trim());
    }

    for (let i = 0; i < numBonds; i++) {
      const line = lines[4 + numAtoms + i];
      if (!line) continue;
      const atom1 = atoms[parseInt(line.substring(0, 3).trim(), 10) - 1];
      const atom2 = atoms[parseInt(line.substring(3, 6).trim(), 10) - 1];

      if (!atom1 || !atom2) continue;

      const en1 = electronegativityMap[atom1] || 2.5; 
      const en2 = electronegativityMap[atom2] || 2.5;
      const deltaEN = Math.abs(en1 - en2);

      if (deltaEN >= 1.7) ionicCount++;
      else if (deltaEN >= 0.4) polarCount++;
      else nonPolarCount++;
    }

    return {
      totalBonds: numBonds, ionic: ionicCount, polar: polarCount, nonPolar: nonPolarCount,
      summary: `Contains ${numBonds} total bonds: ${ionicCount} Ionic, ${polarCount} Polar Covalent, and ${nonPolarCount} Non-Polar Covalent.`
    };
  }
};

// ============================================================
// RESOLVER SERVICE (FALLBACKS)
// ============================================================
const ResolverService = {
  resolveSmilesFallback: async (query) => {
    try {
      const cir = await fetch(`https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(query)}/smiles`);
      if (cir.ok) {
        const text = await cir.text();
        if (text && !text.includes("Page not found") && text.length > 2) return text.trim();
      }
    } catch (e) {}

    try {
      const opsin = await fetch(`/api/opsin/${encodeURIComponent(query)}.smi`);
      if (opsin.ok) {
        const text = await opsin.text();
        if (text && text.length > 2) return text.trim();
      }
    } catch (e) {}

    try {
      const synonymUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/synonyms/JSON`;
      const synonymResponse = await fetch(synonymUrl);
      if (synonymResponse.ok) {
        const synonymData = await synonymResponse.json();
        const synonyms = synonymData.InformationList?.Information?.[0]?.Synonym || [];
        for (const synonym of synonyms.slice(0, 5)) {
          try {
            const retryUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(synonym)}/property/IsomericSMILES,CanonicalSMILES/JSON`;
            const retryRes = await fetch(retryUrl);
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              const props = retryData.PropertyTable?.Properties?.[0];
              const s = props?.IsomericSMILES || props?.CanonicalSMILES;
              if (s) return s.trim();
            }
          } catch {}
        }
      }
    } catch {}

    return null;
  }
};

// ============================================================
// AUTOCOMPLETE SERVICE
// ============================================================
const AutocompleteService = {
  getSuggestions: async (query) => {
    if (!query.trim() || query.length < 2) return [];
    try {
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(query)}/json`);
      const data = await response.json();
      const rawSuggestions = data.dictionary_terms?.compound?.slice(0, 5) || [];

      // Validate against PubChem
      const validated = [];
      for (const name of rawSuggestions) {
        try {
          const verifyUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/CanonicalSMILES/JSON`;
          const verifyRes = await fetch(verifyUrl);
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (verifyData.PropertyTable?.Properties?.[0]) validated.push(name);
          }
        } catch {}
      }
      return validated;
    } catch (e) {
      console.error("Autocomplete failed", e);
      return [];
    }
  }
};

// ============================================================
// PUBCHEM API SERVICE
// ============================================================
const smilesCache = new Map(); // Global in-memory cache to prevent PubChem overfetching
const API_PROPERTIES = 'IsomericSMILES,CanonicalSMILES,MolecularFormula,MolecularWeight,IUPACName,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount';

const PubChemService = {
  searchCompounds: async (query) => {
    try {
      const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/${API_PROPERTIES}/JSON`;
      const propResponse = await fetch(propUrl);

      if (propResponse.ok) {
        const propData = await propResponse.json();
        const props = propData.PropertyTable?.Properties?.[0];

        if (props) {
          let smiles = props.IsomericSMILES || props.CanonicalSMILES || null;
          if (!smiles) smiles = await ResolverService.resolveSmilesFallback(query);

          let description = 'Retrieved from PubChem';
          try {
            const descResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${props.CID}/description/JSON`);
            if (descResponse.ok) {
                const descData = await descResponse.json();
                description = descData.InformationList?.Information?.[0]?.Description?.slice(0, 300) + '...' || description;
            }
          } catch (e) {}

          const result = {
            cid: props.CID,
            name: query,
            iupacName: props.IUPACName || 'Unknown',
            smiles: AnalysisService.normalizeSmiles(smiles) || '',
            molecularFormula: props.MolecularFormula || 'Unknown',
            molecularWeight: props.MolecularWeight || 0,
            xLogP: props.XLogP ?? 'N/A',
            tpsa: props.TPSA ?? 'N/A',
            hBondDonors: props.HBondDonorCount ?? 'N/A',
            hBondAcceptors: props.HBondAcceptorCount ?? 'N/A',
            rotatableBonds: props.RotatableBondCount ?? 'N/A',
            description,
          };
          
          if (result.smiles) smilesCache.set(result.smiles, result);
          return result;
        }
      }

      const fallbackSmiles = await ResolverService.resolveSmilesFallback(query);
      if (!fallbackSmiles) throw new Error('No structure found in primary or fallback databases');

      return {
        cid: 'External', name: query, iupacName: query,
        smiles: AnalysisService.normalizeSmiles(fallbackSmiles),
        molecularFormula: 'Unknown', molecularWeight: 'Unknown', description: 'Retrieved from external resolver',
      };
    } catch (error) {
      throw error;
    }
  },

  searchBySmiles: async (smiles) => {
    if (!smiles || smiles.trim() === '') {
        throw new Error("No structure provided.");
    }
    
    const normalizedSmiles = AnalysisService.normalizeSmiles(smiles);
    
    // Memory Cache Check
    if (smilesCache.has(normalizedSmiles)) {
      return smilesCache.get(normalizedSmiles);
    }

    try {
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(normalizedSmiles)}/property/${API_PROPERTIES}/JSON`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Not in database");
        
        const data = await res.json();
        const props = data.PropertyTable?.Properties?.[0];
        if (!props) throw new Error("Properties not found.");
        
        const result = {
            cid: props.CID,
            name: props.IUPACName || 'Drawn Molecule',
            iupacName: props.IUPACName || 'Unknown',
            smiles: AnalysisService.normalizeSmiles(props.IsomericSMILES || props.CanonicalSMILES || normalizedSmiles),
            molecularFormula: props.MolecularFormula || 'Unknown',
            molecularWeight: props.MolecularWeight || 0,
            xLogP: props.XLogP ?? 'N/A',
            tpsa: props.TPSA ?? 'N/A',
            hBondDonors: props.HBondDonorCount ?? 'N/A',
            hBondAcceptors: props.HBondAcceptorCount ?? 'N/A',
            rotatableBonds: props.RotatableBondCount ?? 'N/A',
            description: 'Identified via real-time structural analysis.',
        };
        
        smilesCache.set(normalizedSmiles, result);
        return result;
    } catch(e) {
        return {
            cid: 'Custom', name: 'Custom Structure', iupacName: 'N/A',
            smiles: normalizedSmiles, molecularFormula: 'Calculated from drawing', molecularWeight: 'N/A',
            description: 'Custom structure not found in the standard PubChem database.',
        };
    }
  },

  fetchMolFromSmiles: async (smiles) => {
    if (!smiles || smiles.trim() === '') {
      return null;
    }

    try {
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }
};

// ============================================================
// UI COMPONENTS
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error: error }; }
  componentDidCatch(error, errorInfo) {
    console.error('Molecular Canvas Error:', error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center relative z-10">
          <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <h3 className="text-red-400 font-bold text-lg mb-2">Molecular Canvas Error</h3>
          <p className="text-red-300/70 text-sm mb-4">The chemical editor encountered an error. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-gray-500 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-gray-700/50" title="Copy to clipboard">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
};

// ============================================================
// ZUSTAND STORE
// ============================================================
const useChemicalStore = create((set, get) => ({
  currentCompound: null,
  smilesString: 'c1ccccc1', // Benzene
  searchQuery: '',
  loading: false,
  autoAnalyzing: false,
  error: null,
  jsmeRef: null,
  jsmeReady: false,
  bondData: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentCompound: (compound) => set({ currentCompound: compound }),
  setSmilesString: (smiles) => set({ smilesString: smiles }),
  setLoading: (loading) => set({ loading: loading }),
  setAutoAnalyzing: (status) => set({ autoAnalyzing: status }),
  setError: (error) => set({ error: error }),
  setJsmeRef: (ref) => set({ jsmeRef: ref }),
  setJsmeReady: (ready) => set({ jsmeReady: ready }),
  setBondData: (bondData) => set({ bondData: bondData }),
  getSmiles: () => {
    const { jsmeRef } = get();
    if (jsmeRef && jsmeRef.getSMILES) return jsmeRef.getSMILES();
    return '';
  },
}));

// ============================================================
// MAIN APP SECTIONS
// ============================================================
const QUICK_TEMPLATES = [
  { name: 'Benzene', smiles: 'c1ccccc1' },
  { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Glucose', smiles: 'C(C1C(C(C(C(O1)O)O)O)O)O' },
  { name: 'Ethanol', smiles: 'CCO' },
  { name: 'Adenine', smiles: 'C1=NC2=NC=NC(=C2N1)N' },
  { name: 'Acetic Acid', smiles: 'CC(=O)O' },
  { name: 'Phenol', smiles: 'Oc1ccccc1' }
];

const SearchBar = () => {
  const { 
    searchQuery, setSearchQuery, setCurrentCompound, 
    setSmilesString, setLoading, setError, jsmeRef, 
    jsmeReady, setBondData
  } = useChemicalStore();
  
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSuggestions([]); setShowDropdown(false); return;
      }
      setIsSearching(true);
      try {
        const results = await AutocompleteService.getSuggestions(searchQuery);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (e) {
        setSuggestions([]);
      } finally { setIsSearching(false); }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 350);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompoundLoad = async (query) => {
    setSearchQuery(query); setShowDropdown(false); setLoading(true); setError(null); setBondData(null);
    try {
      const compound = await PubChemService.searchCompounds(query);
      setCurrentCompound(compound);
      setSmilesString(compound.smiles);
      if (jsmeRef && jsmeReady) {
        const molData = await PubChemService.fetchMolFromSmiles(compound.smiles);
        if (molData && jsmeRef.readMolFileSafe) jsmeRef.readMolFileSafe(molData);
        else if (jsmeRef.setSMILES) jsmeRef.setSMILES(compound.smiles);
      }
    } catch (e) {
      setError(e.message || "Compound not found.");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative group z-50" ref={dropdownRef}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="text-cyan-500" size={20} />
      </div>
      <input
        type="text" value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
        onKeyDown={(e) => e.key === 'Enter' && handleCompoundLoad(searchQuery)}
        placeholder="Search compound, formula, or SMILES (e.g. benz, Na, sulfate)..."
        className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-5 pl-12 pr-32 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-xl transition-all"
      />
      {isSearching && <div className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center"><Loader2 className="animate-spin text-cyan-500" size={18} /></div>}
      <button onClick={() => handleCompoundLoad(searchQuery)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
        {useChemicalStore.getState().loading && <Loader2 size={16} className="animate-spin" />} Search
      </button>

      {showDropdown && searchQuery.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {suggestions.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto custom-scrollbar">
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => handleCompoundLoad(s)} className="px-4 py-3 hover:bg-cyan-900/40 cursor-pointer text-gray-200 border-b border-gray-700/50 transition-colors flex items-center justify-between">
                  <span className="font-medium">{s}</span>
                  <span className="text-xs text-gray-500 uppercase">Verified DB</span>
                </li>
              ))}
            </ul>
          ) : !isSearching && (
             <div className="px-4 py-4 text-amber-400 flex items-center gap-2 text-sm">
               <AlertCircle size={16} /> No verified compound found.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

const UnifiedMolecularCanvas = () => {
  const { 
    smilesString, setSmilesString, currentCompound, setCurrentCompound, 
    setLoading, setError, autoAnalyzing, setAutoAnalyzing, 
    jsmeRef, setJsmeRef, jsmeReady, setJsmeReady,
    getSmiles, setBondData
  } = useChemicalStore();

  useEffect(() => {
    if (!smilesString || !jsmeReady) return;
    
    const debounceTimer = setTimeout(async () => {
      if (currentCompound?.smiles && AnalysisService.normalizeSmiles(currentCompound.smiles) === AnalysisService.normalizeSmiles(smilesString)) return;

      setAutoAnalyzing(true); setError(null);
      try {
        const info = await PubChemService.searchBySmiles(smilesString);
        if (jsmeRef && jsmeRef.molFile) {
          try {
            const bondAnalysis = AnalysisService.analyzeBonds(jsmeRef.molFile());
            if (bondAnalysis) { setBondData(bondAnalysis); info.bondData = bondAnalysis; }
          } catch (bondError) {}
        }
        setCurrentCompound(info);
      } catch (e) {} finally { setAutoAnalyzing(false); }
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [smilesString, jsmeReady, setCurrentCompound, setAutoAnalyzing, setError, jsmeRef, setBondData]);

  const handleJsmeInit = useCallback((jsmeApplet) => {
    setJsmeRef(jsmeApplet); setJsmeReady(true);
    try { if (jsmeApplet.setEditable) jsmeApplet.setEditable(true); jsmeApplet.options("query,hydrogens"); } catch (err) {}
    
    setTimeout(async () => {
      if (smilesString && jsmeApplet) {
        try {
          const molData = await PubChemService.fetchMolFromSmiles(smilesString);
          if (molData && jsmeApplet.readMolFileSafe) jsmeApplet.readMolFileSafe(molData);
          else if (jsmeApplet.setSMILES) jsmeApplet.setSMILES(smilesString);
        } catch (error) {}
      }
    }, 100);
  }, [smilesString, setJsmeRef, setJsmeReady]);

  const handleStructureChange = useCallback((newSmiles) => {
    if (!newSmiles) return;
    const normalized = AnalysisService.normalizeSmiles(newSmiles);
    if (normalized !== AnalysisService.normalizeSmiles(smilesString)) setSmilesString(normalized);
  }, [smilesString, setSmilesString]);

  const handleAnalyze = async () => {
    try {
      const smiles = getSmiles();
      if (!smiles) { setError("Please draw a molecule first"); return; }
      setLoading(true); setError(null);
      const info = await PubChemService.searchBySmiles(smiles);
      if (jsmeRef && jsmeRef.molFile) {
        try {
          const bondAnalysis = AnalysisService.analyzeBonds(jsmeRef.molFile());
          if (bondAnalysis) { setBondData(bondAnalysis); info.bondData = bondAnalysis; }
        } catch (bondError) {}
      }
      setCurrentCompound(info);
    } catch (e) { setError("Analysis failed."); } finally { setLoading(false); }
  };

  const handleReset = () => {
    setSmilesString(''); setCurrentCompound(null); setBondData(null);
    if (jsmeRef?.setSMILES) jsmeRef.setSMILES(''); // Safe reset overriding
  };

  const handleTemplateClick = async (smiles) => {
    const normalized = AnalysisService.normalizeSmiles(smiles);
    setSmilesString(normalized); setBondData(null);
    if (jsmeRef && jsmeReady) {
      const molData = await PubChemService.fetchMolFromSmiles(normalized);
      if (molData && jsmeRef.readMolFileSafe) jsmeRef.readMolFileSafe(molData);
      else if (jsmeRef.setSMILES) jsmeRef.setSMILES(normalized);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center bg-gray-800/50 gap-4 relative z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg"><PenTool size={20} className="text-cyan-400" /></div>
            <div>
              <h2 className="text-white font-bold flex items-center gap-3">
                Interactive Chemical Canvas
                <AnimatePresence>
                  {autoAnalyzing && (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1.5 text-xs bg-cyan-900/40 text-cyan-400 px-2.5 py-1 rounded-full font-medium">
                      <Loader2 size={12} className="animate-spin" /> Auto-analyzing
                    </motion.span>
                  )}
                </AnimatePresence>
              </h2>
              <p className="text-xs text-gray-400">Professional molecular editor with stereochemistry support</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"><Eraser size={16} /> Reset</button>
            <button onClick={handleAnalyze} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2"><TestTube size={16} /> Force Identify</button>
          </div>
        </div>

        <div className="bg-white w-full relative z-10 p-2" style={{ minHeight: '600px', pointerEvents: 'auto' }}>
          <ErrorBoundary>
            <Jsme width="100%" height="600px" options="query,hydrogens" onChange={handleStructureChange} onInit={handleJsmeInit} />
          </ErrorBoundary>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col gap-3 shadow-lg">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Zap size={14} className="text-amber-400" /> Molecular Templates (Quick Load)</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((template) => (
            <button key={template.name} onClick={() => handleTemplateClick(template.smiles)} className="px-3 py-1.5 bg-gray-700/50 hover:bg-cyan-900/50 hover:text-cyan-300 hover:border-cyan-700 border border-gray-600 rounded-lg text-sm text-gray-300 transition-all font-medium">
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoPanel = () => {
  const { currentCompound, loading, error, bondData } = useChemicalStore();

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex flex-col space-y-6">
       <div className="animate-pulse flex flex-col space-y-6 w-full">
         <div className="h-48 bg-gray-700/50 rounded-xl w-full"></div>
         <div className="h-8 bg-gray-700 rounded w-3/4"></div>
         <div className="flex gap-4"><div className="h-6 bg-gray-700 rounded w-1/2"></div><div className="h-6 bg-gray-700 rounded w-1/2"></div></div>
         <div className="h-24 bg-gray-700/30 rounded-xl w-full"></div>
         <div className="h-16 bg-gray-700/30 rounded-xl w-full"></div>
       </div>
    </motion.div>
  );

  if (error) return (
    <div className="h-full bg-red-900/10 rounded-2xl border border-red-500/30 p-8 flex flex-col items-center justify-center text-center">
      <AlertCircle className="text-red-500 mb-4" size={32} />
      <h3 className="text-red-400 font-bold mb-2">Search Error</h3><p className="text-red-300/70 text-sm">{error}</p>
    </div>
  );

  if (!currentCompound) return (
    <div className="h-full bg-gray-800/30 rounded-2xl border border-gray-700 p-8 flex flex-col items-center justify-center text-center text-gray-500">
      <Database className="mb-4 opacity-20" size={48} />
      <p className="font-medium text-gray-400">Molecular Intelligence</p>
      <p className="text-xs mt-2 leading-relaxed">Search for a compound or draw one on the canvas to analyze its properties.</p>
    </div>
  );

  const functionalGroups = AnalysisService.detectFunctionalGroups(currentCompound.smiles);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden h-full max-h-[850px]">
      <div className="p-5 bg-gray-700/30 border-b border-gray-700">
        <h3 className="text-white font-bold flex items-center gap-2"><Info size={18} className="text-cyan-400" /> Smart Chemistry Assistant</h3>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
        
        {currentCompound.cid && currentCompound.cid !== 'External' && currentCompound.cid !== 'Custom' && (
          <div className="bg-white rounded-xl p-4 flex flex-col items-center border border-gray-700 shadow-inner relative">
            <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1"><ImageIcon size={10} /> 2D Preview</div>
            <img src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${currentCompound.cid}/PNG`} alt="Structure" className="max-h-48 object-contain mix-blend-multiply mt-4" />
          </div>
        )}

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">Standard Name <CopyButton text={currentCompound.name} /></label>
          <div className="text-white text-xl font-bold mt-1">{currentCompound.name}</div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">Formula <CopyButton text={currentCompound.molecularFormula} /></label>
            <div className="text-cyan-400 font-mono text-lg mt-1 font-bold">{currentCompound.molecularFormula}</div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Mass</label>
            <div className="text-white text-lg mt-1 font-bold">{currentCompound.molecularWeight} <span className="text-xs text-gray-500 font-normal">g/mol</span></div>
          </div>
        </div>
        
        {/* Advanced Properties Grid */}
        <div className="grid grid-cols-2 gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
           <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-bold uppercase">LogP (Lipophilicity)</span><span className="text-sm font-medium text-gray-200">{currentCompound.xLogP}</span></div>
           <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-bold uppercase">TPSA</span><span className="text-sm font-medium text-gray-200">{currentCompound.tpsa} Å²</span></div>
           <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-bold uppercase">H-Bond Donors</span><span className="text-sm font-medium text-gray-200">{currentCompound.hBondDonors}</span></div>
           <div className="flex flex-col"><span className="text-[9px] text-gray-500 font-bold uppercase">H-Bond Acceptors</span><span className="text-sm font-medium text-gray-200">{currentCompound.hBondAcceptors}</span></div>
           <div className="flex flex-col col-span-2"><span className="text-[9px] text-gray-500 font-bold uppercase">Rotatable Bonds</span><span className="text-sm font-medium text-gray-200">{currentCompound.rotatableBonds}</span></div>
        </div>

        {functionalGroups.length > 0 && (
          <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-xl p-4">
             <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-cyan-500/20 rounded-md"><Beaker size={14} className="text-cyan-400" /></div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Functional Groups</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {functionalGroups.map(group => (<span key={group} className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-300 shadow-sm font-medium">{group}</span>))}
            </div>
            <div className="text-[9px] text-gray-500 mt-2 italic">* Detected via SMARTS-like structural matching.</div>
          </div>
        )}

        {bondData && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg"><Activity size={14} className="text-purple-400" /></div>
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Electronegativity Approximation</h4>
                <span className="text-[9px] text-gray-500">*Simplified educational model.</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-red-900/20 rounded-lg border border-red-800/30"><div className="text-lg font-bold text-red-400">{bondData.ionic}</div><div className="text-[10px] text-red-300/70 uppercase tracking-wide">Ionic</div></div>
              <div className="text-center p-2 bg-blue-900/20 rounded-lg border border-blue-800/30"><div className="text-lg font-bold text-blue-400">{bondData.polar}</div><div className="text-[10px] text-blue-300/70 uppercase tracking-wide">Polar</div></div>
              <div className="text-center p-2 bg-green-900/20 rounded-lg border border-green-800/30"><div className="text-lg font-bold text-green-400">{bondData.nonPolar}</div><div className="text-[10px] text-green-300/70 uppercase tracking-wide">Non-Polar</div></div>
            </div>
          </div>
        )}
        
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">IUPAC Designation <CopyButton text={currentCompound.iupacName} /></label>
          <div className="text-gray-300 text-sm mt-1 leading-relaxed">{currentCompound.iupacName}</div>
        </div>
        
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">SMILES Notation <CopyButton text={currentCompound?.smiles} /></label>
          <div className="mt-2 p-3 bg-gray-900 rounded-xl border border-gray-700 text-[10px] font-mono text-gray-400 break-all">
            {currentCompound?.smiles || "SMILES unavailable"}
          </div>
        </div>
        
        {currentCompound.description && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Educational Insight</label>
            <div className="text-gray-400 text-xs italic mt-2 leading-relaxed p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              "{currentCompound.description}"
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-10 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-900/50"><Atom size={32} className="text-white" /></div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase">Chemical <span className="text-cyan-500">Workstation</span></h1>
              <p className="text-gray-400 font-medium">Professional Molecular Design & Cheminformatics Platform</p>
            </div>
          </div>
        </div>

        <SearchBar />

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <ErrorBoundary><UnifiedMolecularCanvas /></ErrorBoundary>
          </div>
          <div className="lg:col-span-1">
            <InfoPanel />
          </div>
        </div>

        <div className="text-center text-gray-600 text-[10px] uppercase tracking-[0.2em] font-bold mt-4">
          Educational Cheminformatics Platform • Powered by PubChem & JSME Molecular Editor
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(55, 65, 81, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(75, 85, 99, 1); }
      `}} />
    </div>
  );
}