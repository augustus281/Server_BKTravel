'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const cartController = require('../../controllers/cart.controller')
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(cartController.addTourToCart))
router.put("/order-item/child-quantity/increment", authenticate, asyncHandler(cartController.incrementChildQuantityOrderItem))
router.put("/order-item/child-quantity/decrement", authenticate, asyncHandler(cartController.decrementChildQuantityOrderItem))
router.put("/order-item/adult-quantity/increment", authenticate, asyncHandler(cartController.incrementAdultQuantityOrderItem))
router.put("/order-item/adult-quantity/decrement", authenticate, asyncHandler(cartController.decrementAdultQuantityOrderItem))
router.delete("/:cart_id", authenticate, asyncHandler(cartController.deleteOrderItem))

module.exports = router