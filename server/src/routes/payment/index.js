'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const paymentController = require('../../controllers/payment.controller')
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(paymentController.createPaymentUrl))
router.post("/momo", asyncHandler(paymentController.paymentWithMomo))
router.get("/refund", authenticate,  asyncHandler(paymentController.getRefundPayment))
router.post("/refund/user", authenticate,  asyncHandler(paymentController.refundPaymentForUser))
router.get("/vnpay_ipn", authenticate, asyncHandler(paymentController.getResultPayment))

module.exports = router