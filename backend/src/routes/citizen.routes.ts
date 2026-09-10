import { Router } from 'express';
import { submitGrievance, getTicketStatus, getPublicFeed } from '../controllers/citizen.controller';

const router = Router();

// Ingestion & Normalization
router.post('/grievance', submitGrievance);

// Live Ticket Tracking
router.get('/ticket/:id', getTicketStatus);

// Public Community Problem Feed
router.get('/feed', getPublicFeed);

export default router;
