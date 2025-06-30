"""
FastAPI backend for YouTube audio streaming
Single endpoint: /get-audio?query=
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import yt_dlp
import logging
import uvicorn
from typing import Optional
import asyncio
import functools
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RadhaAPI YouTube Audio Streaming",
    description="FastAPI backend for fetching YouTube audio streams for Telegram bots",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class YouTubeAudioExtractor:
    def __init__(self):
        # yt-dlp configuration optimized for audio extraction without downloading
        self.ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best',
            'noplaylist': True,
            'no_warnings': True,
            'quiet': True,
            'extractaudio': False,  # Don't download, just extract info
            'no_download': True,  # Important: don't download the video
            'extract_flat': False,
            'youtube_include_dash_manifest': True,  # Include DASH for better audio
            'youtube_skip_dash_manifest': False,
            'socket_timeout': 30,
            'retries': 3,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
    
    async def search_and_extract(self, query: str) -> dict:
        """Search YouTube and extract audio stream info from top result"""
        try:
            # Search for videos using yt-dlp
            search_opts = self.ydl_opts.copy()
            search_opts.update({
                'quiet': True,
                'no_warnings': True,
                'default_search': 'ytsearch1:'  # Search and get top result
            })
            
            # Run yt-dlp in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, 
                functools.partial(self._extract_info, f"ytsearch1:{query}", search_opts)
            )
            
            if not result:
                raise HTTPException(status_code=404, detail="No results found for the given query")
            
            # Extract video info from search results
            if 'entries' in result and len(result['entries']) > 0:
                video_info = result['entries'][0]
            else:
                video_info = result
            
            if not video_info:
                raise HTTPException(status_code=404, detail="No video found for the given query")
            
            # Extract the information we need
            response_data = self._format_response(video_info)
            return response_data
            
        except Exception as e:
            logger.error(f"Error extracting audio info: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Error extracting audio: {str(e)}")
    
    def _extract_info(self, url: str, opts: dict) -> dict:
        """Extract info using yt-dlp (runs in thread)"""
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                return ydl.extract_info(url, download=False)
        except Exception as e:
            logger.error(f"yt-dlp extraction error: {str(e)}")
            raise e
    
    def _format_response(self, video_info: dict) -> dict:
        """Format the response data"""
        try:
            # Get the best audio stream URL
            audio_url = None
            
            # Look for audio formats
            if 'formats' in video_info:
                # Filter for audio-only formats or formats with audio
                audio_formats = []
                for f in video_info['formats']:
                    url = f.get('url')
                    acodec = f.get('acodec', 'none')
                    vcodec = f.get('vcodec', 'none')
                    
                    # Skip if no URL or no audio
                    if not url or acodec == 'none':
                        continue
                    
                    # Accept any format with audio
                    audio_formats.append(f)
                
                if audio_formats:
                    # Sort by preference: 
                    # 1. Audio-only formats (vcodec='none') 
                    # 2. Higher audio bitrate
                    # 3. Prefer m4a and webm over mp4
                    def sort_key(f):
                        vcodec = f.get('vcodec', 'none')
                        abr = f.get('abr', 0) or 0
                        ext = f.get('ext', '')
                        
                        # Prefer audio-only
                        is_audio_only = 1000 if vcodec == 'none' else 0
                        
                        # Prefer certain extensions
                        ext_bonus = 0
                        if ext in ['m4a', 'webm']:
                            ext_bonus = 100
                        elif ext == 'mp4':
                            ext_bonus = 50
                        
                        return is_audio_only + ext_bonus + abr
                    
                    audio_formats.sort(key=sort_key, reverse=True)
                    best_format = audio_formats[0]
                    audio_url = best_format.get('url')
            
            # Fallback to the main URL if no specific audio format found
            if not audio_url:
                audio_url = video_info.get('url')
            
            if not audio_url:
                raise HTTPException(status_code=500, detail="Could not extract audio stream URL")
            
            # Get thumbnail (prefer higher quality)
            thumbnail = None
            if 'thumbnails' in video_info and video_info['thumbnails']:
                # Get the best quality thumbnail
                thumbnails = video_info['thumbnails']
                # Sort by resolution/quality
                thumbnails.sort(key=lambda x: (x.get('width', 0) * x.get('height', 0)), reverse=True)
                thumbnail = thumbnails[0].get('url')
            
            # Get duration in seconds
            duration = video_info.get('duration', 0)
            if duration is None:
                duration = 0
            
            return {
                "title": video_info.get('title', 'Unknown Title'),
                "duration": int(duration),
                "audio_url": audio_url,
                "thumbnail": thumbnail or ""
            }
            
        except Exception as e:
            logger.error(f"Error formatting response: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error formatting response: {str(e)}")

# Initialize the extractor
extractor = YouTubeAudioExtractor()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "RadhaAPI YouTube Audio Streaming Backend",
        "version": "1.0.0",
        "endpoints": {
            "get_audio": "/get-audio?query=your_search_query",
            "health": "/health"
        },
        "status": "active"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "radhaapi-youtube-audio"}

@app.get("/get-audio")
async def get_audio(query: str = Query(..., min_length=1, description="YouTube search query")):
    """
    Get YouTube audio stream information
    
    Args:
        query: YouTube search query string
        
    Returns:
        JSON response with title, duration, audio_url, and thumbnail
    """
    try:
        if not query or query.strip() == "":
            raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
        # Clean the query
        query = query.strip()
        
        logger.info(f"Processing audio request for query: {query}")
        
        # Extract audio information
        result = await extractor.search_and_extract(query)
        
        logger.info(f"Successfully extracted audio info for: {result.get('title', 'Unknown')}")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "data": result
            }
        )
        
    except HTTPException as e:
        logger.error(f"HTTP error for query '{query}': {e.detail}")
        return JSONResponse(
            status_code=e.status_code,
            content={
                "success": False,
                "error": e.detail,
                "query": query
            }
        )
    except Exception as e:
        logger.error(f"Unexpected error for query '{query}': {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error occurred while processing the request",
                "query": query
            }
        )

if __name__ == "__main__":
    # For local development
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
