# Virtual Wallet API 💰

A production-ready REST API for a digital wallet system built with Node.js, Express, PostgreSQL, and Prisma. Perfect for fintech interviews and portfolio projects.

## Features ✨

### Core Functionality
- ✅ **User Authentication** - Register & Login with JWT tokens
- ✅ **Wallet Management** - Create wallet on signup, check balance, deposit funds
- ✅ **Money Transfer** - Atomic transactions (deduct + add + log in one operation)
- ✅ **Transaction History** - Track all sent and received transfers
- ✅ **Input Validation** - Email, password, amount validation
- ✅ **Rate Limiting** - Protect against abuse
- ✅ **Error Handling** - Comprehensive error middleware

### Fintech Best Practices
- 🔒 **Atomic Transactions** - Money transfers use database transactions (critical in fintech)
- 🔐 **JWT Authentication** - Secure token-based auth
- 🔑 **Password Hashing** - bcryptjs for secure password storage
- 📊 **Proper Relations** - User → Wallet (1:1), User → Transactions (1:many)
- ⚡ **Rate Limiting** - Prevent brute force attacks

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Rate Limiting | express-rate-limit |
| Security | Helmet, CORS |

## Project Structure

```
payment-api/
├── frontend/                 # React frontend app
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server bootstrap
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── walletController.js
│   │   └── transactionController.js
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── walletService.js
│   │   └── transactionService.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── walletRoutes.js
│   │   └── transactionRoutes.js
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/                 # Utilities
│   │   ├── generateToken.js
│   │   └── validators.js
│   └── prisma/
│       └── schema.prisma
├── .env
├── package.json
└── README.md
```

## Frontend Setup

The frontend is a React + Vite app located in `frontend/`.

### Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### Frontend routes
- `/login` - login page
- `/register` - signup page
- `/dashboard` - authenticated dashboard
- `/wallet` - wallet balance and deposit
- `/transfer` - send money
- `/history` - transaction history

## Database Schema

### Users Table
```sql
users {
  id            Int     @id @default(autoincrement())
  email         String  @unique
  name          String
  password_hash String
  created_at    DateTime
  updated_at    DateTime
}
```

### Wallets Table (1:1 with Users)
```sql
wallets {
  id         Int      @id @default(autoincrement())
  user_id    Int      @unique
  balance    Float    @default(0.0)
  created_at DateTime
  updated_at DateTime
}
```

### Transactions Table
```sql
transactions {
  id          Int      @id @default(autoincrement())
  sender_id   Int
  receiver_id Int
  amount      Float
  status      String   @default("completed")
  reference   String   @unique (for tracking)
  created_at  DateTime
}
```

## API Documentation

**Interactive Swagger UI:** Visit `http://localhost:5000/api-docs` for interactive API documentation where you can test all endpoints directly from your browser.

**See:** [SWAGGER.md](SWAGGER.md) for complete Swagger documentation guide with examples and troubleshooting.

**Testing Guide:** [TESTING.md](TESTING.md) - Run comprehensive test suite with 40+ test cases.



### 1. Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm

### 2. Clone & Install
```bash
git clone <repo-url>
cd payment-api
npm install
```

### 3. Configure Database
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/payment_api"
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Setup Prisma
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Or push schema to DB
npm run prisma:push
```

### 5. Start Server
```bash
npm start              # Production
npm run dev           # Development (with nodemon)
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Wallet
```
GET  /api/wallet/balance      (requires auth)
POST /api/wallet/deposit      (requires auth)
```

### Transactions
```
POST /api/transactions/transfer   (requires auth)
GET  /api/transactions/history    (requires auth)
```

### Health Check
```
GET /health
```

## Usage Examples

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 3. Check Balance
```bash
curl -X GET http://localhost:5000/api/wallet/balance \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "balance": 0,
  "walletId": 1
}
```

### 4. Deposit Funds
```bash
curl -X POST http://localhost:5000/api/wallet/deposit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100
  }'
```

**Response:**
```json
{
  "message": "Deposit successful",
  "balance": 100,
  "amount": 100
}
```

