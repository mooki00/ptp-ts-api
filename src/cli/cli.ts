import { PTPApi } from '../api/api';

export class PTPCli {
  private api: PTPApi;
  
  constructor(api: PTPApi) {
    this.api = api;
  }
  
  async inbox(options: {
    page?: number;
  }): Promise<void> {
    const user = await this.api.getCurrentUser();
    const page = options.page || 1;
    const messages = await user.inbox(page);

    console.log('Messages:');
    console.log('-'.repeat(47));
    for (const msg of messages) {
      console.log(
        `${msg.Id.padEnd(10)}${this.ellipsize(msg.Subject, 31).padEnd(32)}${this.ellipsize(msg.SenderId, 15)}`
      );
    }
  }
  
  async search(options: {
    terms: string[];
    format?: 'json' | 'text';
    filterEmpty?: boolean;
  }): Promise<void> {
    const { terms, format, filterEmpty } = options;
    const searchParams = this.parseSearchTerms(terms);
    
    const movies = await this.api.search(searchParams as Record<string, string>);
    const filteredMovies = filterEmpty ? movies.filter(m => m.torrents.length > 0) : movies;
    
    if (format === 'json') {
      console.log(JSON.stringify(filteredMovies, null, 2));
    } else {
      for (const movie of filteredMovies) {
        console.log(`${movie.title} (${movie.year})`);
        for (const torrent of movie.torrents) {
          console.log(`  ${torrent.name} - ${torrent.size} - S:${torrent.seeders} L:${torrent.leechers}`);
        }
      }
    }
  }
  
  private parseSearchTerms(terms: string[]): Record<string, string> {
    const result: Record<string, string> = {
      action: 'advanced'
    };
    
    for (const term of terms) {
      if (term.includes('=')) {
        const [key, value] = term.split('=');
        switch (key) {
          case 'year':
          case 'language':
          case 'subtitles':
          case 'country':
          case 'tags':
          case 'format':
          case 'resolution':
          case 'source':
          case 'codec':
            result[key] = value;
            break;
          default:
            result[key] = value;
        }
      } else {
        result.searchstr = term;
      }
    }
    
    return result;
  }
  
  private ellipsize(str: string, length: number): string {
    if (!str) return '';
    return str.length > length ? str.slice(0, length - 3) + '...' : str;
  }
}
