'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourGuideController = require("../../controllers/tour_guide.controller")
const { authenticate } = require("../../middlewares/authenticate")

router.post("", authenticate, asyncHandler(tourGuideController.createTourGuideDefault))
router.get("/", authenticate, asyncHandler(tourGuideController.getAllTourGuide))
router.get("/:user_id/tasks", asyncHandler(tourGuideController.getAllTasksOfTourGuide))

module.exports = router