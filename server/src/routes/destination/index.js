'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const destinationController = require("../../controllers/destination.controller")

router.post("/", asyncHandler(destinationController.loadDestinationsFromJsons))
router.get("/all", asyncHandler(destinationController.getAllDestinations))
router.get("/cities", asyncHandler(destinationController.getAllCities))

module.exports = router