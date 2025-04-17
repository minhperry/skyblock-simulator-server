import NodeCache from 'node-cache';
import {DAY, HOUR, MINUTE} from '../utils/time';
import {getLogger} from '../utils/logger';
import {Logger} from 'log4js';

/**
 * This is a class that manages a cache for storing data. It wraps the {@link NodeCache} library.
 */
class Cache {
  private cache: NodeCache;
  private readonly identifier: string;
  private logger: Logger

  /**
   * Initializes a new instance of the CacheManager class.
   * @param {string} identifier the idetifier for each instance of the cache.
   * @param {number} ttl The time-to-live (TTL) for cache entries in seconds. Default is 1 hour.
   * @param {number} check The interval in seconds to check for expired cache entries. Default is 30 minutes.
   */
  constructor(identifier: string, ttl: number = HOUR, check: number = 0.5 * HOUR) {
    this.cache = new NodeCache({stdTTL: ttl, checkperiod: check});
    this.identifier = identifier;
    this.logger = getLogger(`cache.service/${this.identifier}`);
  }

  /**
   * Set a value in the cache with optional TTL (in seconds).
   * @param key Key to store the value under.
   * @param value Value to store. Can be of any type.
   * @param [ttl] TTL override (in seconds)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    if (ttl) this.cache.set(key, value, ttl)
    else this.cache.set(key, value, 6 * HOUR)

    this.logger.info('Successfully saved key', key, 'with ttl', ttl ?? '6 hours');
  }

  /**
   * Get a cached value.
   * @param key Key to retrieve the value from.
   * @returns The cached value or undefined
   */
  get<T>(key: string): T | undefined {
    this.logger.info('Trying to get key', key);
    return this.cache.get<T>(key)
  }

  /**
   * Get a failed cached value.
   * @param key Key to retrieve the value from.
   * @returns The cached value or undefined
   */
  getFailure<T>(key: string): T | undefined {
    this.logger.info('Trying to get failed key', key);
    return this.cache.get<T>(`failed-${key}`)
  }

  /**
   * Check if a key exists.
   * @param key Key to be checked.
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Check if a failed key exists.
   * @param key Key to be checked.
   */
  hasFailure(key: string): boolean {
    return this.cache.has(`failed-${key}`)
  }

  /**
   * Delete a cache entry.
   * @param key Key to be deleted.
   */
  delete(key: string): void {
    this.cache.del(key)
    this.logger.info('Deleted key', key);
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.flushAll()
    this.logger.info('Cleared the entire cache');
  }

  /**
   * Basically prints the cache to the console.
   */
  listAll(): void {
    this.logger.info(`Identifier '${this.identifier}' has content:`);
    this.logger.info(this.cache.keys().map(key => {
      return {
        key,
        value: this.cache.get(key)
      }
    }))
  }

  /**
   * Caches a failure for a given key with an error and a TTL.
   * @param key the key to cache the failure for
   * @param error the error to cache
   * @param ttl the time-to-live for the cache entry in seconds (default is 5 minutes)
   */
  rememberFailure(key: string, error: Error, ttl = 5 * MINUTE): void {
    this.cache.set(`failed-${key}`, error, ttl);
    this.logger.warn(`Cached failure for ${key} with TTL ${ttl}s`);
  }
}

// Profiles cache is kept for 1 day, and checked every 8 hours
export const profilesCache = new Cache('profileListCache', DAY, 8 * HOUR)

// Profile data cache is kept for 2 hours, and checked every 30 minutes
export const profileDataCache = new Cache('profileDataCache', 2 * HOUR, 30 * MINUTE)

// Player cache is kept for a day, checked daily
export const playerCache = new Cache('playerCache', DAY, DAY)