const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },                                          
        email: {
            type: String,
            required: false,
            unique: false,  
        },
        contact_no: {
            type: String,
            required: true
        },
        pickupAddress: {
            type: String,
            required: false,
            unique: false,  
        },
        dropAddress: {
            type: String,
            required: false,
            unique: false 
        },
        pickupTime: {
            type: String,
            required: false
        },
        dropTime: {
            type: String,
            required: false
        },
        vehicleType: {
            type: String,
            required: false
        },
        remarks: {
            type: String,
        },
        referenceNo: {
            type: String,
        },
        
        fare: {
            type: Number,
        }
     
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cab', cabSchema);