import request from 'supertest';
import { app } from '../src/app';

// Mock OpenAI SDK calls for clean, fast, offline unit & integration testing
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: new Array(1536).fill(0.02) }],
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
                      problemDNA: ['Water Management', 'Agriculture', 'IoT', 'Rural Infrastructure'],
                      translatedProblem:
                        'Rural irrigation and potable water distribution loss in Dhanbad due to pipeline leaks.',
                      detectedDialect: 'Khortha / Industrial Hindi',
                      rootCauses: [
                        'Undetected pipe leakage in subterranean distribution lines',
                        'Lack of continuous real-time pressure monitoring',
                      ],
                      candidateSolutions: [
                        {
                          id: 'sol-a',
                          title: 'A. IoT Leakage Monitoring',
                          description: 'Edge ultrasonic flow meters.',
                          isRecommended: false,
                          pros: ['Direct alerts'],
                          cons: ['Localized only'],
                          recommendationRationale: 'Good for local leaks.',
                        },
                        {
                          id: 'sol-c',
                          title: 'C. Hybrid IoT + GIS system',
                          description: 'IoT telemetry integrated with GIS spatial dashboard.',
                          isRecommended: true,
                          pros: ['Sub-minute leak localization', 'End-to-end visibility'],
                          cons: ['Initial calibration needed'],
                          recommendationRationale: 'Optimal balance of telemetry and planning (Recommended).',
                        },
                      ],
                      domainTags: ['Water Security', 'Smart Irrigation'],
                      requiredDisciplines: ['Hydrology', 'IoT Systems'],
                      severityScore: 8,
                      summary: 'Critical water conservation challenge in Dhanbad.',
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

describe('Problem Orchestration API Tests (POST /api/problems/process)', () => {
  test('should process problem statement and return SIH PS-43 Killer Workflow pipeline output', async () => {
    const payload = {
      rawDescription: 'Our village loses a lot of water because the existing irrigation system leaks and nobody knows where.',
      district: 'Dhanbad',
    };

    const response = await request(app)
      .post('/api/problems/process')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    const data = response.body.data;
    expect(data.id).toBeDefined();

    // Step 1: Problem DNA
    expect(Array.isArray(data.problemDNA)).toBe(true);
    expect(data.problemDNA.length).toBeGreaterThan(0);

    // Step 2: Root Causes
    expect(Array.isArray(data.rootCauses)).toBe(true);
    expect(data.rootCauses.length).toBeGreaterThan(0);

    // Step 3: Candidate Solutions
    expect(Array.isArray(data.candidateSolutions)).toBe(true);
    expect(data.candidateSolutions.length).toBeGreaterThanOrEqual(2);
    expect(data.candidateSolutions.some((s: any) => s.isRecommended)).toBe(true);

    // Step 4: Ecosystem Readiness
    expect(data.ecosystemReadiness).toBeDefined();
    expect(data.ecosystemReadiness.projectReadinessPercentage).toBeGreaterThan(0);
    expect(Array.isArray(data.ecosystemReadiness.topPartners)).toBe(true);

    // Step 5: Solution Blueprint
    expect(data.blueprint).toBeDefined();
    expect(data.blueprint.summaryMatrix).toBeDefined();
    expect(data.blueprint.summaryMatrix.hardwareSummary.length).toBeGreaterThan(0);
    expect(data.blueprint.summaryMatrix.softwareSummary.length).toBeGreaterThan(0);
    expect(data.blueprint.summaryMatrix.successMetrics.length).toBeGreaterThan(0);
  });

  test('should return 400 Bad Request when payload is invalid (missing district)', async () => {
    const invalidPayload = {
      rawDescription: 'Some description text without district',
    };

    const response = await request(app)
      .post('/api/problems/process')
      .send(invalidPayload)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
