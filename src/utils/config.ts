import { PTPConfig } from '../api/api';

export class ConfigManager {
  private config: Record<string, string>;

  constructor(initialConfig: Partial<PTPConfig> = {}) {
    this.config = {
      ...this.getDefaultConfig(),
      ...this.getEnvConfig(),
      ...this.normalizeConfig(initialConfig)
    };
  }

  get(key: string): string {
    return this.config[key] || '';
  }

  set(key: string, value: string): void {
    this.config[key] = value;
  }

  private getDefaultConfig(): Record<string, string> {
    return {
      BASEURL: 'https://passthepopcorn.me/',
      COOKIESFILE: '.cookies',
      RETRY: 'true'
    };
  }

  private getEnvConfig(): Record<string, string> {
    const config: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('PTPAPI_')) {
        config[key.replace('PTPAPI_', '')] = process.env[key] || '';
      }
    });
    return config;
  }

  private normalizeConfig(config: Partial<PTPConfig>): Record<string, string> {
    const normalized: Record<string, string> = {};
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined) {
        normalized[key.toUpperCase()] = value.toString();
      }
    });
    return normalized;
  }
}
