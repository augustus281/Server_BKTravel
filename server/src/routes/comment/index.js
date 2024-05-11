'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const commentController = require("../../controllers/comment.controller")
const formidableMiddleware = require('express-formidable');
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", formidableMiddleware(), authenticate, asyncHandler(commentController.createComment))
router.get("/", asyncHandler(commentController.getCommentsByParentId))
router.delete("/", authenticate, asyncHandler(commentController.deleteComment))

module.exports = router