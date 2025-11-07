# TikTok Proxy Server

This Express.js server acts as a proxy to bypass CORS restrictions when downloading TikTok videos.

## How It Works

1. **Client Request**: The React frontend sends a POST request with the TikTok URL
2. **Server Proxy**: This server fetches the video data from TikTok APIs
3. **Response**: Returns video URLs, metadata, and stats to the client
4. **Download**: Client downloads the video directly from the returned URL

## API Methods

The server uses multiple fallback methods for reliability:

### Method 1: RapidAPI (Primary)
- Requires API key (optional)
- Best quality and reliability
- HD video support
- Get free key: https://rapidapi.com/yi005/api/tiktok-video-no-watermark2

### Method 2: TikWM API (Fallback)
- No API key required
- Good quality
- Public API

### Method 3: SnapTik (Fallback)
- No API key required
- Basic functionality
- HTML parsing

## Environment Variables

Create a `.env` file in the root directory:

```env
RAPIDAPI_KEY=your_api_key_here
PORT=3001
```

## Endpoints

### POST /api/tiktok/download

**Request:**
```json
{
  "url": "https://www.tiktok.com/@username/video/1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://...",
  "videoUrlNoWatermark": "https://...",
  "musicUrl": "https://...",
  "coverUrl": "https://...",
  "title": "Video Title",
  "author": "username",
  "duration": 30,
  "stats": {
    "likes": 1000,
    "comments": 50,
    "shares": 100,
    "plays": 5000
  }
}
```

### GET /health

Health check endpoint to verify server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "TikTok Proxy Server is running"
}
```

## Running the Server

```bash
npm run server
```

Or directly:
```bash
node server/tiktok-proxy.js
```

The server will start on port 3001 (or PORT from .env)

## CORS Configuration

CORS is enabled for all origins to allow the frontend to make requests.

## Error Handling

The server handles various error cases:
- Invalid URLs
- Video not found
- API failures
- Network errors

All errors return appropriate HTTP status codes and error messages.

## Security Notes

- No video data is stored on the server
- All downloads are client-side
- API keys should be kept in .env file (not committed to git)
- CORS is open for development (restrict in production)

## Production Deployment

For production:
1. Set appropriate CORS origins
2. Add rate limiting
3. Use environment variables for all config
4. Enable HTTPS
5. Add logging and monitoring
6. Consider caching responses

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `node-fetch` - HTTP client for API requests
