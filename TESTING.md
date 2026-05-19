# Testing Guide for Virtual Wallet API

## Overview

This project includes a comprehensive test suite that validates all API endpoints using Jest and Supertest. The tests cover:

- ✅ Authentication (register, login)
- ✅ Wallet operations (balance, deposit)
- ✅ Money transfers (atomic transactions)
- ✅ Transaction history
- ✅ Error handling & edge cases
- ✅ Integration tests (complete user journeys)

## Test Structure

**File:** `api.test.js` (root level)

The test suite is organized by feature with 40+ test cases:

```
Authentication Tests (6 tests)
├─ Register endpoint
└─ Login endpoint

Wallet Tests (7 tests)
├─ Get balance
└─ Deposit funds

Transaction Tests (10 tests)
├─ Transfer money (atomic)
└─ Transaction history

Integration Test (1 test)
└─ Complete user workflow
```

## Setup & Installation

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `jest` - Testing framework
- `supertest` - HTTP assertion library
- All production dependencies

### 2. Setup Test Database
```bash
# Create a test database or use your existing one
# Update DATABASE_URL in .env to point to test database

# Configure Prisma
npm run prisma:generate
npm run prisma:push
```

### 3. Configure Environment
Make sure `.env` is properly configured:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/payment_api"
JWT_SECRET=test_secret_key
NODE_ENV=test
```

## Running Tests

### Run All Tests
```bash
npm test
```

Output example:
```
 PASS  api.test.js
  Virtual Wallet API - Complete Test Suite
    POST /api/auth/register
      ✓ should register a new user successfully (45ms)
      ✓ should register a second user (32ms)
      ✓ should fail to register with duplicate email (28ms)
      ✓ should fail to register with invalid email format (15ms)
      ✓ should fail to register with password less than 6 characters (12ms)
    POST /api/auth/login
      ✓ should login successfully with correct credentials (28ms)
      ✓ should fail to login with wrong password (35ms)
      ✓ should fail to login with non-existent email (18ms)
    GET /api/wallet/balance
      ✓ should get balance successfully with valid token (22ms)
      ✓ should fail to get balance without token (8ms)
      ✓ should fail to get balance with invalid token (10ms)
    POST /api/wallet/deposit
      ✓ should deposit funds successfully (25ms)
      ✓ should deposit funds for second user (18ms)
      ✓ should allow multiple deposits (15ms)
      ✓ should fail to deposit with zero amount (12ms)
      ✓ should fail to deposit with negative amount (10ms)
      ✓ should fail to deposit without token (8ms)
    POST /api/transactions/transfer
      ✓ should transfer money successfully (32ms)
      ✓ should verify sender balance decreased (18ms)
      ✓ should verify receiver balance increased (15ms)
      ✓ should fail to transfer with insufficient balance (22ms)
      ✓ should fail to transfer to yourself (10ms)
      ✓ should fail to transfer to non-existent receiver (12ms)
      ✓ should fail to transfer without authentication (8ms)
    GET /api/transactions/history
      ✓ should get transaction history (28ms)
      ✓ should show sent transaction (15ms)
      ✓ should show received transaction (18ms)
      ✓ should include transaction details (12ms)
      ✓ should fail to get history without token (8ms)
    GET /health
      ✓ should return health status (5ms)
    Complete User Journey
      ✓ should complete full workflow (85ms)

Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        12.456s
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

Great for development! Automatically re-runs tests when files change.

### Run Specific Test Suite
```bash
# Run only authentication tests
npm test -- --testNamePattern="POST /api/auth/register"

# Run only wallet tests
npm test -- --testNamePattern="Wallet Tests"

# Run integration tests
npm test -- --testNamePattern="Complete User Journey"
```

## Test Coverage

### Generate Coverage Report
```bash
npm test -- --coverage
```

This will show:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

