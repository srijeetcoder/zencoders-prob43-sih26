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
    .enum(['CASE_STUDY', 'INSTITUTION_CAPABILITY', 'EMERGING_CHALLENGE'])
    .describe('Type of knowledge extracted from the public document'),
  title: z.string().describe('Precise title of the innovation case or project'),
  problemSummary: z.string().describe('Summary of the societal issue or challenge addressed'),
  solutionSummary: z.string().describe('Technical or operational solution implemented or proposed'),
  outcome: z.string().describe('Measurable outcome, impact, or status of the intervention'),
  domain: z.string().describe('Primary domain (e.g. Water Security, Mining & Geo-hazards, Agriculture, Public Health, Infrastructure, Renewable Energy)'),
  domainTags: z.array(z.string()).describe('Tags related to this knowledge item'),
  locationOrDistrict: z.string().describe('Mentioned district, state, or location context'),
  keyTechnologiesUsed: z.array(z.string()).describe('Key hardware, software, or scientific methodologies identified'),
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
