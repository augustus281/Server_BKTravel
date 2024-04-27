'use strict'

const Notification = require("../models/notification.model")
const { findTourById } = require("../services/tour.service")

const app = require("../app")
const UserTour = require("../models/user_tour.model")
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: 'http://localhost:3000',
        METHODS: ["POST", "GET"],
        Credential: true
    }
})

const onlineUsers = [];
io.on("connection", (socket) => {
    console.log("A connection has been made");
    // store in users array in online
    socket.on("online", (userID) => {
        onlineUsers.push({ userId: userID, socketId: socket.id })
    })
})



class NotificationController {
    createnNotification = async (req, res, next) => {
        try {
            const { tour_id, content, title } = req.body

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for notifying!"})

            const newNoti = await Notification.create({
                title: title,
                content: content, 
                tour_id: tour_id
            })


            if (!newNoti) return res.status(400).json({ message: "Failed to create notification!" })

            const userTours = await UserTour.findAll({
                where: { tour_id: tour_id }
                
            })

            const userIDs = userTours.map(user => user.user_id)
            userIDs.forEach(userId => {
                const target = onlineUsers.find(user => user.userId == userId)
                if (target) {
                    io.to(target.socketId).emit("notification", { title, content })
                }
            })

            return res.status(201).json({
                message: "Create notification successfully!",
                data: newNoti
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new NotificationController()