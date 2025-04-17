import express from 'express';
import {$router} from './server/hypixelApi';
import {ErrorCode, Req, Res} from './server/hypixelApi/utils/types';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express'
import {swaggerSpec} from './server/hypixelApi/swagger/swagger';
import rateLimit from 'express-rate-limit';
import {MINUTE} from './server/hypixelApi/utils/time';

// Actually inject env vars in process.env
// Add this in server.ts too
dotenv.config();

export function app(): express.Express {
  const server = express();

  const $limit = 300;  // limit each IP to this many requests per windowMs

  const limiter = rateLimit({
    windowMs: 5 * MINUTE * 1000, // 5 minutes, in ms
    limit: $limit,
    message: {
      error: 'You are being rate limited. Please try again later.',
      code: ErrorCode.RATE_LIMITED,
      message: `The rate limit is ${$limit} requests per 5 minutes. Please try again later.`,
    },
    legacyHeaders: true
  })

  server.use(limiter)

  server.use('/api/v2', $router)
  server.get('/', (req: Req, res: Res) => {
    res.send({rootIs: 'active'})
  })

  // Add this in server.ts too
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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