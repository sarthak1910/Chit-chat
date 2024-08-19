// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

// Initialize the express app
const app = express();

// Middleware
app.use(cors());
app.use(express.static("Public")); // Serve static files

// Create an HTTP server
const server = http.createServer(app);
const allowedOrigins = [
  "https://chit-chat-1-o4w0.onrender.com",
  "http://localhost:8000/", // Local development
  process.env.RENDER_EXTERNAL_URL, // Render deployment URL
];
// Initialize socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
