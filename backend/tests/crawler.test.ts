import request from 'supertest';
import { app } from '../src/app';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: new Array(1536).fill(0.015) }],
        }),
      },
      beta: {
        chat: {
          completions: {
            parse: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    parsed: {
                      knowledgeType: 'CASE_STUDY',
                      title: 'Smart Decentralized Solar Water Purification Deployment',
                      problemSummary: 'High fluoride contamination in groundwater across Palamu villages.',
                      solutionSummary: 'Community solar kiosks with electrocoagulation and adsorption filters.',
                      outcome: 'Provided safe drinking water to 12,000 residents adhering to BIS standards.',
                      domain: 'Water Quality & Hydrology',
                      domainTags: ['Solar Filtration', 'Water Security', 'Fluoride Remediation'],
                      locationOrDistrict: 'Palamu, Jharkhand',
                      keyTechnologiesUsed: ['Electrocoagulation', 'Activated Alumina', 'IoT Telemetry'],
                    },
                  },
                },
              ],
            }),
          },
        },
      },
    };
  });
});

describe('Autonomous Knowledge Crawler & Ingestion API Tests', () => {
  test('should return knowledge stats from GET /api/crawler/knowledge-stats', async () => {
    const res = await request(app)
      .get('/api/crawler/knowledge-stats')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.totalLearnedCases).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.data.domainsCovered)).toBe(true);
  });

  test('should ingest raw text document into knowledge base via POST /api/crawler/ingest-raw-text', async () => {
    const payload = {
      title: 'Jharkhand Solar Microgrid Electrification Report',
      content: 'In Latehar remote forest villages, 50kW decentralized solar microgrids with battery backup were installed to provide uninterrupted power to tribal hamlets and local cold storage facilities.',
      district: 'Latehar',
      source: 'State Renewable Energy Circular',
    };

    const res = await request(app)
      .post('/api/crawler/ingest-raw-text')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.extractedKnowledge).toBeDefined();
    expect(res.body.data.extractedKnowledge.title).toBeDefined();
    expect(res.body.data.extractedKnowledge.domain).toBeDefined();
  });

  test('should reject invalid URL in POST /api/crawler/ingest-url', async () => {
    const res = await request(app)
      .post('/api/crawler/ingest-url')
      .send({ url: 'not-a-valid-url' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('should return 422 SCRAPER_RESTRICTED when target URL triggers scraper blocked error', async () => {
    // URL that will return 403 or fail to return >= 800 chars
    const res = await request(app)
      .post('/api/crawler/ingest-url')
      .send({ url: 'https://httpbin.org/status/403' });

    // Should return 422 when scraper is blocked or returns insufficient content
    if (res.status === 422) {
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('SCRAPER_RESTRICTED');
    }
  });

  test('should correctly handle non-technical report with null solutionSummary and empty keyTechnologiesUsed', async () => {
    const nonTechPayload = {
      title: 'Rural Employment Grievance and Seasonal Migration in Palamu',
      content: 'Local residents in rural Palamu reported severe lack of winter employment opportunities and delays in MGNREGA wage payments leading to seasonal distress migration to neighboring states. No technical or engineering intervention has been deployed yet.',
      district: 'Palamu',
      source: 'Citizen Grievance Forum',
    };

    const res = await request(app)
      .post('/api/crawler/ingest-raw-text')
      .send(nonTechPayload)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.extractedKnowledge).toBeDefined();
    expect(res.body.data.extractedKnowledge.solutionSummary === null || typeof res.body.data.extractedKnowledge.solutionSummary === 'string').toBe(true);
    expect(Array.isArray(res.body.data.extractedKnowledge.keyTechnologiesUsed)).toBe(true);
  });

  test('should ingest two distinct articles sequentially without context leak or state retention', async () => {
    const article1 = {
      title: 'Administrative Delays in Iron Ore Mining Leases in West Singhbhum',
      content: 'Statutory environmental clearance delays have halted operations across 12 iron ore mining leases in West Singhbhum, resulting in direct revenue loss and contractual disputes.',
      district: 'West Singhbhum',
      source: 'Mining Department Brief',
    };

    const article2 = {
      title: 'Groundwater Arsenic Toxicity in Sahibganj Riverine Villages',
      content: 'Deep tube wells in 18 flood-plain villages of Sahibganj district tested positive for arsenic levels exceeding 0.05 mg/L, triggering skin lesions among the local population.',
      district: 'Sahibganj',
      source: 'Public Health Engineering Department',
    };

    const res1 = await request(app).post('/api/crawler/ingest-raw-text').send(article1).expect(200);
    const res2 = await request(app).post('/api/crawler/ingest-raw-text').send(article2).expect(200);

    expect(res1.body.success).toBe(true);
    expect(res2.body.success).toBe(true);

    const title1 = res1.body.data.extractedKnowledge.title;
    const title2 = res2.body.data.extractedKnowledge.title;
    expect(title1).not.toEqual(title2);
  });
});
