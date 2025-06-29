"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const crypto_1 = require("crypto");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Create HTTP server
const server = (0, http_1.createServer)(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3001", // Client URL
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use(express_1.default.json());
// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Chatterz server is running!" });
});
const rooms = new Map(); // Store rooms and their members
// Socket.IO connection handling
io.on("connection", (socket) => {
    var _a;
    console.log(`🟢 User connected: ${socket.id} | Total connections: ${io.engine.clientsCount}`);
    console.log(`📡 Connection details:`, {
        id: socket.id,
        address: socket.handshake.address,
        userAgent: ((_a = socket.handshake.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.substring(0, 50)) + '...',
        time: new Date().toISOString()
    });
    socket.on("disconnect", (reason) => {
        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                io.to(roomId).emit('user-left', room.users.size);
                if (room.users.size === 0) {
                    rooms.delete(roomId); // Remove room if no users left
                }
            }
            console.log(`🔴 User disconnected: ${socket.id} | Reason: ${reason} | Remaining: ${io.engine.clientsCount - 1}`);
        });
    });
    // Handle create room event and return room ID
    socket.on("createRoom", () => {
        const roomId = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
        const roomData = {
            users: new Set(),
            messages: [],
            lastActive: Date.now()
        };
        rooms.set(roomId, roomData);
        socket.emit("roomCreated", roomId);
    });
    socket.on("join-room", (data) => {
        const parsed = JSON.parse(data);
        const { roomId, name } = parsed;
        if (!rooms.has(roomId)) {
            console.error(`❌ Room ${roomId} does not exist.`);
            socket.emit("error", { message: "❌ Room does not exist." });
            return;
        }
        const room = rooms.get(roomId);
        if (room) {
            room.users.add(name);
            room.lastActive = Date.now();
            socket.join(roomId);
            const usersArray = Array.from(room.users);
            const userCount = usersArray.length; // Backup calculation
            const responseData = {
                roomId,
                users: usersArray,
                userSize: userCount, // Fixed: Changed from usersize to userSize
                messages: room.messages
            };
            socket.emit("joinedRoom", responseData);
            io.to(roomId).emit('user-joined', room.users.size);
            console.log(`👤 User ${name} (${socket.id}) joined room: ${roomId}`);
            ;
        }
        else {
            console.error(`❌ Room ${roomId} not found.`);
            socket.emit("error", { message: `❌ Room ${roomId} not found.` });
            return;
        }
    });
    socket.on("sendMessage", (data) => {
        console.log("📨 Raw sendMessage data received:", data);
        console.log("📨 Data type:", typeof data);
        // Handle both JSON string and object data
        let parsedData;
        try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch (error) {
            console.error("❌ Failed to parse sendMessage data:", error);
            socket.emit("error", { message: "Invalid message format" });
            return;
        }
        const { roomId, content, senderId, sender } = parsedData;
        console.log(`📤 Parsed message data:`, { roomId, content, senderId, sender });
        // Validate required fields
        if (!roomId || !content || !senderId || !sender) {
            console.error("❌ Missing required fields in message:", { roomId, content, senderId, sender });
            socket.emit("error", { message: "Missing required message fields" });
            return;
        }
        console.log(`📤 Message from ${sender} (${senderId}) in room ${roomId}:`, content);
        if (!rooms.has(roomId)) {
            console.error(`❌ Room ${roomId} does not exist.`);
            socket.emit("error", { message: "❌ Room does not exist." });
            return;
        }
        const room = rooms.get(roomId);
        if (room) {
            const message = {
                id: (0, crypto_1.randomBytes)(4).toString('hex'),
                content,
                senderId,
                sender,
                timestamp: new Date()
            };
            room.messages.push(message);
            room.lastActive = Date.now();
            console.log(`📩 Message stored in room ${roomId}:`, message);
            io.to(roomId).emit("message", message); // Broadcast to room
        }
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
