import { Router } from 'express';
import { ingestUrl, ingestRawText, getKnowledgeStats } from '../controllers/crawler.controller';
import { validateBody } from '../middleware/validateRequest';
import { IngestUrlInputSchema, IngestRawTextInputSchema } from '../schemas/crawler.schema';

const router = Router();

// POST /api/crawler/ingest-url - Scrapes public website and auto-learns into pgvector memory
router.post('/ingest-url', validateBody(IngestUrlInputSchema), ingestUrl);

// POST /api/crawler/ingest-raw-text - Ingests unstructured technical reports/articles
router.post('/ingest-raw-text', validateBody(IngestRawTextInputSchema), ingestRawText);

// GET /api/crawler/knowledge-stats - Returns live statistics of self-learned memory base
router.get('/knowledge-stats', getKnowledgeStats);

export default router;
