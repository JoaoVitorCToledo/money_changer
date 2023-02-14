var express = require('express')
const axios = require('axios')
const { ConversionRequest } = require('../models/conversionRequest')
var router = express.Router()

/* GET lists all conversion requests. */
router.get('/', async function (req, res) {
  const allRequests = await ConversionRequest.find()
  res.status(200).json(allRequests)
})

/* GET lists conversion requests by user. */
router.get('/by_user/:id', async function (req, res) {
  const { id } = req.params
  const allRequests = await ConversionRequest.find({ user_id: id })
  res.status(200).json(allRequests)
})

/* POST creates conversion */
// router.post("/", async (req, res) => {
//   const newConversionRequest = new ConversionRequest({ ...req.body });
//   const insertedConversionRequest = await newConversionRequest.save();
//   return res.status(201).json(insertedConversionRequest);
// });

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
      console.log(response)

      const request_parameters = {
        user_id: req.body.user_id,
        original_currency: response.data.query.from,
        original_value: response.data.query.amount,
        conversion_currency: response.data.query.to,
        conversion_rate: response.data.info.rate,
      }

      // Saving request
      const newConversionRequest = new ConversionRequest(request_parameters)
      newConversionRequest
        .save()
        .then((record) => {
          return res.status(201).json(record)
        })
        .catch((e) => {
          console.log(e.message)
          return res.status(500).send(e.message)
        })
    })
    .catch(function (e) {
      console.log(e.message)
      return res.status(500).send(e.message)
    })
})

module.exports = router
