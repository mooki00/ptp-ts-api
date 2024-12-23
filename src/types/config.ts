// Config key types to prevent typos
export enum ConfigKey {
  // API Authentication
  API_USER = 'apiUser',
  API_KEY = 'apiKey',
  USERNAME = 'username',
  PASSWORD = 'password',
  PASSKEY = 'passkey',

  // API Settings
  BASE_URL = 'baseUrl',
  COOKIES_FILE = 'cookiesFile',
  RETRY = 'retry'
}

// Config value types for type checking
export type ConfigValues = {
  [ConfigKey.API_USER]: string;
  [ConfigKey.API_KEY]: string;
  [ConfigKey.USERNAME]: string;
  [ConfigKey.PASSWORD]: string;
  [ConfigKey.PASSKEY]: string;
  [ConfigKey.BASE_URL]: string;
  [ConfigKey.COOKIES_FILE]: string;
  [ConfigKey.RETRY]: boolean;
}

// Required keys for different auth methods
export const API_AUTH_REQUIRED_KEYS = [
  ConfigKey.API_USER,
  ConfigKey.API_KEY
] as const;

export const PASSWORD_AUTH_REQUIRED_KEYS = [
  ConfigKey.USERNAME,
  ConfigKey.PASSWORD,
  ConfigKey.PASSKEY
] as const;

// Config validation errors
export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

// Helper function to validate required keys
export function validateRequiredKeys(
  config: Partial<ConfigValues>,
  keys: readonly ConfigKey[]
): void {
  const missingKeys = keys.filter(key => config[key] === undefined);
  if (missingKeys.length > 0) {
    throw new ConfigValidationError(
      `Missing required configuration keys: ${missingKeys.join(', ')}`
    );
  }
}
