const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
    {                                      
        email: {
            type: String,
            required: false,
            unique: false,  
        },
        contact: {
            type: String,
            required: true
        },
        checkIn: {
            type: String,
            required: false,
            unique: false,  
        },
        checkOut: {
            type: String,
            required: false
        },
        travellers: {
            type: Array,
            required: false
        },
        referenceNo: {
            type: String,
        },

        rent: {
            type: String,
        },
        selectedHotelRating: {
            type: String,
        }, 
        selectedHotelName: {
            type: String,
        }, 
        selectedHotelImage: {
            type: String,
        }
     
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);