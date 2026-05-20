import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'L_Shop API Documentation',
      version: '1.0.0',
      description: 'API для интернет-магазина L_Shop',
      contact: {
        name: 'Support',
        email: 'support@lshop.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'iPhone 17 Pro Max' },
            price: { type: 'number', example: 1299 },
            count: { type: 'number', example: 10 },
            category: {
              type: 'string',
              enum: ['iphone', 'ipad', 'mac', 'watch', 'airpods', 'accessories', 'TV'],
              example: 'iphone'
            },
            image: { type: 'string', example: '/img/iphone.png' },
            tags: { type: 'array', items: { type: 'string' }, example: ['new', 'popular'] }
          },
          required: ['id', 'name', 'price', 'count', 'category', 'image']
        },
        BasketItem: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'iPhone 17 Pro Max' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            userId: { type: 'number', example: 1 },
            userName: { type: 'string', example: 'john_doe' },
            productId: { type: 'number', example: 1 },
            rating: { type: 'number', enum: [1, 2, 3, 4, 5], example: 5 },
            comment: { type: 'string', example: 'Great product!' },
            date: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            login: { type: 'string', example: 'john_doe' },
            phone: { type: 'string', example: '+375 29 123 4567' },
            role: { type: 'string', enum: ['user', 'admin', 'manager'], example: 'user' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            login: { type: 'string', example: 'john_doe' },
            password: { type: 'string', example: 'password123' },
            repeatPassword: { type: 'string', example: 'password123' },
            phone: { type: 'string', example: '+375 29 123 4567' }
          },
          required: ['login', 'password', 'repeatPassword', 'phone']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            login: { type: 'string', example: 'john_doe' },
            password: { type: 'string', example: 'password123' }
          },
          required: ['login', 'password']
        }
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session'
        }
      }
    },
    security: [{ cookieAuth: [] }]
  },
  apis: [path.join(__dirname, './controllers/*.ts')]
};

export const swaggerSpec = swaggerJsdoc(options);