var express = require('express');
var router = express.Router();
const { ConversionRequest } = require("../models/conversionRequest");

router.get('/:id/conversions', async function(req, res) {
  const { id } = req.params;
  const allRequests = await ConversionRequest.find({user_id: id});
  res.status(200).json(allRequests);
});

module.exports = router;
