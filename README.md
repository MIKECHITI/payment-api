# Virtual Wallet API 💰

A production-ready full-stack fintech application with atomic transactions, JWT authentication, and comprehensive security. Built with Node.js/Express, Prisma ORM, PostgreSQL, and React + Vite. Perfect for fintech portfolios, interviews, and learning modern payment system architecture.

**Live Features:**
- ✅ REST API with Swagger/OpenAPI documentation
- ✅ Full-featured React frontend with user search for recipient lookup
- ✅ Atomic transactions with idempotency support
- ✅ Fintech-grade security (bcrypt, rate limiting, CORS, Helmet)
- ✅ PostgreSQL with Decimal precision for money handling
- ✅ Comprehensive error handling and input validation

## Features ✨

### Core Functionality
- ✅ **User Authentication** - Register & Login with JWT tokens
- ✅ **Wallet Management** - Create wallet on signup, check balance, deposit funds
- ✅ **Money Transfer** - Atomic transactions (deduct + add + log in one operation)
- ✅ **Recipient Search** - Find users by email for safe transfers
- ✅ **Transaction History** - Track all sent and received transfers with descriptions
- ✅ **Input Validation** - Email, password strength, amount validation
- ✅ **Rate Limiting** - Protect against abuse (configurable)
- ✅ **Error Handling** - Centralized error middleware with proper HTTP status codes

### Fintech Security & Best Practices
- 🔒 **Atomic Transactions** - Database-level consistency (all-or-nothing money transfers)
- 🔐 **JWT Authentication** - Secure token-based auth with expiration
- 🔑 **Password Security** - bcryptjs hashing with 10-round salt
- 📊 **Precise Money Handling** - Prisma Decimal type (prevents float rounding errors)
- ⚡ **Rate Limiting** - Configurable request throttling
- 🛡️ **Security Headers** - Helmet.js for OWASP compliance
- 🔄 **Idempotent Transfers** - Retry-safe with Idempotency-Key support
- 📈 **Database Indexes** - Optimized queries on sender/receiver lookups
- 🚀 **CORS Protection** - Configurable allowed origins

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js 18+, Express.js 4 |
| **Database** | PostgreSQL 12+, Prisma ORM 5 |
| **Frontend** | React 18, Vite 5, Axios |
| **Authentication** | JWT (jsonwebtoken) |
| **Security** | bcryptjs, Helmet, express-rate-limit |
| **API Docs** | Swagger/OpenAPI 3.0 |
| **Testing** | Jest, Supertest |

## Project Structure

```
payment-api/
├── frontend/                          # React + Vite app
│   ├── src/
│   │   ├── pages/                    # Dashboard, Transfer, Wallet, History, etc.
│   │   ├── services/                 # API clients (authService, transactionService, userService)
│   │   ├── contexts/                 # AuthContext for state management
│   │   └── components/               # Reusable UI components
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── app.js                         # Express app configuration
│   ├── server.js                      # Server bootstrap with JWT_SECRET guard
│   ├── controllers/                   # HTTP request handlers
│   │   ├── authController.js         # Register/Login
│   │   ├── walletController.js       # Balance/Deposit
│   │   ├── transactionController.js  # Transfer/History
│   │   └── userController.js         # Search users by email
│   ├── services/                      # Business logic & DB transactions
│   │   ├── authService.js
│   │   ├── walletService.js
│   │   ├── transactionService.js
│   │   └── userService.js
│   ├── routes/                        # API route definitions
│   │   ├── authRoutes.js
│   │   ├── walletRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/                    # Express middleware
│   │   ├── authMiddleware.js          # JWT verification with error differentiation
│   │   ├── errorMiddleware.js         # Centralized error handling
│   │   └── rateLimiter.js
│   ├── lib/
│   │   └── prisma.js                  # Shared Prisma client
│   ├── utils/
│   │   ├── generateToken.js           # JWT utility functions
│   │   └── validators.js              # Input validation helpers
│   ├── config/
│   │   ├── db.js                      # Database config
│   │   └── swagger.js                 # OpenAPI specifications
│   └── prisma/
│       └── schema.prisma              # Data schema
├── .env                               # Environment variables (add your own)
├── .env.example                       # Template for .env
├── package.json
└── README.md
```

## Frontend Features

The frontend is a React + Vite app with secure authentication context and real-time API integration.

### Pages
- **Login** - User authentication with JWT persistence
- **Register** - New user signup with wallet creation
- **Dashboard** - Overview of balance and recent transactions
- **Wallet** - Check balance and deposit funds
- **Transfer** - Search recipients by email, enter amount & optional description
- **History** - View all sent and received transactions

### Setup
```bash
cd frontend
npm install
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
```

## Database Schema

### Users (with 1:1 Wallet and 1:many Transactions)
```prisma
model User {
  id                    Int
  email                 String @unique
  name                  String
  passwordHash          String
  wallet                Wallet?
  sentTransactions      Transaction[] @relation("sender")
  receivedTransactions  Transaction[] @relation("receiver")
  createdAt             DateTime
  updatedAt             DateTime
}
```

