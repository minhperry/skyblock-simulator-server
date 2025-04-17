import express from 'express';
import {$router} from './server/hypixelApi';
import {Req, Res} from './server/hypixelApi/utils/types';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express'
import {swaggerSpec} from './server/hypixelApi/swagger/swagger';

// Actually inject env vars in process.env
// Add this in server.ts too
dotenv.config();

export function app(): express.Express {
  const server = express();

  server.use('/api/v2', $router)
  server.get('/', (req: Req, res: Res) => {
    res.send({rootIs: 'active'})
  })

  // Add this in server.ts too
  server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  return server
}

function run(): void {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run()