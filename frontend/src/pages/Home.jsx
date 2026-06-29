import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const texts = [
    "DSA Practice Platform • Collaborative Coding Space",
    "Interview Preparation Hub • Real-world Problem Solving",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const particles = useMemo(
    () =>
      Array.from({ length: 25 }).map(() => ({
        left: Math.random() * 100,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 5,
        size: 3 + Math.random() * 3,
      })),
    []
  );

  useEffect(() => {
    const current = texts[index];

    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setText((prev) => prev + current.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, 40);

      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setIndex((p) => (p + 1) % texts.length);
      }, 1200);

      return () => clearTimeout(t);
    }
}, [charIndex, index, texts]);

  return (
    <div
      style={styles.page}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      {/* ANIMATIONS */}
      <style>{`
        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          10% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }

        @keyframes floatBox {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
          @keyframes floatCard {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}
  .glassCard:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 0 25px rgba(124,156,255,0.25);
}
      `}</style>

      {/* CURSOR GLOW */}
      <div
        style={{
          position: "fixed",
          top: pos.y - 150,
          left: pos.x - 150,
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(124,156,255,0.25), transparent 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* BUBBLES */}
      <div style={styles.particleField}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${p.left}%`,
              width: `${p.size * 10}px`,
              height: `${p.size * 10}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        <div style={styles.brand}>⚡ CodeMate</div>

        <div style={styles.rightNav}>
          <button style={styles.ghost} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={styles.solid} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.heroWrapper}>
        <div style={styles.heroBox}>
          <h1 style={styles.title}>
            Welcome to <span style={styles.highlight}>CodeMate</span>
          </h1>

          <p style={styles.desc}>
            {text} <span style={styles.cursor}>▋</span>
          </p>

          <div style={styles.heroBtns}>
            <button
              style={styles.primary}
              onClick={() => navigate("/login")}
            >
              Start Coding
            </button>

            <button
              style={styles.outline}
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* INFO */}
      {/* INFO SECTION - UPGRADED */}
<div style={styles.infoSection}>
  <h2 style={styles.sectionTitle}>
    What is <span style={styles.gradientText}>CodeMate</span>?
  </h2>

  <p style={styles.sectionDesc}>
    A modern DSA practice & collaboration platform designed to help you think,
    code, and grow like a real engineering team.
  </p>

 <div style={styles.glassGrid}>

  {/* ROW 1 */}
  <div style={{ ...styles.glassCard, animationDelay: "0s" }}>
    <div style={styles.icon}>⚡</div>
    <h3 style={styles.cardTitle}>Real-time Coding</h3>
    <p style={styles.cardText}>
      Code together live like Google Docs for developers. Collaborate in real-time and debug faster as a team.
    </p>
  </div>

  <div style={{ ...styles.glassCard, animationDelay: "0.1s" }}>
    <div style={styles.icon}>🧠</div>
    <h3 style={styles.cardTitle}>DSA Mastery</h3>
    <p style={styles.cardText}>
      Practice structured DSA problems with smart progression and track your interview readiness.
    </p>
  </div>

  <div style={{ ...styles.glassCard, animationDelay: "0.2s" }}>
    <div style={styles.icon}>🤝</div>
    <h3 style={styles.cardTitle}>Collaboration Room</h3>
    <p style={styles.cardText}>
      Join peers in shared coding sessions, review code, and grow with team-based learning.
    </p>
  </div>

  {/* ROW 2 */}
  <div style={{ ...styles.glassCard, animationDelay: "0.3s" }}>
    <div style={styles.icon}>📒</div>
    <h3 style={styles.cardTitle}>Revision Sheet</h3>
    <p style={styles.cardText}>
      Save important problems and create a personal revision sheet for quick interview preparation anytime.
    </p>
  </div>

  <div style={{ ...styles.glassCard, animationDelay: "0.4s" }}>
    <div style={styles.icon}>🧩</div>
    <h3 style={styles.cardTitle}>Practice Room</h3>
    <p style={styles.cardText}>
      A shared environment where all participants solve coding problems together in real-time sessions.
    </p>
  </div>

  <div style={{ ...styles.glassCard, animationDelay: "0.5s" }}>
    <div style={styles.icon}>🚀</div>
    <h3 style={styles.cardTitle}>Placement Ready</h3>
    <p style={styles.cardText}>
      Designed to prepare you for hackathons, placements, and real-world engineering interviews.
    </p>
  </div>

