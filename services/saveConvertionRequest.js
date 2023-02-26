const { ConversionRequest } = require('../models/conversionRequest')

const saveConversionRequest = (params) => {
  return new Promise((resolve, reject) => {
    const conversionRequest = new ConversionRequest(params)

    conversionRequest
      .save()
      .then((conversionRequest) => {
        resolve(conversionRequest)
      })
      .catch((error) => {
        console.log(error.name)
        if (error.name === 'ValidationError') {
          return reject(['VALIDATION_ERROR', error])
        }
        reject(['ERROR', error])
      })
  })
}

module.exports = saveConversionRequest
