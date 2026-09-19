const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'grams', 'bags', 'cartons', 'boxes', 'dozens', 'litres', 'pieces', 'quintals', 'packets'],
    default: 'pieces'
  },
  minThreshold: {
    type: Number,
    required: true,
    default: 5
  },
  pricePerUnit: {
    type: Number,
    required: true,
    default: 0
  },
  aliases: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  lastUpdatedByVoice: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
