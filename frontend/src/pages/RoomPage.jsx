import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
function RoomPage() {
    
    const { roomCode } = useParams();
    const token = localStorage.getItem("token");
    const [roomInfo, setRoomInfo] = useState(null);
    const [question, setQuestion] = useState(null);
    const [approaches, setApproaches] = useState([]);
    const [thinking, setThinking] = useState("");
    const [code, setCode] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newLink, setNewLink] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState("");
    const [user, setUser] = useState(null);
const [chat, setChat] = useState([]);

    const fetchRoomInfo = async () => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/rooms/${roomCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setRoomInfo(res.data);

    } catch (err) {
        console.log(err);
    }
};
    // GET CURRENT QUESTION
    const fetchQuestion = async () => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/room-question/current/${roomCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setQuestion(res.data);
        if (res.data) {
    setSelectedQuestion(res.data);
    fetchApproaches(res.data._id);
}

    } catch (err) {
        console.log(err);
    }
};

// GET ALL QUESTIONS
const fetchQuestions = async () => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/room-question/all/${roomCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setQuestions(res.data);

        if (res.data.length > 0 && !selectedQuestion) {
            setSelectedQuestion(res.data[0]);
            fetchApproaches(res.data[0]._id);
        }

    } catch (err) {
        console.log(err);
    }
};
const fetchHistory = async () => {
    try {

        const res = await axios.get(
            `http://localhost:5000/api/room-question/history/${roomCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setHistory(res.data);

    } catch (err) {
        console.log(err);
    }
};
const leaveRoom = async () => {
    try {
        await axios.post(
            "http://localhost:5000/api/rooms/leave",
            { roomCode },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        socket.emit("leave_room", roomCode);

        window.location.href = "/rooms";
    } catch (err) {
        console.log(err);
    }
};
const sendMessage = () => {
    socket.emit("send_message", {
        roomCode,
        message: messages,
        user: user?.name || "Anonymous"
    });

    setMessages("");
};
    // GET APPROACHES
    const fetchApproaches = async (questionId) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/approach/${questionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setApproaches(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    // SELECT QUESTION
    const handleSelectQuestion = (q) => {
        setSelectedQuestion(q);
        fetchApproaches(q._id);
    };
const voteQuestion = async (vote) => {
    try {
        await axios.post(
            `http://localhost:5000/api/room-question/vote/${selectedQuestion._id}`,
            { vote },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        fetchQuestions();
        fetchQuestion();
    } catch (err) {
        console.log(err);
    }
};
    // ADD QUESTION
    const addQuestion = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/room-question/add",
                {
                    roomCode,
                    question: newQuestion,
                    link: newLink
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setNewQuestion("");
            setNewLink("");
            setShowForm(false);

            fetchQuestions();
            fetchQuestion();

        } catch (err) {
            console.log(err);
        }
    };

    // SUBMIT APPROACH (SAFE FIX)
