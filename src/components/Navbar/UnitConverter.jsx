// components/Navbar/UnitConverter.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import convert from 'convert-units';

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [availableUnits, setAvailableUnits] = useState([]);
  const [converterValues, setConverterValues] = useState({
    fromUnit: '',
    toUnit: '',
    fromValue: 1,
    toValue: 0
  });

  // Get all possible categories from convert library
  const categories = convert().measures();
  
  // Category display names and icons
  const categoryConfig = {
    length: { name: 'Length', icon: '📏', color: 'from-blue-500 to-cyan-500' },
    mass: { name: 'Mass', icon: '⚖️', color: 'from-gray-500 to-slate-500' },
    volume: { name: 'Volume', icon: '🧪', color: 'from-green-500 to-teal-500' },
    area: { name: 'Area', icon: '📐', color: 'from-purple-500 to-pink-500' },
    temperature: { name: 'Temperature', icon: '🌡️', color: 'from-red-500 to-orange-500' },
    time: { name: 'Time', icon: '⏰', color: 'from-indigo-500 to-blue-500' },
    speed: { name: 'Speed', icon: '🚀', color: 'from-yellow-500 to-orange-500' },
    pressure: { name: 'Pressure', icon: '💨', color: 'from-cyan-500 to-blue-500' },
    energy: { name: 'Energy', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
    power: { name: 'Power', icon: '💡', color: 'from-orange-500 to-red-500' },
    currency: { name: 'Currency', icon: '💰', color: 'from-emerald-500 to-green-500' },
    digital: { name: 'Digital Storage', icon: '💾', color: 'from-sky-500 to-blue-500' },
    partsPer: { name: 'Parts-Per', icon: '🔢', color: 'from-violet-500 to-purple-500' }
  };

  // Update available units when category changes
  useEffect(() => {
    try {
      const units = convert().list(selectedCategory);
      setAvailableUnits(units);
      
      if (units.length > 0) {
        const newFromUnit = units[0].abbr;
        const newToUnit = units[1]?.abbr || units[0].abbr;
        
        setConverterValues(prev => {
          const newValues = {
            ...prev,
            fromUnit: newFromUnit,
            toUnit: newToUnit
          };
          
          // Perform initial conversion
          const result = convert(prev.fromValue || 1)
            .from(newFromUnit)
            .to(newToUnit);
          
          return {
            ...newValues,
            toValue: result
          };
        });
      }
    } catch (error) {
      console.error('Error loading units:', error);
    }
  }, [selectedCategory]);

  // Perform conversion
  const performConversion = (value, fromUnit, toUnit) => {
    try {
      if (fromUnit && toUnit && value !== undefined && !isNaN(value)) {
        const result = convert(value).from(fromUnit).to(toUnit);
        return result;
      }
      return 0;
    } catch (error) {
      console.error('Conversion error:', error);
      return 0;
    }
  };

  // Handle input changes
  const updateConversion = (field, value) => {
    if (field === 'fromValue') {
      const numValue = parseFloat(value) || 0;
      const result = performConversion(numValue, converterValues.fromUnit, converterValues.toUnit);
      setConverterValues({
        ...converterValues,
        fromValue: value,
        toValue: result
      });
    } else if (field === 'toValue') {
      const numValue = parseFloat(value) || 0;
      const result = performConversion(numValue, converterValues.toUnit, converterValues.fromUnit);
      setConverterValues({
        ...converterValues,
        toValue: value,
        fromValue: result
      });
    } else if (field === 'fromUnit') {
      const result = performConversion(converterValues.fromValue, value, converterValues.toUnit);
      setConverterValues({
        ...converterValues,
        fromUnit: value,
        toValue: result
      });
    } else if (field === 'toUnit') {
      const result = performConversion(converterValues.fromValue, converterValues.fromUnit, value);
      setConverterValues({
        ...converterValues,
        toUnit: value,
        toValue: result
      });
    }
  };

  // Swap units
  const swapUnits = () => {
    const tempUnit = converterValues.fromUnit;
    const tempValue = converterValues.fromValue;
    updateConversion('fromUnit', converterValues.toUnit);
    setTimeout(() => {
      setConverterValues(prev => ({
        ...prev,
        toUnit: tempUnit,
        fromValue: prev.toValue,
        toValue: tempValue
      }));
    }, 0);
  };

  // Get unit display name
  const getUnitDisplayName = (unitAbbr) => {
    const unit = availableUnits.find(u => u.abbr === unitAbbr);
    return unit ? `${unit.unit} (${unitAbbr})` : unitAbbr;
  };

  // Format number for display
  const formatNumber = (num) => {
    if (isNaN(num)) return '0';
    if (Math.abs(num) < 0.000001 && num !== 0) {
      return num.toExponential(8);
    }
    if (Math.abs(num) > 999999) {
      return num.toExponential(8);
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Universal Unit Converter
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Convert between any units
        </p>
      </div>

      {/* Category Selector */}
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
          Category
        </label>
        <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-1">
          {categories.map((cat) => {
            const config = categoryConfig[cat] || { 
              name: cat.charAt(0).toUpperCase() + cat.slice(1), 
              icon: '🔧',
              color: 'from-gray-500 to-gray-600'
            };
            return (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-xs px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
                  selectedCategory === cat
                    ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-sm">{config.icon}</span>
                <span className="hidden sm:inline">{config.name}</span>
                <span className="sm:hidden">{cat.slice(0, 3)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* From Unit */}
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
          From
        </label>
        <div className="flex gap-2">
          <select
            value={converterValues.fromUnit}
            onChange={(e) => updateConversion('fromUnit', e.target.value)}
            className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="">Select unit</option>
            {availableUnits.map((unit) => (
              <option key={unit.abbr} value={unit.abbr}>
                {unit.unit} ({unit.abbr})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={converterValues.fromValue}
            onChange={(e) => updateConversion('fromValue', e.target.value)}
            className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter value"
          />
        </div>
      </div>
      
      {/* Swap Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={swapUnits}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-500 hover:text-cyan-500 transition-colors text-sm flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          🔄 Swap Units
        </motion.button>
      </div>
      
      {/* To Unit */}
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
          To
        </label>
        <div className="flex gap-2">
          <select
            value={converterValues.toUnit}
            onChange={(e) => updateConversion('toUnit', e.target.value)}
            className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="">Select unit</option>
            {availableUnits.map((unit) => (
              <option key={unit.abbr} value={unit.abbr}>
                {unit.unit} ({unit.abbr})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={converterValues.toValue}
            onChange={(e) => updateConversion('toValue', e.target.value)}
            className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Result"
          />
        </div>
      </div>
      
      {/* Detailed Result Display */}
      {converterValues.fromUnit && converterValues.toUnit && (
        <motion.div 
          className="text-center pt-3 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Conversion Result
          </p>
          <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
            {converterValues.fromValue} {converterValues.fromUnit} = {formatNumber(converterValues.toValue)} {converterValues.toUnit}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {getUnitDisplayName(converterValues.fromUnit)} → {getUnitDisplayName(converterValues.toUnit)}
          </p>
        </motion.div>
      )}

      {/* Additional Info */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          Powered by convert-units • Supports {categories.length}+ categories
        </p>
      </div>
    </div>
  );
};

export default UnitConverter;