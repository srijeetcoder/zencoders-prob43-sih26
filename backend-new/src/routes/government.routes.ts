import { Router } from 'express';
import { governmentController } from '../controllers/government.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect all government endpoints with JWT and Government Role verification
router.use(authenticateToken);
router.use(requireRole('GOVERNMENT', 'SUPER_ADMIN'));

router.get('/overview', (req, res, next) => governmentController.getOverview(req, res, next));
router.get('/districts', (req, res, next) => governmentController.getDistrictsHazardData(req, res, next));
router.get('/departments', (req, res, next) => governmentController.getDepartments(req, res, next));
router.get('/grievances', (req, res, next) => governmentController.getGrievances(req, res, next));
router.post('/dispatch', (req, res, next) => governmentController.createDispatch(req, res, next));
router.post('/escalate', (req, res, next) => governmentController.createEscalation(req, res, next));
router.get('/escalations', (req, res, next) => governmentController.getEscalations(req, res, next));
router.patch('/grievances/:id/status', (req, res, next) => governmentController.updateGrievanceStatus(req, res, next));
router.post('/ai-analysis', aiLimiter, (req, res, next) => governmentController.triggerAIAnalysis(req, res, next));

export default router;
