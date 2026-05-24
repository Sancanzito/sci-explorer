// Articles/ParticleModel/ParticleFooter.jsx
import React, { useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const ParticleFooter = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    const element = document.getElementById('printable-chemistry-content');
    if (!element) {
      console.error("Target container not found for PDF generation.");
      setIsGenerating(false);
      return;
    }

    try {
      element.setAttribute('data-printing', 'true');
      await new Promise((resolve) => setTimeout(resolve, 150));

      const imgData = await toJpeg(element, {
        quality: 0.95,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
        pixelRatio: 2
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save('Particle_Model_Study_Guide.pdf');
    } catch (error) {
      console.error("Failed to generate PDF document layout:", error);
    } finally {
      element.removeAttribute('data-printing');
      setIsGenerating(false);
    }
  };

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        
        {/* Academic Citations Section - Using references from Particle Model context */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Verified Educational Sources
          </h4>
          <ol className="space-y-3 decimal ml-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <li className="pl-1">
              <span>BBC Bitesize. (2024). Particle model of matter - GCSE Chemistry (Single Science) revision. </span>
              <a 
                href="https://www.bbc.co.uk/bitesize/guides/z23g7ty/revision/1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
              >
                View Resource
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
            <li className="pl-1">
              <span>Khan Academy. (2024). States of matter and intermolecular forces. </span>
              <a 
                href="https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
              >
                View Resource
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
            <li className="pl-1">
              <span>PhET Interactive Simulations. (2024). States of Matter: Basics. University of Colorado Boulder. </span>
              <a 
                href="https://phet.colorado.edu/en/simulations/states-of-matter-basics" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
              >
                View Resource
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
          </ol>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800/60 pt-8">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Particle Model Dashboard. Created for Grade 7 Natural Sciences education.
          </p>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 group cursor-pointer ${
              isGenerating 
                ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Compiling Document...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-cyan-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2z" />
                </svg>
                Export Study Guide (PDF)
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ParticleFooter;