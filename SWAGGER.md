# Swagger API Documentation Guide

## Overview

Your Virtual Wallet API comes with comprehensive interactive API documentation powered by Swagger/OpenAPI 3.0. This allows you to explore, test, and understand all API endpoints directly from your browser.

## Features

✨ **Interactive API Explorer**
- Try endpoints directly from the UI
- Automatic request/response validation
- Real-time API testing

📚 **Complete Endpoint Documentation**
- Detailed descriptions of each endpoint
- All request/response schemas
- Error responses and codes

🔐 **Authentication Support**
- JWT token integration
- Automatic header injection
- Token persistence across requests

📊 **Rich Data Models**
- User, Wallet, Transaction schemas
- Request/Response examples
- Field descriptions and types

🔄 **Request/Response Examples**
- Real-world usage examples
- Parameter descriptions
- Error scenarios

## Accessing Swagger UI

### 1. Start Your API
```bash
npm install              # If not already done
npm run prisma:push     # Setup database
npm start               # Start server (or npm run dev)
```

### 2. Open Swagger UI
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

You should see the Swagger UI dashboard with all endpoints organized by category.

## API Documentation Structure

### **Authentication Endpoints**
```
POST /api/auth/register   - Create new user account
POST /api/auth/login      - Login and get JWT token
```

### **Wallet Endpoints**
```
GET  /api/wallet/balance  - Get wallet balance
POST /api/wallet/deposit  - Add funds to wallet
```

### **Transaction Endpoints**
```
POST /api/transactions/transfer   - Transfer money (atomic)
GET  /api/transactions/history    - Get transaction history
```

### **General Endpoints**
```
GET /health              - API health status
GET /                    - Welcome endpoint
```

## Using Swagger UI

### Step 1: Authorize (Get JWT Token)

1. Click the **Authorize** button (top-right with lock icon)
2. Leave the "Bearer Token" field empty initially
3. Go to **Authentication** section
4. **Click** "POST /api/auth/register" to expand it
5. Click **Try it out**
6. Fill in the request body:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
7. Click **Execute**
8. Copy the `token` from the response
9. Return to **Authorize** and paste: `<your-token-here>`
10. Click **Authorize** then **Close**

### Step 2: Test Authenticated Endpoints

Now all endpoints requiring authentication will automatically use your token!

1. Expand **GET /api/wallet/balance**
2. Click **Try it out**
3. Click **Execute**
4. View the response with your wallet balance

### Step 3: Try a Full Workflow

**Deposit Money:**
1. Expand **POST /api/wallet/deposit**
2. Click **Try it out**
3. Enter amount: `{ "amount": 500 }`
4. Click **Execute**
5. See your new balance

**Check Balance:**
1. Expand **GET /api/wallet/balance**
2. Click **Try it out**
3. Click **Execute**
4. Verify balance increased

**View History:**
1. Expand **GET /api/transactions/history**
2. Click **Try it out**
3. Click **Execute**
4. See transaction records

## Understanding the Documentation

### Request Body Schema
Shows required fields and data types:
```json
{
  "amount": "number (required, must be > 0)",
  "description": "string (optional)"
}
```

### Response Examples
Shows what to expect back from the API:
```json
{
  "message": "Transfer successful",
  "transaction": {
    "id": 1,
    "reference": "txn_abc123",
    "from": "Alice Johnson",
    "to": "Bob Smith",
    "amount": 200,
    "status": "completed"
  }
}
```

