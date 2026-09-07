import cron from 'node-cron';
import { JHARKHAND_QUERIES, getRandomQueries, JharkhandQueryItem } from '../data/jharkhand_queries';
import { scrapeWebPage, stripBoilerplateAndNoise, searchLiveWeb, ScraperBlockedError } from '../services/scraper.service';
import { auditContentWithGemini } from '../services/curator.service';
import { generateEmbedding } from '../services/embedding.service';
import { query, formatVector, ensurePgvectorSchema768 } from '../config/database';
import { checkInnovationMemoryDuplicate } from '../services/deduplication.service';
import { detectAndTranslate } from '../services/translation.service';
import { env } from '../config/env';

export interface IngestionJobStats {
  jobId: string;
  startedAt: string;
  completedAt?: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  queriesProcessed: number;
  urlsDiscovered: number;
  urlsScraped: number;
  rejectedBelowThreshold: number;
  duplicatesBlocked: number;
  approvedAndStored: number;
  averageBatchScore: number;
  errors: string[];
}

let activeCronTask: cron.ScheduledTask | null = null;
let currentJobStats: IngestionJobStats = {
  jobId: 'init',
  startedAt: new Date().toISOString(),
  status: 'IDLE',
  queriesProcessed: 0,
  urlsDiscovered: 0,
  urlsScraped: 0,
  rejectedBelowThreshold: 0,
  duplicatesBlocked: 0,
  approvedAndStored: 0,
  averageBatchScore: 0,
  errors: [],
};

const CREDIBILITY_THRESHOLD = 85; // Strict A+ threshold (score >= 85)

/**
 * Searches external web for a specific query using Tavily, Google, or DuckDuckGo
 */
async function searchWebForQuery(queryText: string, maxResults: number = 5): Promise<string[]> {
  const discoveredUrls: string[] = [];
  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY || process.env.GOOGLE_API_KEY;
  const googleCx = process.env.GOOGLE_SEARCH_CX;

  // 1. Try Firecrawl Search API if configured
  if (firecrawlApiKey && firecrawlApiKey !== 'mock-api-key') {
    try {
      const { searchWithFirecrawl } = await import('../services/firecrawl.service');
      const fcResults = await searchWithFirecrawl(queryText, maxResults);
      for (const item of fcResults) {
        if (item.url && !discoveredUrls.includes(item.url)) {
          discoveredUrls.push(item.url);
        }
      }
      if (discoveredUrls.length > 0) {
        return discoveredUrls;
      }
    } catch {}
  }

  // 2. Try Tavily Search API if configured
  if (tavilyApiKey && tavilyApiKey !== 'mock-api-key') {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyApiKey,
          query: `${queryText} Jharkhand`,
          search_depth: 'advanced',
          include_domains: [
            'jharkhand.gov.in',
            'downtoearth.org.in',
            'thehindu.com',
            'tribuneindia.com',
            'indiatoday.in',
            'mongabay.com',
            'iitkgp.ac.in',
            'bitmesra.ac.in',
            'cimfr.nic.in',
            'en.wikipedia.org',
            'ndtv.com',
          ],
          max_results: maxResults,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.results && Array.isArray(data.results)) {
          for (const item of data.results) {
            if (item.url && !discoveredUrls.includes(item.url)) {
              discoveredUrls.push(item.url);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`[IngestionWorker] Tavily search fallback notice: ${e.message}`);
    }
  }

  // 2. Try Google Custom Search API if configured
  if (discoveredUrls.length === 0 && googleApiKey && googleCx) {
    try {
      const gUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${encodeURIComponent(queryText + ' Jharkhand')}&num=${maxResults}`;
      const res = await fetch(gUrl);
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.items && Array.isArray(data.items)) {
          for (const item of data.items) {
            if (item.link && !discoveredUrls.includes(item.link)) {
              discoveredUrls.push(item.link);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`[IngestionWorker] Google search fallback notice: ${e.message}`);
    }
  }

  // 3. Fallback to Live HTML Search Engine (DuckDuckGo + Targeted Query)
  if (discoveredUrls.length === 0) {
    try {
      const results = await searchLiveWeb(`${queryText} Jharkhand`, maxResults);
      for (const u of results) {
        if (!discoveredUrls.includes(u)) {
          discoveredUrls.push(u);
        }
      }
    } catch {}
  }

  return discoveredUrls;
}

/**
 * Ensures HNSW Vector Indexing is enabled on PostgreSQL pgvector table
 */
export async function ensureHnswIndexing(): Promise<void> {
  try {
    await ensurePgvectorSchema768();
    await query(`
      CREATE INDEX IF NOT EXISTS innovation_memory_embedding_hnsw_idx 
      ON innovation_memory USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);
    console.log('[IngestionWorker] ⚡ HNSW vector index verified on innovation_memory table.');
  } catch (err: any) {
    console.warn(`[IngestionWorker] HNSW index verification notice: ${err.message}`);
  }
}

