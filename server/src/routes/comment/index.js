'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const commentController = require("../../controllers/comment.controller")

router.post("/", asyncHandler(commentController.createComment))
router.get("/", asyncHandler(commentController.getCommentsByParentId))

module.exports = router