# FastAPI YouTube Audio Streaming Backend

A lightweight FastAPI backend that provides a single endpoint for fetching YouTube audio streams. Optimized for Telegram bot integration.

## Features

- **Single Endpoint**: `/get-audio?query=` - Search and get audio stream info
- **No Downloads**: Uses yt-dlp to extract stream URLs without downloading videos
- **Fast Response**: Optimized for quick audio stream URL extraction
- **Telegram Bot Ready**: Perfect for music streaming bots
- **Error Handling**: Comprehensive error responses
- **CORS Enabled**: Ready for web applications

## API Endpoint

### GET /get-audio

**Parameters:**
- `query` (string, required): YouTube search query

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Song Title",
    "duration": 180,
    "audio_url": "https://direct.audio.stream.url",
    "thumbnail": "https://thumbnail.url"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "query": "your search query"
}
```

## Installation & Setup

### Local Development

1. **Install Python 3.11+**

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the server:**
```bash
# Development server
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

4. **Test the API:**
```bash
# Test with Python script
python test_api.py

# Or test with curl
curl "http://localhost:8000/get-audio?query=shape%20of%20you"
```

### Production Deployment

#### Option 1: Heroku
```bash
# Using the existing Procfile
git add .
git commit -m "Deploy FastAPI backend"
git push heroku main
```

#### Option 2: Render.com
```bash
# The app will use gunicorn automatically via Procfile
# Set environment: Python
# Build command: pip install -r requirements.txt
# Start command: gunicorn main:app -c gunicorn.conf.py
```

#### Option 3: Railway/DigitalOcean
```bash
# Similar to Render, uses Procfile automatically
pip install -r requirements.txt
gunicorn main:app -c gunicorn.conf.py
```

## Environment Variables

The app works without any environment variables, but you can configure:

- `PORT`: Server port (default: 8000)
- `WORKERS`: Number of worker processes (default: 4)

## Example Usage with Telegram Bot

### Python (Pyrogram)
```python
import requests
from pyrogram import Client, filters

@app.on_message(filters.command("play"))
async def play_song(client, message):
    query = " ".join(message.command[1:])
    
    response = requests.get(f"https://yourdomain.com/get-audio?query={query}")
    
    if response.status_code == 200:
        data = response.json()
        if data["success"]:
            audio_info = data["data"]
            await message.reply(f"🎵 Now playing: {audio_info['title']}")
            # Use audio_info['audio_url'] with PyTgCalls
        else:
            await message.reply(f"❌ Error: {data['error']}")
```

### Node.js
```javascript
const axios = require('axios');

async function getAudio(query) {
    try {
        const response = await axios.get(`https://yourdomain.com/get-audio?query=${encodeURIComponent(query)}`);
        
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error('Error fetching audio:', error.message);
        return null;
    }
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/` | GET | API information and status |
| `/health` | GET | Health check endpoint |
| `/get-audio` | GET | Get YouTube audio stream info |

## Response Times

- **Typical response time**: 2-5 seconds
- **Optimized for**: Real-time bot usage
- **Timeout**: 30 seconds maximum

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (empty query)
- `404`: No results found
- `500`: Server error

## Limitations

- No rate limiting (implement if needed)
- No authentication (add if required)
- No caching (Redis can be added)
- No download functionality (by design)

## Migration from Node.js

This FastAPI backend replaces your existing Node.js backend entirely. The main differences:

1. **Single Purpose**: Only YouTube audio streaming
2. **No Database**: No MongoDB dependency
3. **No Authentication**: Simplified for bot usage
4. **Better Performance**: Async Python with efficient yt-dlp

## Testing

Run the test script to verify everything works:

```bash
# Test locally
python test_api.py

# Test production
python test_api.py https://yourdomain.com "test song"
```

## Monitoring

Check the logs for:
- Request processing times
- yt-dlp extraction success/failures
- Error rates and types

## Scaling

For high traffic:
1. Increase worker count in `gunicorn.conf.py`
2. Add Redis caching for repeated queries
3. Implement rate limiting
4. Use CDN for static responses

---

**Ready for production deployment to replace your Node.js backend!**
