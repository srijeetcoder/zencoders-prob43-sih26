import { Router } from 'express';
import problemRoutes from './problem.routes';
import ecosystemRoutes from './ecosystem.routes';
import simulatorRoutes from './simulator.routes';
import crawlerRoutes from './crawler.routes';

const router = Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Societal Innovation Intelligence Engine (SIH PS-43)',
    state: 'Government of Jharkhand',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular sub-routers
router.use('/problems', problemRoutes);
router.use('/ecosystem', ecosystemRoutes);
router.use('/simulator', simulatorRoutes);
router.use('/crawler', crawlerRoutes);

export default router;
