import { Router } from 'express';
import {
  handleIngest,
  getKnowledgeStats,
  listInnovationMemory,
  deleteInnovationMemory,
  queryKnowledge,
} from '../controllers/crawler.controller';
import { validateBody } from '../middleware/validateRequest';
import { QueryKnowledgeInputSchema } from '../schemas/crawler.schema';

const router = Router();

// POST /api/crawler/ingest - Two-stage AI-audited automated curation & pgvector ingestion
router.post('/ingest', handleIngest);

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
