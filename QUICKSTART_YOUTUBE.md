# 🚀 Quick Start - YouTube to MP4 Converter

## Installation (One-time setup)

```bash
npm install
```

## Running the App

### Option 1: Automatic - All Servers (Windows)
Double-click `start-all-servers.bat` - Opens all servers (TikTok + YouTube + Frontend)!

### Option 2: YouTube Only (Manual)

**Terminal 1 - YouTube Server:**
```bash
npm run youtube-server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Usage

1. Open http://localhost:3000
2. Navigate to YouTube to MP4 Converter tool
3. Paste a YouTube video URL
4. Click "Get Video"
5. Choose your preferred option:
   - **1080p HD** ⭐ Best quality
   - **720p HD** - High quality
   - **480p** - Standard quality
   - **360p** - Lower quality
   - **MP3 Audio** 🎵 Audio only

## Example YouTube URLs

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

## Features

✨ **Multiple Quality Options** - Choose from 4K to 360p  
🎵 **Audio Extraction** - Save as MP3  
📊 **Video Info** - See title, views, likes, duration  
🎨 **Beautiful UI** - YouTube-themed red gradients  
📱 **Mobile Friendly** - Works on all devices  
⚡ **Fast Downloads** - Direct streaming from server  

## Quality Guide

| Quality | Resolution | Best For | File Size |
|---------|-----------|----------|-----------|
| 1080p | 1920x1080 | HD displays, TV | Large |
| 720p | 1280x720 | Most devices | Medium |
| 480p | 854x480 | Mobile, slow internet | Small |
| 360p | 640x360 | Very slow internet | Smallest |
| MP3 | Audio only | Music, podcasts | Very small |

## Troubleshooting

**Can't download?**
- Make sure BOTH servers are running (frontend + YouTube server)
- Check that the YouTube URL is valid
- Try a different video

**Port already in use?**
- Close other apps using port 3000 or 3002
- Or change the port in the config files

**Video not available?**
- Some videos are region-restricted
- Age-restricted videos may not work
- Private/deleted videos cannot be downloaded

## Tips

💡 Use 720p for best balance of quality and file size  
💡 Audio-only perfect for music videos  
💡 Check video duration before downloading long videos  
💡 Downloads open in new tab - allow pop-ups  

---

That's it! Happy downloading! 🎥
