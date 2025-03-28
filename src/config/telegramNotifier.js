const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7749631476:AAF0lWWSiVZa2CWzpViRpMFwzZ1X2bS44TU';
// Either set TELEGRAM_CHAT_ID as an environment variable or hardcode the username with quotes.
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8092585351';

/**
 * Sends a message to Telegram using the Bot API.
 * @param {string} message - The message to send.
 * @returns {Promise} - Axios promise.
 */
function sendTelegramNotification(message) {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  return axios.post(telegramUrl, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML' // Use 'Markdown' if you prefer
  });
}

module.exports = { sendTelegramNotification };
