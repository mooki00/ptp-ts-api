import { PTPApi } from './api/api';
import { ConfigManager } from './utils/config';
import { PTPCli } from './cli/cli';
import { OriginManager } from './cli/origin';

/**
 * PassThePopcorn TypeScript API
 * 
 * This package provides three main interfaces to interact with PTP:
 * 1. API - For programmatic access to PTP's API
 * 2. CLI - For command-line operations like searching and downloading
 * 3. Origin - For managing torrent metadata and origin information
 * 
 * Basic usage:
 * ```typescript
 * import { createApi, createCli, createOrigin } from 'ptp-ts-api';
 * 
 * // Create API instance
 * const api = createApi({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Search for movies
 * const movies = await api.search({ searchstr: 'Inception' });
 * 
 * // Download a torrent
 * await api.downloadTorrent('123456', './inception.torrent');
 * 
 * // Use CLI for command-line operations
 * const cli = createCli({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Search from command line
 * await cli.search({ terms: ['Inception', '2010'] });
 * 
 * // Use Origin for metadata management
 * const origin = createOrigin({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Create metadata file for a torrent
 * await origin.writeOrigin('./inception.torrent', {
 *   outputDirectory: './metadata'
 * });
 * ```
 * 
 * @module ptp-ts-api
 */

// Main API
export { PTPApi, PTPConfig } from './api/api';

// Models
export { Movie } from './models/movie';
export { Torrent } from './models/torrent';
export { User, CurrentUser } from './models/user';

// CLI
export { PTPCli } from './cli/cli';
export { OriginManager } from './cli/origin';

// Utils
export { ConfigManager } from './utils/config';
export { TokenBucket } from './utils/rate-limiter';
export { PTPAPIError } from './utils/error';

/**
 * Create a new PTP API instance with the given configuration
 * 
 * @param config - Configuration object with API credentials
 * @returns PTPApi instance
 * 
 * @example
 * ```typescript
 * const api = createApi({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key',
 *   baseUrl: 'https://passthepopcorn.me',  // Optional
 *   retry: true                            // Optional
 * });
 * 
 * // Search for movies
 * const movies = await api.search({ searchstr: 'Inception' });
 * 
 * // Get movie details
 * const movie = await api.getMovie('123456');
 * 
 * // Download torrent
 * await api.downloadTorrent('789012', './movie.torrent');
 * ```
 */
export function createApi(config: Record<string, string | boolean>): PTPApi {
  const configManager = new ConfigManager(config);
  return new PTPApi(configManager);
}

/**
 * Login to PTP with the given configuration
 * @deprecated Use createApi instead
 */
export function login(config: Record<string, string | boolean>): PTPApi {
  console.warn('login() is deprecated. Use createApi() instead.');
  return createApi(config);
}

/**
 * Create a new CLI instance with the given configuration
 * 
 * @param config - Configuration object with API credentials
 * @returns PTPCli instance
 * 
 * @example
 * ```typescript
 * const cli = createCli({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Search for movies
 * await cli.search({ terms: ['Inception', '2010'] });
 * 
 * // View inbox
 * await cli.inbox();
 * ```
 */
export function createCli(config: Record<string, string | boolean>): PTPCli {
  const api = createApi(config);
  return new PTPCli(api);
}

/**
 * Create a new Origin Manager instance with the given configuration
 * 
 * @param config - Configuration object with API credentials
 * @returns OriginManager instance
 * 
 * @example
 * ```typescript
 * const origin = createOrigin({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Create metadata file for a torrent
 * await origin.writeOrigin('./movie.torrent', {
 *   outputDirectory: './metadata',
 *   overwrite: false
 * });
 * ```
 */
export function createOrigin(config: Record<string, string | boolean>): OriginManager {
  const api = createApi(config);
  return new OriginManager(api);
}
