// src/components/graph/utils/formatters.ts

export const formatScientific = (val: any): string => {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val !== 'number') return String(val);
  
  // Handle very small numbers
  if (Math.abs(val) < 0.0001 && val !== 0) {
    return val.toExponential(4);
  }
  
  // Handle large numbers
  if (Math.abs(val) > 10000) {
    return val.toExponential(4);
  }
  
  // Default formatting
  return val.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
};

export const formatMetadata = (key: string): string => {
  // Convert snake_case or camelCase to readable text
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

export const formatPValue = (pValue: number): { text: string; color: string } => {
  if (pValue < 0.001) return { text: 'p < 0.001 ***', color: 'text-green-600' };
  if (pValue < 0.01) return { text: `p = ${pValue.toFixed(4)} **`, color: 'text-green-600' };
  if (pValue < 0.05) return { text: `p = ${pValue.toFixed(4)} *`, color: 'text-green-600' };
  if (pValue < 0.1) return { text: `p = ${pValue.toFixed(4)} †`, color: 'text-orange-600' };
  return { text: `p = ${pValue.toFixed(4)}`, color: 'text-gray-500' };
};