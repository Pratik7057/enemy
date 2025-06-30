require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const youtubeApiRoutes = require('./routes/youtube');
const orderRoutes = require('./routes/orders');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickearn', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/youtube', youtubeApiRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Simple root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'RADHA API Backend is running',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      admin: '/api/admin',
      youtube: '/api/youtube',
      orders: '/api/orders'
    }
  });
});

// Use environment port or fallback to 5001 for local development
const PORT = process.env.PORT || 5001;
console.log('Environment PORT:', process.env.PORT);
console.log('Attempting to start server on port:', PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
