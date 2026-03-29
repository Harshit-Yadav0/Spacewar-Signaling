const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

// Simple route (optional)
app.get("/", (req, res) => {
    res.send("Spacewar Signaling Server Running 🚀");
});

// WebSocket logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);

        socket.to(room).emit("ready");
    });

    socket.on("signal", (data) => {
        socket.to(data.room).emit("signal", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
