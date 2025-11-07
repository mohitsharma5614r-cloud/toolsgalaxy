import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.INSTAGRAM_PORT || 3003;

app.use(cors());
app.use(express.json());

// Instagram download endpoint (supports Reels, Posts, Stories, Profile Photos)
app.post('/api/instagram/download', async (req, res) => {
  try {
    const { url, type } = req.body;

    console.log('📥 Received Instagram request:', { url, type });

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate Instagram URL
    const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(reel|p|stories|[^\/]+)\//;
    if (!instagramRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    console.log('✅ Valid Instagram URL, fetching content...');

    // Use multiple API methods for reliability
    let mediaData = null;

    // Method 1: Try RapidAPI Instagram Downloader
    try {
      mediaData = await fetchViaRapidAPI(url, type);
      if (mediaData) {
        console.log('✅ Content fetched via RapidAPI');
        return res.json(mediaData);
      }
    } catch (error) {
      console.log('⚠️ RapidAPI method failed:', error.message);
    }

    // Method 2: Try InstaDownloader API
    try {
      mediaData = await fetchViaInstaDownloader(url, type);
      if (mediaData) {
        console.log('✅ Content fetched via InstaDownloader');
        return res.json(mediaData);
      }
    } catch (error) {
      console.log('⚠️ InstaDownloader method failed:', error.message);
    }

    // Method 3: Try SnapInsta API
    try {
      mediaData = await fetchViaSnapInsta(url, type);
      if (mediaData) {
        console.log('✅ Content fetched via SnapInsta');
        return res.json(mediaData);
      }
    } catch (error) {
      console.log('⚠️ SnapInsta method failed:', error.message);
    }

    // If all methods fail
    return res.status(404).json({ 
      error: 'Content not found or unavailable',
      message: 'Unable to fetch Instagram content. The post may be private or deleted.'
    });

  } catch (error) {
    console.error('❌ Error fetching Instagram content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content',
      message: error.message 
    });
  }
});

// Method 1: Direct Instagram URL parsing (Simple method)
async function fetchViaRapidAPI(url, type) {
  try {
    // Extract shortcode from URL
    const shortcodeMatch = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
    if (!shortcodeMatch) return null;
    
    const shortcode = shortcodeMatch[2];
    
    // Use RapidAPI Instagram Downloader - Different endpoint
    const response = await fetch(`https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'af72d6463emsh2ce473587981c4ap1b79c0jsn576db3c40c4b',
        'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.log('RapidAPI response not OK:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('RapidAPI response:', JSON.stringify(data).substring(0, 300));
    
    if (!data || !data.download_url) {
      console.log('No download URL found in response');
      return null;
    }

    const mediaUrls = [];
    
    // This API returns direct download URLs
    if (data.download_url) {
      mediaUrls.push(data.download_url);
    }
    
    // Check for additional media in carousel
    if (data.media && Array.isArray(data.media)) {
      data.media.forEach(item => {
        if (item.url) {
          mediaUrls.push(item.url);
        }
      });
    }

    if (mediaUrls.length > 0) {
      return {
        success: true,
        type: type || detectContentType(url),
        username: data.username || data.author || 'Unknown',
        caption: data.caption || data.title || '',
        thumbnail: data.thumbnail || data.cover_url || mediaUrls[0],
        mediaUrls: mediaUrls,
        isCarousel: mediaUrls.length > 1
      };
    }
  } catch (error) {
    console.log('Direct method error:', error.message);
  }

  return null;
}

// Method 2: InstaDownloader API
async function fetchViaInstaDownloader(url, type) {
  const response = await fetch('https://instadownloader.co/api/instagram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) return null;

  const data = await response.json();
  
  if (data.success && data.data) {
    const mediaUrls = [];
    
    if (data.data.video_url) {
      mediaUrls.push(data.data.video_url);
    } else if (data.data.image_url) {
      mediaUrls.push(data.data.image_url);
    } else if (data.data.media && Array.isArray(data.data.media)) {
      mediaUrls.push(...data.data.media);
    }

    return {
      success: true,
      type: type || detectContentType(url),
      username: data.data.username || 'Unknown',
      caption: data.data.caption || '',
      thumbnail: data.data.thumbnail || mediaUrls[0],
      mediaUrls: mediaUrls,
      isCarousel: mediaUrls.length > 1
    };
  }

  return null;
}

// Method 3: SnapInsta API
async function fetchViaSnapInsta(url, type) {
  const response = await fetch('https://snapinsta.app/api/ajaxSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      q: url,
      t: 'media',
      lang: 'en'
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  
  if (data.status === 'ok' && data.data) {
    const mediaUrls = [];
    const html = data.data;
    
    // Parse HTML to extract download links
    const videoMatch = html.match(/href="([^"]+)"[^>]*>Download Video<\/a>/i);
    const imageMatch = html.match(/href="([^"]+)"[^>]*>Download Image<\/a>/i);
    
    if (videoMatch) {
      mediaUrls.push(videoMatch[1]);
    } else if (imageMatch) {
      mediaUrls.push(imageMatch[1]);
    }

    if (mediaUrls.length > 0) {
      return {
        success: true,
        type: type || detectContentType(url),
        username: 'Unknown',
        caption: '',
        thumbnail: mediaUrls[0],
        mediaUrls: mediaUrls,
        isCarousel: false
      };
    }
  }

  return null;
}

// Detect content type from URL
function detectContentType(url) {
  if (url.includes('/reel/')) return 'reel';
  if (url.includes('/p/')) return 'post';
  if (url.includes('/stories/')) return 'story';
  if (url.includes('/highlights/')) return 'highlight';
  return 'post';
}

// Instagram profile photo endpoint
app.post('/api/instagram/profile', async (req, res) => {
  try {
    const { username } = req.body;

    console.log('📥 Received profile photo request for:', username);

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    console.log('✅ Fetching profile photo...');

    // Try to fetch profile data
    try {
      const response = await fetch(`https://www.instagram.com/${cleanUsername}/?__a=1&__d=dis`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.graphql?.user || data.user;
        
        if (user && user.profile_pic_url_hd) {
          return res.json({
            success: true,
            username: user.username,
            fullName: user.full_name || '',
            profilePicUrl: user.profile_pic_url_hd,
            profilePicUrlHD: user.profile_pic_url_hd,
            isPrivate: user.is_private || false,
            followers: user.edge_followed_by?.count || 0,
            following: user.edge_follow?.count || 0
          });
        }
      }
    } catch (error) {
      console.log('⚠️ Instagram API method failed:', error.message);
    }

    // Fallback: Generate profile pic URL directly
    const profilePicUrl = `https://www.instagram.com/${cleanUsername}/`;
    
    return res.json({
      success: true,
      username: cleanUsername,
      fullName: '',
      profilePicUrl: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`,
      profilePicUrlHD: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`,
      isPrivate: false,
      followers: 0,
      following: 0,
      note: 'Profile photo URL generated. May require authentication to access.'
    });

  } catch (error) {
    console.error('❌ Error fetching profile photo:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile photo',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Instagram Proxy Server is running' });
});

app.listen(PORT, () => {
  console.log(`📸 Instagram Proxy Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/instagram/download`);
  console.log(`   - POST http://localhost:${PORT}/api/instagram/profile`);
});
