const express = require('express')
const Cab = require('../models/cabModel');

module.exports = function (app) {
const apiRoutes = express.Router()

apiRoutes.post('/bookMyCab', async (req, res) => {

const { name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks } = req.body;
try {
    const booking = new Cab({ name, email, contact_no, pickupAddress, dropAddress, pickupTime, dropTime, vehicleType, remarks });
    await booking.save();
    res.status(200).send({ msg: 'Cab Booked successfully: We will get back to you soon !', bookingData: booking });

} catch (error) {
    console.error('Error while storing data:', error);
    res.status(500).send({ msg: 'Error while storing data.', error: err.message });

}

} )

app.use('/', apiRoutes);

}