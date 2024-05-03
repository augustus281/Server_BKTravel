'use strict'

const { BadRequestError } = require("../core/error.response")
const Group = require("../models/group.model")
const GroupUser = require("../models/group_member.model")
const Message = require("../models/message.model")
const User = require("../models/user.model")
const { findGroupByID } = require("../services/group.service")
const { checkOrderTour, checkCompleteOrder } = require("../services/order.service")
const { findTourById } = require("../services/tour.service")
const { findUserById, checkCartByUser } = require("../services/user.service")

class GroupController {
    createGroup = async (req, res, next) => {
        try {
            const { name, tour_id } = req.body

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const newGroup = await Group.create({
                name: name,
                number: 0,
                tour_id: tour_id
            })
    
            if (!newGroup) return res.status(400).json({ message: "Failed to create tour!" })
            return res.status(201).json({   
                message: "Create group successfully!",
                data: newGroup
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getAllGroups = async (req, res, next) => {
        try {
            const groups = await Group.findAll()
            return res.status(200).json({
                message: "Get all groups successfully!",
                groups: groups
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    
    getGroupById = async (req, res, next) => {
        try {
            const group_id = req.params.group_id;
            const group = await findGroupByID(group_id)
            if (!group) return res.status(404).json({ message: "Not found group!" })

            return res.status(200).json({
                message: "Get group successfully!",
                data: group
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getGroupByTourId = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour" })

            const group = await Group.findOne({
                where: {
                    tour_id: tour_id
                }
            })

            if (!group) return res.status(404).json({ message: "Not found group by tour_id "})
            return res.status(200).json({
                message: "Get group by tour_id successfully!",
                group: group
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    addUserToGroup = async (req, res, next) => {
        try {
            const group_id = req.params.group_id
            const { user_id } = req.body
    
            const user = await findUserById(user_id)
            if (!user) return res.status(404).json({ message: "Not found user" })
            
            const group = await findGroupByID(group_id)
            if (!group) return res.status(404).json({ message: "Not found group to join" })
    
            const joined = await GroupUser.create({
                group_id: group_id,
                user_id: user_id
            })

            group.number++;
            await group.save();
    
            if (!joined) return res.status(400).json({ message: "Failed to join group" })
            return res.status(200).json({ message: "Add user to group chat successfully!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    joinGroup = async (req, res, next) => {
        try {
            const group_id = req.params.group_id
            const { user_id, tour_id, order_id } = req.body

            console.log(req.body)
    
            const user = await findUserById(user_id)
            if (!user) return res.status(404).json({ message: "Not found user" })

            // check order tour
            const orderTour = await checkOrderTour(order_id, tour_id);
            if (!orderTour) throw new BadRequestError("Can't join group")

            // check order is completed
            const completeOrder = await checkCompleteOrder(order_id, user_id);
            if (!completeOrder) throw new BadRequestError("Order is not completed to join group chat!")
            
            const group = await findGroupByID(group_id)
            if (!group) return res.status(404).json({ message: "Not found group to join" })
    
            const joined = await GroupUser.create({
                group_id: group_id,
                user_id: user_id
            })

            group.number++;
            await group.save();
    
            if (!joined) return res.status(400).json({ message: "Failed to join group" })
            return res.status(200).json({ message: "Join group chat successfully!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getAllMessagesFromGroup = async (req, res, next) => {
        try {
            const group_id = req.params.group_id

            const group = await findGroupByID(group_id)
            if (!group) return res.status(404).json({ message: "Not found group!" })

            const messages = await Message.findAll({
                where: { 
                    group_id: group_id
                }
            })

            return res.status(200).json({
                message: "Get all messages of group successfully!",
                data: messages
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }

    }
}

module.exports = new GroupController()