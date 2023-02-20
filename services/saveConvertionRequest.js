const EventEmitter = require('events')
const { ConversionRequest } = require('../models/conversionRequest')

module.exports = class SaveConversionRequest extends EventEmitter {
  execute(params) {
    const conversionRequest = new ConversionRequest(params)

    conversionRequest
      .save()
      .then((conversionRequest) => {
        this.emit('SUCCESS', conversionRequest)
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return this.emit('VALIDATION_ERROR', error)
        }
        this.emit('ERROR', error)
      })
  }
}
