const app = require("../app");
const Group = require("../models/group.model")
const GroupUser = require("../models/group_member.model");

const server = require("http").createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: 'http://localhost:3000',
        METHODS: ["POST", "GET"],
        Credential: true
    }
})

// using socket
const onlineUsers = [];
io.on("connection", (socket) => {
    console.log("A connection has been made");
    // store in users array in online
    socket.on("online", (userID) => {
        onlineUsers.push({ userId: userID, socketId: socket.id })
    })

    // add member to group
    socket.on("add member", async (userID) => {
        const target = onlineUsers.find((user) => user.userId == userID)

        if (target) {
            const groupIDs = await GroupUser.findAll({
                attributes: ["group_id"],
                where: { user_id: userID }
            })

            const allGroups = [];
            for (let i = 0; i < groupIDs.length; i++) {
                allGroups.push(groupIDs[i].group_id);
            }

            const groups = await Group.findAll({
                attributes: ["group_id", "name", "description"],
                where: { group_id: allGroups },
            });

            console.log(target.socketId);
            io.to(target.socketId).emit("groupData", groups);
        }
    })

    // make user join a room
    socket.on("join", function (room) {
        socket.join(room);
    });

    // broadcast the message to a room
    socket.on("send message", (msg, room) => {
        io.in(room).emit("room message", msg);
    });

    // on disconnection
    socket.on("disconnect", () => {
        console.log("A disconnection has been made");
    });

})

