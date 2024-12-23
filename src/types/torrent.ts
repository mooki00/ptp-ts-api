export interface PTPTorrentInfo {
  Id: string;
  GroupId: string;
  ReleaseName: string;
  Size: string;
  Codec: string;
  Container: string;
  Source: string;
  Resolution: string;
  RemasterTitle: string;
  Seeders: string;
  Leechers: string;
  UploadTime: string;
  BBCodeDescription: string;
  Checked: boolean;
  GoldenPopcorn: boolean;
  Scene: boolean;
  ReleaseGroup: string;
  InfoHash: string;
}

// Type guard for torrent info
export function validatePTPTorrentInfo(data: unknown): data is PTPTorrentInfo {
  if (typeof data !== 'object' || data === null) return false;

  const torrent = data as Partial<PTPTorrentInfo>;

  // Required fields
  const requiredFields: (keyof PTPTorrentInfo)[] = [
    'Id',
    'GroupId',
    'ReleaseName',
    'Size',
    'Codec',
    'Container',
    'Source',
    'Resolution',
    'Seeders',
    'Leechers',
    'UploadTime'
  ];

  for (const field of requiredFields) {
    if (!(field in torrent)) return false;
  }

  // Type checks
  return (
    typeof torrent.Id === 'string' &&
    typeof torrent.GroupId === 'string' &&
    typeof torrent.ReleaseName === 'string' &&
    typeof torrent.Size === 'string' &&
    typeof torrent.Codec === 'string' &&
    typeof torrent.Container === 'string' &&
    typeof torrent.Source === 'string' &&
    typeof torrent.Resolution === 'string' &&
    typeof torrent.Seeders === 'string' &&
    typeof torrent.Leechers === 'string' &&
    typeof torrent.UploadTime === 'string'
  );
}
