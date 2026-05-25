const request = require('supertest');
const app = require('../src/app');

describe('API Server', () => {
  it('should have a 404 handler for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route-that-does-not-exist');
    expect(response.status).toBe(404);
  });
});
