const express = require('express');
const { generateApiKey, getApiKeyDetails, addBalance, getTransactions } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

// Generate API key
router.post('/api-key/generate', generateApiKey);

// Get API key details
router.get('/api-key', getApiKeyDetails);

// Add balance
router.post('/balance/add', addBalance);

// Get transactions
router.get('/transactions', getTransactions);

module.exports = router;
