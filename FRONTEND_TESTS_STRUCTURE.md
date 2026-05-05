# Frontend Test Structure

## Overview
This document provides the table structure of all frontend test suites and tests in the Ceitcs Attendance Management System.

## Test Files Location
```
frontend/src/__tests__/
```

---

## Test Suites Summary

| Test Suite | File | Tests Count | Status |
|------------|------|-------------|--------|
| App.test.js | App.test.js | 2 | ✅ Passing |
| LoginPage.test.js | LoginPage.test.js | 20 | ✅ Passing |
| AdminLoginpage.test.js | AdminLoginpage.test.js | 14 | ✅ Passing |
| Sidebar.test.js | Sidebar.test.js | 17 | ✅ Passing |
| Header.test.js | Header.test.js | 10 | ✅ Passing |
| Leaves.test.js | Leaves.test.js | 7 | ✅ Passing |
| **TOTAL** | **6 Files** | **70 Tests** | **✅ All Passing** |

---

## Detailed Test Structure

### 1. App.test.js

| Test Name | Description |
|-----------|-------------|
| `renders login page at root path` | Verifies App renders login page at root |
| `renders login page title` | Verifies login page displays title |

---

### 2. LoginPage.test.js

| Test Name | Description |
|-----------|-------------|
| **Form Rendering** | |
| `renders login form heading` | Verifies form heading is displayed |
| `renders email input field` | Verifies email input is present |
| `renders password input field` | Verifies password input is present |
| `renders login button` | Verifies login button is present |
| **Form Interactions** | |
| `accepts email input` | Verifies email field accepts input |
| `accepts password input` | Verifies password field accepts input |
| **Signup Flow** | |
| `navigates to signup page on signup link click` | Verifies navigation to signup |
| **Form Validation** | |
| `shows error for invalid email` | Verifies email validation |
| `shows error for empty email` | Verifies empty email validation |
| `shows error for empty password` | Verifies empty password validation |
| **Login Flow** | |
| `calls login API on valid submission` | Verifies API call on valid form |
| `shows error on login failure` | Verifies error handling |
| **Employee Login Link** | |
| `renders employee login link` | Verifies employee login link exists |
| `has correct href for employee login` | Verifies link href |
| **Admin Login Link** | |
| `renders admin login link` | Verifies admin login link exists |
| `has correct href for admin login` | Verifies admin link href |
| **Forgot Password** | |
| `renders forgot password link` | Verifies forgot password link |
| **Remember Me** | |
| `renders remember me checkbox` | Verifies checkbox exists |
| **Form Styling** | |
| `renders form with correct class` | Verifies form styling |

---

### 3. AdminLoginpage.test.js

| Test Name | Description |
|-----------|-------------|
| **Initial Render** | |
| `renders admin login heading` | Verifies heading displays |
| `renders username input` | Verifies username field |
| `renders password input` | Verifies password field |
| `renders login button` | Verifies login button |
| `renders forgot password link` | Verifies forgot password link |
| **Form Functionality** | |
| `accepts username input` | Verifies username accepts input |
| `accepts password input` | Verifies password accepts input |
| **Login Flow** | |
| `calls login API on valid submission` | Verifies API call |
| `shows error on login failure` | Verifies error display |
| `navigates to admin dashboard on success` | Verifies navigation |
| **Validation** | |
| `shows error for empty username` | Verifies validation |
| `shows error for empty password` | Verifies validation |
| **Navigation** | |
| `has correct href for employee login` | Verifies link href |
| `has correct href for signup` | Verifies signup link |

---

### 4. Sidebar.test.js

| Test Name | Description |
|-----------|-------------|
| **Initial Render** | |
| `renders sidebar title` | Verifies "CeiTCS" title |
| `renders sidebar subtitle` | Verifies subtitle text |
| `renders toggle button` | Verifies toggle button |
| **Navigation Links** | |
| `renders Dashboard link` | Verifies Dashboard link |
| `renders Employees link` | Verifies Employees link |
| `renders Attendance link` | Verifies Attendance link |
| `renders Leaves link` | Verifies Leaves link |
| `renders Holidays link` | Verifies Holidays link |
| `renders Working Days link` | Verifies Working Days link |
| `renders Attendance Report link` | Verifies Report link |
| **Dropdown Menu** | |
| `renders dropdown toggle initially closed` | Verifies dropdown state |
| `opens dropdown when clicking toggle` | Verifies dropdown opens |
| `closes dropdown when clicking toggle again` | Verifies dropdown closes |
| **Navigation** | |
| `navigates to Dashboard when clicking link` | Verifies Dashboard nav |
| `navigates to Employees when clicking link` | Verifies Employees nav |
| `navigates to Attendance when clicking link` | Verifies Attendance nav |
| `navigates to Leaves when clicking link` | Verifies Leaves nav |
| `navigates to Holidays when clicking link` | Verifies Holidays nav |
| **Toggle Button** | |
| `toggles sidebar open/closed` | Verifies toggle functionality |

---

### 5. Header.test.js

| Test Name | Description |
|-----------|-------------|
| **Initial Render** | |
| `renders welcome text` | Verifies "Welcome Admin" text |
| `renders settings icon` | Verifies settings icon |
| `renders user icon` | Verifies user icon |
| `renders logout icon` | Verifies logout icon |
| **Icons** | |
| `renders settings icon with disabled title` | Verifies icon title |
| `renders user icon with admin account title` | Verifies user title |
| `renders logout icon with logout title` | Verifies logout title |
| **Header Structure** | |
| `renders header with correct class` | Verifies header element |
| `renders icon section with all icons` | Verifies all icons render |

---

### 6. Leaves.test.js

| Test Name | Description |
|-----------|-------------|
| `calculateDuration returns 1 for same day leave` | Tests duration calculation |
| `calculateDuration returns correct days for multi-day leave` | Tests multi-day calculation |
| `isLeaveCompleted returns true for past dates` | Tests leave completion check |
| `isLeaveCompleted returns false for future dates` | Tests future date check |
| `capitalize capitalizes first letter only` | Tests capitalize utility |
| `capitalize handles empty string` | Tests empty string handling |
| `capitalize handles already capitalized string` | Tests edge cases |

---

## Component Coverage

| Component | Test File | Coverage |
|-----------|-----------|----------|
| App.js | App.test.js | ✅ |
| LoginPage | LoginPage.test.js | ✅ |
| AdminLoginPage | AdminLoginpage.test.js | ✅ |
| Sidebar | Sidebar.test.js | ✅ |
| Header | Header.test.js | ✅ |
| Leaves Utility | Leaves.test.js | ✅ |

---

## Test Dependencies Mocked

| Dependency | Purpose |
|------------|---------|
| `react-router-dom` | BrowserRouter, useNavigate, useLocation |
| `react-icons/fa` | FaTachometerAlt, FaUsers, FaCog, etc. |
| `axios` | API calls in forms |
| `localStorage` | User session storage |

---

## Running Tests

```bash
# Run all frontend tests
cd frontend
npm test -- --watchAll=false

# Run specific test file
npm test -- --testPathPattern=LoginPage.test.js --watchAll=false
```

---

## Test Output Example

```
Test Suites: 6 passed, 6 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        8.5 s
```
