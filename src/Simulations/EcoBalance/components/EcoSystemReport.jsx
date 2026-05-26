// games/EcoBalance/components/EcosystemReport.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaSkull, FaChartLine, FaBookOpen, FaDownload } from 'react-icons/fa';
import { useGameStore } from '../store/gameStore';

// Simple Line Chart Component for Report
const ReportLineChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Find max value
    let maxValue = 0;
    data.forEach(entry => {
      if (entry.populations?.totalProducers > maxValue) maxValue = entry.populations.totalProducers;
      if (entry.populations?.totalPrimary > maxValue) maxValue = entry.populations.totalPrimary;
      if (entry.populations?.totalSecondary > maxValue) maxValue = entry.populations.totalSecondary;
      if (entry.populations?.totalApex > maxValue) maxValue = entry.populations.totalApex;
    });
    maxValue = maxValue || 10000;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = height - 40 - (i * (height - 80) / 4);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.fillText(Math.round(maxValue * i / 4), 5, y + 3);
    }
    
    // Define colors for each line
    const lines = [
      { key: 'populations.totalProducers', color: '#4ade80', name: 'Producers' },
      { key: 'populations.totalPrimary', color: '#eab308', name: 'Primary' },
      { key: 'populations.totalSecondary', color: '#f97316', name: 'Secondary' },
      { key: 'populations.totalApex', color: '#ef4444', name: 'Apex' }
    ];
    
    // Draw each line
    lines.forEach(line => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      
      let firstPoint = true;
      data.forEach((entry, i) => {
        const value = getNestedValue(entry, line.key);
        const x = 40 + (i * (width - 60) / Math.max(1, data.length - 1));
        const y = height - 40 - (value / maxValue) * (height - 80);
        
        if (firstPoint && isFinite(y)) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else if (isFinite(y)) {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Arial';
    data.forEach((entry, i) => {
      if (i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) {
        const x = 40 + (i * (width - 60) / Math.max(1, data.length - 1));
        ctx.fillText(entry.time || i, x - 10, height - 25);
      }
    });
    
    // Draw legend
    let legendX = width - 120;
    let legendY = 15;
    lines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillRect(legendX, legendY + idx * 18, 12, 12);
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.fillText(line.name, legendX + 16, legendY + idx * 18 + 10);
    });
    
  }, [data]);
  
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={250} 
      className="w-full h-auto bg-gray-800/50 rounded-lg"
      style={{ maxHeight: '250px' }}
    />
  );
};

function getCollapseReason(report) {
  const { finalPopulations } = report;
  
  if ((finalPopulations.grass || 0) < 100 && (finalPopulations.algae || 0) < 100) {
    return "Complete producer collapse - no energy entering the ecosystem";
  }
  if ((finalPopulations.rabbit || 0) < 10 && (finalPopulations.deer || 0) < 10) {
    return "Primary consumer extinction - predators lacked food source";
  }
  if ((finalPopulations.wolf || 0) < 3 && (finalPopulations.eagle || 0) < 3) {
    return "Apex predator loss - trophic cascade initiated";
  }
  return "Multiple species extinctions cascaded through the food web";
}

