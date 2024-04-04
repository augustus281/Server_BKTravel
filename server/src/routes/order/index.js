'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const  orderController  = require("../../controllers/order.controller")

router.post("/", asyncHandler(orderController.createOrderByTourId))
router.post("/create-from-cart", asyncHandler(orderController.createOrderFromCart))
router.post("/payment", asyncHandler(orderController.payOrderDirectly))
router.get("/:user_id/pending", asyncHandler(orderController.getPendingOrderByUser))
router.get("/:user_id/complete", asyncHandler(orderController.getCompleteOrderByUser))
router.post("/:order_id/applyVoucher", asyncHandler(orderController.applyVoucherToOrder))
router.put("/removeVoucher", asyncHandler(orderController.removeVoucherFromOrder))
router.get("/:order_id", asyncHandler(orderController.getDetailOrderByUser))

module.exports = router