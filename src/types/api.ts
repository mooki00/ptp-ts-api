// API Response Types
export interface PTPTorrentInfo {
  Id: string;
  Quality: string;
  Source: string;
  Container: string;
  Codec: string;
  Resolution: string;
  Size: number;
  UploadTime: string;
  Snatched: number;
  Seeders: number;
  Leechers: number;
  ReleaseName: string;
  Scene: boolean;
  GoldenPopcorn: boolean;
  Checked: boolean;
  FreeleechType: string;
}

export interface PTPMovieInfo {
  GroupId: string;
  Title: string;
  Year: string;
  Cover: string;
  Tags: string[];
  Directors: string[];
  ImdbId: string;
  TotalLeechers: number;
  TotalSeeders: number;
  TotalSnatched: number;
  MaxSize: number;
  LastUploadTime: string;
  Torrents: PTPTorrentInfo[];
}

export interface PTPSearchResponse {
  Movies: PTPMovieInfo[];
  TotalResults?: number;
  Page?: number;
  MaxPages?: number;
}

// API Error Types
export interface PTPErrorResponse {
  error: string;
  code?: number;
  status?: string;
}

// Type Guards
export function isPTPErrorResponse(data: unknown): data is PTPErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as PTPErrorResponse).error === 'string'
  );
}

// Combined Error Class
export class PTPError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly response?: unknown,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'PTPError';
  }

  static fromResponse(data: PTPErrorResponse): PTPError {
    return new PTPError(data.error, data.code, data);
  }

  static fromHttpError(message: string, status: number): PTPError {
    return new PTPError(message, undefined, undefined, status);
  }

  static fromError(error: unknown): PTPError {
    if (error instanceof PTPError) {
      return error;
    }
    return new PTPError(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
