import { PTPApi } from './api/api';
import { ConfigManager } from './utils/config';

/**
 * Creates a new PTP API instance with the given configuration.
 * 
 * @param config - Configuration object containing API credentials
 * @param config.apiUser - PTP API username
 * @param config.apiKey - PTP API key
 * @param config.passKey - PTP passkey
 * @returns PTP API instance
 * 
 * @example
 * ```typescript
 * const api = createApi({
 *   apiUser: 'your-api-user',
 *   apiKey: 'your-api-key',
 *   passKey: 'your-pass-key'
 * });
 * 
 * // Search for movies
 * const movies = await api.search({ searchstr: 'Inception' });
 * 
 * // Get movie details
 * const movie = await api.getMovie('12345');
 * ```
 */
export function createApi(config: {
  apiUser: string;
  apiKey: string;
  passKey: string;
}): PTPApi {
  const configManager = new ConfigManager({
    PTPAPI_APIUSER: config.apiUser,
    PTPAPI_APIKEY: config.apiKey,
    PTPAPI_PASSKEY: config.passKey
  });
  return new PTPApi(configManager);
}

export type { PTPApi };
export * from './api/types';
