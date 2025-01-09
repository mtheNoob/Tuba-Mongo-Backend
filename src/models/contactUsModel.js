const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },  
        lastName: {
            type: String,
            required: true
        },                                         
        email: {
            type: String,
            required: false,
            unique: false,  
        },
        phoneNumber: {
            type: String,
            required: true
        },
        message: {
            type: String,
        },
        referenceNo: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('ContactUs', contactUsSchema);