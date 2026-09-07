export class ScraperBlockedError extends Error {
  constructor(message: string = 'SCRAPER_BLOCKED: Insufficient content retrieved (likely behind paywall, captcha, or bot protection).') {
    super(message);
    this.name = 'ScraperBlockedError';
    Object.setPrototypeOf(this, ScraperBlockedError.prototype);
  }
}

export interface ScrapedWebDocument {
  url: string;
  title: string;
  metaDescription: string;
  cleanedText: string;
  contentLength: number;
  extractedLinks: string[];
}

const BLOCKED_SIGNATURES = [
  'access denied',
  '403 forbidden',
  'enable javascript',
  'cloudflare',
  'captcha',
  'subscribe to read',
  'please sign in',
];

/**
 * Robust Web Page Scraper (with Readability & Outlink extraction)
 */
export async function scrapeWebPage(url: string): Promise<ScrapedWebDocument> {
  let html = '';
  let cleanTitle = 'Public Web Document';
  let cleanExcerpt = '';
  const extractedLinks: string[] = [];

  // 0. Primary: Firecrawl AI Web Scraper (if configured)
  try {
    const { scrapeUrlWithFirecrawl } = await import('./firecrawl.service');
    const firecrawlResult = await scrapeUrlWithFirecrawl(url);
    if (firecrawlResult && firecrawlResult.markdown && firecrawlResult.markdown.length >= 300) {
      return {
        url,
        title: firecrawlResult.title || cleanTitle,
        metaDescription: '',
        cleanedText: firecrawlResult.markdown,
        contentLength: firecrawlResult.markdown.length,
        extractedLinks: [],
      };
    }
  } catch {}

  const browserHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: browserHeaders,
    });

    clearTimeout(timeout);

    if (response.ok) {
      html = await response.text();
    }
  } catch {}

  if (!html || html.length < 200) {
    try {
      let puppeteerModule: any = null;
      try {
        puppeteerModule = await import('puppeteer');
      } catch {}

      if (puppeteerModule && puppeteerModule.default) {
        const browser = await puppeteerModule.default.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        });

        try {
          const page = await browser.newPage();
          await page.setUserAgent(browserHeaders['User-Agent']);
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await new Promise((r) => setTimeout(r, 800));
          html = await page.content();
        } finally {
          await browser.close();
        }
      }
    } catch {}
  }

  if (!html || html.trim().length === 0) {
    throw new ScraperBlockedError('SCRAPER_BLOCKED: Insufficient content retrieved.');
  }

  // Extract outlinks for related discovery
  try {
    const linkRegex = /href=["'](https?:\/\/[^"'>\s]+)["']/gi;
    let match;
    const urlObj = new URL(url);
    while ((match = linkRegex.exec(html)) !== null) {
      const link = match[1];
      if (
        !link.includes('facebook.com') &&
        !link.includes('twitter.com') &&
        !link.includes('instagram.com') &&
        !link.includes('linkedin.com') &&
        !link.includes('youtube.com') &&
        !link.includes('google.com') &&
        !link.includes('login') &&
        !link.includes('signup') &&
        !link.endsWith('.pdf') &&
        !link.endsWith('.jpg') &&
        !link.endsWith('.png')
      ) {
        if (!extractedLinks.includes(link)) {
          extractedLinks.push(link);
        }
      }
    }
  } catch {}

  let cleanText = '';
  try {
    const { JSDOM } = await import('jsdom');
    const { Readability } = await import('@mozilla/readability');

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const parsedArticle = reader.parse();

    if (parsedArticle && parsedArticle.textContent && parsedArticle.textContent.trim().length > 100) {
      cleanTitle = parsedArticle.title || cleanTitle;
      cleanExcerpt = parsedArticle.excerpt || '';
      cleanText = parsedArticle.textContent;
    }
  } catch {}

  if (!cleanText || cleanText.length < 200) {
    const preCleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');

    let extractedBody = '';
    const pMatches = preCleanedHtml.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi);
    if (pMatches && pMatches.length > 0) {
      extractedBody = pMatches.join(' ');
    } else {
      extractedBody = preCleanedHtml;
    }

    cleanText = extractedBody
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ');
  }

  // Strip boilerplate, navigation noise, cookie notices, and site chrome
  cleanText = stripBoilerplateAndNoise(cleanText);

  const lowerText = cleanText.toLowerCase();
  for (const signature of BLOCKED_SIGNATURES) {
    if (lowerText.includes(signature)) {
      throw new ScraperBlockedError(`SCRAPER_BLOCKED: Detected anti-bot/paywall signature ("${signature}").`);
    }
  }

  // Enforce strict minimum length check: reject chunks < 300 meaningful characters
  if (cleanText.length < 300) {
    throw new ScraperBlockedError(`SCRAPER_BLOCKED: Extracted meaningful content is too short (${cleanText.length} chars, minimum 300 required).`);
  }

  return {
    url,
    title: cleanTitle,
    metaDescription: cleanExcerpt || cleanText.slice(0, 180),
    cleanedText: cleanText.slice(0, 15000),
    contentLength: cleanText.length,
    extractedLinks: extractedLinks.slice(0, 25),
  };
}

