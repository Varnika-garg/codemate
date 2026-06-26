const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: String
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);