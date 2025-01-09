const express = require('express');
const ContactUs = require('../models/contactUsModel');
const sendEmail = require('../config/mailer');
const sendSMS = require("../config/sms_sender"); 

function generateReferenceNumber() {
    const timestamp = Date.now(); 
    const randomSuffix = Math.floor(Math.random() * 10000); 
    return `REF${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/contactUs', async (req, res) => {
        const { firstName, lastName, email, phoneNumber, message } = req.body; 

        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.status(400).send({ msg: 'All fields are required.' });
        }

        const referenceNo = generateReferenceNumber();

        try {
            const contact = new ContactUs({ firstName, lastName, email, phoneNumber, message, referenceNo });
            await contact.save();

            const userSubject = `Contact Us Confirmation - Reference No: ${referenceNo}`;
            const ownerSubject = `New Contact Us Submission - Reference No: ${referenceNo}`;

            const userText = `
                Dear ${firstName},

                Thank you for reaching out to us. We have received your message and will get back to you shortly. Below are your message details:

                Message: ${message}
                Reference Number: ${referenceNo}

                Regards,
                Tuba International
            `;

            const ownerText = `
                Hello,

                A new contact message has been received. Below are the details:

                Name: ${firstName} ${lastName}
                Email: ${email}
                Phone Number: ${phoneNumber}
                Message: ${message}
                Reference Number: ${referenceNo}

                Please review and respond accordingly.

                Regards,
                Tuba International
            `;

            await sendEmail(email, userSubject, userText); 
            await sendEmail(process.env.OWNER_MAIL, ownerSubject, ownerText); 

            const ownerPhone = process.env.OWNER_PHONE; 
            const smsMessage = `New contact message from ${firstName} ${lastName}. Ref No: ${referenceNo}.`;

            await sendSMS(ownerPhone, smsMessage); 

            res.status(200).send({ 
                msg: 'Your message has been received. We will get back to you soon!', 
                referenceNo: referenceNo 
            });

        } catch (error) {
            console.error('Error while storing data:', error);
            res.status(500).send({ msg: 'Error while storing data.', error: error.message });
        }
    });

    app.use('/', apiRoutes);
};
