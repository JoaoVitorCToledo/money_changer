const requestConversion = require('../services/requestConversion')
const saveConversionRequest = require('../services/saveConvertionRequest')

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

      saveConversionRequest(request_parameters)
        .then((record) => {
          return res.status(201).json(record)
        })
        .catch((rejectionArray) => {
          if (rejectionArray[0] === 'VALIDATION_ERROR') {
            return res.status(422).send(e.message)
          } else {
            return res.status(500).send(e.message)
          }
        })
    })
    .catch(function (e) {
      return res.status(500).send(e.message)
    })
}

module.exports = createConversion
