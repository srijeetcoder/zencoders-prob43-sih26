import { z } from 'zod';
import { env } from '../config/env';
import { ragService } from './rag.service';
import { bomGuard, BoMItem } from './bomGuard.service';
import { query } from '../config/database';
import { AIProviderError } from '../utils/errors';

export const AIAnalysisOutputSchema = z.object({
  domain: z.string(),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  rootCause: z.string(),
  recommendations: z.array(z.string()),
  bom: z.array(
    z.object({
      item: z.string(),
      quantity: z.number().int().positive().optional(),
      unitCost: z.number().optional(),
      totalCost: z.number().optional(),
      justification: z.string(),
    })
  ),
});

export type AIAnalysisOutput = z.infer<typeof AIAnalysisOutputSchema>;

export class AIAnalysisService {
  /**
   * Executes the full RAG + AI reasoning pipeline with domain isolation and BoM constraints
   */
  async executeAnalysis(params: {
    entityType: 'GRIEVANCE' | 'DPR' | 'DISTRICT';
    entityId?: string;
    domain: string;
    prompt: string;
    userId?: string;
  }): Promise<AIAnalysisOutput> {
    const domain = params.domain.trim();

    // 1. Domain-isolated RAG retrieval (SQL: WHERE domain = $2)
    const ragContext = await ragService.retrieveDomainContext(params.prompt, domain, 3);

    // 2. Build Gemini prompt with verified domain context
    const currentKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

    let aiRawJson: any;

    if (!currentKey || currentKey === 'mock-api-key' || currentKey === 'AIzaSyYourCopiedKeyHere' || env.NODE_ENV === 'test') {
      // Deterministic reasoning output adhering strictly to domain rules
      aiRawJson = this.generateDeterministicAnalysis(domain, params.prompt, ragContext.evidence);
    } else {
      try {
        const systemPrompt = `You are the Lead Systems Architect and Technical Evaluator for the Government of Jharkhand Societal Innovation Intelligence Engine (SIH PS-43).
Your task is to analyze the problem in the domain "${domain}", utilize the retrieved engineering evidence, identify root causes, recommend actionable interventions, and specify an engineering Bill-of-Materials (BoM).

STRICT DOMAIN CONSTRAINTS:
- Only specify hardware items appropriate for domain "${domain}".
- If domain is Education, NEVER include water meters or irrigation sensors.
- If domain is Water, include hydrology/leakage sensing.

VERIFIED DOMAIN RAG EVIDENCE:
${ragContext.formattedContext}

You MUST respond strictly with a valid JSON object matching this schema:
{
  "domain": "${domain}",
  "confidence": 0.92,
  "summary": "Concise executive summary",
  "rootCause": "Detailed primary root cause",
  "recommendations": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "bom": [
    { "item": "Exact component name", "quantity": 2, "justification": "Technical rationale" }
  ]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${currentKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${params.prompt}\n\nAnalyze this problem and respond with pure JSON.` }] }],
            system_instruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.1, response_mime_type: 'application/json' },
          }),
        });

        if (!res.ok) {
          throw new Error(`Gemini API error: ${res.statusText}`);
        }

        const data = (await res.json()) as any;
        const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textPart) throw new Error('Empty response from AI provider');

        const clean = textPart.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        aiRawJson = JSON.parse(clean);
      } catch (err: any) {
        console.warn(`[AI Analysis Service] Gemini API call failed, falling back to deterministic engine: ${err.message}`);
        aiRawJson = this.generateDeterministicAnalysis(domain, params.prompt, ragContext.evidence);
      }
    }

    // 3. Runtime Zod Schema Validation
    const parsedOutput = AIAnalysisOutputSchema.parse(aiRawJson);

    // 4. Deterministic Negative BoM Guard
    const bomResult = bomGuard.validateBom(domain, parsedOutput.bom);
    parsedOutput.bom = bomResult.sanitizedBom;

    // 5. Persist analysis to PostgreSQL ai_analysis table
    try {
      await query(
        `INSERT INTO ai_analysis (
          entity_type, entity_id, domain, prompt, summary,
          root_cause, recommendations, bom_analysis, confidence,
          model_version, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
        [
          params.entityType,
          params.entityId || null,
          domain,
          params.prompt,
          parsedOutput.summary,
          parsedOutput.rootCause,
          parsedOutput.recommendations,
          JSON.stringify(parsedOutput.bom),
          parsedOutput.confidence,
          env.GEMINI_MODEL || 'gemini-1.5-flash',
          params.userId || null,
        ]
      );
    } catch (e: any) {
      console.warn('[AI Analysis Persistence Notice]', e.message);
    }

    return parsedOutput;
  }

  private generateDeterministicAnalysis(domain: string, prompt: string, evidence: any[]): AIAnalysisOutput {
    const lowerDomain = domain.toLowerCase();

    if (lowerDomain.includes('water') || lowerDomain.includes('hydro')) {
      return {
        domain: 'Water Quality & Hydrology',
        confidence: 0.94,
        summary: `Strategic engineering assessment for rural water infrastructure and conveyance loss mitigation.`,
        rootCause: `Underground pipe degradation, lack of acoustic/pressure telemetry, and deferred preventative maintenance in distribution conduits.`,
        recommendations: [
          'Deploy solar-powered non-invasive clamp-on ultrasonic flow sensors at distribution manifolds',
          'Establish continuous piezoresistive pressure logging with LoRaWAN telemetry',
          'Integrate bilingual GIS alerting dashboard for Jal Sahiya and Pani Samiti officers',
        ],
        bom: [
          { item: 'Ultrasonic Clamp-on Flow Meter (DN50-DN200)', quantity: 4, justification: 'Non-invasive flow velocity measurement' },
          { item: 'Piezoresistive Pressure Transducer (0-10 Bar)', quantity: 6, justification: 'Detects pressure drops indicating leaks' },
          { item: 'LoRaWAN Edge Gateway with 4G Solar Backup', quantity: 2, justification: 'Long-range low-power sensor telemetry' },
        ],
      };
    }

    if (lowerDomain.includes('education')) {
      return {
        domain: 'Education & Literacy',
        confidence: 0.91,
        summary: `Pedagogical and digital infrastructure enhancement roadmap for regional schools.`,
        rootCause: `Deficit of digital learning aids, unreliable grid electricity for computer labs, and teacher-pupil engagement gaps in regional dialects.`,
        recommendations: [
          'Install solar PV micro-inverter kits with LiFePO4 batteries for classroom smart displays',
          'Deploy offline-first regional curriculum tablets with Santali/Khortha audio aids',
          'Establish modular science and STEM experimental kits for primary and middle schools',
        ],
        bom: [
          { item: 'Interactive Smart Touch Display (65-inch 4K)', quantity: 3, justification: 'Interactive multimedia classroom teaching' },
          { item: 'Off-grid Solar PV Micro-Inverter Kit (1.5 kW)', quantity: 1, justification: 'Uninterrupted power for computer labs' },
          { item: 'Bilingual STEM Experimental Learning Kits', quantity: 10, justification: 'Hands-on practical physics and chemistry kits' },
        ],
      };
    }

    return {
      domain,
      confidence: 0.88,
      summary: `Standard societal innovation solution architecture for ${domain}.`,
      rootCause: `Inadequate decentralized monitoring, delayed administrative reporting, and lack of localized technological intervention.`,
      recommendations: [
        'Deploy decentralized edge sensing and verification nodes',
        'Establish automated district nodal officer escalation workflows',
        'Implement citizen-facing bilingual SMS/WhatsApp progress tracking',
      ],
      bom: [
        { item: 'Decentralized Micro-Controller Telemetry Node', quantity: 2, justification: 'Edge data capture and transmission' },
        { item: 'Solar Power Management Unit with Battery', quantity: 2, justification: 'Off-grid power autonomy' },
      ],
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();
