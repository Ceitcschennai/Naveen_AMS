const request = require('supertest');
const express = require('express');

// Mock the database before requiring routes
jest.mock('../../config/db', () => ({
  sql: {
    query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
  }
}));

// Mock auth middleware
jest.mock('../../middleware/authMiddleware', () => {
  return (req, res, next) => {
    req.user = { email: 'test@example.com', id: 1 };
    next();
  };
});

// Create test app
const app = express();
app.use(express.json());
app.use('/api/leaves', require('../../routes/leaveRoutes'));

describe('Leave Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/leaves', () => {
    test('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/leaves')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Missing required fields');
    });

    test('should return 404 when employee not found', async () => {
      const { sql } = require('../../config/db');
      sql.query.mockResolvedValueOnce({ recordset: [] });

      const res = await request(app)
        .post('/api/leaves')
        .send({
          type: 'Sick',
          from: '2024-01-01',
          to: '2024-01-02',
          durationType: 'Full Day',
          duration: 2
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Employee not found');
    });

    test('should return 201 when leave submitted successfully', async () => {
      const { sql } = require('../../config/db');
      sql.query
        .mockResolvedValueOnce({ recordset: [{ emp_id: 1, name: 'Test User' }] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const res = await request(app)
        .post('/api/leaves')
        .send({
          type: 'Sick',
          from: '2024-01-01',
          to: '2024-01-02',
          durationType: 'Full Day',
          duration: 2
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('successfully');
    });
  });

  describe('GET /api/leaves', () => {
    test('should return 200 with leave list', async () => {
      const { sql } = require('../../config/db');
      sql.query.mockResolvedValueOnce({
        recordset: [
          { id: 1, type: 'Sick', status: 'Pending' }
        ]
      });

      const res = await request(app).get('/api/leaves');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 500 on database error', async () => {
      // Suppress console.error for this intentional error test
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { sql } = require('../../config/db');
      sql.query.mockRejectedValueOnce(new Error('DB Error'));

      const res = await request(app).get('/api/leaves');

      expect(res.status).toBe(500);
      
      // Restore console.error after test
      errorSpy.mockRestore();
    });
  });

  describe('PUT /api/leaves/:id/status', () => {
    test('should return 400 when status is missing', async () => {
      const res = await request(app)
        .put('/api/leaves/1/status')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Status is required');
    });

    test('should return 404 when leave not found', async () => {
      const { sql } = require('../../config/db');
      sql.query.mockResolvedValueOnce({ recordset: [] });

      const res = await request(app)
        .put('/api/leaves/999/status')
        .send({ status: 'Approved' });

      expect(res.status).toBe(404);
    });

    test('should return 200 when status updated successfully', async () => {
      const { sql } = require('../../config/db');
      // Use a future date to pass the date validation check
      sql.query
        .mockResolvedValueOnce({ recordset: [{ to_date: '2027-01-01' }] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const res = await request(app)
        .put('/api/leaves/1/status')
        .send({ status: 'Approved' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/leaves/employee', () => {
    test('should return 404 when employee not found', async () => {
      const { sql } = require('../../config/db');
      // First query: employee not found
      sql.query.mockResolvedValueOnce({ recordset: [] });

      const res = await request(app).get('/api/leaves/employee');

      expect(res.status).toBe(404);
    });

    test('should return 200 with employee leaves', async () => {
      const { sql } = require('../../config/db');
      // First query: find employee
      // Second query: get employee leaves
      sql.query
        .mockResolvedValueOnce({ recordset: [{ emp_id: 1, name: 'Test User' }] })
        .mockResolvedValueOnce({ recordset: [{ id: 1, type: 'Sick' }] });

      const res = await request(app).get('/api/leaves/employee');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
