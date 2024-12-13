const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
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
        departure_id: {
            type: String,
            required: false,
            unique: false,  
        },
        arrival_id: {
            type: String,
            required: false,
            unique: false 
        },
        outbound_date: {
            type: String,
            required: false
        },
        return_date: {
            type: String,
            required: false
        },
        flightData: {
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

module.exports = mongoose.model('Flight', flightSchema);