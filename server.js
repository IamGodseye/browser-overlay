// server.js
const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Serve static files for overlay
app.use(express.static('public'));

// WebSocket for real-time updates
const wss = new WebSocket.Server({ noServer: true });

app.get('/overlay', (req, res) => {
    res.sendFile(__dirname + '/public/overlay.html');
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Store connected clients and active super chats
const clients = new Set();
let currentBanner = 'Powered by Fanverz';
let activeSuperChats = [];

// Broadcast messages to all connected clients
wss.on('connection', (ws) => {
    clients.add(ws);

    // Send current banner
    ws.send(JSON.stringify({
        type: 'banner',
        text: currentBanner
    }));

    // Send all active super chats in one message
    ws.send(JSON.stringify({
        type: 'initial-super-chats',
        chats: activeSuperChats.map(chat => ({
            message: chat.message,
            id: chat.id
        }))
    }));

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            // Update stored state
            if (parsedMessage.type === 'banner') {
                currentBanner = parsedMessage.text;
                // Broadcast banner update
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            } else if (parsedMessage.type === 'super-chat') {
                const chatId = Date.now().toString();
                const newChat = {
                    id: chatId,
                    message: parsedMessage.message,
                    timestamp: Date.now()
                };

                activeSuperChats.unshift(newChat);

                // Broadcast new super chat to all clients
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'super-chat',
                            message: newChat.message,
                            id: chatId
                        }));
                    }
                });

                // Remove super chat after 3 minutes
                setTimeout(() => {
                    const index = activeSuperChats.findIndex(chat => chat.id === chatId);
                    if (index !== -1) {
                        activeSuperChats.splice(index, 1);
                        // Notify clients to remove this specific super chat
                        clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'remove-super-chat',
                                    id: chatId
                                }));
                            }
                        });
                    }
                }, 180000); // 3 minutes in milliseconds
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Remove disconnected clients
    ws.on('close', () => {
        clients.delete(ws);
    });
});
