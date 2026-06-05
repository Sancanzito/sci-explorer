// src/Simulations/MicrobeRPG/gameData.js
// All data constants for the MicrobeRPG laboratory simulation

export const DISEASES = {
  'strep-throat': {
    name: 'Streptococcal Pharyngitis', pathogen: 'Streptococcus pyogenes', type: 'bacteria',
    symptoms: ['Sore throat', 'Fever', 'Swollen tonsils', 'Painful swallowing'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Erythema, tonsillar exudate', chest: 'Clear', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'cocci', arrangement: 'chains', special: 'beta_hemolysis' },
    correctChecklist: { shape: 'cocci', arrangement: 'chains', stain: 'gram_positive', special: 'none' },
    cultureMedia: 'Blood Agar',
    cultureResult: 'Beta-hemolytic colonies',
    treatment: { drug: 'Amoxicillin', dose: '500mg', frequency: 'TID', days: 10 }
  },
  'uti': {
    name: 'Urinary Tract Infection', pathogen: 'Escherichia coli', type: 'bacteria',
    symptoms: ['Burning urination', 'Frequent urination', 'Lower abdominal pain'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Clear', abdomen: 'Suprapubic tenderness', skin: 'Normal' },
    observations: { gram: 'gram_negative', morphology: 'bacilli', arrangement: 'single', special: 'lactose_fermenter' },
    correctChecklist: { shape: 'bacilli', arrangement: 'single', stain: 'gram_negative', special: 'none' },
    cultureMedia: 'MacConkey Agar',
    cultureResult: 'Pink lactose-fermenting colonies',
    treatment: { drug: 'Ciprofloxacin', dose: '500mg', frequency: 'BID', days: 7 }
  },
  'pneumonia': {
    name: 'Community-Acquired Pneumonia', pathogen: 'Streptococcus pneumoniae', type: 'bacteria',
    symptoms: ['Cough', 'Fever', 'Chest pain', 'Shortness of breath'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Crackles in right lower lobe', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'cocci', arrangement: 'pairs', special: 'capsule' },
    correctChecklist: { shape: 'cocci', arrangement: 'pairs', stain: 'gram_positive', special: 'capsule' },
    cultureMedia: 'Blood Agar',
    cultureResult: 'Alpha-hemolytic (green) colonies',
    treatment: { drug: 'Azithromycin', dose: '500mg', frequency: 'Daily', days: 5 }
  },
  'tuberculosis': {
    name: 'Pulmonary Tuberculosis', pathogen: 'Mycobacterium tuberculosis', type: 'bacteria',
    symptoms: ['Chronic cough', 'Night sweats', 'Weight loss', 'Hemoptysis'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Normal', chest: 'Apical crepitations', abdomen: 'Normal', skin: 'Pale' },
    observations: { gram: 'none', acidFast: 'positive', morphology: 'bacilli', arrangement: 'single', special: 'slow_grower' },
    correctChecklist: { shape: 'bacilli', arrangement: 'single', stain: 'acid_fast', special: 'none' },
    cultureMedia: 'Lowenstein-Jensen',
    cultureResult: 'Buff-colored colonies (slow growth - 4+ weeks)',
    treatment: { drug: 'Rifampin', dose: '600mg', frequency: 'Daily', days: 180 }
  },
  'meningitis': {
    name: 'Bacterial Meningitis', pathogen: 'Neisseria meningitidis', type: 'bacteria',
    symptoms: ['Sudden high fever', 'Stiff neck', 'Severe headache', 'Confusion'],
    physicalExam: { head: 'Nuchal rigidity', eyes: 'Photophobia', throat: 'Normal', chest: 'Clear', abdomen: 'Normal', skin: 'Petechial rash' },
    observations: { gram: 'gram_negative', morphology: 'cocci', arrangement: 'pairs', special: 'intracellular' },
    correctChecklist: { shape: 'cocci', arrangement: 'pairs', stain: 'gram_negative', special: 'capsule' },
    cultureMedia: 'Chocolate Agar',
    cultureResult: 'Gray mucoid colonies',
    treatment: { drug: 'Ceftriaxone', dose: '2g', frequency: 'BID', days: 7 }
  },
  'candidiasis': {
    name: 'Oral Candidiasis (Thrush)', pathogen: 'Candida albicans', type: 'fungi',
    symptoms: ['White patches in mouth', 'Loss of taste', 'Pain while eating'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'White curd-like plaques on tongue/palate', chest: 'Clear', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'gram_positive', morphology: 'yeast', arrangement: 'clusters', special: 'pseudohyphae' },
    correctChecklist: { shape: 'yeast', arrangement: 'clusters', stain: 'gram_positive', special: 'pseudohyphae' },
    cultureMedia: 'Sabouraud Agar',
    cultureResult: 'Cream-colored yeast colonies',
    treatment: { drug: 'Fluconazole', dose: '200mg', frequency: 'Daily', days: 7 }
  },
  'malaria': {
    name: 'Malaria', pathogen: 'Plasmodium falciparum', type: 'protozoa',
    symptoms: ['Cyclic fever', 'Chills', 'Sweats', 'Fatigue'],
    physicalExam: { head: 'Normal', eyes: 'Pallor', throat: 'Normal', chest: 'Clear', abdomen: 'Splenomegaly', skin: 'Jaundice' },
    observations: { gram: 'none', morphology: 'ring_form', arrangement: 'intracellular', special: 'parasitemia' },
    correctChecklist: { shape: 'ring_form', arrangement: 'single', stain: 'none', special: 'ring_forms' },
    cultureMedia: null,
    cultureResult: null,
    expectedParasitemia: 2.5,
    treatment: { drug: 'Artemisinin Combination', dose: 'Standard', frequency: 'BID', days: 3 }
  },
  'covid': {
    name: 'COVID-19', pathogen: 'SARS-CoV-2', type: 'virus',
    symptoms: ['Fever', 'Dry cough', 'Anosmia', 'Fatigue'],
    physicalExam: { head: 'Normal', eyes: 'Normal', throat: 'Mild erythema', chest: 'Bilateral diffuse wheezing', abdomen: 'Normal', skin: 'Normal' },
    observations: { gram: 'none', morphology: 'none', arrangement: 'none', special: 'none' },
    correctChecklist: { shape: 'none', arrangement: 'none', stain: 'none', special: 'none' },
    cultureMedia: null,
    cultureResult: null,
    treatment: { drug: 'Supportive Care', dose: 'N/A', frequency: 'PRN', days: 14 }
  }
};

export const MEDICATION_INVENTORY = {
  'Amoxicillin': { class: 'Penicillin', doseRange: ['250mg', '500mg', '1g'], freqRange: ['BID', 'TID'], category: 'antibiotic' },
  'Penicillin': { class: 'Penicillin', doseRange: ['250mg', '500mg', '1g'], freqRange: ['BID', 'QID'], category: 'antibiotic' },
  'Ciprofloxacin': { class: 'Fluoroquinolone', doseRange: ['250mg', '500mg'], freqRange: ['BID'], category: 'antibiotic' },
  'Azithromycin': { class: 'Macrolide', doseRange: ['250mg', '500mg'], freqRange: ['Daily'], category: 'antibiotic' },
  'Ceftriaxone': { class: 'Cephalosporin', doseRange: ['1g', '2g'], freqRange: ['Daily', 'BID'], category: 'antibiotic' },
  'Rifampin': { class: 'Antimycobacterial', doseRange: ['300mg', '600mg'], freqRange: ['Daily'], category: 'antibiotic' },
  'Isoniazid': { class: 'Antimycobacterial', doseRange: ['300mg', '5mg/kg'], freqRange: ['Daily'], category: 'antibiotic' },
  'Pyrazinamide': { class: 'Antimycobacterial', doseRange: ['500mg', '1g'], freqRange: ['Daily'], category: 'antibiotic' },
  'Ethambutol': { class: 'Antimycobacterial', doseRange: ['400mg', '800mg'], freqRange: ['Daily'], category: 'antibiotic' },
  'Fluconazole': { class: 'Antifungal', doseRange: ['100mg', '200mg', '400mg'], freqRange: ['Daily'], category: 'antifungal' },
  'Nystatin': { class: 'Antifungal', doseRange: ['100kU', '500kU'], freqRange: ['QID'], category: 'antifungal' },
  'Artemisinin Combination': { class: 'Antimalarial', doseRange: ['Standard'], freqRange: ['BID'], category: 'antimalarial' },
  'Supportive Care': { class: 'General', doseRange: ['N/A'], freqRange: ['PRN'], category: 'supportive' },
  'Ibuprofen': { class: 'NSAID', doseRange: ['200mg', '400mg', '600mg'], freqRange: ['QID', 'PRN'], category: 'supportive' }
};

export const DURATIONS = [3, 5, 7, 10, 14, 21, 28, 180];

export const ORGANISM_TRAITS = {
  'Streptococcus pyogenes': {
    morphology: { cocci: 5, bacilli: -5, diplococci: 2, yeast: -5 },
    arrangement: { chains: 5, pairs: 1, clusters: -2, single: -3 },
    stain: { gram_positive: 5, gram_negative: -5, acid_fast: -5 },
    special: { budding: -5, pseudohyphae: -5, capsule: 1, ring_forms: -5, spores: -5 }
  },
  'Escherichia coli': {
    morphology: { bacilli: 5, cocci: -5, diplococci: -3, yeast: -5 },
    arrangement: { single: 3, chains: -3, pairs: -1, clusters: -3 },
    stain: { gram_negative: 5, gram_positive: -5, acid_fast: -5 },
    special: { budding: -5, pseudohyphae: -5, capsule: 1, ring_forms: -5, spores: -5 }
  },
  'Streptococcus pneumoniae': {
    morphology: { cocci: 5, bacilli: -5, diplococci: 5, yeast: -5 },
    arrangement: { pairs: 5, chains: 2, clusters: -2, single: -1 },
    stain: { gram_positive: 5, gram_negative: -5, acid_fast: -5 },
    special: { capsule: 5, budding: -5, pseudohyphae: -5, ring_forms: -5, spores: -5 }
  },
  'Mycobacterium tuberculosis': {
    morphology: { bacilli: 3, cocci: -3, diplococci: -3, yeast: -5 },
    arrangement: { single: 2, chains: -2, pairs: -1, clusters: -3 },
    stain: { acid_fast: 10, gram_negative: -5, gram_positive: -5 },
    special: { spores: 1, capsule: -2, budding: -5, pseudohyphae: -5, ring_forms: -5 }
  },
  'Neisseria meningitidis': {
    morphology: { cocci: 5, bacilli: -5, diplococci: 5, yeast: -5 },
    arrangement: { pairs: 5, chains: -3, clusters: 2, single: -1 },
    stain: { gram_negative: 5, gram_positive: -5, acid_fast: -5 },
    special: { capsule: 3, budding: -5, pseudohyphae: -5, ring_forms: -5, spores: -5 }
  },
  'Candida albicans': {
    morphology: { yeast: 10, cocci: -3, bacilli: -3, diplococci: -3 },
    arrangement: { clusters: 5, chains: 2, pairs: -2, single: 1 },
    stain: { gram_positive: 3, gram_negative: -3, acid_fast: -3 },
    special: { budding: 5, pseudohyphae: 5, capsule: -2, ring_forms: -5, spores: 1 }
  },
  'Plasmodium falciparum': {
    morphology: { ring_form: 10, cocci: -3, bacilli: -3, yeast: -3, diplococci: -3 },
    arrangement: { single: 2, chains: -3, pairs: -2, clusters: -3 },
    stain: { gram_positive: -3, gram_negative: -3, acid_fast: -3 },
    special: { ring_forms: 10, parasitemia: 10, budding: -5, pseudohyphae: -5, capsule: -3, spores: -3 }
  }
};

export const MEDIA_OPTIONS = [
  { id: 'Blood Agar', color: 0xcc3333, label: 'Blood Agar', description: 'Enriched for fastidious organisms' },
  { id: 'MacConkey Agar', color: 0xff88aa, label: 'MacConkey Agar', description: 'Selective for Gram-negative' },
  { id: 'Chocolate Agar', color: 0x8b4513, label: 'Chocolate Agar', description: 'Enriched for Neisseria/Haemophilus' },
  { id: 'Sabouraud Agar', color: 0xfff8dc, label: 'Sabouraud Agar', description: 'Selective for fungi' }
];

export const CORRECT_MEDIA_MAP = {
  'Streptococcus pyogenes': 'Blood Agar',
  'Escherichia coli': 'MacConkey Agar',
  'Streptococcus pneumoniae': 'Blood Agar',
  'Neisseria meningitidis': 'Chocolate Agar',
  'Candida albicans': 'Sabouraud Agar',
  'Mycobacterium tuberculosis': null,
  'Plasmodium falciparum': null,
  'SARS-CoV-2': null
};

export const COLONY_APPEARANCES = {
  'Streptococcus pyogenes': { color: 0xeeeeee, hemolysis: 'beta', description: 'Small gray colonies with clear beta-hemolysis zone' },
  'Escherichia coli': { color: 0xff69b4, hemolysis: 'none', description: 'Pink lactose-fermenting colonies on MacConkey' },
  'Streptococcus pneumoniae': { color: 0xcccccc, hemolysis: 'alpha', description: 'Small greenish alpha-hemolytic colonies' },
  'Neisseria meningitidis': { color: 0xaaaaaa, hemolysis: 'none', description: 'Gray mucoid colonies on Chocolate agar' },
  'Candida albicans': { color: 0xfffacd, hemolysis: 'none', description: 'Cream-colored yeast colonies' }
};

export const STAIN_STEPS = {
  gram: [
    { name: 'Crystal Violet', color: 0x6a0dad, duration: 60, description: 'Primary stain - all cells turn purple' },
    { name: 'Gram\'s Iodine', color: 0x3d0c02, duration: 60, description: 'Mordant - fixes crystal violet' },
    { name: 'Alcohol Decolorizer', color: 0xeeeeee, duration: 15, description: 'Decolorizes Gram-negative cells' },
    { name: 'Safranin', color: 0xff1493, duration: 30, description: 'Counterstain - Gram-negative turn pink' }
  ],
  acidFast: [
    { name: 'Carbol Fuchsin', color: 0xff0000, duration: 60, description: 'Primary stain with phenol' },
    { name: 'Heat Fixation', color: 0xcc0000, duration: 120, description: 'Drives stain into cell wall' },
    { name: 'Acid Alcohol', color: 0xdddddd, duration: 20, description: 'Decolorizes non-acid-fast cells' },
    { name: 'Methylene Blue', color: 0x0000cc, duration: 30, description: 'Counterstain - background turns blue' }
  ]
};

export const ACHIEVEMENTS = {
  first_diagnosis: { name: 'First Diagnosis', description: 'Correctly diagnose your first patient', icon: '🎯' },
  perfect_treatment: { name: 'Perfect Prescription', description: 'Administer a perfectly matched treatment', icon: '💊' },
  microscope_master: { name: 'Microscope Master', description: 'Complete 5 microscopy examinations', icon: '🔬' },
  stain_expert: { name: 'Stain Expert', description: 'Perform Gram stain without procedural errors', icon: '🧪' },
  parasite_hunter: { name: 'Parasite Hunter', description: 'Find infected RBCs in a blood smear', icon: '🦟' },
  culture_guru: { name: 'Culture Guru', description: 'Select the correct culture media for an organism', icon: '🧫' },
  triple_crown: { name: 'Triple Crown', description: 'Correctly diagnose 3 consecutive patients', icon: '👑' },
  epidemiologist: { name: 'Epidemiologist', description: 'Complete 10 cases', icon: '📊' },
  tb_specialist: { name: 'TB Specialist', description: 'Correctly diagnose and treat tuberculosis', icon: '🫁' },
  full_workup: { name: 'Full Workup', description: 'Perform all lab tests on a single patient', icon: '📋' }
};

export const DIAGNOSTIC_ACCURACY_THRESHOLDS = {
  excellent: 90,
  good: 70,
  fair: 50,
  poor: 0
};

// Drug class cross-matching for partial credit
export const DRUG_CLASS_MATCHING = {
  'Penicillin': { sameClass: ['Amoxicillin', 'Penicillin'], similar: ['Cephalosporin', 'Macrolide'] },
  'Cephalosporin': { sameClass: ['Ceftriaxone'], similar: ['Penicillin'] },
  'Macrolide': { sameClass: ['Azithromycin'], similar: ['Penicillin', 'Cephalosporin'] },
  'Fluoroquinolone': { sameClass: ['Ciprofloxacin'], similar: ['Macrolide', 'Cephalosporin'] },
  'Antimycobacterial': { sameClass: ['Rifampin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'], similar: ['Macrolide'] },
  'Antifungal': { sameClass: ['Fluconazole', 'Nystatin'], similar: [] },
  'Antimalarial': { sameClass: ['Artemisinin Combination'], similar: [] },
  'General': { sameClass: ['Supportive Care'], similar: [] },
  'NSAID': { sameClass: ['Ibuprofen'], similar: [] }
};