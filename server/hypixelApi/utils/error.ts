import {Player} from '../api/player/player.model';

export class MojangNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MojangNotFoundError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class HypixelApiError extends Error {
  responseCode = 0;
  responseCause = '';

  constructor(message: string, code: number, cause: string) {
    super(message);
    this.name = 'HypixelApiError';
    this.responseCode = code;
    this.responseCause = cause;
    Error.captureStackTrace(this, this.constructor)
  }
}

// This is a custom error class for Zod validation errors
export class ZodValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZodValidationError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseReadError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ItemNotFoundError extends Error {
  constructor(item: string) {
    super(`Item ${item} not found in local database.`);
    this.name = 'ItemNotFoundError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseEntryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseEntryNotFoundError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NonexistentProfileError extends Error {
  profileId: string;

  constructor(profileId: string, message: string) {
    super(message);
    this.profileId = profileId;
    this.name = 'NonexistentProfileError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class PlayerNotInProfileError extends Error {
  constructor(player: Player, profileId: string) {
    super(`Player ${player.username} (${player.uuid}) not found in profile ${profileId}.`);
    this.name = 'PlayerNotInProfileError';
    Error.captureStackTrace(this, this.constructor)
  }
}