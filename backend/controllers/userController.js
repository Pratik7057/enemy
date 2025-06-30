const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { generateApiKey, formatError, formatSuccess, getExpiryDate } = require('../utils/helpers');

// Generate a new API key for user
exports.generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    // Generate a new API key
    const apiKey = generateApiKey();
    
    // Set expiry date to 30 days from now
    const expiryDate = getExpiryDate(30);
    
    // Update user with new API key
    user.apiKey = apiKey;
    user.apiKeyCreatedAt = new Date();
    user.apiKeyExpiresAt = expiryDate;
    
    await user.save();
    
    res.status(200).json(formatSuccess({
      apiKey,
      apiKeyCreatedAt: user.apiKeyCreatedAt,
      apiKeyExpiresAt: user.apiKeyExpiresAt,
      integrationUrl: `${req.protocol}://${req.get('host')}/api/youtube?key=${apiKey}&q=`
    }, 'API key generated successfully'));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get user API key details
exports.getApiKeyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.apiKey) {
      return res.status(404).json(formatError('No API key found', 404));
    }
    
    res.status(200).json(formatSuccess({
      apiKey: user.apiKey,
      apiKeyCreatedAt: user.apiKeyCreatedAt,
      apiKeyExpiresAt: user.apiKeyExpiresAt,
      integrationUrl: `${req.protocol}://${req.get('host')}/api/youtube?key=${user.apiKey}&q=`
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Add balance to user account (demo gateway)
exports.addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json(formatError('Please provide a valid amount', 400));
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    // Create a transaction record
    const transaction = await Transaction.create({
      user: user._id,
      amount,
      type: 'deposit',
      status: 'completed', // Auto-complete for demo
      description: 'Balance added via demo gateway',
      paymentDetails: {
        method: 'demo_gateway',
        timestamp: new Date()
      }
    });
    
    // Update user balance
    user.balance += amount;
    await user.save();
    
    res.status(200).json(formatSuccess({
      newBalance: user.balance,
      transaction: {
        id: transaction._id,
        amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    }, `${amount} added to your balance successfully`));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get user transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json(formatSuccess({
      count: transactions.length,
      transactions
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};
