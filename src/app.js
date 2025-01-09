const express = require('express');
const dotenvConfig = require('./config/dotenvConfig');
const connectDB = require('./config/db');
const userRoutes = require('./controllers/userController');
const cabRoutes = require('./controllers/cabController');
const hotelRoutes = require('./controllers/hotelController');
const flightRoutes = require('./controllers/flightController');
const visaRoutes = require('./controllers/visaController');
const tourRoutes = require('./controllers/tourController');
const eVisaRoutes = require('./controllers/eVisaStampingController');
const hajjRoutes = require('./controllers/hajjVisaController');
const contactUsRoutes = require('./controllers/contactUsController');

const cors = require("cors");
const bodyParser = require("body-parser")


const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

// Connect to DB
connectDB();

// Routes
userRoutes(app);
cabRoutes(app);
hotelRoutes(app);
flightRoutes(app)
visaRoutes(app)
tourRoutes(app)
hajjRoutes(app)
eVisaRoutes(app)
contactUsRoutes(app)
module.exports = app;