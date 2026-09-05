import request from 'supertest';
import { app } from '../src/app';

describe('Ecosystem API Tests (GET /api/ecosystem/match/:problemId)', () => {
  test('should return top institutional matches for a given problemId', async () => {
    const testProblemId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const response = await request(app)
      .get(`/api/ecosystem/match/${testProblemId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.problemId).toBe(testProblemId);
    expect(Array.isArray(response.body.data.topMatches)).toBe(true);
    expect(response.body.data.topMatches.length).toBeGreaterThan(0);

    const firstMatch = response.body.data.topMatches[0];
    expect(firstMatch.name).toBeDefined();
    expect(firstMatch.entityType).toBeDefined();
    expect(firstMatch.capabilities).toBeDefined();
  });
});
