const express = require("express");
const axios = require("axios");

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
      const apiKey = "7c152a9bce40a546409efdef67b8403723f9a26ac0c2a3716d463e60e2c97818"; // Replace with your actual API key
      const url = `https://serpapi.com/search?engine=google_hotels&api_key=${apiKey}`;

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

  app.use("/", apiRoutes);
};
