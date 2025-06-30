const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { formatError, formatSuccess } = require('../utils/helpers');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists with this email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json(
        formatError('User with this email or username already exists', 400)
      );
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      balance: 0 // Initial balance is 0
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json(formatSuccess({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        hasApiKey: Boolean(user.apiKey)
      }
    }, 'User registered successfully', 201));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json(formatError('Invalid credentials', 401));
    }

    // Check if password is correct
    const isMatch = await user.isValidPassword(password);
    
    if (!isMatch) {
      return res.status(401).json(formatError('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json(formatSuccess({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        hasApiKey: Boolean(user.apiKey)
      }
    }, 'Login successful'));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get current user (profile)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json(formatSuccess({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        hasApiKey: Boolean(user.apiKey),
        apiKeyCreatedAt: user.apiKeyCreatedAt,
        apiKeyExpiresAt: user.apiKeyExpiresAt
      }
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};
