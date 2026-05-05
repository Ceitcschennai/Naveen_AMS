// backend/__tests__/routes/holidayRoutes.test.js
const request = require('supertest');
const express = require('express');
const router = require('../../routes/holidayRoutes');

// Setup express app
const app = express();
app.use(express.json());
app.use('/api/holidays', router);

describe('Holiday Routes', () => {
  describe('GET /api/holidays', () => {
    test('should return holidays for current year', async () => {
      const response = await request(app).get('/api/holidays');

      expect(response.status).toBe(200);
      
      const currentYear = new Date().getFullYear();
      expect(response.body).toHaveProperty(String(currentYear));
    });

    test('should return holidays for specific year', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .query({ year: '2025' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('2025');
    });

    test('should return holidays for 2024', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .query({ year: '2024' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('2024');
    });

    test('should include January holidays', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .query({ year: '2025' });

      expect(response.status).toBe(200);
      expect(response.body['2025']['January']).toBeDefined();
    });

    test('should include fixed holidays', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .query({ year: '2025' });

      expect(response.status).toBe(200);
      
      // New Year
      expect(response.body['2025']['January']['1']).toBeDefined();
      expect(response.body['2025']['January']['1'].name).toBe('New Year');
    });

    test('should handle invalid year gracefully', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .query({ year: 'invalid' });

      expect(response.status).toBe(200);
      
      // Should fall back to current year
      const currentYear = new Date().getFullYear();
      expect(response.body).toHaveProperty(String(currentYear));
    });
  });
});
