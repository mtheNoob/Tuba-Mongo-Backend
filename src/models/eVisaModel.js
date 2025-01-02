const mongoose = require('mongoose');

const eVisaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
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
    enum: ['tourist', 'business', 'student', 'work'],
    required: true
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

module.exports = mongoose.model('eVisa', eVisaSchema);
