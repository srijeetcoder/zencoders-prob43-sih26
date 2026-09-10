import { Router } from 'express';
import problemRoutes from './problem.routes';
import ecosystemRoutes from './ecosystem.routes';
import simulatorRoutes from './simulator.routes';
import crawlerRoutes from './crawler.routes';
import citizenRoutes from './citizen.routes';
import governmentRoutes from './government.routes';
import institutionRoutes from './institution.routes';
import authRoutes from './auth.routes';

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

// Authentication & Identity
router.use('/auth', authRoutes);

// Portal & Modular Sub-Routers
router.use('/citizen', citizenRoutes);
router.use('/government', governmentRoutes);
router.use('/institution', institutionRoutes);

// Core Processing Sub-Routers
router.use('/problems', problemRoutes);
router.use('/ecosystem', ecosystemRoutes);
router.use('/simulator', simulatorRoutes);
router.use('/crawler', crawlerRoutes);

export default router;
