const Practice = require("../models/Practice");

// ➤ ADD PRACTICE QUESTION
const addPractice = async (req, res) => {
    try {
        const { question, link, hint, mistake } = req.body;

        // FIXED: normalize topic properly
        let topic = req.body.topic.toLowerCase().trim();

        const practice = await Practice.create({
            userId: req.user.id,
            question,
            link,
            hint,
            mistake,
            topic
        });

        res.status(201).json({
            message: "Practice added successfully",
            practice
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ➤ GET GROUPED PRACTICE
const getPractice = async (req, res) => {
    try {
        const practices = await Practice.find({ userId: req.user.id });

        const grouped = {};

        practices.forEach((item) => {
            const key = item.topic.toLowerCase().trim();

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(item);
        });

        res.json(grouped);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addPractice,
    getPractice
};