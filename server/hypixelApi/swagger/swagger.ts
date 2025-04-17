import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hypixel API Proxy',
      version: '1.0.0',
      description: 'A proxy for the Hypixel API, specifically for this website.',
    },
    servers: [
      {
        url: '/api/v2',
        description: 'Uses the Hypixel and Mojang API directly',
      }
    ],
    tags: [
      {
        name: 'Player',
        description: 'Player related endpoints, mostly communicating with Mojang API.',
      },
      {
        name: 'Profile',
        description: 'Player profile endpoints.'
      }
    ]
  },
  apis: ['./server/hypixelApi/**/*.ts'],
})