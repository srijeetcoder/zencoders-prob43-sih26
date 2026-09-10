import { Router } from 'express';
import { institutionController } from '../controllers/institution.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole, requireInstitutionScope } from '../middleware/rbac.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect institution portal routes
router.use(authenticateToken);
router.use(requireRole('INSTITUTION', 'SUPER_ADMIN'));

router.get('/profile', (req, res, next) => institutionController.getProfile(req, res, next));
router.get('/allocations', requireInstitutionScope, (req, res, next) => institutionController.getDprAllocations(req, res, next));
router.get('/dprs/:id', requireInstitutionScope, (req, res, next) => institutionController.getDprById(req, res, next));
router.post('/dprs/:id/workbench', requireInstitutionScope, (req, res, next) => institutionController.saveWorkbench(req, res, next));
router.post('/dprs/:id/analyze', requireInstitutionScope, aiLimiter, (req, res, next) => institutionController.analyzeDpr(req, res, next));
router.post('/dprs/:id/calibrate', requireInstitutionScope, aiLimiter, (req, res, next) => institutionController.calibrateDpr(req, res, next));
router.post('/dprs/:id/bom-check', (req, res, next) => institutionController.checkBom(req, res, next));
router.get('/matches', (req, res, next) => institutionController.getSolutionMatches(req, res, next));

export default router;
