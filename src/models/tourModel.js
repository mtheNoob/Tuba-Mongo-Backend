const mongoose = require('mongoose');

// Tour Model
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  travel_date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  members: {
    type: String,
    default: ''
  },
  meal_preference: {
    type: String,
    default: ''
  },
  requirements_details: {
    type: String,
    default: ''
  },
  airport_pickup: {
    type: Boolean,
    default: false
  },
  local_guide: {
    type: Boolean,
    default: false
  },
  booking_type: {
    type: String,
    enum: ['tour', 'ticket', 'hotel'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tour', tourSchema);