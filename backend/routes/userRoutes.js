const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Current User
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;