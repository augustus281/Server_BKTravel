'use strict'

const express = require("express")
const { asyncHandler } = require("../../auth/checkAuth")
const router = express.Router()
const userController = require("../../controllers/user.controller")
const  orderController  = require("../../controllers/order.controller")
const { authenticate } = require("../../middlewares/authenticate")
const upload = require("../../config/cloudinary.config")

router.get("/:user_id", authenticate, asyncHandler(userController.getInfoUser))
router.get("/:user_id/completed_order", asyncHandler(orderController.getCompleteOrderByUser))
router.get("/:user_id/failed_order", asyncHandler(orderController.getFailedOrderByUser))
router.post("/change-password", authenticate, asyncHandler(userController.changePassword))
router.get("/wishlist/:user_id", asyncHandler(userController.getWishlistByCustomer))
router.post("/wishlist/:user_id/tours/:tour_id", asyncHandler(userController.addTourToWishlist))
router.delete("/wishlist/:user_id/tours/:tour_id", asyncHandler(userController.removeTourFromWishlist))
router.put("/update/:user_id", authenticate, asyncHandler(userController.updateInfoUser))
router.post("/upload/:user_id", authenticate, upload.single("avatar"), asyncHandler(userController.uploadAvatar))
router.post("/forgot-password", asyncHandler(userController.forgotPassword))
router.post("/reset-password", asyncHandler(userController.resetPassword))

module.exports = router