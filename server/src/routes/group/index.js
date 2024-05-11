'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const groupController = require("../../controllers/group.controller")
const { authenticate } = require("../../middlewares/authenticate")

router.post("/", authenticate, asyncHandler(groupController.createGroup))
router.get("/", authenticate, asyncHandler(groupController.getAllGroups))
router.get("/tours/:tour_id", authenticate, asyncHandler(groupController.getGroupByTourId))
router.get("/:group_id", authenticate, asyncHandler(groupController.getGroupById))
router.post("/:group_id", authenticate, asyncHandler(groupController.addUserToGroup))
router.post("/:group_id/join", authenticate, asyncHandler(groupController.joinGroup))
router.get("/:group_id/messages", authenticate, asyncHandler(groupController.getAllMessagesFromGroup))

module.exports = router