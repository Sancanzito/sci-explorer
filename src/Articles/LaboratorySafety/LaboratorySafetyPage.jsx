import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Import the interactive components
import PPEEquipper from './PPEEquipper';
import EmergencySimulator from './EmergencySimulator';
import SafetyQuizComponent from './SafetyQuizComponent';
import LabSafetyScrollSpy from './LabSafetyScrollSpy';
import LabSafetyFooter from './LaboratorySafetyFooter';

import ghs from '../../assets/Labsafety/ghs_hazard.png';
import safety from '../../assets/Labsafety/safety.jpg'
// Reusable Section Component
const Section = ({ id, title, children, icon }) => {
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
      className="mb-16 scroll-mt-28"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-6">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-2xl">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        <div className="p-6 md:p-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

// Reusable Data Table Component
const DataTable = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 my-6">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
      <thead className="bg-gray-50 dark:bg-gray-800/80">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-6 py-4 text-sm font-medium">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LabSafetyPage = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: '1. Importance of Safety' },
    { id: 'culture', title: '2. Safety Culture' },
    { id: 'responsibilities', title: '3. Responsibilities' },
    { id: 'risk-assessment', title: '4. Risk Assessment' },
    { id: 'ppe', title: '5. PPE' },
    { id: 'ghs', title: '6. Hazard Identification' },
    { id: 'sds', title: '7. Chemical Safety and SDS' },
    { id: 'biosafety', title: '8. Biological Safety' },
    { id: 'fire', title: '9. Fire Safety' },
    { id: 'waste', title: '10. Waste Segregation' },
    { id: 'ethics', title: '11. Laboratory Ethics' },
    { id: 'workflow', title: '12. Workflow Safety' },
    { id: 'assessment', title: '13. Module Assessment' }
  ];

  const handleSectionClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Intersection Observer to update ScrollSpy on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-24 pb-16 px-6 border-b-4 border-yellow-500">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-xs uppercase tracking-widest border border-yellow-500/30">
            Comprehensive Training Module
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Laboratory Safety & Compliance
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Master the principles of risk assessment, chemical safety, and ethical laboratory practices to protect yourself and your peers.
          </p>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10 relative">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="sticky top-28">
            <LabSafetyScrollSpy 
              sections={sections} 
              activeSection={activeSection} 
              onSectionClick={handleSectionClick} 
            />
          </div>
        </aside>

        {/* Content Area */}
        <main id="printable-safety-content" className="w-full lg:w-3/4">
          
          <Section id="intro" title="1. Importance of Laboratory Safety" icon="🛡️">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <p>
                  Laboratory safety is the cornerstone of all scientific inquiry. It encompasses the protocols, equipment, and behaviors required to mitigate risks associated with chemical, biological, and physical hazards. 
                </p>
                <p>
                  A safe laboratory environment ensures that scientific discovery can proceed without endangering human health or the environment.
                </p>
              </div>
              <figure className="w-full md:w-1/3 flex-shrink-0">
                <img 
                  src={safety} 
                  alt="Scientists working safely in a modern laboratory" 
                  className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full h-auto object-cover"
                />
                <figcaption className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center italic">Proper safety gear in a modern laboratory environment.</figcaption>
              </figure>
            </div>
          </Section>

          <Section id="culture" title="2. Safety Culture" icon="🤝">
            <p>
              Safety culture refers to the attitudes, values, and practices that prioritize safety in laboratory environments. It shifts the focus from merely "following rules" to actively protecting the community.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Shared Responsibility:</strong> Safety is everyone's responsibility, not just the instructor's.</li>
              <li><strong>Prevention First:</strong> All accidents are preventable with proper planning.</li>
              <li><strong>Purposeful Rules:</strong> Rules exist strictly to protect people and integrity, not to restrict learning.</li>
              <li><strong>Open Communication:</strong> Reporting hazards and near-misses is actively encouraged without fear of punishment.</li>
            </ul>
          </Section>

          <Section id="responsibilities" title="3. Responsibilities in the Laboratory" icon="📋">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-4 uppercase text-sm tracking-wider">Responsibilities of Students</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Follow all written and verbal instructions precisely.</li>
                  <li>Wear appropriate Personal Protective Equipment (PPE) at all times.</li>
                  <li>Report unsafe conditions, spills, or injuries immediately.</li>
                  <li>Maintain a clean and organized workspace.</li>
                  <li>Dispose of chemical and biological waste in designated containers.</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-4 uppercase text-sm tracking-wider">Responsibilities of Instructors</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Provide comprehensive safety training and module reviews.</li>
                  <li>Actively monitor laboratory activities and enforce compliance.</li>
                  <li>Maintain and inspect safety equipment (eyewashes, hoods).</li>
                  <li>Ensure emergency preparedness and clear exit routes.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="risk-assessment" title="4. Risk Assessment" icon="⚖️">
            <p>
              Before initiating any experiment, scientists must perform a formal risk assessment. This proactive approach prevents accidents before they occur.
            </p>
            <ol className="list-decimal pl-6 space-y-2 my-4 font-medium">
              <li><strong>Identify hazards:</strong> What materials or processes are dangerous?</li>
              <li><strong>Determine risks:</strong> What is the likelihood and severity of harm?</li>
              <li><strong>Implement controls:</strong> How can we mitigate this risk?</li>
              <li><strong>Monitor measures:</strong> Are the safety controls working during the experiment?</li>
            </ol>
            <DataTable 
              headers={["Identified Hazard", "Potential Risk", "Required Control Measure"]}
              rows={[
                ["Hydrochloric Acid (HCl)", "Chemical burns to skin or eyes", "Wear nitrile gloves and splash-proof goggles"],
                ["Bunsen Burner (Open Flame)", "Fire or thermal burns", "Tie back hair, clear flammables from bench"],
                ["Broken Beaker", "Lacerations/Cuts", "Sweep with brush/dustpan, use sharps container"]
              ]}
            />
          </Section>

          <Section id="ppe" title="5. Personal Protective Equipment (PPE)" icon="🥽">
            <p>
              PPE is your final line of defense against exposure. Selection depends directly on the risk assessment of the specific experiment.
            </p>
            
            <PPEEquipper />

            <DataTable 
              headers={["Laboratory Situation", "PPE Required"]}
              rows={[
                ["General Chemical Handling", "Nitrile gloves, splash goggles, fastened lab coat"],
                ["Microbiology / Bacterial Culturing", "Gloves, lab coat, surgical mask or N95"],
                ["Heating Chemicals / Glassware", "Heat-resistant gloves, safety goggles"],
                ["UV Light Exposure", "Face shield, specialized UV-protective eyewear"]
              ]}
            />
          </Section>

          <Section id="ghs" title="6. Hazard Identification & GHS Symbols" icon="⚠️">
            <p>
              The Globally Harmonized System (GHS) uses standard pictograms to communicate chemical hazards globally. Recognizing these symbols on reagent bottles is mandatory before handling any substance.
            </p>
            
            <figure className="my-8 bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
              <img 
              src={ghs} 
              alt="GHS Hazard Pictograms" 
              className="w-full max-w-xl object-contain image-pixelated"
              />
              <figcaption className="text-xs text-gray-500 mt-4 text-center italic">The 9 standard Globally Harmonized System (GHS) hazard pictograms.</figcaption>
            </figure>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">🧨 Explosive</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">🔥 Flammable</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">⭕ Oxidizer</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">🗜️ Gas Under Pressure</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">🧪 Corrosive</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">☠️ Acute Toxicity</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">👤 Health Hazard</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">❗ Irritant</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">🐟 Environmental Hazard</div>
            </div>
          </Section>

          <Section id="sds" title="7. Chemical Safety and SDS" icon="📄">
            <p>
              A <strong>Safety Data Sheet (SDS)</strong> is a standardized document that contains detailed occupational safety and health data for a specific chemical. 
            </p>
            <p className="font-medium mt-4">Before using a new chemical, you must review its SDS to identify:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Chemical identity and composition</li>
              <li>Hazards identification</li>
              <li>First aid measures</li>
              <li>Handling and storage requirements</li>
              <li>Disposal procedures</li>
            </ul>
          </Section>

          <Section id="biosafety" title="8. Biological Safety" icon="🦠">
            <p>
              Working with biological agents (bacteria, viruses, fungi, human tissue) requires strict protocols to prevent contamination and infection.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Unknowns:</strong> Never culture or sniff unknown biological organisms.</li>
              <li><strong>Hygiene:</strong> Wash hands thoroughly with antimicrobial soap before and after laboratory work.</li>
              <li><strong>Disinfection:</strong> Decontaminate work surfaces with 70% ethanol or 10% bleach before and after use.</li>
              <li><strong>Aseptic Technique:</strong> Use sterile instruments and work near a flame or inside a biosafety cabinet to prevent environmental contamination.</li>
            </ul>
          </Section>

          <Section id="fire" title="9. Fire Safety" icon="🔥">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-bold text-lg mb-3">The Fire Triangle</h3>
                <p className="mb-4 text-sm md:text-base">A fire requires three elements to ignite and sustain combustion: <strong>Heat, Fuel, and Oxygen.</strong> Removing any single element will extinguish the fire (e.g., smothering removes oxygen).</p>
                
                <h3 className="font-bold text-lg mb-3 mt-6">Extinguisher Use: The PASS Method</h3>
                <ul className="space-y-2 font-medium text-sm md:text-base">
                  <li><span className="text-red-500 font-black text-xl mr-2">P</span> Pull the pin.</li>
                  <li><span className="text-red-500 font-black text-xl mr-2">A</span> Aim at the base of the fire.</li>
                  <li><span className="text-red-500 font-black text-xl mr-2">S</span> Squeeze the handle.</li>
                  <li><span className="text-red-500 font-black text-xl mr-2">S</span> Sweep from side to side.</li>
                </ul>
              </div>
              <figure className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Fire_triangle.svg/640px-Fire_triangle.svg.png" 
                  alt="The Fire Triangle diagram showing Heat, Fuel, and Oxygen" 
                  className="w-full max-w-[200px] object-contain drop-shadow-md"
                />
                <figcaption className="text-xs text-gray-500 mt-4 text-center italic">The components required to sustain a chemical fire.</figcaption>
              </figure>
            </div>
          </Section>

          <Section id="waste" title="10. Waste Segregation and Disposal" icon="🗑️">
            <p>
              Improper waste disposal can cause violent chemical reactions, environmental damage, or custodial injuries. Never pour chemicals down the sink unless explicitly instructed.
            </p>
            <DataTable 
              headers={["Waste Type", "Correct Disposal Method"]}
              rows={[
                ["Chemical Waste (Solvents/Acids)", "Designated Hazardous Waste Carboys (Check compatibility)"],
                ["Biological Waste (Agar plates, swabs)", "Red Biohazard Bags for Autoclaving"],
                ["Sharps (Needles, scalpels, broken glass)", "Puncture-proof rigid Sharps Container"],
                ["Regular Waste (Paper towels, wrappers)", "Standard Trash Receptacle"]
              ]}
            />
          </Section>

          <Section id="ethics" title="11. Laboratory Ethics" icon="⚖️">
            <p>
              A safe laboratory is an ethical laboratory. Scientific integrity is compromised if ethical standards are ignored.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Honesty:</strong> Record observations truthfully. Never falsify or fabricate data to match expected results.</li>
              <li><strong>Respect for Subjects:</strong> Treat animal and human subjects with the highest ethical standards and humane care.</li>
              <li><strong>Resource Respect:</strong> Do not waste expensive reagents, and treat shared laboratory equipment carefully to ensure it remains safe for the next user.</li>
            </ul>
          </Section>

          <Section id="workflow" title="12. Safety Before, During, and After" icon="🔄">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg text-blue-800 dark:text-blue-400">Before the Experiment</h3>
                <p className="text-sm mt-1">Read the entire procedure, verify the risk assessment, inspect glassware for cracks, and don required PPE.</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-400">During the Experiment</h3>
                <p className="text-sm mt-1">Follow instructions precisely, never leave active heat sources unattended, maintain a decluttered workspace, and report any spills instantly.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg text-green-800 dark:text-green-400">After the Experiment</h3>
                <p className="text-sm mt-1">Segregate and dispose of waste, wipe down the benchtop, wash hands thoroughly, and document findings accurately.</p>
              </div>
            </div>
          </Section>

          <Section id="assessment" title="13. Module Assessment" icon="📝">
            <p className="mb-6">Test your decision-making skills with these simulated emergency scenarios before moving on to the final knowledge check.</p>
            
            <EmergencySimulator />

            <div className="mt-12">
              <SafetyQuizComponent />
            </div>
          </Section>

        </main>
      </div>

      {/* Integrated Footer */}
      <LabSafetyFooter />

    </div>
  );
};

export default LabSafetyPage;