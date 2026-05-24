// InvestigationFooter.jsx
import React, { useState } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { PictureAsPdf, Science, School } from '@mui/icons-material';
import { Button, CircularProgress, Chip, Tooltip } from '@mui/material';

const InvestigationFooter = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const references = [
    { id: 1, citation: "Encyclopædia Britannica. (2024). Scientific method and investigation techniques.", url: "https://www.britannica.com/science/scientific-method" },
    { id: 2, citation: "Wikipedia Contributors. (2026). History of scientific inquiry and experimentation.", url: "https://en.wikipedia.org/wiki/History_of_scientific_method" },
    { id: 3, citation: "BYJU'S Learning Content. (2023). Laboratory safety and measurement skills for young scientists.", url: "https://byjus.com/chemistry/laboratory-safety-rules/" },
    { id: 4, citation: "PhET Interactive Simulations. (2024). Science investigation and measurement simulations.", url: "https://phet.colorado.edu" }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    const element = document.getElementById('main-content-container');
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
      pdf.save('Science_Investigation_Guide.pdf');
    } catch (error) {
      console.error("Failed to generate PDF document layout:", error);
    } finally {
      element.removeAttribute('data-printing');
      setIsGenerating(false);
    }
  };

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors rounded-t-2xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <School className="text-gray-400 text-sm" />
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Verified Educational Sources
            </h4>
          </div>
          <ol className="space-y-3 list-decimal ml-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {references.map((ref) => (
              <li key={ref.id} className="pl-1">
                <span>{ref.citation} </span>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
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
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <Chip icon={<Science />} label="MATATAG Curriculum Aligned" size="small" variant="outlined" />
            <Chip icon={<School />} label="Inquiry-Based Learning" size="small" variant="outlined" />
            <span>&copy; {new Date().getFullYear()} Science Investigation Dashboard</span>
          </div>
          
          <Tooltip title="Download this page as a PDF study guide">
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              variant="contained"
              sx={{ bgcolor: '#2563eb', borderRadius: '12px', '&:hover': { bgcolor: '#1d4ed8' } }}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
            >
              {isGenerating ? 'Compiling Document...' : 'Export Study Guide (PDF)'}
            </Button>
          </Tooltip>
        </div>

      </div>
    </footer>
  );
};

export default InvestigationFooter;