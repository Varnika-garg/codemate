const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    addRoomQuestion,
    getCurrentQuestion,
    getAllQuestions,
    markSolved,
    voteQuestion,getRoomHistory
} = require("../controllers/roomQuestionController");

router.post("/add", protect, addRoomQuestion);
router.get("/current/:roomCode", protect, getCurrentQuestion);
router.get("/all/:roomCode", protect, getAllQuestions);
router.put("/solve/:id", protect, markSolved);
router.post("/vote/:id", protect, voteQuestion);
router.get(
    "/history/:roomCode",
    protect,
    getRoomHistory
);
module.exports = router;