const mongoose = require("mongoose");

const roomQuestionSchema = new mongoose.Schema(
{
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    link: {
        type: String
    },

    votes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            vote: {
                type: String,
                enum: ["yes", "no"],
                default: "no"
            }
        }
    ],

    status: {
        type: String,
        enum: ["pending", "solved"],
        default: "pending"
    },

    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "RoomQuestion",
    roomQuestionSchema
);