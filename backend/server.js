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

// middleware
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.CLIENT_URL
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json());

// DB connect
connectDB();

// HTTP server (IMPORTANT for socket)
const server = http.createServer(app);

// SOCKET SETUP
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// make io accessible in controllers
app.set("io", io);

// SOCKET EVENTS
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

// routes
app.use("/api/users", userRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/room-question", roomQuestionRoutes);
app.use("/api/approach", approachRoutes);
app.use("/api/chat", chatRoutes);
// test route
app.get("/", (req, res) => {
    res.send("Codemate API Running 🚀");
});

// IMPORTANT: use server.listen not app.listen
const PORT = process.env.PORT || 5000;

// IMPORTANT: use server.listen not app.listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});