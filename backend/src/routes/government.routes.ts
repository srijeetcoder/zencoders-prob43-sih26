import { Router } from 'express';
import { getStats, getSectors, getEscalations, getProjects, dispatchAction } from '../controllers/government.controller';
import { simulateAiAnalysis } from '../controllers/aiAnalysis.controller';
import { verifyAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protect all Government War Room routes
router.use(verifyAuth);
router.use(requireRole(['GOVERNMENT', 'ADMIN']));

// Statewide Overview & Aggregates
router.get('/stats', getStats);

// Sector-by-Sector Analytics
router.get('/sectors', getSectors);

// High-Priority Escalations & Vulnerability Hazard Scores
router.get('/escalations', getEscalations);

// Active Innovation Pilot Projects
router.get('/projects', getProjects);

// Department Action Dispatch Directives
router.post('/dispatch', dispatchAction);

// Real-Time AI Impact Simulations & S-Curve Projections
router.post('/ai-analysis', simulateAiAnalysis);

export default router;

