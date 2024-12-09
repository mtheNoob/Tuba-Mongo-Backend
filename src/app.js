const express = require('express');
const dotenvConfig = require('./config/dotenvConfig');
const connectDB = require('./config/db');
const userRoutes = require('./controllers/userController');
const cabRoutes = require('./controllers/cabController');
const cors = require("cors");


const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// Connect to DB
connectDB();

// Routes
userRoutes(app);
cabRoutes(app);

module.exports = app;