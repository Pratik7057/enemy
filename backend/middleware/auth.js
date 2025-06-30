const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for protecting routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Middleware for admin routes
exports.admin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route. Admin access required.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Middleware for validating YouTube API key
exports.validateApiKey = async (req, res, next) => {
  try {
    const { key } = req.query;
    
    if (!key) {
      return res.status(401).json({
        success: false,
        message: 'API key is required'
      });
    }
    
    // Find user with this API key
    const user = await User.findOne({ apiKey: key });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    // Check if API key is expired
    if (user.apiKeyExpiresAt && new Date() > user.apiKeyExpiresAt) {
      return res.status(401).json({
        success: false,
        message: 'API key has expired'
      });
    }
      // Check if API key is blocked
    if (user.apiKeyStatus === 'blocked') {
      // Still log the attempt in the database
      const YoutubeApiLog = require('../models/YoutubeApiLog');
      await new YoutubeApiLog({
        user: user._id,
        apiKey: user.apiKey,
        query: req.query.q || 'unknown',
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        status: 'failed',
        errorMessage: 'API Key is blocked by admin.'
      }).save();
      
      return res.status(403).json({
        success: false,
        message: 'API Key is blocked by admin.',
        error: 'API Key is blocked by admin.'
      });
    }
    
    // Increment API key usage count
    user.apiKeyUsageCount += 1;
    await user.save();
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
