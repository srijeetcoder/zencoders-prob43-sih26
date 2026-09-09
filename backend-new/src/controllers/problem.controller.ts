import { Request, Response, NextFunction } from 'express';
import { ProcessProblemInputSchema } from '../schemas/problem.schema';
import { processAndGroupInput } from '../services/translationAndGrouping.service';
import { onnxMasterOrchestrator } from '../services/onnxOrchestrator.service';
import { analyzeProblemIntelligence } from '../services/problemIntelligence.service';
import { checkProblemDuplicate } from '../services/deduplication.service';
import { matchEcosystemWithReadiness } from '../services/ecosystemMatcher.service';
import { generateProjectBlueprint } from '../services/blueprint.service';
import { query, formatVector } from '../config/database';
import { generateEmbedding } from '../services/embedding.service';

export async function processProblem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = ProcessProblemInputSchema.parse(req.body);
    const userProblemInput =
      input.rawDescription ||
      input.userProblemInput ||
      input.citizenProblemInput ||
      input.problemInput ||
      input.text ||
      input.description ||
      input.title ||
      input.problemTitle ||
      '';
    const district = input.district || 'Ranchi';
    const fieldContext = input.fieldContext || input.context || '';
    const problemTitle = input.problemTitle || input.title || '';

    // 1. Unified Gemini Translation & Thematic Domain Grouping FIRST
    const processed = await processAndGroupInput(userProblemInput, district);
    const normalizedProblem = processed.translatedEnglishText;
    const classifiedDomain = processed.classifiedDomain;
    const detectedLanguage = processed.detectedLanguage;

    // Optional field translation for field context
    let normalizedFieldContext = fieldContext;
    if (fieldContext && fieldContext.trim().length > 0) {
      const fieldProcessed = await processAndGroupInput(fieldContext, district);
      normalizedFieldContext = fieldProcessed.translatedEnglishText;
    }

    // 2. Pass clean normalized English to ONNX Master Orchestrator
    const routing = await onnxMasterOrchestrator.routeProblem(normalizedProblem, district);
    routing.domain = classifiedDomain || routing.domain;

    // 3. Problem Intelligence Analysis on clean normalized English
    const intelligence = await analyzeProblemIntelligence(normalizedProblem, district);
    intelligence.detectedDialect = detectedLanguage || intelligence.detectedDialect;
    intelligence.translatedProblem = normalizedProblem;
    if (classifiedDomain && !intelligence.domainTags.includes(classifiedDomain)) {
      intelligence.domainTags = [classifiedDomain, ...intelligence.domainTags];
    }

    // 4. Semantic Deduplication & Vector Embedding on clean normalized English (text-embedding-004)
    const deduplication = await checkProblemDuplicate(normalizedProblem, district);

    const embedding = deduplication.vector.length === 768 
      ? deduplication.vector 
      : await generateEmbedding(normalizedProblem);

    let problemId: string;

    if (deduplication.isDuplicate && deduplication.matchedProblemId) {
      problemId = deduplication.matchedProblemId;
    } else {
      try {
        const insertSql = `
          INSERT INTO problems (
            text,
            district,
            domain_tags,
            root_causes,
            disciplines,
            priority,
            detected_dialect,
            translated_problem,
            embedding
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::vector)
          RETURNING id;
        `;
        const insertRes = await query(insertSql, [
          userProblemInput,
          district,
          intelligence.domainTags,
          intelligence.rootCauses,
          intelligence.requiredDisciplines,
          routing.priority,
          intelligence.detectedDialect,
          intelligence.translatedProblem,
          formatVector(embedding),
        ]);
        problemId = insertRes.rows[0].id;
      } catch {
        problemId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
      }
    }

    const combinedTags = [...intelligence.domainTags, ...intelligence.requiredDisciplines];
    const ecosystemReadiness = await matchEcosystemWithReadiness(
      intelligence.translatedProblem,
      combinedTags,
      district,
      { limit: 5 }
    );

    const recommendedSol = intelligence.candidateSolutions.find((s) => s.isRecommended)?.title;
    const blueprint = await generateProjectBlueprint(
      intelligence.translatedProblem,
      district,
      intelligence.rootCauses,
      intelligence.requiredDisciplines,
      recommendedSol,
      classifiedDomain,
      normalizedFieldContext
    );

    res.status(200).json({
      success: true,
      data: {
        id: problemId,
        isDuplicate: deduplication.isDuplicate,
        matchedExistingProblemId: deduplication.matchedProblemId || null,
        similarityScore: deduplication.similarityScore || null,
        orchestrationRouting: routing,
        classifiedDomain,
        detectedLanguage,
        rootCauseSummary: processed.rootCauseSummary,
        problemDNA: intelligence.problemDNA,
        detectedDialect: intelligence.detectedDialect,
        translatedProblem: intelligence.translatedProblem,
        rootCauses: intelligence.rootCauses,
        candidateSolutions: intelligence.candidateSolutions,
        ecosystemReadiness: {
          projectReadinessPercentage: ecosystemReadiness.projectReadinessPercentage,
          requirementsChecklist: ecosystemReadiness.requirementsChecklist,
          missingCapabilities: ecosystemReadiness.missingCapabilities,
          topPartners: ecosystemReadiness.topMatches,
        },
        blueprint: {
          ...blueprint,
          title: blueprint.projectTitle || 'Societal Solution Blueprint',
          overview: blueprint.executiveSummary || 'Engineered intervention blueprint for Jharkhand.',
          methodologySteps: blueprint.milestones?.map(m => `Phase ${m.phaseNumber}: ${m.title} (${m.durationWeeks}w - ${m.kpi})`) || [
            'Phase 1: Baseline Survey & Sensor Calibration',
            'Phase 2: Pilot Deployment & Community Integration',
            'Phase 3: Operational Handover & State Monitoring'
          ],
          hardwareAndSensors: blueprint.summaryMatrix?.hardwareSummary || ['Solar Telemetry Pods', 'LoRaWAN Gateways'],
          softwareAndAIStack: blueprint.summaryMatrix?.softwareSummary || ['Edge Sensor Firmware', 'pgvector Ingestion Pipeline'],
          policyAndCommunityAction: blueprint.riskMitigations?.[0]?.jharkhandSpecificMitigation || 'Establish local Gram Panchayat oversight committee.',
          estimatedBudgetINR: blueprint.estimatedTotalBudgetINR || 1650000,
          projectTimelineMonths: blueprint.recommendedTimelineMonths || 6,
          metricsAndKPIs: blueprint.summaryMatrix?.successMetrics || ['Detection latency < 60s'],
        },
        district,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}
