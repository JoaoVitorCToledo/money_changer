const { ConversionRequest } = require('../models/conversionRequest')

const getUserConverions = async function (req, res) {
  const { id } = req.params
  const allRequests = await ConversionRequest.find({ user_id: id })

  if (allRequests.length > 0) {
    res.status(200).json(allRequests)
  } else {
    res.status(404).json('User not found')
  }
}

module.exports = getUserConverions