### Wallets (1:1 with Users)
```prisma
model Wallet {
  id        Int
  userId    Int @unique
  balance   Decimal @default(0)  # Precise money handling
  createdAt DateTime
  updatedAt DateTime
}
```

### Transactions (with atomic operations, descriptions, and idempotency)
```prisma
model Transaction {
  id              Int
  senderId        Int
  receiverId      Int
  amount          Decimal
  status          String @default("completed")
  reference       String @unique  # Unique per transfer
  idempotencyKey  String @unique  # For retry safety
  description     String?         # Payment note
  createdAt       DateTime
  
  @@index([senderId])    # Query optimization
  @@index([receiverId])
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Get JWT token

### Wallet
- `GET /api/wallet/balance` - Check wallet balance
- `POST /api/wallet/deposit` - Add funds to wallet

### Transactions
- `POST /api/transactions/transfer` - Send money (with optional idempotency key)
- `GET /api/transactions/history` - Get all transactions

### User Search
- `GET /api/users/search?email=example` - Find users by email (authenticated)

**Full Documentation:** Visit `http://localhost:5000/api-docs` for interactive Swagger UI.

## Setup & Installation

### Prerequisites
- **Node.js** 18+ ([download](https://nodejs.org))
- **PostgreSQL** 12+ ([download](https://www.postgresql.org))
- **npm** (comes with Node.js)

### 1. Clone Repository
```bash
git clone https://github.com/MIKECHITI/payment-api.git
cd payment-api
```

### 2. Backend Setup
```bash
npm install

# Create .env file
cp .env.example .env

# Add to .env:
DATABASE_URL="postgresql://user:password@localhost:5432/payment_api"
JWT_SECRET="your-super-secret-key-min-32-chars"
PORT=5000
NODE_ENV=development
ALLOWED_ORIGIN="http://localhost:5173"
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Create and migrate database
npm run prisma:push

# (Optional) Seed with test data
npm run prisma:seed
```

### 4. Start Backend
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

Backend runs on `http://localhost:5000`

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Testing

Run comprehensive test suite:
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

See [TESTING.md](TESTING.md) for detailed test documentation and examples.

## API Documentation & Examples

### Interactive Swagger UI
Visit `http://localhost:5000/api-docs` to:
- View all endpoint schemas
- Test requests with sample data
- See response formats
- Copy curl commands

See [SWAGGER.md](SWAGGER.md) for complete guide.

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/payment_api"

# JWT
JWT_SECRET="min-32-character-random-secret-key"  # Required for startup
JWT_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV=development|production

# CORS
ALLOWED_ORIGIN="http://localhost:5173"  # Frontend URL

# Rate Limiting
RATE_LIMIT_WINDOW=15       # Minutes
RATE_LIMIT_MAX_REQUESTS=100  # Requests per window
```

## Security Features

✅ **Password Security** - 10-round bcrypt hashing  
✅ **Token Expiration** - JWT expiry control  
✅ **Atomic Transactions** - Database-level consistency  
✅ **Input Validation** - Email, password, amount checks  
✅ **Rate Limiting** - Configurable throttling  
✅ **CORS Protection** - Whitelist allowed origins  
✅ **Security Headers** - Helmet.js defaults  
✅ **Error Sanitization** - No sensitive data in responses  
✅ **Decimal Precision** - Prevents float rounding errors  
✅ **Idempotency** - Safe retry mechanism for transfers  

## Common Issues & Troubleshooting

**JWT_SECRET not set:**
```
Error: FATAL: JWT_SECRET is not set in environment
```
Solution: Add `JWT_SECRET` to `.env` before starting server.

**Database connection fails:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running on port 5432. Check `DATABASE_URL` in `.env`.

**Port 5000 already in use:**
```bash
# Use different port
PORT=3000 npm run dev
```

See [LAUNCH.md](LAUNCH.md) and [QUICKSTART.md](QUICKSTART.md) for more details.

## Project Files

- 📄 [STRUCTURE.md](STRUCTURE.md) - Detailed project architecture
- 📄 [LAUNCH.md](LAUNCH.md) - Complete startup guide
- 📄 [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start
- 📄 [SWAGGER.md](SWAGGER.md) - API documentation guide
- 📄 [TESTING.md](TESTING.md) - Test suite documentation
- 📄 [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) - Feature checklist

## GitHub Topics

Add these topics to your repository for better discoverability:

`payment-api` `fintech` `rest-api` `express` `nodejs` `react` `prisma` `postgresql` `jwt-authentication` `full-stack` `atomic-transactions` `security`

## Learning Path

This project covers:
1. **REST API Design** - Resource-oriented endpoints
2. **Database Design** - Relationships, transactions, indexes
3. **Authentication** - JWT token lifecycle
4. **Security** - Input validation, password hashing, CORS
5. **Error Handling** - Centralized middleware pattern
6. **Frontend Integration** - React with authenticated API calls
7. **Testing** - Unit and integration test patterns

Perfect for fintech interviews, portfolio demonstration, or learning production API patterns.

## License

ISC

## Author

**MIKECHITI** - [GitHub](https://github.com/MIKECHITI)

---

**Questions or Issues?** Open an issue on [GitHub Issues](https://github.com/MIKECHITI/payment-api/issues)


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

Built for fintech
