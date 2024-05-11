'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const notificationController = require("../../controllers/notification.controller")

router.post("/", authenticate, asyncHandler(notificationController.createnNotification))

module.exports = router