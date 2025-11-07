# YouTube Proxy Server

This Express.js server provides YouTube video download functionality using `ytdl-core`.

## How It Works

1. **Client Request**: React frontend sends video URL
2. **Server Processing**: Server fetches video info and available formats
3. **Quality Selection**: Client chooses preferred quality
4. **Download**: Server streams video directly to client

## Features

- Multiple quality options (4K, 1080p, 720p, 480p, 360p)
- Audio-only extraction (MP3)
- Video metadata (title, views, likes, duration)
- Direct streaming (no server storage)
- CORS enabled for frontend access

## API Endpoints

### POST /api/youtube/info

Fetch video information and available download options.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "author": "Channel Name",
  "channelUrl": "https://...",
  "thumbnail": "https://...",
  "duration": 300,
  "views": 1000000,
  "likes": 50000,
  "description": "Video description...",
  "uploadDate": "2024-01-01",
  "qualityOptions": [
    {
      "quality": "1080p",
      "itag": 137,
      "container": "mp4",
      "filesize": "50000000",
      "fps": 30,
      "bitrate": 2500000
    }
  ],
  "audioOptions": [
    {
      "quality": "128kbps",
      "itag": 140,
      "container": "m4a",
      "filesize": "5000000"
    }
  ]
}
```

### GET /api/youtube/download

Download video in specified quality.

**Query Parameters:**
- `url` (required) - YouTube video URL
- `quality` (optional) - Video itag number, defaults to highest quality

**Example:**
```
GET /api/youtube/download?url=https://www.youtube.com/watch?v=VIDEO_ID&quality=137
```

**Response:**
- Content-Type: video/mp4
- Content-Disposition: attachment with filename
- Streams video data directly

### GET /api/youtube/download-audio

Download audio only from video.

**Query Parameters:**
- `url` (required) - YouTube video URL

**Example:**
```
GET /api/youtube/download-audio?url=https://www.youtube.com/watch?v=VIDEO_ID
```

**Response:**
- Content-Type: audio/mpeg
- Content-Disposition: attachment with filename
- Streams audio data directly

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "YouTube Proxy Server is running"
}
```

## Running the Server

```bash
npm run youtube-server
```

Or directly:
```bash
node server/youtube-proxy.js
```

Server runs on port 3002 by default.

## Environment Variables

Create a `.env` file:

```env
YOUTUBE_PORT=3002
```

## ytdl-core Library

This server uses `ytdl-core` for YouTube video downloading:

- **Version**: 4.11.5+
- **Features**: 
  - Video info extraction
  - Multiple format support
  - Quality filtering
  - Direct streaming
  - No API key required

## Quality Options

The server automatically detects and provides:

### Video Formats
- **2160p (4K)** - Ultra HD (if available)
- **1440p (2K)** - Quad HD (if available)
- **1080p** - Full HD
- **720p** - HD
- **480p** - Standard Definition
- **360p** - Low Definition

### Audio Formats
- **High Quality** - 192kbps
- **Medium Quality** - 128kbps
- **Low Quality** - 64kbps

## Error Handling

The server handles:
- Invalid URLs
- Video not found
- Restricted content
- Network errors
- Format unavailability

All errors return appropriate HTTP status codes and error messages.

## CORS Configuration

CORS is enabled for all origins to allow frontend access. For production, restrict to specific origins:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## Performance

- **Video Info**: 2-5 seconds
- **Download Speed**: Depends on video size and internet connection
- **Memory Usage**: Minimal (streaming, not buffering)
- **Concurrent Downloads**: Supports multiple simultaneous downloads

## Limitations

- Age-restricted videos require authentication
- Some videos may be geo-restricted
- Live streams and premieres not supported
- Very long videos (>2 hours) may timeout
- Copyright-protected content may be blocked

## Security Notes

- No video data is stored on the server
- All downloads are streamed directly
- No user data is collected
- Server acts as a proxy only

## Troubleshooting

### ytdl-core errors

If you get errors about video unavailability:
1. Update ytdl-core: `npm install ytdl-core@latest`
2. Restart the server
3. YouTube may have changed their API

### Port conflicts

If port 3002 is in use:
1. Change YOUTUBE_PORT in .env
2. Update frontend API_URL accordingly

### Download failures

- Check internet connection
- Verify video is not private/deleted
- Try a different video to isolate issue
- Check server logs for detailed errors

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `ytdl-core` - YouTube downloader
- `path` - File path utilities
- `url` - URL utilities

## Production Deployment

For production:
1. Set appropriate CORS origins
2. Add rate limiting middleware
3. Enable HTTPS
4. Add logging (Winston, Morgan)
5. Add monitoring (PM2, New Relic)
6. Consider caching video info
7. Add request validation
8. Implement error tracking

## Legal Compliance

- Respect YouTube's Terms of Service
- Don't use for commercial purposes without permission
- Respect copyright and content creator rights
- Implement rate limiting to avoid abuse
- Add disclaimer about legal usage

## Updates

Keep `ytdl-core` updated as YouTube frequently changes their API:

```bash
npm update ytdl-core
```

Check for updates regularly or use automated dependency updates.
