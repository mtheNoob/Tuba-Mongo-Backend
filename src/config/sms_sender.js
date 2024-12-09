const axios = require("axios");

async function sendSMS(phoneNumber, message) {
  try {
    const response = await axios.post("https://textbelt.com/text", {
      phone: phoneNumber,
      message: message,
      key: process.env.TEXTBELT_API_KEY, // Store the key in your .env file
    });
    
    if (response.data.success) {
      console.log(`SMS sent successfully to ${phoneNumber}`);
    } else {
      console.log(`Failed to send SMS to ${phoneNumber}: ${response.data.error}`);
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

module.exports = sendSMS;
