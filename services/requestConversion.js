const axios = require('axios')

const requestConversion = function (to, from, amount) {
  // Parameters for the conversion request
  const url = process.env.EXCHANGE_URL
  const config = {
    headers: {
      apikey: process.env.API_KEY,
    },
    params: {
      to: to,
      from: from,
      amount: amount,
    },
  }

  return axios.get(url, config)
}

module.exports = requestConversion
