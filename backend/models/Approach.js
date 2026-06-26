const mongoose = require("mongoose");

const approachSchema = new mongoose.Schema(
{
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomQuestion",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    thinking: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Approach", approachSchema);