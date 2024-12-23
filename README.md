# @mooki0/ptp-ts-api

[![npm version](https://img.shields.io/npm/v/@mooki0/ptp-ts-api.svg)](https://www.npmjs.com/package/@mooki0/ptp-ts-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A TypeScript API client for PassThePopcorn, providing a modern, type-safe interface to interact with PTP's API.

## Features

- 🔒 Secure API key authentication
- 🔍 Search movies and browse collections
- 📦 Download torrents with proper rate limiting
- 👤 User management (bookmarks, uploads)
- 🎬 Movie and torrent information
- 📝 Type-safe API with TypeScript
- 🚀 Promise-based async/await interface

## Installation

```bash
# npm
npm install @mooki0/ptp-ts-api

# yarn
yarn add @mooki0/ptp-ts-api

# pnpm
pnpm add @mooki0/ptp-ts-api

# bun
bun add @mooki0/ptp-ts-api
```

## Quick Start

```typescript
import { login } from '@mooki0/ptp-ts-api';

// Initialize the API
const api = login({
  apiUser: 'your-api-user',
  apiKey: 'your-api-key'
});

// Search for movies
const movies = await api.search({ searchStr: 'Inception' });

// Get movie by ID
const movie = await api.getMovie('123456');

// Get movie's best matching torrent
const torrent = await movie.getBestMatch({
  codec: 'x264',
  container: 'MKV',
  source: 'Blu-ray',
  resolution: '1080p'
});
```

## Environment Configuration

The API can be configured through environment variables. Create a `.env` file in your project root:

```bash
# Authentication (use either API key or username/password)
# Option 1: API Key (recommended)
PTPAPI_APIUSER=your-api-user
PTPAPI_APIKEY=your-api-key

# Option 2: Username/Password
PTPAPI_USERNAME=your-username
PTPAPI_PASSWORD=your-password
PTPAPI_PASSKEY=your-passkey

# API Settings
PTPAPI_BASEURL=https://passthepopcorn.me/
PTPAPI_COOKIESFILE=.cookies

# Rate Limiting
PTPAPI_RATELIMIT_CAPACITY=5
PTPAPI_RATELIMIT_REFILL=2

# Request Settings
PTPAPI_RETRY=true
PTPAPI_RETRY_ATTEMPTS=3
PTPAPI_RETRY_DELAY=1000

# Download Settings
PTPAPI_DOWNLOAD_DIRECTORY=./downloads
PTPAPI_AUTOLOAD_TORRENTS=false

# Debug Settings
PTPAPI_DEBUG=false
PTPAPI_LOG_LEVEL=info
```

## Examples

```typescript
import { login } from '@mooki0/ptp-ts-api';

// Browse collages
const collageMovies = await api.collage('123', { search: 'Action' });

// Browse artist filmography
const artistMovies = await api.artist('456');

// Find torrents that need seeding
const needSeeding = await api.needForSeed();

// Browse requests
const requests = await api.requests({ search: 'Documentary' });

// User operations
const user = await api.getCurrentUser();
const bookmarks = await user.bookmarks();
const uploads = await user.uploads();
```

## API Reference

### PTPApi

The main API class for interacting with PassThePopcorn.

```typescript
import { PTPApi } from '@mooki0/ptp-ts-api';
```

#### Methods

- `search(filters: Record<string, string>): Promise<Movie[]>`
- `getMovie(id: string): Promise<Movie>`
- `collage(collageId: string, searchTerms?: Record<string, string>): Promise<Movie[]>`
- `artist(artistId: string, searchTerms?: Record<string, string>): Promise<Movie[]>`
- `needForSeed(filters?: Record<string, string>): Promise<Movie[]>`
- `requests(filters?: Record<string, string>): Promise<any[]>`
- `getCurrentUser(): Promise<CurrentUser>`

### Movie

Represents a movie on PassThePopcorn.

```typescript
import { Movie } from '@mooki0/ptp-ts-api';
```

#### Properties

- `id: string`
- `title: string`
- `year: string`
- `cover: string`
- `tags: string[]`
- `directors: string[]`
- `imdbId: string`
- `type: string`
- `torrents: Torrent[]`

#### Methods

- `getBestMatch(profile: TorrentProfile): Promise<Torrent | null>`

### Torrent

Represents a torrent on PassThePopcorn.

```typescript
import { Torrent } from '@mooki0/ptp-ts-api';
```

#### Properties

- `id: string`
- `size: number`
- `codec: string`
- `container: string`
- `source: string`
- `resolution: string`
- `releaseGroup: string`
- `seeders: number`
- `leechers: number`

### User

Represents a user on PassThePopcorn.

```typescript
import { User, CurrentUser } from '@mooki0/ptp-ts-api';
```

#### Methods

- `bookmarks(): Promise<Movie[]>`
- `uploads(): Promise<Movie[]>`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the original Python implementation [PTPAPI](https://github.com/kannibalox/PTPAPI)
- Thanks to the PTP development team for their API
