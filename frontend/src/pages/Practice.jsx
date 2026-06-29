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
    const [loaded, setLoaded] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const [submitHover, setSubmitHover] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [openTopic, setOpenTopic] = useState(null);
    const [hoverRow, setHoverRow] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

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
            // auto-expand first topic once loaded
            const keys = Object.keys(res.data || {});
            if (keys.length > 0) setOpenTopic((prev) => prev ?? keys[0]);
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
        setSubmitting(true);

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

            await fetchPractice();
        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Floating bubble field (signature motif)
    const bubbles = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 10,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 14 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 120,
        hue: i % 2 === 0 ? "rgba(74,222,222," : "rgba(124,156,255,",
    }));

    const fields = [
        { name: "question", placeholder: "Question", icon: "❓" },
        { name: "link", placeholder: "Link", icon: "🔗" },
        { name: "hint", placeholder: "Hint", icon: "💡" },
        { name: "mistake", placeholder: "Common Mistake", icon: "⚠️" },
        { name: "topic", placeholder: "Topic", icon: "📦" },
    ];

    const styles = {
        page: {
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, sans-serif",
            color: "#fff",
            background:
                "radial-gradient(circle at 20% 20%, #0a1a3a 0%, transparent 45%)," +
                "radial-gradient(circle at 80% 80%, #020617 0%, transparent 50%)," +
                "linear-gradient(180deg, #000 0%, #020617 60%, #000 100%)",
            padding: "40px 24px 80px",
        },

        bgGlow: {
            position: "absolute",
            inset: 0,
            background:
                "radial-gradient(circle at 30% 30%, rgba(74,222,222,0.15), transparent 40%)," +
                "radial-gradient(circle at 70% 70%, rgba(124,156,255,0.15), transparent 40%)",
            zIndex: 0,
            animation: "bgMove 8s infinite alternate",
        },

        gridOverlay: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.25,
            backgroundImage:
                "linear-gradient(rgba(124,156,255,0.06) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(124,156,255,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
                "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.9), transparent 70%)",
            WebkitMaskImage:
                "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.9), transparent 70%)",
        },

        bubbleField: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
        },

       
        header: {
            textAlign: "center",
            marginBottom: "40px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-12px)",
            transition: "all 0.6s ease",
        },

        badge: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "rgba(74,222,222,0.08)",
            border: "1px solid rgba(74,222,222,0.3)",
            fontSize: "12px",
            color: "#7ce8e8",
            fontWeight: "600",
            letterSpacing: "0.04em",
            marginBottom: "18px",
        },
topicGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
},
        pulseDot: {
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#4adede",
            boxShadow: "0 0 8px #4adede",
            animation: "pulseDot 1.6s infinite",
        },

        title: {
            fontSize: "clamp(26px, 4.5vw, 36px)",
            fontWeight: "800",
        },

        highlight: {
            background: "linear-gradient(90deg,#4adede,#7c9cff,#4adede)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "shimmerText 4s linear infinite",
            display: "inline-block",
        },

        subtitle: {
            color: "#9aa4b2",
            marginTop: "8px",
            fontSize: "14px",
        },

layout: {
    display: "grid",
    gridTemplateColumns: "1fr",  // 👈 single column
    gap: "30px",
    maxWidth: "800px",
    margin: "0 auto",
},

        panel: (delay) => ({
            padding: "28px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(124,156,255,0.25)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            position: "relative",
            overflow: "hidden",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease",
            transitionDelay: `${delay}s`,
             height: "fit-content",
    minHeight: "520px",
        }),

        shine: {
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
                "linear-gradient(45deg, transparent, rgba(255,255,255,0.08), transparent)",
            transform: "rotate(25deg)",
            animation: "shineMove 7s infinite",
            pointerEvents: "none",
        },

        panelHeading: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "20px",
            position: "relative",
            zIndex: 1,
        },

        iconBadge: {
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            background: "linear-gradient(135deg, rgba(74,222,222,0.18), rgba(124,156,255,0.18))",
            border: "1px solid rgba(124,156,255,0.3)",
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "relative",
            zIndex: 1,
        },

        inputWrap: (active) => ({
            display: "flex",
            flexDirection: "column",   // 👈 add this
    alignItems: "flex-start",
    gap: "6px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: active ? "rgba(124,156,255,0.08)" : "rgba(255,255,255,0.03)",
            border: active
                ? "1px solid rgba(74,222,222,0.6)"
                : "1px solid rgba(255,255,255,0.1)",
            boxShadow: active ? "0 0 18px rgba(74,222,222,0.18)" : "none",
            transition: "all 0.3s ease",
        }),

        inputIcon: {
            fontSize: "14px",
            opacity: 0.8,
            width: "18px",
            textAlign: "center",
            flexShrink: 0,
        },

        input: {
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
        },

        submitBtn: (active, busy) => ({
            marginTop: "6px",
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg,#4adede,#7c9cff)",
            backgroundSize: "200% auto",
            backgroundPosition: active ? "100% 0" : "0 0",
            color: "#04111f",
            fontWeight: "700",
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.7 : 1,
            transition: "background-position 0.6s ease, transform 0.2s ease, box-shadow 0.3s ease",
            boxShadow: active ? "0 8px 24px rgba(74,222,222,0.35)" : "none",
            transform: active ? "translateY(-2px)" : "translateY(0)",
        }),

        rightPanelEmpty: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            color: "#7e8aa0",
            fontSize: "13px",
            gap: "10px",
            position: "relative",
            zIndex: 1,
        },

