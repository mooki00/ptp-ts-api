import {
  ConfigKey,
  ConfigValues,
  ConfigValidationError,
  validateRequiredKeys,
  API_AUTH_REQUIRED_KEYS,
  PASSWORD_AUTH_REQUIRED_KEYS
} from '../types/config';

export class ConfigManager {
  private config: Partial<ConfigValues>;

  constructor(initialConfig: Partial<Record<string, string | boolean>> = {}) {
    this.config = {
      ...this.getDefaultConfig(),
      ...this.getEnvConfig(),
      ...this.normalizeConfig(initialConfig)
    };
  }

  /**
   * Get a configuration value with type safety
   */
  get<K extends ConfigKey>(key: K): ConfigValues[K] | undefined {
    return this.config[key];
  }

  /**
   * Get a configuration value, throwing if not found
   */
  getRequired<K extends ConfigKey>(key: K): ConfigValues[K] {
    const value = this.get(key);
    if (value === undefined) {
      throw new ConfigValidationError(`Required config key not found: ${key}`);
    }
    return value;
  }

  /**
   * Set a configuration value with type checking
   */
  set<K extends ConfigKey>(key: K, value: ConfigValues[K]): void {
    this.config[key] = value;
  }

  /**
   * Validate config for API key authentication
   */
  validateApiAuth(): void {
    validateRequiredKeys(this.config, API_AUTH_REQUIRED_KEYS);
  }

  /**
   * Validate config for password authentication
   */
  validatePasswordAuth(): void {
    validateRequiredKeys(this.config, PASSWORD_AUTH_REQUIRED_KEYS);
  }

  private getDefaultConfig(): Partial<ConfigValues> {
    return {
      [ConfigKey.BASE_URL]: 'https://passthepopcorn.me',
      [ConfigKey.COOKIES_FILE]: '.cookies',
      [ConfigKey.RETRY]: true
    };
  }

  private getEnvConfig(): Partial<ConfigValues> {
    const config = {} as Partial<ConfigValues>;
    
    // Map environment variables to config keys
    Object.values(ConfigKey).forEach(key => {
      const envKey = `PTP_${key.toUpperCase()}`;
      const envValue = process.env[envKey];
      if (envValue !== undefined) {
        const parsedValue = this.parseConfigValue(key, envValue);
        if (parsedValue !== undefined) {
          if (key === ConfigKey.RETRY) {
            config[key] = parsedValue as boolean;
          } else {
            config[key] = parsedValue as string;
          }
        }
      }
    });

    return config;
  }

  private normalizeConfig(config: Partial<Record<string, string | boolean>>): Partial<ConfigValues> {
    const normalized: Partial<ConfigValues> = {};
    const keyMap: Record<string, ConfigKey> = {
      apiUser: ConfigKey.API_USER,
      apiKey: ConfigKey.API_KEY,
      username: ConfigKey.USERNAME,
      password: ConfigKey.PASSWORD,
      passkey: ConfigKey.PASSKEY,
      baseUrl: ConfigKey.BASE_URL,
      cookiesFile: ConfigKey.COOKIES_FILE,
      retry: ConfigKey.RETRY
    };

    // Map config to internal format using the key map
    Object.entries(config).forEach(([key, value]) => {
      const configKey = keyMap[key];
      if (configKey !== undefined && value !== undefined) {
        const parsedValue = this.parseConfigValue(configKey, String(value));
        if (parsedValue !== undefined) {
          if (configKey === ConfigKey.RETRY) {
            normalized[configKey] = parsedValue as boolean;
          } else {
            normalized[configKey] = parsedValue as string;
          }
        }
      }
    });

    return normalized;
  }

  private parseConfigValue<K extends ConfigKey>(key: K, value: string): string | boolean | undefined {
    try {
      switch (key) {
        case ConfigKey.RETRY:
          return value.toLowerCase() === 'true';
        case ConfigKey.BASE_URL:
          // Ensure URL ends with trailing slash
          return value.endsWith('/') ? value : `${value}/`;
        default:
          return value;
      }
    } catch (error) {
      return undefined;
    }
  }
}
