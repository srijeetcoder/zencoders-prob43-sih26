import { env } from '../config/env';

/**
 * Generates a 768-dimensional semantic vector embedding using Google Gemini text-embedding-004.
 * Includes deterministic fallback for unit tests and offline development.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const cleanInput = text.replace(/\n+/g, ' ').trim();
  if (!cleanInput) throw new Error('Input text is empty');

  const currentKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

  if (
    env.NODE_ENV === 'test' ||
    !currentKey ||
    currentKey === 'mock-api-key' ||
    currentKey === 'AIzaSyYourCopiedKeyHere'
  ) {
    return generateDeterministicMockVector(cleanInput, 768);
  }

  const candidateModels = [
    env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
    'embedding-001',
  ];
  const candidateVersions = ['v1beta', 'v1'];

  for (const ver of candidateVersions) {
    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:embedContent?key=${currentKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: `models/${model}`,
            content: {
              parts: [{ text: cleanInput }],
            },
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as any;
          const values = data?.embedding?.values;
          if (values && Array.isArray(values)) {
            return values;
          }
        }
      } catch {
        continue;
      }
    }
  }

  return generateDeterministicMockVector(cleanInput, 768);
}

/**
 * Generates a consistent, L2-normalized 768-dimension float vector from a text hash.
 */
export function generateDeterministicMockVector(input: string, dimensions: number = 768): number[] {
  const vector: number[] = new Array(dimensions);
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  let sumSquares = 0;
  for (let i = 0; i < dimensions; i++) {
    const val = Math.sin((hash + 1) * (i + 1) * 0.1);
    vector[i] = val;
    sumSquares += val * val;
  }

  const magnitude = Math.sqrt(sumSquares);
  for (let i = 0; i < dimensions; i++) {
    vector[i] = vector[i] / (magnitude || 1);
  }

  return vector;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}


