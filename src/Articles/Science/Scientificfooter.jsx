import React, { useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const SciSkillsFooter = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const references = [
    {
      id: 1,
      citation: "National Science Teaching Association (NSTA). (2024). Science and Engineering Practices.",
      url: "https://www.nsta.org/"
    },
    {
      id: 2,
      citation: "Next Generation Science Standards (NGSS). (2023). Appendix F - Science and Engineering Practices.",
      url: "https://www.nextgenscience.org/"
    },
    {
      id: 3,
      citation: "Science Buddies. (2024). Steps of the Scientific Method.",
      url: "https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method"
    }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    const element = document.getElementById('printable-investigation-content');
    if (!element) {
      console.error("Target container not found.");
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
      pdf.save('Scientific_Investigation_Skills.pdf');
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      element.removeAttribute('data-printing');
      setIsGenerating(false);
    }
  };

  return (
    <footer className="mt-16 border-t-4 border-cyan-500 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest selection:bg-transparent">
            Educational Standards & Resources
          </h4>
          <ol className="space-y-3 decimal ml-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {references.map((ref) => (
              <li key={ref.id} className="pl-1">
                <span>{ref.citation} </span>
                <a 
                  href={ref.url} 
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
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800/60 pt-8">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left selection:bg-transparent">
            &copy; {new Date().getFullYear()} Scientific Method Dashboard. Designed for young explorers.
          </p>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all transform active:scale-95 group cursor-pointer ${
              isGenerating 
                ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Compiling Notes...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-cyan-100 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v11a2 2 0 01-2 2z" />
                </svg>
                Download Study Guide (PDF)
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SciSkillsFooter;