import {fetchHypixelApi} from '../../utils/fetch';
import {HypixelApiError, NonexistentProfileError, PlayerNotInProfileError} from '../../utils/error';
import {getLogger} from '../../utils/logger';
import {IMemberData, MemberData, SingleProfile, SingleProfileSchema} from './profile.model';
import {Player} from '../player/player.model';
import {joinZodError} from '../../utils/zod';
import {profileDataCache} from '../../services/cache.service';
import {MINUTE} from '../../utils/time';


const logger = getLogger('profilez.service');

/**
 * Gets the profile data for a given profile ID from the Hypixel API. Failed Hypixel API requests are cached for 10 minutes.
 * @param profileId the profile ID to fetch data for
 * @returns the profile data (under /profile)
 * @throws {HypixelApiError} if the Hypixel API returns an error
 * @throws {NonexistentProfileError} if the response from the Hypixel API does not match the expected schema
 * (aka returned 200 but the profile does not exist for given uuid)
 */
async function getProfileIdData(profileId: string): Promise<SingleProfile> {
  logger.log(`Trying to fetch profile data for profile ID ${profileId}`)
  const cacheKey = `profile-data-${profileId}`;

  // Check if this has previously failed, and if so, throw the error
  if (profileDataCache.hasFailure(cacheKey)) {
    const hypixelError = profileDataCache.getFailure<HypixelApiError>(cacheKey)!
    logger.error(`Previously failed to fetch profile data for ${profileId}: ${hypixelError.message}`)
    throw hypixelError
  }

  // Check if the profile is already cached
  if (profileDataCache.has(cacheKey)) {
    logger.log(`Found cached profile data for profile ID ${profileId}`)
    return profileDataCache.get<SingleProfile>(cacheKey)!
  }

  const resp = await fetchHypixelApi(`https://api.hypixel.net/v2/skyblock/profile?profile=${profileId}`)

  if (resp.status !== 200) {
    const code = resp.status
    const cause = (await resp.json()).cause
    const hypixelError = new HypixelApiError('Error fetching data from Hypixel API', code, cause)

    // Cache failed Hypixel API request for 10 minutes
    profileDataCache.rememberFailure(cacheKey, hypixelError, 10 * MINUTE)

    logger.error(`Hypixel API returned error: ${code}, ${cause}`)
    throw new HypixelApiError('Error fetching data from Hypixel API', code, cause)
  }

  const profileData = (await resp.json()).profile

  const validation = SingleProfileSchema.safeParse(profileData)

  if (!validation.success) {
    logger.error(`Profile id ${profileId} is nonexistent`)
    throw new NonexistentProfileError(profileId, joinZodError(validation.error))
  }

  const finalData = validation.data as SingleProfile

  // Cache the profile data
  profileDataCache.set(cacheKey, finalData);

  return finalData;
}

/**
 * Gets the player data for a given profile ID and player from the Hypixel API.
 * @param profileId the profile ID to fetch data for
 * @param player the player to fetch data for
 * @returns the player data (under /members/<player.uuid>)
 * @throws {PlayerNotInProfileError} if the player is not found in the profile
 * @throws {NonexistentProfileError} if the response from the Hypixel API does not match the expected schema
 * @throws {HypixelApiError} if the Hypixel API returns an error
 */
export async function getPlayerDataInProfile(profileId: string, player: Player): Promise<MemberData> {
  logger.info(`Trying to fetch player data for player ${player.uuid} in profile ${profileId}`)
  const profileData = await getProfileIdData(profileId)

  const playerData = profileData.members[player.uuid] as IMemberData

  if (!playerData) {
    throw new PlayerNotInProfileError(player, profileId)
  }

  return new MemberData(player, playerData)
}