import { PTPApi } from '../api/api';

export class Torrent {
  private api: PTPApi;
  public id: string;
  public groupId: string;
  public name: string;
  public size: string;
  public codec: string;
  public container: string;
  public source: string;
  public resolution: string;
  public remasterTitle: string;
  public seeders: number;
  public leechers: number;
  public uploadTime: string;
  public description: string;
  public checked: boolean;
  public goldenPopcorn: boolean;
  public scene: boolean;
  public releaseGroup: string;
  public infoHash: string;

  constructor(api: PTPApi, data: any) {
    this.api = api;
    this.id = data.Id;
    this.groupId = data.GroupId;
    this.name = data.ReleaseName;
    this.size = data.Size;
    this.codec = data.Codec;
    this.container = data.Container;
    this.source = data.Source;
    this.resolution = data.Resolution;
    this.remasterTitle = data.RemasterTitle;
    this.seeders = parseInt(data.Seeders);
    this.leechers = parseInt(data.Leechers);
    this.uploadTime = data.UploadTime;
    this.description = data.BBCodeDescription;
    this.checked = data.Checked;
    this.goldenPopcorn = data.GoldenPopcorn;
    this.scene = data.Scene;
    this.releaseGroup = data.ReleaseGroup;
    this.infoHash = data.InfoHash;
  }

  async download(path?: string): Promise<void> {
    await this.api.downloadTorrent(this.id, path);
  }
}
