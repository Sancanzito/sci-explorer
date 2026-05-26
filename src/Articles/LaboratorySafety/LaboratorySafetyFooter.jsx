// components/LaboratorySafety/LabSafetyFooter.jsx
import React, { useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const LabSafetyFooter = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const references = [
    {
      id: 1,
      citation: "Occupational Safety and Health Administration (OSHA). (2024). Laboratory Safety Guidance.",
      url: "https://www.osha.gov/laboratories"
    },
    {
      id: 2,
      citation: "American Chemical Society (ACS). (2024). Safety in Academic Chemistry Laboratories.",
      url: "https://www.acs.org/"
    },
    {
      id: 3,
      citation: "Centers for Disease Control and Prevention (CDC). (2023). Biosafety in Microbiological and Biomedical Laboratories (BMBL).",
      url: "https://www.cdc.gov/labs/BMBL.html"
    }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    // Specifically target the safety content wrapper
    const element = document.getElementById('printable-safety-content');
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
      pdf.save('Laboratory_Safety_Guide.pdf');
    } catch (error) {
      console.error("Failed to generate PDF document layout:", error);
    } finally {
      element.removeAttribute('data-printing');
      setIsGenerating(false);
    }
  };

  return (
    <footer className="mt-12 border-t-4 border-yellow-500 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        
        {/* Academic Citations Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest selection:bg-transparent">
            Verified Safety Guidelines
          </h4>
          <ol className="space-y-3 decimal ml-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {references.map((ref) => (
              <li key={ref.id} className="pl-1">
                <span>{ref.citation} </span>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-yellow-600 dark:text-yellow-500 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
                >
                  View Resource
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800/60 pt-8">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left selection:bg-transparent">
            &copy; {new Date().getFullYear()} Safety First Dashboard. Intended for educational use.
          </p>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all transform active:scale-95 group cursor-pointer ${
              isGenerating 
                ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Compiling PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-yellow-900 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2z" />
                </svg>
                Export Safety Protocol (PDF)
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default LabSafetyFooter;