import express from 'express';
import {ErrorCode, Req, Res} from '../../utils/types';
import {getProfileList} from './profiles.service';
import {DatabaseReadError, HypixelApiError, MojangNotFoundError, ZodValidationError} from '../../utils/error';

export const $profilesRouter = express.Router()

/**
 * @openapi
 * /profiles/{name}:
 *   get:
 *     summary: Get SkyBlock profiles of a player
 *     description: Fetches all SkyBlock profiles associated with a player name from the Hypixel API.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Minecraft username of the player
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           example: Technoblade
 *     responses:
 *       200:
 *         description: List of SkyBlock profiles for the player
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profileId:
 *                     type: string
 *                     example: "95bb24bd-73f6-427d-b35c-248295674ba1"
 *                   fruitName:
 *                     type: string
 *                     example: "Papaya"
 *                   gameMode:
 *                     type: string
 *                     enum: [normal, ironman, bingo, stranded]
 *                     example: "ironman"
 *                   active:
 *                     type: boolean
 *                     example: false
 *       400:
 *         description: Invalid player name format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - code
 *                 - message
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid player name format"
 *                 code:
 *                   type: string
 *                   enum:
 *                     - INVALID_PLAYER_NAME
 *                   example: INVALID_PLAYER_NAME
 *                 message:
 *                   type: string
 *                   example: "Player name must only contain alphanumeric characters and underscores"
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - code
 *                 - message
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Player not found"
 *                 code:
 *                   type: string
 *                   enum:
 *                     - PLAYER_NOT_FOUND
 *                   example: PLAYER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: "Could not resolve player UUID"
 *       422:
 *         description: Data from Hypixel API did not match expected schema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - code
 *                 - message
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Data from Hypixel API did not match expected schema"
 *                 code:
 *                   type: string
 *                   enum:
 *                     - MALFORMED_DATA_FORMAT
 *                   example: MALFORMED_DATA_FORMAT
 *                 message:
 *                   type: string
 *                   example: "Invalid enum value"
 *       503:
 *         description: Failed to fetch data from Hypixel API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - code
 *                 - message
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch data from Hypixel API"
 *                 code:
 *                   type: string
 *                   enum:
 *                     - HYPIXEL_API_ERROR
 *                   example: HYPIXEL_API_ERROR
 *                 message:
 *                   type: object
 *                   properties:
 *                     hypixelStatus:
 *                       type: number
 *                       example: 503
 *                     hypixelMessage:
 *                       type: string
 *                       example: "Service Unavailable"
 *       500:
 *         description: Internal server error (DB issues or unknown errors)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - error
 *                 - code
 *                 - message
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal error"
 *                 code:
 *                   type: string
 *                   enum:
 *                     - INTERNAL_ERROR
 *                   example: INTERNAL_ERROR
 *                 message:
 *                   type: string
 *                   example: "Database connection failed"
 */
$profilesRouter.get('/:name', async (req: Req, res: Res) => {
  const playerName = req.params['name']

  let profileList;

  try {
    profileList = await getProfileList(playerName)
  } catch (e) {
    if (e instanceof HypixelApiError) {
      res.status(503).json({
        error: 'Failed to fetch data from Hypixel API',
        code: ErrorCode.HYPIXEL_API_ERROR,
        message: {
          hypixelStatus: e.responseCode,
          hypixelMessage: e.responseCause
        }
      })
    } else if (e instanceof ZodValidationError) {
      res.status(422).json({
        error: 'Data from Hypixel API did not match expected schema',
        code: ErrorCode.MALFORMED_DATA_FORMAT,
        message: e.message
      })
    } else if (e instanceof DatabaseReadError) {
      res.status(500).json({
        error: 'Internal error',
        code: ErrorCode.INTERNAL_ERROR,
        message: e.message
      })
    } else if (e instanceof MojangNotFoundError) {
      res.status(404).json({
        error: 'Player not found',
        code: ErrorCode.PLAYER_NOT_FOUND,
        message: e.message
      })
    }

    return;
  }

  const profileListDto = profileList.map(p => p.asDTO())

  res.status(200).json(profileListDto)
})