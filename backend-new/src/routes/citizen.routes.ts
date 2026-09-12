import { Router } from 'express';
import { citizenController } from '../controllers/citizen.controller';
import { authenticateToken, optionalAuthenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Submit grievance (anonymous or authenticated) - supports plural and singular
router.post('/grievances', optionalAuthenticate, (req, res, next) => citizenController.submitGrievance(req, res, next));
router.post('/grievance', optionalAuthenticate, (req, res, next) => citizenController.submitGrievance(req, res, next));

// Citizen's personal grievances list
router.get('/grievances', authenticateToken, requireRole('CITIZEN', 'SUPER_ADMIN'), (req, res, next) => citizenController.getMyGrievances(req, res, next));
router.get('/grievance', authenticateToken, requireRole('CITIZEN', 'SUPER_ADMIN'), (req, res, next) => citizenController.getMyGrievances(req, res, next));

// Public Problem Feed from real database
router.get('/feed', (req, res, next) => citizenController.getPublicFeed(req, res, next));

// Grievance status & timeline
router.get('/grievances/:ticketId/status', (req, res, next) => citizenController.getGrievanceStatus(req, res, next));
router.get('/grievance/:ticketId/status', (req, res, next) => citizenController.getGrievanceStatus(req, res, next));
router.get('/ticket/:ticketId/status', (req, res, next) => citizenController.getGrievanceStatus(req, res, next));

// Grievance detail
router.get('/grievances/:ticketId', (req, res, next) => citizenController.getGrievanceByTicket(req, res, next));
router.get('/grievance/:ticketId', (req, res, next) => citizenController.getGrievanceByTicket(req, res, next));
router.get('/ticket/:ticketId', (req, res, next) => citizenController.getGrievanceByTicket(req, res, next));

// Claim anonymous grievance
router.post('/grievances/:ticketId/claim', authenticateToken, (req, res, next) => citizenController.claimGrievance(req, res, next));
router.post('/grievance/:ticketId/claim', authenticateToken, (req, res, next) => citizenController.claimGrievance(req, res, next));

export default router;
