'use strict'

const express = require('express')
const router = express.Router()

router.use('/api/v1/auth', require("./auth"))
router.use('/api/v1/attraction', require("./attraction"))
router.use('/api/v1/destination', require("./destination"))
router.use('/api/v1/schedule', require("./schedule"))
router.use('/api/v1/user', require("./user"))
router.use('/api/v1/user/cart', require("./cart"))
router.use('/api/v1/user/payment', require("./payment"))
router.use('/api/v1/tour', require("./tour"))
router.use('/api/v1/voucher', require("./voucher"))

module.exports = router