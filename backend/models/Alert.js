const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    enum: ['LOW_STOCK', 'OUT_OF_STOCK'],
    required: true
  },
  currentStock: {
    type: Number,
    required: true
  },
  minThreshold: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  suggestedReorderQuantity: {
    type: Number,
    required: true
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', AlertSchema);
