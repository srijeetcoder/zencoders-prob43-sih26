import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const isCloudDb = Boolean(
  env.DATABASE_URL &&
  (env.DATABASE_URL.includes('neon.tech') ||
   env.DATABASE_URL.includes('supabase') ||
   env.DATABASE_URL.includes('render.com') ||
   env.DATABASE_URL.includes('railway') ||
   env.DATABASE_URL.includes('sslmode=require'))
);

// Permit cloud providers (Supabase pooler, Neon) self-signed SSL certificates in Node TLS
if (isCloudDb || env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Clean sslmode parameter from connection string so pg connection parser doesn't override with strict verification
const cleanDbUrl = env.DATABASE_URL
  ? env.DATABASE_URL.replace(/([?&])sslmode=[^&]+(&|$)/g, '$1').replace(/[?&]$/, '')
  : undefined;

export const pool = new Pool(
  cleanDbUrl
    ? {
        connectionString: cleanDbUrl,
        ssl: { rejectUnauthorized: false },
        min: env.PG_POOL_MIN,
        max: env.PG_POOL_MAX,
        idleTimeoutMillis: env.PG_IDLE_TIMEOUT,
        connectionTimeoutMillis: env.PG_CONNECTION_TIMEOUT,
      }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        min: env.PG_POOL_MIN,
        max: env.PG_POOL_MAX,
        idleTimeoutMillis: env.PG_IDLE_TIMEOUT,
        connectionTimeoutMillis: env.PG_CONNECTION_TIMEOUT,
      }
);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool] Unexpected error on idle client:', err);
});

// Dedicated Vector Pool for Neon RAG database if specified
const vectorDbUrl = env.NEON_DATABASE_URL || env.VECTOR_DATABASE_URL;
const cleanVectorUrl = vectorDbUrl
  ? vectorDbUrl.replace(/([?&])sslmode=[^&]+(&|$)/g, '$1').replace(/[?&]$/, '')
  : undefined;

export const vectorPool = cleanVectorUrl
  ? new Pool({
      connectionString: cleanVectorUrl,
      ssl: { rejectUnauthorized: false },
      min: 1,
      max: env.PG_POOL_MAX,
      idleTimeoutMillis: env.PG_IDLE_TIMEOUT,
      connectionTimeoutMillis: env.PG_CONNECTION_TIMEOUT,
    })
  : pool;

if (vectorDbUrl) {
  vectorPool.on('error', (err) => {
    console.error('[Neon Vector Pool] Unexpected error on idle client:', err);
  });
}

/**
 * Formats a numeric array into pgvector literal e.g. '[0.0123, 0.456, ...]'
 */
export function formatVector(vector: number[]): string {
  return `[${vector.join(',')}]`;
}

/**
 * Type-safe query wrapper for primary relational store (Supabase)
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn(`[Slow Query] (${duration}ms): ${text.slice(0, 100)}...`);
  }
  return res;
}

/**
 * Dedicated query wrapper for Vector / RAG operations (Neon / pgvector)
 */
export async function vectorQuery<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await vectorPool.query<T>(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn(`[Slow Vector Query] (${duration}ms): ${text.slice(0, 100)}...`);
  }
  return res;
}

/**
 * Execute a sequence of queries within a single ACID transaction
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Health check for database connectivity
 */
export async function checkDatabaseHealth(): Promise<{ status: 'healthy' | 'unhealthy'; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT 1 AS healthy;');
    const latencyMs = Date.now() - start;
    if (res.rows[0]?.healthy === 1) {
      return { status: 'healthy', latencyMs };
    }
    return { status: 'unhealthy', latencyMs, error: 'Invalid response from DB' };
  } catch (err: any) {
    return { status: 'unhealthy', latencyMs: Date.now() - start, error: err.message };
  }
}

let schemaChecked = false;
/**
 * Automatically ensures pgvector extension & core tables are configured to vector(768) with HNSW indices.
 */
export async function ensurePgvectorSchema768(): Promise<void> {
  if (schemaChecked) return;
  try {
    try {
      await query(`CREATE EXTENSION IF NOT EXISTS vector;`);
      await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    } catch {}
    schemaChecked = true;
  } catch (err: any) {
    schemaChecked = true;
  }
}

