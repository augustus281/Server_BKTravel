'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourController = require("../../controllers/tour.controller")
const commentController = require("../../controllers/comment.controller")
const formidableMiddleware = require('express-formidable');
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", formidableMiddleware(), authenticate, asyncHandler(tourController.createTour))
router.get("/all", asyncHandler(tourController.getAllTours))
router.get("/all/waiting", authenticate, asyncHandler(tourController.getWaitingTours))
router.get("/all/deleted", authenticate, asyncHandler(tourController.getDeletedTours))
router.get("/all/online", asyncHandler(tourController.getOnlineTours))
router.get("/all/pending", asyncHandler(tourController.getPendingTours))
router.get("/all/success", asyncHandler(tourController.getSuccessTours))
router.get("/all/reject", asyncHandler(tourController.getRejectedTours))
router.get("/search", tourController.searchTour)
router.get("/comments", authenticate, tourController.getReviewByNumberRate)
router.get("/:tour_id", asyncHandler(tourController.getTour))
router.post("/:tour_id", asyncHandler(tourController.duplicateTour))
router.get("/:tour_id/reviews", asyncHandler(tourController.getAllReviewsByTourId))
router.get("/:tour_id/comments", asyncHandler(tourController.getCommentOfTour))
router.get("/:tour_id/comments/:parent_comment_id", asyncHandler(commentController.getCommentsByParentId))
router.get("/:tour_id/destinations", asyncHandler(tourController.getDestinationTour))
router.get("/:tour_id/schedules", asyncHandler(tourController.getScheduleByIdTour))
router.put("/:tour_id", formidableMiddleware(), authenticate, asyncHandler(tourController.updateTour))
router.put("/:tour_id/response", authenticate, asyncHandler(tourController.responseTour))
router.put("/recover/:tour_id", authenticate, asyncHandler(tourController.recoverTour))
router.post("/:tour_id/upload", authenticate, asyncHandler(tourController.updateCoverImageTour))
router.delete("/:tour_id", authenticate, asyncHandler(tourController.deleteTour))

module.exports = router