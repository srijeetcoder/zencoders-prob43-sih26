import { z } from 'zod';

export const ProcessProblemInputSchema = z.object({
  rawDescription: z.string().optional(),
  userProblemInput: z.string().optional(),
  citizenProblemInput: z.string().optional(),
  problemInput: z.string().optional(),
  text: z.string().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
  problemTitle: z.string().optional(),
  fieldContext: z.string().optional(),
  context: z.string().optional(),
  district: z.string().default('Ranchi'),
}).refine(
  (data) => !!(data.rawDescription || data.userProblemInput || data.citizenProblemInput || data.problemInput || data.text || data.description || data.title || data.problemTitle),
  { message: 'Problem description or citizen problem input is required' }
);

export type ProcessProblemInput = z.infer<typeof ProcessProblemInputSchema>;

export const CandidateSolutionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isRecommended: z.boolean(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  recommendationRationale: z.string(),
});

/**
 * Problem DNA & Intelligence Schema conforming to SIH PS-43 Specification
 */
export const ProblemIntelligenceSchema = z.object({
  // Step 1 — Problem DNA
  problemDNA: z
    .array(z.string())
    .describe('Core pillars of the problem (e.g., ["Water Management", "Agriculture", "IoT", "Rural Infrastructure"]).'),
  translatedProblem: z
    .string()
    .describe('Standard English translation and technical clarification of the regional dialect description.'),
  detectedDialect: z
    .string()
    .describe('Detected regional linguistic origin (e.g., Khortha, Nagpuri, Santhali, Mundari, Hindi).'),
  
  // Step 2 — Root Causes
  rootCauses: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe('2-5 fundamental root causes identified by root-cause analysis.'),
  
  // Step 3 — Candidate Solutions
  candidateSolutions: z
    .array(CandidateSolutionSchema)
    .min(2)
    .max(3)
    .describe('2-3 candidate architectural solutions with one clearly marked as recommended.'),
  
  requiredDisciplines: z.array(z.string()),
  domainTags: z.array(z.string()),
  severityScore: z.number().min(1).max(10),
  summary: z.string(),
});

export type ProblemIntelligence = z.infer<typeof ProblemIntelligenceSchema>;
export type CandidateSolution = z.infer<typeof CandidateSolutionSchema>;
