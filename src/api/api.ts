import { ConfigManager } from '../utils/config';
import { TokenBucket } from '../utils/rate-limiter';
import { Movie } from '../models/movie';
import { Torrent } from '../models/torrent';
import { User, CurrentUser } from '../models/user';
import { AdvancedSearchParams } from '../types/search';
import { ConfigKey, ConfigValidationError } from '../types/config';
import {
  PTPSearchResponse,
  PTPErrorResponse,
  isPTPErrorResponse,
  PTPError
} from '../types/api';
import * as fs from 'fs/promises';

export interface PTPConfig {
  apiUser?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  passKey?: string;
  baseUrl?: string;
  cookiesFile?: string;
  retry?: boolean;
}

export class PTPApi {
  private sessionCookies: string[] = [];
  private authKey: string = '';
  private passKey: string = '';
  private rateLimiter: TokenBucket;

  constructor(
    private config: ConfigManager
  ) {
    this.rateLimiter = new TokenBucket(5, 2); // 5 tokens, 2 per second
  }

  async init(): Promise<void> {
    try {
      // Try API key auth first
      const apiUser = this.config.get(ConfigKey.API_USER);
      const apiKey = this.config.get(ConfigKey.API_KEY);
      if (apiUser && apiKey) {
        await this.loginWithApiKey(apiUser, apiKey);
        return;
      }

      // Fall back to password auth
      const username = this.config.get(ConfigKey.USERNAME);
      const password = this.config.get(ConfigKey.PASSWORD);
      const passkey = this.config.get(ConfigKey.PASSKEY);
      if (username && password && passkey) {
        await this.loginWithPassword(username, password, passkey);
        return;
      }

      throw new PTPError('No valid authentication method found');
    } catch (error) {
      throw PTPError.fromError(error);
    }
  }

  async login(): Promise<void> {
    await this.init();
  }

