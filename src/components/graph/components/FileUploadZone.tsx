import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onUpload: (file: File, options?: any) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUpload, loading, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState({
    handle_missing: 'drop',
    remove_duplicates: true
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
      } else {
        alert('Please upload a CSV or Excel file');
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile, options);
    }
  }, [selectedFile, options, onUpload]);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drag & drop your file here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports CSV, Excel (.xlsx, .xls) up to 100MB
            </p>
          </div>

          <label className="cursor-pointer">
            <span className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Browse Files
            </span>
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
          </label>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle size={16} />
              <span>{selectedFile.name}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Options Panel */}
      {selectedFile && (
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing Options</h4>
          
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">Missing Values:</label>
            <select
              value={options.handle_missing}
              onChange={(e) => setOptions({ ...options, handle_missing: e.target.value as any })}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
            >
              <option value="drop">Drop rows</option>
              <option value="fill_mean">Fill with mean</option>
              <option value="fill_median">Fill with median</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={options.remove_duplicates}
              onChange={(e) => setOptions({ ...options, remove_duplicates: e.target.checked })}
              className="rounded"
            />
            Remove duplicate rows
          </label>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload & Analyze
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};