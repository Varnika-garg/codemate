const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    roomName: {
        type: String,
        required: true
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
    
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);