const Room = require("../models/Room");
const RoomQuestion = require("../models/RoomQuestion");
const Approach = require("../models/Approach");

// ➤ ADD QUESTION (with anti-duplicate + single active question rule)
const addRoomQuestion = async (req, res) => {
    try {
        const { roomCode, question, link } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // CHECK ACTIVE QUESTION (only one allowed at a time)
        const activeQuestion = await RoomQuestion.findOne({
            roomId: room._id,
            status: "pending"
        });

        if (activeQuestion) {
            return res.status(400).json({
                message: "Solve current question first before adding new one"
            });
        }

        // NORMALIZE QUESTION
        const normalizedQuestion = question.trim().toLowerCase();

        // CHECK DUPLICATE QUESTION
        const duplicateQuestion = await RoomQuestion.findOne({
            roomId: room._id,
            question: normalizedQuestion
        });

        if (duplicateQuestion) {
            return res.status(400).json({
                message: "Question already exists in this room"
            });
        }

        const newQuestion = await RoomQuestion.create({
            roomId: room._id,
            question: normalizedQuestion,
            link,
            status: "pending",
            addedBy: req.user.id
        });

        res.status(201).json(newQuestion);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ➤ GET CURRENT ACTIVE QUESTION
const getCurrentQuestion = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const question = await RoomQuestion.findOne({
            roomId: room._id,
            status: "pending"
        });

        res.json(question);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ➤ MARK QUESTION AS SOLVED
const markSolved = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await RoomQuestion.findById(id);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        question.status = "solved";
        await question.save();

        res.json({
            message: "Question marked solved"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const canMoveNext = (question, roomMembers) => {
    const yesVotes = question.votes.filter(v => v.vote === "yes").length;

    return yesVotes === roomMembers.length;
};
const voteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body;

        const question = await RoomQuestion.findById(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // ✅ FIXED PART (replace old filter+push)
        const existingVote = question.votes.find(
            v => v.userId.toString() === req.user.id
        );

        if (existingVote) {
            existingVote.vote = vote;
        } else {
            question.votes.push({
                userId: req.user.id,
                vote
            });
        }

        await question.save();

        const room = await Room.findOne({ _id: question.roomId });

        const yesVotes = question.votes.filter(
            v => v.vote === "yes"
        ).length;

        if (yesVotes === room.members.length) {
            question.status = "solved";
            await question.save();
        }

        res.json(question);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ➤ GET ALL QUESTIONS IN ROOM (HISTORY + ACTIVE)
const getAllQuestions = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }


        const questions = await RoomQuestion.find({
            roomId: room._id
        }).sort({ createdAt: -1 });

        res.json(questions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getRoomHistory = async (req, res) => {
    try {

        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const questions = await RoomQuestion.find({
            roomId: room._id
        }).sort({ createdAt: -1 });

        const history = [];

        for (const q of questions) {

            const approaches = await Approach.find({
                questionId: q._id
            }).populate("userId", "name");

            history.push({
                question: q,
                approaches
            });
        }

        res.json(history);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ➤ EXPORT ALL CONTROLLERS
module.exports = {
    addRoomQuestion,
    getCurrentQuestion,
    getAllQuestions,
    markSolved,
    voteQuestion,
    getRoomHistory
};