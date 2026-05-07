require('dotenv').config()

module.exports = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GRUPO_ID: process.env.GRUPO_ID,
  RADIO_KM: parseFloat(process.env.RADIO_KM) || 3
}