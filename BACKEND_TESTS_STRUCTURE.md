# Backend Test Structure

## Overview
This document provides the table structure of all backend test suites and tests in the Ceitcs Attendance Management System.

## Test Files Location
```
backend/__tests__/
├── controllers/
│   ├── authController.test.js
│   └── leaveController.test.js
├── routes/
│   └── leaveRoutes.test.js
├── mocks/
│   └── db.js
└── setup.js
```

---

## Test Suites Summary

| Test Suite | File | Tests Count | Status |
|------------|------|-------------|--------|
| authController.test.js | controllers/authController.test.js | 12 | ✅ Passing |
| leaveController.test.js | controllers/leaveController.test.js | 9 | ✅ Passing |
| leaveRoutes.test.js | routes/leaveRoutes.test.js | 9 | ✅ Passing |
| **TOTAL** | **3 Files** | **30 Tests** | **✅ All Passing** |

---

## Detailed Test Structure

### 1. authController.test.js

| Test Name | Description |
|-----------|-------------|
| **POST /api/auth/signup** | |
| `should return 400 when email not found in Employees` | Validates email exists in Employees table |
| `should return 400 when name does not match` | Validates name matches Employee record |
| `should return 400 when user already registered` | Prevents duplicate registration |
| `should return 201 when signup successful` | Successfully creates new user |
| **POST /api/auth/login** | |
| `should return 400 for invalid credentials` | Handles wrong email/password |
| `should return token for valid credentials` | Returns JWT token on success |
| `should return admin token for admin credentials` | Special handling for admin users |
| **GET /api/auth/profile** | |
| `should return admin profile for admin user` | Retrieves admin profile data |
| `should return 404 when user not found` | Handles missing user gracefully |
| **PUT /api/auth/update-password** | |
| `should return 400 for incorrect current password` | Validates current password |
| `should return success for valid password update` | Updates password successfully |

---

### 2. leaveController.test.js

| Test Name | Description |
|-----------|-------------|
| **updateLeaveStatus** | |
| `should return 400 for invalid leave ID` | Validates leave ID format |
| `should return 400 for invalid status value` | Validates status is 'Approved' or 'Rejected' |
| `should return 404 when leave not found` | Handles missing leave record |
| `should return 400 when leave already approved` | Prevents double approval |
| `should return 200 when status updated successfully` | Successfully updates status |
| `should update leave balance when leave is approved` | Decrements employee leave balance |
| `should handle half day leave correctly` | Processes half-day leave requests |
| `should handle hourly leave correctly` | Processes hourly leave requests |
| `should return 500 on database error` | Handles DB errors gracefully |

---

### 3. leaveRoutes.test.js

| Test Name | Description |
|-----------|-------------|
| **POST /api/leaves** | |
| `should return 400 when required fields are missing` | Validates required fields |
| `should return 404 when employee not found` | Validates employee exists |
| `should return 201 when leave submitted successfully` | Creates new leave request |
| **GET /api/leaves** | |
| `should return 200 with leave list` | Retrieves all leaves |
| `should return 500 on database error` | Handles DB errors gracefully |
| **PUT /api/leaves/:id/status** | |
| `should return 400 when status is missing` | Validates status field |
| `should return 404 when leave not found` | Handles missing leave |
| `should return 200 when status updated successfully` | Updates leave status |
| **GET /api/leaves/employee** | |
| `should return 404 when employee not found` | Validates employee exists |
| `should return 200 with employee leaves` | Retrieves employee's leave history |

---

## API Endpoints Tested

| Endpoint | Method | Controller | Tests |
|----------|--------|------------|-------|
| `/api/auth/signup` | POST | authController | 4 |
| `/api/auth/login` | POST | authController | 3 |
| `/api/auth/profile` | GET | authController | 2 |
| `/api/auth/update-password` | PUT | authController | 2 |
| `/api/leaves` | POST | leaveController | 3 |
| `/api/leaves` | GET | leaveController | 2 |
| `/api/leaves/:id/status` | PUT | leaveController | 3 |
| `/api/leaves/employee` | GET | leaveController | 2 |

---

## Test Coverage by Feature

| Feature | Controller/Route | Tests Count |
|---------|------------------|-------------|
| User Authentication | authController | 12 |
| Leave Management | leaveController | 9 |
| Leave Routes | leaveRoutes | 9 |
| **Total** | | **30** |

---

## Database Mocks Used

| Mock | Purpose |
|------|---------|
| `db.query` | Mock MySQL queries |
| `db.execute` | Mock prepared statement execution |
| `console.error` | Suppress error logs during tests |

**Mock Location:** `backend/__tests__/mocks/db.js`

---

## Setup Configuration

| File | Purpose |
|------|---------|
| `setup.js` | Suppresses console.error during tests |
| `jest.config.js` | Jest configuration (testMatch, coverage) |

---

## Running Tests

```bash
# Run all backend tests
cd backend
npm test -- --watchAll=false

# Run specific test file
npm test -- --testPathPattern=authController.test.js --watchAll=false

# Run with coverage
npm test -- --coverage --watchAll=false
```

---

## Test Output Example

```
PASS __tests__/controllers/leaveController.test.js
PASS __tests__/routes/leaveRoutes.test.js
PASS __tests__/controllers/authController.test.js

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        2.72 s
```

---

## Error Handling Tests

| Test | Expected Error Code |
|------|-------------------|
| Invalid leave ID | 400 |
| Invalid status | 400 |
| Leave not found | 404 |
| Employee not found | 404 |
| Missing required fields | 400 |
| Database error | 500 |
| Invalid credentials | 400 |

---

## Notes

- Console.error is suppressed in setup.js to prevent noisy output during intentional error testing
- Database errors are mocked using `jest.spyOn` on `db.query`
- All tests use mocked database to avoid external dependencies
- Tests run independently with proper cleanup in `afterEach`
