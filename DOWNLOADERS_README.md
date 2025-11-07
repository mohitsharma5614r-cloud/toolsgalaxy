# 🎥 Video Downloaders - Complete Guide

This project includes two fully functional video downloaders with beautiful UIs and animations.

## 📦 What's Included

### 1. TikTok Downloader (No Watermark)
- Download TikTok videos without watermark in HD
- Extract audio from TikTok videos
- View video stats (likes, comments, shares, views)
- Beautiful pink/red gradient UI

### 2. YouTube to MP4 Converter
- Download YouTube videos in multiple qualities (4K to 360p)
- Extract audio as MP3
- View video info (title, views, likes, duration)
- Beautiful YouTube-themed red gradient UI

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Running All Servers (Windows)

Double-click `start-all-servers.bat` to start everything at once!

### Manual Start

**Option 1: All Servers**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: TikTok Server
npm run server

# Terminal 3: YouTube Server
npm run youtube-server
```

**Option 2: Just One Downloader**
```bash
# Frontend (always needed)
npm run dev

# TikTok only
npm run server

# OR YouTube only
npm run youtube-server
```

## 🌐 Server Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| TikTok Server | 3001 | http://localhost:3001 |
| YouTube Server | 3002 | http://localhost:3002 |

## 📖 Usage Guides

### TikTok Downloader

1. Copy TikTok video URL from app
2. Paste in the input field
3. Click "Download"
4. Choose:
   - HD Video (No Watermark) ⭐
   - Original Video (With Watermark)
   - Audio Only (MP3)

**Example URLs:**
```
https://www.tiktok.com/@username/video/1234567890
https://vm.tiktok.com/ZMabcdefg/
```

### YouTube Converter

1. Copy YouTube video URL
2. Paste in the input field
3. Click "Get Video"
4. Choose quality:
   - 1080p HD ⭐
   - 720p HD
   - 480p
   - 360p
   - MP3 Audio

**Example URLs:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

## 🎨 UI Features

### TikTok Downloader
- **Colors**: Pink → Red → Yellow gradient (TikTok brand)
- **Animations**: Fade-in, slide-up, shake
- **Stats**: Views, likes, comments, shares with emojis
- **Preview**: Video cover with author info
- **Duration**: Video length display

### YouTube Converter
- **Colors**: Red gradient (YouTube brand)
- **Animations**: YouTube-fade-in, pulse effect
- **Stats**: Views and likes with emojis
- **Preview**: HD thumbnail with play button overlay
- **Duration**: Formatted time display (HH:MM:SS)

## 🔧 Technical Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Custom animations
- Responsive design

### Backend
- Express.js servers
- CORS enabled
- Direct streaming (no storage)

### Libraries
- `ytdl-core` - YouTube downloader
- `node-fetch` - HTTP requests for TikTok
- Multiple TikTok API fallbacks

## 📁 Project Structure

```
toolsgalaxy/
├── components/
│   └── tools/
│       ├── TikTokDownloader.tsx
│       └── YouTubeToMp4Converter.tsx
├── server/
│   ├── tiktok-proxy.js
│   ├── youtube-proxy.js
│   ├── README.md
│   └── README_YOUTUBE.md
├── src/
│   └── index.css (animations)
├── package.json
├── start-all-servers.bat
├── TIKTOK_SETUP.md
├── YOUTUBE_SETUP.md
├── QUICKSTART.md
└── QUICKSTART_YOUTUBE.md
```

## 🔒 Privacy & Security

- ✅ No video data stored on servers
- ✅ All downloads are client-side
- ✅ No user data collected
- ✅ Servers act as proxies only
- ✅ CORS properly configured

## ⚡ Performance

### TikTok Downloader
- Video info: ~2-3 seconds
- Download: Instant (direct link)
- Multiple API fallbacks for reliability

### YouTube Converter
- Video info: ~2-5 seconds
- Download: Depends on video size
- Direct streaming (no buffering)

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch video"**
- Ensure backend server is running
- Check internet connection
- Verify URL is valid

**"CORS Error"**
- Both frontend and backend must be running
- Don't access APIs directly from browser

**Port Already in Use**
- Close other apps using the ports
- Or change ports in config files

**Video Not Available**
- Check if video is deleted/private
- Some content may be region-restricted
- Age-restricted videos may not work

### TikTok Specific

- Try different video if one fails
- Multiple API fallbacks increase success rate
- Some private accounts may not work

### YouTube Specific

- Update ytdl-core if issues persist: `npm install ytdl-core@latest`
- Some videos are copyright-protected
- Live streams not supported

## 💡 Tips & Best Practices

### Quality Selection

**TikTok:**
- Always use "No Watermark" for best quality
- Audio extraction for music content

**YouTube:**
- 1080p for HD displays
- 720p for best balance
- 480p for mobile/slow internet
- Audio-only for music/podcasts

### File Sizes

| Quality | Typical Size (10 min video) |
|---------|---------------------------|
| 1080p | ~500-800 MB |
| 720p | ~300-500 MB |
| 480p | ~150-250 MB |
| 360p | ~80-150 MB |
| Audio | ~10-20 MB |

## 📚 Documentation

- **TikTok Setup**: See `TIKTOK_SETUP.md`
- **YouTube Setup**: See `YOUTUBE_SETUP.md`
- **Quick Start**: See `QUICKSTART.md` and `QUICKSTART_YOUTUBE.md`
- **Server Docs**: See `server/README.md` and `server/README_YOUTUBE.md`

## 🔄 Updates

### Keeping Dependencies Updated

```bash
# Update all dependencies
npm update

# Update specific libraries
npm install ytdl-core@latest
npm install node-fetch@latest
```

### Why Updates Matter

- YouTube frequently changes their API
- TikTok APIs may change
- Security patches
- Bug fixes

## 🚨 Legal Notice

### Important Guidelines

- ✅ Personal use only
- ✅ Respect content creators' rights
- ✅ Don't redistribute without permission
- ✅ Follow platform Terms of Service
- ✅ Respect copyright laws

### Disclaimer

This tool is provided for educational purposes. Users are responsible for:
- Complying with local laws
- Respecting intellectual property
- Following platform guidelines
- Using content ethically

## 🤝 Support

### Getting Help

1. Check documentation files
2. Verify all servers are running
3. Check browser console for errors
4. Try different videos to isolate issues
5. Ensure dependencies are installed

### Common Solutions

- Restart servers
- Clear browser cache
- Update dependencies
- Check internet connection
- Verify URLs are correct

## 🎯 Features Comparison

| Feature | TikTok | YouTube |
|---------|--------|---------|
| No Watermark | ✅ | N/A |
| Multiple Qualities | ❌ | ✅ |
| Audio Extraction | ✅ | ✅ |
| Video Stats | ✅ | ✅ |
| HD Quality | ✅ | ✅ |
| 4K Support | ❌ | ✅ |
| Thumbnail Preview | ✅ | ✅ |
| Duration Display | ✅ | ✅ |

## 🌟 Highlights

### TikTok Downloader
- 🎨 Beautiful gradient UI matching TikTok brand
- 📊 Complete video statistics
- 🎵 Music extraction
- ⚡ Multiple API fallbacks
- 🖼️ Video cover preview

### YouTube Converter
- 🎨 YouTube-themed red gradient
- 📺 Multiple quality options up to 4K
- 🎵 High-quality audio extraction
- ⚡ Fast video info fetching
- 🖼️ HD thumbnail preview

## 🎉 Enjoy!

You now have two powerful video downloaders with beautiful UIs and smooth animations. Happy downloading! 🚀

---

**Made with ❤️ for ToolsGalaxy**
