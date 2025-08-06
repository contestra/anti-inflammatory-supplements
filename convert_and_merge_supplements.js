// Script to convert TypeScript supplements data to JavaScript format
// and merge with additional supplements to create 100 unique entries

// Read the existing 55 supplements from the TypeScript file
// Note: You'll need to manually copy the supplement data here or use Node.js fs to read the file

// For now, I'll create the structure for the final merged data
const convertToJavaScriptFormat = (supplement) => {
  // Convert TypeScript format to match existing JavaScript format
  return {
    id: supplement.id,
    name: supplement.name,
    category: mapCategory(supplement.category),
    description: supplement.description,
    antiInflammatoryPotential: supplement.antiInflammatoryPotential || supplement.antiInflammatoryScore,
    evidence: {
      score: (supplement.evidenceScore || 0) * 10, // Convert to 0-100 scale
      studies: supplement.evidenceBreakdown?.studyCount || 0
    },
    recommendedDose: supplement.optimalDose,
    timing: mapTiming(supplement.timing),
    forms: extractForms(supplement),
    benefits: extractBenefits(supplement),
    sideEffects: extractSideEffects(supplement),
    interactions: extractInteractions(supplement),
    costPerDay: extractCost(supplement.price),
    pillsPerDay: estimatePillsPerDay(supplement.optimalDose),
    safetyScore: estimateSafetyScore(supplement),
    evidenceBreakdown: supplement.evidenceBreakdown
  };
};

const mapCategory = (category) => {
  const categoryMap = {
    'fatty_acids': 'Omega-3',
    'herbs': 'Herbs',
    'antioxidants': 'Antioxidants',
    'vitamins': 'Vitamins',
    'minerals': 'Minerals',
    'adaptogens': 'Adaptogens',
    'amino_acids': 'Amino Acids',
    'probiotics': 'Probiotics',
    'enzymes': 'Enzymes',
    'mushrooms': 'Mushrooms',
    'superfoods': 'Other',
    'hormones': 'Other',
    'marine': 'Other',
    'proteins': 'Amino Acids',
    'peptides': 'Other',
    'postbiotics': 'Probiotics'
  };
  return categoryMap[category] || 'Other';
};

const mapTiming = (timing) => {
  const timingMap = {
    'with_meals': 'With meals',
    'empty_stomach': 'Empty stomach (30 min before meals)',
    'morning': 'Morning',
    'evening': 'Evening',
    'before_bed': 'Before bed',
    'anytime': 'Any time'
  };
  return timingMap[timing] || 'With meals';
};

const extractForms = (supplement) => {
  // Extract forms from bioavailability or description
  const forms = [];
  if (supplement.bioavailability?.includes('extract')) forms.push('Standardized extract');
  if (supplement.bioavailability?.includes('oil')) forms.push('Oil');
  if (supplement.bioavailability?.includes('powder')) forms.push('Powder');
  if (supplement.bioavailability?.includes('capsule')) forms.push('Capsules');
  if (supplement.name?.includes('Oil')) forms.push('Oil', 'Softgels');
  if (forms.length === 0) forms.push('Capsules', 'Powder');
  return forms;
};

const extractBenefits = (supplement) => {
  const benefits = [];
  
  // Extract from mechanisms
  if (supplement.mechanisms) {
    supplement.mechanisms.forEach(mechanism => {
      if (mechanism.includes('NF-κB')) benefits.push('Reduces NF-κB activation');
      if (mechanism.includes('COX')) benefits.push('Inhibits COX enzymes');
      if (mechanism.includes('antioxidant')) benefits.push('Powerful antioxidant');
      if (mechanism.includes('immune')) benefits.push('Modulates immune response');
    });
  }
  
  // Add effect size benefit
  if (supplement.evidenceBreakdown?.effectSize) {
    const effect = supplement.evidenceBreakdown.effectSize;
    if (effect.includes('CRP')) benefits.push('Reduces CRP levels');
    if (effect.includes('IL-6')) benefits.push('Lowers IL-6');
    if (effect.includes('TNF')) benefits.push('Reduces TNF-alpha');
    if (effect.includes('ESR')) benefits.push('Lowers ESR');
  }
  
  // Ensure at least 3 benefits
  if (benefits.length < 3) {
    benefits.push('Anti-inflammatory effects');
    benefits.push('Supports overall health');
    benefits.push('Evidence-based supplement');
  }
  
  return benefits.slice(0, 5); // Return max 5 benefits
};

