import { PTPApi } from '../api/api';
import { Torrent } from './torrent';
import { PTPMovieInfo } from '../types/api';
import { PTPError } from '../types/api';

export class Movie {
  private api: PTPApi;
  public id: string;
  public title: string;
  public year: string;
  public cover: string;
  public tags: string[];
  public directors: string[];
  public imdbId: string;
  public totalLeechers: number;
  public totalSeeders: number;
  public totalSnatched: number;
  public maxSize: number;
  public lastUploadTime: string;
  public torrents: Torrent[];

  constructor(api: PTPApi, data: unknown) {
    if (!Movie.validateMovieInfo(data)) {
      throw new PTPError('Invalid movie data received from API', undefined, data);
    }

    this.api = api;
    this.id = data.GroupId;
    this.title = data.Title;
    this.year = data.Year;
    this.cover = data.Cover;
    this.tags = data.Tags;
    this.directors = data.Directors;
    this.imdbId = data.ImdbId;
    this.totalLeechers = data.TotalLeechers ?? 0;
    this.totalSeeders = data.TotalSeeders ?? 0;
    this.totalSnatched = data.TotalSnatched ?? 0;
    this.maxSize = data.MaxSize ?? 0;
    this.lastUploadTime = data.LastUploadTime ?? '';
    this.torrents = (data.Torrents ?? []).map(t => new Torrent(api, t));
  }

  private static validateMovieInfo(data: unknown): data is PTPMovieInfo {
    if (typeof data !== 'object' || data === null) return false;
    const movie = data as Partial<PTPMovieInfo>;

    // Required fields
    const requiredFields: (keyof PTPMovieInfo)[] = [
      'GroupId',
      'Title',
      'Year',
      'Cover',
      'Tags',
      'Directors',
      'ImdbId'
    ];

    for (const field of requiredFields) {
      if (!(field in movie)) return false;
    }

    // Type checks
    if (
      typeof movie.GroupId !== 'string' ||
      typeof movie.Title !== 'string' ||
      typeof movie.Year !== 'string' ||
      typeof movie.Cover !== 'string' ||
      typeof movie.ImdbId !== 'string' ||
      !Array.isArray(movie.Tags) ||
      !Array.isArray(movie.Directors) ||
      (movie.Torrents && !Array.isArray(movie.Torrents))
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get the best matching torrent based on a profile
   */
  async getBestMatch(profile: {
    minSize?: number;
    maxSize?: number;
    preferredCodec?: string[];
    preferredContainer?: string[];
    preferredResolution?: string[];
    preferredSource?: string[];
    requireGoldenPopcorn?: boolean;
    requireScene?: boolean;
  }): Promise<Torrent | null> {
    for (const torrent of this.torrents) {
      if (
        (!profile.minSize || parseInt(torrent.size) >= profile.minSize) &&
        (!profile.maxSize || parseInt(torrent.size) <= profile.maxSize) &&
        (!profile.preferredCodec || profile.preferredCodec.includes(torrent.codec)) &&
        (!profile.preferredContainer || profile.preferredContainer.includes(torrent.container)) &&
        (!profile.preferredResolution || profile.preferredResolution.includes(torrent.resolution)) &&
        (!profile.preferredSource || profile.preferredSource.includes(torrent.source)) &&
        (!profile.requireGoldenPopcorn || torrent.goldenPopcorn) &&
        (!profile.requireScene || torrent.scene)
      ) {
        return torrent;
      }
    }
    return null;
  }
}
