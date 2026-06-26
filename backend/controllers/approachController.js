const Approach = require("../models/Approach");
const Room = require("../models/Room");
const RoomQuestion = require("../models/RoomQuestion");


// ADD APPROACH
const addApproach = async (req, res) => {
    try {

        const {
            roomCode,
            questionId,
            thinking,
            code
        } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const question = await RoomQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        const approach = await Approach.create({
            roomId: room._id,
            questionId,
            userId: req.user.id,
            thinking,
            code
        });

        res.status(201).json(approach);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getRoomHistory = async (req, res) => {
    try {
        const room = await Room.findOne({
            roomCode: req.params.roomCode
        });

        const questions = await RoomQuestion.find({
            roomId: room._id
        });

        const history = [];

        for (let q of questions) {
            const approaches = await Approach.find({
                questionId: q._id
            }).populate("userId", "name");

            history.push({
                question: q,
                approaches
            });
        }

        res.json(history);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET ALL APPROACHES OF A QUESTION
const getApproaches = async (req, res) => {
    try {

        const { questionId } = req.params;

        const approaches = await Approach.find({
            questionId
        }).populate("userId", "name");

        res.json(approaches);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addApproach,
    getApproaches,
    getRoomHistory
};