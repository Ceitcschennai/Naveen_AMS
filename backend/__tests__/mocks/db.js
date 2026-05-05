// Mock database for testing
const mockQuery = jest.fn().mockResolvedValue({
  recordset: [],
  rowsAffected: [1]
});

const mockConnect = jest.fn().mockResolvedValue(true);

// Export as an object with query property (like the real db config)
module.exports = {
  query: mockQuery,
  connect: mockConnect
};

// Also export as default for { sql } destructuring pattern
module.exports.sql = mockQuery;
