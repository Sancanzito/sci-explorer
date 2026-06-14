import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Falling Leaf Component for Background ---
const FallingLeaf = ({ startX, delay, duration, size, color }) => {
  return (
    <motion.div
      initial={{ y: '-10vh', x: `${startX}vw`, opacity: 0 }}
      animate={{
        y: '110vh',
        x: [`${startX}vw`, `${startX + 5}vw`, `${startX - 5}vw`, `${startX}vw`],
        rotate: [0, 150, -150, 360],
        opacity: [0, 0.4, 0.4, 0]
      }}
      transition={{
        y: { duration: duration, repeat: Infinity, ease: "linear", delay: delay },
        x: { duration: duration / 2, repeat: Infinity, ease: "easeInOut", delay: delay },
        rotate: { duration: duration, repeat: Infinity, ease: "linear", delay: delay },
        opacity: { duration: duration, repeat: Infinity, ease: "linear", delay: delay }
      }}
      className="absolute pointer-events-none z-0"
      style={{ width: size, height: size, color: color }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5,3c-2.8-0.1-5.6,1-7.6,3c-1.9-2-4.7-3.1-7.6-3C1.6,4.5,0.7,6.8,1.2,9.3c0.7,3.6,3.6,6.5,7.2,7.2c0.5,0.1,1.1,0.1,1.6,0.1c0.4,0,0.8,0,1.2-0.1l0.6,3.7c0.1,0.6,0.7,1,1.3,0.9c0.6-0.1,1-0.7,0.9-1.3l-0.5-3.3c2.8-0.7,5.3-2.6,6.5-5.3C20.6,7.5,19.8,4.5,17.5,3z"/>
      </svg>
    </motion.div>
  );
};

export function WhyLeavesChangeColor() {
  // --- Animation Variants ---
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const listContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const listItem = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  // Memoize background leaves so they don't re-render and reset animation on state changes (if any were added later)
  const leaves = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15,
      size: Math.random() * 20 + 20, // 20px to 40px
      color: Math.random() > 0.5 ? '#9A3412' : '#F59E0B' // Primary (Rust) or Accent (Gold)
    }));
  }, []);

  return (
    // Base Background: Warm Cream (orange-50), Text: Dark Gray
    <div className="min-h-screen bg-orange-50 font-sans text-gray-900 relative selection:bg-amber-300 selection:text-orange-900 overflow-hidden">
      
      {/* Animated Falling Leaves Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {leaves.map((leaf) => (
          <FallingLeaf key={leaf.id} {...leaf} />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        <motion.article 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white border-4 border-orange-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_#F59E0B]"
        >
          {/* Title Area */}
          <header className="mb-12 text-center border-b-4 border-orange-900 pb-8">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-900 mb-4 tracking-tight"
            >
              Why Do Leaves Change Colors in Autumn?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-amber-600 font-bold uppercase tracking-widest bg-orange-50 inline-block px-4 py-1 border-2 border-amber-400"
            >
              Understanding Seasons, Plants, and Nature's Colorful Transformation
            </motion.p>
          </header>

          {/* Learning Objectives */}
          <motion.section 
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 bg-orange-50 border-4 border-orange-900 p-6 sm:p-8"
          >
            <h2 className="text-xl font-black text-orange-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="bg-amber-500 text-orange-900 px-2 py-1 text-sm border-2 border-orange-900 shadow-[2px_2px_0px_0px_#9A3412]">Target</span>
              Learning Objectives
            </h2>
            <p className="font-bold text-gray-900 mb-3">By the end of this lesson, you should be able to:</p>
            <motion.ul 
              variants={listContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="list-none space-y-3 text-gray-800 font-serif text-lg"
            >
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-500 font-black mt-1 text-xl">→</span> Describe the different types of seasons found around the world.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-500 font-black mt-1 text-xl">→</span> Explain what happens during autumn.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-500 font-black mt-1 text-xl">→</span> Identify why leaves change color.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-500 font-black mt-1 text-xl">→</span> Understand the role of chlorophyll in plants.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-500 font-black mt-1 text-xl">→</span> Recognize the difference between deciduous and evergreen trees.
              </motion.li>
            </motion.ul>
          </motion.section>

          {/* Body Content */}
          <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-[1.8]">
            
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-10 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Introduction</h2>
              <p>Have you ever seen pictures of forests filled with bright red, orange, and yellow leaves?</p>
              <p>In many parts of the world, trees transform into beautiful colors during autumn. The green leaves that covered trees during summer suddenly change into shades of gold, red, orange, and brown before eventually falling to the ground.</p>
              <p>But why does this happen? The answer lies in sunlight, seasons, and a special green pigment called chlorophyll. Before we learn why leaves change color, we first need to understand the different types of seasons experienced around the world.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Types of Seasons Around the World</h2>
              <p>Different places on Earth experience different seasonal patterns depending on their location.</p>
              
              <h3 className="text-2xl font-bold font-sans text-orange-900 mt-8 mb-4">1. Tropical Wet and Dry Seasons</h3>
              <p>Countries near the equator, including the Philippines, usually experience two main seasons:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 font-sans">
                <div className="bg-white border-4 border-orange-900 p-6 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-2">🌧️ Wet Season</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-700 font-bold marker:text-amber-500">
                    <li>Frequent rainfall and higher humidity</li>
                    <li>Thunderstorms and typhoons in some areas</li>
                    <li>Rapid plant growth</li>
                  </ul>
                  <p className="text-xs text-amber-700 mt-3 font-black uppercase bg-orange-50 inline-block px-2 py-1">In the Philippines: June to November.</p>
                </div>
                <div className="bg-white border-4 border-orange-900 p-6 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-2">☀️ Dry Season</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-700 font-bold marker:text-amber-500">
                    <li>Less rainfall and more sunny days</li>
                    <li>Lower humidity in some regions</li>
                    <li>Better conditions for outdoor activities</li>
                  </ul>
                  <p className="text-xs text-amber-700 mt-3 font-black uppercase bg-orange-50 inline-block px-2 py-1">In the Philippines: December to May.</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold font-sans text-orange-900 mt-10 mb-4">2. The Four Seasons</h3>
              <p>Many countries farther from the equator experience four distinct seasons.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-sans">
                <div className="border-l-4 border-amber-500 bg-orange-50 pl-4 py-3 pr-2">
                  <h4 className="text-lg font-black text-orange-900">🌱 Spring</h4>
                  <p className="text-sm text-gray-700">Temperatures warm up, flowers bloom, trees grow new leaves, and animals become more active.</p>
                </div>
                <div className="border-l-4 border-amber-500 bg-orange-50 pl-4 py-3 pr-2">
                  <h4 className="text-lg font-black text-orange-900">☀️ Summer</h4>
                  <p className="text-sm text-gray-700">The warmest season. Days are longer, plants receive plenty of sunlight, and trees produce food.</p>
                </div>
                <div className="border-l-4 border-orange-900 bg-amber-100 pl-4 py-3 pr-2 shadow-[4px_4px_0px_0px_#9A3412]">
                  <h4 className="text-lg font-black text-orange-900">🍂 Autumn (Fall)</h4>
                  <p className="text-sm text-orange-900 font-bold">Temperatures cool, days shorten, and trees prepare for winter. Leaves change color and fall.</p>
                </div>
                <div className="border-l-4 border-amber-500 bg-orange-50 pl-4 py-3 pr-2">
                  <h4 className="text-lg font-black text-orange-900">❄️ Winter</h4>
                  <p className="text-sm text-gray-700">The coldest season. Temperatures can fall below freezing, snow may cover the ground, and trees go dormant.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Where Does Autumn Occur?</h2>
              <p>Autumn is commonly experienced in places that have four seasons, including:</p>
              <div className="flex flex-wrap gap-2 my-4 font-sans font-bold text-sm">
                {['Canada', 'United States', 'Japan', 'South Korea', 'China', 'Germany', 'France', 'United Kingdom', 'Russia'].map(country => (
                  <span key={country} className="bg-orange-50 text-orange-900 px-3 py-1 border-2 border-orange-900 shadow-[2px_2px_0px_0px_#F59E0B]">🍁 {country}</span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Why Are Leaves Green?</h2>
              <p>Most leaves appear green because they contain a pigment called <strong className="bg-amber-200 px-1">chlorophyll</strong>. Chlorophyll helps plants absorb sunlight and produce food through a process called <strong className="bg-amber-200 px-1">photosynthesis</strong>.</p>
              <p>Photosynthesis allows plants to convert sunlight, water, and carbon dioxide into food and energy. The green color of chlorophyll is so strong that it hides other colors naturally present inside leaves.</p>
            </motion.div>

            {/* Editorial Image 1: Autumn Canopy */}
            <motion.figure 
              variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="my-14 w-full"
            >
              <div className="border-4 border-orange-900 p-2 bg-white shadow-[6px_6px_0px_0px_#F59E0B]">
                <img 
                  src="https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1000&q=80" 
                  alt="A beautiful path through a forest of trees with bright red and orange autumn leaves" 
                  className="w-full h-auto object-cover aspect-[21/9] border-2 border-orange-900"
                />
              </div>
              <figcaption className="mt-4 text-center font-sans text-sm font-bold text-orange-800 uppercase tracking-widest px-4">
                Figure 1: The vibrant transformation of a forest during the autumn season.
              </figcaption>
            </motion.figure>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">What Happens During Autumn?</h2>
              <p>As autumn approaches, days become shorter and temperatures become cooler. Trees detect these environmental changes and begin preparing for winter.</p>
              <p>Since there is less sunlight available, trees stop producing large amounts of chlorophyll. The existing chlorophyll slowly breaks down and disappears. As the green pigment fades, other colors hidden inside the leaf become visible. This is why leaves change color.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">The Hidden Colors Inside Leaves</h2>
              <p>Even when leaves appear green, they already contain other pigments. When chlorophyll disappears, these pigments become visible.</p>
              
              <motion.div 
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 font-sans"
              >
                {/* Notice how the UI structurally strictly follows Rust/Gold, while allowing descriptive colors only inside content */}
                <motion.div variants={listItem} className="bg-white border-4 border-orange-900 p-4 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-1 flex items-center gap-2"><span className="text-2xl text-[#EAB308]">🟡</span> Yellow</h4>
                  <p className="text-sm text-gray-700">From <strong>xanthophylls</strong>. Helps protect leaves from too much sunlight. <br/><span className="text-xs text-orange-800 uppercase font-black mt-2 inline-block bg-orange-50 px-2 py-1">Examples: Corn, Birch, Aspen</span></p>
                </motion.div>
                
                <motion.div variants={listItem} className="bg-white border-4 border-orange-900 p-4 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-1 flex items-center gap-2"><span className="text-2xl text-[#F97316]">🟠</span> Orange</h4>
                  <p className="text-sm text-gray-700">From <strong>carotenoids</strong>. The same pigments that make carrots orange! <br/><span className="text-xs text-orange-800 uppercase font-black mt-2 inline-block bg-orange-50 px-2 py-1">Examples: Maple, Poplar</span></p>
                </motion.div>
                
                <motion.div variants={listItem} className="bg-white border-4 border-orange-900 p-4 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-1 flex items-center gap-2"><span className="text-2xl text-[#EF4444]">🔴</span> Red</h4>
                  <p className="text-sm text-gray-700">From <strong>anthocyanins</strong>. Produced during autumn to protect leaves while recovering nutrients. <br/><span className="text-xs text-orange-800 uppercase font-black mt-2 inline-block bg-orange-50 px-2 py-1">Examples: Red Maple, Dogwood</span></p>
                </motion.div>
                
                <motion.div variants={listItem} className="bg-white border-4 border-orange-900 p-4 shadow-[4px_4px_0px_0px_#F59E0B]">
                  <h4 className="text-xl font-black text-orange-900 mb-1 flex items-center gap-2"><span className="text-2xl text-[#78716C]">🟤</span> Brown</h4>
                  <p className="text-sm text-gray-700">Appears when all pigments break down and the leaf eventually dies before falling.</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-12 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Why Do Trees Drop Their Leaves?</h2>
              <p>Keeping leaves during winter requires water and energy. In cold regions, water may freeze, sunlight becomes limited, and photosynthesis becomes difficult.</p>
              <p>To conserve energy, many trees shed their leaves and enter a resting state called <strong className="bg-amber-200 px-1">dormancy</strong>. This helps trees survive harsh winter conditions.</p>
            </motion.div>

            {/* Editorial Box Layouts for Deciduous vs Evergreen (Side-by-side Image & Text) */}
            <div className="flex flex-col gap-10 my-16 font-sans">
              <h2 className="text-3xl font-black font-sans text-orange-900 mb-2 uppercase border-b-4 border-amber-400 inline-block pb-1">Deciduous vs. Evergreen Trees</h2>
              <p className="font-serif text-lg text-gray-800">Not all trees behave the same way. Scientists classify many trees into two major groups.</p>
              
              {/* Deciduous Trees */}
              <motion.div 
                variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border-4 border-orange-900 bg-white flex flex-col sm:flex-row overflow-hidden shadow-[8px_8px_0px_0px_#F59E0B]"
              >
                <div className="sm:w-2/5 border-b-4 sm:border-b-0 sm:border-r-4 border-orange-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=800&q=80" 
                    alt="A bright deciduous tree in autumn losing its leaves" 
                    className="w-full h-48 sm:h-full object-cover grayscale-[20%] sepia-[30%]"
                  />
                  <div className="absolute top-0 left-0 bg-amber-500 text-orange-900 text-xs font-black uppercase px-3 py-1 border-r-4 border-b-4 border-orange-900">
                    Group 1
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-orange-900 mb-3 flex items-center gap-2 uppercase">
                    🍂 Deciduous Trees
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    Deciduous trees lose their leaves every year. These trees create the colorful autumn landscapes people love to photograph.
                  </p>
                  <p className="text-sm font-black text-orange-900 bg-orange-50 inline-block px-2 py-1 self-start border-2 border-orange-200">Examples: Maple, Oak, Birch, Aspen</p>
                </div>
              </motion.div>

              {/* Evergreen Trees */}
              <motion.div 
                variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border-4 border-orange-900 bg-white flex flex-col sm:flex-row-reverse overflow-hidden shadow-[8px_8px_0px_0px_#F59E0B]"
              >
                <div className="sm:w-2/5 border-b-4 sm:border-b-0 sm:border-l-4 border-orange-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?auto=format&fit=crop&w=800&q=80" 
                    alt="Lush green pine trees in a forest" 
                    className="w-full h-48 sm:h-full object-cover grayscale-[20%] sepia-[30%]"
                  />
                  <div className="absolute top-0 right-0 bg-amber-500 text-orange-900 text-xs font-black uppercase px-3 py-1 border-l-4 border-b-4 border-orange-900">
                    Group 2
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-orange-900 mb-3 flex items-center gap-2 uppercase">
                    🌲 Evergreen Trees
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    Evergreen trees remain green throughout the year. Instead of dropping all their leaves at once, they replace old leaves gradually. This is why many evergreen forests stay green during all seasons.
                  </p>
                  <p className="text-sm font-black text-orange-900 bg-orange-50 inline-block px-2 py-1 self-start border-2 border-orange-200">Examples: Pine, Fir, Spruce, Cedar</p>
                </div>
              </motion.div>

            </div>

            {/* Fun Facts Section */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-orange-900 mt-16 mb-6 uppercase border-b-4 border-amber-400 inline-block pb-1">Fun Facts About Autumn Leaves</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm">
                {[
                  "The term 'fall' is commonly used in North America, while many other countries use the word 'autumn.'",
                  "Some maple trees can display several colors at the same time, including yellow, orange, and red.",
                  "Japan has a tradition called 'Momijigari,' which means 'autumn leaf viewing.' People travel to parks and mountains to admire colorful leaves.",
                  "The brightest autumn colors often occur when days are sunny, nights are cool, and temperatures stay above freezing.",
                  "A single large tree can contain hundreds of thousands of leaves. Imagine all of them changing color at the same time!",
                  "The orange pigment in carrots and pumpkins is the same type of pigment that helps create orange autumn leaves.",
                  "Evergreen trees still lose leaves. They simply replace them slowly throughout the year instead of all at once."
                ].map((fact, i) => (
                  <div key={i} className="flex gap-3 bg-white border-2 border-orange-200 p-4 items-start shadow-sm hover:border-amber-400 transition-colors">
                    <span className="text-xl text-amber-500">🍁</span>
                    <p className="text-gray-800 leading-relaxed font-medium">{fact}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Review & Key Terms */}
            <hr className="my-16 border-orange-900 border-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 font-sans bg-orange-50 border-4 border-orange-900 p-8 shadow-[8px_8px_0px_0px_#F59E0B]">
              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-orange-900 mb-6 uppercase tracking-wider bg-amber-400 inline-block px-2 py-1 border-2 border-orange-900">Quick Review</h2>
                <ul className="list-none space-y-3 text-orange-900 font-bold text-sm">
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What are the two main seasons experienced in tropical countries like the Philippines?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What are the four seasons experienced in temperate regions?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What pigment makes leaves green?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> Why do leaves change color during autumn?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What is photosynthesis?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What are deciduous trees?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What are evergreen trees?</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-orange-900 mb-6 uppercase tracking-wider bg-amber-400 inline-block px-2 py-1 border-2 border-orange-900">Key Terms</h2>
                <dl className="space-y-4 text-gray-800">
                  {[
                    { term: "Chlorophyll", def: "A green pigment that helps plants absorb sunlight." },
                    { term: "Photosynthesis", def: "The process by which plants use sunlight to make food." },
                    { term: "Pigment", def: "A substance that gives color to living things and objects." },
                    { term: "Deciduous", def: "A type of tree that loses its leaves each year." },
                    { term: "Evergreen", def: "A type of tree that stays green throughout the year." },
                    { term: "Dormancy", def: "A resting period when plant growth slows down." },
                    { term: "Autumn", def: "The season between summer and winter when many leaves change color and fall." }
                  ].map((item, i) => (
                    <div key={i} className="border-l-4 border-amber-500 pl-4">
                      <dt className="font-black text-orange-900 uppercase text-sm">{item.term}</dt>
                      <dd className="text-xs mt-1 font-serif text-gray-700">{item.def}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>

            {/* Summary Block */}
            <motion.div 
              variants={fadeUpVariant} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className="bg-orange-900 text-white p-8 sm:p-10 mt-12 shadow-[8px_8px_0px_0px_#F59E0B] font-sans border-4 border-orange-900"
            >
              <h2 className="text-3xl font-black text-amber-400 mb-4 uppercase tracking-widest border-b-4 border-amber-500 pb-2 inline-block">Remember</h2>
              <p className="text-lg sm:text-xl leading-relaxed font-serif mt-4 text-orange-50">
                Leaves change color in autumn because trees stop producing chlorophyll as days become shorter and temperatures become cooler. As the green chlorophyll disappears, hidden yellow, orange, and red pigments become visible. Eventually, many trees shed their leaves to conserve energy and survive the coming winter. While deciduous trees lose their leaves each year, evergreen trees remain green throughout the seasons.
              </p>
            </motion.div>

            {/* References */}
            <div className="mt-16 text-xs text-orange-800/80 font-sans border-t-2 border-orange-200 pt-6">
              <h3 className="font-black uppercase mb-3 text-orange-900">References & Further Reading</h3>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                <li>National Geographic Society. "Why Do Leaves Change Color?"</li>
                <li>NASA Earth Observatory. "Seasonal Changes and Vegetation."</li>
                <li>United States Forest Service (USDA). "Why Leaves Change Color."</li>
                <li>Smithsonian Institution. "The Science Behind Autumn Colors."</li>
                <li>Arbor Day Foundation. "Autumn Leaf Color Guide."</li>
                <li>Royal Horticultural Society. "Trees, Seasons, and Autumn Colours."</li>
                <li>Britannica. "Chlorophyll, Photosynthesis, and Autumn Foliage."</li>
                <li>Campbell Biology. Pearson Education. "Plant Structure, Pigments, and Photosynthesis."</li>
                <li>Missouri Botanical Garden. "Why Trees Lose Their Leaves."</li>
                <li>National Park Service Autumn Science Resources. "Autumn Colors and Deciduous Trees."</li>
              </ul>
            </div>

          </div>
        </motion.article>
      </div>
    </div>
  );
}