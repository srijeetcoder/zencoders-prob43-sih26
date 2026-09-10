import { ragRepo, RagChunkResult } from '../repositories/rag.repo';
import { generateEmbedding } from './embedding.service';
import { RagIsolationError } from '../utils/errors';

export interface RagContext {
  domain: string;
  query: string;
  evidence: RagChunkResult[];
  formattedContext: string;
  sourceIds: string[];
}

export class RagService {
  /**
   * Retrieves domain-isolated evidence for RAG augmentation.
   * Enforces SQL-level WHERE domain = $2 filter.
   */
  async retrieveDomainContext(query: string, domain: string, limit: number = 3): Promise<RagContext> {
    if (!domain || domain.trim() === '') {
      throw new RagIsolationError('Domain parameter is mandatory for RAG retrieval.');
    }

    // 1. Generate query embedding
    const embedding = await generateEmbedding(query);

    // 2. Perform strictly domain-scoped vector search in PostgreSQL
    const evidence = await ragRepo.searchByDomain({
      embedding,
      domain: domain.trim(),
      limit,
    });

    // 3. Construct clean prompt context
    const formattedContext = evidence.length > 0
      ? evidence
          .map((chunk, idx) => `[Source ${idx + 1} | Domain: ${chunk.domain}]\n${chunk.content}`)
          .join('\n\n')
      : 'No prior domain-specific engineering case studies indexed.';

    return {
      domain,
      query,
      evidence,
      formattedContext,
      sourceIds: evidence.map((e) => e.id),
    };
  }
}

export const ragService = new RagService();
