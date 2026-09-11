import { Router } from 'express';
import authRoutes from './auth.routes';
import citizenRoutes from './citizen.routes';
import governmentRoutes from './government.routes';
import institutionRoutes from './institution.routes';
import problemRoutes from './problem.routes';
import ecosystemRoutes from './ecosystem.routes';
import simulatorRoutes from './simulator.routes';
import crawlerRoutes from './crawler.routes';
import notificationRoutes from './notification.routes';
import metricsRoutes from './metrics.routes';
import { checkDatabaseHealth } from '../config/database';

const router = Router();

// Health Check Endpoint (Rule 55: Health check must report DB status)
router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  const isHealthy = dbHealth.status === 'healthy';
  const status = isHealthy ? 200 : 503;

  res.status(status).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'Societal Innovation Intelligence Engine (SIH PS-43) - Production Backend',
    state: 'Government of Jharkhand',
    database: dbHealth,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// V1 API Modular Sub-routers
const v1Router = Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/citizen', citizenRoutes);
v1Router.use('/government', governmentRoutes);
v1Router.use('/institution', institutionRoutes);
v1Router.use('/problem', problemRoutes);
v1Router.use('/problems', problemRoutes);
v1Router.use('/ecosystem', ecosystemRoutes);
v1Router.use('/simulator', simulatorRoutes);
v1Router.use('/crawler', crawlerRoutes);
v1Router.use('/notifications', notificationRoutes);
v1Router.use('/metrics', metricsRoutes);

// Mount under /v1
router.use('/v1', v1Router);

// Flat routes for backward compatibility
router.use('/auth', authRoutes);
router.use('/citizen', citizenRoutes);
router.use('/government', governmentRoutes);
router.use('/institution', institutionRoutes);
router.use('/problems', problemRoutes);
router.use('/ecosystem', ecosystemRoutes);
router.use('/simulator', simulatorRoutes);
router.use('/crawler', crawlerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/metrics', metricsRoutes);

export default router;
