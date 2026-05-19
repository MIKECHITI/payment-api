# Quick Start Guide

Get your Virtual Wallet API up and running in 5 minutes!

## Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm

## Installation

### 1. Clone Repository
```bash
cd payment-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file (or update existing):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/payment_api"
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Setup Database
```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Start Server
```bash
npm start                 # Production mode
# OR
npm run dev              # Development with auto-reload
```

Server runs on `http://localhost:5000`

## Quick Test

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
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

### 2. Deposit Money
```bash
curl -X POST http://localhost:5000/api/wallet/deposit \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
```

### 3. Check Balance
```bash
curl -X GET http://localhost:5000/api/wallet/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. View Swagger Docs
Open in browser:
```
http://localhost:5000/api-docs
```

## Run Tests

```bash
npm test              # Run all tests
npm run test:watch   # Run in watch mode
npm test -- --coverage  # With coverage report
```

Expected: 40+ tests passing ✅

## Project Structure

```
payment-api/
├── src/
│   ├── app.js                 # Express setup
│   ├── server.js              # Server bootstrap
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & error handling
│   ├── utils/                 # Helpers
│   ├── config/
│   │   └── swagger.js         # Swagger config
│   └── prisma/
│       └── schema.prisma      # Database schema
├── api.test.js               # Test suite
├── jest.config.js            # Jest config
├── package.json
├── .env                       # Environment variables
├── README.md                  # Full documentation
├── TESTING.md                 # Testing guide
└── SWAGGER.md                 # Swagger guide
```

## Key Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Atomic Transactions** - Fintech-grade money transfers  
✅ **Wallet Management** - Deposit, balance, history  
✅ **Rate Limiting** - Prevent abuse  
✅ **Comprehensive Tests** - 40+ test cases  
✅ **Interactive API Docs** - Swagger UI at `/api-docs`  

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/wallet/balance | ✅ | Get balance |
| POST | /api/wallet/deposit | ✅ | Deposit funds |
| POST | /api/transactions/transfer | ✅ | Send money |
| GET | /api/transactions/history | ✅ | View history |

## Common Commands

```bash
# Development
npm run dev

# Production
npm start

# Run tests
npm test

# Watch tests
npm run test:watch

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Run migrations
npm run prisma:migrate
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Fix:** Ensure PostgreSQL is running and DATABASE_URL is correct

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Change PORT in .env or kill process on port 5000

### JWT Secret Issues
```
Error: jwt malformed
```
**Fix:** Ensure JWT_SECRET is set in .env

## Next Steps

1. ✅ API is running
2. 📚 View interactive docs: `/api-docs`
3. 🧪 Run tests: `npm test`
4. 📖 Read full docs: [README.md](README.md)
5. 🚀 Deploy to cloud

## Production Deployment

Before deploying:

1. **Change JWT_SECRET** to a strong random string
2. **Set NODE_ENV=production**
3. **Use strong database password**
4. **Enable HTTPS**
5. **Set up rate limiting**
6. **Configure CORS properly**
7. **Add error monitoring (Sentry, etc.)**

Example for Heroku:
```bash
heroku create your-app-name
heroku config:set JWT_SECRET="your-strong-secret"
heroku config:set DATABASE_URL="postgresql://..."
git push heroku main
```

## Support & Resources

- **Full Documentation:** [README.md](README.md)
- **Testing Guide:** [TESTING.md](TESTING.md)
- **Swagger Guide:** [SWAGGER.md](SWAGGER.md)
- **API Status:** http://localhost:5000/health
- **Welcome:** http://localhost:5000/

---

**You're ready to go! 🚀**

Start coding and have fun building awesome fintech applications!
