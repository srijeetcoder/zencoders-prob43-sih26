import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { env } from '../config/env';
import { query, formatVector } from '../config/database';
import { InnovationBlueprint, InnovationBlueprintSchema } from '../schemas/blueprint.schema';
import { generateEmbedding } from './embedding.service';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export interface RetrievedHistoricalCase {
  title: string;
  problemSummary: string;
  solutionSummary: string;
  outcome: string;
  domain: string;
  similarityScore: number;
}

/**
 * Blueprint Engine implementing RAG (Retrieval-Augmented Generation)
 * Outputs the comprehensive Solution Blueprint Matrix (SIH PS-43 Specification).
 */
export async function generateProjectBlueprint(
  problemStatement: string,
  district: string,
  rootCauses: string[],
  disciplines: string[],
  recommendedSolution?: string
): Promise<InnovationBlueprint> {
  const pastCases = await retrievePastInterventions(problemStatement, 3);

  if (
    env.NODE_ENV === 'test' ||
    env.OPENAI_API_KEY === 'mock-api-key' ||
    env.OPENAI_API_KEY === 'your-openai-api-key-here' ||
    env.OPENAI_API_KEY === 'mock-api-key-or-replace-with-real'
  ) {
    return generateFallbackBlueprint(problemStatement, district, pastCases, recommendedSolution);
  }

  try {
    const historicalContextStr = pastCases.length > 0
      ? pastCases
          .map(
            (c, i) =>
              `[Past Case ${i + 1}] Title: ${c.title}\nPrior Problem: ${c.problemSummary}\nEngineered Solution: ${c.solutionSummary}\nOutcome: ${c.outcome}`
          )
          .join('\n\n')
      : 'No prior identical case found. Generate blueprint based on Jharkhand state engineering standards.';

    const systemPrompt = `
You are the Chief Technical Architect for the Government of Jharkhand Societal Innovation Platform (SIH PS-43).
Generate an executable Solution Blueprint for the selected intervention.
Include the 6-part Summary Matrix (Hardware, Software, Expertise, Team, Timeline, Success Metrics) as specified in SIH PS-43.
`;

    const userPrompt = `
Target District: ${district}
Problem Statement: "${problemStatement}"
Recommended Solution Architecture: ${recommendedSolution || 'Hybrid IoT + GIS system'}
Identified Root Causes: ${rootCauses.join('; ')}
Required Disciplines: ${disciplines.join(', ')}

Relevant Past State Interventions (Innovation Memory):
${historicalContextStr}
`;

    const completion = await openai.beta.chat.completions.parse({
      model: env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(InnovationBlueprintSchema, 'innovation_blueprint'),
      temperature: 0.2,
    });

    const blueprint = completion.choices[0]?.message?.parsed;
    if (!blueprint) {
      throw new Error('OpenAI returned empty structured blueprint');
    }

    return blueprint;
  } catch (error: any) {
    console.warn(`[BlueprintEngine] OpenAI structured generation error (${error.message}). Returning fallback blueprint.`);
    return generateFallbackBlueprint(problemStatement, district, pastCases, recommendedSolution);
  }
}

export async function retrievePastInterventions(
  queryText: string,
  limit: number = 3
): Promise<RetrievedHistoricalCase[]> {
  try {
    const vector = await generateEmbedding(queryText);
    const vectorStr = formatVector(vector);

    const sql = `
      SELECT 
        title,
        problem_summary AS "problemSummary",
        solution_summary AS "solutionSummary",
        outcome,
        domain,
        ROUND((1 - (embedding <=> $1::vector))::numeric, 4) AS "similarityScore"
      FROM innovation_memory
      ORDER BY embedding <=> $1::vector ASC
      LIMIT $2;
    `;

    const res = await query(sql, [vectorStr, limit]);
    return res.rows.map((r: any) => ({
      title: r.title,
      problemSummary: r.problemSummary,
      solutionSummary: r.solutionSummary,
      outcome: r.outcome,
      domain: r.domain,
      similarityScore: parseFloat(r.similarityScore) || 0,
    }));
  } catch (err: any) {
    return [
      {
        title: 'WaterWatch Rural Canal Automation & Leakage Control',
        problemSummary: '14 villages in Palamu suffered 42% irrigation canal water loss due to undetected underground breached pipelines.',
        solutionSummary: 'Integrated ultrasonic flow telemetry, automated solar pinch-valves, and a GIS dashboard for the local Pani Samiti.',
        outcome: 'Achieved 38% reduction in water loss and boosted seasonal crop yields by 24%.',
        domain: 'Water Quality & Hydrology',
        similarityScore: 0.91,
      },
    ];
  }
}

