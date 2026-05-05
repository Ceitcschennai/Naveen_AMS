const express = require('express');

// Mock the database
jest.mock('../../config/db', () => ({
  sql: {
    query: jest.fn()
  }
}));

// Import the controller
const { updateLeaveStatus } = require('../../controllers/leaveController');

describe('Leave Controller', () => {
  let mockSql;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSql = require('../../config/db').sql;
  });

  describe('updateLeaveStatus', () => {
    test('should return 400 for invalid leave ID', async () => {
      const mockReq = { params: { id: 'abc' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('Invalid') })
      );
    });

    test('should return 400 for invalid status value', async () => {
      const mockReq = { params: { id: '1' }, body: { status: 'InvalidStatus' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('Invalid') })
      );
    });

    test('should return 404 when leave not found', async () => {
      mockSql.query.mockResolvedValueOnce({ recordset: [] });

      const mockReq = { params: { id: '999' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('should return 400 when leave already approved', async () => {
      mockSql.query.mockResolvedValueOnce({
        recordset: [{ id: 1, status: 'Approved', emp_id: 'EMP001' }]
      });

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('already approved') })
      );
    });

    test('should return 200 when status updated successfully', async () => {
      // When status is 'Approved', the controller fetches user data to update leave balance
      mockSql.query
        .mockResolvedValueOnce({ recordset: [{ id: 1, status: 'Pending', emp_id: 'EMP001' }] })
        .mockResolvedValueOnce({ rowsAffected: [1] })
        .mockResolvedValueOnce({ recordset: [{ id: 1, leaves_taken: 0 }] }) // User query
        .mockResolvedValueOnce({ rowsAffected: [1] }); // Update leavesTaken

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('successfully') })
      );
    });

    test('should update leave balance when leave is approved', async () => {
      mockSql.query
        .mockResolvedValueOnce({
          recordset: [{
            id: 1,
            status: 'Pending',
            emp_id: 'EMP001',
            duration_type: 'Full Day',
            duration: 2
          }]
        })
        .mockResolvedValueOnce({ rowsAffected: [1] })
        .mockResolvedValueOnce({ recordset: [{ id: 1, leaves_taken: 0 }] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      // Check that user query was made
      expect(mockSql.query).toHaveBeenCalledTimes(4);
    });

    test('should handle half day leave correctly', async () => {
      mockSql.query
        .mockResolvedValueOnce({
          recordset: [{
            id: 1,
            status: 'Pending',
            emp_id: 'EMP001',
            duration_type: 'Half Day',
            hours: 0,
            duration: 0.5
          }]
        })
        .mockResolvedValueOnce({ rowsAffected: [1] })
        .mockResolvedValueOnce({ recordset: [{ id: 1, leaves_taken: 0 }] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should handle hourly leave correctly', async () => {
      mockSql.query
        .mockResolvedValueOnce({
          recordset: [{
            id: 1,
            status: 'Pending',
            emp_id: 'EMP001',
            duration_type: 'Hourly',
            hours: 8,
            duration: 1
          }]
        })
        .mockResolvedValueOnce({ rowsAffected: [1] })
        .mockResolvedValueOnce({ recordset: [{ id: 1, leaves_taken: 0 }] })
        .mockResolvedValueOnce({ rowsAffected: [1] });

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should return 500 on database error', async () => {
      // Suppress console.error for this intentional error test
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSql.query.mockRejectedValueOnce(new Error('Database error'));

      const mockReq = { params: { id: '1' }, body: { status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateLeaveStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      
      // Restore console.error after test
      errorSpy.mockRestore();
    });
  });
});
