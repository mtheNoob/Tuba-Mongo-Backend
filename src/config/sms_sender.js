const axios = require("axios");
require("dotenv").config();

const sendSMS = async (phone, message) => {
  const API_KEY = process.env.FAST2SMS_API_KEY;

  if (!API_KEY) {
    console.error("Fast2SMS API key is missing. Please set it in the .env file.");
    return;
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        "authorization": API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        route: "v3", 
        sender_id: "TXTIND",
        message: message,
        language: "english",
        numbers: phone,
      },
    });

    if (response.data && response.data.return) {
      console.log("SMS sent successfully:", response.data);
    } else {
      console.error("Failed to send SMS:", response.data);
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = sendSMS;




// const axios = require("axios");

// async function sendSMS(phoneNumber, message) {
//   try {
//     const response = await axios.post("https://textbelt.com/text", {
//       phone: phoneNumber,
//       message: message,
//       key: process.env.TEXTBELT_API_KEY, // Store the key in your .env file
//     });
    
//     if (response.data.success) {
//       console.log(`SMS sent successfully to ${phoneNumber}`);
//     } else {
//       console.log(`Failed to send SMS to ${phoneNumber}: ${response.data.error}`);
//     }
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//   }
// }

// module.exports = sendSMS;
