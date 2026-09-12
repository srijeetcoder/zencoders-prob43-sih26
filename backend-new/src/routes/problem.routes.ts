import { Router } from 'express';
import { processProblem, getPublicProblems, getProblemDetail } from '../controllers/problem.controller';
import { validateBody } from '../middleware/validateRequest';
import { ProcessProblemInputSchema } from '../schemas/problem.schema';

const router = Router();

// Public Problem Ledger with filtering & pagination
router.get('/public', getPublicProblems);
router.get('/public/:id', getProblemDetail);

// POST /api/v1/problems/process & /api/v1/problems/solve - Full Master Orchestrator Pipeline
router.post('/process', validateBody(ProcessProblemInputSchema), processProblem);
router.post('/solve', validateBody(ProcessProblemInputSchema), processProblem);

export default router;

