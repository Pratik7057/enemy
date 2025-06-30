const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { formatError, formatSuccess } = require('../utils/helpers');

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    
    res.status(200).json(formatSuccess({
      count: services.length,
      services
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { serviceId, quantity, link } = req.body;
    
    // Validate required fields
    if (!serviceId || !quantity || !link) {
      return res.status(400).json(formatError('Please provide all required fields', 400));
    }
    
    // Find service by ID
    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json(formatError('Service not found', 404));
    }
    
    // Validate quantity against service limits
    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return res.status(400).json(
        formatError(`Quantity must be between ${service.minQuantity} and ${service.maxQuantity}`, 400)
      );
    }
    
    // Calculate amount
    const amount = (service.price * quantity).toFixed(2);
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json(
        formatError(`Insufficient balance. You need $${amount} but have $${user.balance.toFixed(2)}`, 400)
      );
    }
    
    // Create order
    const order = await Order.create({
      user: user._id,
      service: service.name,
      quantity,
      link,
      amount,
      status: 'pending'
    });
    
    // Create transaction record
    const transaction = await Transaction.create({
      user: user._id,
      amount,
      type: 'order',
      status: 'completed',
      description: `Order for ${service.name}`,
      orderId: order._id
    });
    
    // Deduct amount from user balance
    user.balance -= amount;
    await user.save();
    
    res.status(201).json(formatSuccess({
      order,
      newBalance: user.balance
    }, 'Order placed successfully', 201));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json(formatSuccess({
      count: orders.length,
      orders
    }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    // Check if order exists
    if (!order) {
      return res.status(404).json(formatError('Order not found', 404));
    }
    
    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(formatError('Not authorized to access this order', 403));
    }
    
    res.status(200).json(formatSuccess({ order }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(formatError('Server Error', 500));
  }
};