### 5. Transfer Money (Atomic Transaction)
```bash
curl -X POST http://localhost:5000/api/transactions/transfer \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": 2,
    "amount": 50
  }'
```

**Response:**
```json
{
  "message": "Transfer successful",
  "transaction": {
    "id": 1,
    "reference": "txn_abc123",
    "from": "John Doe",
    "to": "Jane Smith",
    "amount": 50,
    "status": "completed",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 6. View Transaction History
```bash
curl -X GET http://localhost:5000/api/transactions/history \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "reference": "txn_abc123",
      "from": "John Doe",
      "to": "Jane Smith",
      "amount": 50,
      "status": "completed",
      "type": "sent",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

## Key Fintech Concepts Demonstrated

### 1. Atomic Transactions
The `transfer` operation uses Prisma `$transaction` to ensure atomicity:
```javascript
const result = await prisma.$transaction(async (tx) => {
  // All three operations succeed together or fail together
  await tx.wallet.update({ ... }); // deduct sender
  await tx.wallet.update({ ... }); // add receiver
  await tx.transaction.create({ ... }); // log transaction
});
```

### 2. JWT Authentication
- Token generated on login
- Token validated on protected routes
- Prevents unauthorized access

### 3. Input Validation
- Email format validation
- Password minimum length
- Amount must be positive number

### 4. Error Handling
- Validation errors (400)
- Authorization errors (401)
- Not found errors (404)
- Server errors (500)

## Interview Talking Points 🎤

1. **Atomic Transactions**: "Money transfers require atomicity. If any step fails, the entire transaction rolls back to prevent inconsistent state."

2. **JWT Authentication**: "JWT tokens are stateless and scalable. No need for session storage on the server."

3. **Database Design**: "One-to-one relationship between users and wallets ensures each user has exactly one wallet. Foreign keys maintain referential integrity."

4. **Error Handling**: "Comprehensive error handling with proper HTTP status codes and meaningful error messages."

5. **Rate Limiting**: "Rate limiting prevents abuse and protects against brute force attacks."

6. **Input Validation**: "Always validate user input before processing to prevent invalid data and potential security issues."

## Security Best Practices

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Environment variables for secrets
- ✅ CORS protection
- ✅ Helmet for HTTP headers
- ✅ Rate limiting on all routes
- ✅ Input validation on all endpoints

## Testing the API

### Manual Testing with Postman
1. Import endpoints into Postman
2. Register a test user
3. Copy token from response
4. Add to `Authorization: Bearer <token>` header
5. Test each endpoint

### Example Test Flow
1. Register user 1 (Alice)
2. Register user 2 (Bob)
3. Alice deposits 100
4. Alice transfers 50 to Bob
5. Check Alice's balance (should be 50)
6. Check Bob's balance (should be 50)
7. View transaction history for both

## Project Status

- ✅ Local server verified on `http://localhost:5000`
- ✅ Swagger docs available at `http://localhost:5000/api-docs`
- ✅ Prisma schema synced with `npm run prisma:push`
- ✅ Test suite passed successfully with `npm test`
- ✅ End-to-end flow validated: register → deposit → transfer → history

## Future Enhancements

- [ ] Transaction reversal
- [ ] Withdrawal functionality
- [ ] Admin panel for transaction monitoring
- [ ] Webhook notifications
- [ ] Two-factor authentication
- [ ] Swagger/OpenAPI documentation
- [ ] Unit tests with Jest
- [ ] Integration tests
- [ ] Docker containerization
- [ ] Deployment to cloud (AWS, Heroku, etc.)

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running

### Issue: "Prisma client not generated"
**Solution**: Run `npm run prisma:generate`

### Issue: "JWT secret not found"
**Solution**: Add `JWT_SECRET` to `.env`

## License

ISC

## Author

Built for fintech internship preparation

---

**Ready for your internship interview!** This project demonstrates:
- Full-stack API development
- Database design for financial systems
- Authentication & authorization
- Atomic transactions
- Professional code organization
- Error handling & validation
