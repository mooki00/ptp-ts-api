import { PTPApi } from '../api/api';
import { Torrent } from './torrent';

export class Movie {
  private api: PTPApi;
  public id: string;
  public title: string;
  public year: string;
  public cover: string;
  public tags: string[];
  public directors: string[];
  public imdbId: string;
  public type: string;
  public name: string;
  public torrents: Torrent[];

  constructor(api: PTPApi, data: any) {
    this.api = api;
    this.id = data.Id;
    this.title = data.Name;
    this.name = data.Name; // For compatibility with old code
    this.year = data.Year;
    this.cover = data.Cover;
    this.tags = data.Tags;
    this.directors = data.Directors;
    this.imdbId = data.ImdbId;
    this.type = data.Type || 'Movie'; // Default to 'Movie' if not specified
    this.torrents = (data.Torrents || []).map((t: any) => new Torrent(api, t));
  }

  async getBestMatch(profile: {
    codec?: string;
    container?: string;
    source?: string;
    resolution?: string;
  }): Promise<Torrent | null> {
    for (const torrent of this.torrents) {
      if (
        (!profile.codec || torrent.codec === profile.codec) &&
        (!profile.container || torrent.container === profile.container) &&
        (!profile.source || torrent.source === profile.source) &&
        (!profile.resolution || torrent.resolution === profile.resolution)
      ) {
        return torrent;
      }
    }
    return null;
  }
}
