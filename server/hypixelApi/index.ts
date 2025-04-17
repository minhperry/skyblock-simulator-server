import express from 'express';
import {Req, Res} from './utils/types';
import {$playerRouter} from './api/player/player.controller';
import {$profilesRouter} from './api/profiles/profiles.controller';
import {$singleProfileRouter} from './api/profile/profile.controller';

// Main backend router
export const $router = express.Router()
$router.get('/', (req: Req, res: Res) => {
  res.send('Hello from the outside!')
})

$router.use('/player', $playerRouter)
$router.use('/profiles', $profilesRouter)
$router.use('/profile', $singleProfileRouter)

$router.all('*', (req: Req, res: Res) => {
  res.status(404).json({
    error: `Route ${req.path} not found`,
  })
})