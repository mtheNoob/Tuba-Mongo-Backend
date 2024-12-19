const express = require("express");
const axios = require("axios");
const Hotel = require('../models/flightModel');
const sendEmail = require('../config/mailer');
const sendSMS = require("../config/sms_sender"); 

function generateReferenceNumber() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `REF${timestamp}${randomSuffix}`;
}

module.exports = function (app) {
  const apiRoutes = express.Router();

// apiRoutes.post("/getFlightData", async (req, res) => {
//     const {
//       departure_id,
//       arrival_id,
//       outbound_date,
//       return_date, // Optional
//       currency,
//       type, // Type: 1 (Round trip) or 2 (One-way)
//     } = req.body;
  
//     // Validate required parameters
//     if (!departure_id || !arrival_id || !outbound_date || !currency || typeof type === "undefined") {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required parameters: departure_id, arrival_id, outbound_date, currency, type",
//       });
//     }
  
//     // Additional validation for round trips
//     if (type === 1 && !return_date) {
//       return res.status(400).json({
//         success: false,
//         message: "return_date is required for round trips (type: 1).",
//       });
//     }
  
//     try {
//       const apiKey = "7c152a9bce40a546409efdef67b8403723f9a26ac0c2a3716d463e60e2c97818";
//       const url = `https://serpapi.com/search?engine=google_flights`;
  
//       // Build the request payload
//       const params = {
//         api_key: apiKey,
//         engine: "google_flights",
//         hl: "en",
//         gl: "us",
//         departure_id,
//         arrival_id,
//         outbound_date,
//         currency,
//         type, // Pass the type directly
//       };
  
//       // Include return_date only for round trips
//       if (type === 1) {
//         params.return_date = return_date;
//       }
  
//       const response = await axios.get(url, { params });
  
//       const simplifiedData = response.data.best_flights?.map((flight) => {
//         const firstLeg = flight.flights[0];
//         const lastLeg = flight.flights[flight.flights.length - 1];
  
//         const departureTime = new Date(firstLeg?.departure_airport?.time);
//         const arrivalTime = new Date(lastLeg?.arrival_airport?.time);
//         const durationMinutes = (arrivalTime - departureTime) / (1000 * 60); // Calculate duration in minutes
  
//         return {
//           airline: firstLeg?.airline || "Unknown Airline",
//           departure_airport: firstLeg?.departure_airport?.name || "Unknown Departure Airport",
//           arrival_airport: lastLeg?.arrival_airport?.name || "Unknown Arrival Airport",
//           departure_time: firstLeg?.departure_airport?.time || "Unknown Departure Time",
//           arrival_time: lastLeg?.arrival_airport?.time || "Unknown Arrival Time",
//           duration: durationMinutes
//             ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
//             : "Unknown Duration",
//           fare: flight.price || "Unknown Fare",
//           image_link: firstLeg?.airline_logo || "No Image Available",
//         };
//       }) || [];
  
//       return res.status(200).json({
//         success: true,
//         flights: simplifiedData,
//       });
//     } catch (error) {
//       console.error("Error fetching flight data:", error.message || error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to fetch flight data.",
//         error: error.message || error,
//       });
//     }
//   });
  
apiRoutes.post("/getFlightData", async (req, res) => {
  const {
    departure_id,
    arrival_id,
    outbound_date,
    return_date, 
    currency,
    type, // Type: 1 (Round trip) or 2 (One-way)
    travel_class = 1, // Default to 1 (economy)
    adults = 1,
    children = 0, 
  } = req.body;

  if (!departure_id || !arrival_id || !outbound_date || !currency || typeof type === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: departure_id, arrival_id, outbound_date, currency, type",
    });
  }

  if (type === 2 && !return_date) {
    return res.status(400).json({
      success: false,
      message: "return_date is required for round trips (type: 1).",
    });
  }

  // Validate travel_class
  if (![1, 2, 3, 4].includes(travel_class)) {
    return res.status(400).json({
      success: false,
      message: "Invalid value for travel_class. Allowed values are 1 (economy), 2 (premium economy), 3 (business), and 4 (first).",
    });
  }

  try {
    
    // const apiKey = "7c152a9bce40a546409efdef67b8403723f9a26ac0c2a3716d463e60e2c97818";
        const apiKey = "f78e0b13280663ce45375f3ef7ef6052972494a114044918779c486f6c5df7bd";

    const url = `https://serpapi.com/search?engine=google_flights`;

    // Build the request payload
    const params = {
      api_key: apiKey,
      engine: "google_flights",
      hl: "en",
      gl: "us",
      departure_id,
      arrival_id,
      outbound_date,
      currency,
      type, // Pass the type directly
      travel_class, // Add travel_class
      adults, // Add adults
      children, // Add children
    };

    // Include return_date only for round trips
    if (type === 2) {
      params.return_date = return_date;
    }

    const response = await axios.get(url, { params });

    const simplifiedData = response.data.best_flights?.map((flight) => {
      const firstLeg = flight.flights[0];
      const lastLeg = flight.flights[flight.flights.length - 1];

      const departureTime = new Date(firstLeg?.departure_airport?.time);
      const arrivalTime = new Date(lastLeg?.arrival_airport?.time);
      const durationMinutes = (arrivalTime - departureTime) / (1000 * 60); // Calculate duration in minutes

      return {
        airline: firstLeg?.airline || "Unknown Airline",
        departure_airport: firstLeg?.departure_airport?.name || "Unknown Departure Airport",
        arrival_airport: lastLeg?.arrival_airport?.name || "Unknown Arrival Airport",
        departure_time: firstLeg?.departure_airport?.time || "Unknown Departure Time",
        arrival_time: lastLeg?.arrival_airport?.time || "Unknown Arrival Time",
        duration: durationMinutes
          ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
          : "Unknown Duration",
        fare: flight.price || "Unknown Fare",
        // fare: flight?.price?.value || flight.price || "Price not available",

        image_link: firstLeg?.airline_logo || "No Image Available",
      };
    }) || [];

    return res.status(200).json({
      success: true,
      flights: simplifiedData,
    });
  } catch (error) {
    console.error("Error fetching flight data:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flight data.",
      error: error.message || error,
    });
  }
});

