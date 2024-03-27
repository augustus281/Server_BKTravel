'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const  orderController  = require("../../controllers/order.controller")

module.exports = router