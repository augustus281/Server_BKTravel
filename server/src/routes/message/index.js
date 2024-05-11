'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const messageController = require("../../controllers/message.controller")
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(messageController.createMessage))
router.delete("/", authenticate, asyncHandler(messageController.deleteMessage))

module.exports = router