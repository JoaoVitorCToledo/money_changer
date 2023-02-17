const { ConversionRequest } = require('../models/conversionRequest')

const getUserConverions = async function (req, res) {
  const { id } = req.params
  const allRequests = await ConversionRequest.find({ user_id: id })
  res.status(200).json(allRequests)
}

module.exports = getUserConverions
