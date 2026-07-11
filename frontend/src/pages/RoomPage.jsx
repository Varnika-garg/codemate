import React, { useEffect, useState ,useCallback} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import { socket } from "../socket";
import { io } from "socket.io-client";
function RoomPage() {
    const [activeTab, setActiveTab] = useState("current");
    const { roomCode } = useParams();
    const token = localStorage.getItem("token");
    const [roomInfo, setRoomInfo] = useState(null);
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
const [showCelebration, setShowCelebration] = useState(false);
const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);
const [questionPage, setQuestionPage] = useState(0);
const styles = {
  page: {
    minHeight: "100vh",
    padding: "0px",
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    overflowX: "hidden",
    width: "100%",
    boxSizing: "border-box",

    background:
      "linear-gradient(-45deg, #020617, #0A1A3A, #000000)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 10s ease infinite",
  },

  heading: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  subHeading: {
    color: "#9AA4B2",
  },

  section: {
    marginTop: "35px",
    marginBottom: "35px",
  },

  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(124,156,255,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(124,156,255,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "#FFFFFF",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },

  button: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#FFFFFF",
    fontWeight: "600",
    margin: "8px",

    background:
      "linear-gradient(90deg,#4ADEDE,#7C9CFF,#A855F7)",

    backgroundSize: "200% 200%",
  },

  secondaryButton: {
    padding: "12px 22px",
    border: "1px solid rgba(124,156,255,0.25)",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#FFFFFF",
    fontWeight: "600",
    margin: "8px",
    background: "rgba(255,255,255,0.05)",
  },

  // ---- UNIQUE CARD SHAPE ----
  // Cut-corner / terminal-tab silhouette instead of a plain rounded rectangle.
  // Built with clip-path (notch top-right) + a left accent edge to replace the
  // border that clip-path would otherwise cut off unevenly.
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(124,156,255,0.2)",
    borderLeft: "3px solid #4ADEDE",
    padding: "20px 20px 20px 22px",
    marginTop: "15px",
    backdropFilter: "blur(20px)",
    color: "#FFFFFF",
    position: "relative",
    clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
  },
navbar: {
    height: "75px",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",   // Reduced from 35px
    background: "#020617",
    borderBottom: "1px solid rgba(124,156,255,0.10)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
    position: "sticky",
    top: 0,
    zIndex: 100,
},

leftNav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
    overflow: "hidden",
},

roomTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#FFFFFF",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
},

roomCode: {
    fontSize: "12px",
    color: "#9AA4B2",
    marginTop: "2px",
    whiteSpace: "nowrap",
},

rightNav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",      // Reduced from 12px
    flexShrink: 0,
    whiteSpace: "nowrap",
},

memberCircle: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,156,255,0.12)",
    border: "1px solid rgba(124,156,255,0.25)",
    fontSize: "16px",
},

memberInfo: {
    display: "flex",
    flexDirection: "column",
},

memberLabel: {
    color: "#9AA4B2",
    fontSize: "12px",
},

memberCount: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: "15px",
},

statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.02em",
},

codeBlockWrap: {
    borderRadius: "10px",
    border: "1px solid rgba(124,156,255,0.18)",
    overflow: "hidden",
    marginTop: "10px",
    background: "#050B1A",
},

codeBlockHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    background: "rgba(124,156,255,0.08)",
    borderBottom: "1px solid rgba(124,156,255,0.12)",
},

codeDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
},

avatarBadge: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    color: "#0A1A3A",
    background: "linear-gradient(135deg,#4ADEDE,#A855F7)",
    flexShrink: 0,
},

progressTrack: {
    width: "100%",
    height: "8px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginTop: "10px",
},

progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#4ADEDE,#7C9CFF,#A855F7)",
    transition: "width 0.3s ease",
},
};
   const fetchRoomInfo = useCallback(async () => {
    try {
        const res = await axios.get(
            `https://codemate-backend-rhj8.onrender.com/api/rooms/${roomCode}`,
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
},[roomCode,token]);
    // GET CURRENT QUESTION
    const fetchQuestions = useCallback(async () => {
    try {
        const res = await axios.get(
            `https://codemate-backend-rhj8.onrender.com/api/room-question/current/${roomCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (res.data) {
    setSelectedQuestion(res.data);
    fetchApproaches(res.data._id);
}

    } catch (err) {
        console.log(err);
    }
},[roomCode, token]);

// GET ALL QUESTIONS
const fetchQuestion = useCallback(async () => {
    try {
        const res = await axios.get(
            `https://codemate-backend-rhj8.onrender.com/api/room-question/all/${roomCode}`,
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
},[roomCode, token,selectedQuestion]);
const fetchHistory = useCallback(async () => {
    try {

        const res = await axios.get(
            `https://codemate-backend-rhj8.onrender.com/api/room-question/history/${roomCode}`,
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
},[roomCode, token]);
const leaveRoom = async () => {
    try {
        await axios.post(
            "https://codemate-backend-rhj8.onrender.com/api/rooms/leave",
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
    const fetchApproaches = useCallback(async (questionId) => {
    try {
        const res = await axios.get(
            `https://codemate-backend-rhj8.onrender.com/api/approach/${questionId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setApproaches(res.data);

    } catch (err) {
        console.log(err);
    }
}, [token]);

    // SELECT QUESTION
    const handleSelectQuestion = (q) => {
        setSelectedQuestion(q);
        fetchApproaches(q._id);
    };

    // QUESTION GRID PAGING (UI ONLY — reuses handleSelectQuestion, no new data logic)
    const QUESTIONS_PER_PAGE = 4;
    const totalQuestionPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));

    const goToPrevQuestionPage = () => {
        setQuestionPage((prev) => (prev === 0 ? totalQuestionPages - 1 : prev - 1));
    };

    const goToNextQuestionPage = () => {
        setQuestionPage((prev) => (prev === totalQuestionPages - 1 ? 0 : prev + 1));
    };
const voteQuestion = async (vote) => {
    try {
        const res = await axios.post(
            `https://codemate-backend-rhj8.onrender.com/api/room-question/vote/${selectedQuestion._id}`,
            { vote },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (res.data.solved) {
            confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 }
            });

            alert("🎉 All members solved it!");
        } else {
            alert(res.data.message);
        }

        setSelectedQuestion(prev => ({
    ...prev,
    ...res.data.question
}));

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
            "https://codemate-backend-rhj8.onrender.com/api/room-question/add",
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

        // 🎉 CONFETTI POPPER
        setShowCelebration(true);

confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
});

setTimeout(() => {
    setShowCelebration(false);
}, 2000);

    } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Could not add question. Please try again.");
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
            "https://codemate-backend-rhj8.onrender.com/api/approach/add",
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
}, [fetchRoomInfo,
    fetchQuestion,
    fetchQuestions,
    fetchHistory]);
useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await axios.get(
                "https://codemate-backend-rhj8.onrender.com/api/users/me",
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
}, [token]);

// Keep the question grid page in sync whenever the selected question
// changes from elsewhere (initial load, voting, adding a question).
// UI-only sync — does not call any API.
useEffect(() => {
    if (!selectedQuestion || questions.length === 0) return;
    const idx = questions.findIndex((q) => q._id === selectedQuestion._id);
    if (idx !== -1) {
        setQuestionPage(Math.floor(idx / 4));
    }
}, [selectedQuestion, questions]);

   return (
    <div style={styles.page}>

        {/* NAVBAR */}
        <div style={{ ...styles.navbar, justifyContent: "space-between" }}>
            <div style={styles.leftNav}>
                <span style={styles.roomTitle}>
                    {roomInfo?.roomName || "Loading..."}
                </span>

                <span style={styles.roomCode}>
                    Room Code • {roomCode}
                </span>
            </div>

            <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                    onClick={() => setShowParticipantsMenu((prev) => !prev)}
                    style={{ ...styles.rightNav, cursor: "pointer" }}
                >
                    <div style={styles.memberCircle}>
                        👥
                    </div>

                    <div style={styles.memberInfo}>
                        <span style={styles.memberLabel}>
                            Participants
                        </span>

                        <span style={styles.memberCount}>
                            {roomInfo?.members?.length || 0} Joined
                        </span>
                    </div>
                </div>

                {showParticipantsMenu && (
                    <div style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        right: 0,
                        minWidth: "180px",
                        background: "#0A1A3A",
                        border: "1px solid rgba(124,156,255,0.25)",
                        borderRadius: "12px",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                        padding: "8px",
                        zIndex: 200
                    }}>
                        <button
                            onClick={() => {
                                setShowParticipantsMenu(false);
                                leaveRoom();
                            }}
                            style={{
                                ...styles.secondaryButton,
                                margin: 0,
                                width: "100%",
                                textAlign: "left",
                                background: "rgba(255,255,255,0.04)"
                            }}
                        >
                            🚪 Leave Room
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* MAIN LAYOUT (LEFT + RIGHT) */}
        <div style={{ display: "flex", height: "calc(100vh - 75px)" }}>

            {/* LEFT SIDE CONTENT */}
            <div style={{
    flex: 1,
    padding: "30px",
    overflowY: "auto",
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center"
}}>
            {/* Constrained inner column so cards don't stretch full-bleed.
                Navbar and chat rail (outside this wrapper) stay full-length. */}
            <div style={{ width: "100%", maxWidth: "680px" }}>
            <div style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
}}>
    <button
        onClick={() => setShowForm(true)}
        style={styles.button}
    >
        ➕ Add Question
    </button>
</div>

                <hr style={{ border: "none", borderTop: "1px solid rgba(124,156,255,0.15)" }} />

                {/* QUESTIONS — PAGINATED GRID (4 per page) */}
                {questions.length > 0 ? (
                    <>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "14px"
                        }}>
                            {questions
                                .slice(questionPage * QUESTIONS_PER_PAGE, questionPage * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE)
                                .map((q) => (
                                    <div
                                        key={q._id}
                                        onClick={() => handleSelectQuestion(q)}
                                        style={{
                                            minHeight: "130px",
                                            borderRadius: "14px",
                                            cursor: "pointer",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            background: q._id === selectedQuestion?._id
                                                ? "rgba(124,156,255,0.18)"
                                                : "rgba(255,255,255,0.04)",
                                            border: q._id === selectedQuestion?._id
                                                ? "1px solid rgba(124,156,255,0.5)"
                                                : "1px solid rgba(124,156,255,0.2)",
                                            backdropFilter: "blur(20px)",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <div>
                                            <strong style={{
                                                fontSize: "14.5px",
                                                lineHeight: "1.35",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical"
                                            }}>
                                                {q.question}
                                            </strong>
                                            <small style={{ color: "#9AA4B2", display: "block", marginTop: "6px" }}>
                                                {q.status === "solved" ? "✅ Solved" : "⏳ Pending"}
                                            </small>
                                        </div>

                                        <p style={{
                                            fontSize: "11px",
                                            color: "#9AA4B2",
                                            margin: 0,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {q.link}
                                        </p>
                                    </div>
                                ))}

                            {/* Fill remaining grid slots on the last page so the layout stays a steady 2x2 */}
                            {Array.from({
                                length: Math.max(
                                    0,
                                    QUESTIONS_PER_PAGE -
                                        questions.slice(questionPage * QUESTIONS_PER_PAGE, questionPage * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE).length
                                )
                            }).map((_, i) => (
                                <div key={`placeholder-${i}`} style={{ minHeight: "130px" }} />
                            ))}
                        </div>

                        {totalQuestionPages > 1 && (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "16px",
                                marginTop: "16px"
                            }}>
                                <button
                                    onClick={goToPrevQuestionPage}
                                    style={{
                                        ...styles.secondaryButton,
                                        margin: 0,
                                        width: "36px",
                                        height: "36px",
                                        padding: 0,
                                        borderRadius: "50%",
                                        fontSize: "16px"
                                    }}
                                >
                                    ‹
                                </button>

                                <span style={{ color: "#9AA4B2", fontSize: "12px" }}>
                                    Page {questionPage + 1} of {totalQuestionPages}
                                </span>

                                <button
                                    onClick={goToNextQuestionPage}
                                    style={{
                                        ...styles.secondaryButton,
                                        margin: 0,
                                        width: "36px",
                                        height: "36px",
                                        padding: 0,
                                        borderRadius: "50%",
                                        fontSize: "16px"
                                    }}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        borderRadius: "14px",
                        border: "1px solid rgba(124,156,255,0.2)",
                        background: "rgba(255,255,255,0.04)",
                        textAlign: "center",
                        padding: "30px"
                    }}>
                        <span style={{ color: "#9AA4B2", fontSize: "13px" }}>
                            No questions yet — add one to get started.
                        </span>
                    </div>
                )}

                <hr style={{ border: "none", borderTop: "1px solid rgba(124,156,255,0.15)" }} />
<div style={{
    display: "flex",
    gap: "25px",
    margin: "20px 0",
    padding: "10px 15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    position: "sticky",
    top: "10px",
    zIndex: 10
}}>
 <span
    onClick={() => setActiveTab("current")}
    style={{
        color: activeTab === "current" ? "#7C9CFF" : "#9AA4B2",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "8px",
        background: activeTab === "current" ? "rgba(124,156,255,0.15)" : "transparent"
    }}
>
    Current
</span>

    <span
    onClick={() => setActiveTab("approach")}
    style={{
        color: activeTab === "approach" ? "#7C9CFF" : "#9AA4B2",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "8px",
        background: activeTab === "approach" ? "rgba(124,156,255,0.15)" : "transparent"
    }}
>
    Approaches
</span>
   <span
    onClick={() => setActiveTab("history")}
    style={{
        color: activeTab === "history" ? "#7C9CFF" : "#9AA4B2",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "8px",
        background: activeTab === "history" ? "rgba(124,156,255,0.15)" : "transparent"
    }}
>
    History
</span>
</div>
                {/* CURRENT QUESTION */}
{activeTab === "current" && (
    <>
        <h2 style={styles.heading}>Current Question</h2>

        {selectedQuestion ? (
            <div style={{ ...styles.card, padding: "24px 24px 24px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <h3 style={{ color: "#FFFFFF", marginTop: 0, marginBottom: "10px", fontSize: "19px", lineHeight: "1.4" }}>
                        {selectedQuestion.question}
                    </h3>

                    <span style={{
                        ...styles.statusPill,
                        flexShrink: 0,
                        background: selectedQuestion.status === "solved"
                            ? "rgba(74,222,222,0.12)"
                            : "rgba(168,85,247,0.12)",
                        color: selectedQuestion.status === "solved" ? "#4ADEDE" : "#C792EA",
                        border: selectedQuestion.status === "solved"
                            ? "1px solid rgba(74,222,222,0.35)"
                            : "1px solid rgba(168,85,247,0.35)"
                    }}>
                        {selectedQuestion.status === "solved" ? "✓ Solved" : "○ Pending"}
                    </span>
                </div>

                <a
                    href={selectedQuestion.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        color: "#7C9CFF",
                        fontSize: "14px",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(124,156,255,0.3)",
                        paddingBottom: "2px"
                    }}
                >
                    View problem ↗
                </a>

                {selectedQuestion.votesSummary && (
                    <div style={{ marginTop: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <span style={{ color: "#9AA4B2", fontSize: "13px" }}>
                                Room progress
                            </span>
                            <span style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "600" }}>
                                {selectedQuestion.votesSummary.yesCount} / {selectedQuestion.votesSummary.totalMembers} said yes
                            </span>
                        </div>
                        <div style={styles.progressTrack}>
                            <div style={{
                                ...styles.progressFill,
                                width: selectedQuestion.votesSummary.totalMembers > 0
                                    ? `${(selectedQuestion.votesSummary.yesCount / selectedQuestion.votesSummary.totalMembers) * 100}%`
                                    : "0%"
                            }} />
                        </div>
                        {!selectedQuestion.votesSummary.allSolved && (
                            <p style={{ color: "#9AA4B2", fontSize: "12px", margin: "8px 0 0" }}>
                                Waiting for everyone to mark this solved before the next question can be shared.
                            </p>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div style={{ ...styles.card, textAlign: "center", padding: "30px" }}>
                <p style={{ ...styles.subHeading, margin: 0 }}>No question selected yet — pick one from the list above.</p>
            </div>
        )}

        {selectedQuestion && (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginTop: "18px",
                padding: "16px 20px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(124,156,255,0.15)"
            }}>
                <span style={{ color: "#9AA4B2", fontSize: "13px", marginRight: "auto" }}>
                    Did you solve this one?
                </span>
                <button onClick={() => voteQuestion("yes")} style={{ ...styles.button, margin: 0 }}>✓ Yes, solved it</button>
                <button onClick={() => voteQuestion("no")} style={{ ...styles.secondaryButton, margin: 0 }}>Not yet</button>
            </div>
        )}
    </>
)}

                {/* APPROACHES */}
               {activeTab === "approach" && (
    <>
        <h2 style={styles.heading}>Approaches</h2>

        {approaches.length === 0 && (
            <div style={{ ...styles.card, textAlign: "center", padding: "30px" }}>
                <p style={{ ...styles.subHeading, margin: 0 }}>No approaches shared yet — be the first to add one below.</p>
            </div>
        )}

        {approaches.map((a) => (
            <div key={a._id} style={{ ...styles.card, padding: "22px 22px 22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div style={styles.avatarBadge}>
                        {(a.userId?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: "#FFFFFF", fontWeight: "600", fontSize: "15px" }}>
                        {a.userId?.name || "Anonymous"}
                    </span>
                </div>

                <p style={{
                    color: "#D7DCE5",
                    background: "rgba(124,156,255,0.06)",
                    borderLeft: "2px solid rgba(124,156,255,0.4)",
                    padding: "10px 14px",
                    borderRadius: "0 8px 8px 0",
                    margin: "0 0 4px",
                    lineHeight: "1.6"
                }}>
                    {a.thinking}
                </p>

                <div style={styles.codeBlockWrap}>
                    <div style={styles.codeBlockHeader}>
                        <span style={{ ...styles.codeDot, background: "#FF5F57" }} />
                        <span style={{ ...styles.codeDot, background: "#FEBC2E" }} />
                        <span style={{ ...styles.codeDot, background: "#28C840" }} />
                    </div>
                    <pre style={{
                        margin: 0,
                        padding: "16px",
                        color: "#E5E7EB",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        overflowX: "auto"
                    }}>{a.code}</pre>
                </div>
            </div>
        ))}
    </>
)}

                <hr style={{ border: "none", borderTop: "1px solid rgba(124,156,255,0.15)" }} />

   {activeTab === "history" && (
    <>
        <h2 style={styles.heading}>🕒 Question History</h2>

        {history.length === 0 && (
            <div style={{ ...styles.card, textAlign: "center", padding: "30px" }}>
                <p style={{ ...styles.subHeading, margin: 0 }}>Nothing here yet — solved questions will show up as a log.</p>
            </div>
        )}

        {history.map((item, idx) => (
            <div key={item.question._id} style={{
                position: "relative",
                paddingLeft: "26px",
                marginTop: idx === 0 ? "20px" : "28px"
            }}>
                <div style={{
                    position: "absolute",
                    left: "0",
                    top: "6px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: item.question.status === "solved" ? "#4ADEDE" : "#A855F7"
                }} />
                {idx !== history.length - 1 && (
                    <div style={{
                        position: "absolute",
                        left: "4px",
                        top: "18px",
                        bottom: "-22px",
                        width: "1px",
                        background: "rgba(124,156,255,0.2)"
                    }} />
                )}

                <div style={{ ...styles.card, marginTop: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <h3 style={{ color: "#FFFFFF", marginTop: 0, marginBottom: "6px", fontSize: "16px" }}>
                            {item.question.question}
                        </h3>
                        <span style={{
                            ...styles.statusPill,
                            flexShrink: 0,
                            background: item.question.status === "solved" ? "rgba(74,222,222,0.12)" : "rgba(168,85,247,0.12)",
                            color: item.question.status === "solved" ? "#4ADEDE" : "#C792EA",
                        }}>
                            {item.question.status === "solved" ? "✓ Solved" : "○ Pending"}
                        </span>
                    </div>

                    {item.approaches.length > 0 && (
                        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {item.approaches.map((a) => (
                                <div key={a._id} style={{
                                    paddingTop: "12px",
                                    borderTop: "1px solid rgba(124,156,255,0.1)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                        <div style={{ ...styles.avatarBadge, width: "26px", height: "26px", fontSize: "11px" }}>
                                            {(a.userId?.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <strong style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "600" }}>
                                            {a.userId?.name || "Anonymous"}
                                        </strong>
                                    </div>
                                    <p style={{ color: "#9AA4B2", fontSize: "13px", margin: "0 0 8px" }}>{a.thinking}</p>
                                    <div style={styles.codeBlockWrap}>
                                        <pre style={{
                                            margin: 0,
                                            padding: "12px 14px",
                                            color: "#E5E7EB",
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: "12px",
                                            lineHeight: "1.6",
                                            overflowX: "auto"
                                        }}>{a.code}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))}
    </>
)}

                {/* ADD APPROACH */}
                <h3 style={styles.heading}>Add Approach</h3>

                <textarea
                    placeholder="Thinking"
                    value={thinking}
                    onChange={(e) => setThinking(e.target.value)}
                    style={styles.textarea}
                />

                <br />

                <textarea
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ ...styles.textarea, fontFamily: "'JetBrains Mono', monospace", marginTop: "12px" }}
                />

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "16px"
                }}>
                    <button onClick={submitApproach} style={{ ...styles.button, margin: 0 }}>
                        Submit Approach
                    </button>
                </div>

            </div>
            </div>

            {showForm && (
    <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    }}>

        <div style={{
            width: "420px",
            background: "#0A1A3A",
            border: "1px solid rgba(124,156,255,0.3)",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)"
        }}>

            <h2 style={{ color: "white", marginBottom: "15px" }}>
                ➕ Add New Question
            </h2>

            <input
                placeholder="Enter Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{ ...styles.input, marginBottom: "12px" }}
            />

            <input
                placeholder="Paste Link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                style={{ ...styles.input, marginBottom: "18px" }}
            />

            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>

                <button
                    onClick={() => setShowForm(false)}
                    style={styles.secondaryButton}
                >
                    Cancel
                </button>

                <button
                    onClick={addQuestion}
                    style={styles.button}
                >
                    Submit
                </button>

            </div>

        </div>
    </div>
)}

            {/* RIGHT SIDE CHAT */}
            <div style={{
                width: "260px",
                height: "100%",
                background: "#081224",
                borderLeft: "1px solid rgba(124,156,255,.15)",
                display: "flex",
                flexDirection: "column"
            }}>

                <div style={{
                    padding: "16px",
                    fontWeight: "700",
                    fontSize: "17px",
                    borderBottom: "1px solid rgba(124,156,255,.15)"
                }}>
                    💬 Room Chat
                </div>

                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "14px"
                }}>

                    {chat.map((m, i) => (
                        <div key={i} style={{ marginBottom: "15px" }}>
                            <div style={{
                                color: "#7C9CFF",
                                fontWeight: "600",
                                marginBottom: "5px",
                                fontSize: "13px"
                            }}>
                                {m.user}
                            </div>

                            <div style={{
                                background: "rgba(255,255,255,.06)",
                                padding: "10px 13px",
                                borderRadius: "12px",
                                fontSize: "13.5px",
                                wordBreak: "break-word"
                            }}>
                                {m.message}
                            </div>
                        </div>
                    ))}

                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    gap: "8px",
                    borderTop: "1px solid rgba(124,156,255,.15)"
                }}>

                    <input
                        value={messages}
                        onChange={(e) => setMessages(e.target.value)}
                        placeholder="Type message..."
                        style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "10px 12px",
                            background: "rgba(255,255,255,.05)",
                            border: "1px solid rgba(124,156,255,.15)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "13.5px",
                            boxSizing: "border-box"
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        style={{ ...styles.button, margin: 0, padding: "10px 16px", flexShrink: 0 }}
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>

        <style>{`
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cm-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(124,156,255,0.45) transparent;
}
.cm-scroll::-webkit-scrollbar {
  width: 8px;
}
.cm-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.cm-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #4ADEDE, #A855F7);
  border-radius: 8px;
}
.cm-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #6FE8E8, #C792EA);
}
`}</style>
{showCelebration && (
    <div style={{
        position: "fixed",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        flexDirection: "column",
        animation: "fadeIn 0.3s ease"
    }}>
        <div style={{
            fontSize: "50px",
            fontWeight: "800",
            color: "#fff",
            textAlign: "center",
            textShadow: "0 0 20px rgba(124,156,255,0.8)"
        }}>
            🎉 Question Shared!
        </div>

        <div style={{
            marginTop: "10px",
            color: "#9AA4B2",
            fontSize: "16px"
        }}>
            Great job collaborating 🚀
        </div>
    </div>
)}
    </div>
);
}
export default RoomPage;