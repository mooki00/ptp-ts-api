# PTP Advanced Search API

This document details the parameters and options available for the PassThePopcorn (PTP) advanced search API.

## Basic Search Parameters

- `searchstr`: Movie title or IMDb ID
  - Accepts movie titles or IMDb IDs (e.g., "tt123456")
  - Full IMDb URLs are also supported
  
- `inallakas`: Include alternative titles
  - `0`: Search only primary title
  - `1`: Include all alternative and non-English titles

- `year`: Release year filter
  - Single year: "2021"
  - Year range: "2010-2015"
  - Open-ended ranges: "2012-" or "-1989"

- `artistname`: Director's name

- `filelist`: Search within torrent file names
  - Useful for finding specific encoders or release groups

## Multi-Select Parameters

### Languages and Subtitles
- `language`: Primary audio language(s)
  - Comma-separated list
  - Uses IMDb language data
- `subtitles`: Available subtitle languages
  - Comma-separated list
- `countrylist`: Production countries
  - Comma-separated list
- `country_type`: Country matching type
  - `""` (empty): Match any listed country
  - `"all"`: Must match all listed countries

### Tags
- `taglist`: Movie tags
  - Comma-separated list
  - Tag exclusion: Prefix with "!" (e.g., "action,!horror")
  - Multiple inclusions/exclusions can be mixed (e.g., "action,drama,!horror,!comedy")
- `tags_type`: Tag matching type
  - `""` (empty): Match any listed tag
  - `"all"`: Must match all listed tags (excluding the negated ones)

## Rating Filters

All rating fields support single values or ranges:
- Single rating: "8.0"
- Rating range: "8.0-9.0"

- `imdbrating`: IMDb rating
- `imdbvotes`: IMDb vote count
- `ptprating`: PTP community rating
- `ptpvotes`: PTP vote count
- `mcrating`: Metacritic rating
- `rtrating`: Rotten Tomatoes rating

## Technical Specifications

### Container Format (`encoding`)
- `AVI`
- `MPG`
- `MKV`
- `MP4`
- `VOB IFO`
- `ISO`
- `m2ts`

### Video Codec (`format`)
- `XviD`
- `DivX`
- `H.264`
- `x264`
- `H.265`
- `x265`
- `DVD5`
- `DVD9`
- `BD25`
- `BD50`
- `BD100`

### Source Media (`media`)
- `CAM`: Camera recording from cinema
- `TS`: Telesync
- `R5`: Region 5 DVD release
- `DVD-Screener`
- `VHS`
- `WEB`
- `DVD`
- `TV`
- `HDTV`
- `HD-DVD`
- `Blu-Ray`

### Resolution (`resolution`)
- Category-based:
  - `anysd`: Any Standard Definition
  - `anyhd`: Any High Definition
  - `anyhdplus`: Any HD+
  - `anyuhd`: Any Ultra HD/4K
- TV Standards:
  - `ntsc`: 480i (NTSC)
  - `pal`: 576i (PAL)
- Progressive Resolutions:
  - `480p`
  - `576p`
  - `720p`
  - `1080i`
  - `1080p`
  - `2160p` (4K)

### Release Type (`scene`)
- `2`: Golden Popcorn
- `3`: Personal
- `4`: Personal Golden Popcorn
- `0`: Non-Scene
- `1`: Scene

## Sort Options (`order_by`)

- `relevance`: Best match
- `time`: Time added
- `timenoreseed`: Time without reseeds
- `creationtime`: First time added
- `year`: Release year
- `title`: Alphabetical by title
- `size`: File size
- `snatched`: Times snatched
- `seeders`: Number of seeders
- `leechers`: Number of leechers
- `runtime`: Movie duration
- `imdb`: IMDb rating
- `imdbbay`: IMDb rating (bayesian)
- `imdbvotes`: IMDb vote count
- `ptprating`: PTP rating
- `ptpratingbay`: PTP rating (bayesian)
- `ptpvotes`: PTP vote count
- `mc`: Metacritic rating
- `rt`: Rotten Tomatoes rating
- `bookmarks`: Bookmark count
- `gptime`: Golden Popcorn time

Sort direction (`order_way`):
- `asc`: Ascending
- `desc`: Descending

## Additional Parameters

- `runtime`: Movie length in minutes
  - Single value or range
  - Examples: "-60", "90-", "60-90"

- `remastertitle`: Edition information
  - Examples: "Criterion Collection", "Director's Cut"
  - Multiple tags separated by " / "

- `remasteryear`: Year of remaster

- `grouping`: Group results by movie
  - `0`: List all torrents separately
  - `1`: Group torrents by movie

- `noredirect`: Single result behavior
  - `0`: Redirect to movie page if single result
  - `1`: Always show results page

## Category Filters

Enable (1) or disable (0) specific categories:
- `filter_cat[1]`: Feature Films
- `filter_cat[2]`: Short Films
- `filter_cat[3]`: Miniseries
- `filter_cat[4]`: Stand-up Comedy
- `filter_cat[5]`: Live Performance
- `filter_cat[6]`: Movie Collection

## Example Queries

### Basic Movie Search
```typescript
const params: AdvancedSearchParams = {
  action: 'advanced',
  searchstr: 'Inception',
  year: '2010'
};
```

### Advanced Quality Search
```typescript
const params: AdvancedSearchParams = {
  action: 'advanced',
  searchstr: 'tt1375666',  // Inception IMDb ID
  media: Source.BLU_RAY,
  resolution: Resolution.R1080P,
  encoding: Container.MKV,
  format: VideoCodec.X264
};
```

### Multiple Filters
```typescript
const params: AdvancedSearchParams = {
  action: 'advanced',
  language: 'japanese,english',
  subtitles: 'english',
  countrylist: 'japan',
  taglist: 'action,!horror',
  tags_type: MatchType.ANY,
  imdbrating: '8.0-',
  order_by: SortBy.IMDB_RATING,
  order_way: SortOrder.DESC
};
