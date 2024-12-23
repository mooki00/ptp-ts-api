// PTP Advanced Search Types and Enums

// Container format (sent as 'encoding' to API)
export enum Container {
  AVI = 'AVI',
  MPG = 'MPG',
  MKV = 'MKV',
  MP4 = 'MP4',
  VOB_IFO = 'VOB IFO',
  ISO = 'ISO',
  M2TS = 'm2ts'
}

// Video codec (sent as 'format' to API)
export enum VideoCodec {
  XVID = 'XviD',
  DIVX = 'DivX',
  H264 = 'H.264',
  X264 = 'x264',
  H265 = 'H.265',
  X265 = 'x265',
  DVD5 = 'DVD5',
  DVD9 = 'DVD9',
  BD25 = 'BD25',
  BD50 = 'BD50',
  BD100 = 'BD100'
}

// Source media (sent as 'media' to API)
export enum Source {
  CAM = 'CAM',           // Camera recording from cinema
  TS = 'TS',            // Telesync
  R5 = 'R5',            // Region 5 DVD release
  DVD_SCREENER = 'DVD-Screener',
  VHS = 'VHS',
  WEB = 'WEB',
  DVD = 'DVD',
  TV = 'TV',
  HDTV = 'HDTV',
  HD_DVD = 'HD-DVD',
  BLU_RAY = 'Blu-Ray'
}

// Video resolution
export enum Resolution {
  ANYSD = 'anysd',      // Standard Definition
  ANYHD = 'anyhd',      // High Definition
  ANYHDPLUS = 'anyhdplus', // HD+
  ANYUHD = 'anyuhd',    // Ultra HD/4K
  NTSC = 'ntsc',        // 480i (North American/Japanese TV standard)
  PAL = 'pal',          // 576i (European TV standard)
  R480P = '480p',
  R576P = '576p',
  R720P = '720p',
  R1080I = '1080i',
  R1080P = '1080p',
  R2160P = '2160p'      // 4K
}

// Release type (sent as 'scene' to API)
export enum ReleaseType {
  GOLDEN_POPCORN = '2',  // Golden Popcorn releases
  PERSONAL = '3',        // Personal releases
  PERSONAL_GP = '4',     // Personal Golden Popcorn releases
  NON_SCENE = '0',       // Non-scene releases
  SCENE = '1'           // Scene releases
}

// Match type for multi-select fields
export enum MatchType {
  ANY = '',             // Match any of the selected options
  ALL = 'all'          // Must match all selected options
}

// Sort options
export enum SortBy {
  RELEVANCE = 'relevance',
  TIME_ADDED = 'time',
  TIME_NO_RESEED = 'timenoreseed',
  FIRST_TIME_ADDED = 'creationtime',
  YEAR = 'year',
  TITLE = 'title',
  SIZE = 'size',
  SNATCHED = 'snatched',
  SEEDERS = 'seeders',
  LEECHERS = 'leechers',
  RUNTIME = 'runtime',
  IMDB_RATING = 'imdb',
  IMDB_RATING_BAYESIAN = 'imdbbay',
  IMDB_VOTES = 'imdbvotes',
  PTP_RATING = 'ptprating',
  PTP_RATING_BAYESIAN = 'ptpratingbay',
  PTP_VOTES = 'ptpvotes',
  MC_RATING = 'mc',
  RT_RATING = 'rt',
  BOOKMARKS = 'bookmarks',
  GP_TIME = 'gptime'
}

// Sort direction
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Main search interface
export interface AdvancedSearchParams {
  // Search Action
  action: 'advanced';

  // Basic Search
  searchstr?: string;         // Movie title or IMDb ID (tt123456)
  inallakas?: 0 | 1;         // Include all alternative titles
  year?: string;             // Single year or range (e.g., "2021" or "2010-2015")
  artistname?: string;       // Director's name
  filelist?: string;         // Search within file names

  // Multi-Select Parameters
  language?: string;         // Comma-separated languages
  subtitles?: string;        // Comma-separated subtitle languages
  countrylist?: string;      // Comma-separated countries
  country_type?: MatchType;
  taglist?: string;          // Comma-separated tags
  tags_type?: MatchType;

  // Ratings
  imdbrating?: string;       // IMDb rating or range (e.g., "8.0" or "8.0-9.0")
  imdbvotes?: string;        // IMDb votes or range
  ptprating?: string;        // PTP rating or range
  ptpvotes?: string;         // PTP votes or range
  mcrating?: string;         // Metacritic rating
  rtrating?: string;         // Rotten Tomatoes rating

  // Technical Specifications
  encoding?: Container;      // Container format
  format?: VideoCodec;       // Video codec
  media?: Source;           // Source media
  resolution?: Resolution;   // Video resolution
  scene?: ReleaseType;      // Release type
  freetorrent?: 0 | 1;      // Freeleech status
  runtime?: string;         // Runtime range in minutes (e.g., "01-200")

  // Edition Information
  remastertitle?: string;   // Edition type (e.g., "Criterion Collection", "Director's Cut")
  remasteryear?: string;    // Remaster year

  // Search Behavior
  order_by?: SortBy;
  order_way?: SortOrder;
  grouping?: 0 | 1;        // Group torrents of same movie
  noredirect?: 0 | 1;      // Prevent auto-redirect on single match
  seen?: string;           // Filter by watched status

  // Category Filters (1 = enabled)
  'filter_cat[1]'?: 0 | 1;  // Feature Films
  'filter_cat[2]'?: 0 | 1;  // Short Films
  'filter_cat[3]'?: 0 | 1;  // Miniseries
  'filter_cat[4]'?: 0 | 1;  // Stand-up Comedy
  'filter_cat[5]'?: 0 | 1;  // Live Performance
  'filter_cat[6]'?: 0 | 1;  // Movie Collection
}
