'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const scheduleController = require("../../controllers/schedule.controller")

router.post("/", asyncHandler(scheduleController.createSchedule))

module.exports = router