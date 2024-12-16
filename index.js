const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

const port = 5001;
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Initialize Socket.IO
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming user names
    socket.on('send name', (user) => {
        io.emit('send name', user);  // Broadcast to all clients
    });

    // Listen for incoming messages
    socket.on('send message', (chat) => {
        io.emit('send message', chat);  // Broadcast to all clients
    });

    // Handle typing indicator
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);  // Notify all users except the sender
    });

    // Handle stop typing event
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');  // Notify all users to stop showing typing indicator
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
