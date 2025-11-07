# YouTube to MP4 Converter Setup Guide

## 🚀 Features

- ✅ Download YouTube videos in multiple quality options (1080p, 720p, 480p, 360p)
- ✅ Extract audio from YouTube videos (MP3 format)
- ✅ View video information (title, author, views, likes, duration)
- ✅ Beautiful YouTube-themed UI with red gradients
- ✅ Smooth animations and transitions
- ✅ Real-time video preview with thumbnail
- ✅ Mobile-responsive design
- ✅ Multiple format support (MP4, WebM)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `ytdl-core` - YouTube video downloader library
- `express` - Backend server framework
- `cors` - Enable Cross-Origin Resource Sharing

## 🚀 Running the Application

You need to run **TWO** servers simultaneously:

### Terminal 1: Frontend (Vite Dev Server)

```bash
npm run dev
```

This starts the React frontend on `http://localhost:3000`

### Terminal 2: YouTube Backend Server

```bash
npm run youtube-server
```

This starts the YouTube proxy server on `http://localhost:3002`

### Optional: Run All Servers

If you also want to use the TikTok downloader, you can run both backend servers:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: TikTok Server
npm run server

# Terminal 3: YouTube Server
npm run youtube-server
```

## 📖 How to Use

1. **Copy YouTube URL**
   - Open YouTube
   - Find the video you want to download
   - Click the "Share" button
   - Select "Copy Link"

2. **Paste and Get Video Info**
   - Paste the URL in the input field
   - Click "Get Video" button
   - Wait for video information to load

3. **Choose Download Option**
   - **Video Quality Options**:
     - 1080p HD - Best quality (larger file)
     - 720p HD - High quality
     - 480p - Standard quality
     - 360p - Lower quality (smaller file)
   - **Audio Only** - Extract just the audio as MP3

4. **Download**
   - Click on your preferred quality option
   - Video will download automatically in a new tab

## 🔧 Troubleshooting

### Server Connection Error

If you see "Failed to fetch video information":
- Make sure the YouTube backend server is running (`npm run youtube-server`)
- Check that port 3002 is not being used by another application
- Verify your internet connection

### CORS Error

If you encounter CORS errors:
- Ensure both frontend and backend servers are running
- The backend server handles CORS automatically
- Don't try to download directly from the browser without the proxy

### Video Not Available

If the video cannot be downloaded:
- Verify the YouTube URL is correct and complete
- Check if the video is still available (not deleted or private)
- Some videos may be restricted due to copyright or region locks
- Age-restricted videos may require authentication

### Download Fails

If downloads fail:
- Try a different quality option
- Check your internet connection
- Some videos may have download restrictions
- Very long videos may take time to process

## 🌐 API Endpoints

### Backend Server (Port 3002)

**POST** `/api/youtube/info`

Fetch video information and available quality options.

Request body:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Response:
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "author": "Channel Name",
  "thumbnail": "https://...",
  "duration": 300,
  "views": 1000000,
  "likes": 50000,
  "qualityOptions": [
    {
      "quality": "1080p",
      "itag": 137,
      "container": "mp4"
    }
  ],
  "audioOptions": [
    {
      "quality": "128kbps",
      "itag": 140,
      "container": "m4a"
    }
  ]
}
```

**GET** `/api/youtube/download`

Download video in specified quality.

Query parameters:
- `url` - YouTube video URL (required)
- `quality` - Quality itag (optional, defaults to highest)

**GET** `/api/youtube/download-audio`

Download audio only from video.

Query parameters:
- `url` - YouTube video URL (required)

## 🎨 UI Features

- **YouTube Brand Colors** - Red gradient theme matching YouTube's identity
- **Smooth Animations** - Fade-in, slide-up, and pulse effects
- **Video Preview** - Thumbnail with overlay information
- **Stats Display** - Shows views and likes with emoji icons
- **Quality Badges** - Clear indication of video quality and format
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark Mode Support** - Automatically adapts to system theme
- **Hover Effects** - Interactive buttons with scale and shadow effects

## 📝 Technical Details

### Video Quality Options

The converter automatically detects available qualities:
- **2160p (4K)** - Ultra HD (if available)
- **1440p (2K)** - Quad HD (if available)
- **1080p** - Full HD
- **720p** - HD
- **480p** - Standard Definition
- **360p** - Low Definition

### Audio Extraction

Audio is extracted in the highest available quality:
- Format: MP3
- Bitrate: Up to 192kbps
- Suitable for music, podcasts, and audio content

### File Naming

Downloaded files are automatically named based on the video title with special characters removed for compatibility.

## 🔒 Privacy & Legal

- This tool is for personal use only
- Respect content creators' rights
- Don't redistribute downloaded content without permission
- YouTube's Terms of Service apply
- Some content may be protected by copyright

## 🐛 Known Issues

- Age-restricted videos cannot be downloaded
- Some premium/paid content may not be accessible
- Live streams and premieres may not work
- Very long videos (>2 hours) may timeout
- Some region-restricted content may not be available

## 💡 Tips

- Higher quality = larger file size and longer download time
- Use 720p for a good balance of quality and file size
- Audio-only option is perfect for music videos and podcasts
- Check video duration before downloading very long videos
- Downloads open in a new tab - allow pop-ups if blocked

## 🚀 Performance

- Video info fetching: ~2-5 seconds
- Download speed depends on:
  - Your internet connection
  - Video quality selected
  - Video length
  - Server load

## 🔄 Updates

The `ytdl-core` library is regularly updated to handle YouTube changes. If downloads stop working:
1. Update dependencies: `npm install ytdl-core@latest`
2. Restart the YouTube server
3. Clear browser cache

## 🤝 Support

If you encounter any issues:
1. Check that both servers are running
2. Verify the YouTube URL is valid
3. Try a different video to isolate the issue
4. Check browser console for error messages
5. Ensure you have the latest version of dependencies

---

**Enjoy downloading YouTube videos! 🎥**
