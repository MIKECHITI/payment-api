/**
 * Virtual Wallet API - Comprehensive Test Suite
 * Tests all endpoints: authentication, wallet, and transactions
 */

const request = require('supertest');
const app = require('./src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test user data
let token1, token2, userId1, userId2;

describe('Virtual Wallet API - Complete Test Suite', () => {
  
  // Setup: Clean database before all tests
  beforeAll(async () => {
    try {
      // Clean up existing data
      await prisma.transaction.deleteMany({});
      await prisma.wallet.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (error) {
      console.log('No data to clean');
    }
  });

  // Teardown: Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ============================================
  // AUTHENTICATION TESTS
  // ============================================

  describe('POST /api/auth/register', () => {
    
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('alice@example.com');
      expect(response.body.user.name).toBe('Alice Johnson');

      // Store token and userId for subsequent tests
      token1 = response.body.token;
      userId1 = response.body.user.id;
    });

    it('should register a second user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob Smith',
          email: 'bob@example.com',
          password: 'password456',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('bob@example.com');

      // Store second user's token and ID
      token2 = response.body.token;
      userId2 = response.body.user.id;
    });

    it('should fail to register with missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail to register with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already registered');
    });

    it('should fail to register with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid email');
    });

    it('should fail to register with password less than 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: '12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('alice@example.com');
    });

    it('should fail to login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should fail to login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });

  // ============================================
  // WALLET TESTS
  // ============================================

  describe('GET /api/wallet/balance', () => {
    
    it('should get balance successfully with valid token', async () => {
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('walletId');
      expect(response.body.balance).toBe(0);
    });

    it('should fail to get balance without token', async () => {
      const response = await request(app)
        .get('/api/wallet/balance');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('No token');
    });

    it('should fail to get balance with invalid token', async () => {
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/wallet/deposit', () => {
    
    it('should deposit funds successfully', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          amount: 1000,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Deposit successful');
      expect(response.body.balance).toBe(1000);
      expect(response.body.amount).toBe(1000);
    });

    it('should deposit funds for second user', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          amount: 500,
        });

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(500);
    });

    it('should allow multiple deposits', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          amount: 500,
        });

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(1500); // 1000 + 500
    });

    it('should fail to deposit with zero amount', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          amount: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid amount');
    });

    it('should fail to deposit with negative amount', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          amount: -100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid amount');
    });

    it('should fail to deposit without token', async () => {
      const response = await request(app)
        .post('/api/wallet/deposit')
        .send({
          amount: 100,
        });

      expect(response.status).toBe(401);
    });
  });

  // ============================================
  // TRANSACTION TESTS (ATOMIC OPERATIONS)
  // ============================================

  describe('POST /api/transactions/transfer', () => {
    
    it('should transfer money successfully', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: userId2,
          amount: 200,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Transfer successful');
      expect(response.body.transaction).toHaveProperty('id');
      expect(response.body.transaction).toHaveProperty('reference');
      expect(response.body.transaction.amount).toBe(200);
      expect(response.body.transaction.status).toBe('completed');
      expect(response.body.transaction.from).toBe('Alice Johnson');
      expect(response.body.transaction.to).toBe('Bob Smith');
    });

    it('should verify sender balance decreased after transfer', async () => {
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(1300); // 1500 - 200
    });

    it('should verify receiver balance increased after transfer', async () => {
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(700); // 500 + 200
    });

    it('should fail to transfer with insufficient balance', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: userId2,
          amount: 10000,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Insufficient balance');
    });

    it('should fail to transfer to yourself', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: userId1,
          amount: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Cannot transfer to yourself');
    });

    it('should fail to transfer to non-existent receiver', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: 9999,
          amount: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Receiver not found');
    });

    it('should fail to transfer without authentication', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .send({
          receiverId: userId2,
          amount: 100,
        });

      expect(response.status).toBe(401);
    });
  });

  // ============================================
  // TRANSACTION HISTORY TESTS
  // ============================================

  describe('GET /api/transactions/history', () => {
    
    it('should get transaction history for user', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.transactions)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('should show sent transaction in history', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      const sentTransaction = response.body.transactions.find(
        (tx) => tx.type === 'sent'
      );
      expect(sentTransaction).toBeDefined();
      expect(sentTransaction.amount).toBe(200);
    });

    it('should show received transaction in history', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      const receivedTransaction = response.body.transactions.find(
        (tx) => tx.type === 'received'
      );
      expect(receivedTransaction).toBeDefined();
      expect(receivedTransaction.amount).toBe(200);
    });

    it('should include transaction details', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      const transaction = response.body.transactions[0];
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('reference');
      expect(transaction).toHaveProperty('from');
      expect(transaction).toHaveProperty('to');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('status');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('timestamp');
    });

    it('should fail to get history without token', async () => {
      const response = await request(app)
        .get('/api/transactions/history');

      expect(response.status).toBe(401);
    });
  });

  // ============================================
  // HEALTH CHECK
  // ============================================

  describe('GET /health', () => {
    
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toContain('running');
    });
  });

  // ============================================
  // INTEGRATION TEST
  // ============================================

  describe('Complete User Journey', () => {
    
    it('should complete full workflow: register -> deposit -> transfer -> history', async () => {
      // 1. Register new user
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          password: 'password789',
        });

      expect(registerRes.status).toBe(201);
      const charlieToken = registerRes.body.token;

      // 2. Check initial balance
      const balanceRes = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${charlieToken}`);

      expect(balanceRes.status).toBe(200);
      expect(balanceRes.body.balance).toBe(0);

      // 3. Deposit funds
      const depositRes = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${charlieToken}`)
        .send({ amount: 2000 });

      expect(depositRes.status).toBe(200);
      expect(depositRes.body.balance).toBe(2000);

      // 4. Transfer to Alice
      const transferRes = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${charlieToken}`)
        .send({
          receiverId: userId1,
          amount: 500,
        });

      expect(transferRes.status).toBe(201);

      // 5. Check balance after transfer
      const finalBalanceRes = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${charlieToken}`);

      expect(finalBalanceRes.status).toBe(200);
      expect(finalBalanceRes.body.balance).toBe(1500); // 2000 - 500

      // 6. View transaction history
      const historyRes = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${charlieToken}`);

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.transactions.length).toBeGreaterThan(0);
    });
  });
});
