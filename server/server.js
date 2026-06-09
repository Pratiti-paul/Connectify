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
// Recent messages store to track receipts: messageId -> { sender, delivered: Set, read: Set }
const recentMessages = new Map();

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
      deliveredBy: [],
      readBy: [],
    };

    // (status tracking initialized below in recentMessages)

    console.log(`[Message] ${username}: ${trimmedText}`);
    
    // Store message for receipts tracking
    recentMessages.set(messagePayload.id, {
      sender: username,
      delivered: new Set(),
      read: new Set(),
      text: trimmedText,
      deleted: false,
      editedAt: null,
    });

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

  // Handle delivered receipts from clients
  socket.on("delivered", ({ messageId }) => {
    const username = activeUsers.get(socket.id);
    if (!username || !messageId) return;

    const entry = recentMessages.get(messageId);
    if (!entry) return;

    if (!entry.delivered.has(username)) {
      entry.delivered.add(username);
      // Broadcast delivered update to all clients
      io.emit("message_delivered", { messageId, username });
    }
  });

  // Handle message edits
  socket.on("edit_message", ({ messageId, newText }) => {
    const username = activeUsers.get(socket.id);
    if (!username || !messageId || typeof newText !== "string") return;

    const entry = recentMessages.get(messageId);
    if (!entry) return;

    // Only allow the original sender to edit
    if (entry.sender !== username) return;

    const trimmed = String(newText).trim();
    if (!trimmed) return;

    // Update stored message
    entry.text = trimmed;
    entry.editedAt = new Date().toISOString();

    // Broadcast the edit to all clients
    io.emit("message_edited", {
      messageId,
      newText: trimmed,
      editedAt: entry.editedAt,
    });
  });

  // Handle message deletion
  socket.on("delete_message", ({ messageId }) => {
    const username = activeUsers.get(socket.id);
    if (!username || !messageId) return;

    const entry = recentMessages.get(messageId);
    if (!entry) return;

    // Only allow the original sender to delete
    if (entry.sender !== username) return;

    // Mark deleted (we keep record to avoid ID reuse)
    entry.deleted = true;

    // Broadcast deletion to all clients
    io.emit("message_deleted", { messageId });
  });

  // Handle read receipts from clients
  socket.on("read", ({ messageId }) => {
    const username = activeUsers.get(socket.id);
    if (!username || !messageId) return;

    const entry = recentMessages.get(messageId);
    if (!entry) return;

    if (!entry.read.has(username)) {
      entry.read.add(username);
      // Broadcast read update to all clients
      io.emit("message_read", { messageId, username });
    }
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