// pages/HomePage/components/FormulaWidget.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FormulaWidget = () => {
  const [hoveredVar, setHoveredVar] = useState(null);
  
  const formulas = [
    { name: "Newton's Law of Cooling", formula: "T(t) = T_a + (T_0 - T_a)e^{-kt}", variables: {
      "T(t)": "Temperature at time t",
      "T_a": "Ambient temperature",
      "T_0": "Initial temperature",
      "k": "Cooling constant",
      "t": "Time"
    }},
    { name: "Ohm's Law", formula: "V = IR", variables: {
      "V": "Voltage (volts)",
      "I": "Current (amperes)",
      "R": "Resistance (ohms)"
    }}
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-500/20 overflow-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xl">📐</div>
        <h3 className="font-semibold text-gray-800 dark:text-white">Interactive Formula Key</h3>
      </div>
      
      <div className="space-y-4">
        {formulas.map((formula, idx) => (
          <div key={idx} className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{formula.name}</p>
            <div className="bg-gray-900/50 rounded-lg p-2 text-center font-mono text-sm text-cyan-400">
              {formula.formula}
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(formula.variables).map(([varName, desc]) => (
                <div
                  key={varName}
                  onMouseEnter={() => setHoveredVar(varName)}
                  onMouseLeave={() => setHoveredVar(null)}
                  className="relative"
                >
                  <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded cursor-help">
                    {varName}
                  </span>
                  {hoveredVar === varName && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10"
                    >
                      {desc}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FormulaWidget;