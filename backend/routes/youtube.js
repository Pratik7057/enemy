const express = require('express');
const { getYoutubeStream, streamYoutubeAudio, getApiUsageLogs } = require('../controllers/youtubeController');
const { protect, validateApiKey } = require('../middleware/auth');

const router = express.Router();

// Route for YouTube search and audio streaming - requires API key validation
router.get('/', validateApiKey, getYoutubeStream);

// Direct streaming route - requires API key validation
router.get('/stream', validateApiKey, streamYoutubeAudio);

// Get API usage logs - requires authentication
router.get('/logs', protect, getApiUsageLogs);

module.exports = router;
