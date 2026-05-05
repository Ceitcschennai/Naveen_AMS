# Ceitcs Attendance Management System - Complete Test Cases

## Project Test Summary

| Category | Test Suites | Total Tests | Status |
|----------|-------------|-------------|--------|
| **Frontend** | 6 | 70 | ✅ All Passing |
| **Backend** | 4 | 36 | ✅ All Passing |
| **Total** | **10** | **106** | ✅ **All Passing** |

---

# PART 1: FRONTEND TEST CASES

## Frontend Test Suite Summary

| Test File | Test Count | Status |
|-----------|-----------|--------|
| App.test.js | 2 | ✅ |
| LoginPage.test.js | 20 | ✅ |
| AdminLoginpage.test.js | 14 | ✅ |
| Sidebar.test.js | 17 | ✅ |
| Header.test.js | 10 | ✅ |
| Leaves.test.js | 7 | ✅ |
| **Total** | **70** | **✅** |

---

## 1. App.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `renders login page at root path` | Verifies App renders login page at root |
| 2 | `renders login page title` | Verifies login page displays title |

---

## 2. LoginPage.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `renders login form heading` | Verifies form heading is displayed |
| 2 | `renders email input field` | Verifies email input is present |
| 3 | `renders password input field` | Verifies password input is present |
| 4 | `renders login button` | Verifies login button is present |
| 5 | `accepts email input` | Verifies email field accepts input |
| 6 | `accepts password input` | Verifies password field accepts input |
| 7 | `navigates to signup page on signup link click` | Verifies navigation to signup |
| 8 | `shows error for invalid email` | Verifies email validation |
| 9 | `shows error for empty email` | Verifies empty email validation |
| 10 | `shows error for empty password` | Verifies empty password validation |
| 11 | `calls login API on valid submission` | Verifies API call on valid form |
| 12 | `shows error on login failure` | Verifies error handling |
| 13 | `renders employee login link` | Verifies employee login link exists |
| 14 | `has correct href for employee login` | Verifies link href |
| 15 | `renders admin login link` | Verifies admin login link exists |
| 16 | `has correct href for admin login` | Verifies admin link href |
| 17 | `renders forgot password link` | Verifies forgot password link |
| 18 | `renders remember me checkbox` | Verifies checkbox exists |
| 19 | `renders form with correct class` | Verifies form styling |
| 20 | `shows error for missing credentials` | Verifies validation for missing fields |

---

## 3. AdminLoginpage.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `renders admin login heading` | Verifies heading displays |
| 2 | `renders username input` | Verifies username field |
| 3 | `renders password input` | Verifies password field |
| 4 | `renders login button` | Verifies login button |
| 5 | `renders forgot password link` | Verifies forgot password link |
| 6 | `accepts username input` | Verifies username accepts input |
| 7 | `accepts password input` | Verifies password accepts input |
| 8 | `calls login API on valid submission` | Verifies API call |
| 9 | `shows error on login failure` | Verifies error display |
| 10 | `navigates to admin dashboard on success` | Verifies navigation |
| 11 | `shows error for empty username` | Verifies validation |
| 12 | `shows error for empty password` | Verifies validation |
| 13 | `has correct href for employee login` | Verifies link href |
| 14 | `has correct href for signup` | Verifies signup link |

---

## 4. Sidebar.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `renders sidebar title` | Verifies "CeiTCS" title |
| 2 | `renders sidebar subtitle` | Verifies subtitle text |
| 3 | `renders toggle button` | Verifies toggle button |
| 4 | `renders Dashboard link` | Verifies Dashboard link |
| 5 | `renders Employees link` | Verifies Employees link |
| 6 | `renders Attendance link` | Verifies Attendance link |
| 7 | `renders Leaves link` | Verifies Leaves link |
| 8 | `renders Holidays link` | Verifies Holidays link |
| 9 | `renders Working Days link` | Verifies Working Days link |
| 10 | `renders Attendance Report link` | Verifies Report link |
| 11 | `renders dropdown toggle initially closed` | Verifies dropdown state |
| 12 | `opens dropdown when clicking toggle` | Verifies dropdown opens |
| 13 | `closes dropdown when clicking toggle again` | Verifies dropdown closes |
| 14 | `navigates to Dashboard when clicking link` | Verifies Dashboard nav |
| 15 | `navigates to Employees when clicking link` | Verifies Employees nav |
| 16 | `navigates to Attendance when clicking link` | Verifies Attendance nav |
| 17 | `toggles sidebar open/closed` | Verifies toggle functionality |

---

## 5. Header.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `renders welcome text` | Verifies "Welcome Admin" text |
| 2 | `renders settings icon` | Verifies settings icon |
| 3 | `renders user icon` | Verifies user icon |
| 4 | `renders logout icon` | Verifies logout icon |
| 5 | `renders settings icon with disabled title` | Verifies icon title |
| 6 | `renders user icon with admin account title` | Verifies user title |
| 7 | `renders logout icon with logout title` | Verifies logout title |
| 8 | `renders header with correct class` | Verifies header element |
| 9 | `renders icon section with all icons` | Verifies all icons render |
| 10 | `renders navigation icons` | Verifies navigation elements |

---

## 6. Leaves.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `calculateDuration returns 1 for same day leave` | Tests duration calculation |
| 2 | `calculateDuration returns correct days for multi-day leave` | Tests multi-day calculation |
| 3 | `isLeaveCompleted returns true for past dates` | Tests leave completion check |
| 4 | `isLeaveCompleted returns false for future dates` | Tests future date check |
| 5 | `capitalize capitalizes first letter only` | Tests capitalize utility |
| 6 | `capitalize handles empty string` | Tests empty string handling |
| 7 | `capitalize handles already capitalized string` | Tests edge cases |

