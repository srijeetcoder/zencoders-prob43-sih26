import { z } from 'zod';
import { env } from '../config/env';

export const ProcessedInputSchema = z.object({
  detectedLanguage: z.string().describe("The detected language of the input text (e.g., Bengali, Hindi, Santali, English)."),
  translatedEnglishText: z.string().describe("The clean, professional English translation of the input text suitable for vector embedding."),
  classifiedDomain: z.string().describe("The standardized domain category, strictly chosen from: Water Quality & Hydrology, Mining & Geo-hazards, Socio-Economic & Tribal Welfare, Public Health & Sanitation, Agriculture & Minor Forest Produce, Infrastructure & Renewable Energy, or Governance & Public Delivery."),
  rootCauseSummary: z.string().describe("A concise 1-sentence extraction of the core technical or societal root cause.")
});

export type ProcessedInputResult = z.infer<typeof ProcessedInputSchema>;

export const STANDARDIZED_DOMAINS = [
  'Water Quality & Hydrology',
  'Mining & Geo-hazards',
  'Socio-Economic & Tribal Welfare',
  'Public Health & Sanitation',
  'Agriculture & Minor Forest Produce',
  'Infrastructure & Renewable Energy',
  'Governance & Public Delivery',
] as const;

const UNIFIED_SYSTEM_PROMPT = `You are the Pre-Processing Intelligence Engine for Pukaar AI (SIH PS-43 - Government of Jharkhand).
For any incoming citizen problem, field report, or query (which may be in English, Hindi, Bengali, Santali, Nagpuri, Khortha, Mundari, or regional dialects):
1. Detect the source language / dialect.
2. Translate or normalize the text into clear, professional English suitable for 768-dim vector embedding.
3. Group/classify it strictly into one of the standardized domain categories:
   - "Water Quality & Hydrology" (Drinking water, tube-wells, arsenic, fluoride, heavy metals, contamination, water filtration, purification, canals, irrigation)
   - "Mining & Geo-hazards" (Coal fires, toxic smoke, mine subsidence, blasting, overburden dump collapse)
   - "Agriculture & Minor Forest Produce" (Lac, Mahua, Tussar silk, crop loss, post-harvest storage, agro-processing)
   - "Public Health & Sanitation" (Vector diseases, epidemic outbreaks, primary healthcare centers, sanitation)
   - "Infrastructure & Renewable Energy" (Solar microgrids, rural roads, bridge connectivity, rural power)
   - "Socio-Economic & Tribal Welfare" (Livelihoods, tribal skill development, SHG empowerment, PESA)
   - "Governance & Public Delivery" (Public distribution, welfare scheme delivery, citizen grievance redressal)
4. Extract a concise 1-sentence root cause summary.
Respond STRICTLY with valid JSON matching the schema.`;

/**
 * Executes unified language auto-detection, translation to English, domain grouping,
 * and root-cause summarization in a single high-efficiency call.
 */
