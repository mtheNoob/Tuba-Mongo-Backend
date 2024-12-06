const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const saltRounds = 10;

async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

module.exports = function (app) {
    const apiRoutes = express.Router();

    apiRoutes.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send({ msg: 'User already registered.' });
            }

            const hashedPassword = await hashPassword(password);
            const newUser = await User.create({ name, email, password: hashedPassword });

            res.status(201).send({ msg: 'User registered successfully.', user: newUser });
        } catch (err) {
            res.status(500).send({ msg: 'Error registering user.', error: err.message });
        }
    });

    apiRoutes.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).send({ msg: 'Invalid credentials.' });
            }
            res.status(200).send({ msg: 'Login successful.', user });
        } catch (err) {
            res.status(500).send({ msg: 'Error logging in.', error: err.message });
        }
    });

    apiRoutes.post('/storeName', async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ msg: 'Name is required.' });
        }

        try {
            const newUser = new User({ name });
            await newUser.save();

            res.status(201).send({ msg: 'User created successfully.', user: newUser });
        } catch (err) {
            console.error('Error while storing data:', err);
            res.status(500).send({ msg: 'Error while storing data.', error: err.message });
        }
    });

    app.use('/', apiRoutes);
};