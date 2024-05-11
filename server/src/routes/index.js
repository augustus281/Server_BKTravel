'use strict'

const express = require('express')
const router = express.Router()
const { pushToLogDiscord } = require("../middlewares/index")

router.use(pushToLogDiscord)
router.use('/api/v1/auth', require("./auth"))
router.use('/api/v1/attractions', require("./attraction"))
router.use('/api/v1/destinations', require("./destination"))
router.use('/api/v1/schedules', require("./schedule"))
router.use('/api/v1/users', require("./user"))
router.use('/api/v1/users/carts', require("./cart"))
router.use('/api/v1/users/payment', require("./payment"))
router.use('/api/v1/tours', require("./tour"))
router.use('/api/v1/comments', require("./comment"))
router.use('/api/v1/vouchers', require("./voucher"))
router.use('/api/v1/reviews', require("./review"))
router.use('/api/v1/orders', require("./order"))
router.use('/api/v1/groups', require("./group"))
router.use('/api/v1/messages', require("./message"))
router.use('/api/v1/notifications', require("./notification"))

module.exports = router