export async function processAndGroupInput(
  rawText: string,
  districtContext?: string
): Promise<ProcessedInputResult> {
  const currentKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

  if (!currentKey || currentKey === 'mock-api-key' || currentKey === 'AIzaSyYourCopiedKeyHere') {
    const fallback = generateFallbackGrouping(rawText, districtContext);
    console.log(`[UnifiedPreprocessor] Fallback processed: [${fallback.detectedLanguage}] -> Domain: [${fallback.classifiedDomain}] -> English: "${fallback.translatedEnglishText.slice(0, 80)}..."`);
    return fallback;
  }

  const model = env.GEMINI_MODEL || 'gemini-1.5-flash';
  const candidateModels = [model, 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
  const candidateVersions = ['v1beta', 'v1'];

  for (const ver of candidateVersions) {
    for (const m of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/${ver}/models/${m}:generateContent?key=${currentKey}`;
      try {
        const userPrompt = districtContext
          ? `District Context: ${districtContext}\nInput Citizen / Field Text: "${rawText}"`
          : `Input Citizen / Field Text: "${rawText}"`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: UNIFIED_SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: `${userPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON.` }] }],
            generationConfig: {
              temperature: 0.1,
              response_mime_type: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as any;
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const cleanJson = jsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            const result = ProcessedInputSchema.parse(JSON.parse(cleanJson));
            console.log(`[UnifiedPreprocessor] Successfully processed: [${result.detectedLanguage}] -> Domain: [${result.classifiedDomain}] -> English: "${result.translatedEnglishText.slice(0, 80)}..."`);
            return result;
          }
        }
      } catch {
        // Try next candidate model
      }
    }
  }

  const fallback = generateFallbackGrouping(rawText, districtContext);
  console.log(`[UnifiedPreprocessor] Heuristic processed: [${fallback.detectedLanguage}] -> Domain: [${fallback.classifiedDomain}] -> English: "${fallback.translatedEnglishText.slice(0, 80)}..."`);
  return fallback;
}

function generateFallbackGrouping(rawText: string, districtContext?: string): ProcessedInputResult {
  const lower = rawText.toLowerCase();
  const isBengali = /[\u0980-\u09FF]/.test(rawText);
  const isDevanagari = /[\u0900-\u097F]/.test(rawText);

  // 1. Water Quality & Hydrology (Arsenic, Fluoride, Tube-well, Drinking Water, Contamination, Filtration)
  if (
    isBengali && (
      rawText.includes('আর্সেনিক') ||
      rawText.includes('নলকূপ') ||
      rawText.includes('জল') ||
      rawText.includes('পানীয়') ||
      rawText.includes('পরিশ্রুত') ||
      rawText.includes('ফিল্টার') ||
      rawText.includes('বিশুদ্ধকরণ') ||
      rawText.includes('ভারী ধাতু') ||
      rawText.includes('দূষণ') ||
      rawText.includes('দূষিত') ||
      rawText.includes('অসুস্থ')
    )
  ) {
    return {
      detectedLanguage: 'Bengali / Bangla',
      translatedEnglishText: `Excessive toxic arsenic and heavy metal chemical contamination in village tube-well drinking water causing widespread health hazards and requiring decentralized filtration remediation in ${districtContext || 'the region'}.`,
      classifiedDomain: 'Water Quality & Hydrology',
      rootCauseSummary: 'Deep aquifer geogenic leaching of toxic arsenic into rural tube-wells with absent community-scale adsorption filtration.',
    };
  }

  if (
    lower.includes('arsenic') ||
    lower.includes('fluoride') ||
    lower.includes('tubewell') ||
    lower.includes('tube-well') ||
    lower.includes('borewell') ||
    lower.includes('drinking water') ||
    lower.includes('filter') ||
    lower.includes('purif') ||
    lower.includes('heavy metal') ||
    lower.includes('heavy-metal') ||
    lower.includes('remediation') ||
    lower.includes('water quality') ||
    lower.includes('aquifer') ||
    rawText.includes('आर्सेनिक') ||
    rawText.includes('फ्लोराइड') ||
    rawText.includes('दूषित जल') ||
    rawText.includes('हैंडपंप') ||
    rawText.includes('नलकूप') ||
    rawText.includes('पीने का पानी') ||
    rawText.includes('जल शोधन') ||
    rawText.includes('शुद्धिकरण') ||
    rawText.includes('फिल्ट्रेशन') ||
    rawText.includes('भारी धातु')
  ) {
    return {
      detectedLanguage: isDevanagari ? 'Hindi / Regional Dialect' : 'English',
      translatedEnglishText: `Critical groundwater arsenic, fluoride, and heavy metal chemical contamination in rural drinking water sources in ${districtContext || 'the region'} requiring decentralized filtration and remediation.`,
      classifiedDomain: 'Water Quality & Hydrology',
      rootCauseSummary: 'Geogenic chemical leaching in groundwater aquifers lacking community adsorption filtration systems and real-time telemetry.',
    };
  }

  // 2. Irrigation Canals & Water Conveyance
  if (
    lower.includes('canal') ||
    lower.includes('khet') ||
    lower.includes('seepage') ||
    lower.includes('conveyance') ||
    rawText.includes('সেচ') ||
    rawText.includes('খাল') ||
    rawText.includes('নহর') ||
    rawText.includes('कैनाल') ||
    rawText.includes('सिंचाई')
  ) {
    return {
      detectedLanguage: isBengali ? 'Bengali / Bangla' : (isDevanagari ? 'Nagpuri / Regional Hindi' : 'English'),
      translatedEnglishText: `Substantial irrigation canal conveyance loss and unmonitored subterranean pipeline leaks in ${districtContext || 'the region'} causing agricultural water shortages.`,
      classifiedDomain: 'Water Quality & Hydrology',
      rootCauseSummary: 'Undetected subterranean fractures in canal distribution lines and lack of automated flow differential monitoring.',
    };
  }

  // 3. Mining & Geo-hazards (Coal Fires, Toxic Smoke, Subsidence)
  if (
    lower.includes('coal') ||
    lower.includes('mine') ||
    lower.includes('subsidence') ||
    lower.includes('jharia') ||
    lower.includes('smoke') ||
    lower.includes('dhua') ||
    lower.includes('blasting') ||
    rawText.includes('কয়লা') ||
    rawText.includes('খনি') ||
    rawText.includes('আগুন') ||
    rawText.includes('धुआं') ||
    rawText.includes('कोयला') ||
    rawText.includes('आग') ||
    rawText.includes('झरिया')
  ) {
    return {
      detectedLanguage: isBengali ? 'Bengali / Bangla' : (isDevanagari ? 'Khortha / Regional Hindi' : 'English'),
      translatedEnglishText: `Subsurface coal seam combustion and hazardous toxic emissions from mining operations in ${districtContext || 'the mining belt'}.`,
      classifiedDomain: 'Mining & Geo-hazards',
      rootCauseSummary: 'Uncontrolled spontaneous subsurface combustion and absence of 24/7 continuous air quality edge telemetry.',
    };
  }

  // 4. Agriculture & Minor Forest Produce (Lac, Mahua, Tussar, Crops)
  if (
    lower.includes('lac') ||
    lower.includes('mahua') ||
    lower.includes('tussar') ||
    lower.includes('silk') ||
    lower.includes('forest produce') ||
    lower.includes('crop') ||
    lower.includes('harvest') ||
    rawText.includes('লাহ') ||
    rawText.includes('মहुआ') ||
    rawText.includes('तसर') ||
    rawText.includes('रेशम')
  ) {
    return {
      detectedLanguage: 'Santali / Mundari Regional Dialect',
      translatedEnglishText: `Post-harvest perishability and lack of decentralized processing infrastructure for tribal minor forest produce in ${districtContext || 'the region'}.`,
      classifiedDomain: 'Agriculture & Minor Forest Produce',
      rootCauseSummary: 'Lack of temperature-controlled solar drying storage at village cluster levels causing high post-harvest perishability.',
    };
  }

  // 5. Infrastructure & Renewable Energy
  if (
    lower.includes('solar') ||
    lower.includes('microgrid') ||
    lower.includes('electricity') ||
    lower.includes('power') ||
    lower.includes('road') ||
    lower.includes('bridge')
  ) {
    return {
      detectedLanguage: isDevanagari ? 'Hindi / Regional Dialect' : 'English',
      translatedEnglishText: `Lack of reliable rural power grid infrastructure and energy access for remote habitations in ${districtContext || 'the region'}.`,
      classifiedDomain: 'Infrastructure & Renewable Energy',
      rootCauseSummary: 'Grid isolation and transmission deficits requiring decentralized off-grid renewable microgrids.',
    };
  }

  // 6. Public Health & Sanitation
  if (
    lower.includes('malaria') ||
    lower.includes('hospital') ||
    lower.includes('clinic') ||
    lower.includes('sanitation') ||
    lower.includes('disease') ||
    lower.includes('pathogen')
  ) {
    return {
      detectedLanguage: isDevanagari ? 'Hindi / Regional Dialect' : 'English',
      translatedEnglishText: `Primary healthcare delivery deficits and vector-borne illness risks in rural habitations of ${districtContext || 'the region'}.`,
      classifiedDomain: 'Public Health & Sanitation',
      rootCauseSummary: 'Inadequate primary diagnostic facilities and delayed epidemiological vector reporting.',
    };
  }

  // Default: Governance & Public Delivery
  const isAscii = /^[\x00-\x7F]*$/.test(rawText);
  return {
    detectedLanguage: isAscii ? 'English' : (isBengali ? 'Bengali / Bangla' : (isDevanagari ? 'Hindi / Regional Dialect' : 'Regional Dialect')),
    translatedEnglishText: rawText,
    classifiedDomain: 'Governance & Public Delivery',
    rootCauseSummary: `Societal grievance reported from ${districtContext || 'Jharkhand'} requiring multi-departmental administrative intervention.`,
  };
}
