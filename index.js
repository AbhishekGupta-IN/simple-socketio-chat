const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Route for the chat application
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    // Broadcast the message to all connected clients
    io.emit('chat message', { username: socket.username, message: msg });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
        // Broadcast to all connected clients that a user has left
        io.emit('user left', socket.username);
    }
  });
  
  // Handle join
  socket.on('join', (username) => {
    socket.username = username;
    // Broadcast to all connected clients that a new user has joined
    io.emit('user joined', username);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
