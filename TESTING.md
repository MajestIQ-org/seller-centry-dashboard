# Automated Testing Guide

## 🧪 Test Setup

We use **Playwright** for end-to-end testing.

### Prerequisites

1. Make sure dev server is running or tests will start it automatically
2. Test user must exist in database:
   - Email: `test@example.com`
   - Password: `test123456`
   - Merchant ID: `EXAMPLE123`

## 🚀 Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run tests with UI (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View last test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/auth.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

## 📋 Test Coverage

### Authentication Tests (`tests/auth.spec.ts`)
- ✅ Login page displays correctly
- ✅ Login with valid credentials
- ✅ Login with invalid credentials shows error
- ✅ Logout functionality

### Dashboard Tests (`tests/dashboard.spec.ts`)
- ✅ Summary cards display
- ✅ Violations table displays
- ✅ Switch between Active/Resolved tabs
- ✅ Open violation detail modal
- ✅ Open Submit Ticket modal
- ✅ Open Invite User modal

### Submit Ticket Tests (`tests/submit-ticket.spec.ts`)
- ✅ All required fields present
- ✅ Field validation
- ✅ ASIN format validation
- ✅ Successful ticket submission

## 🔧 Configuration

Edit `playwright.config.ts` to:
- Change base URL (default: `http://example.localhost:5173`)
- Add more browsers (Firefox, Safari)
- Adjust timeouts
- Configure reporters

## 📊 Test Reports

After running tests, an HTML report is generated automatically.
View it with:
```bash
npm run test:report
```

## 🐛 Debugging Failed Tests

1. **Run in UI mode** to see tests execute in real-time:
   ```bash
   npm run test:ui
   ```

2. **Run in debug mode** to step through tests:
   ```bash
   npm run test:debug
   ```

3. **Check screenshots** - Failed tests automatically capture screenshots in `test-results/`

4. **Check traces** - Playwright records traces on first retry, view them in report

## ⚡ CI/CD Integration

To run tests in CI:
```bash
npm test -- --reporter=line
```

Set `CI=true` environment variable to enable:
- Automatic retries (2x)
- Optimized settings for CI

## 📝 Writing New Tests

Create new test files in `tests/` folder:

```typescript
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Hello')).toBeVisible()
  })
})
```

## 🎯 Best Practices

1. **Use `test.beforeEach`** for common setup (login)
2. **Use semantic selectors** (`getByRole`, `getByLabel`) instead of CSS
3. **Add timeouts** for async operations
4. **Clean up** after tests (logout, close modals)
5. **Keep tests isolated** - each test should work independently
