import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.YOUTUBE_PORT || 3002;

app.use(cors());
app.use(express.json());

// YouTube video info endpoint
app.post('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.body;

    console.log('📥 Received request for URL:', url);

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      console.log('❌ Invalid YouTube URL:', url);
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log('✅ Valid YouTube URL, fetching info...');

    // Get video info with options
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    });
    const videoDetails = info.videoDetails;
    
    console.log('✅ Video info fetched:', videoDetails.title);

    // Get available formats
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    
    // Sort formats by quality
    const sortedFormats = formats
      .filter(f => f.hasVideo && f.hasAudio)
      .sort((a, b) => {
        const qualityOrder = { '2160p': 5, '1440p': 4, '1080p': 3, '720p': 2, '480p': 1, '360p': 0 };
        const aQuality = qualityOrder[a.qualityLabel] || 0;
        const bQuality = qualityOrder[b.qualityLabel] || 0;
        return bQuality - aQuality;
      });

    // Get unique quality options
    const qualityOptions = [];
    const seenQualities = new Set();
    
    for (const format of sortedFormats) {
      if (format.qualityLabel && !seenQualities.has(format.qualityLabel)) {
        seenQualities.add(format.qualityLabel);
        qualityOptions.push({
          quality: format.qualityLabel,
          itag: format.itag,
          container: format.container,
          filesize: format.contentLength,
          fps: format.fps,
          bitrate: format.bitrate
        });
      }
    }

    // Also get audio-only formats
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
      .filter(f => f.audioBitrate)
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

    const audioOptions = audioFormats.slice(0, 3).map(f => ({
      quality: `${f.audioBitrate}kbps`,
      itag: f.itag,
      container: f.container,
      filesize: f.contentLength
    }));

    res.json({
      success: true,
      videoId: videoDetails.videoId,
      title: videoDetails.title,
      author: videoDetails.author.name,
      channelUrl: videoDetails.author.channel_url,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      duration: parseInt(videoDetails.lengthSeconds),
      views: parseInt(videoDetails.viewCount),
      likes: videoDetails.likes,
      description: videoDetails.description,
      uploadDate: videoDetails.uploadDate,
      qualityOptions,
      audioOptions
    });
  } catch (error) {
    console.error('❌ Error fetching YouTube video info:', error.message);
    console.error('Full error:', error);
    
    let errorMessage = 'Failed to fetch video information';
    
    if (error.message.includes('Status code: 410')) {
      errorMessage = 'This video is no longer available';
    } else if (error.message.includes('private video')) {
      errorMessage = 'This video is private';
    } else if (error.message.includes('age')) {
      errorMessage = 'Age-restricted videos are not supported';
    } else if (error.message.includes('unavailable')) {
      errorMessage = 'Video is unavailable in your region';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      message: error.message,
      details: 'Try updating ytdl-core: npm install ytdl-core@latest'
    });
  }
});

// YouTube playlist info endpoint
app.post('/api/youtube/playlist', async (req, res) => {
  try {
    const { url } = req.body;

    console.log('📥 Received playlist request for URL:', url);

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate YouTube playlist URL
    if (!url.includes('list=')) {
      console.log('❌ Invalid YouTube playlist URL:', url);
      return res.status(400).json({ error: 'Invalid YouTube playlist URL. Must contain "list=" parameter.' });
    }

    console.log('✅ Valid YouTube playlist URL, fetching info...');

    // Extract playlist ID
    const playlistId = url.match(/[?&]list=([^&]+)/)?.[1];
    if (!playlistId) {
      return res.status(400).json({ error: 'Could not extract playlist ID from URL' });
    }

    // Get playlist info using ytdl
    const playlistURL = `https://www.youtube.com/playlist?list=${playlistId}`;
    const playlistInfo = await ytdl.getPlaylistInfo(playlistURL);
    
    console.log('✅ Playlist info fetched:', playlistInfo.title);

    // Get video details
    const videos = [];
    for (const item of playlistInfo.items.slice(0, 50)) { // Limit to 50 videos
      try {
        videos.push({
          videoId: item.id,
          title: item.title,
          thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          duration: item.duration || 0,
          author: item.author || playlistInfo.author
        });
      } catch (err) {
        console.log(`⚠️ Skipping video ${item.id}:`, err.message);
      }
    }

    res.json({
      success: true,
      playlistId: playlistId,
      title: playlistInfo.title,
      author: playlistInfo.author,
      thumbnail: playlistInfo.thumbnail || videos[0]?.thumbnail || '',
      videoCount: videos.length,
      videos: videos
    });

  } catch (error) {
    console.error('❌ Error fetching YouTube playlist:', error.message);
    console.error('Full error:', error);
    
    let errorMessage = 'Failed to fetch playlist information';
    
    if (error.message.includes('private')) {
      errorMessage = 'This playlist is private';
    } else if (error.message.includes('unavailable')) {
      errorMessage = 'Playlist is unavailable';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      message: error.message
    });
  }
});

// YouTube thumbnail endpoint
app.post('/api/youtube/thumbnail', async (req, res) => {
  try {
    const { videoId } = req.body;

    console.log('📥 Received thumbnail request for Video ID:', videoId);

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // Validate video ID format (11 characters)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return res.status(400).json({ error: 'Invalid YouTube Video ID format' });
    }

    console.log('✅ Valid Video ID, fetching info...');

    // Get video info
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    const videoDetails = info.videoDetails;

    console.log('✅ Video info fetched:', videoDetails.title);

    // Get all thumbnail URLs
    const thumbnails = {
      maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      default: `https://i.ytimg.com/vi/${videoId}/default.jpg`
    };

    res.json({
      success: true,
      videoId: videoId,
      title: videoDetails.title,
      author: videoDetails.author.name,
      thumbnails: thumbnails
    });

  } catch (error) {
    console.error('❌ Error fetching thumbnail:', error.message);
    
    let errorMessage = 'Failed to fetch thumbnail information';
    
    if (error.message.includes('Video unavailable')) {
      errorMessage = 'Video not found or unavailable';
    } else if (error.message.includes('private')) {
      errorMessage = 'This video is private';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      message: error.message
    });
  }
});

// YouTube video download endpoint
app.get('/api/youtube/download', async (req, res) => {
  try {
    const { url, quality } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${videoDetails.title.replace(/[^a-z0-9]/gi, '_')}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Download options
    const downloadOptions = quality 
      ? { quality: quality }
      : { quality: 'highest' };

    // Stream the video
    ytdl(url, downloadOptions).pipe(res);

  } catch (error) {
    console.error('Error downloading YouTube video:', error);
    res.status(500).json({ 
      error: 'Failed to download video',
      message: error.message 
    });
  }
});

// YouTube audio download endpoint
app.get('/api/youtube/download-audio', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${videoDetails.title.replace(/[^a-z0-9]/gi, '_')}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // Stream the audio
    ytdl(url, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    }).pipe(res);

  } catch (error) {
    console.error('Error downloading YouTube audio:', error);
    res.status(500).json({ 
      error: 'Failed to download audio',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouTube Proxy Server is running' });
});

app.listen(PORT, () => {
  console.log(`🎥 YouTube Proxy Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/youtube/info`);
  console.log(`   - GET  http://localhost:${PORT}/api/youtube/download`);
  console.log(`   - GET  http://localhost:${PORT}/api/youtube/download-audio`);
});
