import { PTPApi } from '../api/api';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'yaml';
import cheerio from 'cheerio';
import parseTorrent from 'parse-torrent';
import type { Instance as TorrentInstance } from 'parse-torrent';

interface OriginData {
  Title: string;
  Year: number;
  Directors: string[];
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

interface ParsedTorrent extends TorrentInstance {
  comment?: string;
}

export class OriginManager {
  private api: PTPApi;
  private readonly COMMENT_REGEX = /https:\/\/passthepopcorn\.me\/torrents\.php\?id=(\d+)&torrentid=(\d+)/;
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
    
    const yamlPath = path.join(outputDir, `${this.getBaseName(torrentPath)}.yaml`);
    if (await this.fileExists(yamlPath) && !options.overwrite) {
      logger.info(`Skipping file ${torrentPath}, origin file '${yamlPath}' exists`);
      return;
    }
    
    logger.info(`Writing origin YAML file ${yamlPath}`);
    
    const data: OriginData = {
      Title: movie.title,
      Year: parseInt(movie.year),
      Directors: movie.directors,
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
    
    const yamlContent = await this.toYAML(data);
    await this.writeFile(yamlPath, yamlContent);
  }
  
  private async readMetafile(path: string): Promise<{ comment?: string }> {
    const content = await fs.readFile(path);
    const torrent = parseTorrent(content) as ParsedTorrent;
    return {
      comment: torrent.comment
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
    const $ = cheerio.load(response);
    
    $('.log_entries tr').each((_, row) => {
      const text = $(row).find('td:last-child').text().trim();
      if (this.DELETED_BY_REGEX.test(text)) {
        log.push(text);
      }
    });
    
    return log;
  }
  
  private async toYAML(data: OriginData): Promise<string> {
    return yaml.stringify(data, { indent: 2 });
  }
  
  private getBaseName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }
  
  private async ensureDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
  
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  private async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf8');
  }
}
