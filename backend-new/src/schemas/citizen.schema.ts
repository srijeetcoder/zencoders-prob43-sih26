import { z } from 'zod';

export const CreateGrievanceSchema = z.object({
  raw_text: z.string().min(5, 'Complaint text must be at least 5 characters'),
  district: z.string().min(2, 'District is required'),
  block: z.string().optional(),
  domain: z.string().optional(),
  language: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  anonymous_session_id: z.string().optional(),
});

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
