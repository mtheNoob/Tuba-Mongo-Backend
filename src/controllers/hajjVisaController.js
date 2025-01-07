const express = require('express');
const Hajj = require('../models/hajjModel');
const sendEmail = require('../config/mailer');
const sendSMS = require('../config/sms_sender');

function generateReferenceNumber() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `EVISA${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/applyHajj', async (req, res) => {
        const {
            name,
            email,
            contactNo,
            visa_type,
            purpose,
            passengers
        } = req.body;
    
        // Generate a unique reference number
        const referenceNo = generateReferenceNumber();
    
        try {
            // Create a new Hajj application record
            const hajjApplication = new Hajj({
                name,
                email,
                contactNo,
                visaType,
                purpose,
                passengers,
                created_at: new Date(),
                referenceNo
            });
    
            // Save the application to the database
            const savedApplication = await hajjApplication.save();
    
            // Prepare email subjects and messages
            const userSubject = `Hajj/Umrah Application Confirmation for ${name}`;
            const adminSubject = `New Hajj/Umrah Application Received: ${name}`;
    
            const userText = `
                Dear ${name},
    
                Thank you for applying for Hajj/Umrah through our service. Here are your application details:
    
                Visa Type: ${visaType}
                Reference Number: ${referenceNo}
    
                We will contact you shortly with further updates.
    
                Regards,
                Visa Services Team
            `;
    
            const adminText = `
                Hello,
    
                A new visa application has been received. Here are the details:
    
                Name: ${name}
                Email: ${email}
                Contact No: ${contactNo}
                Visa Type: ${visaType}
                Reference Number: ${referenceNo}
    
                Please review and process the application.
    
                Regards,
                Visa Services Team
            `;
    
            // Send confirmation email to the user
            await sendEmail(email, userSubject, userText);
    
            // Notify the admin via email
            await sendEmail(process.env.OWNER_MAIL, adminSubject, adminText);
    
            // Notify the admin via SMS
            const adminPhone = process.env.OWNER_PHONE;
            const smsMessage = `New Hajj Application:
            Name: ${name}
            Contact: ${contactNo}
            Reference: ${referenceNo}`;
            await sendSMS(adminPhone, smsMessage);
    
            // Respond with success and saved application data
            res.status(200).send({
                msg: 'Visa application submitted successfully. We will get back to you soon!',
                applicationData: savedApplication
            });
    
        } catch (error) {
            console.error('Error while storing data:', error);
            res.status(500).send({ 
                msg: 'Error while storing visa application data.', 
                error: error.message 
            });
        }
    });
    

    app.use('/', apiRoutes);
};