  async get(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    await this.rateLimiter.consume();
    const url = new URL(endpoint, this.config.getRequired(ConfigKey.BASE_URL));
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: this.getRequestHeaders()
    });

    if (!response.ok) {
      throw PTPError.fromHttpError('Request failed', response.status);
    }

    return response.json();
  }

  async search(params: Record<string, string>): Promise<Movie[]> {
    const data = await this.get('torrents.php', { ...params, json: '1' });
    return data.Movies.map((m: any) => new Movie(this, m));
  }

  async searchCoverview(params: Record<string, string>): Promise<Movie[]> {
    const data = await this.get('torrents.php', {
      ...params,
      json: '1',
      type: 'coverview'
    });
    return data.Movies.map((m: any) => new Movie(this, m));
  }

  async getMovie(id: string): Promise<Movie> {
    const data = await this.get('torrents.php', { id, json: '1' });
    return new Movie(this, data);
  }

  async getTorrent(id: string, groupId: string): Promise<Torrent> {
    const data = await this.get('torrents.php', {
      torrentid: id,
      id: groupId,
      json: '1'
    });
    return new Torrent(this, data);
  }

  async getCurrentUser(): Promise<CurrentUser> {
    const data = await this.get('user.php', { id: 'me' });
    return new CurrentUser(this, data);
  }

  async getUser(id: string): Promise<User> {
    const data = await this.get('user.php', { id });
    return new User(this, data);
  }

  async downloadTorrent(id: string, path?: string): Promise<void> {
    await this.rateLimiter.consume();
    const url = new URL('torrents.php', this.config.getRequired(ConfigKey.BASE_URL));
    url.searchParams.append('action', 'download');
    url.searchParams.append('id', id);
    url.searchParams.append('passkey', this.passKey);

    const response = await fetch(url.toString(), {
      headers: this.getRequestHeaders()
    });

    if (!response.ok) {
      throw PTPError.fromHttpError('Download failed', response.status);
    }

    if (path) {
      const buffer = await response.arrayBuffer();
      await fs.writeFile(path, Buffer.from(buffer));
    }
  }

  async collage(collageId: string, searchTerms?: Record<string, string>): Promise<Movie[]> {
    const data = await this.get('collages.php', {
      id: collageId,
      ...(searchTerms || {})
    });
    return data.Movies.map((m: any) => new Movie(this, m));
  }

  async artist(artistId: string, searchTerms?: Record<string, string>): Promise<Movie[]> {
    const data = await this.get('artist.php', {
      id: artistId,
      ...(searchTerms || {})
    });
    return data.Movies.map((m: any) => new Movie(this, m));
  }

  async needForSeed(filters?: Record<string, string>): Promise<Movie[]> {
    const data = await this.get('needforseed.php', filters || {});
    return data.Movies.map((m: any) => new Movie(this, m));
  }

  async requests(filters?: Record<string, string>): Promise<any[]> {
    const data = await this.get('requests.php', filters || {});
    return data.Requests || [];
  }

  /**
   * Get common headers used in API requests
   */
  private getRequestHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Cookie': this.sessionCookies.join('; ')
    };

    // Add API credentials if available
    const apiUser = this.config.get(ConfigKey.API_USER);
    const apiKey = this.config.get(ConfigKey.API_KEY);
    if (apiUser && apiKey) {
      headers['ApiUser'] = apiUser;
      headers['ApiKey'] = apiKey;
    }

    // Add auth key if available
    if (this.authKey) {
      headers['Authorization'] = `Bearer ${this.authKey}`;
    }

    return headers;
  }

  /**
   * Perform an advanced search for movies using various filters
   */
  async advancedSearch(params: AdvancedSearchParams): Promise<Movie[]> {
    try {
      await this.rateLimiter.consume();

      const searchParams = new URLSearchParams();
      searchParams.append('action', 'advanced');

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${this.config.getRequired(ConfigKey.BASE_URL)}/torrents.php?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: this.getRequestHeaders()
        }
      );

      if (!response.ok) {
        throw PTPError.fromHttpError('Advanced search failed', response.status);
      }

      const data: PTPSearchResponse | PTPErrorResponse = await response.json();

      if (isPTPErrorResponse(data)) {
        throw PTPError.fromResponse(data);
      }

      return data.Movies.map(movieData => new Movie(this, movieData));

    } catch (error) {
      if (error instanceof ConfigValidationError) {
        throw new PTPError('Search failed: Missing required configuration');
      }
      throw PTPError.fromError(error);
    }
  }

  private async loginWithApiKey(apiUser: string, apiKey: string): Promise<void> {
    try {
      const passkey = this.config.get(ConfigKey.PASSKEY);
      if (!passkey) {
        throw new PTPError('Passkey is required for API key login');
      }

      const response = await fetch(`${this.config.getRequired(ConfigKey.BASE_URL)}/ajax.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'ApiUser': apiUser,
          'ApiKey': apiKey
        }
      });

      if (!response.ok) {
        throw PTPError.fromHttpError('API key login failed', response.status);
      }

      const data: PTPErrorResponse | { authKey: string } = await response.json();
      
      if (isPTPErrorResponse(data)) {
        throw PTPError.fromResponse(data);
      }

      this.authKey = data.authKey;
      this.passKey = passkey;
      this.sessionCookies = response.headers.get('set-cookie')?.split(',') || [];
    } catch (error) {
      throw PTPError.fromError(error);
    }
  }

  private async loginWithPassword(username: string, password: string, passkey: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.getRequired(ConfigKey.BASE_URL)}/ajax.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username,
          password,
          passkey,
          keeplogged: '1'
        }).toString()
      });

      if (!response.ok) {
        throw PTPError.fromHttpError('Password login failed', response.status);
      }

      const data: PTPErrorResponse | { authKey: string } = await response.json();
      
      if (isPTPErrorResponse(data)) {
        throw PTPError.fromResponse(data);
      }

      this.authKey = data.authKey;
      this.passKey = passkey;
      this.sessionCookies = response.headers.get('set-cookie')?.split(',') || [];
    } catch (error) {
      throw PTPError.fromError(error);
    }
  }
}
