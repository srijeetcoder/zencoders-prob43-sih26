import { z } from 'zod';

export const IngestUrlInputSchema = z.object({
  url: z.string().url('A valid URL must be provided (e.g., https://jharkhand.gov.in/news/water-project)'),
  sourceTag: z.string().optional().default('Web Crawl'),
  categoryHint: z.string().optional(),
});

export type IngestUrlInput = z.infer<typeof IngestUrlInputSchema>;

export const IngestRawTextInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  source: z.string().default('Manual / Server Push'),
  district: z.string().optional(),
});

export type IngestRawTextInput = z.infer<typeof IngestRawTextInputSchema>;

/**
 * Structured schema for LLM extraction from raw web documents
 */
export const ExtractedKnowledgeItemSchema = z.object({
  knowledgeType: z
    .enum(['CASE_STUDY', 'INSTITUTION_CAPABILITY', 'EMERGING_CHALLENGE', 'POLICY_FRAMEWORK', 'COMMUNITY_INITIATIVE'])
    .describe('Type of knowledge extracted from the public document'),
  title: z.string().describe('Precise title of the innovation, report, challenge, or policy'),
  problemSummary: z.string().describe('Summary of the societal issue or challenge addressed'),
  solutionSummary: z.string().describe('Technical intervention, administrative reform, or policy framework (or "Identified Societal Challenge — Requires Cross-Departmental Intervention" if purely a problem/grievance)'),
  outcome: z.string().describe('Measurable outcome, socio-economic impact, or documented status'),
  domain: z.string().describe('Primary domain (e.g. Socio-Economic & Tribal Welfare, Governance & Public Delivery, Mining & Geo-hazards, Water Quality & Hydrology, Agriculture & Minor Forest Produce, Public Health & Sanitation, Education & Skill Development, Infrastructure & Renewable Energy)'),
  domainTags: z.array(z.string()).describe('Tags related to this knowledge item'),
  locationOrDistrict: z.string().describe('Mentioned district, state, or location context'),
  keyTechnologiesUsed: z.array(z.string()).describe('Key methodologies, administrative mechanisms, policy tools, or technologies used'),
});

export type ExtractedKnowledgeItem = z.infer<typeof ExtractedKnowledgeItemSchema>;

export const KnowledgeStatsResponseSchema = z.object({
  totalLearnedCases: z.number(),
  totalEcosystemEntities: z.number(),
  totalKnownProblems: z.number(),
  domainsCovered: z.array(z.string()),
  recentLearnedItems: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      domain: z.string(),
      createdAt: z.string().optional(),
    })
  ),
});

export type KnowledgeStatsResponse = z.infer<typeof KnowledgeStatsResponseSchema>;
