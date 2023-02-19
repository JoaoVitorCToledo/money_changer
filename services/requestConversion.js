const axios = require('axios')

const requestConversion = function (to, from, amount) {
  // Parameters for the conversion request
  const url = 'https://api.apilayer.com/exchangerates_data/convert'
  const config = {
    headers: {
      apikey: '9Mzq2PAfzNCXosePrNVijjmuzv3bDkOe',
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
