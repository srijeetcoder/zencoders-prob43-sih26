import { z } from 'zod';

export const EcosystemRequirementCheckSchema = z.object({
  requirement: z.string(),
  isAvailable: z.boolean(),
  matchedEntityName: z.string().nullable().optional(),
});

export const EcosystemEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  entityType: z.enum(['University', 'Startup', 'Lab', 'R&D Center', 'Government Agency']),
  district: z.string(),
  capabilities: z.array(z.string()),
  contactEmail: z.string().nullable().optional(),
  cosineSimilarity: z.number().optional(),
  tagOverlapCount: z.number().optional(),
  compositeMatchScore: z.number().optional(),
  matchRationale: z.string().optional(),
});

export type EcosystemEntity = z.infer<typeof EcosystemEntitySchema>;
export type EcosystemRequirementCheck = z.infer<typeof EcosystemRequirementCheckSchema>;

export const EcosystemMatchResponseSchema = z.object({
  problemId: z.string().uuid(),
  district: z.string(),
  domainTags: z.array(z.string()),
  projectReadinessPercentage: z.number().min(0).max(100),
  requirementsChecklist: z.array(EcosystemRequirementCheckSchema),
  missingCapabilities: z.array(z.string()),
  topMatches: z.array(EcosystemEntitySchema),
});

export type EcosystemMatchResponse = z.infer<typeof EcosystemMatchResponseSchema>;
