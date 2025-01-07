const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  passport_number: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
    trim: true
  },
  contact_no: {
    type: String,
    required: true,
    trim: true
  },
  travel_date: {
    type: Date,
    required: true
  },
  visa_duration: {
    type: Number,
    required: true
  },
  destination_country: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    default: ''
  },
  date_of_birth: {
    type: Date
  },
  address: {
    type: String,
    default: ''
  },
  purpose_of_visit: {
    type: String,
    default: ''
  },
  have_previous_visa: {
    type: Boolean,
    default: false
  },
  previous_visa_details: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  family_members: [
    {
      type: String
    }
  ],
  booking_type: {
    type: String,
    enum: ['visa', 'ticket', 'hotel'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  visaType: {
    type: String,
  
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visa', visaSchema);
