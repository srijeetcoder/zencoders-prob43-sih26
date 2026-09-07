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

export const ProblemIntelligenceSchema = z.object({
  problemDNA: z.array(z.string()),
  translatedProblem: z.string(),
  detectedDialect: z.string(),
  rootCauses: z.array(z.string()).min(2).max(5),
  candidateSolutions: z.array(CandidateSolutionSchema).min(2).max(3),
  requiredDisciplines: z.array(z.string()),
  domainTags: z.array(z.string()),
  severityScore: z.number().min(1).max(10),
  summary: z.string(),
});

export type ProblemIntelligence = z.infer<typeof ProblemIntelligenceSchema>;
export type CandidateSolution = z.infer<typeof CandidateSolutionSchema>;
