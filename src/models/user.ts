import { PTPApi } from '../api/api';
import { Movie } from './movie';
import { PTPUserInfo, PTPCurrentUserInfo, PTPMessageInfo } from '../types/user';
import { PTPError } from '../types/api';

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

  constructor(api: PTPApi, data: unknown) {
    if (!User.validateUserInfo(data)) {
      throw new PTPError('Invalid user data received from API', undefined, data);
    }

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

  protected static validateUserInfo(data: unknown): data is PTPUserInfo {
    if (typeof data !== 'object' || data === null) return false;
    const user = data as Partial<PTPUserInfo>;
    return (
      typeof user.Id === 'string' &&
      typeof user.Username === 'string' &&
      typeof user.Avatar === 'string' &&
      typeof user.ProfileText === 'string' &&
      typeof user.JoinDate === 'string' &&
      typeof user.Uploaded === 'string' &&
      typeof user.Downloaded === 'string' &&
      typeof user.Ratio === 'string' &&
      typeof user.RequiredRatio === 'string'
    );
  }

  async getUploads(): Promise<Movie[]> {
    const data = await this.api.get('torrents.php', { userid: this.id });
    return data.Movies.map((m: unknown) => new Movie(this.api, m));
  }
}

export class CurrentUser extends User {
  private newMessages: number;

  constructor(api: PTPApi, data: unknown) {
    if (!CurrentUser.validateCurrentUserInfo(data)) {
      throw new PTPError('Invalid current user data received from API', undefined, data);
    }
    super(api, data);
    this.newMessages = data.NewMessages;
  }

  private static validateCurrentUserInfo(data: unknown): data is PTPCurrentUserInfo {
    if (typeof data !== 'object' || data === null) return false;
    const user = data as Partial<PTPCurrentUserInfo>;
    return (
      User.validateUserInfo(data) &&
      typeof user.NewMessages === 'number'
    );
  }

  async getNewMessages(): Promise<number> {
    return this.newMessages;
  }

  async inbox(page: number = 1): Promise<PTPMessageInfo[]> {
    const data = await this.api.get('inbox.php', { page: page.toString() });
    return data.Messages || [];
  }
}
