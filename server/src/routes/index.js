'use strict'

const express = require('express')
const router = express.Router()
const { pushToLogDiscord } = require("../middlewares/index")

router.use(pushToLogDiscord)
router.use('/api/v1/auth', require("./auth"))
router.use('/api/v1/attraction', require("./attraction"))
router.use('/api/v1/destination', require("./destination"))
router.use('/api/v1/schedule', require("./schedule"))
router.use('/api/v1/user', require("./user"))
router.use('/api/v1/user/cart', require("./cart"))
router.use('/api/v1/user/payment', require("./payment"))
router.use('/api/v1/tour', require("./tour"))
router.use('/api/v1/comment', require("./comment"))
router.use('/api/v1/voucher', require("./voucher"))
router.use('/api/v1/review', require("./review"))
router.use('/api/v1/order', require("./order"))
router.use('/api/v1/groups', require("./group"))
router.use('/api/v1/messages', require("./message"))

module.exports = router