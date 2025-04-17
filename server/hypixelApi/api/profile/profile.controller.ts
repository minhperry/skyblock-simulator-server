import express from 'express';
import {Req, Res} from '../../utils/types';
import {getPlayerByName} from '../player/player.service';
import {getPlayerDataInProfile} from './profile.service';
import {HypixelApiError} from '../../utils/error';

export const $singleProfileRouter = express.Router();

/**
 * @openapi
 * /profile/hotm/{name}/{profileId}:
 *   get:
 *     summary: Get Heart of the Mountain data for a player's profile.
 *     description: Fetches the HOTM (Heart of the Mountain) progression data for a specific Minecraft profile using player name and profile ID.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The Minecraft username.
 *         schema:
 *           type: string
 *           example: "Technoblade"
 *       - name: profileId
 *         in: path
 *         required: true
 *         description: The profile ID associated with the player.
 *         schema:
 *           type: string
 *           example: "b876ec32e396476ba1158438d83c67d4"
 *     responses:
 *       200:
 *         description: HOTM data successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hotmNodes:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   description: Mapping of HOTM nodes to their respective levels.
 *                 hotmLevel:
 *                   type: number
 *                   description: The overall HOTM level.
 *                 powders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       have:
 *                         type: number
 *                       spent:
 *                         type: number
 *                       total:
 *                         type: number
 *                       type:
 *                         type: string
 *                 maxTokens:
 *                   type: number
 *                   description: Maximum tokens that can be spent on HOTM upgrades.
 *             example:
 *               hotmNodes:
 *                 mining_speed: 14
 *                 mining_fortune: 1
 *                 titanium_insanium: 13
 *                 daily_powder: 1
 *                 mining_speed_boost: 1
 *                 efficient_miner: 63
 *                 mining_experience: 6
 *                 special_0: 4
 *                 mining_madness: 1
 *                 daily_effect: 1
 *                 goblin_killer: 1
 *               hotmLevel: 5
 *               powders:
 *                 - have: 49791
 *                   spent: 936586
 *                   total: 986377
 *                   type: mithril
 *                 - have: 2080
 *                   spent: 0
 *                   total: 2080
 *                   type: gemstone
 *                 - have: 0
 *                   spent: 0
 *                   total: 0
 *                   type: glacite
 *               maxTokens: 12
 *       404:
 *         description: Resource not found (player, profile, or membership).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 code:
 *                   type: string
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                     - type: object
 *             examples:
 *               playerNotFound:
 *                 summary: Player not found in Mojang API
 *                 value:
 *                   error: "Player not found in Mojang API"
 *                   code: "MOJANG_PLAYER_NOT_FOUND"
 *                   message: "Could not find player with username Notch"
 *               profileNotFound:
 *                 summary: Profile does not exist on Hypixel
 *                 value:
 *                   error: "Profile does not exist on Hypixel"
 *                   code: "PROFILE_NOT_FOUND"
 *                   message: "No profile found for ID 123..."
 *               playerNotInProfile:
 *                 summary: Player is not part of the given profile
 *                 value:
 *                   error: "Player is not in profile"
 *                   code: "PLAYER_NOT_IN_PROFILE"
 *                   message: "Player is not a member of this profile"
 *       422:
 *         description: Player name is invalid (fails schema validation).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               error: "Player name is invalid"
 *               code: "INVALID_PLAYER_NAME"
 *               message: "Username must be 3-16 characters long"
 *       503:
 *         description: Hypixel API error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 code:
 *                   type: string
 *                 message:
 *                   type: object
 *                   properties:
 *                     hypixelStatus:
 *                       type: number
 *                     hypixelMessage:
 *                       type: string
 *             example:
 *               error: "Failed to fetch data from Hypixel API"
 *               code: "HYPIXEL_API_ERROR"
 *               message:
 *                 hypixelStatus: 429
 *                 hypixelMessage: "Too many requests"
 */
$singleProfileRouter.get('/hotm/:name/:profileId', async (req: Req, res: Res) => {
  const name = req.params['name'];
  const pId = req.params['profileId'];

  try {
    const player = await getPlayerByName(name)
    const hotmData = await getPlayerDataInProfile(pId, player)

    res.status(200).json(hotmData.asDTO())
    return;
  } catch (e) {
    const err = e as Error;
    switch (err.name) {
      case 'NonexistentProfileError':
        res.status(404).json({
          error: 'Profile does not exist on Hypixel',
          code: 'PROFILE_NOT_FOUND',
          message: err.message
        })
        break;
      case 'PlayerNotInProfileError':
        res.status(404).json({
          error: 'Player is not in profile',
          code: 'PLAYER_NOT_IN_PROFILE',
          message: err.message
        })
        break;
      case 'HypixelApiError':
        res.status(503).json({
          error: 'Failed to fetch data from Hypixel API',
          code: 'HYPIXEL_API_ERROR',
          message: {
            hypixelStatus: (err as HypixelApiError).responseCode,
            hypixelMessage: (err as HypixelApiError).responseCause
          }
        })
        break;
      case 'ZodValidationError':
        res.status(422).json({
          error: 'Player name is invalid',
          code: 'INVALID_PLAYER_NAME',
          message: err.message
        })
        break;
      case 'MojangNotFoundError':
        res.status(404).json({
          error: 'Player not found in Mojang API',
          code: 'MOJANG_PLAYER_NOT_FOUND',
          message: err.message
        })
        break;
      default:
        res.status(500).json({
          error: 'Internal error',
          code: 'UNKNOWN_ERROR',
          message: err.message
        })
        break;
    }
    return;
  }
})
