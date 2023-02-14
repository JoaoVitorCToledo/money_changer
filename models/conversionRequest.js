const mongoose = require('mongoose')

const ConverionRequestSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  original_currency: {
    type: String,
    required: true,
  },
  original_value: {
    type: Number,
    required: true,
  },
  conversion_currency: {
    type: String,
    required: true,
  },
  conversion_rate: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

const ConversionRequest = mongoose.model(
  'ConversionRequest',
  ConverionRequestSchema
)

module.exports = { ConversionRequest }
