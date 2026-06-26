const express = require("express");
const router = express.Router();

const { addPractice, getPractice } = require("../controllers/practiceController");
const { protect } = require("../middleware/authMiddleware");

// ➤ Add new practice question
router.post("/add", protect, addPractice);

// ➤ Get all grouped practice data
router.get("/all", protect, getPractice);

module.exports = router;