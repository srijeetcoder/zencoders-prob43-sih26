import { Router } from 'express';
import {
  ingestUrl,
  ingestRawText,
  getKnowledgeStats,
  listInnovationMemory,
  deleteInnovationMemory,
  queryKnowledge,
} from '../controllers/crawler.controller';
import { validateBody } from '../middleware/validateRequest';
import { IngestUrlInputSchema, IngestRawTextInputSchema, QueryKnowledgeInputSchema } from '../schemas/crawler.schema';

const router = Router();

// POST /api/crawler/ingest-url - Scrapes public website and auto-learns into pgvector memory
router.post('/ingest-url', validateBody(IngestUrlInputSchema), ingestUrl);

// POST /api/crawler/ingest-raw-text - Ingests unstructured technical reports/articles
router.post('/ingest-raw-text', validateBody(IngestRawTextInputSchema), ingestRawText);

// POST /api/crawler/query-knowledge - Interactive Q&A Engine over pgvector Innovation Memory
router.post('/query-knowledge', validateBody(QueryKnowledgeInputSchema), queryKnowledge);

// GET /api/crawler/knowledge-stats - Returns live statistics of self-learned memory base
router.get('/knowledge-stats', getKnowledgeStats);

// GET /api/crawler/memory - Returns all saved training & innovation memory case studies
router.get('/memory', listInnovationMemory);

// DELETE /api/crawler/memory/:id - Deletes a specific trained knowledge record
router.delete('/memory/:id', deleteInnovationMemory);

export default router;
