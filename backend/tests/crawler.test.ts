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
});
