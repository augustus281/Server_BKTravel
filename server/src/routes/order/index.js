'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const  orderController  = require("../../controllers/order.controller")
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(orderController.createOrderByTourId))
router.post("/carts", authenticate, asyncHandler(orderController.createOrderFromCart))
router.post("/payments", authenticate, asyncHandler(orderController.payOrderDirectly))
router.get("/:user_id/pending", authenticate, asyncHandler(orderController.getPendingOrderByUser))
router.get("/:user_id/complete", authenticate, asyncHandler(orderController.getCompleteOrderByUser))
router.post("/:order_id/vouchers", authenticate, asyncHandler(orderController.applyVoucherToOrder))
router.put("/:order_id/vouchers", authenticate, asyncHandler(orderController.removeVoucherFromOrder))
router.get("/:order_id", authenticate, asyncHandler(orderController.getDetailOrderByUser))
router.get("/:order_id/vouchers", authenticate, asyncHandler(orderController.getVoucherByOrderId))
router.post("/:order_id/vouchers", authenticate, asyncHandler(orderController.removeVoucherFromOrder))

module.exports = router