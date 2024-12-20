const express = require('express');
const Tour = require('../models/tourModel');
const sendEmail = require('../config/mailer');
const sendSMS = require('../config/sms_sender');
function generateReferenceNumber() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `TOUR${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/bookTour', async (req, res) => {
        const {
            name,
            email,
            phone,
            destination,
            travel_date,
            duration,
            members,
            meal_preference,
            requirements_details,
            airport_pickup,
            local_guide,
            booking_type
        } = req.body;

        const referenceNo = generateReferenceNumber();

        try {
            const tourBooking = new Tour({
                name,
                email,
                phone,
                destination,
                travel_date,
                duration,
                members,
                meal_preference,
                requirements_details,
                airport_pickup,
                local_guide,
                booking_type,
                status: 'pending',
                created_at: new Date(),
                referenceNo
            });

            await tourBooking.save();

            const userSubject = `Tour Booking Confirmation for ${name}`;
            const adminSubject = `New Tour Booking Received: ${name}`;

            const userText = `
                Dear ${name},

                Thank you for booking a tour with us. Here are your booking details:

                Destination: ${destination}
                Travel Date: ${new Date(travel_date).toLocaleDateString()}
                Duration: ${duration} days
                Reference Number: ${referenceNo}

                We will contact you shortly with further updates.

                Regards,
                Tour Services Team
            `;

            const adminText = `
                Hello,

                A new tour booking has been received. Here are the details:

                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Destination: ${destination}
                Travel Date: ${new Date(travel_date).toLocaleDateString()}
                Duration: ${duration} days
                Requirements: ${requirements_details || 'N/A'}
                Airport Pickup: ${airport_pickup ? 'Yes' : 'No'}
                Local Guide: ${local_guide ? 'Yes' : 'No'}
                Reference Number: ${referenceNo}

                Please review and process the booking.

                Regards,
                Tour Services Team
            `;

            await sendEmail(email, userSubject, userText); // Email to the user
            await sendEmail(process.env.OWNER_MAIL, adminSubject, adminText); // Email to the admin

            const adminPhone = process.env.OWNER_PHONE; // Replace with admin's phone number
            const smsMessage = `New Tour Booking:
Name: ${name}
Contact: ${phone}
Destination: ${destination}
Reference: ${referenceNo}`;
            await sendSMS(process.env.OWNER_PHONE, smsMessage);

            res.status(200).send({ 
                msg: 'Tour booking submitted successfully. We will get back to you soon!', 
                bookingData: tourBooking 
            });

        } catch (error) {
            console.error('Error while storing data:', error);
            res.status(500).send({ msg: 'Error while storing tour booking data.', error: error.message });
        }
    });

    app.use('/', apiRoutes);
};
