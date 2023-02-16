const express = require('express')
const router = express.Router()

const createConversion = require('../controller/conversions')
const getUserConverions = require('../controller/users')

router.get('/users/:id/conversions', getUserConverions)

router.post('/conversions', createConversion)

module.exports = router
