'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const attractionController = require("../../controllers/attraction.controller")

router.get("/all", asyncHandler(attractionController.getAllAttractionsByDestination))

module.exports = router