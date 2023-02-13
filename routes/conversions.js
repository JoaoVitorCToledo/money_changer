var express = require('express');
const { ConversionRequest } = require("../models/conversionRequest");
var router = express.Router();


/* GET conversion request listing. */
router.get('/', async function(req, res) {
  const allRequests = await ConversionRequest.find();
  res.status(200).json(allRequests);
});

/* POST creates conversion */
router.post("/", async (req, res) => {
  const newConversionRequest = new ConversionRequest({ ...req.body });
  const insertedConversionRequest = await newConversionRequest.save();
  return res.status(201).json(insertedConversionRequest);
});

module.exports = router;
