import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { randomBytes } from 'crypto';

interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: string;
    timestamp: Date;
}

interface RoomData {
    users: Set<string>;
    messages: Message[];
    lastActive: number;
}

const app = express();
const PORT = process.env.PORT || 3000;
// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Client URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Chatterz server is running!" });
});

const rooms = new Map<string, RoomData>(); // Store rooms and their members

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id} | Total connections: ${io.engine.clientsCount}`);
    console.log(`📡 Connection details:`, {
        id: socket.id,
        address: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent']?.substring(0, 50) + '...',
        time: new Date().toISOString()
    });

    socket.on("disconnect", (reason) => {
        console.log(`🔴 User disconnected: ${socket.id} | Reason: ${reason} | Remaining: ${io.engine.clientsCount - 1}`);
    });

    // Handle chat messages
    socket.on("message", (data) => {
        console.log("📨 Message received:", data);
        io.emit("message", data); // Broadcast to all clients
    });

    // Handle ping for connection health
    socket.on("ping", () => {
        socket.emit("pong");
    });

    // Handle create room event and return room ID
    socket.on("createRoom", () => {
        const roomId = randomBytes(3).toString('hex').toUpperCase();
        rooms.set(roomId, {
            users: new Set<string>(),
            messages: [],
            lastActive: Date.now()
        });
        console.log(`🆕 Room created: ${roomId} by ${socket.id}`);
        socket.emit("roomCreated", roomId);
        
    });


    socket.on("join-room", (data) => {
        const { roomId, name } = JSON.parse(data);
        

        if (!rooms.has(roomId)) {
            console.error(`❌ Room ${roomId} does not exist.`);
            socket.emit("error", { message: "❌ Room does not exist." });
            return;
        }
        const room = rooms.get(roomId);
        if (!room) {
            console.error(`❌ Room ${roomId} not found.`);
            socket.emit("error", { message: "❌ Room not found." });
            return;
        }

            room.users.add(name);
            room.lastActive = Date.now();
            socket.join(roomId);
            socket.emit("joinedRoom", { roomId, users: Array.from(room.users), userSize: room.users.size });
            console.log(`👤 User ${name} (${socket.id}) joined room: ${roomId}`);;
    })

});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});