// MainContent.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, CardContent, Chip, LinearProgress, Collapse, IconButton, 
  Button, Radio, RadioGroup, FormControlLabel, Checkbox, Slider, Tooltip
} from '@mui/material';
import {
  Science, Biotech, Calculate, Rule, MenuBook, TableChart, Lightbulb,
  Checklist, Warning as WarningIcon, QuestionAnswer, ExpandLess, ExpandMore,
  Visibility, Thermostat, Straighten, Scale, Timeline, Engineering, 
  LocalHospital, Kitchen, WbSunny, WaterDrop, RocketLaunch, ThumbUp, ThumbDown,
  School, SafetyDivider, Report, CheckCircle, FlightTakeoff, DesignServices
} from '@mui/icons-material';

const MainContent = () => {
  const [safetyQuizAnswers, setSafetyQuizAnswers] = useState({});
  const [safetyQuizSubmitted, setSafetyQuizSubmitted] = useState(false);
  const [measurementAnswers, setMeasurementAnswers] = useState({});
  const [measurementSubmitted, setMeasurementSubmitted] = useState(false);
  const [obsInferAnswers, setObsInferAnswers] = useState({});
  const [obsInferSubmitted, setObsInferSubmitted] = useState(false);
  
  // States for the new synthesis reflection questions at the bottom
  const [synthesisAnswers, setSynthesisAnswers] = useState({});
  const [synthesisSubmitted, setSynthesisSubmitted] = useState(false);

  const [checklistItems, setChecklistItems] = useState({
    ruler: false, labTools: false, safetyRules: false, recordObs: false
  });
  const [temperatureValue, setTemperatureValue] = useState(25);
  const [cylinderLevel, setCylinderLevel] = useState(42);

  const handleChecklistChange = (item) => {
    setChecklistItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const safetyQuiz = [
    { id: 'q1', text: 'Wearing goggles is optional if you are careful.', correct: false },
    { id: 'q2', text: 'You should tie back long hair during a lab experiment.', correct: true },
    { id: 'q3', text: 'It is safe to eat snacks during a chemistry experiment.', correct: false },
    { id: 'q4', text: 'If you see a broken beaker, tell the teacher immediately.', correct: true }
  ];

  const measurementQuiz = [
    { id: 'm1', text: 'Which unit is used to measure length?', options: ['Gram', 'Liter', 'Centimeter', 'Second'], correct: 'Centimeter' },
    { id: 'm2', text: 'What is the correct eye level to read a graduated cylinder?', options: ['Above the meniscus', 'At the meniscus', 'Below the meniscus', 'Any level is fine'], correct: 'At the meniscus' },
    { id: 'm3', text: 'The unit for temperature in science is:', options: ['Fahrenheit', 'Celsius', 'Kelvin', 'All of the above'], correct: 'Celsius' }
  ];

  const obsInferQuiz = [
    { id: 'o1', text: 'The liquid is blue.', type: 'observation' },
    { id: 'o2', text: 'The liquid must be poisonous.', type: 'inference' },
    { id: 'o3', text: 'The beaker has a crack.', type: 'observation' },
    { id: 'o4', text: 'The experiment will probably fail.', type: 'inference' }
  ];

  // Synthesis review data
  const synthesisQuestions = [
    { id: 's1', text: 'When you use a ruler or measuring tape to find out exactly how far your airplane flew, which scientific skill are you practicing?', options: ['Formulating a Hypothesis', 'Accurate Measurement', 'Drawing an Inference', 'Controlling Variables'], correct: 'Accurate Measurement' },
    { id: 's2', text: 'Why is it crucial to use the exact same type of paper and throw the airplane from the exact same line every single time?', options: ['To make the flight look cool', 'To make it fly faster', 'To control variables so the test is fair', 'To save paper materials'], correct: 'To control variables so the test is fair' },
    { id: 's3', text: 'If you state: "The airplane with the folded nose cone will fly the farthest because it cuts through air easily," you are:', options: ['Recording a result data point', 'Making a testable Hypothesis', 'Listing a laboratory piece of equipment', 'Creating a variable control'], correct: 'Making a testable Hypothesis' }
  ];

  const handleSafetySubmit = () => setSafetyQuizSubmitted(true);
  const handleMeasurementSubmit = () => setMeasurementSubmitted(true);
  const handleObsInferSubmit = () => setObsInferSubmitted(true);
  const handleSynthesisSubmit = () => setSynthesisSubmitted(true);

  const getSafetyScore = () => {
    let correct = 0;
    safetyQuiz.forEach(q => { if (safetyQuizAnswers[q.id] === q.correct) correct++; });
    return correct;
  };

  const getMeasurementScore = () => {
    let correct = 0;
    measurementQuiz.forEach(q => { if (measurementAnswers[q.id] === q.correct) correct++; });
    return correct;
  };

  const getObsInferScore = () => {
    let correct = 0;
    obsInferQuiz.forEach(q => { if (obsInferAnswers[q.id] === q.type) correct++; });
    return correct;
  };

  const getSynthesisScore = () => {
    let correct = 0;
    synthesisQuestions.forEach(q => { if (synthesisAnswers[q.id] === q.correct) correct++; });
    return correct;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const expandedEquipment = [
    { 
      name: 'Beaker', visual: '🧪', color: 'from-blue-400 to-blue-600', use: 'The ultimate liquid cup!', 
      studentDesc: 'Think of this as a wide-mouthed glass jar. It is perfect for mixing, stirring, and heating up liquids. It has lines on the side, but it is only for rough guesses, not super exact measurements!', unit: 'Milliliters (mL)' 
    },
    { 
      name: 'Erlenmeyer Flask', visual: '📐', color: 'from-cyan-400 to-cyan-600', use: 'The anti-splash cone!', 
      studentDesc: 'With its signature cone shape and narrow neck, this flask lets you swirl liquids around like a mad scientist without risking any accidental spills or splashes.', unit: 'Milliliters (mL)' 
    },
    { 
      name: 'Graduated Cylinder', visual: '📊', color: 'from-teal-400 to-teal-600', use: 'The Master of Volume!', 
      studentDesc: 'This tall, skinny tube is your go-to tool when you need an incredibly accurate liquid measurement. Always remember to get down low and read from the very bottom of the liquid curve (the meniscus)!', unit: 'Milliliters (mL)' 
    },
    { 
      name: 'Test Tube & Rack', visual: '🧪✨', color: 'from-indigo-400 to-indigo-600', use: 'Small-scale playground!', 
      studentDesc: 'Sleek glass tubes used to hold, mix, or heat tiny amounts of chemicals. Since they have round bottoms and cannot stand up on their own, they live together inside a wooden or plastic rack.', unit: 'N/A' 
    },
    { 
      name: 'Thermometer', visual: '🌡️', color: 'from-red-400 to-red-600', use: 'The Heat Detector!', 
      studentDesc: 'A glass instrument filled with a safe fluid that moves up and down to reveal how energetic and hot the molecules in your experiment are.', unit: 'Degrees Celsius (°C)' 
    },
    { 
      name: 'Electronic Balance', visual: '⚖️', color: 'from-emerald-400 to-emerald-600', use: 'The Weight Champion!', 
      studentDesc: 'An ultra-sensitive digital scale. Place your container on it, press the "Tare" or "Zero" button to ignore the container\'s weight, and it will tell you exactly how heavy your matter is.', unit: 'Grams (g)' 
    },
    { 
      name: 'Metric Ruler', visual: '📏', color: 'from-orange-400 to-orange-600', use: 'The Distance Mapper!', 
      studentDesc: 'Your simple layout tool to measure length, width, or height. In science labs, we skip the inches entirely and use the metric system sides to map out spaces.', unit: 'Centimeters (cm) / Millimeters (mm)' 
    },
    { 
      name: 'Medicine Dropper / Pipette', visual: '💧', color: 'from-purple-400 to-purple-600', use: 'One drop at a time!', 
      studentDesc: 'A small squeeze tube used to transfer tiny bits of liquid safely. Perfect for adding a solution slowly until your reaction hits the exact color or state you want.', unit: 'Drops / Milliliters (mL)' 
    },
    { 
      name: 'Safety Goggles', visual: '🥽', color: 'from-amber-400 to-amber-600', use: 'The Eye Shield!', 
      studentDesc: 'The single most important piece of equipment in the room! Tough plastic shields that seal entirely around your eyes to protect you from unexpected fumes, shattering glass, or hot splashes.', unit: 'Safety First!' 
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      
      {/* 1. Introduction Section */}
      <motion.section id="intro" variants={itemVariants}>
        <Card className="overflow-hidden shadow-xl rounded-2xl border-l-8 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Science className="text-blue-600 text-3xl" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">🔬 Introduction: Why Does Science Need Steps?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Imagine baking a cake without measuring ingredients — or building a LEGO tower without instructions. 
                  <strong className="text-blue-600"> Science is exactly the same!</strong> Scientists follow careful steps, 
                  use safe tools, and measure accurately to discover amazing things.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">🤔 Think About This:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>Why do scientists wear goggles?</li>
                    <li>How do scientists know measurements are correct?</li>
                    <li>Why must experiments follow steps?</li>
                  </ul>
                </div>
              </div>
              
              {/* IMAGE PLACEHOLDER: Classroom Science Inquiry Intro */}
              <div className="flex flex-col space-y-2">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-300 min-h-[160px]">
                  <RocketLaunch className="text-4xl text-purple-600 mb-2" />
                  <p className="font-medium text-xs text-purple-800 dark:text-purple-300">🖼️ [IMAGE PLACEHOLDER: Kids conducting a simple classroom experiment]</p>
                  <span className="text-[10px] text-gray-500 italic mt-1">(Replace with an inspiring, real-world image of students discovering science)</span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 2. Laboratory Safety Rules */}
      <motion.section id="safety" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-200 dark:border-red-800">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <SafetyDivider /> 🥽 Laboratory Safety Rules
            </h2>
          </div>
          <CardContent className="p-6">
            
            {/* IMAGE PLACEHOLDER: Safety Equipment Layout */}
            <div className="mb-6 bg-red-50/50 dark:bg-red-900/10 border-2 border-dashed border-red-200 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-red-800 dark:text-red-300">🖼️ [IMAGE PLACEHOLDER: Lab safety gear layout - Goggles, Apron, Eye-wash station map]</p>
              <span className="text-[10px] text-gray-400 block italic">(Replace with a high-quality visual showing real safety goggles and gear)</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">👤 Personal Safety</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Wear goggles</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Tie long hair</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> No horseplay</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Wear closed-toe shoes</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🔧 Equipment Safety</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Handle glass carefully</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Read labels twice</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Turn off equipment after use</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🚨 Emergency Safety</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Know exit locations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Report accidents to teacher</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-green-500 text-sm" /> Wash spills immediately</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border-l-4 border-yellow-500">
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">💡 What Would You Do?</p>
              <p className="text-gray-700 dark:text-gray-300">You see a broken beaker on the floor. What should you do?</p>
              <Button variant="outlined" color="warning" size="small" className="mt-2">Tell the teacher immediately →</Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 3. Interactive Safety Challenge */}
      <motion.section id="challenge" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Report /> ⚠️ Interactive Safety Challenge</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Identify if each action is Safe or Unsafe:</p>
            <div className="space-y-3">
              {safetyQuiz.map((q, idx) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">{q.text}</span>
                  <div>
                    <RadioGroup row value={safetyQuizAnswers[q.id]?.toString()} onChange={(e) => setSafetyQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value === 'true' }))}>
                      <FormControlLabel value="true" control={<Radio size="small" />} label="✅ Safe" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="❌ Unsafe" />
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleSafetySubmit} className="mt-4">Check Answers</Button>
            {safetyQuizSubmitted && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p>You got {getSafetyScore()} out of {safetyQuiz.length} correct!</p>
                <LinearProgress variant="determinate" value={(getSafetyScore() / safetyQuiz.length) * 100} className="mt-2" />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>
      
      {/* 4. Enhanced Basic Laboratory Equipment Section */}
      <motion.section id="equipment" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl border-t-4 border-t-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Biotech className="text-indigo-600" /> 🧪 Meet Your Laboratory Equipment!</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
                Hover or Tap cards to discover measurement units!
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Before setting foot inside a laboratory, a young scientist must discover their toolbelt. Every instrument below serves a specific purpose designed to keep you safe and keep your data perfectly accurate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expandedEquipment.map((item, idx) => (
                <Tooltip title={`Standard Metric Unit: ${item.unit}`} key={idx} arrow placement="top">
                  <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                    
                    {/* Visual Card Header */}
                    <div className={`p-4 bg-gradient-to-r ${item.color} flex items-center justify-between text-white`}>
                      <span className="text-sm font-bold uppercase tracking-wide opacity-90">{item.use}</span>
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-200" role="img" aria-label={item.name}>
                        {item.visual}
                      </span>
                    </div>

                    {/* Detailed Explanation Text */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                          {item.studentDesc}
                        </p>
                      </div>

                      {/* Code Visual Placeholder for Real Item Photo */}
                      <div className="bg-gray-100 dark:bg-gray-700/40 py-2 px-3 rounded text-[10px] text-center font-medium border border-dashed border-gray-300 text-gray-500">
                        📸 [PHOTO PLACEHOLDER: Real-world image of a {item.name}]
                      </div>

                      {/* Explicit Unit Badge */}
                      <div className="pt-2 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-[11px]">
                        <span className="font-medium text-gray-400 dark:text-gray-500">Standard Unit:</span>
                        <Chip label={item.unit} size="small" variant="outlined" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" />
                      </div>
                    </div>

                  </div>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 5. Measurement Skills */}
      <motion.section id="measurement" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Calculate /> 📏 Measurement Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><Straighten className="text-green-600" /> <strong>Length:</strong> centimeters (cm), meters (m)</div>
                  <div className="flex items-center gap-2"><Scale className="text-green-600" /> <strong>Mass:</strong> grams (g), kilograms (kg)</div>
                  <div className="flex items-center gap-2"><WaterDrop className="text-green-600" /> <strong>Volume:</strong> milliliters (mL), liters (L)</div>
                  <div className="flex items-center gap-2"><Thermostat className="text-green-600" /> <strong>Temperature:</strong> degrees Celsius (°C)</div>
                </div>
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-semibold">⚠️ Common Mistakes:</p>
                  <ul className="list-disc list-inside text-sm">
                    <li>Reading a ruler from the number 1 instead of starting at zero</li>
                    <li>Standing above or below a cylinder (always read at flat eye level!)</li>
                    <li>Forgetting to write down units next to numbers</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-medium">🌡️ Read the Thermometer:</p>
                  <Slider value={temperatureValue} onChange={(e, val) => setTemperatureValue(val)} min={0} max={100} />
                  <p className="text-center text-2xl font-bold">{temperatureValue}°C</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-medium mb-1">📊 Meniscus Eyeline Guide:</p>
                  
                  {/* IMAGE PLACEHOLDER: Meniscus reading */}
                  <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-blue-200 text-[10px] text-center p-2 rounded mb-2 text-gray-500">
                    🖼️ [IMAGE PLACEHOLDER: Close-up diagram showing eye level matching the bottom curve of fluid (Meniscus)]
                  </div>

                  <p className="font-medium text-xs">🧪 Practice Graduated Cylinder Level:</p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="relative w-16 h-24 bg-white border-2 border-gray-400 rounded-b-lg overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-400 transition-all" style={{ height: `${cylinderLevel}%` }}></div>
                    </div>
                    <Slider value={cylinderLevel} onChange={(e, val) => setCylinderLevel(val)} min={0} max={100} className="w-32" />
                  </div>
                  <p className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">Water level: {cylinderLevel} mL</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {measurementQuiz.map((q) => (
                <div key={q.id} className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <p className="font-medium text-sm">{q.text}</p>
                  <RadioGroup row value={measurementAnswers[q.id]} onChange={(e) => setMeasurementAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}>
                    {q.options.map(opt => <FormControlLabel key={opt} value={opt} control={<Radio size="small" />} label={opt} className="text-xs" />)}
                  </RadioGroup>
                </div>
              ))}
              <Button variant="contained" color="primary" onClick={handleMeasurementSubmit}>Check Measurement Skills</Button>
              {measurementSubmitted && <p className="text-green-600 font-semibold mt-2">Score: {getMeasurementScore()}/{measurementQuiz.length}</p>}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 6. Steps in a Scientific Investigation */}
      <motion.section id="steps" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MenuBook /> 📋 Steps in a Scientific Investigation</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Ask a Question', desc: 'What do you want to find out or solve?' },
                { step: 2, title: 'Make a Hypothesis', desc: 'Make an educated guess that can be tested through action.' },
                { step: 3, title: 'Prepare Materials', desc: 'Gather all the specific gear and tools you will need.' },
                { step: 4, title: 'Follow a Fair Procedure', desc: 'Write down each configuration clearly so someone else could replicate your victory!' },
                { step: 5, title: 'Record Results', desc: 'Log clear measurements and text notes into structured charts.' },
                { step: 6, title: 'Draw a Conclusion', desc: 'What did the data reveal? Was your starting prediction true or false?' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 7. Hands-on Paper Airplane Experiment */}
      <motion.section id="airplane-experiment" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl border-2 border-blue-500 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center gap-2">
            <FlightTakeoff />
            <h2 className="text-xl font-bold">✈️ Hands-on Core Lab: The Paper Airplane Inquiry</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Let's deduce the scientific process using simple things! We will test how changing a wing design affects the distance a paper airplane can fly, then use a metric ruler or measuring tape to document the truth.
            </p>

            {/* Experiment Step 1 */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl space-y-2 border border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 1: Ask a Question & Create Hypothesis</span>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">"Does adding a heavy fold or blunt nose to my airplane wing cause it to travel a shorter or longer distance?"</p>
              <div className="text-xs text-gray-500 italic bg-white dark:bg-gray-900 p-2 rounded border border-dashed border-gray-300">
                ✍️ Student Exercise: Write down your smart guess before building! "I predict that folding the nose blunt will make it fly ________ because..."
              </div>
            </div>

            {/* Experiment Step 2 */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2: Materials & Construction</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">Gather 2 identical pieces of paper and a long metric ruler or tape measure.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 p-3 rounded border-2 border-dashed border-gray-200 text-center">
                  <DesignServices className="text-2xl text-gray-400 mb-1" />
                  <p className="text-[11px] font-medium text-gray-600">🖼️ [IMAGE PLACEHOLDER: Diagram of Folding Plain Airplane A]</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded border-2 border-dashed border-gray-200 text-center">
                  <DesignServices className="text-2xl text-gray-400 mb-1" />
                  <p className="text-[11px] font-medium text-gray-600">🖼️ [IMAGE PLACEHOLDER: Diagram of Folding Heavy Blunt Airplane B]</p>
                </div>
              </div>
            </div>

            {/* Experiment Step 3 */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 3: Fair Testing & Variables Breakdown</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">To make sure your investigation is a genuine, fair test, verify these parameters:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200">
                  <strong className="text-purple-700 block">⚡ Independent Variable:</strong>
                  The wing or nose design configuration change.
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200">
                  <strong className="text-green-700 block">📊 Dependent Variable:</strong>
                  The distance traveled in centimeters (cm) measured with your metric tool.
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200">
                  <strong className="text-orange-700 block">🔒 Controlled Variables:</strong>
                  Using the same paper type, identical throwing force, and launching from the exact same baseline floor tile.
                </div>
              </div>
            </div>

            {/* Experiment Step 4 */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4: Execute & Log Data Chart</span>
              
              {/* IMAGE PLACEHOLDER: Measuring distance */}
              <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 p-3 rounded text-center text-[10px] text-gray-400 italic">
                🖼️ [IMAGE PLACEHOLDER: Visual of a student using a metric tape measure flat on the floor to track an airplane endpoint]
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg text-xs">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 text-left">Plane Type Design</th>
                      <th className="p-2 text-center">Trial 1 Distance</th>
                      <th className="p-2 text-center">Trial 2 Distance</th>
                      <th className="p-2 text-center">Final Average Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">🛩️ Standard Plane A</td>
                      <td className="p-2 text-center text-gray-400">____ cm</td>
                      <td className="p-2 text-center text-gray-400">____ cm</td>
                      <td className="p-2 text-center text-gray-400 font-bold">____ cm</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">🚀 Blunt-Nose Plane B</td>
                      <td className="p-2 text-center text-gray-400">____ cm</td>
                      <td className="p-2 text-center text-gray-400">____ cm</td>
                      <td className="p-2 text-center text-gray-400 font-bold">____ cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 8. Variables Explanations Section */}
      <motion.section id="variables" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Rule /> 🔄 Scientific Variables Decoded</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl text-center">
                <h3 className="font-bold text-purple-700">Independent Variable</h3>
                <p className="text-sm">What YOU deliberately choose to change</p>
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">🌱 Amount of sunlight given to plants</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                <h3 className="font-bold text-green-700">Dependent Variable</h3>
                <p className="text-sm">What you MEASURE or watch closely</p>
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">📈 Total height growth in centimeters</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl text-center">
                <h3 className="font-bold text-orange-700">Controlled Variable</h3>
                <p className="text-sm">What must stay EXACTLY the same</p>
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">💧 Same water schedule & soil type</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 9. Observation vs Inference */}
      <motion.section id="obs-infer" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Visibility /> 👁️ Observation vs Inference</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="font-bold text-blue-700">Observation</p>
                <p className="italic text-xs">Using your eyes, nose, or equipment to see facts clearly: "The liquid is blue."</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="font-bold text-green-700">Inference</p>
                <p className="italic text-xs">Making a smart logical deduction on what might be true: "It may contain blue dye."</p>
              </div>
            </div>
            <div className="space-y-2">
              {obsInferQuiz.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/30 rounded">
                  <span className="text-xs font-medium">{q.text}</span>
                  <RadioGroup row value={obsInferAnswers[q.id]} onChange={(e) => setObsInferAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}>
                    <FormControlLabel value="observation" control={<Radio size="small" />} label="👁️ Observation" className="text-xs" />
                    <FormControlLabel value="inference" control={<Radio size="small" />} label="🧠 Inference" className="text-xs" />
                  </RadioGroup>
                </div>
              ))}
              <Button variant="contained" color="primary" onClick={handleObsInferSubmit} className="mt-2">Check Answers</Button>
              {obsInferSubmitted && <p className="text-green-600 font-semibold mt-2">Score: {getObsInferScore()}/{obsInferQuiz.length}</p>}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 10. Data Recording Reference Table */}
      <motion.section id="data" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><TableChart /> 📊 Example Data Recording Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr><th className="p-2 text-left">Time Elapsed (minutes)</th><th className="p-2 text-center">Temperature readings (°C)</th><th className="p-2 text-left">Physical Observations</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">0 mins (Start)</td><td className="p-2 text-center">25 °C</td><td className="p-2">The ice cube is rigid and fully solid</td></tr>
                  <tr className="border-b"><td className="p-2">5 mins</td><td className="p-2 text-center">28 °C</td><td className="p-2">Edges starting to clear and liquid forms</td></tr>
                  <tr><td className="p-2">10 mins</td><td className="p-2 text-center">30 °C</td><td className="p-2">Half of the ice block has turned into liquid water</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 11. Real-Life Applications */}
      <motion.section id="applications" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Lightbulb /> 🌍 Science in the Real World</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-red-50/40 rounded-xl"><LocalHospital className="text-3xl text-red-500 mb-1" /><p className="text-xs font-semibold">Doctors checking body temperature values</p></div>
              <div className="p-3 bg-gray-50/40 rounded-xl"><Engineering className="text-3xl text-gray-600 mb-1" /><p className="text-xs font-semibold">Engineers testing bridge stress tolerances</p></div>
              <div className="p-3 bg-orange-50/40 rounded-xl"><Kitchen className="text-3xl text-orange-500 mb-1" /><p className="text-xs font-semibold">Bakers using electronic mass balances</p></div>
              <div className="p-3 bg-yellow-50/40 rounded-xl"><WbSunny className="text-3xl text-yellow-500 mb-1" /><p className="text-xs font-semibold">Meteorologists parsing rain measurements</p></div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 12. Science Skills Checklist */}
      <motion.section id="checklist" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Checklist /> ✅ Science Skills Checklist</h2>
            <div className="space-y-2">
              {[
                { id: 'ruler', label: 'I know how to line up a metric ruler starting at zero' },
                { id: 'labTools', label: 'I can identify the difference between a beaker and a graduated cylinder' },
                { id: 'safetyRules', label: 'I understand why safety goggles are required equipment' },
                { id: 'recordObs', label: 'I can keep structured records of observations without guessing data' }
              ].map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox checked={checklistItems[item.id]} onChange={() => handleChecklistChange(item.id)} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
            <LinearProgress variant="determinate" value={Object.values(checklistItems).filter(Boolean).length * 25} className="mt-4" />
          </CardContent>
        </Card>
      </motion.section>

      {/* 13. Common Mistakes Section */}
      <motion.section id="mistakes" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><WarningIcon /> ⚠️ Common Student Mistakes</h2>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300 rounded"><ThumbDown className="text-red-500 text-sm" /> Guessing numbers blindly → <ThumbUp className="text-green-500 text-sm ml-auto" /> Use precise instruments!</div>
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300 rounded"><ThumbDown className="text-red-500 text-sm" /> Forgetting metric units → <ThumbUp className="text-green-500 text-sm ml-auto" /> Always write down cm, mL, or g!</div>
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300 rounded"><ThumbDown className="text-red-500 text-sm" /> Skipping folding rules → <ThumbUp className="text-green-500 text-sm ml-auto" /> Follow standard steps exactly!</div>
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300 rounded"><ThumbDown className="text-red-500 text-sm" /> Taking off eye goggles → <ThumbUp className="text-green-500 text-sm ml-auto" /> Shield eyes until clean-up finishes!</div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 14. Core Scientific Skills Synthesis (Interactive Quiz at the Very Bottom) */}
      <motion.section id="reflection" variants={itemVariants}>
        <Card className="shadow-xl rounded-2xl border-2 border-indigo-400 bg-indigo-50/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-800 dark:text-indigo-400">
              <QuestionAnswer /> 🧠 Scientific Skills Synthesis Review
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
              Test your understanding of the core inquiry methods we used during our lab designs, measurements, and safe practices!
            </p>
            
            <div className="space-y-4">
              {synthesisQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">{q.text}</p>
                  <RadioGroup 
                    value={synthesisAnswers[q.id] || ''} 
                    onChange={(e) => setSynthesisAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  >
                    {q.options.map(opt => (
                      <FormControlLabel 
                        key={opt} 
                        value={opt} 
                        control={<Radio size="small" />} 
                        label={<span className="text-xs text-gray-700 dark:text-gray-300">{opt}</span>} 
                      />
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleSynthesisSubmit} 
              className="mt-6 font-bold"
              sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
            >
              Submit Synthesis Answers
            </Button>

            {synthesisSubmitted && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-green-100 dark:bg-green-900/40 rounded-xl">
                <p className="text-sm font-bold text-green-800 dark:text-green-300">
                  🎉 Quiz Evaluated! You got {getSynthesisScore()} out of {synthesisQuestions.length} correct.
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Keep applying these fundamental processing methods to every mystery you choose to tackle in nature!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>

    </motion.div>
  );
};

export default MainContent;