Example output:
```
------------|----------|----------|----------|----------|
File       | % Stmts  | % Branch | % Funcs  | % Lines  |
------------|----------|----------|----------|----------|
All files  |   87.5   |   82.1   |   90.2   |   87.5   |
 app.js    |   100    |   100    |   100    |   100    |
 services/ |   85.3   |   80.1   |   88.9   |   85.3   |
 routes/   |   100    |   100    |   100    |   100    |
------------|----------|----------|----------|----------|
```

## What Each Test Validates

### Authentication Tests
1. **Register Success** - Creates user with wallet
2. **Register Duplicate Email** - Prevents duplicate emails
3. **Register Invalid Email** - Validates email format
4. **Register Weak Password** - Enforces minimum length
5. **Login Success** - Returns valid JWT token
6. **Login Wrong Password** - Rejects invalid credentials

### Wallet Tests
1. **Get Balance** - Returns user's wallet balance
2. **Deposit Success** - Increases wallet balance
3. **Multiple Deposits** - Accumulates balance correctly
4. **Deposit Zero** - Rejects zero or negative amounts
5. **Deposit Unauthorized** - Requires authentication

### Transaction Tests
1. **Transfer Success** - Deducts sender, credits receiver (atomic)
2. **Balance Verification** - Confirms balances updated correctly
3. **Insufficient Funds** - Prevents overspending
4. **Self Transfer** - Prevents transferring to yourself
5. **Invalid Receiver** - Validates receiver exists
6. **Unauthorized Transfer** - Requires authentication

### Transaction History Tests
1. **Get History** - Returns user's transactions
2. **Sent Transactions** - Shows sent transfers
3. **Received Transactions** - Shows received transfers
4. **Transaction Details** - Includes all necessary fields
5. **Unauthorized History** - Requires authentication

### Integration Tests
1. **Complete Journey** - Full workflow validation:
   - Register user
   - Check initial balance
   - Deposit funds
   - Transfer money
   - Verify balances
   - View history

## Important Notes

### Database Isolation
- Tests clean the database before and after execution
- Each test is independent and doesn't affect others
- Safe to run multiple times

### Test Database
- Use a separate test database in `.env`
- Or reset your development database after tests
- Tests will delete all data!

### Atomic Transactions
The most critical test is the **transfer test** which validates:
```javascript
// All three operations succeed together or fail together
- Deduct sender balance
- Add receiver balance
- Log transaction
```

If any step fails, the entire operation rolls back.

## Debugging Failed Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Single Test
```bash
npm test -- --testNamePattern="should transfer money successfully"
```

### Debug a Specific Test
Add to your test:
```javascript
it('should transfer money successfully', async () => {
  console.log('Debug info:', { token1, userId1, userId2 });
  // ... rest of test
});
```

Then run:
```bash
npm test 2>&1 | grep "Debug"
```

### Common Issues

**Issue:** Tests timeout
```
Timeout - Async callback was not invoked
```
**Solution:** Increase timeout in jest.config.js:
```javascript
testTimeout: 60000 // 60 seconds
```

**Issue:** Database connection failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct

**Issue:** Token-related failures
```
Invalid or expired token
```
**Solution:** Check JWT_SECRET in .env matches the app's secret

## Test Maintenance

### Adding New Tests
1. Add test case to `api.test.js`
2. Follow existing patterns
3. Use `describe` blocks for grouping
4. Use meaningful test descriptions
5. Run tests to verify

Example:
```javascript
describe('POST /api/new-feature', () => {
  it('should do something', async () => {
    const response = await request(app)
      .post('/api/new-feature')
      .set('Authorization', `Bearer ${token1}`)
      .send({ data: 'value' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('field');
  });
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run prisma:generate
      - run: npm run prisma:push
      - run: npm test
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm test -- --coverage` | Generate coverage report |
| `npm test -- --verbose` | Show detailed output |
| `npm test -- --testNamePattern="pattern"` | Run specific tests |

## Next Steps

After tests pass ✅:
1. Add Swagger/OpenAPI documentation
2. Deploy to production
3. Set up CI/CD pipeline
4. Monitor in production

---

**Happy Testing! 🧪**
