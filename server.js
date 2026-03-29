// ==========================
// SIMPLE MULTIPLAYER SERVER
// ==========================

const WebSocket = require("ws");

// Render ke liye port
const PORT = process.env.PORT || 3000;

// WebSocket Server
const wss = new WebSocket.Server({ port: PORT });

let players = {}; // store all players

console.log("🚀 Server running on port", PORT);

// ==========================
// CONNECTION
// ==========================
wss.on("connection", (ws) => {

    const id = Date.now().toString(); // simple unique ID
    players[id] = ws;

    console.log("✅ Player connected:", id);

    // 🔔 Send ID to player (optional future use)
    ws.send(JSON.stringify({
        type: "init",
        id: id
    }));

    // ==========================
    // MESSAGE RECEIVE
    // ==========================
    ws.on("message", (message) => {
        try {
            let data = JSON.parse(message);

            // attach sender id
            data.id = id;

            // 📡 broadcast to others
            for (let pid in players) {
                if (pid !== id && players[pid].readyState === WebSocket.OPEN) {
                    players[pid].send(JSON.stringify(data));
                }
            }

        } catch (err) {
            console.log("❌ Invalid data:", err);
        }
    });

    // ==========================
    // DISCONNECT
    // ==========================
    ws.on("close", () => {
        delete players[id];

        console.log("❌ Player disconnected:", id);

        // 🔔 Tell others player left
        for (let pid in players) {
            if (players[pid].readyState === WebSocket.OPEN) {
                players[pid].send(JSON.stringify({
                    type: "disconnect",
                    id: id
                }));
            }
        }
    });

});
