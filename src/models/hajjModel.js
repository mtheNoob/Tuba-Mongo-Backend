const mongoose = require('mongoose');

const hajjSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
    trim: true
  },
  contactNo: {
    type: String,
    required: true,
    trim: true
  },
  visa_type: {
    type: String,
  },
  purpose: {
    type: String,
    default: ''
  },
  passengers: {
    type: Number,
    default: 1
  },

});

module.exports = mongoose.model('Hajj', hajjSchema);
