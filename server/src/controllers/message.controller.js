'use strict'

const Message = require("../models/message.model")
const { findGroupByID } = require("../services/group.service")
const { findUserById } = require("../services/user.service")

class MessageController {
    createMessage = async(req, res, next) => {
        try {
            const { content, group_id, user_id } = req.body

            const group = await findGroupByID(group_id)
            if (!group) return res.status(404).json({ message: "Not found group!" })

            const user = await findGroupByID(user_id)
            if (!user) return res.status(404).json({ message: "Not found user" })

            const newMessage = await Message.create({
                content: content,
                user_id: user_id,
                group_id: group_id
            })

            if (!newMessage) return res.status(400).json({ message: "Failed to create message!" })
            return res.status(200).json({
                message: "Create message successfully!",
                data: newMessage
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    deleteMessage = async (req, res, next) => {
        try {
            const { groud_id, message_id } = req.params.groud_id;

            const group = await findGroupByID(groud_id)
            if (!group) return res.status(404).json({ message: "Not found group!" })

            const message = await Message.findOne({ where: { message_id: message_id }})
            if (!message) return res.status(404).json({ message: "Not found message"})

            await message.destroy()

            return res.status(200).json({ message: "Delete message successfully!" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new MessageController()