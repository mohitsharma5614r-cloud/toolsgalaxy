# YouTube Playlist Downloader - Setup Guide

## 🚀 Features

- ✅ Download entire YouTube playlists with one click
- ✅ Select specific videos or download all
- ✅ Beautiful grid view with thumbnails
- ✅ Video duration and numbering
- ✅ Batch download support
- ✅ Individual video download option
- ✅ Playlist information display
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- YouTube server running on port 3002
- `@distube/ytdl-core` package installed

## 🛠️ Installation

Dependencies are already installed if you've set up the YouTube converter. If not:

```bash
npm install
```

## 🚀 Running the Application

Make sure the YouTube server is running:

```bash
npm run youtube-server
```

And the frontend:

```bash
npm run dev
```

## 📖 How to Use

### 1. Copy Playlist URL

Go to YouTube and open any playlist. Copy the URL from your browser. It should look like:
```
https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
```

### 2. Paste and Get Playlist

- Paste the URL in the input field
- Click "Get Playlist" button
- Wait for the playlist to load

### 3. Select Videos

- All videos are selected by default
- Uncheck videos you don't want
- Or use "Select All" / "Deselect All" buttons

### 4. Download

**Option A: Batch Download**
- Click "Download Selected (X)" button
- All selected videos will download one by one

**Option B: Individual Download**
- Hover over any video thumbnail
- Click the download icon
- That specific video will download

## 🎨 UI Features

- **Playlist Header** - Shows playlist title, author, and video count
- **Video Grid** - Beautiful 3-column grid layout
- **Thumbnails** - High-quality video thumbnails
- **Video Numbers** - Each video shows its position in playlist
- **Duration Display** - Shows video length
- **Checkboxes** - Easy selection/deselection
- **Hover Effects** - Download button appears on hover
- **Progress Indicators** - Visual feedback during loading
- **Responsive Design** - Works on all screen sizes

## 🔧 Technical Details

### API Endpoint

**POST** `/api/youtube/playlist`

Request:
```json
{
  "url": "https://www.youtube.com/playlist?list=PLAYLIST_ID"
}
```

Response:
```json
{
  "success": true,
  "playlistId": "PLAYLIST_ID",
  "title": "Playlist Title",
  "author": "Channel Name",
  "thumbnail": "https://...",
  "videoCount": 25,
  "videos": [
    {
      "videoId": "VIDEO_ID",
      "title": "Video Title",
      "thumbnail": "https://...",
      "duration": 300,
      "author": "Channel Name"
    }
  ]
}
```

### Limitations

- Maximum 50 videos per playlist (to prevent overload)
- Private playlists cannot be accessed
- Some videos may be unavailable due to restrictions
- Downloads open in new tabs (browser may block pop-ups)

## 💡 Tips

- **Enable pop-ups** - Browser may block multiple downloads
- **Download in batches** - For large playlists, download in smaller batches
- **Check video availability** - Some videos may be region-restricted
- **Stable internet** - Required for fetching playlist info

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure YouTube server is running: `npm run youtube-server`
- Check port 3002 is not being used by another app

### "Invalid YouTube playlist URL"
- URL must contain `list=` parameter
- Example: `https://www.youtube.com/playlist?list=PLxxx`
- Watch page URLs with playlist work too

### "Failed to fetch playlist"
- Check if playlist is public
- Try a different playlist
- Restart the YouTube server

### Downloads not starting
- Check browser pop-up settings
- Allow pop-ups for localhost
- Try downloading one video at a time

### Some videos missing
- Videos may be private or deleted
- Region-restricted content won't appear
- Age-restricted videos may not work

## 🌐 Example Playlists to Try

```
# Music Playlist
https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf

# Educational Playlist
https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr

# Tech Tutorials
https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB
```

## 🎯 Features Comparison

| Feature | Single Video | Playlist |
|---------|-------------|----------|
| Multiple Quality Options | ✅ | ❌ |
| Batch Download | ❌ | ✅ |
| Select Videos | ❌ | ✅ |
| Video Preview | ✅ | ✅ |
| Stats Display | ✅ | ✅ |
| Audio Extraction | ✅ | ❌ |

## 📝 Notes

- Playlist downloader uses the same backend as single video converter
- Videos are downloaded in highest available quality
- Downloads happen sequentially with 1-second delay
- Browser may limit simultaneous downloads
- Large playlists may take time to process

## 🔒 Privacy & Legal

- For personal use only
- Respect content creators' rights
- Don't redistribute downloaded content
- YouTube's Terms of Service apply
- Some content may be copyrighted

## 🚀 Performance

- Playlist info fetching: ~3-10 seconds (depends on size)
- Download speed: Depends on video size and internet
- Memory usage: Minimal (streaming, not buffering)
- Concurrent downloads: Limited by browser

## 💻 Browser Compatibility

- ✅ Chrome/Edge - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ⚠️ Pop-up blockers may interfere

---

**Enjoy downloading YouTube playlists! 📺**
