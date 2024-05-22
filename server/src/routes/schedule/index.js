'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const scheduleController = require("../../controllers/schedule.controller")
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(scheduleController.createSchedule))
router.put("/:id", authenticate, asyncHandler(scheduleController.updateScheduleDetails))
router.get("/weather", asyncHandler(scheduleController.getWeatherData))

module.exports = router