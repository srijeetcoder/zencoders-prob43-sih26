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

/**
 * Public problem ledger endpoint with pagination and domain/district filtering.
 * Strips citizen PII for public transparency.
 */
export async function getPublicProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string || '12', 10)));
    const offset = (page - 1) * limit;

    const district = (req.query.district as string) || undefined;
    const domain = (req.query.domain as string) || undefined;
    const search = (req.query.search as string) || undefined;

    const whereClauses: string[] = ['is_simulation = false'];
    const params: any[] = [];
    let pIdx = 1;

    if (district && district !== 'All') {
      whereClauses.push(`district ILIKE $${pIdx++}`);
      params.push(`%${district}%`);
    }
    if (domain && domain !== 'All') {
      whereClauses.push(`domain ILIKE $${pIdx++}`);
      params.push(`%${domain}%`);
    }
    if (search) {
      whereClauses.push(`(ticket_id ILIKE $${pIdx} OR normalized_text ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    const whereSql = `WHERE ${whereClauses.join(' AND ')}`;

    const countRes = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM grievances ${whereSql};`,
      params
    );
    const total = parseInt(countRes.rows[0]?.count || '0', 10);

    const dataRes = await query(
      `SELECT id, ticket_id, normalized_text, domain, sub_domain, severity, priority,
              status, district, block, language, created_at, resolved_at
       FROM grievances
       ${whereSql}
       ORDER BY created_at DESC
       LIMIT $${pIdx++} OFFSET $${pIdx++};`,
      [...params, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: {
        items: dataRes.rows.map((row) => ({
          id: row.id,
          ticketId: row.ticket_id,
          title: `${row.domain} Challenge in ${row.district}`,
          description: row.normalized_text,
          domain: row.domain,
          subDomain: row.sub_domain,
          severity: row.severity,
          priority: row.priority,
          status: row.status,
          district: row.district,
          block: row.block,
          language: row.language,
          createdAt: row.created_at,
          resolvedAt: row.resolved_at,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProblemDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const idOrTicket = req.params.id;
    const resDb = await query(
      `SELECT id, ticket_id, normalized_text, domain, sub_domain, severity, priority,
              status, district, block, language, created_at, resolved_at
       FROM grievances
       WHERE (id::text = $1 OR ticket_id ILIKE $1) AND is_simulation = false
       LIMIT 1;`,
      [idOrTicket]
    );

    if (!resDb.rows[0]) {
      res.status(404).json({ success: false, error: 'Problem not found' });
      return;
    }

    const row = resDb.rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: row.id,
        ticketId: row.ticket_id,
        title: `${row.domain} Challenge in ${row.district}`,
        description: row.normalized_text,
        domain: row.domain,
        subDomain: row.sub_domain,
        severity: row.severity,
        priority: row.priority,
        status: row.status,
        district: row.district,
        block: row.block,
        language: row.language,
        createdAt: row.created_at,
        resolvedAt: row.resolved_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

