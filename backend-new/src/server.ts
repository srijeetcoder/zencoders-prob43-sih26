import { app } from './app';
import { env } from './config/env';
import { pool, ensurePgvectorSchema768, query, formatVector } from './config/database';
import { runMigrations } from './config/migrate';
import { onnxMasterOrchestrator } from './services/onnxOrchestrator.service';

async function bootstrap() {
  try {
    console.log('⚡ Initializing Master ONNX Orchestrator...');
    await onnxMasterOrchestrator.initSession();

    // 1. Run migrations to initialize all tables, roles, and reference districts
    await runMigrations();

    // 2. Ensure pgvector columns are 768 dimensions and HNSW index is active
    await ensurePgvectorSchema768();

    // 3. Auto-seed benchmark knowledge if database is missing WaterWatch
    try {
      const check = await query("SELECT COUNT(*) FROM innovation_memory WHERE title ILIKE '%WaterWatch%';");
      const count = parseInt(check.rows[0]?.count || '0', 10);
      if (count === 0) {
        console.log('🌱 Seeding WaterWatch (Benchmark) into Innovation Memory...');
        const cs = {
          title: 'WaterWatch Rural Canal Automation & Leakage Control',
          problem_summary: '14 villages in Palamu suffered 42% irrigation canal water loss due to undetected underground breached pipelines and lack of continuous monitoring.',
          solution_summary: 'Integrated ultrasonic clamp-on flow meters, piezoresistive pressure transducers, automated solar pinch-valves, and a bilingual GIS telemetry dashboard for the local Pani Samiti.',
          outcome: 'Achieved 38% reduction in canal water loss, reduced leak detection time from 4 days to 15 minutes, and boosted seasonal crop yields by 24%.',
          domain: 'Water Quality & Hydrology',
        };
        const text = `Title: ${cs.title}. Problem: ${cs.problem_summary} Solution: ${cs.solution_summary} Outcome: ${cs.outcome} Domain: ${cs.domain}`;
        const { generateEmbedding } = await import('./services/embedding.service');
        const vec = await generateEmbedding(text);
        await query(
          `INSERT INTO innovation_memory (title, problem_summary, solution_summary, outcome, domain, embedding)
           VALUES ($1, $2, $3, $4, $5, $6::vector);`,
          [cs.title, cs.problem_summary, cs.solution_summary, cs.outcome, cs.domain, formatVector(vec)]
        );
        console.log('✅ WaterWatch successfully committed to Innovation Memory.');
      }
    } catch (e: any) {
      console.warn(`[Bootstrap] Auto-seed notice: ${e.message}`);
    }

    const server = app.listen(env.PORT, () => {
      console.log(`================================================================`);
      console.log(`🏛️  SOCIETAL INNOVATION INTELLIGENCE ENGINE (SIH PS-43) - PRODUCTION BACKEND`);
      console.log(`📍 Government of Jharkhand Innovation Coordination Platform`);
      console.log(`🚀 Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
      console.log(`🔗 API Base: http://localhost:${env.PORT}/api/v1`);
      console.log(`💚 Health: http://localhost:${env.PORT}/health`);
      console.log(`================================================================`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Gracefully shutting down server...');
      server.close(async () => {
        console.log('✅ HTTP server closed.');
        try {
          await pool.end();
          console.log('✅ PostgreSQL connection pool drained.');
        } catch (e: any) {
          console.error('Error closing DB pool:', e.message);
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error: any) {
    console.error('❌ Error during server startup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