const submitApproach = async () => {
    if (!selectedQuestion) {
        alert("Select a question first");
        return;
    }

    try {
        await axios.post(
            "http://localhost:5000/api/approach/add",
            {
                roomCode,
                questionId: selectedQuestion._id,
                thinking,
                code
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setThinking("");
        setCode("");

        fetchApproaches(selectedQuestion._id);

    } catch (err) {
        console.log(err);
    }
};
useEffect(() => {
    socket.emit("join_room", roomCode);

    const handler = (msg) => {
        setChat((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handler);

    return () => {
        socket.off("receive_message", handler);
    };
}, [roomCode]);
   useEffect(() => {
    fetchRoomInfo();
    fetchQuestion();
    fetchQuestions();
    fetchHistory();
}, []);
useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/users/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchUser();
}, []);

    return (
        <div style={{ padding: "30px" }}>
           <h1>{roomInfo?.roomName}</h1>

<h3>Room Code: {roomCode}</h3>

<p>
    Members Joined:
    {roomInfo?.members?.length || 0}
</p>
            <hr />

            {/* 📌 ADD QUESTION BUTTON */}
            <h2>📌 Room Questions</h2>

            <button onClick={() => setShowForm(!showForm)}>
                ➕ Add Question
            </button>

            {showForm && (
                <div style={{ margin: "10px 0" }}>
                    <input
                        placeholder="Question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <br />

                    <input
                        placeholder="Link"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                    />
                    <br />

                    <button onClick={addQuestion}>
                        Submit Question
                    </button>
                </div>
            )}

            {/* 📌 SCROLLABLE QUESTIONS */}
            <div style={{
                maxHeight: "200px",
                overflowY: "scroll",
                border: "1px solid gray",
                padding: "10px"
            }}>
                {questions.map((q) => (
                    <div
                        key={q._id}
                        onClick={() => handleSelectQuestion(q)}
                        style={{
                            padding: "8px",
                            marginBottom: "5px",
                            cursor: "pointer",
                            background: q._id === selectedQuestion?._id ? "#d1e7ff" : "#f5f5f5"
                        }}
                    >
                       <div>
    <strong>{q.question}</strong>
    <br />
    <small>
        {q.status === "solved"
            ? "✅ Solved"
            : "⏳ Pending"}
    </small>
</div>
                        <p style={{ fontSize: "12px" }}>{q.link}</p>
                    </div>
                ))}
            </div>

            <hr />

            {/* CURRENT QUESTION */}
            <h2>Current Question</h2>

            {selectedQuestion ? (
                <div>
                    <h3>{selectedQuestion.question}</h3>
                    <a
    href={selectedQuestion.link}
    target="_blank"
    rel="noreferrer"
>
                        Problem Link
                    </a>
                    <p>Status: {selectedQuestion.status}</p>
                </div>
            ) : (
                <p>Select a question</p>
            )}

            <hr />

{selectedQuestion && (
    <>
        <button onClick={() => voteQuestion("yes")}>
            ✅ Yes
        </button>

        <button onClick={() => voteQuestion("no")}>
            ❌ No
        </button>
    </>
)}
            {/* APPROACHES */}
            <h2>Approaches</h2>

            {approaches.map((a) => (
                <div key={a._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
                    <h4>{a.userId?.name}</h4>
                    <p><b>Thinking:</b> {a.thinking}</p>
                    <pre>{a.code}</pre>
                </div>
            ))}
            <hr />

<h2>📚 Question History</h2>

{history.map((item) => (

    <div
        key={item.question._id}
        style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
        }}
    >

        <h3>{item.question.question}</h3>

        <p>
            Status: {item.question.status}
        </p>

        {item.approaches.map((a) => (

            <div
                key={a._id}
                style={{
                    marginLeft: "20px",
                    marginTop: "10px"
                }}
            >

                <strong>
                    {a.userId?.name}
                </strong>

                <p>
                    {a.thinking}
                </p>

                <pre>
                    {a.code}
                </pre>

            </div>

        ))}

    </div>

))}
<div style={{ position: "fixed", right: 0, width: "300px" }}>
    <h3>Chat</h3>

   {chat.map((m, i) => (
    <p key={i}>
        <b>{m.user}:</b> {m.message}
    </p>
))}

    <input
        value={messages}
        onChange={(e) => setMessages(e.target.value)}
    />

    <button onClick={sendMessage}>Send</button>
</div>
            <hr />

            {/* ADD APPROACH */}
            <h3>Add Approach</h3>

            <textarea
                placeholder="Thinking"
                value={thinking}
                onChange={(e) => setThinking(e.target.value)}
            />

            <br />

            <textarea
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <br />

            <button onClick={submitApproach}>
                Submit Approach
            </button>
            <button onClick={leaveRoom}>
    🚪 Leave Room
</button>
        </div>
    );
}
export default RoomPage;