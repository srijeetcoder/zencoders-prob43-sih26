import { z } from 'zod';

export const HardwareItemInputSchema = z.object({
  name: z.string().min(1, 'Hardware name is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitCostINR: z.number().min(0, 'Unit cost cannot be negative'),
  maintenanceAnnualRate: z.number().min(0).max(1).default(0.1),
});

export const PersonnelItemInputSchema = z.object({
  role: z.string().min(1, 'Role name is required'),
  headcount: z.number().int().min(1, 'Headcount must be at least 1'),
  monthlyRateINR: z.number().min(0, 'Monthly rate cannot be negative'),
  durationMonths: z.number().min(1).optional(),
});

export const SimulatorCalculateInputSchema = z.object({
  budgetINR: z.number().min(10000, 'Budget must be at least ₹10,000'),
  timelineMonths: z.number().min(1, 'Timeline must be at least 1 month').max(60, 'Timeline cannot exceed 60 months'),
  hardwareList: z.array(HardwareItemInputSchema).default([]),
  personnelList: z.array(PersonnelItemInputSchema).default([]),
  fieldSitesCount: z.number().int().min(1).default(1),
  terrainComplexityFactor: z.number().min(1.0).max(2.5).default(1.2),
  contingencyRate: z.number().min(0).max(0.3).default(0.1),
});

export type SimulatorCalculateInput = z.infer<typeof SimulatorCalculateInputSchema>;

export const CostBreakdownSchema = z.object({
  hardwareBaseCostINR: z.number(),
  hardwareMaintenanceCostINR: z.number(),
  totalHardwareCostINR: z.number(),
  totalPersonnelCostINR: z.number(),
  fieldLogisticsCostINR: z.number(),
  contingencyBufferINR: z.number(),
  totalEstimatedProjectCostINR: z.number(),
  budgetVarianceINR: z.number(),
  budgetUtilizationPercent: z.number(),
});

export const SimulatorCalculateResponseSchema = z.object({
  success: z.boolean(),
  costBreakdown: CostBreakdownSchema,
  feasibilityScore: z.number().min(0).max(100),
  feasibilityStatus: z.enum([
    'HIGHLY_FEASIBLE',
    'FEASIBLE_WITH_MARGINAL_RISK',
    'CRITICAL_BUDGET_DEFICIT',
    'TIMELINE_COMPRESSION_RISK',
    'SEVERE_OVERRUN_RISK',
  ]),
  metrics: z.object({
    monthlyBurnRateINR: z.number(),
    costPerFieldSiteINR: z.number(),
    hardwareToPersonnelRatio: z.number(),
    recommendedMinimumBudgetINR: z.number(),
    recommendedMinimumTimelineMonths: z.number(),
  }),
  mathematicalFormulasUsed: z.record(z.string()),
  advisoryNotes: z.array(z.string()),
});

export type SimulatorCalculateResponse = z.infer<typeof SimulatorCalculateResponseSchema>;
