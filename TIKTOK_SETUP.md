# TikTok Downloader Setup Guide

## 🚀 Features

- ✅ Download TikTok videos without watermark in HD quality
- ✅ Download original videos with watermark
- ✅ Extract audio/music from TikTok videos (MP3)
- ✅ View video statistics (likes, comments, shares, views)
- ✅ Beautiful animated UI with gradient effects
- ✅ Real-time progress indicators
- ✅ Mobile-responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `express` - Backend server framework
- `cors` - Enable Cross-Origin Resource Sharing
- `node-fetch` - Fetch API for Node.js

### 2. Optional: Get RapidAPI Key (Recommended for better reliability)

For the best experience, sign up for a free RapidAPI account and get an API key:

1. Go to [RapidAPI TikTok Downloader](https://rapidapi.com/yi005/api/tiktok-video-no-watermark2)
2. Sign up for a free account
3. Subscribe to the free plan
4. Copy your API key
5. Create a `.env` file in the root directory:

```env
RAPIDAPI_KEY=your_api_key_here
```

**Note:** The downloader will work without an API key using fallback methods, but having one provides better reliability.

## 🚀 Running the Application

You need to run **TWO** servers simultaneously:

### Terminal 1: Frontend (Vite Dev Server)

```bash
npm run dev
```

This starts the React frontend on `http://localhost:3000`

### Terminal 2: Backend (Proxy Server)

```bash
npm run server
```

This starts the Express proxy server on `http://localhost:3001`

## 📖 How to Use

1. **Copy TikTok URL**
   - Open TikTok app or website
   - Find the video you want to download
   - Tap the "Share" button
   - Select "Copy Link"

2. **Paste and Download**
   - Paste the URL in the input field
   - Click the "Download" button
   - Wait for the video to be processed

3. **Choose Download Option**
   - **HD Video (No Watermark)** - Best quality without TikTok logo
   - **Original Video** - With watermark
   - **Audio Only (MP3)** - Extract music from the video

## 🔧 Troubleshooting

### Server Connection Error

If you see "Failed to fetch video data":
- Make sure the backend server is running (`npm run server`)
- Check that port 3001 is not being used by another application
- Verify your internet connection

### CORS Error

If you encounter CORS errors:
- Ensure both frontend and backend servers are running
- The backend server handles CORS automatically
- Don't try to download directly from the browser without the proxy

### Video Not Found

If the video cannot be downloaded:
- Verify the TikTok URL is correct and complete
- Check if the video is still available (not deleted)
- Try a different video to test
- Consider adding a RapidAPI key for better reliability

## 🌐 API Endpoints

### Backend Server

**POST** `/api/tiktok/download`

Request body:
```json
{
  "url": "https://www.tiktok.com/@username/video/1234567890"
}
```

Response:
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

## 🎨 UI Features

- **Gradient Animations** - Smooth fade-in and slide-up effects
- **Progress Bar** - Visual feedback during download
- **Error Handling** - Shake animation for error messages
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Mode Support** - Automatically adapts to system theme
- **Hover Effects** - Interactive buttons with scale and shadow effects

## 📝 Notes

- The backend server acts as a proxy to bypass CORS restrictions
- Multiple fallback APIs are used for reliability
- Videos are downloaded client-side (not stored on server)
- All downloads are temporary and not saved on the backend

## 🔒 Privacy & Legal

- This tool is for personal use only
- Respect content creators' rights
- Don't redistribute downloaded content without permission
- TikTok's Terms of Service apply

## 🐛 Known Issues

- Some private or region-restricted videos may not be downloadable
- Very long videos (>5 minutes) may take longer to process
- Audio extraction depends on video having music/audio track

## 💡 Tips

- Use HD quality option for best results
- Audio extraction works best with music videos
- Copy the full URL including `https://`
- Works with both `tiktok.com` and `vm.tiktok.com` links

## 🤝 Support

If you encounter any issues:
1. Check that both servers are running
2. Verify the TikTok URL is valid
3. Try a different video to isolate the issue
4. Check browser console for error messages

---

**Enjoy downloading TikTok videos! 🎉**
