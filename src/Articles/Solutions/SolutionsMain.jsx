// pages/SolutionsMain.jsx
import React, { useState, useEffect } from "react";
import SolutionScroll from "./SolutionScroll";
import SolutionFooter from "./SolutionFooter";
import Markdown from "./Markdown"; // Updated path based on your component structure
import {
  FlaskConical,
  Droplets,
  BookOpen,
  Calculator,
  Info,
  CheckCircle2,
  Beaker,
} from "lucide-react";
import "katex/dist/katex.min.css";

const SolutionsMain = () => {
  const sections = [
    { id: "chapter-overview", title: "Chapter Overview" },
    { id: "what-is-solution", title: "1. What is a Solution?" },
    { id: "concentration", title: "2. Concentration" },
    { id: "measuring-concentration", title: "3. Measuring Concentration" },
    { id: "solubility-saturation", title: "4. Solubility & Saturation" },
    { id: "factors-affecting", title: "5. Factors Affecting Solubility" },
    { id: "daily-life", title: "Science in Daily Life" },
    { id: "assessment", title: "Chapter Summary & Assessment" },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = element.offsetTop - 90;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-5 w-full max-w-[260px]">
            <div className="p-2 select-none">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-md">
                Chemistry • Unit 4
              </span>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 mt-2 leading-tight">
                Solutions, Solubility, and Concentration
              </h2>
            </div>

            <SolutionScroll
              sections={sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />

            <div className="bg-gradient-to-br from-teal-50/50 to-slate-100 dark:from-teal-900/20 dark:to-slate-800/40 rounded-2xl p-4 border border-teal-100 dark:border-teal-800/30">
              <p className="text-[10px] font-bold text-teal-600/80 dark:text-teal-500 uppercase tracking-widest mb-3 border-b border-teal-100 dark:border-teal-800/50 pb-1.5 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Learning Outcomes
              </p>
              <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <span>Define solutions, solutes, and solvents.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <span>Calculate concentration using different methods.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <span>Explain factors affecting solubility.</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          id="printable-solutions-content"
          className="col-span-1 lg:col-span-3 pb-24 prose prose-teal dark:prose-invert max-w-none"
        >
          {/* Chapter Overview */}
          <section id="chapter-overview" className="scroll-mt-24">
            <img
              src="https://placehold.co/1200x400/0f766e/ffffff?text=Solutions,+Solubility,+and+Concentration"
              alt="Examples of solutions such as saltwater, tea, soft drinks, and air"
              className="w-full h-[350px] sm:h-[400px] object-cover rounded-3xl shadow-md mb-8"
            />
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              Chapter Overview
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Every day, people interact with solutions without realizing it.
              The coffee you drink, the sports drink you consume after
              exercise, seawater, vinegar, soft drinks, and even the air around
              us are examples of solutions. Understanding how substances
              dissolve and how concentration is measured allows scientists,
              pharmacists, engineers, environmentalists, and healthcare
              professionals to solve real-world problems.
            </p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mt-6 shadow-sm">
              <h3 className="text-lg font-bold mt-0 mb-3 text-teal-700 dark:text-teal-400">
                By the end of this module, learners will be able to:
              </h3>
              <ul className="list-disc pl-5 m-0 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Define solutions, solutes, and solvents.</li>
                <li>Explain how dissolution occurs.</li>
                <li>Distinguish between dilute and concentrated solutions.</li>
                <li>Calculate concentration using different methods.</li>
                <li>Describe saturation and solubility.</li>
                <li>Explain factors affecting solubility.</li>
                <li>
                  Apply concepts to everyday situations and laboratory
                  investigations.
                </li>
              </ul>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 1. What is a Solution? */}
          <section id="what-is-solution" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <FlaskConical className="text-teal-600" /> 1. What is a Solution?
            </h2>
            <p className="text-lg">
              A <strong>solution</strong> is a homogeneous mixture in which one
              substance is evenly distributed throughout another substance.
            </p>
            <p>
              Unlike heterogeneous mixtures, solutions appear uniform
              throughout and their components cannot be distinguished by simple
              observation.
            </p>

            <h3 className="text-2xl font-bold mt-8">Components of a Solution</h3>
            <p>A solution contains two important parts:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h4 className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-0">
                  Solute
                </h4>
                <p>The substance being dissolved.</p>
                <p className="font-semibold mb-1">Examples:</p>
                <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                  <li>Salt in saltwater</li>
                  <li>Sugar in tea</li>
                  <li>Carbon dioxide in soda</li>
                </ul>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-0">
                  Solvent
                </h4>
                <p>The substance that dissolves the solute.</p>
                <p className="font-semibold mb-1">Examples:</p>
                <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                  <li>Water in saltwater</li>
                  <li>Water in tea</li>
                  <li>Water in soft drinks</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-xl border-l-4 border-teal-500 my-6">
              <p className="font-bold text-teal-800 dark:text-teal-300 mt-0 mb-2">
                Example
              </p>
              <p className="mb-2">
                When a spoonful of sugar is added to water and stirred:
              </p>
              <ul className="list-disc pl-5 m-0 text-teal-900 dark:text-teal-200">
                <li>Sugar = Solute</li>
                <li>Water = Solvent</li>
                <li>Sugar water = Solution</li>
              </ul>
            </div>

            <div className="clearfix my-10">
              <figure className="float-right w-full sm:w-[40%] ml-0 sm:ml-6 mb-4">
                <img
                  src="https://placehold.co/400x300/e2e8f0/475569?text=Sugar+Dissolving"
                  alt="Molecular diagram showing sugar particles dispersing among water molecules"
                  className="w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 m-0"
                />
                <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                  Figure 1. Sugar molecules becoming evenly distributed among
                  water molecules.
                </figcaption>
              </figure>

              <h3 className="text-2xl font-bold mt-0">How Dissolving Occurs</h3>
              <p>
                Dissolution happens when solvent particles attract and surround
                solute particles. This process is called <strong>solvation</strong>.
                When water is the solvent, it is specifically called{" "}
                <strong>hydration</strong>.
              </p>

              <h4 className="font-semibold text-lg">Steps in Dissolution</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Solute particles separate.</li>
                <li>Solvent particles move between solute particles.</li>
                <li>Solvent surrounds solute particles.</li>
                <li>Uniform distribution occurs.</li>
              </ol>

              <h4 className="font-semibold text-lg mt-6">Real-Life Connection</h4>
              <p>
                Why does sugar disappear when stirred into coffee? The sugar
                does not vanish. Instead, sugar particles become evenly
                distributed throughout the coffee.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5 rounded-xl my-8 shadow-sm">
              <h4 className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold m-0 text-lg mb-3">
                <Info className="w-5 h-5" /> Knowledge Check 1
              </h4>
              <p className="text-blue-900 dark:text-blue-100 mt-0 mb-2">
                Identify the solute and solvent in the following:
              </p>
              <ol className="list-decimal pl-5 m-0 space-y-1 text-blue-800 dark:text-blue-200">
                <li>Saltwater</li>
                <li>Vinegar</li>
                <li>Carbonated soft drink</li>
              </ol>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 2. Concentration */}
          <section id="concentration" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <Droplets className="text-teal-600" /> 2. Concentration: Dilute
              and Concentrated Solutions
            </h2>

            <div className="clearfix mb-8">
              <figure className="float-left w-full sm:w-[45%] mr-0 sm:mr-6 mb-4">
                <img
                  src="https://placehold.co/400x350/e2e8f0/475569?text=Dilute+vs+Concentrated"
                  alt="Two beakers side by side, one lightly colored and one darkly colored"
                  className="w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 m-0"
                />
                <figcaption className="text-xs text-center text-gray-500 mt-2 italic">
                  Figure 2. Comparison of dilute and concentrated solutions.
                </figcaption>
              </figure>

              <p className="text-lg">
                Concentration refers to the amount of solute dissolved in a
                given amount of solution.
              </p>

              <h3 className="text-xl font-bold mt-6">Dilute Solution</h3>
              <p className="mt-2 mb-1">
                Contains a relatively small amount of solute.
              </p>
              <p className="text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Examples:
              </p>
              <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                <li>Weak lemonade</li>
                <li>Lightly salted water</li>
              </ul>

              <h3 className="text-xl font-bold mt-6">Concentrated Solution</h3>
              <p className="mt-2 mb-1">
                Contains a relatively large amount of solute.
              </p>
              <p className="text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Examples:
              </p>
              <ul className="mt-0 text-sm text-gray-600 dark:text-gray-400">
                <li>Syrup</li>
                <li>Strong saline solution</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-5 rounded-r-xl my-6">
              <h4 className="text-amber-800 dark:text-amber-400 font-bold mt-0 mb-2">
                Everyday Example
              </h4>
              <p className="mb-2 text-amber-900 dark:text-amber-200">
                Imagine making chocolate milk.
              </p>
              <p className="font-semibold mb-1 text-amber-900 dark:text-amber-200">
                Using:
              </p>
              <ul className="list-disc pl-5 m-0 mb-2 text-amber-900 dark:text-amber-200">
                <li>1 tablespoon chocolate powder = dilute</li>
                <li>5 tablespoons chocolate powder = concentrated</li>
              </ul>
              <p className="m-0 text-amber-900 dark:text-amber-200">
                The volume of milk remains the same, but the amount of solute
                changes.
              </p>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">
              Visual Comparison Table
            </h3>
            <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-left border-collapse m-0">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">
                      Property
                    </th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">
                      Dilute Solution
                    </th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700">
                      Concentrated Solution
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                      Solute Amount
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">Low</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">High</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                      Color Intensity
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Lighter
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Darker
                    </td>
                   </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                      Taste
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Weaker
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Stronger
                    </td>
                   </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                      Conductivity
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Lower
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Higher
                    </td>
                   </tr>
                </tbody>
               </table>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-6 rounded-2xl my-8">
              <h4 className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold m-0 text-xl mb-3">
                <Beaker className="w-6 h-6" /> Mini Investigation
              </h4>
              <p className="text-indigo-900 dark:text-indigo-100 mt-0 mb-2">
                Prepare three cups of colored water using:
              </p>
              <ul className="list-disc pl-5 m-0 mb-3 space-y-1 text-indigo-800 dark:text-indigo-200">
                <li>1 drop food coloring</li>
                <li>5 drops food coloring</li>
                <li>10 drops food coloring</li>
              </ul>
              <p className="m-0 font-medium text-indigo-900 dark:text-indigo-100">
                Observe how concentration changes appearance.
              </p>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 3. Measuring Concentration - with Fixed LaTeX formulas */}
          <section id="measuring-concentration" className="scroll-mt-24">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
              <Calculator className="text-teal-600" /> 3. Measuring
              Concentration Quantitatively
            </h2>

            <h3 className="text-xl font-bold mt-0 text-gray-700 dark:text-gray-300">
              Chapter Introduction
            </h3>
            <p className="text-lg">
              Scientists require exact measurements rather than qualitative
              descriptions such as "strong" or "weak." Concentration can
              therefore be expressed mathematically.
            </p>

            <img
              src="https://placehold.co/1000x300/0f766e/ffffff?text=Laboratory+Preparation"
              alt="Laboratory technician preparing solutions with graduated cylinders and volumetric flasks"
              className="w-full h-auto object-cover rounded-2xl shadow-sm my-8"
            />

            <div className="space-y-8 my-8">
              {/* Percentage by Mass */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mt-0 mb-2 text-slate-800 dark:text-slate-100">
                  Percentage by Mass (% m/m)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Used when both solute and solution masses are known.
                </p>
                <Markdown className="bg-white dark:bg-slate-900 py-4 px-2 rounded-xl shadow-inner text-center overflow-x-auto text-lg mb-4">
                  {`
$$ \\% \\,\\text{m/m} = \\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 100 $$
`}
                </Markdown>
                <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg text-teal-900 dark:text-teal-100">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-teal-700 dark:text-teal-400 mt-0 mb-1">
                    Example
                  </h4>
                  <Markdown>
                    {`
10 g salt dissolved in 100 g solution $\\rightarrow$ $\\frac{10}{100} \\times 100 = 10\\%$

**Result:** $10\\%$
`}
                  </Markdown>
                </div>
              </div>

              {/* Percentage by Volume */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mt-0 mb-2 text-slate-800 dark:text-slate-100">
                  Percentage by Volume (% v/v)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Used for liquid solutions.
                </p>
                <Markdown className="bg-white dark:bg-slate-900 py-4 px-2 rounded-xl shadow-inner text-center overflow-x-auto text-lg mb-4">
                  {`
$$ \\% \\,\\text{v/v} = \\frac{\\text{volume of solute}}{\\text{volume of solution}} \\times 100 $$
`}
                </Markdown>
                <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg text-teal-900 dark:text-teal-100">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-teal-700 dark:text-teal-400 mt-0 mb-1">
                    Example
                  </h4>
                  <Markdown>
                    {`
20 mL ethanol in 100 mL solution $\\rightarrow$ $\\frac{20}{100} \\times 100 = 20\\%$

**Result:** $20\\%$
`}
                  </Markdown>
                </div>
              </div>

              {/* Parts Per Million */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mt-0 mb-2 text-slate-800 dark:text-slate-100">
                  Parts Per Million (ppm)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Used for very small concentrations.
                </p>
                <p className="font-semibold text-sm mb-1 text-slate-700 dark:text-slate-300">
                  Examples:
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 mt-0 mb-4">
                  <li>Water quality testing</li>
                  <li>Air pollution monitoring</li>
                </ul>
                <Markdown className="bg-white dark:bg-slate-900 py-4 px-2 rounded-xl shadow-inner text-center overflow-x-auto text-lg mb-4">
                  {`
$$ \\text{ppm} = \\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 10^6 $$
`}
                </Markdown>

                <div className="mt-6 border-t border-slate-200 dark:border-slate-600 pt-4">
                  <h4 className="font-bold mt-0 mb-2 text-slate-800 dark:text-slate-200">
                    Real-World Application
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    Environmental scientists use ppm to determine whether
                    drinking water is safe.
                  </p>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 mt-0 mb-2">
                      Worked Example Box
                    </h4>
                    <p className="m-0 text-sm text-amber-900 dark:text-amber-200 mb-2">
                      A water sample contains 2 mg of lead in 1,000,000 mg of
                      water.
                    </p>
                    <Markdown>
                      {`
Calculate concentration: $\\frac{2\\ \\text{mg}}{10^6\\ \\text{mg}} \\times 10^6 = 2\\ \\text{ppm}$

*Interpretation: The water contains two parts lead per million parts water.*
`}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5 rounded-xl my-8 shadow-sm">
              <h4 className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold m-0 text-lg mb-3">
                <Info className="w-5 h-5" /> Knowledge Check 2
              </h4>
              <p className="text-blue-900 dark:text-blue-100 mt-0 mb-2">
                Calculate:
              </p>
              <ol className="list-decimal pl-5 m-0 space-y-1 text-blue-800 dark:text-blue-200">
                <li className="mb-2">
                  % mass if 15 g salt is dissolved in 150 g solution.{" "}
                  <Markdown className="inline-block">{"($\\frac{15}{150} \\times 100 = 10\\%$)"}</Markdown>
                </li>
                <li>
                  % volume if 30 mL alcohol is dissolved in 200 mL solution.{" "}
                  <Markdown className="inline-block">{"($\\frac{30}{200} \\times 100 = 15\\%$)"}</Markdown>
                </li>
              </ol>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* 4. Solubility and Saturation */}
          <section id="solubility-saturation" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              4. Solubility and Saturation
            </h2>

            <figure className="mb-8 text-center block w-full">
              <img
                src="https://placehold.co/800x300/e2e8f0/475569?text=Unsaturated+|+Saturated+|+Supersaturated"
                alt="Three beakers labeled Unsaturated, Saturated, and Supersaturated"
                className="w-[80%] mx-auto block rounded-2xl shadow-sm m-0"
              />
              <figcaption className="text-xs text-gray-500 mt-3 italic">
                Figure 3. Types of solutions based on saturation.
              </figcaption>
            </figure>

            <h3 className="text-2xl font-bold mt-8">What is Solubility?</h3>
            <p className="text-lg">
              Solubility is the maximum amount of solute that can dissolve in a
              given amount of solvent at a specified temperature.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm flex flex-col h-full">
                <img
                  src="https://placehold.co/400x200/cbd5e1/1e293b?text=Unsaturated"
                  alt="Unsaturated solution placeholder"
                  className="w-full h-32 object-cover"
                />
                <div className="p-5 flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0 mb-2">
                    Unsaturated Solution
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Contains less solute than the maximum amount possible. More
                    solute can still dissolve.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                    <strong>Example:</strong> A glass of water with one
                    teaspoon of sugar.
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm flex flex-col h-full">
                <img
                  src="https://placehold.co/400x200/cbd5e1/1e293b?text=Saturated"
                  alt="Saturated solution placeholder"
                  className="w-full h-32 object-cover"
                />
                <div className="p-5 flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0 mb-2">
                    Saturated Solution
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Contains the maximum amount of dissolved solute. Additional
                    solute remains undissolved.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                    <strong>Example:</strong> Water containing as much sugar as
                    it can hold at room temperature.
                  </div>
                </div>
              </div>

              <div className="border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50 dark:bg-red-900/10 overflow-hidden shadow-sm flex flex-col h-full">
                <img
                  src="https://placehold.co/400x200/fecaca/7f1d1d?text=Supersaturated"
                  alt="Supersaturated solution placeholder"
                  className="w-full h-32 object-cover"
                />
                <div className="p-5 flex-1">
                  <h4 className="text-xl font-bold text-red-800 dark:text-red-400 mt-0 mb-2">
                    Supersaturated Solution
                  </h4>
                  <p className="text-red-900 dark:text-red-200 text-sm mb-3">
                    Contains more dissolved solute than normally possible.
                    These solutions are unstable. Even slight disturbance can
                    trigger crystallization.
                  </p>
                  <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800/50">
                    <h5 className="font-bold text-red-800 dark:text-red-400 mt-0 mb-1 text-sm">
                      Real-World Example
                    </h5>
                    <p className="text-xs text-red-900 dark:text-red-200 m-0">
                      Rock candy production relies on supersaturated sugar
                      solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800 clear-both" />

          {/* 5. Factors Affecting Solubility */}
          <section id="factors-affecting" className="scroll-mt-24 clear-both">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              5. Factors Affecting Solubility
            </h2>

            <h3 className="text-xl font-bold mt-0 text-gray-700 dark:text-gray-300">
              Section Introduction
            </h3>
            <p className="text-lg">
              Several variables influence how quickly and how much solute
              dissolves.
            </p>

            <div className="space-y-10 mt-8">
              <div className="clearfix">
                <figure className="float-left w-full sm:w-[45%] mr-0 sm:mr-6 mb-4">
                  <img
                    src="https://placehold.co/400x300/e2e8f0/475569?text=Temperature+Effect"
                    alt="Hot water and cold water dissolving sugar at different rates"
                    className="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700 m-0"
                  />
                </figure>
                <h3 className="text-2xl font-bold mt-0">Temperature</h3>
                <p className="font-semibold mb-1 mt-3">For most solids:</p>
                <ul className="mt-0 mb-3 text-gray-700 dark:text-gray-300">
                  <li>Higher temperature = greater solubility</li>
                </ul>
                <p className="font-semibold mb-1">For gases:</p>
                <ul className="mt-0 mb-4 text-gray-700 dark:text-gray-300">
                  <li>Higher temperature = lower solubility</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <strong>Example:</strong> Hot tea dissolves sugar faster than
                  iced tea.
                </div>
              </div>

              <div className="clearfix">
                <figure className="float-right w-full sm:w-[40%] ml-0 sm:ml-6 mb-4">
                  <img
                    src="https://placehold.co/400x300/e2e8f0/475569?text=Pressure+Effect"
                    alt="Carbon dioxide bubbles escaping from an opened soda bottle"
                    className="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700 m-0"
                  />
                </figure>
                <h3 className="text-2xl font-bold mt-0">Pressure</h3>
                <p>Pressure significantly affects gases.</p>
                <p className="font-semibold mt-4 mb-2">Example</p>
                <p className="text-sm">
                  Carbonated drinks remain fizzy because carbon dioxide is
                  dissolved under high pressure.
                </p>
                <p className="text-sm mb-1 mt-2">When opened:</p>
                <ul className="text-sm mt-0 text-gray-700 dark:text-gray-300">
                  <li>Pressure decreases</li>
                  <li>Gas escapes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mt-0">Surface Area</h3>
                <p>Smaller particles dissolve faster.</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 mt-2 inline-block">
                  <strong>Example:</strong> Powdered sugar dissolves faster than
                  sugar cubes.
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mt-0">Stirring</h3>
                <p>Stirring increases contact between solute and solvent.</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 mt-2 inline-block">
                  <strong>Example:</strong> Coffee dissolves faster when
                  stirred.
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Summary Table</h3>
              <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse m-0">
                  <thead>
                    <tr className="bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100">
                      <th className="p-4 border-b border-gray-200 dark:border-gray-700">
                        Factor
                      </th>
                      <th className="p-4 border-b border-gray-200 dark:border-gray-700">
                        Effect on Dissolving
                      </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        Temperature
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        Usually increases rate
                      </td>
                     </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        Pressure
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        Affects gases greatly
                      </td>
                     </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        Surface Area
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        Smaller particles dissolve faster
                      </td>
                     </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                        Stirring
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        Speeds up dissolution
                      </td>
                     </tr>
                  </tbody>
                 </table>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* Science in Daily Life */}
          <section id="daily-life" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Science in Daily Life
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300 mt-0">
                  Case Study: Sports Drinks
                </h3>
                <p className="text-indigo-900 dark:text-indigo-200 text-sm mt-2 mb-2">
                  Sports drinks contain:
                </p>
                <ul className="text-sm mt-0 mb-3 text-indigo-900 dark:text-indigo-200">
                  <li>Water as solvent</li>
                  <li>Sugars and electrolytes as solutes</li>
                </ul>
                <p className="text-indigo-900 dark:text-indigo-200 text-sm mt-0">
                  Manufacturers carefully control concentration to ensure
                  proper hydration.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/20 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-300 mt-0">
                  Case Study: Ocean Water
                </h3>
                <p className="text-cyan-900 dark:text-cyan-200 text-sm mt-2 mb-2">
                  Seawater contains dissolved:
                </p>
                <ul className="text-sm mt-0 mb-3 text-cyan-900 dark:text-cyan-200">
                  <li>Sodium chloride</li>
                  <li>Magnesium salts</li>
                  <li>Potassium salts</li>
                </ul>
                <p className="text-cyan-900 dark:text-cyan-200 text-sm mt-0">
                  These dissolved substances influence marine ecosystems.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          {/* Chapter Summary & Assessment */}
          <section id="assessment" className="scroll-mt-24">
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-3xl p-8 mb-8 border border-teal-100 dark:border-teal-800/50">
              <h2 className="text-3xl font-bold mt-0 mb-6 text-teal-900 dark:text-teal-100">
                Chapter Summary
              </h2>
              <h3 className="text-xl font-bold text-teal-800 dark:text-teal-200 mt-0 mb-4">
                Key Concepts
              </h3>
              <ul className="space-y-2 text-teal-900 dark:text-teal-100 list-none pl-0 m-0">
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  A solution is a homogeneous mixture.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Solute is dissolved in a solvent.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Concentration describes the amount of solute present.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Concentration may be expressed using percentage or ppm.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Solubility refers to the maximum amount that can dissolve.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Solutions may be unsaturated, saturated, or supersaturated.
                </li>
                <li>
                  <span className="text-teal-600 dark:text-teal-400 mr-2">✔</span>{" "}
                  Temperature, pressure, surface area, and stirring affect
                  dissolving.
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mt-0 mb-6 text-gray-900 dark:text-white">
                End-of-Chapter Assessment
              </h2>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6">
                Multiple Choice
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Which component dissolves another substance?</li>
                <li>Which solution contains the greatest amount of solute?</li>
                <li>What happens when pressure decreases in a carbonated beverage?</li>
                <li>Which factor increases gas solubility?</li>
                <li>What type of solution contains the maximum dissolved solute?</li>
              </ol>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
                Short Response
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Explain the difference between solute and solvent.</li>
                <li>Compare dilute and concentrated solutions.</li>
                <li>Describe a supersaturated solution.</li>
                <li>Explain why stirring speeds up dissolving.</li>
                <li>Discuss how temperature affects solid solubility.</li>
              </ol>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
                Practical Activity
              </h3>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                <h4 className="text-lg font-bold mt-0 mb-4 text-teal-700 dark:text-teal-400">
                  Investigating the Effect of Temperature on Solubility
                </h4>
                <p className="font-semibold mb-2 mt-0">Materials:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-0">
                  <li>3 beakers</li>
                  <li>Water</li>
                  <li>Sugar</li>
                  <li>Thermometer</li>
                  <li>Stirring rod</li>
                </ul>
                <p className="font-semibold mb-2">Procedure:</p>
                <ol className="list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400 mt-0 mb-0">
                  <li>Prepare cold, room-temperature, and hot water samples.</li>
                  <li>Add equal amounts of sugar.</li>
                  <li>Record dissolving times.</li>
                  <li>Compare observations.</li>
                  <li>Draw conclusions regarding temperature and solubility.</li>
                </ol>
              </div>
            </div>
          </section>
        </main>
      </div>

      <SolutionFooter />

      {/* Mobile Floating Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl px-4 py-2 flex gap-3 border border-gray-200 dark:border-gray-700">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              title={section.title}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-teal-600 dark:bg-teal-400 scale-125 shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionsMain;