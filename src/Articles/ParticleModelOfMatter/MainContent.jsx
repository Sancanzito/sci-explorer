// MainContent.jsx - Practical Grade 7 Resource
import React from 'react';
import { StateComparison, HeatingSimulation } from './Animation';
import glass from "../../assets/ParticleModel/glass.jpg"
import weight from "../../assets/ParticleModel/weight.jpg"
import volume from "../../assets/ParticleModel/box.jpg"
import toyBlocks from "../../assets/ParticleModel/toyBlocks.jpg"
import attract from "../../assets/ParticleModel/attract.jpg"
import gap from "../../assets/ParticleModel/gap.png"
import move from "../../assets/ParticleModel/motion.jpg"
import molecule from "../../assets/ParticleModel/molecules.jpg"
import droplet from "../../assets/ParticleModel/droplet.jpg"
import solid from "../../assets/ParticleModel/solid.jpg"
import liquid from "../../assets/ParticleModel/liquid.jpg"
import gas from "../../assets/ParticleModel/gas.jpg"
import boiling from "../../assets/ParticleModel/boiling.jpg"
import cooking from "../../assets/ParticleModel/cooking.jpg"
import refrigerator from "../../assets/ParticleModel/refrigirators.jpg"
import laundry from "../../assets/ParticleModel/laundry.jpg"
import balloon from "../../assets/ParticleModel/balloons.jpg"
// Practical Image Box Component for Grade 7 Visuals
const ConceptImage = ({ title, icon, color = 'blue', description, practicalExample, observationTips, imageUrl }) => {
  const colorClasses = {
    blue: 'bg-blue-50/80 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800',
    purple: 'bg-purple-50/80 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800',
    green: 'bg-green-50/80 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800',
    orange: 'bg-orange-50/80 border-orange-200 text-orange-700 dark:bg-orange-950/30 dark:border-orange-800',
    teal: 'bg-teal-50/80 border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-800',
  };

  return (
    <div className={`rounded-xl border-2 border-solid ${colorClasses[color]} p-5 my-4 bg-white dark:bg-gray-900/40 shadow-sm`}>
      <div className="flex flex-col lg:flex-row items-start gap-5">
        
        {/* Left Side: Content Details */}
        <div className="space-y-1.5 w-full lg:flex-1 order-2 lg:order-1">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
              {icon}
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {title}
            </h4>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 pt-1">{description}</p>
          
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200/60 dark:border-gray-700/60 mt-2 text-xs">
            <div>
              <span className="font-bold block text-gray-800 dark:text-gray-200 mb-0.5">🏡 Everyday Example:</span>
              <p className="text-gray-500">{practicalExample}</p>
            </div>
            <div>
              <span className="font-bold block text-gray-800 dark:text-gray-200 mb-0.5">🔍 What to Look For:</span>
              <p className="text-gray-500">{observationTips}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Rendered Sample Image */}
        <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 order-1 lg:order-2 shadow-inner bg-gray-50">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

      </div>
    </div>
  );
};