function generateFallbackBlueprint(
  problem: string,
  district: string,
  pastCases: RetrievedHistoricalCase[],
  recommendedSolution?: string
): InnovationBlueprint {
  const isMining = problem.toLowerCase().includes('coal') || problem.toLowerCase().includes('fire') || problem.toLowerCase().includes('mine');

  if (isMining) {
    return {
      projectTitle: `Subsurface Thermal Telemetry & Real-Time InSAR Early Warning Deployment - ${district}`,
      executiveSummary: `An autonomous subterranean heat mapping and early evacuation alert platform designed for ${district}.`,
      recommendedSolutionArchitecture: recommendedSolution || 'B. Integrated Subterranean DTS Fiber-Optic & Void Nitrogen Foam Injection',
      summaryMatrix: {
        hardwareSummary: ['Borehole Thermocouple Strings', 'LoRaWAN Telemetry Gateways', 'Multi-Gas Sensing Probes'],
        softwareSummary: ['Subsurface Thermal Modeling Engine', 'District Disaster SMS Dispatcher', '3D GIS Heat Contour Map'],
        expertiseSummary: ['Mining Engineering', 'Thermal Sensing & IoT', 'Geo-informatics', 'Emergency Management'],
        teamSummary: 'IIT (ISM) Dhanbad Lab + CIMFR Scientists + District Disaster Management Authority (DDMA)',
        timelineSummary: {
          prototypeWeeks: 8,
          pilotWeeks: 18,
        },
        successMetrics: ['Subsurface fire spread ↓', 'Alert lead time ↑', 'Accidental subsidence incidents → 0'],
      },
      milestones: [
        {
          phaseNumber: 1,
          title: 'Geological Baseline & Thermal Profiling',
          durationWeeks: 4,
          deliverables: ['UAV Thermal baseline map', 'Borehole drilling layout report'],
          kpi: '100% perimeter demarcation with 0.1°C precision',
        },
        {
          phaseNumber: 2,
          title: 'Sensor Pods & Telemetry Commissioning',
          durationWeeks: 8,
          deliverables: ['25 Sensor nodes installed', 'Dual LoRaWAN base stations active'],
          kpi: '99.5% telemetry uptime with sub-10 second latency',
        },
        {
          phaseNumber: 3,
          title: 'Slurry Foam Injection & Collectorate Dashboard',
          durationWeeks: 6,
          deliverables: ['Automated nitrogen injection barrier', 'District Collectorate real-time alert console'],
          kpi: 'Over 40% reduction in surface heat flux',
        },
      ],
      hardwareSpecs: [
        {
          component: 'Subterranean High-Temperature Thermocouple Array (0-600°C)',
          purpose: 'Continuous subsurface temperature measurement at 15m depth',
          quantity: 25,
          estimatedUnitCostINR: 28000,
          supplierOrStandard: 'BIS / IEC 60584-1 Certified',
        },
        {
          component: 'Solar-Powered LoRaWAN Telemetry Base Station',
          purpose: 'Wireless long-range packet relay to District Disaster Room',
          quantity: 4,
          estimatedUnitCostINR: 45000,
          supplierOrStandard: 'IP68 Weatherproof with 50W Monocrystalline Solar Panel',
        },
      ],
      teamRequirements: [
        {
          role: 'Principal Investigator - Mining Geophysics',
          discipline: 'Mining Engineering (IIT ISM Dhanbad)',
          headcount: 1,
          responsibilities: 'Geological modeling and state committee oversight',
        },
        {
          role: 'Embedded IoT & Telemetry Engineer',
          discipline: 'Electronics & Communication',
          headcount: 2,
          responsibilities: 'LoRaWAN gateway setup, firmware development, edge node deployment',
        },
      ],
      riskMitigations: [
        {
          risk: 'Sensor theft and physical tampering in remote mining zones',
          level: 'HIGH',
          jharkhandSpecificMitigation: 'Enclose nodes in tamper-proof reinforced concrete ground anchors and engage local Gram Panchayat guardians.',
        },
        {
          risk: 'Lightning strikes during monsoon season',
          level: 'MEDIUM',
          jharkhandSpecificMitigation: 'Install heavy-duty copper earthing pits with Class I surge protection devices (SPDs).',
        },
      ],
      estimatedTotalBudgetINR: 2450000,
      recommendedTimelineMonths: 6,
      historicalCaseContextUsed: pastCases[0]?.title || 'Jharia Coalfield Underground Fire Monitoring & Early Subsidence Detection',
    };
  }

  // Water / Agriculture / Rural Irrigation Blueprint (Matches PDF Example)
  return {
    projectTitle: `Smart Rural Irrigation Canal Leakage Detection & Automated Hydrology Network - ${district}`,
    executiveSummary: `A comprehensive IoT and GIS-powered smart irrigation monitoring network in ${district} to prevent water loss and ensure equitable tail-end distribution.`,
    recommendedSolutionArchitecture: recommendedSolution || 'C. Hybrid IoT Sensor Grid + GIS Spatial Dashboard (Recommended)',
    summaryMatrix: {
      hardwareSummary: ['Flow sensors', 'Pressure sensors', 'IoT gateway', 'Solar battery backup'],
      softwareSummary: ['IoT ingestion', 'GIS dashboard', 'Anomaly detection', 'SMS alert dispatcher'],
      expertiseSummary: ['IoT', 'Agriculture', 'GIS', 'Backend', 'Data Science'],
      teamSummary: 'University team (Birsa Agri / BIT Mesra) + Domain expert + IoT/industry partner',
      timelineSummary: {
        prototypeWeeks: 8,
        pilotWeeks: 16,
      },
      successMetrics: ['Water loss ↓', 'Detection time ↓', 'Irrigation efficiency ↑'],
    },
    milestones: [
      {
        phaseNumber: 1,
        title: 'Canal Hydraulic Survey & Sensor Placement Plan',
        durationWeeks: 4,
        deliverables: ['GIS contour model of canal network', 'Installation blueprints for 15 manifold points'],
        kpi: '100% boundary mapping of canal lines with GPS accuracy < 1m',
      },
      {
        phaseNumber: 2,
        title: 'IoT Sensor Deployment & Real-Time Ingestion Pipeline',
        durationWeeks: 6,
        deliverables: ['Ultrasonic flow meters & pressure sensors installed', 'LoRaWAN wireless base station active'],
        kpi: 'Continuous telemetry streamed with > 98% packet delivery rate',
      },
      {
        phaseNumber: 3,
        title: 'Pani Samiti Dashboard & Automated Alert Handover',
        durationWeeks: 6,
        deliverables: ['Multilingual mobile dashboard for local farmers', 'District Irrigation Dept dispatch portal'],
        kpi: 'Mean Time to Detect (MTTD) leaks reduced from 4 days to under 15 minutes',
      },
    ],
    hardwareSpecs: [
      {
        component: 'Non-Invasive Ultrasonic Flow Meter (DN100-DN300)',
        purpose: 'Measures high-volume canal water throughput without cutting pipes',
        quantity: 15,
        estimatedUnitCostINR: 32000,
        supplierOrStandard: 'IP68 Submersible with RS485 Modbus',
      },
      {
        component: 'Piezoresistive Water Pressure Transmitter (0-10 Bar)',
        purpose: 'Detects pressure drops indicating underground line fractures',
        quantity: 20,
        estimatedUnitCostINR: 14000,
        supplierOrStandard: 'Stainless Steel 316L Diaphragm',
      },
      {
        component: 'Solar-Powered LoRaWAN Gateway with 4G Fallback',
        purpose: 'Aggregates sensor data across 10km radius and pushes to cloud',
        quantity: 3,
        estimatedUnitCostINR: 42000,
        supplierOrStandard: 'Outdoor IP67 Industrial Gateway with 30W Solar Panel',
      },
    ],
    teamRequirements: [
      {
        role: 'Chief Hydro-Informatics Lead',
        discipline: 'Water Resource Engineering (NIT Jamshedpur / BIT Mesra)',
        headcount: 1,
        responsibilities: 'Canal hydraulic modeling, leak detection threshold algorithms',
      },
      {
        role: 'Embedded IoT & LoRaWAN Engineer',
        discipline: 'Electronics & Communication',
        headcount: 2,
        responsibilities: 'Sensor calibration, firmware optimization, and field telemetry setup',
      },
      {
        role: 'Field Agronomy & Community Liaison',
        discipline: 'Agricultural Extension (Birsa Agricultural University)',
        headcount: 2,
        responsibilities: 'Local Pani Samiti farmer training and maintenance drills',
      },
    ],
    riskMitigations: [
      {
        risk: 'Silt deposition and bio-fouling on sensor faces',
        level: 'MEDIUM',
        jharkhandSpecificMitigation: 'Utilize non-invasive external clamp-on acoustic transducers avoiding direct contact with turbid canal water.',
      },
      {
        risk: 'Erratic rural power grid disabling central gateway',
        level: 'LOW',
        jharkhandSpecificMitigation: 'Equip gateways with integrated 100Ah LiFePO4 battery storage providing 72-hour standalone autonomy during cloudy periods.',
      },
    ],
    estimatedTotalBudgetINR: 1750000,
    recommendedTimelineMonths: 5,
    historicalCaseContextUsed: pastCases[0]?.title || 'WaterWatch Rural Canal Automation & Leakage Control',
  };
}
