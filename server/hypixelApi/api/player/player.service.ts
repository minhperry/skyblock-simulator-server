import {Player, PlayerResponse, PlayerSchema} from './player.model';
import {ldbInstance} from '../../services/localdb.service';
import {MojangNotFoundError, ZodValidationError} from '../../utils/error';
import {joinZodError} from '../../utils/zod';
import {getLogger} from '../../utils/logger';
import {playerCache} from '../../services/cache.service';
import {HOUR} from '../../utils/time';

const MOJANG_API_URL = 'https://api.minecraftservices.com/minecraft/profile/lookup/name/'
const ldb = ldbInstance
const logger = getLogger('player.service')
logger.level = 'debug'

/**
 * Fetch player data from Mojang API
 * @param playerName the name of the player to fetch
 * @returns the player data of type Player
 * @throws ZodValidationError if the player data is not valid. (aka non-200 responses)
 * @throws MojangNotFoundError if the player is not found in the Mojang API
 */
async function getPlayerByNameFromAPI(playerName: string): Promise<Player> {
  logger.log(`Calling Mojang API for player ${playerName}...`)
  const cacheKey = `mojang-${playerName}`

  // Check if the player data has previously failed to fetch
  if (playerCache.hasFailure(cacheKey)) {
    const mojangError = playerCache.getFailure<MojangNotFoundError>(cacheKey)!
    logger.error(`Previously failed to fetch player data for ${playerName}: ${mojangError.message}`)
    throw mojangError
  }

  // If the player data is already cached, return it
  if (playerCache.has(cacheKey)) {
    logger.info(`Caching Mojang API response for player ${playerName}`)
    return playerCache.get<Player>(cacheKey)!
  }

  // Get player data from Mojang API
  const resp = await fetch(`${MOJANG_API_URL}${playerName}`)

  if (resp.status !== 200) {
    logger.error(`Name ${playerName} not found in Mojang API!`)

    const mojangErr = new MojangNotFoundError('Player not found on Mojang API!')
    playerCache.rememberFailure(cacheKey, mojangErr)

    throw mojangErr
  }

  logger.log(`Trying to validate Mojang API response`)
  const player = (await resp.json()) as PlayerResponse
  // Validate with Zod
  const validation = PlayerSchema.safeParse({
    uuid: player.id,
    username: player.name
  })

  // Either this or MojangNotFoundError only, since non-200 would just trigger failed validation
  if (!validation.success) {
    logger.error(`Player ${playerName} does not match schema`)
    throw new ZodValidationError(joinZodError(validation.error))
  }

  // Save to database
  const validatedPlayer = validation.data

  const playerData: Player = new Player(validatedPlayer.uuid, validatedPlayer.username)

  ldb.savePlayer(playerData)

  // Cache the player data
  playerCache.set(cacheKey, playerData, HOUR)
  logger.info(`Set cache for player ${playerName} with UUID ${playerData.uuid}`)

  logger.log(`Player ${playerName} returned`)
  return playerData
}

/**
 * Get a player by name. Will first check in the Appwrite DB, and if not found, will fetch from Mojang API.
 * @param playerName the player name to fetch
 * @returns the player data
 * @throws ZodValidationError if the player data from Mojang API is not valid
 * @throws MojangNotFoundError if the player is not found in the Mojang API
 */
export async function getPlayerByName(playerName: string): Promise<Player> {

  // First try to get the player from the local database
  try {
    return ldb.getPlayerByName(playerName)
  } catch {
    logger.info(`Name ${playerName} not found in DB, fetching from Mojang API...`)
  }

  return await getPlayerByNameFromAPI(playerName)
}
