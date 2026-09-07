export interface FirecrawlSearchResult {
  url: string;
  title: string;
  markdown?: string;
  description?: string;
}

let keyIndex = 0;

/**
 * Retrieves the pool of configured Firecrawl API keys (supports comma-separated list)
 */
export function getFirecrawlApiKeys(): string[] {
  const keysStr = process.env.FIRECRAWL_API_KEYS || process.env.FIRECRAWL_API_KEY || '';
  return keysStr
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 5 && k.startsWith('fc-') && k !== 'mock-api-key');
}

/**
 * Returns the next available Firecrawl API key via Round-Robin rotation
 */
function getNextFirecrawlKey(): string | null {
  const keys = getFirecrawlApiKeys();
  if (keys.length === 0) return null;
  const selected = keys[keyIndex % keys.length];
  keyIndex++;
  return selected;
}

/**
 * Executes a search & extract query via Firecrawl API (v1) with automated Key Rotation & Failover
 */
export async function searchWithFirecrawl(queryText: string, limit: number = 3): Promise<FirecrawlSearchResult[]> {
  const keys = getFirecrawlApiKeys();
  if (keys.length === 0) {
    return [];
  }

  // Try up to the number of available keys in case of rate limits
  for (let attempt = 0; attempt < Math.min(keys.length, 3); attempt++) {
    const apiKey = getNextFirecrawlKey();
    if (!apiKey) break;

    try {
      const res = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: `${queryText} Jharkhand`,
          limit,
          scrapeOptions: {
            formats: ['markdown'],
          },
        }),
      });

      if (res.status === 429 || res.status === 402) {
        console.warn(`[Firecrawl] Key (${apiKey.slice(0, 8)}...) hit limit/rate. Rotating to next key...`);
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Firecrawl] Search HTTP ${res.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const json = (await res.json()) as any;
      const results: FirecrawlSearchResult[] = [];

      const items = json.data || json.results || [];
      for (const item of items) {
        if (item.url) {
          results.push({
            url: item.url,
            title: item.title || item.metadata?.title || 'Public Web Document',
            markdown: item.markdown || item.content || '',
            description: item.description || item.metadata?.description || '',
          });
        }
      }

      return results;
    } catch (err: any) {
      console.warn(`[Firecrawl] Search attempt failed: ${err.message}`);
    }
  }

  return [];
}

/**
 * Scrapes a single URL to clean markdown using Firecrawl with Key Rotation
 */
export async function scrapeUrlWithFirecrawl(url: string): Promise<{ title: string; markdown: string } | null> {
  const keys = getFirecrawlApiKeys();
  if (keys.length === 0) return null;

  for (let attempt = 0; attempt < Math.min(keys.length, 3); attempt++) {
    const apiKey = getNextFirecrawlKey();
    if (!apiKey) break;

    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
        }),
      });

      if (res.status === 429 || res.status === 402) {
        continue;
      }

      if (!res.ok) return null;

      const json = (await res.json()) as any;
      const data = json.data || json;
      if (data && data.markdown) {
        return {
          title: data.metadata?.title || 'Public Web Document',
          markdown: data.markdown,
        };
      }
      return null;
    } catch {
      continue;
    }
  }

  return null;
}
