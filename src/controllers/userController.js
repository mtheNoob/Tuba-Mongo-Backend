const express = require('express');
const User = require('../models/userModel');
const sendEmail = require('../config/mailer');
const crypto = require('crypto');
const otpStore = {};
const Cab = require('../models/cabModel');
const Hotel = require('../models/hotelModel');
const Flight = require('../models/flightModel')
const eVisa = require('../models/eVisaModel')
const Visa = require('../models/visaModel')
const Tour = require('../models/tourModel')


module.exports = function (app) {

    const apiRoutes = express.Router();

    apiRoutes.post('/register', async (req, res) => {
        const { fullName, emailOrUsername, password } = req.body;
        try {
            const existingUser = await User.findOne({ emailOrUsername });
            if (existingUser) {
                return res.status(400).send({ msg: 'User already registered.' });
            }

            const newUser = await User.create({ fullName, emailOrUsername, password });
            res.status(201).send({ msg: 'User registered successfully.', user: newUser });
        } catch (err) {
            res.status(500).send({ msg: 'Error registering user.', error: err.message });
        }
    });

    apiRoutes.post('/login', async (req, res) => {
        const { emailOrUsername, password } = req.body;
        try {
            const user = await User.findOne({ emailOrUsername });
            if (!user || user.password !== password) {
                return res.status(400).send({ msg: 'Invalid credentials.' });
            }
            res.status(200).send({ msg: 'Login successful.', email: emailOrUsername });
        } catch (err) {
            res.status(500).send({ msg: 'Error logging in.', error: err.message });
        }
    });

    apiRoutes.post('/forget-password/send-otp', async (req, res) => {
        const { emailOrUsername } = req.body;
        console.log("Body for Forget-Password::::", req.body);
        try {
            const user = await User.findOne({ emailOrUsername });
            if (!user) {
                console.log(`User not found for emailOrUsername: ${emailOrUsername}`);
                return res.status(404).send({ msg: 'User not found.', status: "false" });
            }

            const otp = crypto.randomInt(100000, 999999);
            otpStore[emailOrUsername] = otp; // Store OTP temporarily

            console.log(`Generated OTP: ${otp} for emailOrUsername: ${emailOrUsername}`);

            await sendEmail(emailOrUsername, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);

            res.status(200).send({ msg: 'OTP sent to your email.', status: "true" });
        } catch (err) {
            console.error(`Error sending OTP to ${emailOrUsername}:`, err.message);
            res.status(500).send({ msg: 'Error sending OTP.', error: err.message });
        }
    });

    apiRoutes.post('/forget-password/verify-otp', async (req, res) => {
        const { emailOrUsername, otp, newPassword } = req.body;

        try {
            const storedOtp = otpStore[emailOrUsername];
            if (!storedOtp || storedOtp !== parseInt(otp)) {
                return res.status(400).send({ msg: 'Invalid or expired OTP.' });
            }

            const user = await User.findOne({ emailOrUsername });
            if (!user) {
                return res.status(404).send({ msg: 'User not found.' });
            }

            user.password = newPassword;
            await user.save();

            delete otpStore[emailOrUsername];

            res.status(200).send({ msg: 'Password updated successfully.' });
        } catch (err) {
            res.status(500).send({ msg: 'Error updating password.', error: err.message });
        }
    });

    apiRoutes.post('/user-dashboard', async (req, res) => {
        const { emailOrUsername, email } = req.body;

        try {

            const user = await User.findOne({emailOrUsername: email});

            if (!user) {
                return res.status(400).send({ msg: 'No User Found', status: "false" })
            }
            const userData = await User.findOne({emailOrUsername: email|| emailOrUsername})
            const hotelBookings = await Hotel.find({ email : emailOrUsername });
            const cabBookings = await Cab.find({email: emailOrUsername });
            const flightBookings = await Flight.find({email: emailOrUsername})
            const eVisaStampings = await eVisa.find({email: emailOrUsername})
            const visaData = await Visa.find({email: emailOrUsername})
            const TOurData = await Tour.find({email: emailOrUsername})

            res.status(200).send({
                msg: 'User dashboard data fetched successfully.',
                data: {
                    userData,
                    hotelBookings,
                    cabBookings,
                    flightBookings,
                    eVisaStampings,
                    visaData,
                    TOurData
                },
            });
        } catch (err) {
            console.error('Error fetching user dashboard:', err.message && err);
            res.status(500).send({ msg: 'Error fetching dashboard data.', error: err.message && err});
        }
    });
    app.use('/', apiRoutes);
};
