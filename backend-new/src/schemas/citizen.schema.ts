import { z } from 'zod';

export const CreateGrievanceSchema = z.object({
  raw_text: z.string().optional(),
  text: z.string().optional(),
  rawDescription: z.string().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
  district: z.string().min(2, 'District is required').default('Ranchi'),
  block: z.string().optional(),
  domain: z.string().optional(),
  language: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  anonymous_session_id: z.string().optional(),
  photos: z.array(z.string()).max(5).optional(),
  video: z.string().optional(),
  attachments: z.union([
    z.object({
      photos: z.array(z.string()).optional(),
      video: z.string().optional().nullable(),
    }),
    z.array(z.any()),
  ]).optional(),
}).refine(
  (data) => !!(data.raw_text || data.text || data.rawDescription || data.description || data.title),
  { message: 'Problem description text is required' }
);

export const ClaimGrievanceSchema = z.object({
  claimToken: z.string().min(10, 'Valid claim token is required'),
});

export const GrievanceQuerySchema = z.object({
  page: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).optional(),
  limit: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).optional(),
  district: z.string().optional(),
  domain: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().optional(),
});
