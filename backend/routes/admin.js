const express = require('express');
const { 
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  addService,
  updateOrderStatus,
  getAllApiKeys,
  getApiKeyDetails,
  toggleApiKeyStatus,
  getApiUsageStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);

// Service management
router.post('/services', addService);

// Order management
router.put('/orders/:id/status', updateOrderStatus);

// API key management
router.get('/api-keys', getAllApiKeys);
router.get('/api-keys/:id', getApiKeyDetails);
router.put('/api-keys/:id/toggle-status', toggleApiKeyStatus);
router.get('/api-keys/stats', getApiUsageStats);

module.exports = router;
