import { z } from 'zod';

export const DispatchOrderSchema = z.object({
  grievance_id: z.string().uuid('Valid grievance ID is required'),
  department_id: z.string().uuid().optional(),
  assigned_officer_id: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'STANDARD', 'HIGH', 'CRITICAL']).default('HIGH'),
  instructions: z.string().min(5, 'Dispatch instructions must be at least 5 characters'),
});

export const EscalationSchema = z.object({
  grievance_id: z.string().uuid('Valid grievance ID is required'),
  reason: z.string().min(5, 'Escalation reason is required'),
  level: z.number().int().min(1).max(5).default(1),
  escalated_to: z.string().uuid().optional(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['OPEN', 'TRIAGED', 'ASSIGNED', 'DISPATCHED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED']),
  note: z.string().optional(),
});

export const GovernmentAIAnalysisSchema = z.object({
  entity_type: z.enum(['GRIEVANCE', 'DPR', 'DISTRICT']).default('GRIEVANCE'),
  entity_id: z.string().uuid().optional(),
  domain: z.string().min(2, 'Domain is required'),
  prompt: z.string().min(5, 'Problem description/prompt is required'),
});
