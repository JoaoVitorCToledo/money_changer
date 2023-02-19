const { ConversionRequest } = require('../models/conversionRequest')
const requestConversion = require('../services/requestConversion')
// POST makes request to api service and saves the return
const createConversion = (req, res) => {
  // Conversion request
  requestConversion(req.body.to, req.body.from, req.body.amount)
    .then(function (response) {
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
      new ConversionRequest(request_parameters)
        .save(request_parameters)
        .then((record) => {
          return res.status(201).json(record)
        })
        .catch((e) => {
          if (e.name === 'ValidationError') {
            return res.status(422).send(e.message)
          }
          return res.status(500).send(e.message)
        })
    })
    .catch(function (e) {
      return res.status(500).send(e.message)
    })
}

module.exports = createConversion
