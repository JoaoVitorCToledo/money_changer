var express = require('express')
const axios = require('axios')
const { ConversionRequest } = require('../models/conversionRequest')
var router = express.Router()

// POST makes request to api service and saves the return
router.post('/', async (req, res) => {
  // Parameters for the conversion request
  const url = 'https://api.apilayer.com/exchangerates_data/convert'
  const config = {
    headers: {
      apikey: '9Mzq2PAfzNCXosePrNVijjmuzv3bDkOe',
    },
    params: {
      to: req.body.to,
      from: req.body.from,
      amount: req.body.amount,
    },
  }

  // Conversion request
  axios
    .get(url, config)
    .then(async function (response) {
      const data = response.data

      const request_parameters = {
        user_id: req.body.user_id,
        original_currency: data.query.from,
        original_value: data.query.amount,
        conversion_currency: data.query.to,
        conversion_rate: data.info.rate,
        converted_value: data.query.amount * data.info.rate,
      }

      // Saving request
      const newConversionRequest = new ConversionRequest(request_parameters)
      newConversionRequest
        .save()
        .then((record) => {
          return res.status(201).json(record)
        })
        .catch((e) => {
          return res.status(500).send(e.message)
        })
    })
    .catch(function (e) {
      return res.status(500).send(e.message)
    })
})

module.exports = router
