var express = require('express');
const { ConversionRequest } = require("../models/conversionRequest");
var router = express.Router();


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const allRequests = await ConversionRequest.find();
  res.status(200).json(allRequests);
});

module.exports = router;
