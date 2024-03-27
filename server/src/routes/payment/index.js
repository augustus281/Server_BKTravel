'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const paymentController = require('../../controllers/payment.controller')

router.post("/", asyncHandler(paymentController.createPaymentUrl))
router.get("/vnpay_ipn", asyncHandler(paymentController.getResultPayment))

module.exports = router