// apiRoutes.post("/autosuggest", async (req, res) => {
//   const { query, limit = 10 } = req.body; // Extract query and limit from req.body
// console.log("Payload",req.body)
//   // Validate required parameters
//   if (!query) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required parameter: query",
//     });
//   }

//   try {
//     // Build the request URL
//     const url = `https://flights-explorer.makemytrip.com/autosuggest`;

//     // Make the GET request to the external API with query and limit
//     const response = await axios.get(url, {
//       params: { query, limit },
//     });

//     // Respond with the data from the API
//     return res.status(200).json({
//       success: true,
//       suggestions: response.data, // Forward the suggestions directly
//     });
//   } catch (error) {
//     console.error("Error fetching auto-suggestions:", error.message || error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch auto-suggestions.",
//       error: error.message || error,
//     });
//   }
// });

apiRoutes.post("/autosuggest", async (req, res) => {
  const { query, limit = 10 } = req.body; // Extract query and limit from req.body
  console.log("Payload", req.body);

  // Validate required parameters
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter: query",
    });
  }

  try {
    // Build the request URL
    const url = `https://flights-explorer.makemytrip.com/autosuggest`;

    // Make the GET request to the external API with query and limit
    const response = await axios.get(url, {
      params: { query, limit },
    });

    // Transform the API response
    const mainAirports = response.data.r.map((item) => ({
      code: item.iata,
      name: `${item.iata} - ${item.n} - ${item.ct}`,
    }));

    const nearbyAirports = response.data.r
      .flatMap((item) => item.nb || []) // Extract and flatten nearby airports
      .map((nearby) => ({
        code: nearby.iata,
        name: `${nearby.n} - ${nearby.ct}`,
        distance: nearby.d, // Include distance if available
      }));

    // Respond with the transformed data
    return res.status(200).json({
      success: true,
      mainAirports,
      nearbyAirports,
    });
  } catch (error) {
    console.error("Error fetching auto-suggestions:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch auto-suggestions.",
      error: error.message || error,
    });
  }
});



  app.use("/", apiRoutes);
};
