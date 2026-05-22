// components/ChemistryModels/MainContent.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  ParticleAnimation, 
  BondFormation, 
  DiffusionAnimation, 
  AtomicEvolution 
} from './ChemistryModelAnimations';

// images
import compare from "../../assets/UseofChemModels/comparison_water.jpg";
import democritus from "../../assets/UseofChemModels/democritus.jpg";
import dalton from "../../assets/UseofChemModels/scimodel.jpg";
import realvsfake from "../../assets/UseofChemModels/realvsfake.jpg"
import graphy from "../../assets/UseofChemModels/graphy.avif"
import physical from "../../assets/UseofChemModels/physical.avif"
import conceptual from "../../assets/UseofChemModels/concept.avif"
import mathematical from "../../assets/UseofChemModels/mathematical.avif"
import johndalton from "../../assets/UseofChemModels/johndalton.webp"
import ernest from "../../assets/UseofChemModels/ernest.webp"
import thomson from "../../assets/UseofChemModels/thomson.webp"
import bohr from "../../assets/UseofChemModels/bohr.webp"
import map from "../../assets/UseofChemModels/map.jpg"
import salt from "../../assets/UseofChemModels/salt.jpg"
// Reusable Section Component with animations
const Section = ({ id, title, children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.05, triggerOnce: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className={`mb-12 scroll-mt-24 ${className}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="border-b-4 border-blue-500 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

// Simplified Media/Diagram Placeholder Component
const ImagePlaceholder = ({ label, description, aspect = "video", src }) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "h-48"
  };

  return (
    <div className={`w-full ${aspectClasses[aspect]} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center text-center group hover:border-blue-400 dark:hover:border-blue-500 transition-colors`}>
      
      {src ? (
        <img 
          src={src} 
          alt={label || description} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl m-2 flex flex-col items-center justify-center h-[calc(100%-1rem)] w-[calc(100%-1rem)]">
          <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{label}</span>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
        </div>
      )}

    </div>
  );
};

// Card Component
const Card = ({ title, children, icon, color = "blue" }) => {
  const colors = {
    blue: "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10",
    green: "border-green-500 bg-green-50/50 dark:bg-green-900/10",
    purple: "border-purple-500 bg-purple-50/50 dark:bg-purple-900/10",
    orange: "border-orange-500 bg-orange-50/50 dark:bg-orange-900/10",
    red: "border-red-500 bg-red-50/50 dark:bg-red-900/10",
  };

  return (
    <div className={`border-l-4 ${colors[color]} rounded-xl p-5 h-full`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
};

// Comparison Table
const ComparisonTable = ({ data, headers }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
      <thead className="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MainContent = () => {
  return (
    <main id="printable-chemistry-content" className="max-w-4xl mx-auto px-4 pt-8 pb-24 space-y-12">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl p-8 md:p-12">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 bg-white/20 rounded-full">Fun Science Guide</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Using Models in Chemistry</h1>
          <p className="text-md md:text-lg text-blue-100 font-medium">How we look at tiny, hidden particles and chemical reactions using helpful pictures and objects.</p>
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-black/20 rounded-xl px-4 py-3 border border-white/10 text-sm">
              <span>💡</span>
              <p className="font-semibold">Big Question: <span className="text-yellow-300">"How do scientists study things that are too small to see?"</span></p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="2" fill="white" />
            <circle cx="20" cy="30" r="6" />
            <circle cx="80" cy="70" r="8" />
          </svg>
        </div>
      </div>

      {/* 1. Introduction */}
      <Section id="introduction" title="1. Introduction: Why Models Matter">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Scientists study super small building blocks of matter. Since we cannot see them with our bare eyes, we use **models** to help us picture them.
            </p>
            <Card title="Easy Comparison" icon="🗺️" color="blue">
              "A model is like a map. A map is not the actual ground, but it helps you find your way around and understand where things are."
            </Card>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
              <h4 className="text-xs uppercase font-bold tracking-wider opacity-80">Easy Trick to Remember</h4>
              <p className="text-2xl font-black my-1">"MVP"</p>
              <p className="text-xs font-medium">Models help us <span className="underline decoration-2">V</span>isualize (picture) <span className="underline decoration-2">P</span>henomena (science events) accurately.</p>
            </div>
            <ImagePlaceholder 
              src={compare}
              label="[Zooming In on Water]" 
              description="A picture showing a normal glass of water, zooming all the way down to see how tiny water particles are arranged." 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <Card title="Body Scans" icon="🧠" color="purple"><p className="text-xs">Pictures that show doctors what it looks like inside our bodies.</p></Card>
          <Card title="Weather Maps" icon="⛈️" color="purple"><p className="text-xs">Computer animations that show where storms are moving.</p></Card>
          <Card title="DNA Models" icon="🧬" color="purple"><p className="text-xs">Plastic twisted ladders that show how our genes look.</p></Card>
          <Card title="Making Medicine" icon="🔬" color="purple"><p className="text-xs">Computer games that test if a medicine fits into a virus particle like a key.</p></Card>
        </div>
      </Section>

      {/* 2. What is a Model */}
      <Section id="what-is-model" title="2. What is a Science Model?">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Simple Definition</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                A <strong>scientific model</strong> is a simplified copy or picture used to explain or show how something works.
              </p>
            </div>
            <ComparisonTable 
              headers={["Real Thing", "The Model We Use"]}
              data={[
                ["Planet Earth", "A Classroom Globe"],
                ["Tiny Atom", "Plastic Ball-and-Stick Toys"],
                ["Real Weather Control", "A Simple Map on TV"],
                ["Hidden DNA", "A Plastic Ladder Model"]
              ]}
            />
          </div>
          <div className="space-y-4">
            <ImagePlaceholder 
              src={realvsfake}
              label="[Real Object vs. Model]" 
              description="A drawing showing how a plastic science kit looks just like a real cluster of tiny crystals." 
            />
            <Card title="Famous Scientist: John Dalton" icon="👨‍🔬" color="green">
              In 1803, John Dalton said that everything is made of tiny blocks called atoms. He used solid wooden balls to represent them. Even though it was a simple model, it helped explain how chemicals mix together!
            </Card>
          </div>
        </div>
      </Section>

      {/* 3. Importance of Models */}
      <Section id="importance" title="3. Why Models are Important">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">How Scientists Use Models</h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex flex-col gap-2 border border-gray-200 dark:border-gray-700 font-mono text-xs">
              <div className="bg-white dark:bg-gray-800 p-2 rounded border text-center shadow-sm">1. Look closely at the real world</div>
              <div className="text-center text-blue-500 font-bold">↓</div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border text-center shadow-sm">2. Make a simple model or drawing</div>
              <div className="text-center text-blue-500 font-bold">↓</div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border text-center shadow-sm">3. Guess what will happen next</div>
              <div className="text-center text-blue-500 font-bold">↓</div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border text-center shadow-sm">4. Do experiments to test the guess</div>
              <div className="text-center text-blue-500 font-bold">↓</div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border text-center shadow-sm">5. Fix the model if the experiments show new facts</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-900 text-purple-100 rounded-xl p-4">
              <span className="text-xs uppercase tracking-wider font-bold opacity-70">Word Trick</span>
              <p className="text-xl font-black my-1">"EPS"</p>
              <p className="text-xs">Models help scientists **Explain** ideas, make **Predictions** (guesses), and **Share** info with others.</p>
            </div>
            <ImagePlaceholder 
              src={graphy}
              label="[Why We Need Models Info]" 
              description="A drawing showing that science would stop completely if we didn't have tools and models to study invisible things." 
            />
          </div>
        </div>
      </Section>

      {/* 4. Types of Models */}
      <Section id="types-of-models" title="4. Three Main Types of Models">
        <ComparisonTable 
          headers={["Type of Model", "What it means", "Example in Chemistry"]}
          data={[
            ["🧱 Physical Models", "Something you can touch and hold with your hands.", "Plastic balls used to build a molecule shape."],
            ["💡 Conceptual Models", "An idea or comparison that helps you picture something.", "Thinking of an atom like a tiny solar system with planets orbiting the sun."],
            ["📊 Mathematical Models", "Math equations, charts, and graphs.", "Using a line graph to show how heat changes a gas."]
          ]}
        />
        
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <ImagePlaceholder 
              src={physical}
              label="[A. Physical Model]" 
              description="A photo of students building molecule models using toothpicks and colored marshmallows." 
            />
          </div>
          <div className="space-y-2">
            <ImagePlaceholder 
              src={conceptual}
              label="[B. Conceptual Idea]" 
              description="A drawing comparing a solar system to the orbits of an atom." 
            />
          </div>
          <div className="space-y-2">
            <ImagePlaceholder 
              src={mathematical}
              label="[C. Math Graph]" 
              description="A simple graph showing how temperature goes up over time." 
            />
          </div>
        </div>
      </Section>

     {/* 5. Models of Matter */}
      <Section id="models-of-matter" title="5. History: How Models of the Atom Changed">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column: Timeline */}
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Timeline of the Atom</h4>
            
            <div className="relative pl-4 border-l-2 border-blue-500/30 space-y-4 my-2">
              {[
                { 
                  year: "400 BCE", 
                  title: "Democritus", 
                  description: "First thought of a tiny, solid particle that could not be cut.",
                  img: democritus
                },
                { 
                  year: "1803", 
                  title: "John Dalton", 
                  description: "Modeled atoms as hard, solid billiard balls.",
                  img: johndalton
                },
                { 
                  year: "1897", 
                  title: "J.J. Thomson", 
                  description: "Thought the atom looked like chocolate chip cookie dough, with negative charges inside.",
                  img: thomson
                },
                { 
                  year: "1911", 
                  title: "Ernest Rutherford", 
                  description: "Discovered that atoms have a tiny center called a nucleus.",
                  img: ernest
                },
                { 
                  year: "1913", 
                  title: "Niels Bohr", 
                  description: "Showed electrons moving in fixed tracks, like tracks around a racetrack.",
                  img: bohr
                }
              ].map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[25px] top-4 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 shadow-sm z-10" />
                  
                  <div className="relative rounded-xl overflow-hidden aspect-[3/1] md:aspect-[2.5/1] bg-gray-950 shadow-sm border border-gray-200/20">
                    <img 
                      src={event.img} 
                      alt={event.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/80 to-transparent" />
                    
                    <div className="absolute inset-0 p-3 flex flex-col justify-center z-10 pointer-events-none">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-wider text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase">
                          {event.year}
                        </span>
                        <h4 className="font-bold text-sm text-white drop-shadow-sm">{event.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-300 line-clamp-2 mt-1 leading-tight max-w-[85%]">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Simulations */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Dynamic Particle Simulations</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                <div className="text-xs font-semibold text-gray-500 mb-1 px-1 flex items-center gap-1">
                  <span>🔮</span> How Particles Move Around
                </div>
                <ParticleAnimation />
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                <div className="text-xs font-semibold text-gray-500 mb-1 px-1 flex items-center gap-1">
                  <span>🤝</span> How Particles Link Together
                </div>
                <BondFormation />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="text-xs font-semibold text-gray-500 mb-1 px-1 flex items-center gap-1">
                <span>💨</span> How Particles Spread Out
              </div>
              <DiffusionAnimation />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="text-xs font-semibold text-gray-500 mb-1 px-1 flex items-center gap-1">
                <span>📈</span> How Atom Shapes Changed Over Time
              </div>
              <AtomicEvolution />
            </div>
          </div>

        </div>
      </Section>

      {/* 6. Limitations */}
      <Section id="limitations" title="6. Things Models Cannot Do (Limitations)">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl p-4 text-sm text-amber-900 dark:text-amber-200">
          <strong>⚠️ Warning:</strong> Models are never perfect! They are made to be simple, which means they leave out some details, change sizes, or freeze things that are actually moving.
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Missing Pieces" icon="🔍" color="orange"><p className="text-xs">They leave out extra details to keep the main idea clear.</p></Card>
          <Card title="Wrong Sizes" icon="📏" color="orange"><p className="text-xs">They make gaps bigger so our eyes can see them clearly.</p></Card>
          <Card title="Frozen in Time" icon="⏸️" color="orange"><p className="text-xs">They use still objects, even though real particles move super fast.</p></Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <ImagePlaceholder 
            src={map}
            label="[Real Atom vs. Textbook Drawing]" 
            description="A graphic showing a blurry electron cloud next to a neat, simple textbook circle drawing." 
          />
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">Memory Trick: "SOS"</h5>
              <p className="text-gray-600 dark:text-gray-300">Models are always **S**implified, have details **O**mitted (left out), and sizes **S**caled differently.</p>
            </div>
            <p className="text-xs text-gray-500 italic leading-relaxed">
              Classroom Activity: Talk about why science books draw large gaps between particles. If they drew them accurately, the particles would look like tiny invisible dots!
            </p>
          </div>
        </div>
      </Section>

      {/* 7. Observable vs Non-observable */}
      <Section id="observable-nonobservable" title="7. Things We Can See vs. Things We Must Guess">
        <ComparisonTable 
          headers={["What We See on the Outside", "What is Happening on the Inside", "How We Know It's True"]}
          data={[
            ["A liquid suddenly changes color.", "Tiny parts swap places.", "We use a light meter to check the color shade."],
            ["Bubbles form when heated.", "Links between particles break.", "We check the thermometer to see if the heat stays steady."],
            ["The tube gets hot.", "Energy is released.", "We use a special cup called a calorimeter to measure heat changes."]
          ]}
        />
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <ImagePlaceholder 
            src={salt}
            label="[Salt Melting in Water]" 
            description="A photo of table salt disappearing in water, next to a cartoon showing water pulling salt parts apart." 
          />
          <Card title="Scientist Story: J.J. Thomson" icon="⚡" color="blue">
            In 1897, J.J. Thomson could not see inside an atom. Instead, he saw a glowing green beam in a glass tube bend away from magnets. This proved that atoms have tiny negative pieces called electrons!
          </Card>
        </div>
      </Section>

      {/* 8. Additional Learning Resources */}
      <Section id="additional-features" title="8. Extra Fun Stuff">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-gray-400">Science Pictures</h5>
            <ImagePlaceholder 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" 
              label="[Map of the Atom]" 
              aspect="square" 
            />
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-gray-400">Quick Scanning Links</h5>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-center space-y-2">
              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-xs font-mono text-xs">📱 QR Code: Simulation Game</div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-xs font-mono text-xs">📱 QR Code: Science Video</div>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-gray-400">Games to Play</h5>
            <div className="bg-blue-600/5 dark:bg-blue-500/5 p-4 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-blue-600 dark:text-blue-400">🧩 Sorting Challenge</p>
              <p className="text-gray-600 dark:text-gray-400">Practice putting models into physical, idea-based, or math-based categories.</p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default MainContent;