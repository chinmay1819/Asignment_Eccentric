const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Store a mapping of socket IDs to room names
const socketToRoom = {};

io.on('connection', (socket) => {
    console.log('Connected...');
    socket.on('join', (room) => {
 
        const previousRoom = socketToRoom[socket.id];
        if (previousRoom) {
            socket.leave(previousRoom);
        }

        socket.join(room);
        socketToRoom[socket.id] = room;

    });

    // Handle sending messages in a specific room
    socket.on('message', (msg) => {
        const room = socketToRoom[socket.id];
        if (room) {
            // Emit the message to all clients in the same room
            io.to(room).emit('message', msg);
        }
    });
});
