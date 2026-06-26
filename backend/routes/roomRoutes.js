const express = require("express");
const router = express.Router();
const {
    createRoom,
    joinRoom,
    getRoomInfo,
    leaveRoom
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
// create room
router.post("/create", protect, createRoom);
router.get("/:roomCode", protect, getRoomInfo);
// join room
router.post("/join", protect, joinRoom);
router.post("/leave", protect, leaveRoom);
module.exports = router;