</div>
</div>
    </div>
  );
}

export default Home;

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    color: "#e8ecf4",
    fontFamily: "Inter, sans-serif",
    background:
      "radial-gradient(circle at 20% 20%, #0a1a3a 0%, transparent 45%)," +
      "radial-gradient(circle at 80% 80%, #020617 0%, transparent 50%)," +
      "linear-gradient(180deg, #000 0%, #020617 60%, #000 100%)",
  },
glassGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  maxWidth: "1000px",
  margin: "40px auto 0",
  padding: "0 20px",
},

glassCard: {
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(10, 15, 30, 0.45)",
  border: "1px solid rgba(124,156,255,0.25)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  textAlign: "left",
  transition: "0.3s ease",
  cursor: "pointer",
  animation: "floatCard 6s ease-in-out infinite",
  position: "relative",
  overflow: "hidden",
},

icon: {
  fontSize: "26px",
  marginBottom: "10px",
},

cardTitle: {
  fontSize: "16px",
  fontWeight: "700",
  marginBottom: "6px",
},

cardText: {
  fontSize: "13px",
  color: "#9aa4b2",
  lineHeight: "1.5",
},
  particleField: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },

  particle: {
    position: "absolute",
    bottom: "-150px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124,156,255,0.9), rgba(74,222,222,0.2), transparent)",
    boxShadow: "0 0 20px rgba(124,156,255,0.25)",
    animation: "bubbleFloat linear infinite",
    opacity: 0.6,
  },

  nav: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
  },

  brand: {
    fontWeight: "700",
    fontSize: "18px",
  },

  rightNav: {
    display: "flex",
    gap: "12px",
  },

  heroWrapper: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    justifyContent: "center",
    marginTop: "80px",
  },

  heroBox: {
    width: "90%",
    maxWidth: "780px",
    textAlign: "center",
    padding: "60px 50px",
    background: "rgba(10, 15, 30, 0.35)",
    border: "1px solid rgba(124,156,255,0.18)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    animation: "floatBox 6s ease-in-out infinite",
  },

  title: {
    fontSize: "52px",
    fontWeight: "700",
  },

  highlight: {
    background: "linear-gradient(90deg,#4adede,#7c9cff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  desc: {
    marginTop: "12px",
    color: "#9aa4b2",
  },

  cursor: {
    animation: "blink 1s infinite",
  },

  heroBtns: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },

  solid: {
    background: "#7c9cff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  ghost: {
    background: "transparent",
    border: "1px solid #2a3550",
    padding: "10px 18px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  primary: {
    background: "#4adede",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  outline: {
    background: "transparent",
    border: "1px solid #7c9cff",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
  },

  infoSection: {
    textAlign: "center",
    padding: "60px 20px",
  },

  sectionTitle: {
    fontSize: "32px",
    fontWeight: "800",
  },

  sectionDesc: {
    maxWidth: "700px",
    margin: "10px auto",
    color: "#9aa4b2",
  },

  gradientText: {
    background: "linear-gradient(90deg,#4adede,#7c9cff,#a855f7)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  featureGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginTop: "30px",
  maxWidth: "650px",
  marginLeft: "auto",
  marginRight: "auto",
},

  featureCard: {
  padding: "12px 14px",
  background: "rgba(10, 15, 30, 0.55)",
  border: "1px solid rgba(124,156,255,0.25)",
  borderRadius: "14px",
  fontSize: "13px",
  textAlign: "left",
  transition: "0.3s",
},
};