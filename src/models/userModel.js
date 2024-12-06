const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: { 
            type: String, 
            required: false, 
            unique: false 
        },
        password: { 
            type: String, 
            required: false 
        },
        role: { 
            type: String, 
            default: 'user'
         },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);