const requestConversion = require('../services/requestConversion')
const SaveConversionRequest = require('../services/saveConvertionRequest')

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
      const saveConversionRequest = new SaveConversionRequest()

      saveConversionRequest
        .on('SUCCESS', (record) => {
          return res.status(201).json(record)
        })
        .on('VALIDATION_ERROR', (e) => {
          return res.status(422).send(e.message)
        })
        .on('ERROR', (e) => {
          return res.status(500).send(e.message)
        })

      saveConversionRequest.execute(request_parameters)
    })
    .catch(function (e) {
      return res.status(500).send(e.message)
    })
}

module.exports = createConversion