// Everyday Practical Applications Diagram
const VisualDiagram = ({ title, items, color = 'blue' }) => {
  const colorBg = {
    blue: 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/60',
    green: 'bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900/60',
  };
  
  return (
    <div className={`rounded-2xl border ${colorBg[color]} p-5 my-6`}>
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{item.subtext}</p>
            </div>
            {/* Embedded image for grid blocks */}
            <div className="mt-3 w-full h-16 rounded overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50">
              <img 
                src={item.imageUrl} 
                alt={item.label} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="space-y-10">
      
      {/* ==================== INTRODUCTION ==================== */}
      <section id="intro" className="scroll-mt-28 space-y-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
            Chemistry 
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl text-gray-900 dark:text-white tracking-tight">
            The Particle Model of Matter
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Discovering the invisible building blocks of your world!
          </p>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Have you ever wondered why ice cubes melt in your glass, how the smell of breakfast drifts into your room before you open your eyes, or where puddles go after a sunny afternoon? 
          Scientists explain these everyday wonders using the <strong>Particle Model of Matter</strong>. 
          The big secret is simple: everything around us is made of microscopic, tiny building blocks that are constantly wiggling, moving, and interacting!
        </p>
        
        <ConceptImage 
          title="Zooming into a Glass of Ice Water"
          icon="🥤"
          color="blue"
          description="Looking at the different behaviors of particles side-by-side in a single drink cup."
          practicalExample="Solid ice cubes floating on liquid water while invisible water vapor floats right above it."
          observationTips="The ice blocks stay hard and brick-like, the liquid water takes the shape of the lower glass, and bubbles of gas escape out into the air."
          imageUrl={glass}
        />
      </section>

      {/* ==================== SECTION 1: WHAT IS MATTER ==================== */}
      <section id="section-1" className="scroll-mt-28 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold">1</span>
          What Exactly is Matter?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          In science, <strong>matter</strong> is just the formal name for "stuff." If an object has weight and takes up physical space, it counts as matter. Matter is defined by two simple core guidelines:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl flex gap-3 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">⚖️</span>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">It Has Mass</p>
              </div>
              <p className="text-xs text-gray-500">This means it is made of real physical substance. You can measure its weight on a scale using grams or kilograms.</p>
            </div>
            <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-white">
              <img 
                src={weight}
                alt="Scale weighing mass" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl flex gap-3 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">📦</span>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">It Takes Up Volume</p>
              </div>
              <p className="text-xs text-gray-500">This means it occupies space. Whether it fills up a tiny measuring spoon or fills an entire basketball court!</p>
            </div>
            <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-white">
              <img 
                src={volume}
                alt="Measuring beaker showing volume" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-4 rounded-xl text-xs text-gray-700 dark:text-gray-300 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">🧱 The Toy Building Block Analogy</span>
            Think of matter like a large toy castle. From far away, it looks like one solid, continuous wall. But when you get up close, you notice it is made of thousands of individual plastic bricks snapped side-by-side. Those bricks are like our particles!
          </div>
          <div className="w-full md:w-28 h-16 rounded overflow-hidden border border-amber-200 dark:border-amber-800 shrink-0 shadow-sm bg-white">
            <img 
              src={toyBlocks}
              alt="Toy building blocks close up" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: FOUR MAIN IDEAS ==================== */}
      <section id="section-2" className="scroll-mt-28 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-bold">2</span>
          The 4 Rules of Particles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center gap-2">
            <div>
              <span className="font-bold text-blue-600 block mb-0.5">1. Built From Tiny Pieces</span>
              <p className="text-gray-500">Everything is formed by pieces so small they cannot be seen with normal eyes.</p>
            </div>
            <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-gray-50">
              <img src={molecule} alt="Microscopic view" className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center gap-2">
            <div>
              <span className="font-bold text-teal-600 block mb-0.5">2. Constantly Moving</span>
              <p className="text-gray-500">Particles never rest! They are always vibrating, sliding, or zooming around.</p>
            </div>
            <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-gray-50">
              <img src={move} alt="Abstract particle motion representation" className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center gap-2">
            <div>
              <span className="font-bold text-purple-600 block mb-0.5">3. Spaces Exist Between Them</span>
              <p className="text-gray-500">Particles aren't melted completely together; they have tiny empty gaps between them.</p>
            </div>
            <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-gray-50">
              <img src={gap} alt="Grid showing empty spaces" className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center gap-2">
            <div>
              <span className="font-bold text-amber-600 block mb-0.5">4. Held Together By Attracting Forces</span>
              <p className="text-gray-500">Particles act like tiny magnets, pulling toward one another to stay grouped.</p>
            </div>
            <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm bg-gray-50">
              <img src={attract} alt="Magnets pulling together" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>

        <ConceptImage 
          title="The Playground Magnet Rule"
          icon="🧲"
          color="purple"
          description="Visualizing the attraction force holding particles together in different ways."
          practicalExample="Water droplets clinging together to form a single large round bead on a leaf."
          observationTips="Notice how water drops pull closer to each other automatically when they touch, showing how particles naturally attract."
          imageUrl={droplet}
        />
      </section>

      {/* ==================== SECTION 3: STATES OF MATTER ==================== */}
      <section id="section-3" className="scroll-mt-28 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-bold">3</span>
          The Three States of Matter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/60 rounded-xl text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-blue-600 text-sm block mb-1">Solid 🧊</span>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Holds its own shape firmly. Particles are tightly locked into rows and can only wiggle in place.</p>
              <span className="text-[10px] uppercase font-mono text-gray-400 block mb-3">Example: Metal Spoon, Rocks</span>
            </div>
            <div className="w-full h-24 rounded overflow-hidden border border-blue-200 dark:border-blue-800 shadow-inner bg-white">
              <img 
                src={solid} 
                alt="Solid ice crystals close up" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-4 bg-teal-50/40 dark:bg-teal-950/10 border border-teal-100 dark:border-teal-900/60 rounded-xl text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-teal-600 text-sm block mb-1">Liquid 💧</span>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Takes the shape of its container. Particles stay close together but can slide and roll smoothly past each other.</p>
              <span className="text-[10px] uppercase font-mono text-gray-400 block mb-3">Example: Juice, Cooking Oil</span>
            </div>
            <div className="w-full h-24 rounded overflow-hidden border border-teal-200 dark:border-teal-800 shadow-inner bg-white">
              <img 
                src={liquid} 
                alt="Liquid water pouring smoothly" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-4 bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/60 rounded-xl text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-purple-600 text-sm block mb-1">Gas 💨</span>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Fills up any open space completely. Particles are far apart and fly rapidly in all directions.</p>
              <span className="text-[10px] uppercase font-mono text-gray-400 block mb-3">Example: Air in a tire, Steam</span>
            </div>
            <div className="w-full h-24 rounded overflow-hidden border border-purple-200 dark:border-purple-800 shadow-inner bg-white">
              <img 
                src={gas} 
                alt="Gas clouds and water vapor steam" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="my-2">
          <StateComparison />
        </div>
      </section>

      {/* ==================== SECTION 4: HEAT AND PARTICLE MOVEMENT ==================== */}
      <section id="section-4" className="scroll-mt-28 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs font-bold">4</span>
          What Happens When Things Change Temperature?
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Temperature changes how fast particles move! Think of heat as an <strong>energy injection</strong>. When things get hot, particles move faster. When things cool down, they lose speed.
        </p>

        <ConceptImage 
          title="Boiling a Kettle on the Stove"
          icon="🫖"
          color="orange"
          description="Watching liquid water turn into fast-moving invisible gas steam using kitchen heat."
          practicalExample="As water gets hot, bubbles rise rapidly and turn into an invisible cloud rushing from the spout."
          observationTips="The liquid gets energetic and wild, showing that adding heat makes the particles break free from each other entirely."
          imageUrl={boiling}
        />

        <HeatingSimulation />

        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-bold">
                <th className="p-3">Change of State</th>
                <th className="p-3">What is Happening to Particles?</th>
                <th className="p-3">Real Life Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
              <tr>
                <td className="p-3 font-bold text-blue-600">Melting 🔥</td>
                <td className="p-3">Solid turns to Liquid. Heat speeds particles up until they break away from fixed rows.</td>
                <td className="p-3">A stick of butter melting in a hot cooking pan.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">Freezing ❄️</td>
                <td className="p-3">Liquid turns to Solid. Cooling slows particles down until they lock tight in place.</td>
                <td className="p-3">Melted wax hardening back into a firm candle structure.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">Evaporation 🔥</td>
                <td className="p-3">Liquid turns to Gas. Extra heat lets top particles fly away completely into the air.</td>
                <td className="p-3">Wet clothes drying under the warm summer sunshine.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">Condensation ❄️</td>
                <td className="p-3">Gas turns to Liquid. Cold air slows down gas particles until they gather into water droplets.</td>
                <td className="p-3">Fog forming on a bathroom mirror during a hot shower.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <VisualDiagram 
          title="Practical Places Where Particle Science Helps Us"
          color="green"
          items={[
            { icon: "🍳", label: "Cooking Meals", subtext: "Spreading heat into food particles safely", imageUrl: cooking },
            { icon: "👕", label: "Drying Laundry", subtext: "Using warm air to pull water particles away", imageUrl: laundry },
            { icon: "❄️", label: "Refrigerators", subtext: "Slowing particles down to preserve lunch", imageUrl: refrigerator },
            { icon: "🎈", label: "Party Balloons", subtext: "Bouncing air particles keeping rubber full", imageUrl: balloon }
          ]}
        />
      </section>

    </div>
  );
};

export default MainContent;