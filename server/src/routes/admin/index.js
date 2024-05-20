'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourGuideController = require("../../controllers/tour_guide.controller")
const adminController = require("../../controllers/admin.controller")
const { authenticateAdmin } = require("../../middlewares/authenticate")

router.post("/manage-account", authenticateAdmin, asyncHandler(tourGuideController.createTourGuideAccount))
router.get("/total-bookednumber", authenticateAdmin, asyncHandler(adminController.getCustomerNumber))
router.get("/total-revenue", authenticateAdmin, asyncHandler(adminController.getTotalRevenue))
router.post("/task", authenticateAdmin, asyncHandler(tourGuideController.assignTourToTourGuide))

module.exports = router