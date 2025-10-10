
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
      },
      schemas: {
        Activity: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The activity ID'
            },
            user_id: {
              type: 'integer',
              description: 'The ID of the user who created the activity'
            },
            title: {
              type: 'string',
              description: 'The title of the activity'
            },
            description: {
              type: 'string',
              description: 'The description of the activity'
            },
            media_url: {
              type: 'string',
              description: 'URL of the media file associated with the activity'
            },
            latitude: {
              type: 'number',
              format: 'double',
              description: 'Latitude coordinate of the activity location (optional)'
            },
            longitude: {
              type: 'number',
              format: 'double',
              description: 'Longitude coordinate of the activity location (optional)'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the activity was created'
            },
            user_name: {
              type: 'string',
              description: 'Name of the user who created the activity'
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The comment ID'
            },
            activity_id: {
              type: 'integer',
              description: 'The ID of the activity the comment belongs to'
            },
            user_id: {
              type: 'integer',
              description: 'The ID of the user who made the comment'
            },
            comment: {
              type: 'string',
              description: 'The content of the comment'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the comment was made'
            },
            user_name: {
              type: 'string',
              description: 'Name of the user who made the comment'
            }
          }
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
