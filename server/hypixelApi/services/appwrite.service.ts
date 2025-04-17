import {Player, PlayerDAO} from '../api/player/player.model';
import {AppwriteException, Client, Databases, Query} from 'node-appwrite';
import {DatabaseEntryNotFoundError, DatabaseReadError} from '../utils/error';
import {getLogger} from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config()

// Appwrite client
const $client = new Client();
$client
  .setKey(process.env['APPWRITE_DB_KEY']!)
  .setProject('67face2d002b747386e4')
  .setEndpoint('https://fra.cloud.appwrite.io/v1')

// DB stuffs
const $dbId = 'hypixel-db'
const DB = new Databases($client)

const logger = getLogger('services/appwrite.service')

export async function savePlayer(player: Player): Promise<void> {
  try {
    logger.log(`Saving player ${player.username} to DB...`)
    const playerDAO = new PlayerDAO(player.uuid, player.username, player.uuid)
    await DB.createDocument(
      $dbId, // database ID
      'player', // collection ID
      playerDAO.uuid, // document ID, unique for each player
      {
        uuid: playerDAO.uuid,
        username: playerDAO.username
      } // document data
    )
  } catch (e) {
    logger.error('Error saving player:', e)
  }
}

/**
 * Get a player by name from Appwrite Database.
 * @param playerName the name of the player to fetch
 * @returns {`null`} if the player is not found, else returns the player data
 * @throws {DatabaseReadError} if there is an error reading from the database
 */
export async function getPlayerByNameFromDB(playerName: string): Promise<Player | null> {
  try {
    logger.log(`Getting player ${playerName} from DB...`)

    // Query the database for the player by username
    const resp = await DB.listDocuments(
      $dbId,
      'player',
      [
        Query.equal('username', playerName)
      ]
    )

    // If not found, return null
    if (resp.documents.length === 0) {
      logger.log(`Document not found for name ${playerName}`)
      return null
    }

    // If found, return the player data
    const playerDoc = resp.documents[0] as unknown as Player;
    return new Player(playerDoc.uuid, playerDoc.username)
  } catch (e) {
    console.log(e)
    console.log(`key: ${DB.client.config.key}`)
    throw new DatabaseReadError('Error reading from Appwrite database')
  }
}

/**
 * Get a player by UUID from Database.
 * @param uuid the UUID of the player to fetch
 * @returns {`null`} if the player is not found, else returns the player data
 * @throws {DatabaseReadError} if there is an error reading from the database
 * @throws {DatabaseEntryNotFoundError} if the UUID is not found in the database
 */
export async function getPlayerByUuidFromDB(uuid: string): Promise<Player> {
  try {
    logger.log(`Getting player ${uuid} from DB...`)

    // Query the database for the player by uuid
    const resp = await DB.getDocument(
      $dbId,
      'player',
      uuid
    )

    // If found, return the player data
    return new Player(resp['uuid'], resp['username'])
  } catch (e) {
    // throw if getDoc throws error
    if (e instanceof AppwriteException) throw new DatabaseEntryNotFoundError('UUID not found in Database!');
    else throw new DatabaseReadError('Error reading from Appwrite database')
  }
}