const extractSideEffects = (supplement) => {
  const sideEffects = [];
  
  if (supplement.evidenceBreakdown?.safety) {
    const safety = supplement.evidenceBreakdown.safety.toLowerCase();
    if (safety.includes('gi') || safety.includes('stomach')) {
      sideEffects.push('May cause mild GI upset');
    }
    if (safety.includes('blood thin') || safety.includes('anticoag')) {
      sideEffects.push('May interact with blood thinners');
    }
    if (safety.includes('drowsy') || safety.includes('sedat')) {
      sideEffects.push('May cause drowsiness');
    }
    if (safety.includes('blood sugar')) {
      sideEffects.push('May affect blood sugar levels');
    }
  }
  
  if (sideEffects.length === 0 && supplement.evidenceBreakdown?.safety?.includes('safe')) {
    sideEffects.push('Generally well tolerated');
  }
  
  return sideEffects;
};

const extractInteractions = (supplement) => {
  const interactions = [];
  
  if (supplement.evidenceBreakdown?.safety) {
    const safety = supplement.evidenceBreakdown.safety.toLowerCase();
    if (safety.includes('anticoag') || safety.includes('blood thin')) {
      interactions.push('Blood thinning medications');
    }
    if (safety.includes('statin')) {
      interactions.push('Statin medications');
    }
    if (safety.includes('blood sugar') || safety.includes('diabet')) {
      interactions.push('Diabetes medications');
    }
    if (safety.includes('immune')) {
      interactions.push('Immunosuppressive drugs');
    }
  }
  
  return interactions;
};

const extractCost = (priceRange) => {
  if (!priceRange) return 1.00;
  // Extract numbers from price range like "$25-45"
  const matches = priceRange.match(/\d+/g);
  if (matches && matches.length >= 2) {
    const avg = (parseInt(matches[0]) + parseInt(matches[1])) / 2;
    return avg / 30; // Convert monthly cost to daily
  }
  return 1.00;
};

const estimatePillsPerDay = (dose) => {
  if (!dose) return 2;
  
  // Look for numbers in dose string
  const matches = dose.match(/\d+/g);
  if (matches) {
    // Check if it mentions tablets, capsules, or pills
    if (dose.includes('tablet') || dose.includes('capsule') || dose.includes('pill')) {
      const count = parseInt(matches[0]);
      if (dose.includes('3x') || dose.includes('three times')) return count * 3;
      if (dose.includes('2x') || dose.includes('twice')) return count * 2;
      return count;
    }
    // For mg doses, estimate based on typical pill sizes
    const mg = parseInt(matches[0]);
    if (mg <= 500) return 1;
    if (mg <= 1000) return 2;
    if (mg <= 2000) return 3;
    return 4;
  }
  return 2;
};

const estimateSafetyScore = (supplement) => {
  if (!supplement.evidenceBreakdown?.safety) return 8;
  
  const safety = supplement.evidenceBreakdown.safety.toLowerCase();
  if (safety.includes('very safe') || safety.includes('excellent')) return 10;
  if (safety.includes('generally safe')) return 9;
  if (safety.includes('safe')) return 8;
  if (safety.includes('caution') || safety.includes('monitor')) return 7;
  if (safety.includes('risk')) return 6;
  return 8;
};

// Export the converter function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { convertToJavaScriptFormat };
}

console.log('Converter functions ready. Use convertToJavaScriptFormat() to convert each supplement.');