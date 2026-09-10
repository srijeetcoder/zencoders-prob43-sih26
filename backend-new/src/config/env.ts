import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env in current working directory and workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('5000'),
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('jharkhand_innovation_db'),
  PG_POOL_MIN: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('2'),
  PG_POOL_MAX: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('20'),
  PG_IDLE_TIMEOUT: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('30000'),
  PG_CONNECTION_TIMEOUT: z.string().or(z.number()).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default('5000'),
  JWT_SECRET: z.string().default('pukaar-jharkhand-sih-2026-super-secret-key-prod-grade'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('*'),
  GEMINI_API_KEY: z.string().default(process.env.GEMINI_API_KEY || ''),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  GEMINI_EMBEDDING_MODEL: z.string().default('text-embedding-004'),
  FIRECRAWL_API_KEY: z.string().optional(),
  FIRECRAWL_API_KEYS: z.string().optional(),
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  ONNX_MODEL_PATH: z.string().default('models/master_router.onnx'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  throw new Error('Invalid environment variables configuration');
}

export const env = parsedEnv.data;

