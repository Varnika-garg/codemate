const Room = require("../models/Room");
const getRoomInfo = async (req, res) => {
    const room = await Room.findOne({
        roomCode: req.params.roomCode
    })
        .populate("createdBy", "name")
        .populate("members", "name");

    res.json(room);
};
// CREATE ROOM
const createRoom = async (req, res) => {
    try {
        const { roomName } = req.body;

        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await Room.create({
    roomName,
    roomCode,
    createdBy: req.user.id,
    members: [req.user.id]
});
        res.status(201).json(room);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const voteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body; // yes / no

        const question = await RoomQuestion.findById(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // remove old vote of user
        question.votes = question.votes.filter(
            v => v.userId.toString() !== req.user.id
        );

        // add new vote
        question.votes.push({
            userId: req.user.id,
            vote
        });

        await question.save();

        res.json({ message: "Vote updated" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// JOIN ROOM
const joinRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

       if (!room.members.some(
    member => member.toString() === req.user.id
)) {
    room.members.push(req.user.id);
    await room.save();
}

        res.json(room);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const leaveRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.members = room.members.filter(
            (m) => m.toString() !== req.user.id
        );

        await room.save();

        res.json({ message: "Left room successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    createRoom,
    joinRoom,
    getRoomInfo,
    leaveRoom
};