const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate a random API key
exports.generateApiKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Format error for consistent error responses
exports.formatError = (message, statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode
  };
};

// Format success response for consistent success responses
exports.formatSuccess = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};

// Sign JWT token
exports.signToken = (user, jwtSecret, expiresIn = '30d') => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    jwtSecret,
    { expiresIn }
  );
};

// Helper function to validate YouTube query
exports.validateYoutubeQuery = (query) => {
  // Remove special characters and validate
  const sanitizedQuery = query.replace(/[^\w\s]/gi, '');
  
  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    return false;
  }
  
  return sanitizedQuery;
};

// Helper function to get current date plus days
exports.getExpiryDate = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
