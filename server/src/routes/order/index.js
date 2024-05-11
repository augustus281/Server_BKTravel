'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const  orderController  = require("../../controllers/order.controller")

router.post("/", asyncHandler(orderController.createOrderByTourId))
router.post("/carts", asyncHandler(orderController.createOrderFromCart))
router.post("/payments", asyncHandler(orderController.payOrderDirectly))
router.get("/:user_id/pending", asyncHandler(orderController.getPendingOrderByUser))
router.get("/:user_id/complete", asyncHandler(orderController.getCompleteOrderByUser))
router.post("/:order_id/vouchers", asyncHandler(orderController.applyVoucherToOrder))
router.put("/:order_id/vouchers", asyncHandler(orderController.removeVoucherFromOrder))
router.get("/:order_id", asyncHandler(orderController.getDetailOrderByUser))
router.get("/:order_id/vouchers", asyncHandler(orderController.getVoucherByOrderId))
router.post("/:order_id/vouchers", asyncHandler(orderController.removeVoucherFromOrder))

module.exports = router