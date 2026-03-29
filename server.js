const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

let players = {};

wss.on("connection", (ws) => {
    const id = Date.now().toString(); // simple unique id
    players[id] = ws;

    console.log("Player connected:", id);

    ws.on("message", (message) => {
        let data = JSON.parse(message);

        // attach sender id
        data.id = id;

        // broadcast to all except sender
        for (let pid in players) {
            if (pid !== id) {
                players[pid].send(JSON.stringify(data));
            }
        }
    });

    ws.on("close", () => {
        delete players[id];
        console.log("Player disconnected:", id);
    });
});
