import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST"], // Should be an array
  },
});

const userSocketMap = {};
export const getRecieverSocketId=(recieverId)=>userSocketMap[recieverId]
// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: userId=${userId}, socketId=${socket.id}`);
  }

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId]; // Fixed syntax
    }
    console.log(`User disconnected: userId=${userId}, socketId=${socket.id}`);

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
