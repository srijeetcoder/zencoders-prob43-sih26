import { Router } from 'express';
import { getEcosystemMatches } from '../controllers/ecosystem.controller';

const router = Router();

// GET /api/ecosystem/match/:problemId - Institutional matches
router.get('/match/:problemId', getEcosystemMatches);

export default router;
