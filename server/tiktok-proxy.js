import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// TikTok video info endpoint
app.post('/api/tiktok/download', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate TikTok URL
    const tiktokRegex = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/@?[\w.-]+\/video\/(\d+)|(?:https?:\/\/)?vm\.tiktok\.com\/([A-Za-z0-9]+)/;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    // Use TikTok API (multiple fallback options)
    const videoData = await fetchTikTokVideo(url);

    if (!videoData) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }

    res.json(videoData);
  } catch (error) {
    console.error('Error fetching TikTok video:', error);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

// Fetch TikTok video using multiple methods
async function fetchTikTokVideo(url) {
  // Method 1: Try TikTok API via RapidAPI (you'll need to add your API key)
  try {
    const response = await fetch('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE',
        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      },
      body: new URLSearchParams({
        url: url,
        hd: '1'
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        return {
          success: true,
          videoUrl: data.data.play,
          videoUrlNoWatermark: data.data.wmplay,
          musicUrl: data.data.music,
          coverUrl: data.data.cover,
          title: data.data.title || 'TikTok Video',
          author: data.data.author?.nickname || 'Unknown',
          duration: data.data.duration,
          stats: {
            likes: data.data.digg_count,
            comments: data.data.comment_count,
            shares: data.data.share_count,
            plays: data.data.play_count
          }
        };
      }
    }
  } catch (error) {
    console.error('RapidAPI method failed:', error);
  }

  // Method 2: Try alternative API (TikWM)
  try {
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        url: url,
        hd: '1'
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.code === 0 && data.data) {
        return {
          success: true,
          videoUrl: data.data.play,
          videoUrlNoWatermark: data.data.hdplay || data.data.play,
          musicUrl: data.data.music,
          coverUrl: data.data.cover,
          title: data.data.title || 'TikTok Video',
          author: data.data.author?.nickname || data.data.author?.unique_id || 'Unknown',
          duration: data.data.duration,
          stats: {
            likes: data.data.digg_count,
            comments: data.data.comment_count,
            shares: data.data.share_count,
            plays: data.data.play_count
          }
        };
      }
    }
  } catch (error) {
    console.error('TikWM method failed:', error);
  }

  // Method 3: Try SnapTik API
  try {
    const response = await fetch(`https://snaptik.app/abc2.php?url=${encodeURIComponent(url)}&lang=en`);
    
    if (response.ok) {
      const html = await response.text();
      
      // Parse the HTML to extract download links
      const videoMatch = html.match(/href="([^"]+)"[^>]*>Download Video<\/a>/i);
      const musicMatch = html.match(/href="([^"]+)"[^>]*>Download Audio<\/a>/i);
      
      if (videoMatch) {
        return {
          success: true,
          videoUrl: videoMatch[1],
          videoUrlNoWatermark: videoMatch[1],
          musicUrl: musicMatch ? musicMatch[1] : null,
          title: 'TikTok Video',
          author: 'Unknown'
        };
      }
    }
  } catch (error) {
    console.error('SnapTik method failed:', error);
  }

  return null;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TikTok Proxy Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 TikTok Proxy Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/tiktok/download`);
});
