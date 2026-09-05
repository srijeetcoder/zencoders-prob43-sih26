import request from 'supertest';
import { app } from '../src/app';

async function runFullE2ETestSuite() {
  console.log('\n================================================================');
  console.log('🧪 RUNNING SIH PS-43 KILLER WORKFLOW E2E TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`, details ? details : '');
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Health Check
  // ---------------------------------------------------------------------------
  console.log('📌 Test 1: GET /api/health');
  try {
    const res = await request(app).get('/api/health');
    assert(res.status === 200, 'Health check returns status 200');
    assert(res.body.status === 'online', 'Health status is "online"');
  } catch (err: any) {
    assert(false, 'Health check failed', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: SIH PS-43 Full Workflow (Example: Rural Irrigation Water Loss)
  // ---------------------------------------------------------------------------
  console.log('\n📌 Test 2: POST /api/problems/process (Rural Irrigation Water Loss)');
  try {
    const problemPayload = {
      rawDescription: 'Our village loses a lot of water because the existing irrigation system leaks and nobody knows where.',
      district: 'Palamu',
    };

    const res = await request(app)
      .post('/api/problems/process')
      .send(problemPayload);

    assert(res.status === 200, 'Workflow executed with status 200');
    const data = res.body.data;

    // Step 1: Problem DNA
    assert(Array.isArray(data.problemDNA) && data.problemDNA.length > 0, `Step 1 — Problem DNA: [${data.problemDNA.join(' • ')}]`);
    
    // Step 2: Root Causes
    assert(Array.isArray(data.rootCauses) && data.rootCauses.length >= 2, `Step 2 — Root Causes (${data.rootCauses.length} identified)`);
    data.rootCauses.forEach((rc: string) => console.log(`      • ${rc}`));

    // Step 3: Candidate Solutions
    assert(Array.isArray(data.candidateSolutions) && data.candidateSolutions.length >= 2, `Step 3 — Candidate Solutions (${data.candidateSolutions.length} synthesized)`);
    const rec = data.candidateSolutions.find((s: any) => s.isRecommended);
    console.log(`      ⭐ Recommended Solution: "${rec?.title}"`);

    // Step 4: Ecosystem Readiness
    assert(data.ecosystemReadiness.projectReadinessPercentage >= 50, `Step 4 — Ecosystem Readiness: ${data.ecosystemReadiness.projectReadinessPercentage}%`);
    console.log(`      Missing Capabilities: ${data.ecosystemReadiness.missingCapabilities.join(', ')}`);

    // Step 5: Solution Blueprint
    assert(data.blueprint.summaryMatrix !== undefined, 'Step 5 — Solution Blueprint Generated');
    console.log(`      Hardware: ${data.blueprint.summaryMatrix.hardwareSummary.join(' • ')}`);
    console.log(`      Software: ${data.blueprint.summaryMatrix.softwareSummary.join(' • ')}`);
    console.log(`      Expertise: ${data.blueprint.summaryMatrix.expertiseSummary.join(' • ')}`);
    console.log(`      Team: ${data.blueprint.summaryMatrix.teamSummary}`);
    console.log(`      Timeline: Prototype ${data.blueprint.summaryMatrix.timelineSummary.prototypeWeeks}w • Pilot ${data.blueprint.summaryMatrix.timelineSummary.pilotWeeks}w`);
    console.log(`      Success Metrics: ${data.blueprint.summaryMatrix.successMetrics.join(' • ')}`);
  } catch (err: any) {
    assert(false, 'Full workflow execution failed', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Solution Simulator (Scenario A vs Scenario B)
  // ---------------------------------------------------------------------------
  console.log('\n📌 Test 3: POST /api/simulator/calculate (Solution Simulator)');
  try {
    // Scenario A: 50 Sensors, ₹5 Lakh
    const scenarioA = await request(app).post('/api/simulator/calculate').send({
      budgetINR: 500000,
      timelineMonths: 4,
      hardwareList: [{ name: 'IoT Flow Sensor', quantity: 50, unitCostINR: 6000, maintenanceAnnualRate: 0.1 }],
      personnelList: [{ role: 'Field Technician', headcount: 1, monthlyRateINR: 25000 }],
      fieldSitesCount: 1,
      terrainComplexityFactor: 1.1,
      contingencyRate: 0.05,
    });

    // Scenario B: 10 Sensors, ₹2 Lakh
    const scenarioB = await request(app).post('/api/simulator/calculate').send({
      budgetINR: 200000,
      timelineMonths: 2,
      hardwareList: [{ name: 'IoT Flow Sensor', quantity: 10, unitCostINR: 6000, maintenanceAnnualRate: 0.1 }],
      personnelList: [{ role: 'Field Technician', headcount: 1, monthlyRateINR: 25000 }],
      fieldSitesCount: 1,
      terrainComplexityFactor: 1.1,
      contingencyRate: 0.05,
    });

    assert(scenarioA.status === 200 && scenarioB.status === 200, 'Both scenarios evaluated deterministically');
    console.log(`   Scenario A (50 sensors, ₹5L budget): Feasibility Score ${scenarioA.body.feasibilityScore}/100 [${scenarioA.body.feasibilityStatus}]`);
    console.log(`   Scenario B (10 sensors, ₹2L budget): Feasibility Score ${scenarioB.body.feasibilityScore}/100 [${scenarioB.body.feasibilityStatus}]`);
  } catch (err: any) {
    assert(false, 'Simulator scenarios failed', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Autonomous Web Ingestion & Memory
  // ---------------------------------------------------------------------------
  console.log('\n📌 Test 4: POST /api/crawler/ingest-raw-text & Stats');
  try {
    const rawIngestRes = await request(app)
      .post('/api/crawler/ingest-raw-text')
      .send({
        title: 'WaterWatch Smart Canal Automation Pilot',
        content: 'Deployed ultrasonic flow telemetry across 14 villages in Palamu achieving 38% reduction in water loss.',
        district: 'Palamu',
        source: 'State Jal Jeevan Report',
      });

    assert(rawIngestRes.status === 200, 'Ingested past pilot case study into pgvector Innovation Memory');

    const statsRes = await request(app).get('/api/crawler/knowledge-stats');
    assert(statsRes.status === 200, 'Retrieved live memory stats');
  } catch (err: any) {
    assert(false, 'Crawler test failed', err.message);
  }

  console.log('\n================================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  process.exit(passedTests === totalTests ? 0 : 1);
}

runFullE2ETestSuite().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
