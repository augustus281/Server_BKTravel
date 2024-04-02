'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const commentController = require("../../controllers/comment.controller")
const formidableMiddleware = require('express-formidable');

router.post("/", formidableMiddleware(), asyncHandler(commentController.createComment))
router.get("/", asyncHandler(commentController.getCommentsByParentId))
router.delete("/", asyncHandler(commentController.deleteComment))

module.exports = router