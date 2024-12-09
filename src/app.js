const express = require('express');
const dotenvConfig = require('./config/dotenvConfig');
const connectDB = require('./config/db');
const userRoutes = require('./controllers/userController');

const app = express();
const cab = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
userRoutes(app);
userRoutes(cab)

module.exports = app;