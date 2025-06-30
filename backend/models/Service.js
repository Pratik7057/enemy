const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Instagram', 'YouTube', 'Facebook', 'Twitter', 'TikTok', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  minQuantity: {
    type: Number,
    required: true
  },
  maxQuantity: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
