const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Active users mapping: socket.id -> username
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("Connection established with socket ID:", socket.id);

  // Handle a user joining with a username
  socket.on("join_chat", (username) => {
    // Basic server-side sanitization
    const sanitizedUsername = String(username).trim();
    if (!sanitizedUsername) {
      console.log(`Socket ${socket.id} attempted to join with an empty username.`);
      return;
    }

    // Associate socket ID with username
    activeUsers.set(socket.id, sanitizedUsername);
    console.log(`User registered: ${sanitizedUsername} (${socket.id})`);

    // 1. Send personal welcome system message to the newly connected user
    socket.emit("receive_message", {
      id: `welcome-${Date.now()}`,
      type: "system",
      text: `Welcome to Connectify, ${sanitizedUsername}!`,
      timestamp: new Date().toISOString(),
    });

    // 2. Broadcast join system notification to all other connected clients
    socket.broadcast.emit("receive_message", {
      id: `join-${Date.now()}-${socket.id}`,
      type: "system",
      text: `${sanitizedUsername} joined the chat`,
      timestamp: new Date().toISOString(),
    });

    // 3. Broadcast the updated online users list and count to all clients
    io.emit("online_users", {
      count: activeUsers.size,
      users: Array.from(activeUsers.values()),
    });
  });

  // Handle regular chat messages from clients
  socket.on("send_message", (messageText) => {
    const username = activeUsers.get(socket.id);

    // Security check: Ignore message if user has not registered a username yet
    if (!username) {
      console.log(`Untrusted socket ${socket.id} attempted to send message without username.`);
      return;
    }

    const trimmedText = String(messageText).trim();
    if (!trimmedText) return;

    // Construct the structured message payload on the server
    const messagePayload = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "chat",
      sender: username,
      text: trimmedText,
      timestamp: new Date().toISOString(),
    };

    console.log(`[Message] ${username}: ${trimmedText}`);
    
    // Broadcast the message to all connected clients (including the sender)
    io.emit("receive_message", messagePayload);
  });

  // Handle typing notifications from clients
  socket.on("typing", (payload) => {
    const username = activeUsers.get(socket.id);
    if (!username) return;

    const isTyping = payload && payload.isTyping === true;

    // Broadcast typing state to all OTHER connected clients
    socket.broadcast.emit("user_typing", {
      username,
      isTyping,
    });
  });

  // Handle connection teardown
  socket.on("disconnect", () => {
    const username = activeUsers.get(socket.id);
    
    if (username) {
      // Clean up server-side state
      activeUsers.delete(socket.id);
      console.log(`User unregistered: ${username} (${socket.id})`);

      // 1. Broadcast leave system notification to everyone
      io.emit("receive_message", {
        id: `leave-${Date.now()}-${socket.id}`,
        type: "system",
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });

      // Ensure any typing indicator for this user is cleared for everyone
      io.emit("user_typing", { username, isTyping: false });

      // 2. Broadcast updated online users list to everyone
      io.emit("online_users", {
        count: activeUsers.size,
        users: Array.from(activeUsers.values()),
      });
    } else {
      console.log(`Unregistered socket disconnected: ${socket.id}`);
    }
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});