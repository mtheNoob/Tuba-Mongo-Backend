// const express = require('express');
// const Cab = require('../models/cabModel');
// const sendEmail = require('../config/mailer');
// const sendSMS = require("../config/sms_sender"); 
// const sendTelegramNotification  = require('../config/telegramNotifier');

// function generateReferenceNumber() {
//     const timestamp = Date.now(); 
//     const randomSuffix = Math.floor(Math.random() * 10000); 
//     return `REF${timestamp}${randomSuffix}`;
//   }
  

// module.exports = function (app) {
//     const apiRoutes = express.Router();

//     apiRoutes.post('/bookMyCab', async (req, res) => {

//         const { name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks } = req.body;

//         const referenceNo = generateReferenceNumber()

//         try {
//             const booking = new Cab({ name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks, referenceNo });
//             await booking.save();

//             const userSubject = `Cab Booking Confirmation for ${name}`;
//             const ownerSubject = `New Cab Booking Received: ${name}`;
            
//             const userText = `
//                 Dear ${name},

//                 Thank you for booking a cab with us. Here are your booking details:

//                 Pickup Address: ${pickupAddress}
//                 Drop Address: ${dropAddress}
//                 Pickup Time: ${new Date(pickupTime).toLocaleString()}
//                 Drop Time: ${new Date(dropTime).toLocaleString()}
//                 Vehicle Type: ${vehicleType}
//                 Reference Number: ${referenceNo}

//                 We will contact you shortly to confirm your booking.

//                 Regards,
//                 Your Cab Service
//             `;

//             const ownerText = `
//                 Hello,

//                 A new cab booking has been received. Here are the details:

//                 Name: ${name}
//                 Email: ${email}
//                 Contact No: ${contact_no}
//                 Pickup Address: ${pickupAddress}
//                 Drop Address: ${dropAddress}
//                 Pickup Time: ${new Date(pickupTime).toLocaleString()}
//                 Drop Time: ${new Date(dropTime).toLocaleString()}
//                 Vehicle Type: ${vehicleType}
//                 Remarks: ${remarks || 'N/A'}
//                 Reference Number: ${referenceNo}


//                 Please review and confirm the booking.

//                 Regards,
//                 Tuba International
//             `;

//             await sendEmail(email, userSubject, userText); // Email to the user
//             await sendEmail(process.env.OWNER_MAIL, ownerSubject, ownerText); // Email to the owner
//             const ownerPhone = "8948626497"; // Replace with the owner's phone number
//             const message = `New Cab Booking:\nName: ${name}\nContact: ${contact_no}\nPickup: ${pickupAddress}\nDrop: ${dropAddress}`;
//             await sendSMS(ownerPhone, message);

//             // const smsMessage = `New cab booking received:\nReference Number: ${referenceNo}\nName: ${name}\nContact No: ${contact_no}\nPickup: ${pickupAddress}\nDrop: ${dropAddress}`;
//             // await sendSMS(process.env.OWNER_PHONE, smsMessage); // Send SMS to owner's phone number
      
      

//             res.status(200).send({ 
//                 msg: 'Cab Booked successfully: We will get back to you soon!', 
//                 bookingData: booking 
//             });

//         } catch (error) {
//             console.error('Error while storing data:', error);
//             res.status(500).send({ msg: 'Error while storing data.', error: error.message });
//         }
//     });

//     app.use('/', apiRoutes);
// };
const express = require('express');
const Cab = require('../models/cabModel');
const sendEmail = require('../config/mailer');
const sendSMS = require("../config/sms_sender"); 
const { sendTelegramNotification } = require('../config/telegramNotifier');

function generateReferenceNumber() {
    const timestamp = Date.now(); 
    const randomSuffix = Math.floor(Math.random() * 10000); 
    return `REF${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/bookMyCab', async (req, res) => {

        const { name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks } = req.body;
        const referenceNo = generateReferenceNumber();

        try {
            const booking = new Cab({ 
                name, 
                email, 
                contact_no, 
                pickupAddress, 
                dropAddress, 
                pickupTime, 
                dropTime, 
                vehicleType, 
                remarks, 
                referenceNo 
            });
            await booking.save();

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
                Reference Number: ${referenceNo}

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
                Reference Number: ${referenceNo}

                Please review and confirm the booking.

                Regards,
                Tuba International
            `;

            // Send notifications
            await sendEmail(email, userSubject, userText); // Email to the user
            await sendEmail(process.env.OWNER_MAIL, ownerSubject, ownerText); // Email to the owner

            const ownerPhone = "8948626497"; // Replace with the owner's phone number
            const smsMessage = `New Cab Booking:\nName: ${name}\nContact: ${contact_no}\nPickup: ${pickupAddress}\nDrop: ${dropAddress}`;
            await sendSMS(ownerPhone, smsMessage);

            // Telegram Notification
            const telegramMessage = `<b>New Cab Booking</b>\nName: ${name}\nContact: ${contact_no}\nPickup: ${pickupAddress}\nDrop: ${dropAddress}\nReference: ${referenceNo}`;
            await sendTelegramNotification(telegramMessage);

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
