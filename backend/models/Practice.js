const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        question: {
            type: String,
            required: true
        },
        link: {
            type: String
        },
        hint: {
            type: String
        },
        mistake: {
            type: String
        },
        topic: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Practice", practiceSchema);