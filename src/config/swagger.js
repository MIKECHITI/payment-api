const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Virtual Wallet API',
      version: '1.0.0',
      description: 'A production-ready REST API for a digital wallet system with JWT authentication and atomic transactions',
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token received from login or register',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Alice Johnson',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'alice@example.com',
            },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            userId: {
              type: 'integer',
              example: 1,
            },
            balance: {
              type: 'number',
              format: 'float',
              example: 1500.00,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            senderId: {
              type: 'integer',
              example: 1,
            },
            receiverId: {
              type: 'integer',
              example: 2,
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 250.50,
            },
            status: {
              type: 'string',
              enum: ['completed', 'pending', 'failed'],
              example: 'completed',
            },
            reference: {
              type: 'string',
              example: 'txn_abc123xyz',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Alice Johnson',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'alice@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securepassword123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'alice@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securepassword123',
            },
          },
        },
        DepositRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0.01,
              example: 500.00,
            },
          },
        },
        TransferRequest: {
          type: 'object',
          required: ['receiverId', 'amount'],
          properties: {
            receiverId: {
              type: 'integer',
              example: 2,
            },
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0.01,
              example: 200.50,
            },
            description: {
              type: 'string',
              example: 'Payment for services',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        BalanceResponse: {
          type: 'object',
          properties: {
            balance: {
              type: 'number',
              format: 'float',
              example: 1500.00,
            },
            walletId: {
              type: 'integer',
              example: 1,
            },
          },
        },
        DepositResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Deposit successful',
            },
            balance: {
              type: 'number',
              format: 'float',
              example: 2000.00,
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 500.00,
            },
          },
        },
        TransferResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Transfer successful',
            },
            transaction: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                reference: {
                  type: 'string',
                  example: 'txn_abc123',
                },
                from: {
                  type: 'string',
                  example: 'Alice Johnson',
                },
                to: {
                  type: 'string',
                  example: 'Bob Smith',
                },
                amount: {
                  type: 'number',
                  format: 'float',
                  example: 250.00,
                },
                status: {
                  type: 'string',
                  example: 'completed',
                },
                description: {
                  type: 'string',
                  example: 'Payment for invoice #123',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        HistoryResponse: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                  },
                  reference: {
                    type: 'string',
                  },
                  from: {
                    type: 'string',
                  },
                  to: {
                    type: 'string',
                  },
                  amount: {
                    type: 'number',
                    format: 'float',
                  },
                  status: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['sent', 'received'],
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
            total: {
              type: 'integer',
              example: 5,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Invalid email format',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
