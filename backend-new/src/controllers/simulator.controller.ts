import { Request, Response, NextFunction } from 'express';
import { SimulatorCalculateInputSchema } from '../schemas/simulator.schema';
import { calculateProjectFeasibility } from '../services/simulator.service';

export async function calculateSimulator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = SimulatorCalculateInputSchema.parse(req.body);
    const result = calculateProjectFeasibility(input);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
