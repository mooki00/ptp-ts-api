# PTP TypeScript API

A TypeScript implementation of the PassThePopcorn API client.

## Features

- Full TypeScript support with proper type definitions
- Modern async/await API
- Rate limiting and request management
- Support for both API key and username/password authentication
- Comprehensive movie, torrent, and user management
- CLI-like interface for common operations
- Origin file generation for torrent metadata

## Installation

```bash
npm install ptp-ts-api
```

## Usage

```typescript
import { login, Movie, Torrent } from 'ptp-ts-api';

// Initialize with API key
const api = login({
  apiUser: 'your-api-user',
  apiKey: 'your-api-key'
});

// Search for movies
const movies = await api.search({
  searchstr: 'Inception',
  year: '2010'
});

// Get movie details
const movie = movies[0];
console.log(movie.title);
console.log(movie.year);

// Get torrent information
const torrent = movie.torrents[0];
console.log(torrent.name);
console.log(torrent.size);
```

## CLI Interface

```typescript
import { PTPCli } from 'ptp-ts-api';

const cli = new PTPCli(api);

// Search with CLI interface
await cli.search({
  terms: ['inception', 'year=2010'],
  format: 'json'
});

// Check inbox
await cli.inbox({
  unread: true
});
```

## Origin File Generation

```typescript
import { OriginManager } from 'ptp-ts-api';

const origin = new OriginManager(api);
await origin.writeOrigin('/path/to/torrent.torrent', {
  outputDirectory: '/path/to/output'
});
```

## Examples

```typescript
import { login } from 'ptp-ts-api';

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

A complete example configuration can be found in [.env.example](.env.example).

You can also configure the API programmatically:

```typescript
import { login } from 'ptp-ts-api';

const api = login({
  apiUser: 'your-api-user',
  apiKey: 'your-api-key',
  // Or use username/password
  // username: 'your-username',
  // password: 'your-password',
  // passkey: 'your-passkey'
});
