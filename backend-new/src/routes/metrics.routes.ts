import { Router } from 'express';
import { metricsController } from '../controllers/metrics.controller';

const router = Router();

// Public landing page real-time statistics
router.get('/landing', (req, res, next) => metricsController.getLandingMetrics(req, res, next));
router.get('/', (req, res, next) => metricsController.getLandingMetrics(req, res, next));

export default router;
