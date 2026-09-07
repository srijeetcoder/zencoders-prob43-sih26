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
    .enum(['CASE_STUDY', 'PROBLEM_REPORT', 'POLICY_ISSUE', 'EMERGING_CHALLENGE', 'NEWS_EVENT'])
    .describe('Type of knowledge extracted from the public document'),
  title: z.string().describe('Precise title of the innovation, report, challenge, or policy'),
  problemSummary: z.string().describe("CRITICAL: Synthesize a professional, concise 1-3 sentence summary of the core issue. DO NOT copy-paste raw text, menus, or unrelated news tickers. Filter out any website navigation noise."),
  solutionSummary: z
    .string()
    .nullable()
    .describe(
      'Only fill if the source explicitly describes a deployed or proposed intervention. If the article is purely about a problem, protest, or unresolved issue, this MUST be null.'
    ),
  outcome: z.string().describe('Measurable outcome, socio-economic impact, or documented status'),
  domain: z.string().describe('Primary domain (e.g. Socio-Economic & Tribal Welfare, Governance & Public Delivery, Mining & Geo-hazards, Water Quality & Hydrology, Agriculture & Minor Forest Produce, Public Health & Sanitation, Education & Skill Development, Infrastructure & Renewable Energy)'),
  domainTags: z.array(z.string()).describe('Tags related to this knowledge item'),
  locationOrDistrict: z.string().nullable().describe('Mentioned district, state, or location context, or null if unspecified'),
  keyTechnologiesUsed: z
    .array(z.string())
    .default([])
    .describe('Only list specific technologies, methodologies, or digital systems explicitly named. Return an empty array if none are discussed.'),
});

export const ExtractedKnowledgeSchema = ExtractedKnowledgeItemSchema;
export type ExtractedKnowledgeItem = z.infer<typeof ExtractedKnowledgeItemSchema>;
export type ExtractedKnowledge = ExtractedKnowledgeItem;

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

export const QueryKnowledgeInputSchema = z.object({
  question: z.string().min(2, 'Question must be at least 2 characters'),
  district: z.string().optional(),
  limit: z.number().optional().default(0),
});

export type QueryKnowledgeInput = z.infer<typeof QueryKnowledgeInputSchema>;

