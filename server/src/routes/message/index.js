'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const messageController = require("../../controllers/message.controller")

router.post("/", asyncHandler(messageController.createMessage))
router.delete("/", asyncHandler(messageController.deleteMessage))

module.exports = router