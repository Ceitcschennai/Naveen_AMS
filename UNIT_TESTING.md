# Unit Testing Documentation

## Overview
This document outlines the unit testing setup, methods, and procedures for the CEITCS Attendance Management System.

## Table of Contents
1. [Testing Framework Setup](#testing-framework-setup)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)

---

## Testing Framework Setup

### Backend Dependencies
```bash
npm install --save-dev jest supertest
```

### Frontend Dependencies (Already Installed)
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jest` (via react-scripts)

---

## Backend Testing

### Jest Configuration
Create `backend/jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.js',
    '!server.js',
    '!**/node_modules/**',
    '!**/uploads/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Test Directory Structure
```
backend/
├── __tests__/
│   ├── routes/
│   │   ├── authRoutes.test.js
│   │   ├── leaveRoutes.test.js
│   │   ├── employeeRoutes.test.js
│   │   ├── dashboardRoutes.test.js
│   │   ├── holidayRoutes.test.js
│   │   └── attendanceRoutes.test.js
│   ├── controllers/
│   │   ├── authController.test.js
│   │   ├── leaveController.test.js
│   │   ├── employeeController.test.js
│   │   └── dashboardController.test.js
│   └── models/
│       ├── User.test.js
│       ├── Employee.test.js
│       └── Leave.test.js
├── jest.config.js
└── package.json
```

### Mock Database Setup
Create `backend/__tests__/mocks/db.js`:

```javascript
const mockQuery = jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] });
const mockConnect = jest.fn().mockResolvedValue(true);

module.exports = {
  sql: {
    query: mockQuery,
    connect: mockConnect
  }
};
```

---

## Testing Methods

### 1. Route Testing
Test HTTP endpoints using supertest:
- Test all HTTP methods (GET, POST, PUT, DELETE)
- Test authentication middleware
- Test input validation
- Test error responses
- Test success responses

### 2. Controller Testing
Test business logic:
- Test input validation
- Test database queries
- Test error handling
- Test success responses

### 3. Model Testing
Test data models:
- Schema validation
- Required fields
- Data types

### 4. Middleware Testing
Test authentication and authorization:
- Valid tokens
- Invalid tokens
- Missing tokens

---

## Frontend Testing

### Test Directory Structure
```
frontend/src/
├── __tests__/
│   ├── components/
│   │   ├── Header.test.jsx
│   │   ├── Sidebar.test.jsx
│   │   ├── EmpHeader.test.jsx
│   │   └── EmpSidebar.test.jsx
│   └── pages/
│       ├── Dashboard.test.js
│       ├── Leaves.test.js
│       ├── Attendance.test.js
│       └── AdminLoginpage.test.js
└── setupTests.js
```

### Testing Methods
1. **Component Testing**: Test UI components render correctly
2. **Page Testing**: Test page functionality
3. **Integration Testing**: Test user flows

---

## Running Tests

### Backend Tests
```bash
cd backend
npm test
# or
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
# with coverage
npm test -- --coverage
```

### All Tests
```bash
npm run test:all
```

---

## Test Coverage Requirements

### Minimum Coverage
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Priority Test Files
1. **High Priority**: Auth routes, Leave routes, Employee routes
2. **Medium Priority**: Dashboard routes, Attendance routes
3. **Low Priority**: Holiday routes, Static pages

---

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern
```javascript
describe('Test Suite', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### 2. Mock External Dependencies
```javascript
jest.mock('../config/db', () => ({
  sql: {
    query: jest.fn()
  }
}));
```

### 3. Test Error Cases
```javascript
test('should return 400 for missing fields', async () => {
  const res = await request(app)
    .post('/api/endpoint')
    .send({});
  
  expect(res.status).toBe(400);
});
```

### 4. Test Success Cases
```javascript
test('should return 200 for valid request', async () => {
  const res = await request(app)
    .post('/api/endpoint')
    .send(validData);
  
  expect(res.status).toBe(200);
});
```

---

## Common Test Scenarios

### Authentication Tests
1. Login with valid credentials
2. Login with invalid credentials
3. Access protected route without token
4. Access protected route with valid token

### Leave Management Tests
1. Apply for leave with valid data
2. Apply for leave with missing fields
3. Get all leaves (admin)
4. Get employee leaves
5. Update leave status
6. Reject leave status

### Employee Management Tests
1. Add new employee
2. Update employee
3. Get all employees
4. Delete employee

### Dashboard Tests
1. Get admin dashboard data
2. Get employee dashboard data

---

## Troubleshooting

### Common Errors
1. **"Cannot find module"**: Install required dependencies
2. **"Connection refused"**: Check database connection
3. **"Timeout"**: Increase timeout in jest config

### Tips
- Use `--watch` mode for development
- Use `--verbose` for detailed output
- Use `--onlyFailures` to rerun failed tests
