import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Generate floating bubble field (signature motif)
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
      position: "relative",
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      color: "#fff",
      background:
        "radial-gradient(circle at 20% 20%, #0a1a3a 0%, transparent 45%)," +
        "radial-gradient(circle at 80% 80%, #020617 0%, transparent 50%)," +
        "linear-gradient(180deg, #000 0%, #020617 60%, #000 100%)",
      padding: "40px 20px 80px",
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

    container: {
      position: "relative",
      zIndex: 2,
      maxWidth: "1100px",
      margin: "0 auto",
      textAlign: "center",
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
      marginBottom: "22px",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(-10px)",
      transition: "all 0.6s ease",
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
      fontSize: "clamp(28px, 5vw, 40px)",
      fontWeight: "800",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.7s ease 0.05s",
    },

    highlight: {
      background: "linear-gradient(90deg,#4adede,#7c9cff,#4adede)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      color: "transparent",
      animation: "shimmerText 4s linear infinite",
      display: "inline-block",
    },

    wave: {
      display: "inline-block",
      animation: "wave 2.4s infinite",
      transformOrigin: "70% 70%",
    },

    subtitle: {
      color: "#9aa4b2",
      marginTop: "10px",
      fontSize: "14px",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.7s ease 0.15s",
    },

    statsRow: {
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      marginTop: "32px",
      flexWrap: "wrap",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.7s ease 0.25s",
    },

    statBlock: {
      textAlign: "center",
    },

    statNum: {
      fontSize: "22px",
      fontWeight: "800",
      background: "linear-gradient(90deg,#4adede,#7c9cff)",
      WebkitBackgroundClip: "text",
      color: "transparent",
    },

    statLabel: {
      fontSize: "11px",
      color: "#7e8aa0",
      marginTop: "2px",
      letterSpacing: "0.03em",
      textTransform: "uppercase",
    },

    divider: {
      width: "1px",
      background:
        "linear-gradient(180deg, transparent, rgba(124,156,255,0.4), transparent)",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "25px",
      marginTop: "50px",
    },

    card: (i, isHover) => ({
      padding: "26px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.04)",
      border: isHover
        ? "1px solid rgba(124,156,255,0.55)"
        : "1px solid rgba(124,156,255,0.25)",
      backdropFilter: "blur(18px)",
      boxShadow: isHover
        ? "0 20px 60px rgba(74,222,222,0.18), 0 0 0 1px rgba(124,156,255,0.15) inset"
        : "0 10px 40px rgba(0,0,0,0.5)",
      textAlign: "left",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.45s cubic-bezier(.2,.8,.2,1), box-shadow 0.45s ease, border 0.3s ease",
      transform: isHover
        ? "translateY(-12px) scale(1.015)"
        : loaded
        ? "translateY(0) scale(1)"
        : "translateY(40px) scale(0.97)",
      opacity: loaded ? 1 : 0,
      transitionDelay: loaded ? "0s" : `${0.15 + i * 0.12}s`,
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
      animation: "shineMove 6s infinite",
      pointerEvents: "none",
    },

    iconBadge: (active) => ({
      width: "46px",
      height: "46px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      marginBottom: "14px",
      background: active
        ? "linear-gradient(135deg, rgba(74,222,222,0.25), rgba(124,156,255,0.25))"
        : "linear-gradient(135deg, rgba(74,222,222,0.12), rgba(124,156,255,0.12))",
      border: "1px solid rgba(124,156,255,0.3)",
      boxShadow: active ? "0 0 24px rgba(74,222,222,0.35)" : "none",
      transition: "all 0.4s ease",
    }),

    cardTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "10px",
    },

    cardText: {
      fontSize: "13px",
      color: "#cbd5e1",
      marginBottom: "10px",
      lineHeight: "1.5",
    },

    list: {
      fontSize: "13px",
      color: "#9aa4b2",
      paddingLeft: "0",
      marginBottom: "15px",
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    listItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    checkIcon: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "rgba(74,222,222,0.15)",
      color: "#4adede",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      flexShrink: 0,
    },

    image: {
      width: "100%",
      height: "170px",
      objectFit: "cover",
      borderRadius: "14px",
      marginBottom: "12px",
      opacity: 0.9,
      transition: "transform 0.6s ease, opacity 0.4s ease",
    },

    imageWrap: {
      borderRadius: "14px",
      overflow: "hidden",
      marginBottom: "12px",
      position: "relative",
    },

    imageOverlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(180deg, transparent 40%, rgba(2,6,23,0.85) 100%)",
    },

    primary: (active) => ({
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(90deg,#4adede,#7c9cff)",
      backgroundSize: "200% auto",
      backgroundPosition: active ? "100% 0" : "0 0",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-position 0.6s ease, transform 0.2s ease, box-shadow 0.3s ease",
      color: "#04111f",
      boxShadow: active ? "0 8px 24px rgba(74,222,222,0.35)" : "none",
      transform: active ? "translateY(-2px)" : "translateY(0)",
    }),

    secondary: (active) => ({
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid #7c9cff",
      background: active ? "rgba(124,156,255,0.12)" : "transparent",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      transform: active ? "translateY(-2px)" : "translateY(0)",
    }),

    logoutWrap: {
      marginTop: "50px",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.7s ease 0.5s",
    },

    logout: (active) => ({
      padding: "13px 34px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(90deg,#ff3b3b,#ff6b6b)",
      backgroundSize: "200% auto",
      backgroundPosition: active ? "100% 0" : "0 0",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-position 0.6s ease, transform 0.25s ease, box-shadow 0.3s ease",
      boxShadow: active
        ? "0 10px 30px rgba(255,59,59,0.35)"
        : "0 4px 14px rgba(255,59,59,0.15)",
      transform: active ? "translateY(-2px)" : "translateY(0)",
    }),
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

      <div style={styles.container}>
        <span style={styles.badge}>
          <span style={styles.pulseDot} />
          DASHBOARD
        </span>

        <h1 style={styles.title}>
          Welcome to <span style={styles.highlight}>CodeMate</span>{" "}
          <span style={styles.wave}>👋</span>
        </h1>
        <p style={styles.subtitle}>
          Your coding workspace for practice, collaboration &amp; interviews
        </p>

        <div style={styles.statsRow}>
          <div style={styles.statBlock}>
            <div style={styles.statNum}>Add</div>
            <div style={styles.statLabel}>DSA Problems</div>
          </div>
          <div style={styles.divider} />
          <div style={styles.statBlock}>
            <div style={styles.statNum}>Live</div>
            <div style={styles.statLabel}>Collab Rooms</div>
          </div>
          <div style={styles.divider} />
          <div style={styles.statBlock}>
            <div style={styles.statNum}>24/7</div>
            <div style={styles.statLabel}>Practice Access</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* PRACTICE */}
          <div
            style={styles.card(0, hoverCard === "practice")}
            onMouseEnter={() => setHoverCard("practice")}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div style={styles.shine} />

            <div style={styles.iconBadge(hoverCard === "practice")}>⚡</div>
            <h2 style={styles.cardTitle}>Practice Arena</h2>
            <p style={styles.cardText}>
              Improve your problem solving with structured DSA practice and
              revision system.
            </p>

            <ul style={styles.list}>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Topic-wise DSA sheets
              </li>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Interview level
                questions
              </li>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Revision sheet system
              </li>
            </ul>

            <div style={styles.imageWrap}>
              <img
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
                style={{
                  ...styles.image,
                  transform:
                    hoverCard === "practice" ? "scale(1.08)" : "scale(1)",
                }}
                alt="practice"
              />
              <div style={styles.imageOverlay} />
            </div>

            <button
              style={styles.primary(hoverCard === "practice")}
              onClick={() => navigate("/practice")}
            >
              Start Practicing →
            </button>
          </div>

          {/* ROOMS */}
          <div
            style={styles.card(1, hoverCard === "rooms")}
            onMouseEnter={() => setHoverCard("rooms")}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div style={styles.shine} />

            <div style={styles.iconBadge(hoverCard === "rooms")}>🤝</div>
            <h2 style={styles.cardTitle}>Collaboration Rooms</h2>
            <p style={styles.cardText}>
              Real-time coding rooms where students solve problems together.
            </p>

            <ul style={styles.list}>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Live coding sessions
              </li>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Peer code review
              </li>
              <li style={styles.listItem}>
                <span style={styles.checkIcon}>✓</span> Group problem solving
              </li>
            </ul>

            <div style={styles.imageWrap}>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                style={{
                  ...styles.image,
                  transform:
                    hoverCard === "rooms" ? "scale(1.08)" : "scale(1)",
                }}
                alt="rooms"
              />
              <div style={styles.imageOverlay} />
            </div>

            <button
              style={styles.secondary(hoverCard === "rooms")}
              onClick={() => navigate("/rooms")}
            >
              Enter Rooms →
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div style={styles.logoutWrap}>
          <button
            style={styles.logout(logoutHover)}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
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

        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        @keyframes floatUp {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.5; }
          100% {
            transform: translate(var(--drift), -110vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;