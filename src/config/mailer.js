const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS  
    }
});

/**
 * Send an email to one or multiple recipients.
 * @param {string | string[]} to - Recipient email or an array of emails.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Email body.
 */
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to, 
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;

