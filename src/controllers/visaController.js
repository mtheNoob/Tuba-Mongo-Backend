const express = require('express');
const VisaApplication = require('../models/visaModel');
const sendEmail = require('../config/mailer');
const sendSMS = require('../config/sms_sender');

function generateReferenceNumber() {
    const timestamp = Date.now(); 
    const randomSuffix = Math.floor(Math.random() * 10000); 
    return `VISA${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/applyVisa', async (req, res) => {
        const {
            name,
            passport_number,
            email,
            contact_no,
            visa_type,
            travel_date,
            visa_duration,
            destination_country,
            nationality,
            date_of_birth,
            address,
            purpose_of_visit,
            have_previous_visa,
            previous_visa_details,
            remarks,
            family_members,
            booking_type
        } = req.body;

        const referenceNo = generateReferenceNumber();

        try {
            const visaApplication = new VisaApplication({
                name,
                passport_number,
                email,
                contact_no,
                visa_type,
                travel_date,
                visa_duration,
                destination_country,
                nationality,
                date_of_birth,
                address,
                purpose_of_visit,
                have_previous_visa,
                previous_visa_details,
                remarks,
                family_members,
                booking_type,
                status: 'pending',
                created_at: new Date(),
                referenceNo
            });

            await visaApplication.save();

            const userSubject = `Visa Application Confirmation for ${name}`;
            const adminSubject = `New Visa Application Received: ${name}`;

            const userText = `
                Dear ${name},

                Thank you for applying for a visa through our service. Here are your application details:

                Visa Type: ${visa_type}
                Travel Date: ${new Date(travel_date).toLocaleDateString()}
                Visa Duration: ${visa_duration} days
                Destination Country: ${destination_country}
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
                Contact No: ${contact_no}
                Passport Number: ${passport_number}
                Visa Type: ${visa_type}
                Travel Date: ${new Date(travel_date).toLocaleDateString()}
                Visa Duration: ${visa_duration} days
                Destination Country: ${destination_country}
                Remarks: ${remarks || 'N/A'}
                Reference Number: ${referenceNo}

                Please review and process the application.

                Regards,
                Visa Services Team
            `;

            await sendEmail(email, userSubject, userText); // Email to the applicant
            await sendEmail(process.env.OWNER_MAIL, adminSubject, adminText); // Email to the admin

            const adminPhone = process.env.OWNER_PHONE; // Replace with admin's phone number
            const smsMessage = `New Visa Application:
Name: ${name}
Contact: ${contact_no}
Destination: ${destination_country}
Reference: ${referenceNo}`;
            await sendSMS(adminPhone, smsMessage);

            res.status(200).send({ 
                msg: 'Visa application submitted successfully. We will get back to you soon!', 
                applicationData: visaApplication 
            });

        } catch (error) {
            console.error('Error while storing data:', error);
            res.status(500).send({ msg: 'Error while storing visa application data.', error: error.message });
        }
    });

    app.use('/', apiRoutes);
};
