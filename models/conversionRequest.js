const mongoose = require('mongoose')
const conversionRequestSchema = require('../schemas/conversionRequestSchema')

const ConverionRequestSchema = new mongoose.Schema(conversionRequestSchema)

const ConversionRequest = mongoose.model(
  'ConversionRequest',
  ConverionRequestSchema
)

module.exports = { ConversionRequest }
