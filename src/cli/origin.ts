import { PTPApi } from '../api/api';
import { Movie } from '../models/movie';
import { Torrent } from '../models/torrent';

interface OriginData {
  Title: string;
  Year: number;
  Directors: string[];
  Type: string;
  ReleaseName: string;
  RemasterTitle: string;
  IMDb: string;
  Cover: string;
  Permalink: string;
  InfoHash: string;
  Codec: string;
  Container: string;
  UploadTime: string;
  Checked: boolean;
  GoldenPopcorn: boolean;
  Scene: boolean;
  ReleaseGroup: string;
  Resolution: string;
  Size: number;
  Source: string;
  Tags: string[];
  Description: string;
  DeletionLog?: string[];
}

export class OriginManager {
  private api: PTPApi;
  private readonly COMMENT_REGEX = /https:\/\/passthepopcorn\.me\/torrents\.php\?id=(\d+)&torrentid=(\d+)/;
  private readonly URL_REGEX = /((http|https):\/\/)[a-zA-Z0-9\.\/?:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/?:@\-_=#])*/;
  private readonly DELETED_BY_REGEX = /was deleted by .* for/;
  
  constructor(api: PTPApi) {
    this.api = api;
  }
  
  async writeOrigin(torrentPath: string, options: {
    outputDirectory?: string;
    overwrite?: boolean;
  } = {}): Promise<void> {
    const logger = console;
    const metafile = await this.readMetafile(torrentPath);
    
    if (!metafile.comment || !this.COMMENT_REGEX.test(metafile.comment)) {
      logger.info(`Skipping file ${torrentPath}, does not contain PTP URL in comment`);
      return;
    }
    
    logger.info(`Working file ${torrentPath}`);
    const match = this.COMMENT_REGEX.exec(metafile.comment);
    if (!match) return;
    
    const movie = await this.api.getMovie(match[1]);
    const torrent = await this.api.getTorrent(match[2], match[1]);
    
    const outputDir = options.outputDirectory || this.getBaseName(torrentPath);
    await this.ensureDirectory(outputDir);
    
    const yamlPath = `${outputDir}/${this.getBaseName(torrentPath)}.yaml`;
    if (await this.fileExists(yamlPath) && !options.overwrite) {
      logger.info(`Skipping file ${torrentPath}, origin file '${yamlPath}' exists`);
      return;
    }
    
    logger.info(`Writing origin YAML file ${yamlPath}`);
    
    const data: OriginData = {
      Title: movie.title,
      Year: parseInt(movie.year),
      Directors: movie.directors,
      Type: movie.type,
      ReleaseName: torrent.name,
      RemasterTitle: torrent.remasterTitle,
      IMDb: `https://imdb.com/title/tt${movie.imdbId}`,
      Cover: movie.cover,
      Permalink: metafile.comment,
      InfoHash: torrent.infoHash,
      Codec: torrent.codec,
      Container: torrent.container,
      UploadTime: torrent.uploadTime,
      Checked: torrent.checked,
      GoldenPopcorn: torrent.goldenPopcorn,
      Scene: torrent.scene,
      ReleaseGroup: torrent.releaseGroup,
      Resolution: torrent.resolution,
      Size: parseInt(torrent.size),
      Source: torrent.source,
      Tags: movie.tags,
      Description: torrent.description
    };
    
    const deletionLog = await this.getDeletionLog(movie.id);
    if (deletionLog.length > 0) {
      data.DeletionLog = deletionLog;
    }
    
    const yaml = await this.toYAML(data);
    await this.writeFile(yamlPath, yaml);
  }
  
  private async readMetafile(path: string): Promise<any> {
    // This would use a torrent parsing library in a real implementation
    const content = await this.readFile(path);
    return {
      comment: content.comment,
      // other metafile fields...
    };
  }
  
  private async getDeletionLog(movieId: string): Promise<string[]> {
    const response = await this.api.get('torrents.php', {
      action: 'history_log',
      groupid: movieId,
      search: '',
      only_deletions: '1'
    });
    
    const log: string[] = [];
    // Parse HTML response and extract deletion log entries
    // This would use a proper HTML parser in a real implementation
    return log;
  }
  
  private async toYAML(data: OriginData): Promise<string> {
    // This would use a proper YAML library in a real implementation
    return JSON.stringify(data, null, 2);
  }
  
  private getBaseName(path: string): string {
    return path.split('/').pop()?.replace(/\.[^/.]+$/, '') || path;
  }
  
  private async ensureDirectory(path: string): Promise<void> {
    // Create directory if it doesn't exist
    // This would use fs.promises.mkdir in a real implementation
  }
  
  private async fileExists(path: string): Promise<boolean> {
    try {
      await this.readFile(path);
      return true;
    } catch {
      return false;
    }
  }
  
  private async readFile(path: string): Promise<any> {
    // This would use fs.promises.readFile in a real implementation
    throw new Error('Not implemented');
  }
  
  private async writeFile(path: string, content: string): Promise<void> {
    // This would use fs.promises.writeFile in a real implementation
    throw new Error('Not implemented');
  }
}
