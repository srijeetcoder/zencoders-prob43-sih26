import { ragService } from '../src/services/rag.service';
import { RagIsolationError } from '../src/utils/errors';

describe('RAG Domain Isolation Tests (Rule 26, 27 & 28)', () => {
  it('should reject RAG retrieval when domain parameter is missing', async () => {
    await expect(ragService.retrieveDomainContext('Water leakage test', '')).rejects.toThrow(
      RagIsolationError
    );
  });

  it('should construct query context specifically tagged with the requested domain', async () => {
    const context = await ragService.retrieveDomainContext(
      'Rural classroom digital connectivity',
      'Education'
    );

    expect(context.domain).toBe('Education');
    expect(context.formattedContext).toBeDefined();
  });
});
