import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { env } from '../config/env';
import { ProblemIntelligence, ProblemIntelligenceSchema } from '../schemas/problem.schema';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are the Chief Intelligence Analyst for the Societal Innovation Intelligence Engine (SIH PS-43 - Government of Jharkhand).
Your mission is to execute the "Killer Workflow" for any societal grievance or problem:

Step 1 — Problem DNA:
Identify the 3-5 core technology & societal pillars (e.g., ["Water Management", "Agriculture", "IoT", "Rural Infrastructure"]).

Step 2 — Root Causes:
Conduct root-cause analysis and isolate 2-4 fundamental failure modes.

Step 3 — Candidate Solutions:
Synthesize 2-3 distinct architectural solutions (e.g. Solution A, Solution B, Solution C) and mark the optimal one with isRecommended=true with justification.

Translate any local Jharkhand dialects (Santhali, Mundari, Ho, Khortha, Nagpuri, Hindi) into crisp standard technical English.
`;

export async function analyzeProblemIntelligence(
  rawText: string,
  district: string
): Promise<ProblemIntelligence> {
  if (
    env.NODE_ENV === 'test' ||
    env.OPENAI_API_KEY === 'mock-api-key' ||
    env.OPENAI_API_KEY === 'your-openai-api-key-here' ||
    env.OPENAI_API_KEY === 'mock-api-key-or-replace-with-real'
  ) {
    return generateFallbackIntelligence(rawText, district);
  }

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `District: ${district}\nRaw Citizen Input: "${rawText}"`,
        },
      ],
      response_format: zodResponseFormat(ProblemIntelligenceSchema, 'problem_intelligence'),
      temperature: 0.2,
    });

    const parsed = completion.choices[0]?.message?.parsed;
    if (!parsed) {
      throw new Error('OpenAI returned empty parsed structured output');
    }

    return parsed;
  } catch (error: any) {
    console.warn(`[ProblemIntelligence] OpenAI structured completion failed (${error.message}). Falling back to local analyzer.`);
    return generateFallbackIntelligence(rawText, district);
  }
}

function generateFallbackIntelligence(rawText: string, district: string): ProblemIntelligence {
  const lower = rawText.toLowerCase();

  const isWater = lower.includes('water') || lower.includes('pani') || lower.includes('leak') || lower.includes('irrigation') || lower.includes('fluoride');
  const isMining = lower.includes('coal') || lower.includes('fire') || lower.includes('mine') || lower.includes('smoke') || lower.includes('jharia');

  if (isWater) {
    return {
      problemDNA: ['Water Management', 'Agriculture', 'IoT', 'Rural Infrastructure'],
      translatedProblem: `Rural irrigation and potable water distribution loss in ${district} due to unmonitored pipeline breaches and pressure fluctuations.`,
      detectedDialect: 'Nagpuri / Regional Hindi',
      rootCauses: [
        'Undetected pipe leakage in subterranean canal distribution lines',
        'Lack of continuous real-time pressure and flow rate monitoring',
        'Poor preventive maintenance scheduling across rural blocks',
        'Inefficient flood irrigation practices leading to tail-end water deficit',
      ],
      candidateSolutions: [
        {
          id: 'sol-a',
          title: 'A. Edge IoT Pipe Leakage & Pressure Telemetry',
          description: 'Deploy ultrasonic clamp-on flow meters and pressure transmitters at key manifold junctions with LoRaWAN gateways.',
          isRecommended: false,
          pros: ['Direct sub-minute burst alerts', 'High precision flow tracking'],
          cons: ['Requires physical sensor installation across every pipe segment'],
          recommendationRationale: 'Good for localized pipeline diagnostics but lacks catchment-scale canal tracking.',
        },
        {
          id: 'sol-b',
          title: 'B. Satellite-Based Soil Moisture & Canal Hydrology',
          description: 'Utilize Sentinel-1/2 synthetic aperture radar to detect surface moisture anomalies along canal routes.',
          isRecommended: false,
          pros: ['Zero ground hardware required', 'Covers entire district'],
          cons: ['5-day revisit latency', 'Cloud cover interference during monsoon'],
          recommendationRationale: 'Provides high level overview but insufficient real-time telemetry for immediate valve shutdown.',
        },
        {
          id: 'sol-c',
          title: 'C. Hybrid IoT Sensor Grid + GIS Spatial Dashboard',
          description: 'Combines junction-level IoT flow telemetry with JSAC GIS spatial mapping and automated mobile alerts for local Pani Samiti.',
          isRecommended: true,
          pros: ['Sub-minute leak localization', 'End-to-end operational visibility', 'Direct field dispatch integration'],
          cons: ['Requires initial field calibration'],
          recommendationRationale: 'Optimal balance of granular real-time telemetry and state-level GIS planning (Recommended Solution).',
        },
      ],
      requiredDisciplines: ['Hydrology & Water Resources', 'Embedded IoT Systems', 'GIS & Remote Sensing', 'Agronomy'],
      domainTags: ['Water Security', 'Smart Irrigation', 'IoT Telemetry'],
      severityScore: 8,
      summary: `Critical water conservation and smart irrigation challenge in ${district}.`,
    };
  }

  if (isMining) {
    return {
      problemDNA: ['Mining Geo-hazards', 'Subsurface Combustion', 'Thermal IoT', 'Public Safety'],
      translatedProblem: `Subsurface coal seam spontaneous combustion triggering toxic gas release and subsidence fissures in ${district}.`,
      detectedDialect: 'Khortha / Industrial Hindi',
      rootCauses: [
        'Subsurface coal seam spontaneous heating in legacy unsealed voids',
        'Absence of deep borehole continuous thermal telemetry',
        'Delayed early warning dissemination to neighboring residential bastis',
      ],
      candidateSolutions: [
        {
          id: 'sol-a',
          title: 'A. Periodic UAV Thermal Infrared Inspection',
          description: 'Bi-weekly drone flights to map surface temperature contours.',
          isRecommended: false,
          pros: ['Rapid aerial coverage', 'No ground cabling'],
          cons: ['Cannot predict deep subterranean fire fronts before heat reaches surface'],
          recommendationRationale: 'Surface-only detection is too late for preventive void backfilling.',
        },
        {
          id: 'sol-b',
          title: 'B. Integrated Subterranean DTS Fiber-Optic & Void Nitrogen Foam Injection',
          description: 'Buried distributed temperature sensor strings coupled with automated inert gas barrier pumping.',
          isRecommended: true,
          pros: ['Real-time 24/7 subterranean 3D heat profiling', 'Active suppression capability'],
          cons: ['Higher capital investment'],
          recommendationRationale: 'Highest safety efficacy with proven suppression in Dhanbad coal basin.',
        },
      ],
      requiredDisciplines: ['Mining Engineering', 'Geo-thermal Instrumentation', 'Environmental Safety'],
      domainTags: ['Mining & Geo-hazards', 'Thermal Sensing & IoT', 'Geo-informatics'],
      severityScore: 9,
      summary: `Severe subterranean mine fire and subsidence hazard in ${district}.`,
    };
  }

  return {
    problemDNA: ['Environmental Monitoring', 'Public Infrastructure', 'IoT Telemetry', 'Tribal Welfare'],
    translatedProblem: `Societal infrastructure grievance reported from ${district}: ${rawText.trim()}`,
    detectedDialect: 'Hindi with Regional Expressions',
    rootCauses: [
      'Inadequate continuous telemetry and decentralized field monitoring',
      'Delayed maintenance response and lack of automated grievance escalation',
    ],
    candidateSolutions: [
      {
        id: 'sol-a',
        title: 'A. Decentralized IoT Monitoring Station',
        description: 'Deploy solar-powered sensing pods with wireless alerting.',
        isRecommended: true,
        pros: ['Autonomous 24/7 operation', 'Direct citizen and admin alerts'],
        cons: ['Requires battery maintenance'],
        recommendationRationale: 'Best suited for rapid field deployment in Jharkhand districts.',
      },
    ],
    requiredDisciplines: ['Civil Engineering', 'IoT Systems', 'Data Science'],
    domainTags: ['Public Infrastructure', 'Rural Development'],
    severityScore: 7,
    summary: `Citizen grievance reported from ${district} requiring multidisciplinary engineering intervention.`,
  };
}
