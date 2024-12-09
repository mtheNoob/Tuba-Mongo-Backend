const express = require('express');
const CabB = require('../models/cabModel');
const cors = require("cors");
const sendEmail = require('../config/mailer'); // Import the mailer

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/bookMyCab', async (req, res) => {
        const { name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks } = req.body;

        try {
            // Save booking to the database
            const booking = new CabB({ name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks });
            await booking.save();

            // Prepare email details
            const userSubject = `Cab Booking Confirmation for ${name}`;
            const ownerSubject = `New Cab Booking Received: ${name}`;
            
            const userText = `
                Dear ${name},

                Thank you for booking a cab with us. Here are your booking details:

                Pickup Address: ${pickupAddress}
                Drop Address: ${dropAddress}
                Pickup Time: ${new Date(pickupTime).toLocaleString()}
                Drop Time: ${new Date(dropTime).toLocaleString()}
                Vehicle Type: ${vehicleType}

                We will contact you shortly to confirm your booking.

                Regards,
                Your Cab Service
            `;

            const ownerText = `
                Hello,

                A new cab booking has been received. Here are the details:

                Name: ${name}
                Email: ${email}
                Contact No: ${contact_no}
                Pickup Address: ${pickupAddress}
                Drop Address: ${dropAddress}
                Pickup Time: ${new Date(pickupTime).toLocaleString()}
                Drop Time: ${new Date(dropTime).toLocaleString()}
                Vehicle Type: ${vehicleType}
                Remarks: ${remarks || 'N/A'}

                Please review and confirm the booking.

                Regards,
                Automated Notification
            `;

            // Send emails
            await sendEmail(email, userSubject, userText); // Email to the user
            await sendEmail(process.env.OWNER_MAIL, ownerSubject, ownerText); // Email to the owner

            res.status(200).send({ 
                msg: 'Cab Booked successfully: We will get back to you soon!', 
                bookingData: booking 
            });

        } catch (error) {
            console.error('Error while storing data:', error);
            res.status(500).send({ msg: 'Error while storing data.', error: error.message });
        }
    });

    app.use('/', apiRoutes);
};
