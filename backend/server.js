const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomQuestionRoutes = require("./routes/roomQuestionRoutes");
const approachRoutes = require("./routes/approachRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(express.json());

// ✅ SIMPLE & SAFE CORS (IMPORTANT FIX)
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://mycodemate-app.vercel.app",
        "https://codemate-gules.vercel.app"
    ],
    credentials: true
}));

const server = http.createServer(app);

// ✅ SOCKET FIX (IMPORTANT)
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://mycodemate-app.vercel.app",
            "https://codemate-gules.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true,
        transports: ["polling", "websocket"]
    }
});

app.set("io", io);

// SOCKET
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (roomCode) => {
        socket.join(roomCode);
    });

    socket.on("send_message", (data) => {
        io.to(data.roomCode).emit("receive_message", {
            message: data.message,
            user: data.user
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/room-question", roomQuestionRoutes);
app.use("/api/approach", approachRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("Codemate API Running 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});