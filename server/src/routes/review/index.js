'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const reviewController = require("../../controllers/review.controller")
const formidableMiddleware = require('express-formidable');

router.use(formidableMiddleware());
router.post("/", asyncHandler(reviewController.creatReview))

module.exports = router