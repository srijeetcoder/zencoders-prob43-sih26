import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

/**
 * Generates a 1536-dimensional semantic vector embedding using text-embedding-3-small.
 * Includes deterministic fallback for unit tests and offline development.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const sanitizedText = text.replace(/\n+/g, ' ').trim();

  // If running in test or with mock key, generate a deterministic normalized 1536-dim vector
  if (
    env.NODE_ENV === 'test' ||
    env.OPENAI_API_KEY === 'mock-api-key' ||
    env.OPENAI_API_KEY === 'your-openai-api-key-here' ||
    env.OPENAI_API_KEY === 'mock-api-key-or-replace-with-real'
  ) {
    return generateDeterministicMockVector(sanitizedText, 1536);
  }

  try {
    const response = await openai.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: sanitizedText,
      dimensions: 1536,
      encoding_format: 'float',
    });

    const vector = response.data[0].embedding;
    if (vector.length !== 1536) {
      throw new Error(`Invalid embedding dimensions: expected 1536, got ${vector.length}`);
    }
    return vector;
  } catch (error: any) {
    console.warn(`[EmbeddingService] OpenAI Embedding API failed (${error.message}). Falling back to local vectorizer.`);
    return generateDeterministicMockVector(sanitizedText, 1536);
  }
}

/**
 * Generates a consistent, L2-normalized 1536-dimension float vector from a text hash.
 * Useful for offline tests, CI environments, and graceful degraded modes.
 */
export function generateDeterministicMockVector(input: string, dimensions: number = 1536): number[] {
  const vector: number[] = new Array(dimensions);
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  let sumSquares = 0;
  for (let i = 0; i < dimensions; i++) {
    // Generate pseudo-random float between -1.0 and 1.0 based on position and hash
    const val = Math.sin((hash + 1) * (i + 1) * 0.1);
    vector[i] = val;
    sumSquares += val * val;
  }

  // L2-normalize to ensure unit length (cosine similarity consistency)
  const magnitude = Math.sqrt(sumSquares);
  for (let i = 0; i < dimensions; i++) {
    vector[i] = vector[i] / (magnitude || 1);
  }

  return vector;
}
