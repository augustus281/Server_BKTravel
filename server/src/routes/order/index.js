'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const  orderController  = require("../../controllers/order.controller")

router.post("/", asyncHandler(orderController.createOrderByTourId))
router.post("/:order_id/applyVoucher", asyncHandler(orderController.applyVoucherToOrder))

module.exports = router