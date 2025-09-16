
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Activity Logger API',
      version: '1.0.0',
      description: 'API for the Activity Logger application',
    },
    components: {
      securitySchemes: {
        userId: {
          type: 'apiKey',
          in: 'header',
          name: 'user-id'
        },
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'authorization'
        }
      }
    },
    security: [{
      userId: [],
      bearerAuth: []
    }],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
