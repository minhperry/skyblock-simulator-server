import {z} from 'zod';

export const PlayerSchema = z.object({
  uuid: z.string().regex(/^[0-9a-fA-F]{32}$/,
    'UUID must be a 32 character hex string',
  ),
  username: z.string()
    .min(1, 'Username must be at least 1 character long')
    .max(16, 'Username must be at most 16 characters long')
})

// Internal representation of a player
export class Player {
  uuid: string;
  username: string;

  constructor(uuid: string, username: string) {
    this.uuid = uuid;
    this.username = username;
  }

  asLDAO(): LocalPlayerDAO {
    return new LocalPlayerDAO(this.uuid, this.username)
  }

  asDTO(): PlayerDTO {
    return new PlayerDTO(this.uuid, this.username)
  }
}

export class PlayerDTO {
  uuid: string;
  name: string;

  constructor(uuid: string, username: string) {
    this.uuid = uuid;
    this.name = username;
  }
}

// Structure of the player data in the database
export class PlayerDAO {
  documentId: string;
  uuid: string;
  username: string;

  constructor(uuid: string, username: string, id: string) {
    this.uuid = uuid;
    this.username = username;
    this.documentId = id;
  }

  asPlayer(): Player {
    return new Player(this.uuid, this.username)
  }
}

// Structure for local db
export class LocalPlayerDAO {
  uuid: string;
  username: string;

  constructor(uuid: string, username: string) {
    this.uuid = uuid;
    this.username = username;
  }

  asPlayer(): Player {
    return new Player(this.uuid, this.username)
  }
}

export interface PlayerResponse {
  id: string,
  name: string,
}