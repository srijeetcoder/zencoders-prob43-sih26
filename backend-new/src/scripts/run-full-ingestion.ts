import '../config/env';
import { JHARKHAND_QUERIES, JharkhandQueryItem } from '../data/jharkhand_queries';
import { ingestSingleUrlToVectorStore, ingestDirectContentToVectorStore, ensureHnswIndexing } from '../workers/ingestion.worker';
import { searchWithFirecrawl, getFirecrawlApiKeys } from '../services/firecrawl.service';
import { searchLiveWeb } from '../services/scraper.service';
import { query } from '../config/database';

interface ParallelHarvestOptions {
  startIndex?: number;
  batchSize?: number;
  urlsPerQuery?: number;
  concurrency?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processSingleQuery(
  q: JharkhandQueryItem,
  urlsPerQuery: number,
  isFirecrawlActive: boolean
): Promise<{ approved: number; rejected: number; duplicates: number; discovered: number }> {
  let approved = 0;
  let rejected = 0;
  let duplicates = 0;
  let discovered = 0;

  try {
    if (isFirecrawlActive) {
      const fcResults = await searchWithFirecrawl(q.query, urlsPerQuery);
      if (fcResults.length > 0) {
        discovered = fcResults.length;
        for (const item of fcResults) {
          if (item.markdown && item.markdown.length >= 250) {
            const res = await ingestDirectContentToVectorStore(item.url, item.title, item.markdown, q.category);
            if (res.success) {
              approved++;
            } else {
              if (res.reason?.includes('below required A+ threshold')) rejected++;
              else if (res.reason?.includes('Duplicate')) duplicates++;
            }
          } else {
            const res = await ingestSingleUrlToVectorStore(item.url, q.category);
            if (res.success) approved++;
          }
        }
        return { approved, rejected, duplicates, discovered };
      }
    }

    // Fallback search
    const urls: string[] = [];
    const tavilyKey = process.env.TAVILY_API_KEY;
    if (tavilyKey && tavilyKey !== 'mock-api-key') {
      try {
        const res = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: `${q.query} Jharkhand`,
            search_depth: 'advanced',
            max_results: urlsPerQuery,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.results && Array.isArray(data.results)) {
            for (const item of data.results) {
              if (item.url && !urls.includes(item.url)) urls.push(item.url);
            }
          }
        }
      } catch {}
    }

    if (urls.length === 0) {
      try {
        const live = await searchLiveWeb(`${q.query} Jharkhand`, urlsPerQuery);
        for (const u of live) if (!urls.includes(u)) urls.push(u);
      } catch {}
    }

    discovered = urls.length;
    for (const u of urls) {
      const res = await ingestSingleUrlToVectorStore(u, q.category);
      if (res.success) approved++;
      else {
        if (res.reason?.includes('below required A+ threshold')) rejected++;
        else if (res.reason?.includes('Duplicate')) duplicates++;
      }
      await sleep(300);
    }
  } catch (err: any) {
    console.warn(`[Query #${q.id}] Processing notice: ${err.message}`);
  }

  return { approved, rejected, duplicates, discovered };
}

export async function runTurboHarvest() {
  const args = process.argv.slice(2);
  const startIndex = args[0] ? parseInt(args[0], 10) : 0;
  const batchSize = args[1] ? parseInt(args[1], 10) : JHARKHAND_QUERIES.length;
  const urlsPerQuery = args[2] ? parseInt(args[2], 10) : 2;
  const concurrency = args[3] ? parseInt(args[3], 10) : 4; // 4 parallel query threads by default

  const targetQueries = JHARKHAND_QUERIES.slice(startIndex, startIndex + batchSize);
  const firecrawlKeys = getFirecrawlApiKeys();
  const isFirecrawlActive = firecrawlKeys.length > 0;

  console.log(`\n================================================================`);
  console.log(`⚡ TURBO MULTI-KEY PARALLEL A+ HARVESTING ENGINE`);
  console.log(`🔑 Firecrawl API Key Pool: ${firecrawlKeys.length} Key(s) Configured (Auto-Rotating)`);
  console.log(`🧵 Concurrency: ${concurrency} Parallel Query Workers`);
  console.log(`📊 Processing ${targetQueries.length} Queries (#${startIndex + 1} to #${startIndex + targetQueries.length} of ${JHARKHAND_QUERIES.length})`);
  console.log(`🎯 Estimated Speed: ~${Math.round((targetQueries.length / (concurrency * 15)) * 10) / 10} to ${Math.round((targetQueries.length / (concurrency * 8)) * 10) / 10} minutes total`);
  console.log(`================================================================\n`);

  await ensureHnswIndexing();

  let totalApproved = 0;
  let totalRejected = 0;
  let totalDuplicates = 0;
  let totalDiscovered = 0;
  const startTime = Date.now();

  // Execute in parallel batches of size `concurrency`
  for (let i = 0; i < targetQueries.length; i += concurrency) {
    const chunk = targetQueries.slice(i, i + concurrency);
    const chunkIndices = chunk.map((q, idx) => `[#${q.id} ${q.category}]`).join(', ');
    console.log(`🚀 Dispatching Parallel Batch (${i + 1}-${Math.min(i + concurrency, targetQueries.length)}/${targetQueries.length}): ${chunkIndices}`);

    const results = await Promise.all(
      chunk.map((q) => processSingleQuery(q, urlsPerQuery, isFirecrawlActive))
    );

    for (const r of results) {
      totalApproved += r.approved;
      totalRejected += r.rejected;
      totalDuplicates += r.duplicates;
      totalDiscovered += r.discovered;
    }

    // Milestone reporting
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const dbCount = await query(`SELECT COUNT(*) as count, AVG(credibility_score) as avg_score FROM innovation_memory;`);
    console.log(`   📈 Milestone [${Math.min(i + concurrency, targetQueries.length)}/${targetQueries.length}] | DB Total: ${dbCount.rows[0].count} A+ Cases | Batch Approved: +${totalApproved} | Dups Blocked: ${totalDuplicates} | Elapsed: ${elapsedSec}s\n`);
  }

  const durationMin = Math.round((Date.now() - startTime) / 60000);
  const finalDb = await query(`SELECT COUNT(*) as count, AVG(credibility_score) as avg_score FROM innovation_memory;`);
  console.log(`================================================================`);
  console.log(`🎉 HARVEST PASS COMPLETE in ${durationMin} minute(s)!`);
  console.log(`   • Total Records in pgvector Memory: ${finalDb.rows[0].count}`);
  console.log(`   • Newly Vectorized A+ Interventions: ${totalApproved}`);
  console.log(`   • Average Credibility: ${Math.round(finalDb.rows[0].avg_score || 0)}/100`);
  console.log(`================================================================\n`);
}

// Auto-run immediately when invoked via npx tsx
runTurboHarvest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
