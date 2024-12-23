import { PTPApi } from '../api/api';
import { Movie } from '../models/movie';

export class PTPCli {
  private api: PTPApi;
  
  constructor(api: PTPApi) {
    this.api = api;
  }
  
  async inbox(options: {
    page?: number;
    markAllRead?: boolean;
    conversation?: string;
    markRead?: string[];
    unread?: boolean;
    user?: string;
  }): Promise<void> {
    const user = await this.api.getCurrentUser();
    const page = options.page || 1;
    
    if (options.markAllRead) {
      console.log(`Clearing out ${await user.getNewMessages()} messages`);
      while (await user.getNewMessages() > 0) {
        const messages = await user.inbox(page);
        for (const msg of messages) {
          if (!msg.unread) continue;
          await user.inboxConversation(msg.id);
        }
      }
    } else if (options.conversation) {
      const conv = await user.inboxConversation(options.conversation);
      console.log(conv.Subject);
      for (const msg of conv.Message) {
        console.log(`${msg.User} - ${msg.Time}\n`);
        console.log(msg.Text);
        console.log('-'.repeat(30));
      }
    } else if (options.markRead) {
      for (const conv of options.markRead) {
        await user.inboxConversation(conv);
      }
    } else {
      const messages = await user.inbox(page);
      console.log('ID        Subject                          Sender');
      console.log('-'.repeat(47));
      for (const msg of messages) {
        if (options.unread && !msg.unread) continue;
        if (options.user && msg.sender !== options.user) continue;
        console.log(
          `${msg.id.padEnd(10)}${this.ellipsize(msg.subject, 31).padEnd(32)}${this.ellipsize(msg.sender, 15)}`
        );
      }
    }
  }
  
  async search(options: {
    terms: string[];
    format?: string;
    coverview?: boolean;
    filterEmpty?: boolean;
  }): Promise<void> {
    const { terms, format, coverview, filterEmpty } = options;
    const searchTerms = this.parseTerms(terms);
    
    let movies: Movie[];
    if (coverview) {
      movies = await this.api.searchCoverview(searchTerms);
    } else {
      movies = await this.api.search(searchTerms);
    }
    
    if (filterEmpty) {
      movies = movies.filter(m => m.torrents.length > 0);
    }
    
    if (format === 'json') {
      console.log(JSON.stringify(movies, null, 2));
    } else {
      for (const movie of movies) {
        console.log(`${movie.title} (${movie.year})`);
        for (const torrent of movie.torrents) {
          console.log(`  ${torrent.name} - ${torrent.size} - S:${torrent.seeders} L:${torrent.leechers}`);
        }
      }
    }
  }
  
  private parseTerms(terms: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const term of terms) {
      if (term.includes('=')) {
        const [key, value] = term.split('=');
        result[key] = value;
      } else {
        result.searchstr = term;
      }
    }
    
    return result;
  }
  
  private ellipsize(str: string, length: number): string {
    if (str.length > length) {
      return str.substring(0, length - 3) + '...';
    }
    return str;
  }
}
