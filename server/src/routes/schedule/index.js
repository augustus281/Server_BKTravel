'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const scheduleController = require("../../controllers/schedule.controller")
const { authenticate, authenticateAdmin } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(scheduleController.createSchedule))
router.post("/users", authenticate, asyncHandler(scheduleController.createScheduleForUser))
router.put("/", authenticate, asyncHandler(scheduleController.updateScheduleDetails))
router.put("/:id", authenticateAdmin, asyncHandler(scheduleController.updateSchedule))
router.get("/weather", asyncHandler(scheduleController.getWeatherData))

module.exports = router