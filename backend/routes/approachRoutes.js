const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    addApproach,
    getApproaches
} = require("../controllers/approachController");

router.post("/add", protect, addApproach);

router.get("/:questionId", protect, getApproaches);

module.exports = router;