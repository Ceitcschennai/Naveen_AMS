const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock bcrypt functions globally
jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  compare: jest.fn(),
  hash: jest.fn()
}));

// Mock the database
jest.mock('../../config/db', () => ({
  sql: {
    query: jest.fn()
  }
}));

// Create test app
const app = express();
app.use(express.json());

// Mock auth middleware for protected routes
const authMiddlewareMock = (req, res, next) => {
  req.user = { id: 1, empId: 'EMP001', email: 'test@example.com', role: 'employee' };
  next();
};

// Setup routes
app.post('/api/auth/signup', require('../../controllers/authController').signup);
app.post('/api/auth/login', require('../../controllers/authController').login);
app.get('/api/auth/profile', authMiddlewareMock, require('../../controllers/authController').getProfile);
app.put('/api/auth/update-password', authMiddlewareMock, require('../../controllers/authController').updatePassword);

describe('Auth Controller', () => {
  let mockSql;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSql = require('../../config/db').sql;
  });

  describe('POST /api/auth/signup', () => {
    test('should return 400 when email not found in Employees', async () => {
      mockSql.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({ recordset: [] });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'notfound@example.com', password: 'Test1234@' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not found');
    });

    test('should return 400 when name does not match', async () => {
      mockSql.query.mockResolvedValueOnce({ recordset: [{ emp_id: 1, name: 'John Doe' }] });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Wrong Name', email: 'test@example.com', password: 'Test1234@' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Name does not match');
    });

    test('should return 400 when user already registered', async () => {
      mockSql.query
        .mockResolvedValueOnce({ recordset: [{ emp_id: 1, name: 'Test User' }] })
        .mockResolvedValueOnce({ recordset: [{ id: 1 }] });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'Test1234@' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already registered');
    });

    test('should return 201 when signup successful', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
      
      mockSql.query
        .mockResolvedValueOnce({ recordset: [{ emp_id: 1, name: 'Test User' }] })
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'Test1234@' });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('successful');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should return 400 for invalid credentials', async () => {
      mockSql.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({ recordset: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not found');
    });

    test('should return token for valid credentials', async () => {
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      
      mockSql.query
        .mockResolvedValueOnce({
          recordset: [{
            id: 1,
            emp_id: 'EMP001',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed_password'
          }]
        })
        .mockResolvedValueOnce({ recordset: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Test1234@' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('should return admin token for admin credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@gmail.com', password: 'p123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('should return admin profile for admin user', async () => {
      const adminReq = { user: { id: 0, role: 'admin' } };
      const { getProfile } = require('../../controllers/authController');
      
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getProfile(adminReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 0,
          email: 'admin@gmail.com'
        })
      );
    });

    test('should return 404 when user not found', async () => {
      mockSql.query.mockResolvedValueOnce({ recordset: [] });

      const { getProfile } = require('../../controllers/authController');
      
      const mockReq = { user: { id: 999, empId: 'EMP999', email: 'test@example.com', role: 'employee' } };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PUT /api/auth/update-password', () => {
    test('should return 400 for incorrect current password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      
      mockSql.query.mockResolvedValueOnce({
        recordset: [{ password: hashedPassword }]
      });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      const { updatePassword } = require('../../controllers/authController');
      
      const mockReq = {
        user: { id: 1 },
        body: { currentPassword: 'wrongpassword', newPassword: 'NewPass123@' }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await updatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should return success for valid password update', async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 10);
      
      mockSql.query.mockResolvedValueOnce({
        recordset: [{ password: hashedPassword }]
      });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      bcrypt.hash = jest.fn().mockResolvedValue('newhashedpassword');

      const { updatePassword } = require('../../controllers/authController');
      
      const mockReq = {
        user: { id: 1 },
        body: { currentPassword: 'oldpassword', newPassword: 'NewPass123@' }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await updatePassword(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('successfully') })
      );
    });
  });
});
