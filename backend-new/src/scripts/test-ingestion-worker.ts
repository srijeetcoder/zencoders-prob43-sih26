import { JHARKHAND_QUERIES, getRandomQueries } from '../data/jharkhand_queries';
import { triggerDailyIngestionRoutine, ensureHnswIndexing, getIngestionWorkerStats } from '../workers/ingestion.worker';
import { query } from '../config/database';

async function runTest() {
  console.log('🧪 Starting Verification Test for Automated A+ Data Ingestion Pipeline...\n');

  // Test 1: Verify Query Dataset
  console.log(`[Test 1] Checking Jharkhand Queries Dataset...`);
  console.log(`- Total Queries Loaded: ${JHARKHAND_QUERIES.length}`);
  if (JHARKHAND_QUERIES.length !== 300) {
    throw new Error(`Expected 300 queries, got ${JHARKHAND_QUERIES.length}`);
  }

  const sample = getRandomQueries(3);
  console.log('- Sample Random Queries:', sample.map(s => `[#${s.id} ${s.category}] "${s.query}"`));

  // Test 2: Verify PostgreSQL & HNSW Indexing
  console.log(`\n[Test 2] Ensuring PostgreSQL Schema & HNSW Indexing...`);
  await ensureHnswIndexing();
  const hnswCheck = await query(`
    SELECT indexname, indexdef 
    FROM pg_indexes 
    WHERE tablename = 'innovation_memory' AND indexname = 'innovation_memory_embedding_hnsw_idx';
  `);
  console.log(`- HNSW Index Found: ${hnswCheck.rows.length > 0 ? 'YES ✅' : 'NO ❌'}`);

  // Test 3: Run Ingestion Routine
  console.log(`\n[Test 3] Executing Mini Ingestion Routine Pass (2 queries, 2 URLs each)...`);
  const stats = await triggerDailyIngestionRoutine(2, 2);

  console.log(`\n[Test 3 Results] Execution Statistics:`, JSON.stringify(stats, null, 2));

  // Test 4: Verify Innovation Memory Record Counts
  const memCount = await query(`SELECT COUNT(*) as total, AVG(credibility_score) as avg_score FROM innovation_memory;`);
  console.log(`\n[Test 4] Database Status:`);
  console.log(`- Total Records in innovation_memory: ${memCount.rows[0].total}`);
  console.log(`- Database Average Credibility Score: ${Math.round(memCount.rows[0].avg_score || 0)}/100`);

  console.log('\n🎉 Verification Test Completed Successfully!');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
