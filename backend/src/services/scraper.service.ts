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
 * High-Performance Content Distillation Engine (Readability & Headless Browser Pipeline)
 * Renders JavaScript DOM, parses article structures via Mozilla Readability (Firefox Reader View algorithm),
 * strips Outbrain/Taboola widgets, carousels, and menus, and strictly validates content length.
 */
export async function scrapeWebPage(url: string): Promise<ScrapedWebDocument> {
  let html = '';
  let cleanTitle = 'Public Web Document';
  let cleanExcerpt = '';

  // 1. Try Puppeteer headless browser to render JavaScript (Times of India, SPAs, dynamic paywalls)
  try {
    let puppeteerModule: any = null;
    try {
      puppeteerModule = await import('puppeteer');
    } catch (importErr) {
      // Puppeteer module optional/fallback
    }

    if (puppeteerModule && puppeteerModule.default) {
      const browser = await puppeteerModule.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      });

      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        );
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
        });

        // Wait until network is idle or DOM is ready
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // Wait briefly for hydration
        await new Promise((r) => setTimeout(r, 1000));
        html = await page.content();
      } finally {
        await browser.close();
      }
    }
  } catch (pupErr: any) {
    console.info(`[WebScraper] Headless browser notice: ${pupErr.message}. Executing resilient direct HTTP stream...`);
  }

  // 2. Direct HTTP Fetch Fallback if Puppeteer is inactive
  if (!html || html.length < 200) {
    const browserHeaders = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'Upgrade-Insecure-Requests': '1',
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
    } catch (e: any) {
      console.info(`[WebScraper] Direct stream notice: ${e.message}`);
    }
  }

  // If no HTML was retrievable at all
  if (!html || html.trim().length === 0) {
    throw new ScraperBlockedError('SCRAPER_BLOCKED: Insufficient content retrieved (likely behind paywall, captcha, or bot protection).');
  }

  // 3. Mozilla Readability Engine via JSDOM
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
      cleanText = parsedArticle.textContent.replace(/\s{2,}/g, ' ').trim();
    }
  } catch (readabilityErr: any) {
    console.info(`[WebScraper] Readability parser notice: ${readabilityErr.message}. Executing heuristic DOM parser...`);
  }

  // 4. Heuristic DOM Fallback if Readability returned empty
  if (!cleanText || cleanText.length < 200) {
    const preCleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, ' ')
      .replace(/<div[^>]*class=["'][^"']*(?:sidebar|trending|menu|nav|lang-select|taboola|outbrain)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, ' ');

    let extractedBody = '';
    const pMatches = preCleanedHtml.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi);
    if (pMatches && pMatches.length > 0) {
      extractedBody = pMatches.join(' ');
    } else {
      extractedBody = preCleanedHtml;
    }

    cleanText = extractedBody
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // 5. Pre-LLM Guard: Check anti-bot / paywall signatures
  const lowerText = cleanText.toLowerCase();
  for (const signature of BLOCKED_SIGNATURES) {
    if (lowerText.includes(signature)) {
      throw new ScraperBlockedError(
        `SCRAPER_BLOCKED: Detected anti-bot/paywall signature ("${signature}"). Insufficient public content.`
      );
    }
  }

  // 6. Post-Distillation Length Guardrail (fewer than 500 characters)
  if (cleanText.length < 500) {
    throw new ScraperBlockedError(
      `SCRAPER_BLOCKED: Extracted content is too short (${cleanText.length} chars). Likely hit a paywall, captcha, or widget trap.`
    );
  }

  console.log(`[Scraper] Successfully extracted ${cleanText.length} chars from ${url}. Preview: "${cleanText.slice(0, 100)}..."`);

  return {
    url,
    title: cleanTitle,
    metaDescription: cleanExcerpt || cleanText.slice(0, 180),
    cleanedText: cleanText.slice(0, 12000),
    contentLength: cleanText.length,
  };
}

/**
 * Standalone convenience alias for clean article text extraction
 */
export async function scrapeArticle(url: string): Promise<string> {
  const doc = await scrapeWebPage(url);
  return doc.cleanedText;
}
