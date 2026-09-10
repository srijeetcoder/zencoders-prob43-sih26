import { query, vectorQuery, formatVector } from '../config/database';
import { DatabaseError, RagIsolationError } from '../utils/errors';

export interface RagChunkResult {
  id: string;
  document_id: string;
  content: string;
  domain: string;
  metadata: Record<string, any>;
  distance: number;
}

export class RagRepository {
  /**
   * Enforces strict SQL-level domain isolation.
   * Rejects any query without an explicit domain constraint.
   */
  async searchByDomain(options: {
    embedding: number[];
    domain: string;
    limit?: number;
    threshold?: number;
  }): Promise<RagChunkResult[]> {
    if (!options.domain || options.domain.trim() === '') {
      throw new RagIsolationError('Domain parameter is mandatory for secure RAG retrieval');
    }

    const limit = options.limit || 5;
    const vectorStr = formatVector(options.embedding);

    try {
      // 1. Query rag_chunks table in Neon vector DB with strict SQL WHERE domain = $2
      const chunkRes = await vectorQuery<RagChunkResult>(
        `SELECT
            id,
            document_id,
            content,
            domain,
            metadata,
            (embedding <=> $1::vector) AS distance
         FROM rag_chunks
         WHERE domain ILIKE $2
         ORDER BY embedding <=> $1::vector ASC
         LIMIT $3;`,
        [vectorStr, options.domain.trim(), limit]
      );

      // If we got results from rag_chunks, return them
      if (chunkRes.rows.length > 0) {
        return chunkRes.rows;
      }

      // 2. Fallback check on innovation_memory with mandatory SQL WHERE domain = $2
      const memRes = await vectorQuery<{
        id: string;
        title: string;
        problem_summary: string;
        solution_summary: string;
        outcome: string;
        domain: string;
        distance: number;
      }>(
        `SELECT
            id,
            title,
            problem_summary,
            solution_summary,
            outcome,
            domain,
            (embedding <=> $1::vector) AS distance
         FROM innovation_memory
         WHERE domain ILIKE $2
         ORDER BY embedding <=> $1::vector ASC
         LIMIT $3;`,
        [vectorStr, options.domain.trim(), limit]
      );

      return memRes.rows.map((row) => ({
        id: row.id,
        document_id: row.id,
        content: `Title: ${row.title}. Problem: ${row.problem_summary} Solution: ${row.solution_summary || ''} Outcome: ${row.outcome}`,
        domain: row.domain,
        metadata: { title: row.title },
        distance: row.distance,
      }));
    } catch (err: any) {
      if (err instanceof RagIsolationError) throw err;
      throw new DatabaseError(`Secure RAG retrieval failed: ${err.message}`);
    }
  }

  async indexChunk(data: {
    document_id: string;
    content: string;
    domain: string;
    embedding: number[];
    metadata?: Record<string, any>;
  }): Promise<string> {
    if (!data.domain) throw new RagIsolationError('Domain is mandatory when indexing RAG chunks');
    try {
      const res = await vectorQuery<{ id: string }>(
        `INSERT INTO rag_chunks (document_id, content, domain, embedding, metadata)
         VALUES ($1, $2, $3, $4::vector, $5)
         RETURNING id;`,
        [data.document_id, data.content, data.domain, formatVector(data.embedding), JSON.stringify(data.metadata || {})]
      );
      return res.rows[0].id;
    } catch (err: any) {
      throw new DatabaseError(`Failed to index RAG chunk: ${err.message}`);
    }
  }

  async createDocument(data: {
    title: string;
    domain: string;
    source_url?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    try {
      const res = await vectorQuery<{ id: string }>(
        `INSERT INTO rag_documents (title, domain, source_url, metadata)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`,
        [data.title, data.domain, data.source_url || null, JSON.stringify(data.metadata || {})]
      );
      return res.rows[0].id;
    } catch (err: any) {
      throw new DatabaseError(`Failed to create RAG document: ${err.message}`);
    }
  }
}

export const ragRepo = new RagRepository();
