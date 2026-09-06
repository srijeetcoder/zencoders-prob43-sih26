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

/**
 * Generated Solution Blueprint (SIH PS-43 Specification)
 */
export const InnovationBlueprintSchema = z.object({
  projectTitle: z.string(),
  executiveSummary: z.string(),
  recommendedSolutionArchitecture: z.string().describe('The selected candidate solution architecture (e.g. Hybrid IoT + GIS system).'),
  
  // High-Level Summary Matrix (Table 3 in PDF)
  summaryMatrix: z.object({
    hardwareSummary: z.array(z.string()).describe('e.g. ["Flow sensors", "Pressure sensors", "IoT gateway"]'),
    softwareSummary: z.array(z.string()).describe('e.g. ["IoT ingestion", "GIS dashboard", "Anomaly detection", "Alerts"]'),
    expertiseSummary: z.array(z.string()).describe('e.g. ["IoT", "Agriculture", "GIS", "Backend", "Data Science"]'),
    teamSummary: z.string().describe('e.g. "University team + domain expert + IoT/industry partner"'),
    timelineSummary: z.object({
      prototypeWeeks: z.number().describe('e.g. 8'),
      pilotWeeks: z.number().describe('e.g. 16'),
    }),
    successMetrics: z.array(z.string()).describe('e.g. ["Water loss ↓", "Detection time ↓", "Irrigation efficiency ↑"]'),
  }),

  // Detailed Engineering Artifacts
  milestones: z.array(MilestoneSchema).min(3),
  hardwareSpecs: z.array(HardwareSpecItemSchema).min(1),
  teamRequirements: z.array(TeamRequirementItemSchema).min(2),
  riskMitigations: z.array(RiskMitigationItemSchema).min(2),
  estimatedTotalBudgetINR: z.number(),
  recommendedTimelineMonths: z.number(),
  historicalCaseContextUsed: z.string(),
});

export type InnovationBlueprint = z.infer<typeof InnovationBlueprintSchema>;
