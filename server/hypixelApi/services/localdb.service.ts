import {LocalPlayerDAO, Player} from '../api/player/player.model';
import {ItemNotFoundError} from '../utils/error';
import {getLogger} from '../utils/logger';
import {JSONFilePreset} from 'lowdb/node';
import {Low} from 'lowdb';

/**
 * This is a class that manages a local database for storing player data.
 */
class LocalDatabaseService {
  private logger = getLogger('services/localdb.service')
  private DB!: Low<{ players: LocalPlayerDAO[] }>

  constructor() {
    this.logger.level = 'debug';
    (async () => {
      this.DB = await this.defineDatabase();
    })().catch(err => {
      this.logger.error('Failed to initialize local DB:', err);
    });
  }

  async defineDatabase() {
    const defaultData: { players: LocalPlayerDAO[] } = {players: []}
    return await JSONFilePreset('players.json', defaultData)
  }

  /**
   * Saves a player to local db.
   * @param player the player to save
   */
  savePlayer(player: Player) {
    this.logger.log(`Saving player ${player.username} to DB...`)
    const playerDAO = player.asLDAO()
    this.DB.data.players.push(playerDAO)
  }

  /**
   * Get a player by name from local database.
   * @param playerName the name of the player to fetch
   * @throws ItemNotFoundError if the player is not found in the database
   */
  getPlayerByName(playerName: string): Player {
    this.logger.log(`Getting player ${playerName} from DB...`)
    const {players} = this.DB.data

    // Query the database for the player by username
    const foundPlayer = players.find((pDAO) => pDAO.username === playerName)

    if (!foundPlayer) {
      this.logger.log(`Player ${playerName} not found in DB`)
      throw new ItemNotFoundError(`with name ${playerName}`)
    }

    return foundPlayer.asPlayer()
  }

  /**
   * Get a player by UUID from local database.
   * @param uuid the UUID of the player to fetch
   * @throws ItemNotFoundError if the player is not found in the database
   */
  getPlayerByUuid(uuid: string): Player {
    this.logger.info(`Getting player with UUID ${uuid} from DB...`)
    const {players} = this.DB.data

    // Query the database for the player by UUID
    const foundPlayer = players.find((pDAO) => pDAO.uuid === uuid)

    if (!foundPlayer) {
      this.logger.log(`Player with UUID ${uuid} not found in DB`)
      throw new ItemNotFoundError(`with UUID ${uuid}`)
    }

    return foundPlayer.asPlayer()
  }
}

export const ldbInstance = new LocalDatabaseService()