'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const reviewController = require("../../controllers/review.controller")
const formidableMiddleware = require('express-formidable');
const { authenticate } = require("../../middlewares/authenticate")

router.use(formidableMiddleware());
router.post("/", authenticate, asyncHandler(reviewController.creatReview))

module.exports = router