const EcosystemReport = ({ onClose }) => {
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const { getEcosystemReport, resetSimulation, addNotification } = useGameStore();
  const report = getEcosystemReport();
  
  const isStable = report.stability === 'Stable';
  const isCollapsed = report.stability === 'Collapsed';
  
  const handleSaveJournal = () => {
    if (journalEntry.trim()) {
      localStorage.setItem('eco-journal', JSON.stringify({
        entry: journalEntry,
        timestamp: new Date().toISOString(),
        report: report
      }));
      addNotification('Journal entry saved!', 'success');
      setShowJournal(false);
    }
  };
  
  const handleNewGame = () => {
    resetSimulation();
    onClose();
  };
  
  const handleExportReport = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `eco-report-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 p-6 ${
          isStable ? 'bg-gradient-to-r from-green-600 to-emerald-700' :
          isCollapsed ? 'bg-gradient-to-r from-red-600 to-red-800' :
          'bg-gradient-to-r from-yellow-600 to-orange-700'
        } text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">{isStable ? '🏆' : isCollapsed ? '💀' : '⚠️'}</div>
              <h2 className="text-2xl font-bold">
                {isStable ? 'Ecosystem Thriving!' : isCollapsed ? 'Ecosystem Collapsed' : 'Ecosystem Unstable'}
              </h2>
              <p className="text-white/80 mt-1">
                Final Health Score: {Math.round(report.finalHealth)}%
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-3">📊 Simulation Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 text-sm">
                  <strong>Final Health:</strong> {Math.round(report.finalHealth)}%
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <strong>Stability Status:</strong> {report.stability}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <strong>Interventions Used:</strong> {report.interventions?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">
                  <strong>Total Simulation Steps:</strong> {report.timeline?.length || 0}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <strong>Species Surviving:</strong> {
                    Object.values(report.finalPopulations || {}).filter(p => p > 0).length
                  }/8
                </p>
              </div>
            </div>
          </div>
          
          {/* Final Populations */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-3">🌿 Final Populations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(report.finalPopulations || {}).map(([name, pop]) => (
                <div key={name} className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl mb-1">
                    {name === 'grass' ? '🌿' : name === 'algae' ? '🟢' : 
                     name === 'rabbit' ? '🐇' : name === 'deer' ? '🦌' :
                     name === 'fox' ? '🦊' : name === 'snake' ? '🐍' :
                     name === 'wolf' ? '🐺' : '🦅'}
                  </div>
                  <div className="text-white font-bold">{Math.round(pop).toLocaleString()}</div>
                  <div className="text-gray-400 text-xs capitalize">{name}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Population Trend Graph */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold text-green-400 mb-3">📈 Population Trends Over Time</h3>
              <ReportLineChart data={report.timeline} />
            </div>
          )}
          
          {/* Ecological Analysis */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-3">🔬 Ecological Analysis</h3>
            {isStable && (
              <div className="space-y-2 text-gray-300 text-sm">
                <p>✓ Your ecosystem achieved sustainable balance across all trophic levels.</p>
                <p>✓ Population cycles demonstrate healthy predator-prey dynamics.</p>
                <p>✓ Energy transfer efficiency maintained at approximately 10% between levels.</p>
                <p className="text-green-400 mt-2">Key Success Factors:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Balanced predator-prey ratios maintained</li>
                  <li>Producers never dropped below carrying capacity threshold</li>
                  <li>Interventions were applied appropriately</li>
                </ul>
              </div>
            )}
            {isCollapsed && (
              <div className="space-y-2 text-gray-300 text-sm">
                <p>⚠️ The ecosystem collapsed due to trophic cascade effects.</p>
                <p>⚠️ Critical failure: {getCollapseReason(report)}</p>
                <p className="text-yellow-400 mt-2">What Went Wrong:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Producer population crashed below sustainable levels</li>
                  <li>Energy transfer efficiency dropped below 5%</li>
                  <li>Species extinction cascaded through the food web</li>
                </ul>
                <p className="text-blue-400 mt-2">Learning Opportunity:</p>
                <p>Ecosystems require balanced intervention. Consider smaller, gradual changes in your next simulation.</p>
              </div>
            )}
            {!isStable && !isCollapsed && (
              <div className="space-y-2 text-gray-300 text-sm">
                <p>⚠️ The ecosystem is struggling but hasn't completely collapsed.</p>
                <p>⚠️ Immediate action could still save this ecosystem.</p>
                <p className="text-yellow-400 mt-2">Areas for Improvement:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Monitor population ratios between trophic levels</li>
                  <li>Avoid drastic interventions</li>
                  <li>Maintain producer populations above minimum thresholds</li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Intervention History */}
          {report.interventions && report.interventions.length > 0 && (
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold text-green-400 mb-3">📝 Intervention History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {report.interventions.map((intervention, idx) => (
                  <div key={idx} className="text-sm text-gray-300 border-l-2 border-green-500 pl-3 py-1">
                    <span className="text-green-400">Step {intervention.time}:</span> {intervention.type} - {intervention.effect}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reflection Journal */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
              <FaBookOpen /> Reflection Journal
            </h3>
            {!showJournal ? (
              <div>
                <p className="text-gray-300 text-sm mb-3">
                  Write a reflection about what you learned from this simulation. How did your decisions affect the ecosystem?
                </p>
                <button
                  onClick={() => setShowJournal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Write Journal Entry
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="I learned that..."
                  className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-green-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveJournal}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Reflection
                  </button>
                  <button
                    onClick={() => setShowJournal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleNewGame}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Start New Simulation
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EcosystemReport;