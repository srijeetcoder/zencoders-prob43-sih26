import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const isCloudDb = Boolean(
  env.DATABASE_URL &&
  (env.DATABASE_URL.includes('neon.tech') ||
   env.DATABASE_URL.includes('supabase') ||
   env.DATABASE_URL.includes('render.com') ||
   env.DATABASE_URL.includes('railway') ||
   env.DATABASE_URL.includes('sslmode=require'))
);

export const pool = new Pool(
  env.DATABASE_URL
    ? {
        connectionString: env.DATABASE_URL,
        ssl: isCloudDb || env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Helper to format numeric array to pgvector string literal e.g. '[0.0123, 0.456, ...]'
 */
export function formatVector(vector: number[]): string {
  return `[${vector.join(',')}]`;
}

/**
 * Type-safe query wrapper
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  return res;
}

let schemaChecked = false;
/**
 * Automatically ensures pgvector extension & tables are configured to vector(768) with HNSW indices.
 */
export async function ensurePgvectorSchema768(): Promise<void> {
  if (schemaChecked) return;
  try {
    // 1. Enable pgvector extension
    try {
      await query(`CREATE EXTENSION IF NOT EXISTS vector;`);
    } catch {}

    // 2. Create innovation_memory table if not existing
    await query(`
      CREATE TABLE IF NOT EXISTS innovation_memory (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        problem_summary TEXT,
        solution_summary TEXT,
        outcome TEXT,
        domain TEXT,
        source_url TEXT,
        raw_content TEXT,
        credibility_score NUMERIC DEFAULT 85,
        audit_details JSONB,
        embedding vector(768),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Ensure columns and types match 768 dimensions
    await query(`
      ALTER TABLE innovation_memory ALTER COLUMN embedding TYPE vector(768);
      ALTER TABLE innovation_memory ADD COLUMN IF NOT EXISTS credibility_score NUMERIC DEFAULT 85;
      ALTER TABLE innovation_memory ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE innovation_memory ADD COLUMN IF NOT EXISTS raw_content TEXT;
      ALTER TABLE innovation_memory ADD COLUMN IF NOT EXISTS audit_details JSONB;
    `);

    // 4. Ensure HNSW index
    await query(`
      CREATE INDEX IF NOT EXISTS innovation_memory_embedding_hnsw_idx 
      ON innovation_memory USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);

    schemaChecked = true;
  } catch (err: any) {
    schemaChecked = true;
  }
}
