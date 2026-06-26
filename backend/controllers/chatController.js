const Chat = require("../models/Chat");
const Room = require("../models/Room");

const sendMessage = async (req, res) => {
    try {
        const { roomCode, message } = req.body;

        const room = await Room.findOne({ roomCode });

        const chat = await Chat.create({
            roomId: room._id,
            userId: req.user.id,
            message
        });

        // realtime emit
        const io = req.app.get("io");
        io.to(roomCode).emit("receive_message", chat);

        res.json(chat);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode });

        const messages = await Chat.find({ roomId: room._id })
            .populate("userId", "name");

        res.json(messages);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { sendMessage, getMessages };