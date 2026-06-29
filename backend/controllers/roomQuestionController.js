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

if (activeQuestion && activeQuestion.status !== "solved") {
    return res.status(400).json({
        message: "❌ Cannot add new question. Current question is not solved yet."
    });
}

// if question exists AND not fully solved → block

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

        if (!question) {
            return res.json(question);
        }

        // ATTACH VOTE SUMMARY (no names — just counts, for the "waiting on members" UI)
        const memberIds = room.members.map(m => m.toString());
        const yesCount = question.votes.filter(
            v => memberIds.includes(v.userId.toString()) && v.vote === "yes"
        ).length;

        res.json({
            ...question.toObject(),
            votesSummary: {
                yesCount,
                totalMembers: memberIds.length,
                allSolved: yesCount === memberIds.length
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ➤ MARK QUESTION AS SOLVED
// ⚠️ WARNING: this bypasses the "all members must vote yes" rule.
// Do not wire this to any button/route unless that's intentional —
// voteQuestion is the only path that should resolve a question.
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

        // Each user gets exactly one vote entry: update it if they already
        // voted (e.g. changing "no" -> "yes"), otherwise add a new one.
        // This never touches any other user's vote.
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

    // get unique YES voters


// room members
const room = await Room.findById(question.roomId);
const memberIds = room.members.map(m => m.toString());
const voteMap = {};

question.votes.forEach(v => {
    voteMap[v.userId.toString()] = v.vote;
});

// check ALL members voted YES
const allVotedYes = memberIds.every(memberId =>
    voteMap[memberId] === "yes"
);

if (allVotedYes) {
    const updatedQuestion = await RoomQuestion.findByIdAndUpdate(
        question._id,
        { status: "solved" },
        { new: true }
    );

    return res.json({
        message: "🎉 All members marked this solved! The next question can now be shared.",
        question: updatedQuestion,
        solved: true
    });
}

return res.json({
    message: "Vote saved. All members must solve this question before the next one can be shared.",
    question,
    solved: false
});

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