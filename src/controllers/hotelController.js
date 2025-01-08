const express = require("express");
const axios = require("axios");
const Hotel = require('../models/hotelModel');
const sendEmail = require('../config/mailer');
const sendSMS = require("../config/sms_sender"); 
const api_key = process.env.SERPAPI_KEY
function generateReferenceNumber() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `REF${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
  const apiRoutes = express.Router();

  apiRoutes.post("/getHotelData", async (req, res) => {
    const { check_in_date, check_out_date, q } = req.body;

    // Validate required parameters
    if (!check_in_date || !check_out_date || !q) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: check_in_date, check_out_date, q",
      });
    }

    try {
      // const apiKey = "f78e0b13280663ce45375f3ef7ef6052972494a114044918779c486f6c5df7bd"; // Replace with your actual API key
      const url = `https://serpapi.com/search?engine=google_hotels&api_key=${api_key}`;

      const response = await axios.get(url, {
        params: { check_in_date, check_out_date, q },
      });

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Error fetching hotel data:", error.message || error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch hotel data.",
        error: error.message || error,
      });
    }
  });

  apiRoutes.post('/bookMyHotel', async (req, res) => {
    const { email, contact, checkIn, checkOut, travellers, hotelPrice, numberOfDays, selectedHotelRating, selectedHotelName } = req.body;
    try {
      const referenceNo = generateReferenceNumber()
      const rent = Number(numberOfDays * hotelPrice);
      const booking = new Hotel({ email, contact, checkIn, checkOut, travellers, referenceNo, hotelPrice, rent, selectedHotelRating, selectedHotelName });
      await booking.save();

      const userSubject = `Hotel Booking Confirmation`;
            const ownerSubject = `New Hotel Booking Received`;
            
            const userText = `
                Dear Traveller,

                Thank you for booking a Hotel with us. Here are your booking details:

                Hotel Name: ${selectedHotelName}
                Check In Date: ${checkIn}
                Check Out Date: ${checkOut}
                Guests: ${travellers}
                Estimated Rent (May Vary on arrival): ${rent}
                Reference Number: ${referenceNo}

                We will contact you shortly to confirm your booking.

                Regards,
                Tuba International
            `;

            const ownerText = `
                Hello,

                A new Hotel Booking has been received. Here are the details:
                Hotel Name: ${selectedHotelName}
                Check In Date: ${checkIn}
                Check Out Date: ${checkOut}
                Guests: ${travellers}
                Estimated Rent (May Vary on arrival): ${rent}
                Reference Number: ${referenceNo}


                Please review and confirm the booking.

                Regards,
                Tuba International
            `;

            await sendEmail(email, userSubject, userText); // Email to the user
            await sendEmail(process.env.OWNER_MAIL, ownerSubject, ownerText); // Email to the owner
            const ownerPhone = "8948626497"; // Replace with the owner's phone number
            const message = `New Hotel Booking Received`;
            await sendSMS(ownerPhone, message);

      res.status(200).send({
        msg: 'Hotel Booked successfully: We will get back to you soon!',
        bookingData: booking
      });
    }

    catch (error) {

      console.error('Error while storing data:', error);
      res.status(500).send({ msg: 'Error while storing data.', error: error.message });
    }

  })

  app.use("/", apiRoutes);
};
