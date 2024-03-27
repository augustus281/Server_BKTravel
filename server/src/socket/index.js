const io = require("socket.io")(8900, {
    cors: {
        origin: `http://localhost:${process.env.CLIENT_PORT}`
    }
})

io.on("connection", (socket) => {
    console.log("A user connected")
})