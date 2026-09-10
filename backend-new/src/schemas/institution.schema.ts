import { z } from 'zod';

export const DprWorkbenchUpdateSchema = z.object({
  technical_summary: z.string().optional(),
  proposed_solution: z.string().optional(),
  bom_items: z.array(
    z.object({
      item: z.string(),
      quantity: z.number().int().positive().optional(),
      unitCost: z.number().optional(),
      totalCost: z.number().optional(),
      justification: z.string().optional(),
      category: z.string().optional(),
    })
  ).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).default('DRAFT'),
});

export const BomCheckSchema = z.object({
  domain: z.string().min(2, 'Domain is required'),
  bom_items: z.array(
    z.object({
      item: z.string(),
      quantity: z.number().int().positive().optional(),
      justification: z.string().optional(),
    })
  ),
});

export const CalibrationRequestSchema = z.object({
  dpr_id: z.string().uuid('Valid DPR ID is required'),
  domain: z.string().min(2, 'Domain is required'),
  prompt: z.string().min(5, 'Prompt is required'),
});
