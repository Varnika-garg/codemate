import React, { useEffect, useState } from "react";
import axios from "axios";

function Practice() {
    const [form, setForm] = useState({
        question: "",
        link: "",
        hint: "",
        mistake: "",
        topic: ""
    });
const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [data, setData] = useState({});

    const token = localStorage.getItem("token");

    // FETCH PRACTICE DATA
    const fetchPractice = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/practice/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPractice();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // SUBMIT FORM
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/api/practice/add",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setForm({
                question: "",
                link: "",
                hint: "",
                mistake: "",
                topic: ""
            });

            fetchPractice();

        } catch (err) {
            console.log(err);
        }
    };
return (
    <div style={{ display: "flex", padding: "20px" }}>

        {/* LEFT SIDE FORM */}
        <div style={{ width: "40%" }}>
            <h2>Add Practice</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="question"
                    placeholder="Question"
                    value={form.question}
                    onChange={handleChange}
                />
                <br />

                <input
                    name="link"
                    placeholder="Link"
                    value={form.link}
                    onChange={handleChange}
                />
                <br />

                <input
                    name="hint"
                    placeholder="Hint"
                    value={form.hint}
                    onChange={handleChange}
                />
                <br />

                <input
                    name="mistake"
                    placeholder="Mistake"
                    value={form.mistake}
                    onChange={handleChange}
                />
                <br />

                <input
                    name="topic"
                    placeholder="Topic"
                    value={form.topic}
                    onChange={handleChange}
                />
                <br />

                <button type="submit">Submit</button>
            </form>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ width: "60%", paddingLeft: "20px" }}>

            {selectedQuestion ? (

                // 👉 DETAIL VIEW
                <div style={{ padding: "20px", border: "1px solid gray" }}>
                    <h2>Question Detail</h2>

                    <p><b>Question:</b> {selectedQuestion.question}</p>
                    <p><b>Link:</b> {selectedQuestion.link}</p>
                    <p><b>Hint:</b> {selectedQuestion.hint}</p>
                    <p><b>Mistake:</b> {selectedQuestion.mistake}</p>
                    <p><b>Topic:</b> {selectedQuestion.topic}</p>

                    <br />

                    <button onClick={() => setSelectedQuestion(null)}>
                        ← Back
                    </button>
                </div>

            ) : (

                // 👉 TOPIC LIST VIEW
                <div>
                    <h2>Topics</h2>

                    {Object.keys(data).map((topic, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                            <h3>📦 {topic} ({data[topic].length})</h3>

                            <ul>
                                {data[topic].map((item) => (
                                    <li
                                        key={item._id}
                                        onClick={() => setSelectedQuestion(item)}
                                        style={{ cursor: "pointer", color: "blue" }}
                                    >
                                        {item.question}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            )}

        </div>
    </div>
);
}

export default Practice;