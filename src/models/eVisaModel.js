const mongoose = require('mongoose');

const eVisaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
    trim: true
  },
  visaType: {
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

module.exports = mongoose.model('eVisa', eVisaSchema);
