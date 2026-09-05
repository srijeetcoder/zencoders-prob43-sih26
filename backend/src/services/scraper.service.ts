export interface ScrapedWebDocument {
  url: string;
  title: string;
  metaDescription: string;
  cleanedText: string;
  contentLength: number;
}

/**
 * Public Web Scraper & Document Parser (Zero-Dependency & Resilient)
 * Fetches HTML from public URLs, removes boilerplate, scripts, ads, and navigations,
 * and extracts clean body text for LLM knowledge extraction.
 */
export async function scrapeWebPage(url: string): Promise<ScrapedWebDocument> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (Jharkhand-Innovation-Crawler/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP fetch failed with status ${response.status} (${response.statusText})`);
    }

    const html = await response.text();

    // 1. Extract Title
    let title = 'Public Web Document';
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

    if (ogTitleMatch && ogTitleMatch[1]) {
      title = ogTitleMatch[1].trim();
    } else if (titleTagMatch && titleTagMatch[1]) {
      title = titleTagMatch[1].trim();
    } else if (h1Match && h1Match[1]) {
      title = h1Match[1].trim();
    }

    // 2. Extract Meta Description
    let metaDescription = '';
    const metaDescMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (metaDescMatch && metaDescMatch[1]) {
      metaDescription = metaDescMatch[1].trim();
    }

    // 3. Strip non-content blocks (scripts, styles, svg, nav, footer, header)
    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');

    // 4. Strip all remaining HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, ' ');

    // 5. Decode common HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // 6. Normalize whitespace
    cleaned = cleaned
      .replace(/\r\n|\r|\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Cap at 12,000 characters for token safety
    const cleanedText = cleaned.slice(0, 12000);

    return {
      url,
      title,
      metaDescription,
      cleanedText,
      contentLength: cleanedText.length,
    };
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out while connecting to ${url}`);
    }
    throw new Error(`Scraper failed for ${url}: ${error.message}`);
  }
}
