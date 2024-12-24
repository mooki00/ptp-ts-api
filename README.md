# PTP TypeScript API

A TypeScript wrapper for the PassThePopcorn API.

## Installation

```bash
npm install ptp-ts-api
```

## Usage

```typescript
import { createApi, ConfigKey } from 'ptp-ts-api';

// Initialize the API with your credentials
const api = createApi({
  [ConfigKey.API_USER]: 'your-api-user',
  [ConfigKey.API_KEY]: 'your-api-key'
});

// Basic search
const movies = await api.search({
  searchstr: 'Up 2009'
});

// Advanced search
const advancedResults = await api.search({
  action: 'advanced',
  searchstr: 'Up',
  year: '2009',
  taglist: 'animation',
  codec: 'x264',
  resolution: '1080p'
});

// Get movie details
const movie = await api.getMovie('123456');

// Get torrent details
const torrent = await api.getTorrent('123456', '789012');

// Download a torrent
await api.downloadTorrent('123456');
```

## API Methods

- `search(params)`: Search for movies using basic or advanced parameters
- `getMovie(id)`: Get details for a specific movie
- `getTorrent(id, groupId)`: Get details for a specific torrent
- `downloadTorrent(id)`: Download a torrent file
- `getCurrentUser()`: Get current user information
- `getUser(id)`: Get user information
- `collage(id, searchTerms?)`: Get movies from a collage
- `artist(id, searchTerms?)`: Get movies from an artist
- `needForSeed(filters?)`: Get movies that need seeding
- `requests(filters?)`: Get requests

## Advanced Search Parameters

You can use advanced search by passing `action: 'advanced'` along with any of these parameters:

- `searchstr`: Search string
- `year`: Release year
- `taglist`: Comma-separated list of tags
- `codec`: Video codec (e.g., 'x264', 'x265')
- `container`: Container format (e.g., 'MKV', 'MP4')
- `resolution`: Video resolution (e.g., '1080p', '2160p')
- `source`: Source media (e.g., 'Blu-ray', 'WEB')
- And many more...

## Environment Variables

You can also configure the API using environment variables:

```env
PTPAPI_APIUSER=your-api-user
PTPAPI_APIKEY=your-api-key
```

## Error Handling

The API throws `PTPError` for any API-related errors. Always wrap API calls in try/catch blocks:

```typescript
try {
  const movies = await api.search({ searchstr: 'Up 2009' });
} catch (error) {
  if (error instanceof PTPError) {
    console.error('API Error:', error.message, error.status);
  }
}
```

## License

MIT