### Error Responses
Shows possible errors:
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **404** - Not Found (resource doesn't exist)
- **500** - Server Error

## Common Tasks

### Task 1: Register Two Users

1. **Register User 1 (Alice)**
   - POST /api/auth/register
   - Body: `{ "name": "Alice", "email": "alice@example.com", "password": "pass123" }`
   - Copy token → Click Authorize → Paste token

2. **Register User 2 (Bob)**
   - Clear browser cookie or open incognito
   - POST /api/auth/register
   - Body: `{ "name": "Bob", "email": "bob@example.com", "password": "pass456" }`
   - Copy token

3. **Switch Between Users**
   - Click Authorize
   - Replace token with the other user's token
   - All endpoints will use the new user

### Task 2: Send Money from Alice to Bob

1. **Login as Alice**
   - Use her token from registration or fresh login
   - Click Authorize

2. **Deposit Money to Alice's Wallet**
   - POST /api/wallet/deposit
   - Body: `{ "amount": 1000 }`

3. **Check Balance**
   - GET /api/wallet/balance
   - Should show 1000

4. **Transfer to Bob**
   - POST /api/transactions/transfer
   - Body: `{ "receiverId": 2, "amount": 250 }`
   - (Replace receiverId with Bob's ID from his registration)

5. **Check Alice's New Balance**
   - GET /api/wallet/balance
   - Should show 750

6. **Switch to Bob and Check His Balance**
   - Use Bob's token
   - Click Authorize
   - GET /api/wallet/balance
   - Should show 250

7. **View Transaction History**
   - GET /api/transactions/history
   - See both sent and received transactions

### Task 3: Handle Errors

1. **Insufficient Balance Error**
   - POST /api/transactions/transfer
   - Try transferring more than your balance
   - Get 400 error: "Insufficient balance"

2. **Invalid Token Error**
   - Click Authorize
   - Enter wrong token
   - Try any endpoint
   - Get 401 error: "Invalid or expired token"

3. **Duplicate Email Error**
   - POST /api/auth/register
   - Use an email that already exists
   - Get 400 error: "Email already registered"

## API Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET balance, POST deposit |
| 201 | Created | Register, Transfer |
| 400 | Bad Request | Invalid amount, duplicate email |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Non-existent receiver |
| 500 | Server Error | Database error |

## Authentication Flow

### Step-by-Step:

1. **User Registers**
   ```
   POST /api/auth/register
   Request: { name, email, password }
   Response: { token, user }
   ```

2. **Store Token**
   - Save JWT token
   - Valid for 7 days (configurable in .env)

3. **Use Token for Requests**
   ```
   Header: Authorization: Bearer <token>
   ```

4. **All Authenticated Endpoints Use Token**
   - Wallet endpoints
   - Transaction endpoints
   - Automatically added by Swagger UI after "Authorize"

## Advanced: Download OpenAPI Spec

The full OpenAPI specification can be accessed at:
```
http://localhost:5000/api-docs/swagger.json
```

You can import this into:
- Postman
- Insomnia
- Other API clients
- Code generation tools

## Customization

### Add Custom Logo
Edit `src/config/swagger.js` and add under `swaggerOptions`:
```javascript
logos: {
  small: 'https://your-logo-url.png'
}
```

### Change Title/Description
Edit `src/config/swagger.js` info section:
```javascript
title: 'Your API Name',
description: 'Your description'
```

### Add More Examples
In route files, add to endpoint documentation:
```javascript
/**
 * @swagger
 * example:
 *   application/json:
 *     value:
 *       amount: 500
 */
```

## Troubleshooting

### Issue: 404 on /api-docs
**Solution:** Make sure swagger packages are installed:
```bash
npm install swagger-ui-express swagger-jsdoc
```

### Issue: No endpoints showing
**Solution:** Verify JSDoc comments in route files are properly formatted:
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   method: description
 */
```

### Issue: Token not persisting
**Solution:** This is expected! Each Swagger session is independent. Always paste token in Authorize.

### Issue: Can't test endpoints
**Solution:** Make sure database is running and connected:
```bash
npm run prisma:push
```

## Exporting API Docs

### Generate Postman Collection
1. Visit `http://localhost:5000/api-docs/swagger.json`
2. Right-click → Save as `openapi.json`
3. In Postman: Import → Upload JSON

### Generate Code (Python, JavaScript, etc.)
Use OpenAPI Generator:
```bash
npx openapi-generator-cli generate -i http://localhost:5000/api-docs/swagger.json -g javascript -o ./sdk
```

## Performance Tips

- Swagger UI auto-loads. Disable if not needed:
  ```javascript
  // In production, remove or conditionally load Swagger
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
  ```

## Next Steps

1. ✅ Swagger UI is live at `/api-docs`
2. 📚 Test all endpoints interactively
3. 🔄 Share documentation with team
4. 📤 Export for Postman/Insomnia
5. 🚀 Deploy to production

## Resources

- [Swagger/OpenAPI Documentation](https://swagger.io/)
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.0)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

**Your API is now fully documented and ready to share! 🎉**

Visit `http://localhost:5000/api-docs` to explore.
