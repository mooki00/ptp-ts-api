import { PTPApi, PTPConfig } from './api/api';

// Main API
export { PTPApi } from './api/api';

// Models
export { Movie } from './models/movie';
export { Torrent } from './models/torrent';
export { User, CurrentUser } from './models/user';

// CLI Tools
export { PTPCli } from './cli/cli';
export { OriginManager } from './cli/origin';

// Utilities
export { ConfigManager } from './utils/config';
export { TokenBucket } from './utils/rate-limiter';
export { PTPAPIError } from './utils/error';

// Types
export type { PTPConfig } from './api/api';

// Helper function for easy login
export function login(config: PTPConfig): PTPApi {
  const api = new PTPApi(config);
  return api;
}
