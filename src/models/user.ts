import { PTPApi } from '../api/api';
import { Movie } from './movie';

export class User {
  protected api: PTPApi;
  public id: string;
  public name: string;
  public avatar: string;
  public profileText: string;
  public joinDate: string;
  public uploadedData: string;
  public downloadedData: string;
  public ratio: string;
  public requiredRatio: string;

  constructor(api: PTPApi, data: any) {
    this.api = api;
    this.id = data.Id;
    this.name = data.Username;
    this.avatar = data.Avatar;
    this.profileText = data.ProfileText;
    this.joinDate = data.JoinDate;
    this.uploadedData = data.Uploaded;
    this.downloadedData = data.Downloaded;
    this.ratio = data.Ratio;
    this.requiredRatio = data.RequiredRatio;
  }

  async getUploads(): Promise<Movie[]> {
    const data = await this.api.get('torrents.php', { userid: this.id });
    return data.Movies.map((m: any) => new Movie(this.api, m));
  }
}

export class CurrentUser extends User {
  private newMessages: number;

  constructor(api: PTPApi, data: any) {
    super(api, data);
    this.newMessages = data.NewMessages || 0;
  }

  async getNewMessages(): Promise<number> {
    return this.newMessages;
  }

  async inbox(page: number = 1): Promise<any[]> {
    const data = await this.api.get('inbox.php', { page: page.toString() });
    return data.Messages || [];
  }

  async inboxConversation(id: string): Promise<any> {
    const data = await this.api.get('inbox.php', { action: 'viewconv', id });
    return data;
  }

  async bookmarks(): Promise<Movie[]> {
    const data = await this.api.get('bookmarks.php', { type: 'torrents' });
    return data.Movies.map((m: any) => new Movie(this.api, m));
  }
}
