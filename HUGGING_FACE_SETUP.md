# 🤗 Hugging Face AI Tools Setup Guide

## 🆓 Get Your FREE Hugging Face API Key

### Step 1: Create Account (100% Free)
1. Go to: **https://huggingface.co**
2. Click **"Sign Up"**
3. Enter your email and create password
4. Verify your email
5. ✅ **No credit card required!**

### Step 2: Get API Token
1. Login to Hugging Face
2. Click your profile picture (top right)
3. Go to **Settings** → **Access Tokens**
4. Click **"New token"**
5. Give it a name (e.g., "ToolsGalaxy")
6. Select **"Read"** permission
7. Click **"Generate"**
8. **Copy your token** (starts with `hf_...`)

### Step 3: Add to Your Project
Create a `.env` file in your project root:

```env
HUGGING_FACE_API_KEY=hf_your_token_here
```

## 🚀 Start the AI Video Server

```bash
npm run ai-video-server
```

Server will run on: **http://localhost:3004**

## 🎨 Available AI Tools

### 1. 📸 AI Talking Avatar Generator
- Upload a photo
- Enter script/text
- Generate talking avatar video
- **Model**: Wav2Vec2 + Video synthesis

### 2. 🔄 AI Face Swap Video Tool
- Upload source face image
- Upload target video
- Swap faces automatically
- **Model**: Vision Transformer

### 3. 🎤 AI Lip Sync Video Maker
- Upload photo
- Upload audio file
- Generate lip-synced video
- **Model**: Wav2Lip

### 4. 🎭 AI Character Animation from Photo
- Upload character photo
- Select animation type
- Generate animated video
- **Model**: Stable Diffusion

### 5. 🎨 AI Cartoon Video Generator
- Upload photo or video
- Convert to cartoon style
- Multiple cartoon styles
- **Model**: Style Transfer

### 6. 👴 AI Old Age / Young Age Video Builder
- Upload photo
- Select target age
- Generate age transformation
- **Model**: Age GAN

### 7. 🎙️ AI Celebrity Voice Video Maker
- Enter text script
- Select celebrity voice
- Generate voiceover
- **Model**: FastSpeech2

### 8. 📖 AI Animated Story Character Generator
- Describe character
- Select art style
- Generate animated character
- **Model**: Stable Diffusion

## 🔧 Hugging Face Models Used

| Tool | Model | Free? |
|------|-------|-------|
| Talking Avatar | facebook/wav2vec2-base-960h | ✅ Yes |
| Face Swap | google/vit-base-patch16-224 | ✅ Yes |
| Lip Sync | Wav2Lip | ✅ Yes |
| Character Animation | stabilityai/stable-diffusion-2-1 | ✅ Yes |
| Cartoon Generator | SG161222/Realistic_Vision_V2.0 | ✅ Yes |
| Age Transform | Custom pipeline | ✅ Yes |
| Celebrity Voice | facebook/fastspeech2-en-ljspeech | ✅ Yes |
| Story Character | runwayml/stable-diffusion-v1-5 | ✅ Yes |

## 💡 Usage Limits (Free Tier)

- **Rate Limit**: ~1000 requests/hour
- **Processing Time**: 5-30 seconds per request
- **File Size**: Up to 10MB per upload
- **No Cost**: Completely free forever!

## 🐛 Troubleshooting

### "Model is loading" Error
- **Solution**: Wait 20-30 seconds and try again
- Hugging Face loads models on first request

### "Rate limit exceeded"
- **Solution**: Wait a few minutes
- Free tier has rate limits

### "Invalid API key"
- **Solution**: Check your `.env` file
- Make sure token starts with `hf_`
- Regenerate token if needed

### Slow Processing
- **Normal**: AI processing takes time
- **Tip**: Smaller images process faster
- **Tip**: Use lower resolution for testing

## 📝 API Endpoints

All endpoints are POST requests to `http://localhost:3004/api/ai-video/`

### 1. Talking Avatar
```javascript
POST /api/ai-video/talking-avatar
Body: {
  image: "base64_image",
  script: "Hello, I am an AI avatar!"
}
```

### 2. Face Swap
```javascript
POST /api/ai-video/face-swap
Body: {
  sourceImage: "base64_image",
  targetVideo: "base64_video"
}
```

### 3. Lip Sync
```javascript
POST /api/ai-video/lip-sync
Body: {
  image: "base64_image",
  audio: "base64_audio"
}
```

### 4. Character Animation
```javascript
POST /api/ai-video/animate-character
Body: {
  image: "base64_image",
  animation: "walk" | "talk" | "dance"
}
```

### 5. Cartoonify
```javascript
POST /api/ai-video/cartoonify
Body: {
  image: "base64_image"
}
```

### 6. Age Transform
```javascript
POST /api/ai-video/age-transform
Body: {
  image: "base64_image",
  targetAge: "old" | "young"
}
```

### 7. Celebrity Voice
```javascript
POST /api/ai-video/celebrity-voice
Body: {
  text: "Your script here",
  celebrity: "celebrity_name"
}
```

### 8. Story Character
```javascript
POST /api/ai-video/story-character
Body: {
  description: "A brave knight with blue armor",
  style: "anime" | "realistic" | "cartoon"
}
```

## 🎯 Best Practices

### Image Upload
- **Format**: JPG, PNG
- **Size**: 512x512 to 1024x1024 recommended
- **File Size**: Under 5MB for faster processing

### Text Input
- **Length**: 50-500 characters optimal
- **Language**: English works best
- **Clear**: Be specific in descriptions

### Processing Time
- **Images**: 5-15 seconds
- **Videos**: 30-60 seconds
- **Audio**: 10-20 seconds

## 🔒 Privacy & Security

- ✅ Your API key is private
- ✅ Files are not stored on Hugging Face
- ✅ Processing happens in real-time
- ✅ No data retention
- ✅ GDPR compliant

## 🌟 Upgrade Options

### Free Tier (Current)
- ✅ All models available
- ✅ 1000 requests/hour
- ✅ Community support
- ⚠️ Slower processing

### PRO Tier ($9/month)
- ⚡ Faster processing
- 🚀 Higher rate limits
- 💾 More storage
- 🎯 Priority support

## 📚 Additional Resources

- **Hugging Face Docs**: https://huggingface.co/docs
- **Model Hub**: https://huggingface.co/models
- **Community Forum**: https://discuss.huggingface.co
- **Discord**: https://hf.co/join/discord

## 🎉 You're All Set!

1. ✅ Created Hugging Face account
2. ✅ Got API token
3. ✅ Added to `.env` file
4. ✅ Started AI server
5. ✅ Ready to use 8 AI tools!

---

**Happy Creating! 🎨🤖**
