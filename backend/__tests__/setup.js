// Test setup - set environment variables before any tests run
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.PORT = '5000';
process.env.DB_SERVER = 'localhost';
process.env.DB_USER = 'testuser';
process.env.DB_PASSWORD = 'testpassword';
process.env.DB_DATABASE = 'testdb';

// Suppress console.error during tests to prevent noisy output when testing error scenarios
// This does not affect production - it only applies in Jest test environment
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});
