import { Router } from 'express';
import { governmentController } from '../controllers/government.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect government endpoints
router.use(authenticateToken);
router.use(requireRole('GOVERNMENT', 'SUPER_ADMIN', 'ADMIN', 'INSTITUTION'));

router.get('/overview', (req, res, next) => governmentController.getOverview(req, res, next));
router.get('/districts', (req, res, next) => governmentController.getDistrictsHazardData(req, res, next));
router.get('/departments', (req, res, next) => governmentController.getDepartments(req, res, next));
router.get('/grievances', (req, res, next) => governmentController.getGrievances(req, res, next));
router.get('/clusters', (req, res, next) => governmentController.getClusters(req, res, next));
router.post('/dispatch', (req, res, next) => governmentController.createDispatch(req, res, next));
router.post('/escalate', (req, res, next) => governmentController.createEscalation(req, res, next));
router.get('/escalations', (req, res, next) => governmentController.getEscalations(req, res, next));
router.patch('/grievances/:id/status', (req, res, next) => governmentController.updateGrievanceStatus(req, res, next));
router.post('/grievances/:id/status', (req, res, next) => governmentController.updateGrievanceStatus(req, res, next));
router.post('/grievances/:id/assign-university', (req, res, next) => governmentController.assignUniversity(req, res, next));
router.post('/assign-university', (req, res, next) => governmentController.assignUniversity(req, res, next));
router.post('/ai-analysis', aiLimiter, (req, res, next) => governmentController.triggerAIAnalysis(req, res, next));
router.post('/cluster-analysis', aiLimiter, (req, res, next) => governmentController.triggerAIAnalysis(req, res, next));

export default router;
