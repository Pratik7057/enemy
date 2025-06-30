const ytdl = require('ytdl-core');
const YoutubeApiLog = require('../models/YoutubeApiLog');
const { validateYoutubeQuery, formatError } = require('../utils/helpers');

// Search YouTube and get audio stream
exports.getYoutubeStream = async (req, res) => {
  try {
    const { q } = req.query;
    const user = req.user; // From middleware
    
    // Validate query
    if (!q) {
      return res.status(400).json(formatError('Search query is required', 400));
    }
    
    // Check if API key is blocked
    if (user.apiKeyStatus === 'blocked') {
      return res.status(403).json(formatError('API Key is blocked by admin.', 403));
    }
    
    const query = decodeURIComponent(q);
    
    // Log API request
    const apiLog = new YoutubeApiLog({
      user: user._id,
      apiKey: user.apiKey,
      query,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });
    
    // Increment API key usage count
    user.apiKeyUsageCount += 1;
    await user.save();
    
    try {
      // For demo, let's search for the video on YouTube and get first result
      // In a real implementation, you'd integrate with YouTube Data API
      // and get search results, then pick the first video ID
      
      // For simplicity, we'll simulate a search and use the query as direct YouTube URL or ID
      let videoId;
      
      if (ytdl.validateID(query)) {
        videoId = query;
      } else if (ytdl.validateURL(query)) {
        videoId = ytdl.getVideoID(query);
      } else {
        // This is oversimplified - in a real app, you'd use YouTube Data API to search
        return res.status(400).json(formatError('Invalid YouTube query. Please provide a valid YouTube URL or ID', 400));
      }
      
      // Get video info
      const info = await ytdl.getInfo(videoId);
      const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
      
      if (!format) {
        apiLog.status = 'failed';
        apiLog.errorMessage = 'No audio format available';
        await apiLog.save();
        return res.status(404).json(formatError('No audio stream available for this video', 404));
      }
      
      // For demo purposes, we'll just return the audio URL
      // In a real implementation, you'd proxy the stream
      
      apiLog.status = 'success';
      await apiLog.save();
      
      // For a Telegram bot integration, we can return the direct audio URL
      // to be played by the bot, or we can stream it through our server
      res.status(200).json({
        success: true,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        audio_url: format.url
      });
      
    } catch (error) {
      apiLog.status = 'failed';
      apiLog.errorMessage = error.message;
      await apiLog.save();
      
      console.error('YouTube API Error:', error);
      res.status(500).json(formatError('Error fetching YouTube content: ' + error.message, 500));
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Stream YouTube audio directly (alternative implementation)
exports.streamYoutubeAudio = async (req, res) => {
  try {
    const { q } = req.query;
    const user = req.user;
    
    // Validate query
    if (!q) {
      return res.status(400).json(formatError('Search query is required', 400));
    }
    
    const query = decodeURIComponent(q);
    
    // Log API request
    const apiLog = new YoutubeApiLog({
      user: user._id,
      apiKey: user.apiKey,
      query,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });
    
    try {
      // Same validation as previous function
      let videoId;
      
      if (ytdl.validateID(query)) {
        videoId = query;
      } else if (ytdl.validateURL(query)) {
        videoId = ytdl.getVideoID(query);
      } else {
        // This is oversimplified - in a real app, you'd use YouTube Data API to search
        return res.status(400).json(formatError('Invalid YouTube query. Please provide a valid YouTube URL or ID', 400));
      }
      
      // Set proper headers for streaming audio
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Transfer-Encoding', 'chunked');
      
      // Create a readable stream from YouTube and pipe it to response
      const stream = ytdl(videoId, { 
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      // Handle stream events
      stream.on('info', (info) => {
        res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
      });
      
      stream.on('error', async (err) => {
        console.error('Stream error:', err);
        apiLog.status = 'failed';
        apiLog.errorMessage = err.message;
        await apiLog.save();
      });
      
      stream.on('end', async () => {
        apiLog.status = 'success';
        await apiLog.save();
      });
      
      // Pipe the stream to response
      stream.pipe(res);
      
    } catch (error) {
      apiLog.status = 'failed';
      apiLog.errorMessage = error.message;
      await apiLog.save();
      
      console.error('YouTube API Error:', error);
      res.status(500).json(formatError('Error streaming YouTube content: ' + error.message, 500));
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get user's API usage logs
exports.getApiUsageLogs = async (req, res) => {
  try {
    const logs = await YoutubeApiLog.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};
