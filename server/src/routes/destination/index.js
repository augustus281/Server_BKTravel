'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const destinationController = require("../../controllers/destination.controller")
const { authenticate } = require("../../middlewares/authenticate")
const attractionController = require("../../controllers/attraction.controller")

router.post("/", authenticate, asyncHandler(destinationController.loadDestinationsFromJsons))
router.get("/all", asyncHandler(destinationController.getAllDestinations))
router.get("/cities", asyncHandler(destinationController.getAllCities))
router.get("/hotels", asyncHandler(attractionController.getAllHotelsByDestination))

module.exports = router