'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const groupController = require("../../controllers/group.controller")

router.post("/", asyncHandler(groupController.createGroup))
router.get("/", asyncHandler(groupController.getAllGroups))
router.get("/tours/:tour_id", asyncHandler(groupController.getGroupByTourId))
router.get("/:group_id", asyncHandler(groupController.getGroupById))
router.post("/:group_id", asyncHandler(groupController.addUserToGroup))
router.get("/:group_id/messages", asyncHandler(groupController.getAllMessagesFromGroup))

module.exports = router