const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
    {
        flight: {
            airline: {
                type: String,
                required: true,
            },
            departure_airport: {
                type: String,
                required: true,
            },
            arrival_airport: {
                type: String,
                required: true,
            },
            departure_time: {
                type: Date, // Date type for proper datetime handling
                required: true,
            },
            arrival_time: {
                type: Date,
                required: true,
            },
            duration: {
                type: String,
                required: false,
            },
            fare: {
                type: Number,
                required: true,
            },
            image_link: {
                type: String,
                required: false,
            },
            total_price: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                required: true,
            },
            type: {
                type: Number,
                required: true,
            },
            travel_class: {
                type: Number,
                required: true,
            },
        },
        passenger: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            totalPassengers: {
                type: Number,
                required: true,
            },
        },
        journey: {
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
        remarks: {
            type: String,
            required: false,
        },
        referenceNo: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);





// const mongoose = require('mongoose');

// const flightSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true
//         },                                          
//         email: {
//             type: String,
//             required: false,
//             unique: false,  
//         },
//         contact_no: {
//             type: String,
//             required: true
//         },
//         departure_id: {
//             type: String,
//             required: false,
//             unique: false,  
//         },
//         arrival_id: {
//             type: String,
//             required: false,
//             unique: false 
//         },
//         outbound_date: {
//             type: String,
//             required: false
//         },
//         return_date: {
//             type: String,
//             required: false
//         },
//         flightData: {
//             type: String,
//             required: false
//         },
//         remarks: {
//             type: String,
//         },
//         referenceNo: {
//             type: String,
//         },
        
//         fare: {
//             type: Number,
//         }
     
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Flight', flightSchema);