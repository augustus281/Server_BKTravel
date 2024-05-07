'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const cartController = require('../../controllers/cart.controller')

router.post("/", asyncHandler(cartController.addTourToCart))
router.put("/order-item/child-quantity/increment", asyncHandler(cartController.incrementChildQuantityOrderItem))
router.put("/order-item/child-quantity/decrement", asyncHandler(cartController.decrementChildQuantityOrderItem))
router.put("/order-item/adult-quantity/increment", asyncHandler(cartController.incrementAdultQuantityOrderItem))
router.put("/order-item/adult-quantity/decrement", asyncHandler(cartController.decrementAdultQuantityOrderItem))
router.delete("/:cart_id", asyncHandler(cartController.deleteOrderItem))

module.exports = router