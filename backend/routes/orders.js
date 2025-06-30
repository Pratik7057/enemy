const express = require('express');
const { getServices, placeOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

// Get all services
router.get('/services', getServices);

// Place order
router.post('/', placeOrder);

// Get user orders
router.get('/', getUserOrders);

// Get order by ID
router.get('/:id', getOrderById);

module.exports = router;
