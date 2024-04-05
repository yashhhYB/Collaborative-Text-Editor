const express = require('express');
const WebSocket = require('ws');
const ShareDB = require('sharedb');
const richText = require('rich-text');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const share = new ShareDB({
    db: require('rich-text').json0
});

const doc = share.connect().get('documents', 'documentId');

// Keep track of connected users
const users = new Map();

wss.on('connection', function connection(ws, req) {
    // Get user information from request (e.g., user ID from authentication)
    const userId = req.headers['user-id'];

    // Add user to the users map
    users.set(userId, ws);

    const stream = new WebSocketJSONStream(ws);
    share.listen(stream);

    // Update user presence indicators for all clients
    broadcastUserPresence();

    // Remove user from the users map on disconnection
    ws.on('close', function() {
        users.delete(userId);
        broadcastUserPresence();
    });
});

// Function to broadcast user presence updates to all clients
function broadcastUserPresence() {
    const onlineUsers = Array.from(users.keys());
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'presence-update', users: onlineUsers }));
        }
    });
}

// Add conflict resolution logic (if implemented)

app.use(express.static('frontend'));

server.listen(8080, function() {
    console.log('Server is running on port 8080');
});
