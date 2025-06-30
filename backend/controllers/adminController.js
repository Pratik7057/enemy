const User = require('../models/User');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Transaction = require('../models/Transaction');
const YoutubeApiLog = require('../models/YoutubeApiLog');
const { formatError, formatSuccess } = require('../utils/helpers');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total user count
    const totalUsers = await User.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total api logs count
    const totalApiRequests = await YoutubeApiLog.countDocuments();
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username email');
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username email balance createdAt');
    
    // Get orders stats
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    res.status(200).json(formatSuccess({
      totalUsers,
      totalOrders,
      totalApiRequests,
      pendingOrders,
      completedOrders,
      recentOrders,
      recentUsers
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('username email role balance apiKey createdAt');
    
    res.status(200).json(formatSuccess({
      count: users.length,
      users
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    // Get user's orders
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 });
    
    // Get user's transactions
    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 });
    
    // Get user's API logs
    const apiLogs = await YoutubeApiLog.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json(formatSuccess({
      user,
      orders,
      transactions,
      apiLogs
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { balance, role } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    // Update user fields
    if (balance !== undefined) {
      user.balance = balance;
    }
    
    if (role !== undefined && ['user', 'admin'].includes(role)) {
      user.role = role;
    }
    
    await user.save();
    
    res.status(200).json(formatSuccess({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    }, 'User updated successfully'));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Add a new service
exports.addService = async (req, res) => {
  try {
    const { name, description, type, price, minQuantity, maxQuantity } = req.body;
    
    // Check if service with same name already exists
    const existingService = await Service.findOne({ name });
    
    if (existingService) {
      return res.status(400).json(formatError('Service with this name already exists', 400));
    }
    
    // Create new service
    const service = await Service.create({
      name,
      description,
      type,
      price,
      minQuantity,
      maxQuantity,
      active: true
    });
    
    res.status(201).json(formatSuccess({ service }, 'Service added successfully', 201));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
      return res.status(400).json(formatError('Invalid status', 400));
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json(formatError('Order not found', 404));
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json(formatSuccess({ order }, 'Order status updated successfully'));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// API Key Management

// Get all API keys
exports.getAllApiKeys = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    // Build query
    const query = {};
    
    // Add search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { apiKey: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status && status !== 'all') {
      query.apiKeyStatus = status;
    }
    
    // Only include users with API keys
    query.apiKey = { $exists: true, $ne: null };
    
    // Count total documents
    const total = await User.countDocuments(query);
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pages = Math.ceil(total / parseInt(limit));
    
    // Get users with API keys
    const users = await User.find(query)
      .sort({ apiKeyCreatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('username email apiKey apiKeyStatus apiKeyCreatedAt apiKeyExpiresAt apiKeyUsageCount');
    
    // Format API keys for response
    const apiKeys = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      apiKey: user.apiKey,
      status: user.apiKeyStatus,
      createdAt: user.apiKeyCreatedAt,
      expiresAt: user.apiKeyExpiresAt,
      usageCount: user.apiKeyUsageCount
    }));
    
    res.status(200).json(formatSuccess({
      apiKeys,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages
      }
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get API key details by user ID
exports.getApiKeyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username email apiKey apiKeyStatus apiKeyCreatedAt apiKeyExpiresAt apiKeyUsageCount');
    
    if (!user || !user.apiKey) {
      return res.status(404).json(formatError('API Key not found', 404));
    }
    
    // Get usage logs for this API key
    const logs = await YoutubeApiLog.find({ apiKey: user.apiKey })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Get daily usage stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await YoutubeApiLog.aggregate([
      { 
        $match: { 
          apiKey: user.apiKey,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    
    res.status(200).json(formatSuccess({
      apiKey: {
        id: user._id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        status: user.apiKeyStatus,
        createdAt: user.apiKeyCreatedAt,
        expiresAt: user.apiKeyExpiresAt,
        usageCount: user.apiKeyUsageCount
      },
      logs,
      dailyStats
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Toggle API key status (block/unblock)
exports.toggleApiKeyStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user || !user.apiKey) {
      return res.status(404).json(formatError('API Key not found', 404));
    }
    
    // Toggle status
    user.apiKeyStatus = user.apiKeyStatus === 'active' ? 'blocked' : 'active';
    await user.save();
    
    res.status(200).json(formatSuccess({
      id: user._id,
      apiKey: user.apiKey,
      status: user.apiKeyStatus
    }, `API Key has been ${user.apiKeyStatus === 'active' ? 'activated' : 'blocked'} successfully`));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get API usage statistics
exports.getApiUsageStats = async (req, res) => {
  try {
    // Get total API keys
    const totalApiKeys = await User.countDocuments({ apiKey: { $exists: true, $ne: null } });
    
    // Get active API keys
    const activeApiKeys = await User.countDocuments({ 
      apiKey: { $exists: true, $ne: null },
      apiKeyStatus: 'active'
    });
    
    // Get blocked API keys
    const blockedApiKeys = await User.countDocuments({ 
      apiKey: { $exists: true, $ne: null },
      apiKeyStatus: 'blocked'
    });
    
    // Get total API requests
    const totalApiRequests = await YoutubeApiLog.countDocuments();
    
    // Get API requests in the last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const requestsLast24Hours = await YoutubeApiLog.countDocuments({
      createdAt: { $gte: last24Hours }
    });
    
    // Get API requests by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyRequests = await YoutubeApiLog.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    
    res.status(200).json(formatSuccess({
      totalApiKeys,
      activeApiKeys,
      blockedApiKeys,
      totalApiRequests,
      requestsLast24Hours,
      dailyRequests
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};
