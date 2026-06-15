const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Assign a Tony-themed screen name for anyone who joins
    const screenName = `Rat_${Math.floor(100 + Math.random() * 900)}`;
    socket.emit('assigned-name', screenName);

    // Welcome message to the user
    socket.emit('system-message', `Welcome to Tony the Rat Chat! Squeak responsibly.`);
    // Broadcast to everyone else
    socket.broadcast.emit('system-message', `${screenName} scuttled into the room.`);

    socket.on('chat-message', (data) => {
        io.emit('chat-message', {
            user: data.user,
            text: data.text
        });
    });

    socket.on('disconnect', () => {
        io.emit('system-message', `${screenName} scurried away.`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Tony the Rat Chat running on http://localhost:${PORT}`);
});
