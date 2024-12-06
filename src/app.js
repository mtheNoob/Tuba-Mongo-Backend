const express = require('express');
const dotenvConfig = require('./config/dotenvConfig');
const connectDB = require('./config/db');
const userRoutes = require('./controllers/userController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
userRoutes(app);

module.exports = app;