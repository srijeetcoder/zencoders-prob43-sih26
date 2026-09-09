import { Router } from 'express';
import {
  handleIngest,
  handleIngestExpanded,
  handleAutoIngest,
  handleAutoIngestStatus,
  handleCleanDuplicates,
  handleAuditAllMemory,
  handleGetCredibilityStats,
  handleTriggerHarvestRoutine,
  handleGetHarvestRoutineStats,
  handleGetHarvestQueries,
  getKnowledgeStats,
  listInnovationMemory,
  deleteInnovationMemory,
  queryKnowledge,
} from '../controllers/crawler.controller';
import { validateBody } from '../middleware/validateRequest';
import { QueryKnowledgeInputSchema } from '../schemas/crawler.schema';

const router = Router();

// POST /api/crawler/harvest-routine - Triggers automated A+ daily data harvesting routine over 300 Jharkhand queries
router.post('/harvest-routine', handleTriggerHarvestRoutine);

// GET /api/crawler/harvest-routine/stats - Live statistics of background ingestion worker
router.get('/harvest-routine/stats', handleGetHarvestRoutineStats);

// GET /api/crawler/harvest-routine/queries - Returns 300 targeted Jharkhand queries dataset
router.get('/harvest-routine/queries', handleGetHarvestQueries);

// POST /api/crawler/ingest - Two-stage AI-audited automated curation & pgvector ingestion
router.post('/ingest', handleIngest);

// POST /api/crawler/ingest-expanded - Deep Web Search & 10x Related Source Auto-Discovery & Validation
router.post('/ingest-expanded', handleIngestExpanded);

// POST /api/crawler/clean-duplicates - Purge duplicate / redundant vector records from PostgreSQL memory
router.post('/clean-duplicates', handleCleanDuplicates);

// POST /api/crawler/audit-memory - Audit & measure credibility scores across all stored records in database
router.post('/audit-memory', handleAuditAllMemory);

// GET /api/crawler/credibility-stats - Returns live global credibility metrics across entire vector memory
router.get('/credibility-stats', handleGetCredibilityStats);

// POST /api/crawler/auto-ingest - Autonomous batch knowledge crawler across diverse & randomized state feeds
router.post('/auto-ingest', handleAutoIngest);

// GET /api/crawler/auto-ingest/status - Live status of automated knowledge crawler and available feeds
router.get('/auto-ingest/status', handleAutoIngestStatus);

/* --- DORMANT LEGACY API MODULE (POST-HACKATHON FALLBACK) ---
 * // router.post('/ingest-url', validateBody(IngestUrlInputSchema), ingestUrl);
 * // router.post('/ingest-raw-text', validateBody(IngestRawTextInputSchema), ingestRawText);
 * --- END OF DORMANT LEGACY API MODULE --- */

// POST /api/crawler/query-knowledge - Interactive Q&A Engine over pgvector Innovation Memory
router.post('/query-knowledge', validateBody(QueryKnowledgeInputSchema), queryKnowledge);

// GET /api/crawler/knowledge-stats - Returns live statistics of self-learned memory base
router.get('/knowledge-stats', getKnowledgeStats);

// GET /api/crawler/memory - Returns all saved training & innovation memory case studies
router.get('/memory', listInnovationMemory);

// DELETE /api/crawler/memory/:id - Deletes a specific trained knowledge record
router.delete('/memory/:id', deleteInnovationMemory);

export default router;
