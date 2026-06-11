import React from 'react';
import { motion } from 'framer-motion';

export function WhySkyIsBlue() {
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

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-gray-900 relative selection:bg-amber-200 overflow-hidden">
      
      {/* Contextual Background: Solid Sky, Sun, and Clouds */}
      <div className="absolute top-0 left-0 w-full h-72 z-0 flex flex-col pointer-events-none">
        {/* Daytime Blue Layer */}
        <div className="h-1/2 w-full bg-[#87CEEB] relative overflow-hidden">
          <motion.div 
            animate={{ x: [0, 20, 0] }} 
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-6 left-10 w-24 h-8 bg-white rounded-full opacity-90" 
          />
          <motion.div 
            animate={{ x: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
            className="absolute top-12 left-32 w-16 h-6 bg-white rounded-full opacity-90" 
          />
          <motion.div 
            animate={{ x: [0, 30, 0] }} 
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
            className="absolute top-8 right-16 w-32 h-10 bg-white rounded-full opacity-90" 
          />
        </div>
        {/* Sunset Orange Layer */}
        <div className="h-1/2 w-full bg-[#FFB347] relative border-b-4 border-amber-600">
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: [20, -5, 20] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#FFD700] rounded-full border-4 border-white shadow-none" 
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        
        <motion.article 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white border-4 border-amber-600 p-8 sm:p-12 shadow-[8px_8px_0px_0px_#D97706]"
        >
          {/* Title Area */}
          <header className="mb-12 text-center border-b-4 border-gray-900 pb-8">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight"
            >
              Why Is the Sky Blue?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-amber-700 font-bold uppercase tracking-widest"
            >
              Understanding Light & The Atmosphere
            </motion.p>
          </header>

          {/* Learning Objectives */}
          <motion.section 
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 bg-amber-50 border-4 border-amber-600 p-6 sm:p-8"
          >
            <h2 className="text-xl font-black text-amber-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="bg-amber-600 text-white px-2 py-1 text-sm">Target</span>
              Learning Objective
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
                <span className="text-amber-600 font-black mt-1">→</span> Explain why the sky appears blue.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-600 font-black mt-1">→</span> Describe how different wavelengths of light behave in the atmosphere.
              </motion.li>
              <motion.li variants={listItem} className="flex gap-3 items-start">
                <span className="text-amber-600 font-black mt-1">→</span> Explain why sunsets appear red or orange.
              </motion.li>
            </motion.ul>
          </motion.section>

          {/* Body Content */}
          <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-[1.8]">
            
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-10 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Introduction</h2>
              <p>Look up at the sky on a clear day. What color do you see?</p>
              <p>Most people answer blue.</p>
              <p>Have you ever wondered why the sky is blue and not red, green, or purple? The answer comes from sunlight, air molecules, and the different wavelengths of light.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Understanding Light</h2>
              <p>The Sun produces white light. White light is a mixture of many colors. These colors are:</p>
              
              <motion.ul 
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 list-none p-0 my-8 font-sans font-black text-sm uppercase tracking-wider"
              >
                <motion.li variants={listItem} className="bg-red-100 text-red-900 px-3 py-3 text-center border-2 border-red-300">Red</motion.li>
                <motion.li variants={listItem} className="bg-orange-100 text-orange-900 px-3 py-3 text-center border-2 border-orange-300">Orange</motion.li>
                <motion.li variants={listItem} className="bg-yellow-100 text-yellow-900 px-3 py-3 text-center border-2 border-yellow-300">Yellow</motion.li>
                <motion.li variants={listItem} className="bg-green-100 text-green-900 px-3 py-3 text-center border-2 border-green-300">Green</motion.li>
                <motion.li variants={listItem} className="bg-blue-100 text-blue-900 px-3 py-3 text-center border-2 border-blue-300">Blue</motion.li>
                <motion.li variants={listItem} className="bg-indigo-100 text-indigo-900 px-3 py-3 text-center border-2 border-indigo-300">Indigo</motion.li>
                <motion.li variants={listItem} className="bg-purple-100 text-purple-900 px-3 py-3 text-center border-2 border-purple-300">Violet</motion.li>
              </motion.ul>

              <p>Each color has a different wavelength. A wavelength is the distance between two wave peaks. Long wavelengths produce colors such as red and orange. Short wavelengths produce colors such as blue and violet.</p>
            </motion.div>

            {/* Editorial Image 1: Prism */}
            <motion.figure 
              variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="my-14 w-full"
            >
              <div className="border-4 border-gray-900 p-2 bg-white shadow-[6px_6px_0px_0px_#D97706]">
                <img 
                  src="https://images.unsplash.com/photo-1542646698-bd03b98c3664?auto=format&fit=crop&w=1000&q=80" 
                  alt="A crystal prism splitting white light into a rainbow spectrum" 
                  className="w-full h-auto object-cover aspect-[21/9] border-2 border-gray-900"
                />
              </div>
              <figcaption className="mt-4 text-center font-sans text-sm font-bold text-gray-600 uppercase tracking-widest px-4">
                Figure 1: A prism splitting white light into the visible spectrum.
              </figcaption>
            </motion.figure>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Color and Wavelength</h2>
              <motion.ul 
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="list-none ml-0 space-y-3 mb-8 border-l-4 border-gray-300 pl-6"
              >
                <motion.li variants={listItem}><strong>Red light</strong> has the longest wavelength.</motion.li>
                <motion.li variants={listItem}><strong>Orange light</strong> has a shorter wavelength than red.</motion.li>
                <motion.li variants={listItem}><strong>Yellow light</strong> has a shorter wavelength than orange.</motion.li>
                <motion.li variants={listItem}><strong>Blue light</strong> has a much shorter wavelength.</motion.li>
                <motion.li variants={listItem}><strong>Violet light</strong> has the shortest wavelength.</motion.li>
              </motion.ul>
              <p>Scientists measure wavelengths in nanometers. Visible light ranges from about 380 nanometers to 700 nanometers. Violet light is about 380 nm, blue light is about 450 nm, and red light is about 700 nm.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">What Happens When Sunlight Reaches Earth?</h2>
              <p>Earth is surrounded by an atmosphere. The atmosphere contains tiny gas molecules. Most of these molecules are nitrogen and oxygen.</p>
              <p>When sunlight enters the atmosphere, the light collides with these tiny particles. The particles scatter the light in different directions. This process is called <strong>Rayleigh scattering</strong>.</p>
            </motion.div>

            {/* Editorial Image 2: Atmosphere/Scattering */}
            <motion.figure 
              variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="my-14 w-full"
            >
              <div className="border-4 border-gray-900 p-2 bg-white shadow-[6px_6px_0px_0px_#D97706]">
                <img 
                  src="https://images.unsplash.com/photo-1534088568595-a066f410cbda?auto=format&fit=crop&w=1000&q=80" 
                  alt="Clear blue sky illustrating Rayleigh scattering" 
                  className="w-full h-auto object-cover aspect-[16/9] border-2 border-gray-900"
                />
              </div>
              <figcaption className="mt-4 text-center font-sans text-sm font-bold text-gray-600 uppercase tracking-widest px-4">
                Figure 2: The vast blue sky is the direct result of Rayleigh scattering in our atmosphere.
              </figcaption>
            </motion.figure>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Why Does Blue Light Scatter More?</h2>
              <p>Blue light has a shorter wavelength than red light. Short wavelengths interact more strongly with tiny air molecules. As a result, blue light scatters in many directions across the sky.</p>
              <p>Red light scatters much less and continues traveling in a straighter path. When you look up during the day, you see blue light arriving from all parts of the sky. This is why the sky appears blue.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Why Is the Sky Not Violet?</h2>
              <p>This is a common question. Violet light scatters even more than blue light. If violet scatters more, why does the sky not appear violet?</p>
              <p>There are three main reasons:</p>
              <motion.ol 
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="list-decimal list-outside ml-6 space-y-2 mb-6 font-bold text-gray-900"
              >
                <motion.li variants={listItem}><span className="font-normal text-gray-800">The Sun produces more blue light than violet light.</span></motion.li>
                <motion.li variants={listItem}><span className="font-normal text-gray-800">Part of the violet light is absorbed in the atmosphere.</span></motion.li>
                <motion.li variants={listItem}><span className="font-normal text-gray-800">Human eyes are more sensitive to blue light than violet light.</span></motion.li>
              </motion.ol>
            </motion.div>

            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-black font-sans text-gray-900 mt-12 mb-6 uppercase border-b-2 border-gray-200 inline-block pb-1">Why Does the Sky Turn Red During Sunset?</h2>
              <p>During sunrise and sunset, sunlight travels through a thicker layer of atmosphere before reaching your eyes. Along the way, most of the blue and violet light scatters away.</p>
              <p>The remaining light contains more red, orange, and yellow wavelengths. This causes the beautiful colors seen during sunrise and sunset.</p>
            </motion.div>

            {/* Editorial Box Layouts for Facts (Side-by-side Image & Text) */}
            <div className="flex flex-col gap-10 my-16 font-sans">
              
              {/* Interesting Fact - Clouds */}
              <motion.div 
                variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border-4 border-gray-900 bg-white flex flex-col sm:flex-row overflow-hidden shadow-[8px_8px_0px_0px_#111827]"
              >
                <div className="sm:w-2/5 border-b-4 sm:border-b-0 sm:border-r-4 border-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1611928482473-7b27d24eab80?auto=format&fit=crop&w=800&q=80" 
                    alt="Fluffy white clouds in a blue sky" 
                    className="w-full h-48 sm:h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-amber-500 text-gray-900 text-xs font-black uppercase px-3 py-1 border-r-4 border-b-4 border-gray-900">
                    Observation
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 bg-gray-50 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2 uppercase">
                    ☁️ Cloud Colors
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Clouds look white for a different reason. Cloud droplets are much larger than air molecules. These droplets scatter almost all colors of light equally. When all colors mix together, clouds appear white.
                  </p>
                </div>
              </motion.div>

              {/* Fun Fact - Astronauts */}
              <motion.div 
                variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border-4 border-gray-900 bg-white flex flex-col sm:flex-row-reverse overflow-hidden shadow-[8px_8px_0px_0px_#111827]"
              >
                <div className="sm:w-2/5 border-b-4 sm:border-b-0 sm:border-l-4 border-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80" 
                    alt="Astronaut floating in dark space" 
                    className="w-full h-48 sm:h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-amber-500 text-gray-900 text-xs font-black uppercase px-3 py-1 border-l-4 border-b-4 border-gray-900">
                    Space
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 bg-gray-50 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2 uppercase">
                    🚀 The Black Sky
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Astronauts in space see a black sky even during daytime. Space has almost no atmosphere. Without enough air molecules, sunlight cannot scatter across the sky, leaving the backdrop completely dark.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Quick Review & Key Terms */}
            <hr className="my-16 border-gray-900 border-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 font-sans bg-amber-50 border-4 border-amber-600 p-8 shadow-[8px_8px_0px_0px_#D97706]">
              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-amber-900 mb-6 uppercase tracking-wider">Quick Review</h2>
                <ul className="list-none space-y-3 text-gray-900 font-bold">
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What is white light?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> What is a wavelength?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> Which color has the longest wavelength?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> Which color scatters more, blue or red?</li>
                  <li className="flex gap-2"><span className="text-amber-600">❓</span> Why does the sky appear blue?</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-amber-900 mb-6 uppercase tracking-wider">Key Terms</h2>
                <dl className="space-y-5 text-gray-800">
                  <div className="border-l-4 border-amber-600 pl-4">
                    <dt className="font-black text-gray-900 uppercase">Atmosphere</dt>
                    <dd className="text-sm mt-1 font-serif">The layer of gases surrounding Earth.</dd>
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4">
                    <dt className="font-black text-gray-900 uppercase">Wavelength</dt>
                    <dd className="text-sm mt-1 font-serif">The distance between two wave peaks.</dd>
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4">
                    <dt className="font-black text-gray-900 uppercase">Rayleigh Scattering</dt>
                    <dd className="text-sm mt-1 font-serif">The scattering of light by tiny particles.</dd>
                  </div>
                </dl>
              </motion.div>
            </div>

            {/* Summary Block */}
            <motion.div 
              variants={fadeUpVariant} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className="bg-gray-900 text-white p-8 sm:p-10 mt-12 shadow-[8px_8px_0px_0px_#111827] font-sans"
            >
              <h2 className="text-3xl font-black text-amber-500 mb-4 uppercase tracking-widest border-b-2 border-gray-700 pb-2 inline-block">Remember</h2>
              <p className="text-lg sm:text-xl leading-relaxed font-serif mt-4">
                The sky appears blue because blue light has a shorter wavelength and scatters more strongly in Earth's atmosphere. During sunrise and sunset, most of the blue light scatters away, leaving more red and orange light for your eyes to see.
              </p>
            </motion.div>

          </div>
        </motion.article>
      </div>
    </div>
  );
}