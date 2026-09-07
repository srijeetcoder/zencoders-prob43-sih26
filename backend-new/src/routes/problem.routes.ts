import { Router } from 'express';
import { processProblem } from '../controllers/problem.controller';
import { validateBody } from '../middleware/validateRequest';
import { ProcessProblemInputSchema } from '../schemas/problem.schema';

const router = Router();

// POST /api/problems/process - Full Master Orchestrator Pipeline
router.post('/process', validateBody(ProcessProblemInputSchema), processProblem);

export default router;
