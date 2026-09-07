import { Router } from 'express';
import { calculateSimulator } from '../controllers/simulator.controller';
import { validateBody } from '../middleware/validateRequest';
import { SimulatorCalculateInputSchema } from '../schemas/simulator.schema';

const router = Router();

// POST /api/simulator/calculate - AI-Free Deterministic Feasibility & Cost Calculator
router.post('/calculate', validateBody(SimulatorCalculateInputSchema), calculateSimulator);

export default router;
