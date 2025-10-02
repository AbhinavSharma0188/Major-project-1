import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],        // must be plural
  },
});

const userSocketMap = {}; // ✅ Fixed: renamed from useSocketMap to userSocketMap
export const getSocketId=(receiverId)=>{

  return userSocketMap[receiverId]
}
// ✅ ADD THIS FUNCTION
export const getIO = () => {
  return io;
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id; // ✅ Now using consistent variable name
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // ✅ This will work now

    socket.on('disconnect', () => {
        delete userSocketMap[userId]; // ✅ Fixed variable name
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); // ✅ Fixed variable name
    });
});

export { app, io, server };