topicCard: {
    borderRadius: "14px",
    border: "1px solid rgba(124,156,255,0.18)",
    background: "rgba(255,255,255,0.03)",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "0.3s ease",
},

        topicHeader: (open) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px",
            cursor: "pointer",
            background: open ? "rgba(124,156,255,0.06)" : "transparent",
            transition: "background 0.3s ease",
        }),

        topicHeaderLeft: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
        },

        topicIcon: {
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            background: "linear-gradient(135deg, rgba(74,222,222,0.15), rgba(124,156,255,0.15))",
            border: "1px solid rgba(124,156,255,0.25)",
        },

        topicName: {
            fontSize: "15px",
            fontWeight: "700",
        },

        countBadge: {
            fontSize: "11px",
            color: "#7ce8e8",
            background: "rgba(74,222,222,0.1)",
            border: "1px solid rgba(74,222,222,0.3)",
            borderRadius: "999px",
            padding: "2px 10px",
            fontWeight: "600",
        },

        chevron: (open) => ({
            fontSize: "13px",
            color: "#9aa4b2",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
        }),

     questionList: (open) => ({
    maxHeight: open ? "220px" : "0px",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "max-height 0.4s ease",
}),

     questionRow: (active) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    fontSize: "13.5px",
    color: active ? "#fff" : "#cbd5e1",
    cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    background: active ? "rgba(74,222,222,0.06)" : "transparent",
    transition: "all 0.25s ease",
}),

        arrow: {
            fontSize: "13px",
            color: "#4adede",
            opacity: 0.8,
        },

       detailPanel: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
},

        detailHeaderRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
        },

        backBtn: (active) => ({
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(124,156,255,0.3)",
            background: active ? "rgba(124,156,255,0.12)" : "transparent",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
        }),

        detailTopicTag: {
            fontSize: "11px",
            color: "#7ce8e8",
            background: "rgba(74,222,222,0.1)",
            border: "1px solid rgba(74,222,222,0.3)",
            borderRadius: "999px",
            padding: "4px 12px",
            fontWeight: "600",
        },

        detailQuestion: {
            fontSize: "20px",
            fontWeight: "800",
            marginBottom: "20px",
            lineHeight: "1.4",
        },

        detailGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
        },

        detailCard: {
            padding: "18px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
        },

        detailLabel: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            color: "#9aa4b2",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: "700",
            marginBottom: "8px",
        },

        detailValue: {
            fontSize: "14px",
            color: "#e2e8f0",
            lineHeight: "1.6",
            wordBreak: "break-word",
        },

        detailLink: {
            fontSize: "14px",
            color: "#4adede",
            textDecoration: "none",
            wordBreak: "break-word",
        },
    };

    const topicIcons = ["📦", "🧩", "🧠", "🔥", "🚀", "🌀", "🎯", "🛠️"];

    return (
        <div style={styles.page}>
            <div style={styles.bgGlow} />
            <div style={styles.gridOverlay} />

            <div style={styles.bubbleField}>
                {bubbles.map((b) => (
                    <span
                        key={b.id}
                        style={{
                            position: "absolute",
                            bottom: "-40px",
                            left: `${b.left}%`,
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            borderRadius: "50%",
                            background: `${b.hue}0.5)`,
                            boxShadow: `0 0 ${b.size * 1.5}px ${b.hue}0.4)`,
                            animation: `floatUp ${b.duration}s linear infinite`,
                            animationDelay: `${b.delay}s`,
                            "--drift": `${b.drift}px`,
                        }}
                    />
                ))}
            </div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <span style={styles.badge}>
                        <span style={styles.pulseDot} />
                        PRACTICE ARENA
                    </span>
                    <h1 style={styles.title}>
                        Sharpen your skills on <span style={styles.highlight}>CodeMate</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Add new problems, track mistakes, and revise by topic
                    </p>
                </div>

                <div className="practice-layout" style={styles.layout}>
                    {/* LEFT - FORM */}
                    <div style={styles.panel(0.05)}>
                        <div style={styles.shine} />
                        <div style={styles.panelHeading}>
                            <span style={styles.iconBadge}>➕</span>
                            Add Practice Question
                        </div>

                        <form onSubmit={handleSubmit} style={styles.form}>
                            {fields.map((f) => (
                                <div key={f.name} style={styles.inputWrap(focusField === f.name)}>
                                    <span style={styles.inputIcon}>{f.icon}</span>
                                    <input
                                        style={styles.input}
                                        name={f.name}
                                        placeholder={f.placeholder}
                                        value={form[f.name]}
                                        onChange={handleChange}
                                        onFocus={() => setFocusField(f.name)}
                                        onBlur={() => setFocusField(null)}
                                        autoComplete="off"
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={submitting}
                                style={styles.submitBtn(submitHover, submitting)}
                                onMouseEnter={() => setSubmitHover(true)}
                                onMouseLeave={() => setSubmitHover(false)}
                            >
                                {submitting ? "Saving..." : "Add Question"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT - LIST / DETAIL */}
                    <div style={styles.panel(0.15)}>
                        <div style={styles.shine} />

                        {selectedQuestion ? (
                            <div style={styles.detailPanel}>
                                <div style={styles.detailHeaderRow}>
                                    <button
                                        style={styles.backBtn(false)}
                                        onClick={() => setSelectedQuestion(null)}
                                    >
                                        ← Back to topics
                                    </button>
                                    <span style={styles.detailTopicTag}>
                                        {selectedQuestion.topic}
                                    </span>
                                </div>

                                <h2 style={styles.detailQuestion}>
                                    {selectedQuestion.question}
                                </h2>

                                <div style={styles.detailGrid}>
                                    <div style={styles.detailCard}>
                                        <div style={styles.detailLabel}>🔗 Link</div>
                                        {selectedQuestion.link ? (
    <a
        href={selectedQuestion.link}
        target="_blank"
        rel="noreferrer"
        style={styles.detailLink}
    >
        {selectedQuestion.link}
    </a>
) : (
    <div style={styles.detailValue}>—</div>
)}
                                    </div>

                                    <div style={styles.detailCard}>
                                        <div style={styles.detailLabel}>💡 Hint</div>
                                        <div style={styles.detailValue}>
                                            {selectedQuestion.hint || "—"}
                                        </div>
                                    </div>

                                    <div style={styles.detailCard}>
                                        <div style={styles.detailLabel}>⚠️ Common Mistake</div>
                                        <div style={styles.detailValue}>
                                            {selectedQuestion.mistake || "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <div style={styles.panelHeading}>
                                    <span style={styles.iconBadge}>📚</span>
                                    Topics
                                </div>

                                {Object.keys(data).length === 0 ? (
                                    <div style={styles.rightPanelEmpty}>
                                        <span style={{ fontSize: "28px" }}>🗂️</span>
                                        No questions yet — add your first one to get started.
                                    </div>
                                ) : (
                                    Object.keys(data).map((topic, index) => {
                                        const isOpen = openTopic === topic;
                                        return (
                                            <div key={topic} style={styles.topicCard}>
                                                <div
                                                    style={styles.topicHeader(isOpen)}
                                                    onClick={() =>
                                                        setOpenTopic(isOpen ? null : topic)
                                                    }
                                                >
                                                    <div style={styles.topicHeaderLeft}>
                                                        <span style={styles.topicIcon}>
                                                            {topicIcons[index % topicIcons.length]}
                                                        </span>
                                                        <span style={styles.topicName}>
                                                            {topic}
                                                        </span>
                                                        <span style={styles.countBadge}>
                                                            {data[topic].length}
                                                        </span>
                                                    </div>
                                                    <span style={styles.chevron(isOpen)}>▼</span>
                                                </div>

                                                <div style={styles.questionList(isOpen)}>
                                                    {data[topic].map((item) => (
                                                        <div
                                                            key={item._id}
                                                            onClick={() =>
                                                                setSelectedQuestion(item)
                                                            }
                                                            onMouseEnter={() =>
                                                                setHoverRow(item._id)
                                                            }
                                                            onMouseLeave={() =>
                                                                setHoverRow(null)
                                                            }
                                                            style={styles.questionRow(
                                                                hoverRow === item._id
                                                            )}
                                                        >
                                                            <span>{item.question}</span>
                                                            <span style={styles.arrow}>→</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>{`
                input::placeholder {
                    color: #6b7688;
                }

                @keyframes shineMove {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(100%) rotate(25deg); }
                }

                @keyframes bgMove {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(25deg); }
                }

                @keyframes shimmerText {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }

                @keyframes pulseDot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.7); }
                }

                @keyframes floatUp {
                    0% { transform: translate(0, 0); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.5; }
                    100% { transform: translate(var(--drift), -110vh); opacity: 0; }
                }

               @media (max-width: 1024px) {
    .practice-layout {
        grid-template-columns: 1fr !important;
        gap: 20px;
    }
}
            `}</style>
        </div>
    );
}

export default Practice;