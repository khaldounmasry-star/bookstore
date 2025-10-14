import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';

export const docs = new Hono();

docs.get('/swagger.json', (c) =>
  c.json({
    openapi: '3.0.0',
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: 'Bookstore API documentation including CRUD for books and users'
    },
    servers: [{ url: 'http://localhost:3001', description: 'Local server' }],
    tags: [
      { name: 'Books', description: 'Manage books' },
      { name: 'Users', description: 'User management and authentication' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Book: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            author: { type: 'string' },
            genre: { type: 'string' },
            description: { type: 'string' },
            year: { type: 'integer' },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            price: { type: 'number' },
            sku: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateBookInput: {
          type: 'object',
          required: ['title', 'author'],
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            genre: { type: 'string' },
            description: { type: 'string' },
            year: { type: 'integer' },
            rating: { type: 'number' },
            price: { type: 'number' },
            sku: { type: 'string' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        RegisterInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        }
      }
    },
    paths: {
      '/books': {
        get: {
          tags: ['Books'],
          summary: 'List all books',
          responses: {
            200: {
              description: 'List of books',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } }
            }
          }
        },
        post: {
          tags: ['Books'],
          summary: 'Create a new book (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBookInput' } } }
          },
          responses: {
            201: { description: 'Book created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/books/{id}': {
        get: {
          tags: ['Books'],
          summary: 'Get a book by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Book found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
            404: { description: 'Book not found' }
          }
        },
        put: {
          tags: ['Books'],
          summary: 'Update a book by ID (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBookInput' } } }
          },
          responses: {
            200: { description: 'Book updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } }
          }
        },
        delete: {
          tags: ['Books'],
          summary: 'Delete a book by ID (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'Book deleted' } }
        }
      },
      '/books/search': {
        get: {
          tags: ['Books'],
          summary: 'Search books by title, author, description or genre',
          description:
            'Search for books by partial title, author name, description or genre. Supports pagination using limit and offset query parameters.',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search query (title or author substring)'
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 10 },
              description: 'Number of results to return'
            },
            {
              name: 'offset',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 0 },
              description: 'Number of results to skip (for pagination)'
            }
          ],
          responses: {
            200: {
              description: 'List of matching books',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Book' }
                  }
                }
              }
            },
            400: { description: 'Invalid query parameters' }
          }
        }
      },
      '/users/register': {
        post: {
          tags: ['Users'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } }
          },
          responses: {
            201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
          }
        }
      },
      '/users/login': {
        post: {
          tags: ['Users'],
          summary: 'Authenticate user and return a JWT',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string', description: 'JWT token' }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/users/create-admin': {
        post: {
          tags: ['Users'],
          summary: 'Create an admin (Super Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } }
          },
          responses: {
            201: { description: 'Admin created' },
            403: { description: 'Forbidden — requires SUPER_ADMIN role' }
          }
        }
      },
      '/users/{id}': {
        delete: {
          tags: ['Users'],
          summary: 'Delete a user by ID (Admin or Super Admin only)',
          description:
            'Deletes a user (person) by their unique ID. Only ADMIN and SUPER_ADMIN roles are allowed to perform this action.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID of the user to delete'
            }
          ],
          responses: {
            204: { description: 'User deleted successfully' },
            401: { description: 'Unauthorized – missing or invalid token' },
            403: { description: 'Forbidden – requires ADMIN or SUPER_ADMIN role' },
            404: { description: 'User not found' }
          }
        }
      }
    }
  })
);


docs.get(
  '/',
  swaggerUI({
    url: '/docs/swagger.json',
    title: 'Bookstore API Docs'
  })
);
