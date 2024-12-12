const express = require('express');
const User = require('../models/userModel');
const cors = require("cors");

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
            res.status(200).send({ msg: 'Login successful.' });
        } catch (err) {
            res.status(500).send({ msg: 'Error logging in.', error: err.message });
        }
    });


    apiRoutes.post('/forget-password', async (req, res) => {
        const { emailOrUsername, newPassword } = req.body;
        try {
            const user = await User.findOne({ emailOrUsername });
            if (!user) {
                return res.status(404).send({ msg: 'User not found.' });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).send({ msg: 'Password updated successfully.' });
        } catch (err) {
            res.status(500).send({ msg: 'Error updating password.', error: err.message });
        }
    });

    app.use('/', apiRoutes);
};
