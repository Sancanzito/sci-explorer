// components/Solutions/SolutionFooter.jsx
import React, { useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, FileText, ExternalLink, Loader2 } from 'lucide-react';

const SolutionFooter = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const references = [
    {
      id: 1,
      citation: "OpenStax. (2024). Chemistry 2e: Solutions and Colloids. Rice University.",
      url: "https://openstax.org/details/books/chemistry-2e"
    },
    {
      id: 2,
      citation: "LibreTexts Chemistry. (2025). Solubility and Saturation. U.S. Department of Education.",
      url: "https://chem.libretexts.org/"
    },
    {
      id: 3,
      citation: "PhET Interactive Simulations. (2024). Concentration and Molarity visualizers. University of Colorado Boulder.",
      url: "https://phet.colorado.edu/en/simulations/concentration"
    }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    const element = document.getElementById('printable-solutions-content');
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
      pdf.save('Solutions_And_Concentration_Chapter.pdf');
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
        
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest selection:bg-transparent">
            <FileText className="w-4 h-4" />
            Verified Educational Sources
          </h4>
          <ol className="space-y-3 decimal ml-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {references.map((ref) => (
              <li key={ref.id} className="pl-1">
                <span>{ref.citation} </span>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
                >
                  View Resource
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800/60 pt-8">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left selection:bg-transparent">
            &copy; {new Date().getFullYear()} Interactive Science Textbook. Created for scholastic illustration purposes.
          </p>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 group cursor-pointer ${
              isGenerating 
                ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white opacity-75" />
                Compiling Chapter...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-teal-200 group-hover:text-white transition-colors" />
                Export Chapter (PDF)
              </>
            )}
          </button>
        </div>

      </div>
    </footer>
  );
};

export default SolutionFooter;