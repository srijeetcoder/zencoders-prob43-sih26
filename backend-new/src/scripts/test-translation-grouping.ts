import { processAndGroupInput } from '../services/translationAndGrouping.service';
import { generateProjectBlueprint } from '../services/blueprint.service';
import { onnxMasterOrchestrator } from '../services/onnxOrchestrator.service';

async function runVerification() {
  console.log('================================================================');
  console.log('🧪 PUKAAR AI - MASTER TRANSLATION & THEMATIC GROUPING TEST SUITE');
  console.log('================================================================\n');

  // Test Case 1: Bengali Arsenic Tube-well Input
  const bengaliInput = 'গ্রামের নলকূপের জলে অতিরিক্ত মাত্রায় আর্সেনিক ও ভারী ধাতু পাওয়া গেছে, যার ফলে গ্রামবাসীরা অসুস্থ হয়ে পড়ছে এবং পরিস্রুত পানীয় জলের তীব্র সংকট দেখা দিয়েছে।';
  console.log('--- TEST 1: Bengali Arsenic Contamination ---');
  console.log('Raw Input:', bengaliInput);

  const bengaliResult = await processAndGroupInput(bengaliInput, 'Sahebganj');
  console.log('Detected Language:', bengaliResult.detectedLanguage);
  console.log('Classified Domain:', bengaliResult.classifiedDomain);
  console.log('Root Cause Summary:', bengaliResult.rootCauseSummary);
  console.log('Translated English:', bengaliResult.translatedEnglishText);

  // Assertions
  if (!bengaliResult.detectedLanguage.toLowerCase().includes('bengali') && !bengaliResult.detectedLanguage.toLowerCase().includes('bangla')) {
    throw new Error(`Expected Bengali language detection, got: ${bengaliResult.detectedLanguage}`);
  }
  if (bengaliResult.classifiedDomain !== 'Water Quality & Hydrology') {
    throw new Error(`Expected 'Water Quality & Hydrology', got: ${bengaliResult.classifiedDomain}`);
  }

  // Check Master ONNX Routing with Clean English
  const onnxResult = await onnxMasterOrchestrator.routeProblem(bengaliResult.translatedEnglishText, 'Sahebganj');
  console.log('ONNX Routing Priority:', onnxResult.priority);
  console.log('ONNX Routing Domain:', onnxResult.domain);

  // Check Solution Blueprint Generation (Strict Semantic Alignment)
  const blueprint = await generateProjectBlueprint(
    bengaliResult.translatedEnglishText,
    'Sahebganj',
    [bengaliResult.rootCauseSummary],
    ['Chemical Engineering', 'Public Health'],
    'Solar Adsorption Filtration Kiosk',
    bengaliResult.classifiedDomain,
    'Filtration and arsenic removal'
  );

  console.log('\n[Blueprint Verification]');
  console.log('Project Title:', blueprint.projectTitle);
  console.log('Recommended Solution:', blueprint.recommendedSolutionArchitecture);
  console.log('Hardware Components:', blueprint.summaryMatrix?.hardwareSummary?.join(', '));

  // Anti-hallucination validation: Barred components check
  const blueprintStr = JSON.stringify(blueprint).toLowerCase();
  if (blueprintStr.includes('canal flow meter') || blueprintStr.includes('ultrasonic leak') || blueprintStr.includes('mine slurry barrier')) {
    throw new Error('❌ Hallucination detected! Blueprint contains barred canal / mining components for water contamination!');
  }

  if (!blueprintStr.includes('adsorption') && !blueprintStr.includes('filtration') && !blueprintStr.includes('arsenic') && !blueprintStr.includes('purification')) {
    throw new Error('❌ Domain mismatch! Blueprint failed to recommend water purification / filtration systems!');
  }

  console.log('\n✅ TEST 1 PASSED: Bengali Arsenic input successfully translated, classified as Water Quality & Hydrology, and generated strict filtration blueprint without hallucinations!\n');

  // Test Case 2: Hindi Handpump Contamination
  console.log('--- TEST 2: Hindi Handpump Fluoride Contamination ---');
  const hindiInput = 'गांव के हैंडपंप में फ्लोराइड और दूषित जल आ रहा है जिससे बच्चों में बीमारी फैल रही है। तुरंत जल शोधन और फिल्ट्रेशन की आवश्यकता है।';
  const hindiResult = await processAndGroupInput(hindiInput, 'Palamu');
  console.log('Detected Language:', hindiResult.detectedLanguage);
  console.log('Classified Domain:', hindiResult.classifiedDomain);
  console.log('Translated English:', hindiResult.translatedEnglishText);

  if (hindiResult.classifiedDomain !== 'Water Quality & Hydrology') {
    throw new Error(`Expected 'Water Quality & Hydrology', got: ${hindiResult.classifiedDomain}`);
  }
  console.log('✅ TEST 2 PASSED: Hindi water contamination correctly grouped into Water Quality & Hydrology!\n');

  // Test Case 3: Coal Mine Toxic Smoke & Fire
  console.log('--- TEST 3: Coalfield Toxic Smoke & Combustion ---');
  const coalInput = 'কয়লা খনি থেকে বিষাক্ত ধোঁয়া ও ভূগর্ভস্থ আগুন জনবসতিতে ছড়িয়ে পড়ছে।';
  const coalResult = await processAndGroupInput(coalInput, 'Dhanbad');
  console.log('Detected Language:', coalResult.detectedLanguage);
  console.log('Classified Domain:', coalResult.classifiedDomain);
  console.log('Translated English:', coalResult.translatedEnglishText);

  if (coalResult.classifiedDomain !== 'Mining & Geo-hazards') {
    throw new Error(`Expected 'Mining & Geo-hazards', got: ${coalResult.classifiedDomain}`);
  }
  console.log('✅ TEST 3 PASSED: Mining fire correctly grouped into Mining & Geo-hazards!\n');

  console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
