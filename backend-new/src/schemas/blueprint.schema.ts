import { z } from 'zod';

export const HardwareSpecItemSchema = z.object({
  component: z.string(),
  purpose: z.string(),
  quantity: z.number(),
  estimatedUnitCostINR: z.number(),
  supplierOrStandard: z.string(),
});

export const TeamRequirementItemSchema = z.object({
  role: z.string(),
  discipline: z.string(),
  headcount: z.number(),
  responsibilities: z.string(),
});

export const MilestoneSchema = z.object({
  phaseNumber: z.number(),
  title: z.string(),
  durationWeeks: z.number(),
  deliverables: z.array(z.string()),
  kpi: z.string(),
});

export const RiskMitigationItemSchema = z.object({
  risk: z.string(),
  level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  jharkhandSpecificMitigation: z.string(),
});

export const InnovationBlueprintSchema = z.object({
  projectTitle: z.string(),
  executiveSummary: z.string(),
  recommendedSolutionArchitecture: z.string(),
  summaryMatrix: z.object({
    hardwareSummary: z.array(z.string()),
    softwareSummary: z.array(z.string()),
    expertiseSummary: z.array(z.string()),
    teamSummary: z.string(),
    timelineSummary: z.object({
      prototypeWeeks: z.number(),
      pilotWeeks: z.number(),
    }),
    successMetrics: z.array(z.string()),
  }),
  milestones: z.array(MilestoneSchema).min(3),
  hardwareSpecs: z.array(HardwareSpecItemSchema).min(1),
  teamRequirements: z.array(TeamRequirementItemSchema).min(2),
  riskMitigations: z.array(RiskMitigationItemSchema).min(2),
  estimatedTotalBudgetINR: z.number(),
  recommendedTimelineMonths: z.number(),
  historicalCaseContextUsed: z.string(),
});

export type InnovationBlueprint = z.infer<typeof InnovationBlueprintSchema>;

export {
  ExtractedKnowledgeItemSchema,
  ExtractedKnowledgeSchema,
  type ExtractedKnowledgeItem,
  type ExtractedKnowledge,
} from './crawler.schema';