/**
 * Directly ingests already-scraped or Firecrawl-extracted Markdown content through quality gate & vector insertion
 */
export async function ingestDirectContentToVectorStore(
  url: string,
  title: string,
  rawContent: string,
  categoryHint?: string
): Promise<{
  success: boolean;
  score?: number;
  reason?: string;
  insertedId?: string;
  title?: string;
}> {
  try {
    const sanitizedText = stripBoilerplateAndNoise(rawContent);

    if (!sanitizedText || sanitizedText.length < 300) {
      return {
        success: false,
        reason: `Content too short after sanitization (${sanitizedText?.length || 0} chars, min 300 required)`,
      };
    }

    // Step 1: Translation Normalization (Ensure English for AI Quality Gatekeeper)
    const translation = await detectAndTranslate(sanitizedText);
    const normalizedText = translation.translatedText || sanitizedText;

    // Step 4: AI Quality Gatekeeper (Gemini 1.5 Flash Evaluation)
    const audit = await auditContentWithGemini(normalizedText, title, url);

    // Strict rejection if below 85
    if (!audit.isCredible || audit.credibilityScore < CREDIBILITY_THRESHOLD) {
      console.info(
        `[IngestionWorker] ❌ Rejected: "${title}" (Score: ${audit.credibilityScore}/100 < ${CREDIBILITY_THRESHOLD})`
      );
      return {
        success: false,
        score: audit.credibilityScore,
        reason: `Credibility score (${audit.credibilityScore}/100) below required A+ threshold (${CREDIBILITY_THRESHOLD})`,
      };
    }

    // Step 5: Automated Embedding & Vector Storage (text-embedding-004, 768-dim)
    const vectorDoc = `Title: ${title}. Category: ${categoryHint || audit.extractedDomain}. Problem: ${audit.problemSummary}. Solution: ${audit.solutionSummary}. Outcome: ${audit.documentedOutcome}. Domain: ${audit.extractedDomain}. Source: ${url}`;
    const embedding = await generateEmbedding(vectorDoc);
    const formattedVector = formatVector(embedding);

    // Pre-ingestion Deduplication Gate
    const dupe = await checkInnovationMemoryDuplicate(embedding, url, title);
    if (dupe.isDuplicate) {
      console.info(`[IngestionWorker] 🛑 Duplicate Blocked: ${dupe.duplicateReason}`);
      return {
        success: false,
        score: audit.credibilityScore,
        reason: `Duplicate detected: ${dupe.duplicateReason}`,
      };
    }

    // Direct SQL Insertion into PostgreSQL pgvector with HNSW compatibility
    const insertSql = `
      INSERT INTO innovation_memory (
        title,
        problem_summary,
        solution_summary,
        outcome,
        domain,
        source_url,
        raw_content,
        credibility_score,
        audit_details,
        embedding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector)
      RETURNING id;
    `;

    const insertRes = await query(insertSql, [
      title,
      audit.problemSummary,
      audit.solutionSummary || 'Engineered public policy intervention.',
      audit.documentedOutcome || 'Documented in state innovation intelligence memory.',
      audit.extractedDomain || categoryHint || 'Governance & Public Delivery',
      url,
      sanitizedText.slice(0, 3000),
      audit.credibilityScore,
      JSON.stringify(audit),
      formattedVector,
    ]);

    const insertedId = insertRes.rows[0]?.id;
    console.log(`[IngestionWorker] ⭐ Approved & Stored A+ Memory [${insertedId}] (Score: ${audit.credibilityScore}/100) -> "${title}"`);

    return {
      success: true,
      score: audit.credibilityScore,
      insertedId,
      title,
    };
  } catch (err: any) {
    return {
      success: false,
      reason: err.message,
    };
  }
}

/**
 * Executes a single ingestion pass for a given URL through all 5 quality steps
 */
export async function ingestSingleUrlToVectorStore(url: string, categoryHint?: string): Promise<{
  success: boolean;
  score?: number;
  reason?: string;
  insertedId?: string;
  title?: string;
}> {
  try {
    // Step 2 & 3: Scraping, Sanitization & Boilerplate Stripping
    const scraped = await scrapeWebPage(url);
    return await ingestDirectContentToVectorStore(url, scraped.title, scraped.cleanedText, categoryHint);
  } catch (err: any) {
    return {
      success: false,
      reason: err.message,
    };
  }
}

