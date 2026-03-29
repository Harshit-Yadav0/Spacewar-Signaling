const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" }
});

app.get("/", (req, res) => {
    res.send("Relay Server Running 🚀");
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);
    });

    // 🔥 GAME DATA RELAY
    socket.on("game_data", (data) => {
        socket.to(data.room).emit("game_data", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
