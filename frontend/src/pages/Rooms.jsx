import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Rooms() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverBtn, setHoverBtn] = useState(null);
    const [focusField, setFocusField] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const createRoom = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                "https://codemate-backend-rhj8.onrender.com/api/rooms/create",
                { roomName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/room/${res.data.roomCode}`);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                "https://codemate-backend-rhj8.onrender.com/api/rooms/join",
                { roomCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/room/${res.data.roomCode}`);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
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

    const styles = {
        page: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
            color: "#fff",
            padding: "40px 20px",
            position: "relative",
            background:
                "radial-gradient(circle at 20% 20%, #0a1a3a 0%, transparent 45%)," +
                "radial-gradient(circle at 80% 80%, #020617 0%, transparent 50%)," +
                "linear-gradient(180deg, #000 0%, #020617 60%, #000 100%)",
            overflow: "hidden",
        },

        bgGlow: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
                "radial-gradient(circle at 30% 30%, rgba(74,222,222,0.15), transparent 40%)," +
                "radial-gradient(circle at 70% 70%, rgba(124,156,255,0.15), transparent 40%)",
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
                "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.9), transparent 70%)",
            WebkitMaskImage:
                "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.9), transparent 70%)",
        },

        bubbleField: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
        },

        header: {
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            marginBottom: "34px",
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

        container: {
            position: "relative",
            zIndex: 2,
            width: "420px",
            maxWidth: "100%",
            padding: "30px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(124,156,255,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 50px rgba(0,0,0,0.6)",
            overflow: "hidden",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s, box-shadow 0.4s ease, border 0.3s ease",
            animation: loaded ? "floatCard 6s ease-in-out infinite" : "none",
        },

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

        section: {
            marginBottom: "22px",
            position: "relative",
            zIndex: 1,
        },

        labelRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
        },

        iconBadge: {
            width: "28px",
            height: "28px",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            background: "linear-gradient(135deg, rgba(74,222,222,0.18), rgba(124,156,255,0.18))",
            border: "1px solid rgba(124,156,255,0.3)",
            flexShrink: 0,
        },

        label: {
            fontSize: "13px",
            color: "#9aa4b2",
            fontWeight: "600",
        },

        inputWrap: (active) => ({
            display: "flex",
            alignItems: "center",
            gap: "10px",
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
            fontSize: "13px",
            opacity: 0.8,
            width: "16px",
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

        button: (type, active, busy) => ({
            width: "100%",
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            cursor: busy ? "default" : "pointer",
            fontWeight: "700",
            marginTop: "12px",
            color: "#04111f",
            background:
                type === "create"
                    ? "linear-gradient(90deg,#4adede,#7c9cff)"
                    : "linear-gradient(90deg,#7c9cff,#4adede)",
            backgroundSize: "200% auto",
            backgroundPosition: active ? "100% 0" : "0 0",
            opacity: busy ? 0.7 : 1,
            transform: active ? "translateY(-3px)" : "translateY(0)",
            boxShadow: active
                ? "0 10px 25px rgba(74,222,222,0.35)"
                : "none",
            transition: "all 0.35s ease",
        }),

        dividerRow: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "18px 0",
            position: "relative",
            zIndex: 1,
        },

        dividerLine: {
            flex: 1,
            height: "1px",
            background:
                "linear-gradient(90deg, transparent, rgba(124,156,255,0.35), transparent)",
        },

        dividerText: {
            color: "#6b7688",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.08em",
        },
    };

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

            <div style={styles.header}>
                <span style={styles.badge}>
                    <span style={styles.pulseDot} />
                    COLLABORATION
                </span>
                <h1 style={styles.title}>
                    🚀 Join / Create <span style={styles.highlight}>Rooms</span>
                </h1>
                <p style={styles.subtitle}>
                    Start a session or jump into one with a room code
                </p>
            </div>

            <div style={styles.container}>
                <div style={styles.shine} />

                {/* CREATE */}
                <div style={styles.section}>
                    <div style={styles.labelRow}>
                        <span style={styles.iconBadge}>✨</span>
                        <span style={styles.label}>Create Room</span>
                    </div>

                    <div style={styles.inputWrap(focusField === "create")}>
                        <span style={styles.inputIcon}>🏷️</span>
                        <input
                            style={styles.input}
                            placeholder="Enter Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            onFocus={() => setFocusField("create")}
                            onBlur={() => setFocusField(null)}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        style={styles.button("create", hoverBtn === "create", loading)}
                        onMouseEnter={() => setHoverBtn("create")}
                        onMouseLeave={() => setHoverBtn(null)}
                        onClick={createRoom}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Room"}
                    </button>
                </div>

                <div style={styles.dividerRow}>
                    <span style={styles.dividerLine} />
                    <span style={styles.dividerText}>OR</span>
                    <span style={styles.dividerLine} />
                </div>

                {/* JOIN */}
                <div style={{ ...styles.section, marginBottom: 0 }}>
                    <div style={styles.labelRow}>
                        <span style={styles.iconBadge}>🔑</span>
                        <span style={styles.label}>Join Room</span>
                    </div>

                    <div style={styles.inputWrap(focusField === "join")}>
                        <span style={styles.inputIcon}>#</span>
                        <input
                            style={styles.input}
                            placeholder="Enter Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            onFocus={() => setFocusField("join")}
                            onBlur={() => setFocusField(null)}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        style={styles.button("join", hoverBtn === "join", loading)}
                        onMouseEnter={() => setHoverBtn("join")}
                        onMouseLeave={() => setHoverBtn(null)}
                        onClick={joinRoom}
                        disabled={loading}
                    >
                        {loading ? "Joining..." : "Join Room"}
                    </button>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>{`
                input::placeholder {
                    color: #6b7688;
                }

                @keyframes floatCard {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes bgMove {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(25deg); }
                }

                @keyframes shineMove {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(100%) rotate(25deg); }
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
            `}</style>
        </div>
    );
}

export default Rooms;