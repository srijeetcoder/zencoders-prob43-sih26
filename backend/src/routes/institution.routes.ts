import { Router } from 'express';
import { getPartners, getDPR, submitCalibration } from '../controllers/institution.controller';
import { verifyAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protect all Institutional & Research routes
router.use(verifyAuth);
router.use(requireRole(['INSTITUTION', 'GOVERNMENT', 'ADMIN']));

// Academic & Research Institutions Directory
router.get('/partners', getPartners);

// Bankable DPR Generation with Domain-Bound BoM
router.get('/dpr/:problemId', getDPR);

// Lab Calibration & Telemetry Submission
router.post('/calibrate', submitCalibration);

export default router;