/**
 * Strips common boilerplate, cookie notices, navigation headers, and footer noise
 */
export function stripBoilerplateAndNoise(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Strip cookie banners & privacy notices
    .replace(/(?:we use cookies|this website uses cookies|accept all cookies|manage cookie preferences|cookie policy|privacy policy|terms of service|terms of use|all rights reserved|copyright ©\s*\d{4})[^\.\n]*[\.\n]/gi, ' ')
    // Strip Wikipedia navigation chrome & template artifacts
    .replace(/jump to navigation/gi, ' ')
    .replace(/jump to search/gi, ' ')
    .replace(/from wikipedia, the free encyclopedia/gi, ' ')
    .replace(/coordinates:\s*\d+°\d+′[\d\.]*″[NS]\s*\d+°\d+′[\d\.]*″[EW]/gi, ' ')
    .replace(/contents\s*\[\s*hide\s*\]/gi, ' ')
    .replace(/\[\s*edit\s*\]/gi, ' ')
    .replace(/\[\s*\d+\s*\]/g, ' ') // Reference markers like [1], [2]
    .replace(/(?:see also|references|external links|further reading|bibliography|notes)\s*$/gim, ' ')
    // Strip social share / newsletter subscription chrome
    .replace(/(?:subscribe to our newsletter|sign up for updates|follow us on (?:twitter|facebook|linkedin|instagram|youtube)|share on (?:twitter|facebook|whatsapp)|download the app)[^\.\n]*[\.\n]/gi, ' ')
    // Normalize whitespace and special characters
    .replace(/\t+/g, ' ')
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Live Web Search Engine (queries DuckDuckGo & Public HTML Search for live related sources)
 */
export async function searchLiveWeb(queryStr: string, maxResults: number = 10): Promise<string[]> {
  const discoveredUrls: string[] = [];
  const cleanQuery = encodeURIComponent(queryStr.trim());

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const searchUrl = `https://html.duckduckgo.com/html/?q=${cleanQuery}`;
    const res = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      // Extract result URLs from DuckDuckGo HTML format
      const uddgRegex = /class="result__url"[^>]*href="([^"]+)"|href="\/\/duckduckgo\.com\/l\/\?uddg=([^"&]+)/gi;
      let m;
      while ((m = uddgRegex.exec(html)) !== null) {
        let rawUrl = m[1] || m[2];
        if (rawUrl) {
          try {
            const decoded = decodeURIComponent(rawUrl);
            if (
              decoded.startsWith('http') &&
              !decoded.includes('duckduckgo.com') &&
              !decoded.includes('youtube.com') &&
              !decoded.includes('twitter.com') &&
              !decoded.includes('facebook.com') &&
              !discoveredUrls.includes(decoded)
            ) {
              discoveredUrls.push(decoded);
            }
          } catch {}
        }
      }
    }
  } catch (err: any) {
    console.warn(`[WebSearch] Live search notice: ${err.message}`);
  }

  return discoveredUrls.slice(0, maxResults);
}