---

# PART 2: BACKEND TEST CASES

## Backend Test Suite Summary

| Test File | Test Count | Status |
|-----------|-----------|--------|
| authController.test.js | 12 | ✅ |
| leaveController.test.js | 9 | ✅ |
| leaveRoutes.test.js | 9 | ✅ |
| holidayRoutes.test.js | 6 | ✅ |
| **Total** | **36** | **✅** |

---

## 1. authController.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `should return 400 when email not found in Employees` | Validates email exists in Employees table |
| 2 | `should return 400 when name does not match` | Validates name matches Employee record |
| 3 | `should return 400 when user already registered` | Prevents duplicate registration |
| 4 | `should return 201 when signup successful` | Successfully creates new user |
| 5 | `should return 400 for invalid credentials` | Handles wrong email/password |
| 6 | `should return token for valid credentials` | Returns JWT token on success |
| 7 | `should return admin token for admin credentials` | Special handling for admin users |
| 8 | `should return admin profile for admin user` | Retrieves admin profile data |
| 9 | `should return 404 when user not found` | Handles missing user gracefully |
| 10 | `should return 400 for incorrect current password` | Validates current password |
| 11 | `should return success for valid password update` | Updates password successfully |
| 12 | `should handle password change correctly` | Verifies password change logic |

---

## 2. leaveController.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `should return 400 for invalid leave ID` | Validates leave ID format |
| 2 | `should return 400 for invalid status value` | Validates status is 'Approved' or 'Rejected' |
| 3 | `should return 404 when leave not found` | Handles missing leave record |
| 4 | `should return 400 when leave already approved` | Prevents double approval |
| 5 | `should return 200 when status updated successfully` | Successfully updates status |
| 6 | `should update leave balance when leave is approved` | Decrements employee leave balance |
| 7 | `should handle half day leave correctly` | Processes half-day leave requests |
| 8 | `should handle hourly leave correctly` | Processes hourly leave requests |
| 9 | `should return 500 on database error` | Handles DB errors gracefully |

---

## 3. leaveRoutes.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `should return 400 when required fields are missing` | Validates required fields |
| 2 | `should return 404 when employee not found` | Validates employee exists |
| 3 | `should return 201 when leave submitted successfully` | Creates new leave request |
| 4 | `should return 200 with leave list` | Retrieves all leaves |
| 5 | `should return 500 on database error` | Handles DB errors gracefully |
| 6 | `should return 400 when status is missing` | Validates status field |
| 7 | `should return 404 when leave not found` | Handles missing leave |
| 8 | `should return 200 when status updated successfully` | Updates leave status |
| 9 | `should return 200 with employee leaves` | Retrieves employee's leave history |

---

## 4. holidayRoutes.test.js

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | `should return holidays for current year` | Returns current year holidays |
| 2 | `should return holidays for specific year` | Returns specified year holidays |
| 3 | `should return holidays for 2024` | Returns 2024 holidays |
| 4 | `should include January holidays` | Verifies January month data |
| 5 | `should include fixed holidays` | Verifies New Year holiday |
| 6 | `should handle invalid year gracefully` | Falls back to current year |

---

# Test Coverage Summary

## Frontend Component Coverage

| Component | Tested | Coverage |
|-----------|--------|----------|
| App.js | ✅ | Full |
| LoginPage.js | ✅ | Full |
| AdminLoginPage.js | ✅ | Full |
| Sidebar.js | ✅ | Full |
| Header.js | ✅ | Full |
| Leaves Utility | ✅ | Full |

## Backend API Coverage

| Endpoint | Method | Controller | Tested |
|----------|--------|------------|--------|
| `/api/auth/signup` | POST | authController | ✅ |
| `/api/auth/login` | POST | authController | ✅ |
| `/api/auth/profile` | GET | authController | ✅ |
| `/api/auth/update-password` | PUT | authController | ✅ |
| `/api/leaves` | POST | leaveController | ✅ |
| `/api/leaves` | GET | leaveController | ✅ |
| `/api/leaves/:id/status` | PUT | leaveController | ✅ |
| `/api/leaves/employee` | GET | leaveController | ✅ |
| `/api/holidays` | GET | holidayController | ✅ |

---

## Test Execution Commands

### Frontend Tests
```bash
cd frontend
npm test -- --watchAll=false
```

### Backend Tests
```bash
cd backend
npm test -- --watchAll=false
```

---

## Test Output Format

```
Test Suites: X passed, X total
Tests:       X passed, X total
Snapshots:   0 total
Time:        X.XX s
```

---

## Error Handling Tests

| Error Scenario | Expected HTTP Code | Tested |
|----------------|-------------------|--------|
| Invalid leave ID | 400 | ✅ |
| Invalid status | 400 | ✅ |
| Leave not found | 404 | ✅ |
| Employee not found | 404 | ✅ |
| Missing required fields | 400 | ✅ |
| Database error | 500 | ✅ |
| Invalid credentials | 400 | ✅ |
| Duplicate registration | 400 | ✅ |

---

## Mock Dependencies Used

| Dependency | Purpose | Location |
|------------|---------|----------|
| react-router-dom | Routing & Navigation | Frontend |
| react-icons/fa | Icon Components | Frontend |
| axios | API Calls | Frontend |
| localStorage | Session Storage | Frontend |
| db.query | Database Queries | Backend |
| authMiddleware | Authentication | Backend |

---

## Notes

- All tests are unit tests with mocked dependencies
- No external database connection required
- Console.error suppressed during error tests to reduce noise
- Tests are independent and can run in any order
- All 106 tests pass successfully