/**
 * Triggers the complete Automated Data Harvesting Routine across Jharkhand queries
 */
export async function triggerDailyIngestionRoutine(
  queryCount: number = 5,
  urlsPerQuery: number = 3
): Promise<IngestionJobStats> {
  const jobId = `job_${Date.now()}`;
  console.log(`\n================================================================`);
  console.log(`🌾 [IngestionWorker] Starting Automated A+ Data Ingestion Routine: ${jobId}`);
  console.log(`================================================================`);

  currentJobStats = {
    jobId,
    startedAt: new Date().toISOString(),
    status: 'RUNNING',
    queriesProcessed: 0,
    urlsDiscovered: 0,
    urlsScraped: 0,
    rejectedBelowThreshold: 0,
    duplicatesBlocked: 0,
    approvedAndStored: 0,
    averageBatchScore: 0,
    errors: [],
  };

  await ensureHnswIndexing();

  const selectedQueries = getRandomQueries(queryCount);
  const totalScores: number[] = [];

  for (const q of selectedQueries) {
    console.log(`\n🔍 [Query ${q.id}/300] Category: [${q.category}] -> "${q.query}"`);
    currentJobStats.queriesProcessed++;

    try {
      const discoveredUrls = await searchWebForQuery(q.query, urlsPerQuery);
      currentJobStats.urlsDiscovered += discoveredUrls.length;

      for (const url of discoveredUrls) {
        currentJobStats.urlsScraped++;
        const result = await ingestSingleUrlToVectorStore(url, q.category);

        if (result.success && result.score) {
          currentJobStats.approvedAndStored++;
          totalScores.push(result.score);
        } else {
          if (result.reason?.includes('below required A+ threshold')) {
            currentJobStats.rejectedBelowThreshold++;
          } else if (result.reason?.includes('Duplicate')) {
            currentJobStats.duplicatesBlocked++;
          }
        }
      }
    } catch (err: any) {
      currentJobStats.errors.push(`Query #${q.id} Error: ${err.message}`);
    }
  }

  currentJobStats.completedAt = new Date().toISOString();
  currentJobStats.status = 'COMPLETED';
  currentJobStats.averageBatchScore =
    totalScores.length > 0
      ? Math.round((totalScores.reduce((a, b) => a + b, 0) / totalScores.length) * 10) / 10
      : 85;

  console.log(`================================================================`);
  console.log(`✅ [IngestionWorker] Harvesting Routine Completed: ${jobId}`);
  console.log(`   • Queries Processed: ${currentJobStats.queriesProcessed}`);
  console.log(`   • URLs Discovered: ${currentJobStats.urlsDiscovered}`);
  console.log(`   • A+ Approved & Vectorized: ${currentJobStats.approvedAndStored}`);
  console.log(`   • Rejected (< 85 Score): ${currentJobStats.rejectedBelowThreshold}`);
  console.log(`   • Duplicates Filtered: ${currentJobStats.duplicatesBlocked}`);
  console.log(`   • Average Credibility: ${currentJobStats.averageBatchScore}/100`);
  console.log(`================================================================\n`);

  return currentJobStats;
}

/**
 * Initializes and schedules the recurring cron worker
 * Default Schedule: Every day at 02:00 AM ('0 2 * * *')
 */
export function startIngestionCron(cronExpression: string = '0 2 * * *'): void {
  if (activeCronTask) {
    console.log('[IngestionWorker] Cron worker already running.');
    return;
  }

  console.log(`⏰ [IngestionWorker] Initializing Scheduled Cron Worker (${cronExpression})...`);
  activeCronTask = cron.schedule(cronExpression, async () => {
    console.log(`⏰ [IngestionWorker] Scheduled Cron Trigger fired at ${new Date().toISOString()}`);
    try {
      await triggerDailyIngestionRoutine(6, 3);
    } catch (err: any) {
      console.error('[IngestionWorker] Cron execution failure:', err.message);
    }
  });

  console.log('🚀 [IngestionWorker] Scheduled Daily Data Ingestion Cron Worker Active.');
}

/**
 * Stops the recurring cron worker gracefully
 */
export function stopIngestionCron(): void {
  if (activeCronTask) {
    activeCronTask.stop();
    activeCronTask = null;
    console.log('🛑 [IngestionWorker] Ingestion Cron worker stopped.');
  }
}

/**
 * Retrieves latest ingestion worker runtime statistics
 */
export function getIngestionWorkerStats(): IngestionJobStats {
  return currentJobStats;
}
