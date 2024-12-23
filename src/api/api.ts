import { ConfigManager } from '../utils/config';
import { TokenBucket } from '../utils/rate-limiter';
import { PTPAPIError } from '../utils/error';
import { Movie } from '../models/movie';
import { Torrent } from '../models/torrent';
import { User, CurrentUser } from '../models/user';

export interface PTPConfig {
  apiUser?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  passkey?: string;
}

export class PTPApi {
  private config: ConfigManager;
  private rateLimiter: TokenBucket;
  private authKey: string;
  private passKey: string;
  private sessionCookies: string[];

  constructor(config: PTPConfig) {
    this.config = new ConfigManager(config);
    this.rateLimiter = new TokenBucket(5, 2); // 5 tokens, 2 per second
    this.authKey = '';
    this.passKey = '';
    this.sessionCookies = [];
  }

  async login(): Promise<void> {
    const apiUser = this.config.get('APIUSER');
    const apiKey = this.config.get('APIKEY');
    
    if (apiUser && apiKey) {
      await this.loginWithApiKey(apiUser, apiKey);
    } else {
      const username = this.config.get('USERNAME');
      const password = this.config.get('PASSWORD');
      const passkey = this.config.get('PASSKEY');
      
      if (!username || !password || !passkey) {
        throw new PTPAPIError('Missing credentials');
      }
      
      await this.loginWithCredentials(username, password, passkey);
    }
  }

  async get(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    await this.rateLimiter.consume();
    const url = new URL(endpoint, this.config.get('BASEURL'));
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Cookie': this.sessionCookies.join('; '),
        'ApiUser': this.config.get('APIUSER'),
        'ApiKey': this.config.get('APIKEY')
      }
    });

    if (!response.ok) {
      throw new PTPAPIError(
        `Request failed: ${response.statusText}`,
        response.status,
        await response.json()
      );
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
    const url = new URL('torrents.php', this.config.get('BASEURL'));
    url.searchParams.append('action', 'download');
    url.searchParams.append('id', id);

    const response = await fetch(url.toString(), {
      headers: {
        'Cookie': this.sessionCookies.join('; '),
        'ApiUser': this.config.get('APIUSER'),
        'ApiKey': this.config.get('APIKEY')
      }
    });

    if (!response.ok) {
      throw new PTPAPIError(
        `Download failed: ${response.statusText}`,
        response.status
      );
    }

    // Handle file saving based on path parameter
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

  private async loginWithApiKey(apiUser: string, apiKey: string): Promise<void> {
    // Implement API key login
  }

  private async loginWithCredentials(
    username: string,
    password: string,
    passkey: string
  ): Promise<void> {
    // Implement username/password login
  }
}
