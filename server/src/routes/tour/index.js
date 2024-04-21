'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourController = require("../../controllers/tour.controller")
const commentController = require("../../controllers/comment.controller")
const formidableMiddleware = require('express-formidable');

router.post("/", formidableMiddleware(), asyncHandler(tourController.createTour))
router.get("/all", asyncHandler(tourController.getAllTours))
router.get("/all/waiting", asyncHandler(tourController.getWaitingTours))
router.get("/all/deleted", asyncHandler(tourController.getDeletedTours))
router.get("/all/online", asyncHandler(tourController.getOnlineTours))
router.get("/all/pending", asyncHandler(tourController.getPendingTours))
router.get("/all/success", asyncHandler(tourController.getSuccessTours))
router.get("/all/reject", asyncHandler(tourController.getRejectedTours))
router.get("/search", tourController.searchTour)
router.get("/comments", tourController.getReviewByNumberRate)
router.get("/:tour_id", asyncHandler(tourController.getTour))
router.get("/:tour_id/reviews", asyncHandler(tourController.getAllReviewsByTourId))
router.get("/:tour_id/comments", asyncHandler(tourController.getCommentOfTour))
router.get("/:tour_id/comments/:parent_comment_id", asyncHandler(commentController.getCommentsByParentId))
router.get("/:tour_id/destination", asyncHandler(tourController.getDestinationTour))
router.get("/:tour_id/schedule", asyncHandler(tourController.getScheduleByIdTour))
router.put("/:tour_id", asyncHandler(tourController.updateTour))
router.put("/:tour_id/response", asyncHandler(tourController.responseTour))
router.put("/recover/:tour_id", asyncHandler(tourController.recoverTour))
router.post("/upload/:tour_id", asyncHandler(tourController.updateCoverImageTour))
router.delete("/:tour_id", asyncHandler(tourController.deleteTour))

module.exports = router