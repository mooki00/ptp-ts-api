# @mooki0/ptp-ts-api

[![npm version](https://img.shields.io/npm/v/@mooki0/ptp-ts-api.svg)](https://www.npmjs.com/package/@mooki0/ptp-ts-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A TypeScript API client for PassThePopcorn, providing a modern, type-safe interface to interact with PTP's API.

## Features

- 🔒 Secure API key authentication
- 🔍 Search movies with advanced filters
- 📦 Download torrents
- 👤 User profile and inbox
- 🎬 Detailed movie and torrent information
- 📝 Type-safe API with TypeScript
- 🚀 Promise-based async/await interface

## Installation

```bash
npm install @mooki0/ptp-ts-api
```

## Quick Start

```typescript
import { createApi } from '@mooki0/ptp-ts-api';

// Initialize the API
const api = createApi({
  apiUser: 'your-api-user',
  apiKey: 'your-api-key',
  passKey: 'your-pass-key'
});

// Search for movies
const movies = await api.search({ searchstr: 'Inception' });

// Get movie by ID
const movie = await api.getMovie('123456');

// Get torrent details
const torrent = await api.getTorrent('789012', movie.id);

// Download a torrent
await api.downloadTorrent('789012', './inception.torrent');
```

## API Reference

### Movies

```typescript
// Basic search
const movies = await api.search({ searchstr: 'Inception' });

// Advanced search
const movies = await api.search({
  searchstr: 'Inception',
  year: '2010',
  codec: 'x264',
  resolution: '1080p',
  source: 'Blu-ray'
});

// Get movie details
const movie = await api.getMovie('123456');
```

### Torrents

```typescript
// Get torrent details
const torrent = await api.getTorrent('789012', '123456');

// Download torrent
await api.downloadTorrent('789012', './movie.torrent');
```

### User

```typescript
// Get current user info
const user = await api.getCurrentUser();

// Get inbox messages
const messages = await user.inbox(1); // page number
```

## Environment Variables

The API can be configured through environment variables:

```bash
# Required: API Credentials
PTPAPI_APIUSER=your-api-user
PTPAPI_APIKEY=your-api-key
PTPAPI_PASSKEY=your-pass-key

# Optional: API Settings
PTPAPI_BASEURL=https://passthepopcorn.me
PTPAPI_RETRY=true
```

## Types

The package exports TypeScript types for all API responses:

```typescript
import type {
  Movie,
  Torrent,
  User,
  SearchParams
} from '@mooki0/ptp-ts-api';
```

## Error Handling

```typescript
try {
  const movie = await api.getMovie('123456');
} catch (error) {
  if (error instanceof PTPAPIError) {
    console.error('API Error:', error.message);
    // Handle specific error cases
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 
