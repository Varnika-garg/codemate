const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (already hai)
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
    name,
    email,
    password
});

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // create token
        const token = jwt.sign(
            { id: user._id },
            "secretkey123",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const logoutUser = async (req, res) => {
    try {
        res.json({
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email");

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
};
