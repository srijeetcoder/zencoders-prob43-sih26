import { Router } from 'express';
import { citizenController } from '../controllers/citizen.controller';
import { authenticateToken, optionalAuthenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Submit grievance (anonymous or authenticated)
router.post('/grievances', optionalAuthenticate, (req, res, next) => citizenController.submitGrievance(req, res, next));

// Citizen's personal grievances list
router.get('/grievances', authenticateToken, requireRole('CITIZEN', 'SUPER_ADMIN'), (req, res, next) => citizenController.getMyGrievances(req, res, next));

// Grievance status & timeline
router.get('/grievances/:ticketId/status', (req, res, next) => citizenController.getGrievanceStatus(req, res, next));

// Grievance detail
router.get('/grievances/:ticketId', (req, res, next) => citizenController.getGrievanceByTicket(req, res, next));

// Claim anonymous grievance
router.post('/grievances/:ticketId/claim', authenticateToken, (req, res, next) => citizenController.claimGrievance(req, res, next));

export default router;
