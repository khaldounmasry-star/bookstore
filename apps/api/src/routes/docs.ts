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
        UpdateUserInput: {
          type: 'object',
          description: 'Fields for updating an existing user. All properties are optional.',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID (optional, may be inferred from path parameter).'
            },
            firstName: {
              type: 'string',
              description: 'Updated first name of the user.'
            },
            lastName: {
              type: 'string',
              description: 'Updated last name of the user.'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Updated email address of the user.'
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
              description: 'User role. Only SUPER_ADMIN can assign roles.'
            }
          },
          additionalProperties: false
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
        },
        Cover: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            imageUrl: { type: 'string', format: 'uri' },
            bookId: { type: 'integer' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'imageUrl', 'bookId', 'createdAt']
        },
        CreateCoverInput: {
          type: 'object',
          oneOf: [
            {
              properties: {
                imageUrl: { type: 'string', format: 'uri' }
              },
              required: ['imageUrl'],
              additionalProperties: false
            },
            {
              properties: {
                imageUrls: {
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                  minItems: 1
                }
              },
              required: ['imageUrls'],
              additionalProperties: false
            }
          ]
        },
        UpdateCoverInput: {
          type: 'object',
          properties: {
            imageUrl: { type: 'string', format: 'uri' }
          },
          required: ['imageUrl'],
          additionalProperties: false
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
      '/books/filter': {
        'get': {
          'tags': ['Books'],
          'summary': 'Filter and sort books by genre, title, price, or rating',
          'description': 'Retrieve books optionally filtered by genre and sorted by title, price, or rating. Supports pagination with limit and offset.',
          'parameters': [
            {
              'name': 'genre',
              'in': 'query',
              'required': false,
              'schema': { 'type': 'string' },
              'description': 'Filter books by exact genre (case-sensitive match).'
            },
            {
              'name': 'sort',
              'in': 'query',
              'required': false,
              'schema': {
                'type': 'string',
                'enum': ['title', 'price', 'rating'],
                'default': 'title'
              },
              'description': 'Field to sort by.'
            },
            {
              'name': 'order',
              'in': 'query',
              'required': false,
              'schema': {
                'type': 'string',
                'enum': ['asc', 'desc'],
                'default': 'asc'
              },
              'description': 'Sort order: ascending or descending.'
            },
            {
              'name': 'limit',
              'in': 'query',
              'required': false,
              'schema': { 'type': 'integer', 'default': 10, 'minimum': 1 },
              'description': 'Number of results to return (default 10).'
            },
            {
              'name': 'offset',
              'in': 'query',
              'required': false,
              'schema': { 'type': 'integer', 'default': 0, 'minimum': 0 },
              'description': 'Number of results to skip (for pagination).'
            }
          ],
          'responses': {
            '200': {
              'description': 'Filtered and/or sorted list of books',
              'content': {
                'application/json': {
                  'schema': {
                    'type': 'object',
                    'properties': {
                      'count': {
                        'type': 'integer',
                        'description': 'Number of books returned in this response.'
                      },
                      'results': {
                        'type': 'array',
                        'items': { '$ref': '#/components/schemas/Book' }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              'description': 'Invalid query parameters (e.g., unsupported sort field or order).'
            },
            '500': {
              'description': 'Server error while filtering or sorting books.'
            }
          }
        }
      },
      '/books/{id}/covers': {
        'post': {
          'tags': ['Books'],
          'summary': 'Add one or many covers to a book (Admin only)',
          'security': [{ 'bearerAuth': [] }],
          'parameters': [
            { 'name': 'id', 'in': 'path', 'required': true, 'schema': { 'type': 'integer' } }
          ],
          'requestBody': {
            'required': true,
            'content': {
              'application/json': {
                'schema': { '$ref': '#/components/schemas/CreateCoverInput' }
              }
            }
          },
          'responses': {
            '201': {
              'description': 'Cover(s) created',
              'content': {
                'application/json': {
                  'schema': {
                    'type': 'object',
                    'properties': {
                      'message': { 'type': 'string' },
                      'covers': {
                        'type': 'array',
                        'items': { '$ref': '#/components/schemas/Cover' }
                      }
                    }
                  }
                }
              }
            },
            '400': { 'description': 'Invalid book ID or request body' },
            '401': { 'description': 'Unauthorized' },
            '403': { 'description': 'Forbidden — requires ADMIN role' },
            '404': { 'description': 'Book not found' }
          }
        }
      },
      '/books/covers/{coverId}': {
        'put': {
          'tags': ['Books'],
          'summary': 'Update a cover by ID (Admin only)',
          'security': [{ 'bearerAuth': [] }],
          'parameters': [
            { 'name': 'coverId', 'in': 'path', 'required': true, 'schema': { 'type': 'integer' } }
          ],
          'requestBody': {
            'required': true,
            'content': {
              'application/json': {
                'schema': { '$ref': '#/components/schemas/UpdateCoverInput' }
              }
            }
          },
          'responses': {
            '200': {
              'description': 'Cover updated',
              'content': {
                'application/json': {
                  'schema': {
                    'type': 'object',
                    'properties': {
                      'message': { 'type': 'string' },
                      'cover': { '$ref': '#/components/schemas/Cover' }
                    }
                  }
                }
              }
            },
            '400': { 'description': 'Invalid cover ID or request body' },
            '401': { 'description': 'Unauthorized' },
            '403': { 'description': 'Forbidden — requires ADMIN role' },
            '404': { 'description': 'Cover not found' }
          }
        },
        'delete': {
          'tags': ['Books'],
          'summary': 'Delete a cover by ID (Admin only)',
          'security': [{ 'bearerAuth': [] }],
          'parameters': [
            { 'name': 'coverId', 'in': 'path', 'required': true, 'schema': { 'type': 'integer' } }
          ],
          'responses': {
            '204': { 'description': 'Cover deleted' },
            '400': { 'description': 'Invalid cover ID' },
            '401': { 'description': 'Unauthorized' },
            '403': { 'description': 'Forbidden — requires ADMIN role' },
            '404': { 'description': 'Cover not found' }
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
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get a list of users (Super Admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Users returned' },
            401: { description: 'Unauthorised — requires SUPER_ADMIN role' }
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
          summary: 'Delete a user by ID (Super Admin only)',
          description:
            'Deletes a user (person) by their unique ID. Only SUPER_ADMIN role is allowed to perform this action.',
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
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden: Higher user role required' },
            404: { description: 'User not found' }
          }
        },
        put: {
          tags: ['Users'],
          summary: 'Update an existing user',
          description:
            'Allows updating user profile information. Requires SUPER_ADMIN privileges.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'The ID of the user to update.'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateUserInput' },
                example: {
                  firstName: 'Alex',
                  lastName: 'Smith',
                  email: 'alex.smith@example.com',
                  role: 'ADMIN'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' }
                }
              }
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
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
